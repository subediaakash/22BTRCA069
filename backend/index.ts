
import express from 'express'
import type { Request,Response } from 'express'
import 'dotenv/config'
import { requestLogger } from './src/middleware/logging'
import { errorHandler, notFoundHandler } from './src/middleware/error'
import { shortUrlsRouter } from './src/routes/shorturls'
import { redirectRouter } from './src/routes/redirect'
import { Logger } from './src/logger'

const app = express()
const bootLogger = new Logger('bootstrap')

app.use(express.json())
app.use(requestLogger)

app.get('/health', (_req:Request, res:Response) => {
	res.json({ status: 'ok', ts: new Date().toISOString() })
})

app.use('/shorturls', shortUrlsRouter)
app.use('/', redirectRouter)

app.use(notFoundHandler)
app.use(errorHandler)

const port = Number(process.env.PORT || 3000)
app.listen(port, () => {
	bootLogger.info('server_started', { port })
	console.log("Server listening in the port", port)
})