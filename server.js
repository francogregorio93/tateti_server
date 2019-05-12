const http = require('http')
const server = http.createServer();
const router = require('./routes/router.js')
const errors= require('./errors')


// Pero tambien podemos crearlo hibrido, para definirlo mejor
server.on('request', (request, response) => {
    
    //Intento de "cachear" uncaught exceptions con referencia a la actual request.
    //Evita que el servidor se caiga y permite devolver errores 500 ante una excepción no cachada
    //Esto es muy malo, no funcionaría en un servidor con mínima concurrencia.
    //NO haga esto en casa.
    process.on("uncaughtException", function(err){
        errors.handlers.handle(err, request, response)
    })
    let body = [];
    request.on('error', (err) => {
        console.log("on the error")
        console.error(err)
    }).on('data', (chunk) => {
        body.push(chunk)
    }).on('end', () => {
        body = Buffer.concat(body).toString()
        request.body = body
        //router.js es el punto de entrada a la aplicación.
        //rutea las url a sus funciones definidas y sirve contenido estático. 
        router.route(request,response)
            .catch(e=>{
                errors.handlers.handle(e,request,response)
            })

    });
});



server.listen(8888)