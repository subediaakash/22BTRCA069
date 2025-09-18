import { Router, type Request, type Response, type NextFunction } from 'express'
import { prisma } from '../db/prisma'
import { HttpError } from '../middleware/error'

export const redirectRouter = Router()

redirectRouter.get('/:shortcode', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { shortcode } = req.params
		const record = await prisma.shortUrl.findUnique({ where: { shortcode } })
		if (!record) throw new HttpError(404, 'Shortcode not found')
		if (record.expiresAt.getTime() < Date.now()) throw new HttpError(410, 'Short link has expired')

		await prisma.click.create({
			data: {
				shortUrlId: record.id,
				referrer: req.get('referer') || null,
				userAgent: req.get('user-agent') || null,
				ip: req.ip || null,
				country: null // placeholder; can be filled by geo lookup/redis later
			}
		})

		res.redirect(302, record.originalUrl)
	} catch (err) {
		next(err)
	}
}) 