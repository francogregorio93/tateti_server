function send(response, text, code ,contentType){
	if(!contentType){
		contentType='text/plain'
	}
	if(!code){
		code=200
	}

	const heads ={
		'Content-Type':contentType,
		'Content-Length':text.length

	}
	response.writeHead(code,heads)
	response.write(text)
	response.end()
}

exports.send = send