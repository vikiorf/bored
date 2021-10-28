const parametersFormEl = document.querySelector(
  '#parameters-form'
)! as HTMLFormElement
const boredItemsList = document.querySelector(
  '#bored-items-list'
)! as HTMLUListElement
const allInputButtonEls = Array.from(
  document.querySelectorAll('input[type="button"]')
)
const navActivitiesButtonEl = document.querySelector('#nav-activities')
const navTodoButtonEl = document.querySelector('#nav-todo')
const navGraphButtonEl = document.querySelector('#nav-graph')

const taskListEl = document.querySelector('#task-list')! as HTMLUListElement

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
      .then(res => res.json())
      .then(res => {
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
  static tasksList: Array<BoredItem> = localStorage.getItem(
    JSON.parse('task-list')
  )
    ? localStorage.getItem(JSON.parse('task-list'))
    : []

  addTask(activity: BoredItem): void {
    Tasks.tasksList.push(activity)
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
        boredItem => boredItem.key === activity.key
      )

      if (doubleItemCheck >= 0) {
        runCheck--
        i--
        if (runCheck === 0) i = 10
      } else {
        runCheck = 5
        boredItems.addItem(activity)
        console.log('hejsan', activity)

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
  renderTasks(): void {
    Tasks.tasksList.forEach(task => {
      console.log(task)
      const newLiEl = document.createElement('li')
      const taskNameEl = document.createElement('p')
      const taskTypeEl = document.createElement('p')
      const checkboxSpanEl = document.createElement('span')

      newLiEl.classList.add('task')

      taskNameEl.textContent = task.activity
      taskTypeEl.textContent = task.type

      newLiEl.append(taskNameEl)
      newLiEl.append(taskTypeEl)
      newLiEl.append(checkboxSpanEl)

      taskListEl.append(newLiEl)
    })
  }

  renderBoredView(): void {
    navActivitiesButtonEl?.classList.add('nav-active')
    navGraphButtonEl?.classList.remove('nav-active')
    navTodoButtonEl?.classList.remove('nav-active')

    parametersFormEl.style.display = 'flex'
    boredItemsList.style.display = 'grid'

    taskListEl.style.display = 'none'
  }
  renderTodoView(): void {
    navTodoButtonEl?.classList.add('nav-active')
    navGraphButtonEl?.classList.remove('nav-active')
    navActivitiesButtonEl?.classList.remove('nav-active')

    parametersFormEl.style.display = 'none'
    boredItemsList.style.display = 'none'

    taskListEl.style.display = 'grid'

    this.clearTaskList()
    this.renderTasks()
  }
  renderGraphView(): void {
    navGraphButtonEl?.classList.add('nav-active')
    navTodoButtonEl?.classList.remove('nav-active')
    navActivitiesButtonEl?.classList.remove('nav-active')

    parametersFormEl.style.display = 'none'
    boredItemsList.style.display = 'none'

    taskListEl.style.display = 'none'
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

allInputButtonEls.forEach(inputButtonEl => {
  inputButtonEl.addEventListener('click', event => {
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

parametersFormEl.addEventListener('submit', e => {
  e.preventDefault()
  const filter = new Filter()
  const filterValues = filter.returnInputValues()
  const render = new Render()
  render.removeAllBoredItemsFromList()
  render.renderTenBoredItems(filterValues)
})
