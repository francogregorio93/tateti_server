const exceptions = require('./exceptions')
function handle(err, request, response){
	if(err instanceof exceptions.RenderableException ){
		err.render(response)
	}else{
		console.log(err)
		response.writeHead(500)
		response.end()
	}
}

module.exports.handle=handle