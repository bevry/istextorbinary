# Import
{expect, assert} = require('chai')
fs = require('fs')
joe = require('joe')
path = require('path')
isTextOrBinary = require('../../')

fixtures = path.join(path.dirname(__filename), 'fixtures')


# =====================================
# Tests

joe.describe 'istextorbinary', (describe, it) ->
	it 'should detect this is a text file', ->
		expect(isTextOrBinary.isTextSync(__filename)).to.equal(true)

	it 'should detect a text file based on buffer', ->
		filename = path.join(fixtures, 'some_file_without_extension')
		buffer = fs.readFileSync(filename)
		expect(isTextOrBinary.isTextSync(filename, buffer)).to.equal(true)

	it 'should detect a text file if named "jpg.unusual_extension"', ->
		filename = path.join(fixtures, 'jpg.unusual_extension')
		buffer = fs.readFileSync(filename)
		expect(isTextOrBinary.isTextSync(filename, buffer)).to.equal(true)

	it 'should detect that a jpg is binary', ->
		filename = path.join(fixtures, 'penguin.jpg')
		expect(isTextOrBinary.isBinarySync(filename)).to.equal(true)
		expect(isTextOrBinary.isTextSync(filename)).to.equal(false)

	it 'should detect that a jpg is binary if named "txt.penguin"', ->
		filename = path.join(fixtures, 'txt.penguin')
		buffer = fs.readFileSync(filename)
		expect(isTextOrBinary.isBinarySync(filename, buffer)).to.equal(true)
		expect(isTextOrBinary.isTextSync(filename, buffer)).to.equal(false)
