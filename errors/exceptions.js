const fs = require('fs')
const commons = require('../commons')
class RenderableException extends Error{
	constructor(code, msg){
		super(msg)		
		this._code=code
		this.__msg=msg
	}

	 render(response){
	 	fs.readFile("./errors/"+this._code+"error.html",function(err, data){
	 		let heads={}
	
	 		if(err){
	 			response.writeHead(this._code)
	 			response.end()
	 			return
	 		}
	 		/*response.writeHead(this._code, {"Content-Type":"html"})
	 		response.write(data)
	 		response.end()*/
	 		commons.sender.send(response,data,this._code,"html")

	 	}.bind(this))
	 }

}

class FilesystemException extends Error{
	
}
class NotFoundException extends RenderableException{

	
}
class SecurityException extends RenderableException{
	
}
class MethodNotAllowedException extends RenderableException{
	
}
module.exports = {
	FilesystemException,
	NotFoundException,
	SecurityException,
	MethodNotAllowedException,
	RenderableException	
}