/* eslint no-sync:0 */

// Import
const {join} = require('path')
const {readFileSync} = require('fs')
const {equal} = require('assert-helpers')
const joe = require('joe')
const isTextOrBinary = require('../')

// Paths
const fixturesPath = join(__dirname, '..', 'test-fixtures')

// Tests
joe.suite('istextorbinary', function (suite, test) {
	test('should detect this is a text file', function () {
		equal(
			isTextOrBinary.isTextSync(__filename),
			true
		)
	})

	test('should detect a text file based on buffer', function () {
		const filename = join(fixturesPath, 'some_file_without_extension')
		const buffer = readFileSync(filename)
		equal(
			isTextOrBinary.isTextSync(filename, buffer),
			true
		)
	})

	test('should detect "jpg.unusual_extension" as binary, even if it is really text', function () {
		const filename = join(fixturesPath, 'jpg.unusual_extension')
		const buffer = readFileSync(filename)
		equal(
			isTextOrBinary.isBinarySync(filename, buffer),
			true
		)
		equal(
			isTextOrBinary.isTextSync(filename, buffer),
			false
		)
	})

	test('should detect that a jpg is binary', function () {
		const filename = join(fixturesPath, 'penguin.jpg')
		equal(
			isTextOrBinary.isBinarySync(filename),
			true
		)
		equal(
			isTextOrBinary.isTextSync(filename),
			false
		)
	})

	test('should detect "txt.penguin" as binary, even if it is really a jpg', function () {
		const filename = join(fixturesPath, 'txt.penguin')
		const buffer = readFileSync(filename)
		equal(
			isTextOrBinary.isTextSync(filename, buffer),
			true
		)
		equal(
			isTextOrBinary.isBinarySync(filename, buffer),
			false
		)
	})

})
