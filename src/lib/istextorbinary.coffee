# Import
pathUtil = require('path')
textExtensions = require('textextensions')
binaryExtensions = require('binaryextensions')

# Define
isTextOrBinary =

	# Is Text
	# Determine whether or not a file is a text or binary file
	# determined by extension checks first
	# if unknown extension, then fallback on encoding detection
	# we do this as encoding detection cannot guarantee everything
	# especially for chars between utf8 and utf16
	# returns true/false/err
	isTextSync: (filename, buffer) ->
		# Prepare
		isText = null

		# Test extensions
		if filename
			# Extract filename
			filename = pathUtil.basename(filename).split('.')


			# Cycle extensions in reverse order
			for extension in filename.reverse()
				if extension in textExtensions
					isText = true
					break
				if extension in binaryExtensions
					isText = false
					break

		# Fallback to encoding if extension check was not enough
		if buffer and isText is null
			isText = isTextOrBinary.getEncodingSync(buffer) is 'utf8'

		# Return our result
		return isText

	# Get the encoding of a buffer
	# next(err, true/false)
	isText: (filename,buffer,next) ->
		# Fetch and wrap result
		result = isTextOrBinary.isTextSync(filename, buffer)
		if result instanceof Error
			next(err)
		else
			next(null, result)

		# Chain
		@

	# Is binary sync
	# returns true/false/err
	isBinarySync: (filename, buffer, next) ->
		# Handle
		result = isTextOrBinary.isTextSync(filename, buffer)
		if result instanceof Error
			return result
		else
			return !result

		# Chain
		@

	# Is binary
	# next(err, true/false)
	isBinary: (filename, buffer, next) ->
		# Handle
		isTextOrBinary.isText filename, buffer, (err, result) ->
			return next(err)  if err
			return next(null, !result)

		# Chain
		@

	# Get the encoding of a buffer
	# We fetch a bunch chars from the start, middle and end of the buffer
	# we check all three, as doing only start was not enough, and doing only middle was not enough
	# so better safe than sorry
	# returns 'utf8'/'binary'/err
	getEncodingSync: (buffer, opts) ->
		# Prepare
		textEncoding = 'utf8'
		binaryEncoding = 'binary'

		# Discover
		unless opts?
			# Start
			chunkLength = 24
			encoding = isTextOrBinary.getEncodingSync(buffer, {chunkLength, chunkBegin})
			if encoding is textEncoding
				# Middle
				chunkBegin = Math.max(0, Math.floor(buffer.length/2)-chunkLength)
				encoding = isTextOrBinary.getEncodingSync(buffer, {chunkLength, chunkBegin})
				if encoding is textEncoding
					# End
					chunkBegin = Math.max(0, buffer.length-chunkLength)
					encoding = isTextOrBinary.getEncodingSync(buffer, {chunkLength, chunkBegin})
		else
			# Extract
			{chunkLength, chunkBegin} = opts
			chunkLength ?= 24
			chunkBegin ?= 0
			chunkEnd = Math.min(buffer.length, chunkBegin+chunkLength)
			contentChunkUTF8 = buffer.toString(textEncoding, chunkBegin, chunkEnd)
			encoding = textEncoding

			# Detect encoding
			for i in [0...contentChunkUTF8.length]
				charCode = contentChunkUTF8.charCodeAt(i)
				if charCode is 65533 or charCode <= 8
					# 8 and below are control characters (e.g. backspace, null, eof, etc.)
					# 65533 is the unknown character
					# console.log(charCode, contentChunkUTF8[i])
					encoding = binaryEncoding
					break

		# Return encoding
		return encoding

	# Get the encoding of a buffer
	# next(err, 'utf8'/'binary')
	getEncoding: (buffer,opts,next) ->
		# Fetch and wrap result
		result = isTextOrBinary.getEncodingSync(buffer, opts)
		if result instanceof Error
			next(err)
		else
			next(null, result)

		# Chain
		@

# Export
module.exports = isTextOrBinary