# Import
{expect, assert} = require('chai')
joe = require('joe')
isTextOrBinary = require('../../')


# =====================================
# Tests

joe.describe 'istextorbinary', (describe, it) ->
	it 'should detect this is a text file', ->
		expect(isTextOrBinary.isTextSync(__filename)).to.equal(true)

