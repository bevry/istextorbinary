/* eslint no-use-before-define:0 */

// Import
import type Buffer from 'buffer'
import * as pathUtil from 'path'
import textExtensions from 'textextensions'
import binaryExtensions from 'binaryextensions'

export interface EncodingOpts {
	/** Defaults to 24 */
	chunkLength?: number

	/** If not provided, will check the start, beginning, and end */
	chunkBegin?: number
}

/**
 * Determine if the filename and/or buffer is text.
 * Determined by extension checks first (if filename is available), otherwise if unknown extension or no filename, will perform a slower buffer encoding detection.
 * This order is done, as extension checks are quicker, and also because encoding checks cannot guarantee accuracy for chars between utf8 and utf16.
 * The extension checks are performed using the resources https://github.com/bevry/textextensions and https://github.com/bevry/binaryextensions
 *
 * WARNING: in a browser, path detection is only reliable for POSIX paths (regardless of the underlying OS), depending on your bundler.
 *
 * @param filename The filename for the file/buffer if available
 * @param buffer The buffer for the file if available
 * @returns Will be `null` if neither `filename` nor `buffer` were provided. Otherwise will be a boolean value with the detection result.
 */
export function isText(
	filename?: string | null,
	buffer?: Uint8Array | null
): boolean | null {
	// Test extensions
	if (filename) {
		// Extract filename
		const parts = pathUtil.basename(filename).split('.').reverse()

		// Remove the filename proper
		parts.pop()

		// Cycle extensions
		for (const extension of parts) {
			if (textExtensions.indexOf(extension) !== -1) {
				return true
			}
			if (binaryExtensions.indexOf(extension) !== -1) {
				return false
			}
		}
	}

	// Fallback to encoding if extension check was not enough
	if (buffer) {
		return getEncoding(buffer) === 'utf8'
	}

	// No buffer was provided
	return null
}

/**
 * Determine if the filename and/or buffer is binary.
 * Determined by extension checks first (if filename is available), otherwise if unknown extension or no filename, will perform a slower buffer encoding detection.
 * This order is done, as extension checks are quicker, and also because encoding checks cannot guarantee accuracy for chars between utf8 and utf16.
 * The extension checks are performed using the resources https://github.com/bevry/textextensions and https://github.com/bevry/binaryextensions
 * @param filename The filename for the file/buffer if available
 * @param buffer The buffer for the file if available
 * @returns Will be `null` if neither `filename` nor `buffer` were provided. Otherwise will be a boolean value with the detection result.
 */
export function isBinary(filename?: string | null, buffer?: Buffer | null) {
	const text = isText(filename, buffer)
	if (text == null) return null
	return !text
}

/**
 * Get the encoding of a buffer.
 * Checks the start, middle, and end of the buffer for characters that are unrecognized within UTF8 encoding.
 * History has shown that inspection at all three locations is necessary.
 * @returns Will be `null` if `buffer` was not provided. Otherwise will be either `'utf8'` or `'binary'`
 */
export function getEncoding(
	buffer: Uint8Array | null,
	opts?: EncodingOpts
): 'utf8' | 'binary' | null {
	// Check
	if (!buffer) return null

	// Prepare
	const textEncoding = 'utf8'
	const binaryEncoding = 'binary'
	const chunkLength = opts?.chunkLength ?? 24
	let chunkBegin = opts?.chunkBegin ?? 0

	// Discover
	if (opts?.chunkBegin == null) {
		// Start
		let encoding = getEncoding(buffer, { chunkLength, chunkBegin })
		if (encoding === textEncoding) {
			// Middle
			chunkBegin = Math.max(0, Math.floor(buffer.length / 2) - chunkLength)
			encoding = getEncoding(buffer, {
				chunkLength,
				chunkBegin,
			})
			if (encoding === textEncoding) {
				// End
				chunkBegin = Math.max(0, buffer.length - chunkLength)
				encoding = getEncoding(buffer, {
					chunkLength,
					chunkBegin,
				})
			}
		}

		// Return
		return encoding
	} else {
		// Extract
		chunkBegin = getChunkBegin(buffer, chunkBegin)
		if (chunkBegin === -1) {
			return binaryEncoding
		}

		const chunkEnd = getChunkEnd(
			buffer,
			Math.min(buffer.length, chunkBegin + chunkLength)
		)

		if (chunkEnd > buffer.length) {
			return binaryEncoding
		}

		if (!isValidUTF8TextualData(buffer, chunkBegin, chunkEnd)) {
			return binaryEncoding
		}

		// Return
		return textEncoding
	}
}

function isValidUTF8TextualData(
	buf: Uint8Array,
	chunkBegin: number,
	chunkEnd: number
) {
	let expecting: number | null = null

	for (let i = chunkBegin; i < chunkEnd; i++) {
		const byte = buf[i]

		if (expecting === null) {
			if (isSingleByteChar(byte)) {
				if (byte <= 8) {
					return false
				}
			} else if (isFirstByteOf2ByteChar(byte)) {
				expecting = 1
			} else if (isFirstByteOf3ByteChar(byte)) {
				expecting = 2
			} else if (isFirstByteOf4ByteChar(byte)) {
				expecting = 3
			} else {
				return false
			}
		} else {
			if (!isLaterByteOfUtf8(byte)) {
				return false
			}

			if (expecting === 1) {
				expecting = null
			} else {
				expecting -= 1
			}
		}
	}

	return true
}

// ====================================
// The functions below are created to handle multibyte utf8 characters.
// To understand how the encoding works, check this article: https://en.wikipedia.org/wiki/UTF-8#Encoding
// @todo add documentation for these

function getChunkBegin(buf: Uint8Array, chunkBegin: number) {
	// If it's the beginning, just return.
	if (chunkBegin === 0) {
		return 0
	}

	if (!isLaterByteOfUtf8(buf[chunkBegin])) {
		return chunkBegin
	}

	let begin = chunkBegin - 3

	if (begin >= 0) {
		if (isFirstByteOf4ByteChar(buf[begin])) {
			return begin
		}
	}

	begin = chunkBegin - 2

	if (begin >= 0) {
		if (
			isFirstByteOf4ByteChar(buf[begin]) ||
			isFirstByteOf3ByteChar(buf[begin])
		) {
			return begin
		}
	}

	begin = chunkBegin - 1

	if (begin >= 0) {
		// Is it a 4-byte, 3-byte utf8 character?
		if (
			isFirstByteOf4ByteChar(buf[begin]) ||
			isFirstByteOf3ByteChar(buf[begin]) ||
			isFirstByteOf2ByteChar(buf[begin])
		) {
			return begin
		}
	}

	return -1
}

function getChunkEnd(buf: Uint8Array, chunkEnd: number) {
	// If it's the end, just return.
	if (chunkEnd === buf.length) {
		return chunkEnd
	}

	let index = chunkEnd - 3

	if (index >= 0) {
		if (isFirstByteOf4ByteChar(buf[index])) {
			return chunkEnd + 1
		}
	}

	index = chunkEnd - 2

	if (index >= 0) {
		if (isFirstByteOf4ByteChar(buf[index])) {
			return chunkEnd + 2
		}

		if (isFirstByteOf3ByteChar(buf[index])) {
			return chunkEnd + 1
		}
	}

	index = chunkEnd - 1

	if (index >= 0) {
		if (isFirstByteOf4ByteChar(buf[index])) {
			return chunkEnd + 3
		}

		if (isFirstByteOf3ByteChar(buf[index])) {
			return chunkEnd + 2
		}

		if (isFirstByteOf2ByteChar(buf[index])) {
			return chunkEnd + 1
		}
	}

	return chunkEnd
}

function isFirstByteOf4ByteChar(byte: number) {
	// eslint-disable-next-line no-bitwise
	return byte >> 3 === 30 // 11110xxx?
}

function isFirstByteOf3ByteChar(byte: number) {
	// eslint-disable-next-line no-bitwise
	return byte >> 4 === 14 // 1110xxxx?
}

function isFirstByteOf2ByteChar(byte: number) {
	// eslint-disable-next-line no-bitwise
	return byte >> 5 === 6 // 110xxxxx?
}

function isLaterByteOfUtf8(byte: number) {
	// eslint-disable-next-line no-bitwise
	return byte >> 6 === 2 // 10xxxxxx?
}

function isSingleByteChar(byte: number) {
	// eslint-disable-next-line no-bitwise
	return byte >> 7 === 0 // 0xxxxxxx?
}
