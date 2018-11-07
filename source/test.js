/* eslint no-sync:0 */
'use strict'

// Import
const { join } = require('path')
const { readFileSync } = require('fs')
const { equal } = require('assert-helpers')
const joe = require('joe')
const isTextOrBinary = require('../')

// Paths
const fixturesPath = join(__dirname, '..', 'test-fixtures')

// Tests
joe.suite('istextorbinary', function (suite, test) {
	test('should detect this is a text file', function () {
		equal(
			isTextOrBinary.isTextSync(__filename),
			true,
			'should be text'
		)
	})

	test('should detect a text file based on buffer', function () {
		const filename = join(fixturesPath, 'some_file_without_extension')
		const buffer = readFileSync(filename)
		equal(
			isTextOrBinary.isTextSync(filename, buffer),
			true,
			'should be text'
		)
	})

	test('should detect wxml as text due to extension check, despite false flag from encoding check', function () {
		const filename = join(fixturesPath, 'issue9.wxml')
		const buffer = readFileSync(filename)
		equal(
			isTextOrBinary.isTextSync(filename, buffer),
			true,
			'should be text'
		)
		equal(
			isTextOrBinary.isBinarySync(filename, buffer),
			false,
			'should not be binary'
		)
	})

	test('should detect "jpg.unusual_extension" as binary, even if it is really text', function () {
		const filename = join(fixturesPath, 'jpg.unusual_extension')
		const buffer = readFileSync(filename)
		equal(
			isTextOrBinary.isTextSync(filename, buffer),
			false,
			'should not be text'
		)
		equal(
			isTextOrBinary.isBinarySync(filename, buffer),
			true,
			'should be binary'
		)
	})

	test('should detect that a jpg is binary', function () {
		const filename = join(fixturesPath, 'penguin.jpg')
		equal(
			isTextOrBinary.isTextSync(filename),
			false,
			'should not be text'
		)
		equal(
			isTextOrBinary.isBinarySync(filename),
			true,
			'should be binary'
		)
	})

	test('should detect "txt.penguin" as binary, even if it is really a jpg', function () {
		const filename = join(fixturesPath, 'txt.penguin')
		const buffer = readFileSync(filename)
		equal(
			isTextOrBinary.isTextSync(filename, buffer),
			true,
			'should be text'
		)
		equal(
			isTextOrBinary.isBinarySync(filename, buffer),
			false,
			'should not be binary'
		)
	})

})
