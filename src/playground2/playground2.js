const testCardsList = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
  {
    id: 6,
  },
]
const enemiesList = Array.from(document.getElementsByClassName('enemy-cards-container'))

const maxRotateAngle = 25
let cardAngleStep = maxRotateAngle*2/(testCardsList.length-1)

enemiesList.forEach((enemy, index) => {
    for (let i = 0; i<testCardsList.length; i++) {
      const container = document.createElement('div')
      container.classList.add('card-element', 'closed')
      container.style.backgroundImage = 'url("../../Sprites/CardBacks/Card_Back_01.png")'
      container.style.backgroundSize = '100% 100%'
      container.style.position = 'relative'
      container.style.left = '0px'
      container.style.top = '0px'
      container.style.transform = `rotate(${0 - maxRotateAngle + cardAngleStep * i}deg)`
      container.style.transformOrigin = 'center bottom'
      enemy.appendChild(container)
    }
  }
)

const playerCardsList = document.getElementsByClassName('player-cards-container')[0]

const maxRotateAngle2 = 40
let cardAngleStep2 = maxRotateAngle2*2/(testCardsList.length-1)

for (let i = 0; i<testCardsList.length; i++) {
  const container = document.createElement('div')
  container.classList.add('card-element', 'opened')
  container.style.backgroundImage = 'url("../../Sprites/Card Skins/Release/Skin_01/queen_clubs_01.png")'
  container.style.backgroundSize = '100% 100%'
  container.style.position = 'relative'
  container.style.left = '0px'
  container.style.top = '0px'
  container.style.transform = `rotate(${0 - maxRotateAngle2 + cardAngleStep2 * i}deg)`
  container.style.transformOrigin = 'center bottom'
  playerCardsList.appendChild(container)
}

const cardsDeck = document.getElementsByClassName('cards-deck')[0]

for (let i = 0; i<5; i++) {
  const container = document.createElement('div')
  container.classList.add('card-element', 'closed')
  container.style.backgroundImage = 'url("../../Sprites/CardBacks/Card_Back_01.png")'
  container.style.backgroundSize = '100% 100%'
  container.style.position = 'relative'
  container.style.left = '0px'
  container.style.top = '0px'
  container.style.marginLeft = -1.5 * i + 'px'
  cardsDeck.appendChild(container)
}

const playgroundZone = document.getElementsByClassName('playground-zone')[0]


for (let i = 0; i<3; i++) {
  const container = document.createElement('div')
  container.classList.add('playground-pare-element')

  const firstCard = document.createElement('div')
  const secondCard = document.createElement('div')

  firstCard.classList.add('card-element', 'opened')
  firstCard.style.backgroundImage = 'url("../../Sprites/Card Skins/Release/Skin_01/queen_clubs_01.png")'
  firstCard.style.backgroundSize = '100% 100%'
  firstCard.style.position = 'relative'
  firstCard.style.left = '0px'
  firstCard.style.top = '0px'
  firstCard.style.transform = `rotate(${Math.floor(Math.random()*60-30)}deg)`
  firstCard.style.transformOrigin = 'center'

  secondCard.classList.add('card-element', 'opened')
  secondCard.style.backgroundImage = 'url("../../Sprites/Card Skins/Release/Skin_01/queen_clubs_01.png")'
  secondCard.style.backgroundSize = '100% 100%'
  secondCard.style.position = 'relative'
  secondCard.style.left = '0px'
  secondCard.style.top = '0px'
  secondCard.style.transform = `rotate(${Math.floor(Math.random()*60-30)}deg)`
  secondCard.style.transformOrigin = 'center'
  
  container.appendChild(firstCard)
  container.appendChild(secondCard)

  playgroundZone.appendChild(container)
}
