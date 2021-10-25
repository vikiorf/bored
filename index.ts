class Api {
  async fetchRandomActivity() {
    return await fetch('http://www.boredapi.com/api/activity/')
    .then((res) => res.json())
    .then((res) => {
      console.log(res)
    })
  }
}



let api = new Api()
let hej = api.fetchRandomActivity()
console.log(hej)
