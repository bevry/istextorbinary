'use strict'

/** @type {typeof import("./source/test.ts") } */
module.exports = require('editions').requirePackage(
	__dirname,
	require,
	'test.js'
)
