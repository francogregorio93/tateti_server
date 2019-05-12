class BoardDao{
	//Almacena las jugadas por cada cliente.
	constructor(){
		this.plays={}
	}
	storePlay(play){
		//this.plays.push(play)
		if(!this.plays[play.client]){
			this.plays[play.client]=[]
		}
		//guarda siempre ordenada.
		this.plays[play.client]=this.onlineSort(this.plays[play.client],play)

	}
	getPlays(clientId){
		if(this.plays[clientId])
			return this.plays[clientId]
		return null
	}

	//Quicksort
	orderByDate(arr){
		let a = arr[0]
		let left=[]
		let rigth =[]
		for(let i=1; i<arr.length ; i++){
			if(a.time > arr[i].time){
				left.push(arr[i])	
			}else{
				rigth.push(arr[i])
			}
		}
		left = orderByDate(left)
		rigth =orderByDate(rigth)
		left.push(a)
		return left.concat(rigth)

	}
	//Quicksort pero  optimizado para agregar un nuevo elemento a la vez y mantener ordenado.
	onlineSort(array, newElm){
		if(array.length < 1){
			array.push(newElm)
			return array
		}
		let left =[]
		let rigth =[]
		for(let i=0; i<array.length ; i++){
			if(array[i].time<newElm.time){
				left.push(array[i])
			}else{
				rigth.push(array[i])
			}
		}
		left.push(newElm)
		return left.concat(rigth)

	}


}

module.exports = new BoardDao()