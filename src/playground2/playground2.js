import { BattleFlow, Bot, Player } from "../scripts/battleFlow.js"
import { CardsPlayableDeck } from "../scripts/cardModel.js"
import { createTweener } from "../scripts/dotween/dotween.js"
import { createLevel } from "../scripts/levelCreator.js"

createTweener();

const enemiesList = document.getElementsByClassName('enemy-cards-container');
const bots = [];

for (let i = 0; i < enemiesList.length; i++) {
  const element = enemiesList[i];

  const wrapper = new CardsPlayableDeck(element, { angle: 20, offset: -3 });
  wrapper.canRemove = false;

  const bot = new Bot(wrapper);
  bot.setStateText(element.parentElement.querySelector('.state'));
  bot.id = `bot_${i + 1}`;
  bots.push(bot);
}

const playerCardsDeck = document.getElementsByClassName('player-cards-container')[0];
const playerCardsWrapper = new CardsPlayableDeck(playerCardsDeck);

const result = createLevel();

player = new Player(playerCardsWrapper);
player.setStateText(playerCardsDeck.parentElement.querySelector('.state'));
player.id = 'player';

const playerBot = new Bot(playerCardsWrapper);
playerBot.setStateText(playerCardsDeck.parentElement.querySelector('.state'));
playerBot.id = 'bot_4'

const battleFlow = new BattleFlow([player].concat(bots), result.mainCardColumn);
// const battleFlow = new BattleFlow([bots[0], player], result.mainCardColumn);