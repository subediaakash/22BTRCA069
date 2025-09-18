import { randomUUID } from 'node:crypto'
import { promises as fs } from 'node:fs'
import { resolve, join } from 'node:path'

export type LogContext = {
	requestId?: string
	[extra: string]: unknown
}

const logDir = process.env.LOG_DIR ? resolve(process.env.LOG_DIR) : resolve(process.cwd(), 'logs')
let didEnsureDir = false

async function ensureLogDir() {
	if (didEnsureDir) return
	await fs.mkdir(logDir, { recursive: true }).catch(() => {})
	didEnsureDir = true
}

function currentLogFilePath(date = new Date()) {
	const ymd = date.toISOString().slice(0, 10) // YYYY-MM-DD
	return join(logDir, `app-${ymd}.log`)
}

async function appendLog(line: string) {
	try {
		await ensureLogDir()
		await fs.appendFile(currentLogFilePath(), line + '\n', { encoding: 'utf8' })
	} catch (err) {
		// Fallback: if file writing fails, output to stderr to avoid dropping logs
		try { console.error(line) } catch {}
	}
}

export class Logger {
	constructor(private readonly name: string) {}

	private format(level: string, message: string, context?: LogContext) {
		const base = { ts: new Date().toISOString(), level, name: this.name }
		const ctx = context ? { ...context } : {}
		return JSON.stringify({ ...base, message, ...ctx })
	}

	info(message: string, context?: LogContext) {
		void appendLog(this.format('info', message, context))
	}
	warn(message: string, context?: LogContext) {
		void appendLog(this.format('warn', message, context))
	}
	error(message: string, context?: LogContext) {
		void appendLog(this.format('error', message, context))
	}
}

export const createRequestId = () => randomUUID() 