import { customAlphabet } from 'nanoid'

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const generate = customAlphabet(alphabet, 7)

export function generateShortcode() {
	return generate()
}

export function isValidShortcode(input: string) {
	return /^[0-9a-zA-Z]{3,32}$/.test(input)
} 