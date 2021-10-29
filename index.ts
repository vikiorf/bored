const parametersFormEl = document.querySelector(
	'#parameters-form'
)! as HTMLFormElement
const boredItemsList = document.querySelector(
	'#bored-items-list'
)! as HTMLUListElement
const allInputButtonEls = Array.from(
	document.querySelectorAll('input[type="button"]')
)! as Array<HTMLInputElement>
const navActivitiesButtonEl = document.querySelector('#nav-activities')
const navTodoButtonEl = document.querySelector('#nav-todo')
const navGraphButtonEl = document.querySelector('#nav-graph')

const taskListEl = document.querySelector('#task-list')! as HTMLUListElement

const chartEl = document.querySelector('#chart')! as any
const chart = chartEl!.getContext('2d')

let myChart: any

interface BoredItem {
	activity: string
	type: string
	participants: number
	price: number
	key: number
	accessibility: number
	link: string
}
interface TaskItem extends BoredItem {
	status: string
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
	static boredItemsList: Array<BoredItem> = []

	addItem(item: BoredItem) {
		BoredItems.boredItemsList.push(item)
	}

	clearBoredItems() {
		BoredItems.boredItemsList = []
	}
}

class Tasks {
	// Fetching the tasks from localstorage if there are any present
	static tasksListItems: Array<TaskItem> = JSON.parse(
		localStorage.getItem('task-list')!
	)
		? JSON.parse(localStorage.getItem('task-list')!)
		: []

	addTask(activity: BoredItem): void {
		let task: TaskItem = { ...activity, status: 'new' }
		Tasks.tasksListItems.push(task)
		localStorage.setItem('task-list', JSON.stringify(Tasks.tasksListItems))
	}

	markTaskDone(task: TaskItem): void {
		const taskIndex = Tasks.tasksListItems.findIndex(
			(_task) => _task.key === task.key
		)
		Tasks.tasksListItems[taskIndex].status = 'done'
		localStorage.setItem('task-list', JSON.stringify(Tasks.tasksListItems))
		const render = new Render()
		render.clearTaskList()
		render.renderAllTasks()
	}

	markTaskNew(task: TaskItem): void {
		const taskIndex = Tasks.tasksListItems.findIndex(
			(_task) => _task.key === task.key
		)
		Tasks.tasksListItems[taskIndex].status = 'new'
		localStorage.setItem('task-list', JSON.stringify(Tasks.tasksListItems))
		const render = new Render()
		render.clearTaskList()
		render.renderAllTasks()
	}
}

class Render {
	removeAllBoredItemsFromList() {
		const boredItems = new BoredItems()
		boredItems.clearBoredItems()

		if (boredItemsList) boredItemsList.innerHTML = ''
	}

	createErrorElement(error: { error: string }): HTMLLIElement {
		const liEl = document.createElement('li')
		liEl.classList.add('bored-item')

		liEl.textContent = error.error

		return liEl
	}

	createBoredItemElement(activity: BoredItem): HTMLLIElement {
		const newLiEl = document.createElement('li')
		const typePEl = document.createElement('p')
		const activityParagraphEl = document.createElement('p')
		const saveForLaterButtonEl = document.createElement('button')

		activityParagraphEl.textContent = activity.activity
		activityParagraphEl.classList.add('activity-paragraph')

		typePEl.textContent = activity.type

		saveForLaterButtonEl.textContent = 'Save for later'
		saveForLaterButtonEl.addEventListener('click', () => {
			const tasks = new Tasks()
			tasks.addTask(activity)
		})

		newLiEl.classList.add('bored-item')

		newLiEl.append(activityParagraphEl)
		newLiEl.append(typePEl)
		newLiEl.append(saveForLaterButtonEl)

		return newLiEl
	}

	/**
	 * Fetches and renders 10 boredItems
	 * @param filterObject {type: object, type: string, participants: number, price: number}
	 */
	async renderTenBoredItems(filterObject: FilterObject) {
		const boredItems = new BoredItems()
		const api = new Api()
		let runCheck = 5
		for (let i = 0; i < 10; i++) {
			const activity = await api.fetchActivity(filterObject)

			const doubleItemCheck = BoredItems.boredItemsList.findIndex(
				(boredItem) => boredItem.key === activity.key
			)
			const taskDoubleItemCheck = Tasks.tasksListItems.findIndex(
				(taskItem) => taskItem.key === activity.key
			)

			if (doubleItemCheck >= 0 || taskDoubleItemCheck >= 0) {
				runCheck--
				i--
				if (runCheck === 0) i = 10
			} else {
				runCheck = 5
				boredItems.addItem(activity)

				let newLiEl: HTMLLIElement

				if (activity.error) {
					newLiEl = this.createErrorElement(activity)
					i = 10
				} else {
					newLiEl = this.createBoredItemElement(activity)
				}

				const boredItemsList = document.querySelector('#bored-items-list')

				boredItemsList?.appendChild(newLiEl)
			}
		}
	}
	clearTaskList(): void {
		taskListEl.innerHTML = ''
	}

	createNewTaskElement(task: TaskItem): HTMLLIElement {
		const newLiEl = document.createElement('li')
		const taskNameEl = document.createElement('p')
		const taskTypeEl = document.createElement('p')
		const checkboxSpanEl = document.createElement('span')

		newLiEl.classList.add('task')

		taskTypeEl.classList.add('task-type')
		taskNameEl.classList.add('task-name')
		checkboxSpanEl.classList.add('checkbox')

		checkboxSpanEl.addEventListener('click', () => {
			const tasks = new Tasks()
			tasks.markTaskDone(task)
		})

		// First letter to uppercase
		let typeString = task.type.charAt(0).toUpperCase() + task.type.slice(1)

		taskNameEl.textContent = task.activity
		taskTypeEl.textContent = typeString

		newLiEl.append(taskNameEl)
		newLiEl.append(taskTypeEl)
		newLiEl.append(checkboxSpanEl)
		return newLiEl
	}

	createDoneTaskElement(task: TaskItem): HTMLLIElement {
		const newLiEl = document.createElement('li')
		const taskNameEl = document.createElement('p')
		const taskTypeEl = document.createElement('p')
		const checkboxSpanEl = document.createElement('span')
		const checkImageEl = document.createElement('img')

		newLiEl.classList.add('task')

		taskTypeEl.classList.add('task-type')
		taskNameEl.classList.add('task-name')
		checkboxSpanEl.classList.add('checkbox')
		checkboxSpanEl.classList.add('checked')

		checkImageEl.setAttribute('src', './assets/check-mark.png')
		checkImageEl.setAttribute('alt', 'Check')

		checkboxSpanEl.append(checkImageEl)

		checkboxSpanEl.addEventListener('click', () => {
			const tasks = new Tasks()
			tasks.markTaskNew(task)
		})

		// First letter to uppercase
		let typeString = task.type.charAt(0).toUpperCase() + task.type.slice(1)

		taskNameEl.textContent = task.activity
		taskTypeEl.textContent = typeString

		newLiEl.append(taskNameEl)
		newLiEl.append(taskTypeEl)
		newLiEl.append(checkboxSpanEl)
		return newLiEl
	}

	renderAllTasks(): void {
		Tasks.tasksListItems.forEach((task) => {
			let newLiEl: HTMLLIElement
			if (task.status === 'new') {
				newLiEl = this.createNewTaskElement(task)
			}

			if (newLiEl!) {
				taskListEl.append(newLiEl)
			}
		})
		Tasks.tasksListItems.forEach((task) => {
			let newLiEl: HTMLLIElement
			if (task.status === 'done') {
				newLiEl = this.createDoneTaskElement(task)
			}

			if (newLiEl!) {
				taskListEl.append(newLiEl)
			}
		})
	}

	renderBoredView(): void {
		navActivitiesButtonEl?.classList.add('nav-active')
		navGraphButtonEl?.classList.remove('nav-active')
		navTodoButtonEl?.classList.remove('nav-active')

		parametersFormEl.style.display = 'flex'
		boredItemsList.style.display = 'grid'
		chartEl.style.display = 'none'

		taskListEl.style.display = 'none'
	}
	renderTodoView(): void {
		navTodoButtonEl?.classList.add('nav-active')
		navGraphButtonEl?.classList.remove('nav-active')
		navActivitiesButtonEl?.classList.remove('nav-active')

		parametersFormEl.style.display = 'none'
		boredItemsList.style.display = 'none'
		chartEl.style.display = 'none'

		taskListEl.style.display = 'grid'

		this.clearTaskList()
		this.renderAllTasks()
	}
	renderGraphView(): void {
		navGraphButtonEl?.classList.add('nav-active')
		navTodoButtonEl?.classList.remove('nav-active')
		navActivitiesButtonEl?.classList.remove('nav-active')

		parametersFormEl.style.display = 'none'
		boredItemsList.style.display = 'none'

		taskListEl.style.display = 'none'
		chartEl.style.display = 'block'

		const doneTasks: Array<TaskItem> = []

		const labels: string[] = []
		const data: number[] = []

		Tasks.tasksListItems.forEach((task) => {
			if (task.status === 'done') {
				doneTasks.push(task)
			} else {
				if (labels.length === 1) {
					data[0] = data[0] + 1
				} else {
					labels[0] = 'Unfinished'
					data[0] = 1
				}
			}
		})

		doneTasks.forEach((task) => {
			let foundDoubleIndex = labels.findIndex((label) => label === task.type)
			if (foundDoubleIndex !== -1) {
				data[foundDoubleIndex] = data[foundDoubleIndex] + 1
			} else {
				labels.push(task.type)
				data.push(1)
			}
		})
		if (myChart) myChart.destroy()
		myChart = new Chart(chart, {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [
					{
						label: '# of Completed',
						data: data,
						backgroundColor: [
							'rgba(255, 99, 132, 0.2)',
							'rgba(54, 162, 235, 0.2)',
							'rgba(255, 206, 86, 0.2)',
							'rgba(75, 192, 192, 0.2)',
							'rgba(153, 102, 255, 0.2)',
							'rgba(255, 159, 64, 0.2)'
						],
						borderColor: [
							'rgba(255, 99, 132, 1)',
							'rgba(54, 162, 235, 1)',
							'rgba(255, 206, 86, 1)',
							'rgba(75, 192, 192, 1)',
							'rgba(153, 102, 255, 1)',
							'rgba(255, 159, 64, 1)'
						],
						borderWidth: 1
					}
				]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true
					}
				}
			}
		})
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

allInputButtonEls.forEach((inputButtonEl) => {
	inputButtonEl.addEventListener('click', (event) => {
		let element = event.target! as HTMLInputElement
		const render = new Render()
		if (element.value === 'Activities') {
			render.renderBoredView()
		} else if (element.value === 'Todo') {
			render.renderTodoView()
		} else if (element.value === 'Graph') {
			render.renderGraphView()
		}
	})
})

parametersFormEl.addEventListener('submit', (e) => {
	e.preventDefault()
	const filter = new Filter()
	const filterValues = filter.returnInputValues()
	const render = new Render()
	boredItemsList.style.display = 'grid'
	render.removeAllBoredItemsFromList()
	render.renderTenBoredItems(filterValues)
})
