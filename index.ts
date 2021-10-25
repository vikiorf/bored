class Api {
	async fetchRandomActivity() {
		return await fetch('http://www.boredapi.com/api/activity/')
			.then((res) => res.json())
			.then((res) => {
				console.log(res)
			})
	}
}

class BoredItems {
  static boredItem: object[]

  addItem(item: object) {
    BoredItems.boredItem.push(item)
  }
}

class Tasks {}

class Render {}

let api = new Api()
let hej = api.fetchRandomActivity()
console.log(hej)
