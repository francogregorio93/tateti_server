let controllers = require('../controllers')

//Diccionario que relaciona rutas con callbacks.
//Cada ruta corresponde a un callback por cada metodo definido por el usuario. GET;POST;PUT ...
const routes={
		"/": {"GET": controllers.tatetiController.index},
		"/store": {"POST": controllers.tatetiController.store},
		"/test":{"GET":controllers.tatetiController.test},
		"/show":{"GET":controllers.tatetiController.show}

}
exports.routes = routes;