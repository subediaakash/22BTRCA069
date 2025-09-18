import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		log: [{ emit: 'stdout', level: 'error' }, { emit: 'stdout', level: 'warn' }]
	})

if (!globalForPrisma.prisma) globalForPrisma.prisma = prisma 