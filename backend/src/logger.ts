import { randomUUID } from 'node:crypto'

export type LogContext = {
	requestId?: string
	[extra: string]: unknown
}

export class Logger {
	constructor(private readonly name: string) {}

	private format(level: string, message: string, context?: LogContext) {
		const base = { ts: new Date().toISOString(), level, name: this.name }
		const ctx = context ? { ...context } : {}
		return JSON.stringify({ ...base, message, ...ctx })
	}

	info(message: string, context?: LogContext) {
		console.log(this.format('info', message, context))
	}
	warn(message: string, context?: LogContext) {
		console.warn(this.format('warn', message, context))
	}
	error(message: string, context?: LogContext) {
		console.error(this.format('error', message, context))
	}
}

export const createRequestId = () => randomUUID() 