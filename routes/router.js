const routes = require('./routes.js')	//en este archivo se definen las rutas.
const errors = require('../errors')
const static= require('../static.js')

const url = require("url")


 async function route(request , response){
	return new Promise((resolve, reject)=>{
	const  method = request.method
	let  path = url.parse(request.url).pathname
	//Si termina en /, elimino ese caracter.
	if(path.length > 1 && path.charAt(path.length -1) ==='/'){
		path = path.substr(0,path.length-1)
	}
	console.log(path)
	console.log(path)
	console.log(method)
	console.log(typeof(method))
	console.log(method == "GET")
	const  callback = routes.routes[path]
	console.log(callback)

		//no existe la ruta requerida ? entonces tratarla como contenido estático.
		if(!callback){
			
			console.log("static")
			static.serve(request, response).catch(err=>{
				console.log("catched");
				console.log(err)
				reject(err)		//Si no es una ruta ni es static, throw 404
			})
					
			return
		}
		//Si existe la ruta,debo verificar que esté definida para el metodo (GET;POST;...)
		if(!callback[method]){
			reject(new errors.exceptions.MethodNotAllowedException(419,path))
			return
		}	
		//Finalmente si existe la ejecuto.
		const promise = new Promise((resolve, reject)=>{
			try{
				callback[method](request, response)
			}catch(e){
				console.log("on catch")
				reject(e)
			}		

		}).catch(e=>{
			reject(e)
		})


	})
}






exports.route = route