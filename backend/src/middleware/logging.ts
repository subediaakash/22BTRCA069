import type { Request, Response, NextFunction } from 'express'
import { Logger, createRequestId } from '../logger'

const baseLogger = new Logger('http')

export function requestLogger(req: Request, res: Response, next: NextFunction) {
	const start = Date.now()
	const requestId = req.headers['x-request-id']?.toString() || createRequestId()
	;(req as any).requestId = requestId
	res.setHeader('x-request-id', requestId)

	baseLogger.info('incoming_request', {
		requestId,
		method: req.method,
		path: req.path,
		ip: req.ip
	})

	res.on('finish', () => {
		const durationMs = Date.now() - start
		baseLogger.info('request_completed', {
			requestId,
			statusCode: res.statusCode,
			durationMs
		})
	})

	next()
} 