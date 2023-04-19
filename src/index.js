// Definitions
const dogFilter = document.querySelector('#good-dog-filter')
const dogBar = document.querySelector('#dog-bar')
const dogInfo = document.querySelector('#dog-info')
let filterStatus = 'off'

// Callbacks
function getDogs() {
    fetch('http://localhost:3000/pups')
    .then(res => res.json())
    .then(data => {
        data.forEach(dog => {
            const dogBox = document.createElement('span')
            dogBox.textContent = dog.name
            dogBox.id = dog.id
            if (dog.isGoodDog === true) {
                dogBox.className = 'good'
            } else if (dog.isGoodDog === false) {
                dogBox.className = 'bad'
            }
            dogBox.addEventListener('click', seeInfo)

            dogBar.appendChild(dogBox)
        })
    })
}

function seeInfo(e) {
    fetch(`http://localhost:3000/pups/${e.target.id}`)
    .then(res => res.json())
    .then(data => {
        dogInfo.innerHTML = ''

        dogInfo.setAttribute('dogid', data.id)

        const dogImage = document.createElement('img')
        dogImage.src = data.image
        dogInfo.appendChild(dogImage)

        const dogName = document.createElement('h2')
        dogName.textContent = data.name
        dogInfo.appendChild(dogName)

        const btn = document.createElement('button')
        if (data.isGoodDog === true) {
            btn.textContent = 'Good Dog!'
        } else if (data.isGoodDog === false) {
            btn.textContent = 'Bad Dog!'
        }
        btn.addEventListener('click', changeGoodness)

        dogInfo.appendChild(btn)
    })
}

function changeGoodness(e) {
    if (e.target.textContent === 'Good Dog!') {
        fetch(`http://localhost:3000/pups/${e.target.parentNode.getAttribute('dogid')}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({isGoodDog: false})
        })
        .then(res => res.json())
        .then(data => {
            e.target.textContent = 'Bad Dog!'
            document.getElementById(data.id).className = 'bad'
            if (filterStatus === 'on') {
                document.getElementById(data.id).style.display = 'none'
            }
        })
    } else if (e.target.textContent === 'Bad Dog!') {
        fetch(`http://localhost:3000/pups/${e.target.parentNode.getAttribute('dogid')}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({isGoodDog: true})
        })
        .then(res => res.json())
        .then(data => {
            e.target.textContent = 'Good Dog!'
            document.getElementById(data.id).className = 'good'
            if (filterStatus === 'on') {
                document.getElementById(data.id).style.display = 'flex'
            }
        })
    }
}

function filterDogs() {
    let badDogs = document.querySelectorAll('.bad')
    console.log(badDogs)
    if (filterStatus === 'off') {
        badDogs.forEach(dog => dog.style.display = 'none')
        filterStatus = 'on'
        dogFilter.textContent = `Filter good dogs: ON`
    } else if (filterStatus === 'on') {
        badDogs.forEach(dog => dog.style.display = 'flex')
        filterStatus = 'off'
        dogFilter.textContent = `Filter good dogs: OFF`
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', getDogs)
dogFilter.addEventListener('click', filterDogs)
