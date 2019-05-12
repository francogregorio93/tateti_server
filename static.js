const fs = require('fs')
const mime = require('mime-types')
const path = require('path')
const url = require("url")
const allowedPath =__dirname+path.sep+"static"
const errors = require('./errors')
/*
*	Módulo que sirve el contenido estático de la app.
*	Toma como base la carpeta "static" dentro de la aplicación para buscar el contenido.
*   Si no se encuentra el contenido arroja un NotFoundException que se renderizará como 404
*
*/



async function serve(request , response){
	return new Promise((resolve, reject)=>{
		console.log(allowedPath)

		var urlPath=url.parse(request.url).pathname

		var localPath = path.resolve(__dirname+"/static/"+urlPath)
		console.log(localPath)
		//Verifico que el path absoluto que resuelve node esté dentro de la carpeta permitida.
		if(localPath.indexOf(allowedPath)!==0){
			//TODO error
			//usuario intentó un path transversal enviando /../ en el request.
			reject(new errors.exceptions.SecurityException(403,"path transversal attempt"))
			return
		}
		
		fs.readFile(localPath,function(err,data){
			if(err){
				console.log(err)
				//No existe, devolver un not found exception
				reject(new errors.exceptions.NotFoundException(404,urlPath))
				return
			}
			//obtenemos el mimetype para enviarlo en la cabecera.
			var mimeType = mime.lookup(localPath)
			//mime type inválido o no permitido. Ej: .htaccess ,.env
			if(!mimeType){
				 reject(new errors.exceptions.SecurityException(403,"invalid mime type"))
				 return
			}
			
			
			response.writeHeader(200, {"Content-Type":mimeType})
			response.write(data)
			response.end()
			resolve()
		})
	})
}

exports.serve = serve;
