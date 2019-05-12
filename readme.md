# Tateti Game

Consiste en un servidor del juego tateti, pensado para dos jugadores en una misma PC.
Permite tamaños de tablero variable

## Uso:
```
$ git clone https://github.com/Gabitox/tateti_server.git
$ cd tateti_server
$ npm install
$ node server
```
## Arquitectura:
* [server.js](https://github.com/Gabitox/tateti_server/blob/master/server.js): Punto de entrada de la app, levanta el servidor en puerto 8888 y procesa las requests entrantes

* [router.js](https://github.com/Gabitox/tateti_server/blob/master/routes/router.js):Tiene la lógica de ruteo, relaciona una URL con un método con el callback correspondiente para procesar la petición.También sirve el contenido estático (imágenes, css , js ).

* [routes.js](https://github.com/Gabitox/tateti_server/blob/master/routes/routes.js): Es el diccionario donde se definen las rutas con sus métodos para cada callback a ejecutarse. 

* [/views](https://github.com/Gabitox/tateti_server/tree/master/views): En este directorio se guardan las vistas HTML que se renderizarán. El módulo [view.js](https://github.com/Gabitox/tateti_server/tree/master/views/view.js) hace el trabajo de renderizar las vistas con el método `make()`.

* [static](https://github.com/Gabitox/tateti_server/tree/master/static): En este directorio se guarda todo el contenido estático de la aplicación (css, js, imágenes,etc).
* [static.js](https://github.com/Gabitox/tateti_server/blob/master/static.js): Este módulo se encarga de buscar y devolver todo el contenido estático almacenado en el directorio /static o generar una NotFoundException si no se encontró.

* [/errors](https://github.com/Gabitox/tateti_server/tree/master/errors): En este directorio se almacenan las vistas de los errores que se renderizarán para cada código de error HTTP. Por convención se guardan como {código de error}error.html. Por ejemplo [404error.html](https://github.com/Gabitox/tateti_server/blob/master/errors/404error.html) se renderizará por cada  excepción con código 404.

* [exceptions.js](https://github.com/Gabitox/tateti_server/blob/master/errors/exceptions.js): Guarda todas las excepciones definidas de la applicación. En las excepciones que extienden de la clase RenderableException se ejecutará el  método `render()` al ser manejadas por el error handler de la app, y dentro de este método está la lógica de renderizado de las mismas.

* [handler.js](https://github.com/Gabitox/tateti_server/blob/master/errors/handlers.js) : Contiene al error handler que manejará todas las excepciones de la app.

* [/controllers](https://github.com/Gabitox/tateti_server/tree/master/controllers): Aquí se guardan todas los controladores de la aplicación.

* [/daos](https://github.com/Gabitox/tateti_server/tree/master/daos): Aquí se guardarán los daos, clases que sirven para almacenar en memoria el estado de la partida.


## Guardado de partida en memoria y visualización de jugadas:
Se agregó la funcionalidad pedida como tarea. La lógica es: 
1. generar un código alfanumérico aleatorio en el cliente que inicia una partida, con muy baja probabilidad de colisionar o repetirse en otro cliente.
2. Por cada jugada, enviar un json al endpoint */store* con la siguiente información:
  * array del tablero.
  * tiempo.
  * id del cliente generada en (1).
3. El dao de board guardará esa jugada en un diccionario clave-valor, con el id generado en (1) como clave y un arreglo de jugadas como valor. Así permitimos tener varios clientes jugando de manera concurrente. Cada vez que llega una nueva partida para un cliente, se ordena automáticamente por el valor del campo *tiempo*. Esto permite no alterar el orden de jugadas en casos de lag de red. 
4. Si el envío falla por problemas de red, el cliente tateti.js seguirá intentando enviar las jugadas que no se enviaron cada 1 segundo.
5. Las partidas se muestran en el endpoint */show* , pasando el id de cliente como parámetro en la query.

## TODO:

Queda por terminar el mostrar un cartel popup cuando uno de los jugadores gana y un botón Reset en el front.

Validaciones.