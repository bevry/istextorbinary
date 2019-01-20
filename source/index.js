/* eslint no-use-before-define:0 */
'use strict'

// Import
const pathUtil = require('path')
const textExtensions = require('textextensions')
const binaryExtensions = require('binaryextensions')

/**
 * @typedef {'utf8'|'binary'} EncodingResult
 */

/**
 * @typedef {Object} EncodingOpts
 * @property {number} [chunkLength = 24]
 * @property {number} [chunkBegin = 0]
 */

/**
 * @callback IsTextCallback
 * @param {Error?} error
 * @param {boolean} [result]
 */

/**
 * @callback IsBinaryCallback
 * @param {Error?} error
 * @param {boolean} [result]
 */

/**
 * @callback GetEncodingCallback
 * @param {Error?} error
 * @param {EncodingResult} [encoding]
 */

/**
 * Determine if the filename and/or buffer is text.
 * Determined by extension checks first (if filename is available), otherwise if unknown extension or no filename, will perform a slower buffer encoding detection.
 * This order is done, as extension checks are quicker, and also because encoding checks cannot guarantee accuracy for chars between utf8 and utf16.
 * The extension checks are performed using the resources https://github.com/bevry/textextensions and https://github.com/bevry/binaryextensions
 * @param {string} [filename] The filename for the file/buffer if available
 * @param {Buffer} [buffer] The buffer for the file if available
 * @returns {boolean}
 */
function isTextSync(filename, buffer) {
	// Prepare
	let isText = null

	// Test extensions
	if (filename) {
		// Extract filename
		const parts = pathUtil
			.basename(filename)
			.split('.')
			.reverse()

		// Cycle extensions
		for (const extension of parts) {
			if (textExtensions.indexOf(extension) !== -1) {
				isText = true
				break
			}
			if (binaryExtensions.indexOf(extension) !== -1) {
				isText = false
				break
			}
		}
	}

	// Fallback to encoding if extension check was not enough
	if (buffer && isText === null) {
		isText = getEncodingSync(buffer) === 'utf8'
	}

	// Return our result
	return isText
}

/**
 * Determine if the filename and/or buffer is text.
 * Uses {@link isTextSync} behind the scenes.
 * @param {string?} filename Forwarded to `isTextSync`
 * @param {Buffer?} buffer Forwarded to `isTextSync`
 * @param {IsTextCallback} next
 * @returns {void}
 */
function isText(filename, buffer, next) {
	let result
	try {
		result = isTextSync(filename, buffer)
	} catch (err) {
		next(err)
	}
	next(null, result)
}

/**
 * Determine if the filename and/or buffer is binary.
 * Uses {@link isTextSync} behind the scenes.
 * @param {string} [filename] Forwarded to `isTextSync`
 * @param {Buffer} [buffer] Forwarded to `isTextSync`
 * @returns {boolean}
 */
function isBinarySync(filename, buffer) {
	// Handle
	const result = isTextSync(filename, buffer)
	return !result
}

/**
 * Determine if the filename and/or buffer is binary.
 * Uses {@link isTextSync} behind the scenes.
 * @param {string?} filename Forwarded to `isText`
 * @param {Buffer?} buffer Forwarded to `isText`
 * @param {IsBinaryCallback} next
 * @returns {void}
 */
function isBinary(filename, buffer, next) {
	let result
	try {
		result = isTextSync(filename, buffer)
	} catch (err) {
		next(err)
	}
	next(null, !result)
}

/**
 * Get the encoding of a buffer.
 * We fetch a bunch chars from the start, middle and end of the buffer.
 * We check all three, as doing only start was not enough, and doing only middle was not enough, so better safe than sorry.
 * @param {Buffer} buffer
 * @param {EncodingOpts} [opts]
 * @returns {EncodingResult}
 */
function getEncodingSync(buffer, opts) {
	// Prepare
	const textEncoding = 'utf8'
	const binaryEncoding = 'binary'

	// Discover
	if (opts == null) {
		// Start
		const chunkLength = 24
		let encoding = getEncodingSync(buffer, { chunkLength })
		if (encoding === textEncoding) {
			// Middle
			let chunkBegin = Math.max(0, Math.floor(buffer.length / 2) - chunkLength)
			encoding = getEncodingSync(buffer, { chunkLength, chunkBegin })
			if (encoding === textEncoding) {
				// End
				chunkBegin = Math.max(0, buffer.length - chunkLength)
				encoding = getEncodingSync(buffer, { chunkLength, chunkBegin })
			}
		}

		// Return
		return encoding
	} else {
		// Extract
		const { chunkLength = 24, chunkBegin = 0 } = opts
		const chunkEnd = Math.min(buffer.length, chunkBegin + chunkLength)
		const contentChunkUTF8 = buffer.toString(textEncoding, chunkBegin, chunkEnd)

		// Detect encoding
		for (let i = 0; i < contentChunkUTF8.length; ++i) {
			const charCode = contentChunkUTF8.charCodeAt(i)
			if (charCode === 65533 || charCode <= 8) {
				// 8 and below are control characters (e.g. backspace, null, eof, etc.)
				// 65533 is the unknown character
				// console.log(charCode, contentChunkUTF8[i])
				return binaryEncoding
			}
		}

		// Return
		return textEncoding
	}
}

/**
 * Get the encoding of a buffer.
 * Uses {@link getEncodingSync} behind the scenes.
 * @param {Buffer} buffer Forwarded to `getEncodingSync`
 * @param {EncodingOpts} opts Forwarded to `getEncodingSync`
 * @param {GetEncodingCallback} next
 * @returns {void}
 */
function getEncoding(buffer, opts, next) {
	/** @type {EncodingResult?} */
	let result
	try {
		result = getEncodingSync(buffer, opts)
	} catch (err) {
		next(err)
	}
	next(null, result)
}

// Export
module.exports = {
	isTextSync,
	isText,
	isBinarySync,
	isBinary,
	getEncodingSync,
	getEncoding
}
