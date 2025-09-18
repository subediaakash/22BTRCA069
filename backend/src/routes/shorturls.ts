import { Router, type Request, type Response, type NextFunction } from 'express'
import { prisma } from '../db/prisma'
import { HttpError } from '../middleware/error'
import { generateShortcode, isValidShortcode } from '../utils/shortcode'

export const shortUrlsRouter = Router()

type ClickRow = {
	clickedAt: Date
	referrer: string | null
	userAgent: string | null
	ip: string | null
	country: string | null
}

shortUrlsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { url, validity, shortcode } = req.body ?? {}
		if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
			throw new HttpError(400, 'Invalid or missing url')
		}

		const validityMinutes = typeof validity === 'number' && Number.isFinite(validity) ? Math.max(1, Math.floor(validity)) : 30
		let desired = typeof shortcode === 'string' && shortcode.length > 0 ? shortcode : undefined
		if (desired && !isValidShortcode(desired)) throw new HttpError(400, 'Invalid shortcode format')

		if (desired) {
			const exists = await prisma.shortUrl.findUnique({ where: { shortcode: desired } })
			if (exists) throw new HttpError(409, 'Shortcode already in use')
		} else {
			// generate unique shortcode
			for (let i = 0; i < 5; i++) {
				const candidate = generateShortcode()
				const exists = await prisma.shortUrl.findUnique({ where: { shortcode: candidate } })
				if (!exists) {
					desired = candidate
					break
				}
			}
			if (!desired) throw new HttpError(500, 'Failed to generate shortcode')
		}

		const expiresAt = new Date(Date.now() + validityMinutes * 60 * 1000)
		const created = await prisma.shortUrl.create({
			data: { shortcode: desired!, originalUrl: url, expiresAt }
		})

		const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`
		res.status(201).json({ shortLink: `${baseUrl}/${created.shortcode}`, expiry: created.expiresAt.toISOString() })
	} catch (err) {
		next(err)
	}
})

// GET /shorturls/:shortcode (stats)
shortUrlsRouter.get('/:shortcode', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { shortcode } = req.params
		const record = await prisma.shortUrl.findUnique({
			where: { shortcode },
			include: { clicks: { orderBy: { clickedAt: 'desc' } } }
		})
		if (!record) throw new HttpError(404, 'Shortcode not found')

		const totalClicks = record.clicks.length
		const details = (record.clicks as ClickRow[]).map((c: ClickRow) => ({
			timestamp: c.clickedAt.toISOString(),
			referer: c.referrer,
			userAgent: c.userAgent,
			ip: c.ip,
			country: c.country
		}))

		res.json({
			shortcode: record.shortcode,
			originalUrl: record.originalUrl,
			createdAt: record.createdAt.toISOString(),
			expiry: record.expiresAt.toISOString(),
			totalClicks,
			clicks: details
		})
	} catch (err) {
		next(err)
	}
}) 