/* eslint no-sync:0 */

// us
import { isText, isBinary, getEncoding } from './index.js'

// external
import { equal } from 'assert-helpers'
import kava from 'kava'

// builtin
import { readFileSync } from 'fs'

// paths
import { join } from 'path'
import filedirname from 'filedirname'
const [file, dir] = filedirname()
const fixturesPath = join(dir, '..', 'test-fixtures')

// fixtures
const tests = [
	{
		filename: 'utf8.txt',
		text: true,
		binary: false,
		encoding: 'utf8',
	},
	{
		filename: 'image.jpg',
		text: false,
		binary: true,
		encoding: 'binary',
	},
	{
		filename: 'issue9.wxml',
		text: true,
		binary: false,
		encoding: 'utf8',
	},
	{
		filename: 'jpg_disguised_as.txt',
		text: true, // fails extension detection
		binary: false, // fails extension detection
		encoding: 'binary',
	},
	{
		filename: 'jpg_right_to_left.jpg.txt.unknown',
		text: true,
		binary: false,
		encoding: 'binary',
	},
	{
		filename: 'jpg_no_extension',
		text: false,
		binary: true,
		encoding: 'binary',
	},
	{
		filename: 'txt_disguised_as.jpg',
		text: false, // fails extension detection
		binary: true, // fails extension detection
		encoding: 'utf8',
	},
	{
		filename: 'txt_right_to_left.txt.jpg.unknown',
		text: false,
		binary: true,
		encoding: 'utf8',
	},
	{
		filename: 'txt_no_extension',
		text: true,
		binary: false,
		encoding: 'utf8',
	},
	{
		filename: 'jpg.unknown_text_ext',
		contents: 'txt_no_extension',
		text: true,
		binary: false,
		encoding: 'utf8',
	},
	{
		filename: 'txt.unknown_binary_ext',
		contents: 'jpg_no_extension',
		text: false,
		binary: true,
		encoding: 'binary',
	},
	{
		filename: null,
		text: null,
		binary: null,
		encoding: null,
	},
]

const multibyteUtf8 = [
	// 1. When there's problem in the chunkEnd
	// * 2 bytes
	'12345678901234567890123Ф',
	// * 3 bytes
	'12345678901234567890123안',
	'1234567890123456789012안',
	// * 4 bytes
	'12345678901234567890123😀',
	'1234567890123456789012😀',
	'123456789012345678901😀',
	// 2. When there's a problem in the chunkBegin
	// * 2 bytes
	'dummyФ12345678901234567890123',
	// * 3 bytes
	'dummy안12345678901234567890123',
	'dummy안1234567890123456789012',
	// * 4 bytes
	'dummy😀12345678901234567890123',
	'dummy😀1234567890123456789012',
	'dummy😀123456789012345678901',
]

// Tests
kava.suite('istextorbinary', function (suite, test) {
	tests.forEach(function (testCase) {
		const { filename, text, binary, encoding } = testCase
		const contents = 'contents' in testCase ? testCase.contents : null

		test(String(filename), function () {
			const fullPath = filename ? join(fixturesPath, filename) : null
			const contentsPath = contents ? join(fixturesPath, contents) : fullPath
			const buffer = contentsPath ? readFileSync(contentsPath) : null

			// text
			equal(isText(fullPath, buffer), text, 'isText')

			// binary
			equal(isBinary(fullPath, buffer), binary, 'isBinary')

			// encoding
			equal(getEncoding(buffer), encoding, 'getEncoding')
		})
	})

	multibyteUtf8.forEach(function (str) {
		test(str, function () {
			equal(getEncoding(Buffer.from(str)), 'utf8')
		})
	})
})
