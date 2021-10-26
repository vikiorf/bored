const displayTenItemsButtonEl = document.querySelector(
  '#display-ten-items'
)! as HTMLButtonElement

interface BoredItem {
  activity: string
  type: string
  participants: number
  price: number
  key: number
  accessibility: number
	link: string
}

class Api {
  async fetchRandomActivity() {
    return await fetch('http://www.boredapi.com/api/activity/')
      .then(res => res.json())
      .then(res => {
        return res
      })
  }
}

class BoredItems {
  static boredItem: Array<BoredItem> = []

  addItem(item: BoredItem) {
    BoredItems.boredItem.push(item)
  }

	clearBoredItems() {
		BoredItems.boredItem = []
	}
}

class Tasks {}

class Render {
	removeAllBoredItemsFromList() {
		const boredItems = new BoredItems()
		boredItems.clearBoredItems()
		const boredItemsList = document.querySelector('#bored-items-list') ! as HTMLUListElement
		if (boredItemsList) boredItemsList.innerHTML = ''
	}

  async renderTenItems() {
		const boredItems = new BoredItems()
		const api = new Api()
		for(let i = 0; i < 10; i++) {
			const activity = await api.fetchRandomActivity()
			boredItems.addItem(activity)

			const boredItemsList = document.querySelector('#bored-items-list')
      const newLiEl = document.createElement('li')
			newLiEl.classList.add('bored-item')
      newLiEl.textContent = activity.activity
      boredItemsList?.appendChild(newLiEl)
		}
	}
}

class Init {

}

const init = new Init()

displayTenItemsButtonEl.addEventListener('click', () => {
	const render = new Render()
	render.removeAllBoredItemsFromList()
	render.renderTenItems()
})
