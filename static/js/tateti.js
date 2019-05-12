/*
*	función que maneja el 
*
*/

(function (){

var tatetiTable ;
var playVect=[];
var currentPlayer =1;
var nRows, nCols;
var winner = null;
var playerContainer;
var gameID; //Identificador único del tablero. Uno por cada dispositivo cliente.


document.addEventListener("DOMContentLoaded", function(){
	tatetiTable=document.getElementById("table");
	document.getElementById("grid-selector").addEventListener("change",init);
	playerContainer=document.getElementById("player-container");
	if(!gameID){
		gameID = uniqCode(16)
	}
	document.getElementById("plays-link")
			.setAttribute("href","/show?id="+gameID)
	init();
});

function inflateTable(){
	var num=0;
	for(var i=0;i<nRows;i++){
		var row=inflateRow();
		for(var j=0; j<nCols; j++){
			var c=inflateCell(num);
			row.appendChild(c);
			num++;
		}
		tatetiTable.appendChild(row);
	}
}


function inflateCell(num){
	var elm = document.createElement("div");
	elm.classList.add("tcell");
	elm.classList.add("unchecked");
	elm.setAttribute("t-num",num);
	elm.addEventListener("click",onClickCell)
	return elm;
}
function inflateRow(){
	var elm = document.createElement("div");
	elm.classList.add("trow");
	return elm;
}


function onClickCell(){
	var num=parseInt(this.getAttribute("t-num"));
	processClick(currentPlayer,num);

}

function onRestart(){

}

function init(){
	rowNum=parseInt(document.getElementById("grid-selector").value);
	nRows=rowNum;
	nCols = rowNum;
	winner = null;
	var N = nRows * nCols;
	currentPlayer=1;
	for(var i=0; i<N ; i++){
		playVect[i]=0;
	}
	tatetiTable.innerHTML="";
	inflateTable();
	updatePlayer();
}



function processClick(playerNum, num){
	//Estado:
	if(winner){
		return
	}
	//Detectar disponibilidad:
	if(playVect[num] !== 0)
		return
	playVect[num]=playerNum
	updateCell(num,playerNum)
	// win ?
	var W=checkWin(playerNum)
	if(W.length){
		updateWinner(playerNum,W)
	}
	updateBackend()	//Actualizo mi Backend
	//cambio turno:
	if(!winner){
		currentPlayer=currentPlayer == 1?2:1
		updatePlayer()
	}
}

//Envía el estado del tablero al backend.
function updateBackend(time){
	let route = "/store"
	let xhr = new XMLHttpRequest()
	if(!time)
		time = (new Date()).getTime()
	xhr.open("POST", route)
	xhr.onload = function(){
		console.log(this.response)
	}
	xhr.onerror = function(){
		console.log("on error")
		setTimeout(function(){
			updateBackend(time)	//necesito recordar el tiempo d la jugada , para que quede ordenado
		}, 2000)	//vuelve a intentarlo en 2 segundos.
	}
	xhr.send(JSON.stringify({board:playVect , client:gameID, time:time }))
}




function checkWin( playerNum){
	var fns=[
		checkCols,
		checkRows,
		checkDiagonalL,
		checkDiagonalR
	];

	var r=[];
	for(var i=0; i<fns.length && !r.length; i++){
		r=fns[i](playerNum);
	}

	return r;
}


function checkRows(playerNum){
		var r = [];
	for(var i=0; i<nRows && !r.length; i++){
		for(var j=0; j<nCols ; j++){
			if(playVect[(i*nCols)+j]===playerNum){
				r.push((i*nCols)+j);
			}else{
				r=[];
				break;
			}
		}
	}
	return r;
}


function checkCols(playerNum){
	var r= [];
	for(var i=0; i<nCols && !r.length; i++){
		for(var j=0; j<nRows ; j++){
			if( playVect[(j*nRows)+i] === playerNum){
				r.push((j*nRows)+i);
			}else{
				r=[];
				break;
			}
		}
		
	}
	return r;

}
function checkDiagonalL(playerNum){
	var delta = nCols +1;
	var r=[];
	for(var i=0; i<nCols; i++){
		if(playVect[i*delta]===playerNum){
			r.push(i*delta);
		}else{
			return [];
		}
	}
	return r;
}
function checkDiagonalR(playerNum){
	var delta = nCols -1 ;
	var offset=(nRows-1)*nCols;
	var r=[];
	for(var i=0; i<nCols; i++){
		if(playVect[offset - i*delta]===playerNum){
			r.push(offset - i*delta);
		}else{
			return[];
		}
	}
	return r;
}


function updateCell(num, playerNum){
	var cells = document.getElementsByClassName("tcell");
	var currCell;
	for(var c of cells){
		if(c.hasAttribute("t-num") && parseInt(c.getAttribute("t-num"))===num){
			currCell = c;
		}
	}
	currCell.classList.remove("unchecked");
	currCell.classList.add("player-"+playerNum); 
	currCell.innerText =(playerNum == 1 )?"X":"O";
}

function updateWinner(playerNum,W){
	winner=playerNum;
	console.log("Ganador : "+winner);
	var cells=document.getElementsByClassName("tcell");
	for(c of cells){
		var num = parseInt(c.getAttribute("t-num"));
		if(W.indexOf(num)!=-1){
			c.classList.add("win");
		}
	}
}
function updatePlayer(){
	playerContainer.innerText="Juega jugador "+currentPlayer;
	var other=playerContainer ==1?2:1;
	playerContainer.classList.remove("player-"+other);
	playerContainer.classList.add("player-"+currentPlayer);
}

//Genera un código "único", de un largo determinado, con pocas chances de repertirse.
//Idealmente se utilizaría una librería especializada para esto.
//No se utiliza el Date como base para evitar errores por el tiempo local de usuarios.
function uniqCode(length){
	let code = ""
	for(let i =0 ; i<length ; i++){
		let a = Math.random()
		//letra
		let c=""
		if(a < 0.5){
			c = String.fromCharCode(Math.round(Math.random()*(90-65) + 65))
		//número	
		}else{
			c = Math.round(Math.random()*10)
		}
		code += c
	}
	return code
}



})();





/////////////Tests://///////////////////


/*
*		123
		456
		789
*
*/
	








