/* eslint no-sync:0 */

// Import
import { join } from 'path'
import { readFileSync } from 'fs'
import { equal } from 'assert-helpers'
import kava from 'kava'
import { isText, isBinary, getEncoding } from './index.js'

// Paths
import filedirname from 'filedirname'
const [file, dir] = filedirname()
const fixturesPath = join(dir, '..', 'test-fixtures')

// Tests
const tests = [
	{
		filename: file,
		text: true,
		binary: false,
		encoding: 'utf8',
	},
	{
		filename: join(fixturesPath, 'image.jpg'),
		text: false,
		binary: true,
		encoding: 'binary',
	},
	{
		filename: join(fixturesPath, 'issue9.wxml'),
		text: true,
		binary: false,
		encoding: 'utf8',
	},
	{
		filename: join(fixturesPath, 'jpg_disguised_as.txt'),
		text: true, // fails extension detection
		binary: false, // fails extension detection
		encoding: 'binary',
	},
	{
		filename: join(fixturesPath, 'jpg_right_to_left.jpg.txt.unknown'),
		text: true,
		binary: false,
		encoding: 'binary',
	},
	{
		filename: join(fixturesPath, 'jpg_no_extension'),
		text: false,
		binary: true,
		encoding: 'binary',
	},
	{
		filename: join(fixturesPath, 'txt_disguised_as.jpg'),
		text: false, // fails extension detection
		binary: true, // fails extension detection
		encoding: 'utf8',
	},
	{
		filename: join(fixturesPath, 'txt_right_to_left.txt.jpg.unknown'),
		text: false,
		binary: true,
		encoding: 'utf8',
	},
	{
		filename: join(fixturesPath, 'txt_no_extension'),
		text: true,
		binary: false,
		encoding: 'utf8',
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
	tests.forEach(function ({ filename, text, binary, encoding }) {
		test(String(filename), function () {
			const buffer = filename ? readFileSync(filename) : null
			// text
			equal(isText(filename, buffer), text, 'isText')

			// binary
			equal(isBinary(filename, buffer), binary, 'isBinary')

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
