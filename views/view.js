const  fs = require('fs')
const errors = require('../errors')
const commons = require('../commons')
/*
*	Este módulo emula un "template engine".
*  	Sirve las vistas guardadas en la carpeta /views de mi app.
*
*/
 function make(file, response){
	
		fs.readFile('./views/'+file, function(err, data){
		if(err){
			throw new errors.exceptions.FilesystemException(err)
			
		}else{
			commons.sender.send(response, data,200,"html")
		}
		
	})



}	
exports.make=make