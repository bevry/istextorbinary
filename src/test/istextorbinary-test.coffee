# Import
{expect, assert} = require('chai')
joe = require('joe')
isTextOrBinary = require('../../')


# =====================================
# Tests

joe.describe 'istextorbinary', (describe, it) ->
	it 'should pass with no tests', ->
		console.log(isTextOrBinary)
