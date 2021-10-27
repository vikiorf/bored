const parametersFormEl = document.querySelector(
	'#parameters-form'
)! as HTMLFormElement

interface BoredItem {
	activity: string
	type: string
	participants: number
	price: number
	key: number
	accessibility: number
	link: string
}

interface FilterObject {
	type: string
	participants: number
	price: number
}

class Api {
	async fetchActivity(filterObject: FilterObject) {
		let typeString: string = ''
		let participantsString: string = ''
		let priceString: string = ''

		if (filterObject.type) {
			typeString = `type=${filterObject.type}`
		}
		if (filterObject.participants) {
			participantsString = `participants=${filterObject.participants}`
		}
		if (filterObject.price || filterObject.price === 0) {
			priceString = `maxprice=${filterObject.price}`
		}
		const fetchString = `http://www.boredapi.com/api/activity?${typeString}&${participantsString}&${priceString}`
		console.log(fetchString)
		return await fetch(fetchString)
			.then((res) => res.json())
			.then((res) => {
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
		const boredItemsList = document.querySelector(
			'#bored-items-list'
		)! as HTMLUListElement
		if (boredItemsList) boredItemsList.innerHTML = ''
	}

	async renderTenItems(filterObject: FilterObject) {
		const boredItems = new BoredItems()
		const api = new Api()
		for (let i = 0; i < 10; i++) {
			const activity = await api.fetchActivity(filterObject)
			boredItems.addItem(activity)
			console.log('hejsan', activity)

			const boredItemsList = document.querySelector('#bored-items-list')
			const newLiEl = document.createElement('li')
			const typePEl = document.createElement('p')
      const activityParagraphEl = document.createElement('p')
      const saveForLaterButtonEl = document.createElement('button')

      activityParagraphEl.textContent = activity.activity
      activityParagraphEl.classList.add('activity-paragraph')
      
			typePEl.textContent = activity.type

      saveForLaterButtonEl.textContent = 'Save for later'

			newLiEl.classList.add('bored-item')
			
      newLiEl.append(activityParagraphEl)
			newLiEl.append(typePEl)
      newLiEl.append(saveForLaterButtonEl)

			boredItemsList?.appendChild(newLiEl)
		}
	}
}

class Filter {
	returnInputValues(): FilterObject {
		const typeSelectEl = document.querySelector(
			'#type-select'
		)! as HTMLSelectElement
		const participantsInputEl = document.querySelector(
			'#participants-input'
		)! as HTMLInputElement
		const priceSliderEl = document.querySelector(
			'#price-slider'
		)! as HTMLInputElement

		const type = typeSelectEl.value
		const participants = +participantsInputEl.value
		const price = +priceSliderEl.value / 100

		return {
			type: type,
			participants: participants,
			price: price
		}
	}
}

class Init {}

const init = new Init()

parametersFormEl.addEventListener('submit', (e) => {
	e.preventDefault()
	const filter = new Filter()
	const filterValues = filter.returnInputValues()
	const render = new Render()
	render.removeAllBoredItemsFromList()
	render.renderTenItems(filterValues)
})
