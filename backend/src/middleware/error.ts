import type { NextFunction, Request, Response } from 'express'
import { Logger } from '../logger'

const log = new Logger('errors')

export class HttpError extends Error {
	statusCode: number
	constructor(statusCode: number, message: string) {
		super(message)
		this.statusCode = statusCode
	}
}

export function notFoundHandler(req: Request, res: Response) {
	res.status(404).json({ error: 'not_found', message: 'Resource not found' })
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
	const requestId = (req as any).requestId as string | undefined
	if (err instanceof HttpError) {
		log.warn('http_error', { requestId, statusCode: err.statusCode, message: err.message })
		return res.status(err.statusCode).json({ error: 'http_error', message: err.message })
	}
	const message = err instanceof Error ? err.message : 'Unknown error'
	log.error('unhandled_error', { requestId, message })
	res.status(500).json({ error: 'internal_error', message: 'Something went wrong' })
} 