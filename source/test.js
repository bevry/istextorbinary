/* eslint no-sync:0 */
'use strict'

// Import
const { join } = require('path')
const { readFileSync } = require('fs')
const { equal } = require('assert-helpers')
const kava = require('kava')
const isTextOrBinary = require('./')

// Paths
const fixturesPath = join(__dirname, '..', 'test-fixtures')

// Tests
const tests = [
	{
		filename: __filename,
		text: true,
		binary: false,
		encoding: 'utf8'
	},
	{
		filename: join(fixturesPath, 'image.jpg'),
		text: false,
		binary: true,
		encoding: 'binary'
	},
	{
		filename: join(fixturesPath, 'issue9.wxml'),
		text: true,
		binary: false,
		encoding: 'binary' // fails encoding detection
	},
	{
		filename: join(fixturesPath, 'jpg_disguised_as.txt'),
		text: true, // fails extension detection
		binary: false, // fails extension detection
		encoding: 'binary'
	},
	{
		filename: join(fixturesPath, 'jpg_right_to_left.jpg.txt.unknown'),
		text: true,
		binary: false,
		encoding: 'binary'
	},
	{
		filename: join(fixturesPath, 'jpg_no_extension'),
		text: false,
		binary: true,
		encoding: 'binary'
	},
	{
		filename: join(fixturesPath, 'txt_disguised_as.jpg'),
		text: false, // fails extension detection
		binary: true, // fails extension detection
		encoding: 'utf8'
	},
	{
		filename: join(fixturesPath, 'txt_right_to_left.txt.jpg.unknown'),
		text: false,
		binary: true,
		encoding: 'utf8'
	},
	{
		filename: join(fixturesPath, 'txt_no_extension'),
		text: true,
		binary: false,
		encoding: 'utf8'
	},
	{
		filename: null,
		text: null,
		binary: null,
		encoding: null
	}
]

// Tests
kava.suite('istextorbinary', function(suite, test) {
	tests.forEach(function({ filename, text, binary, encoding }) {
		test(filename, function() {
			const buffer = filename ? readFileSync(filename) : null
			// text
			equal(isTextOrBinary.isTextSync(filename, buffer), text, 'isTextSync')
			isTextOrBinary.isTextCallback(filename, buffer, (error, result) =>
				equal(result, text, 'isTextCallback')
			)
			isTextOrBinary
				.isTextPromise(filename, buffer)
				.then(result => equal(result, text, 'isTextPromise'))
			equal(isTextOrBinary.isText(filename, buffer), text, 'isText sync')
			isTextOrBinary.isText(filename, buffer, (error, result) =>
				equal(result, text, 'isText async')
			)
			// binary
			equal(
				isTextOrBinary.isBinarySync(filename, buffer),
				binary,
				'isBinarySync'
			)
			isTextOrBinary.isBinaryCallback(filename, buffer, (error, result) =>
				equal(result, binary, 'isBinaryCallback')
			)
			isTextOrBinary
				.isBinaryPromise(filename, buffer)
				.then(result => equal(result, binary, 'isBinaryPromise'))

			equal(isTextOrBinary.isBinary(filename, buffer), binary, 'isBinary sync')
			isTextOrBinary.isBinary(filename, buffer, (error, result) =>
				equal(result, binary, 'isBinary async')
			)
			// encoding
			equal(isTextOrBinary.getEncodingSync(buffer), encoding, 'getEncodingSync')
			isTextOrBinary.getEncodingCallback(buffer, null, (error, result) =>
				equal(result, encoding, 'getEncodingCallback')
			)
			isTextOrBinary
				.getEncodingPromise(buffer)
				.then(result => equal(result, encoding, 'getEncodingPromise'))
			equal(isTextOrBinary.getEncoding(buffer), encoding, 'getEncoding sync')
			isTextOrBinary.getEncoding(buffer, null, (error, result) =>
				equal(result, encoding, 'getEncoding async')
			)
		})
	})
})
