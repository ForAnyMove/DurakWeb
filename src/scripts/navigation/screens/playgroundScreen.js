import { ScreenLogic } from "../navigation.js";
import { BattleFlow, Bot, EntityMode, Player, Rule } from "../../../scripts/battleFlow.js"
import { CardsPlayableDeck } from "../../../scripts/cardModel.js"
import { createTweener } from "../../../scripts/dotween/dotween.js"
import { setRemoveClass } from "../../helpers.js";
import { Items } from "../../statics/staticValues.js";

class PlaygroundScreen extends ScreenLogic {
    onCreate() {

    }

    onScreenLoaded() {
        const rules = gameRules;

        createTweener();

        const botCount = rules.entityMode == EntityMode.Pair ? 3 : rules.numberOfPlayers - 1;
        const enemiesList = Array.from(this.screenRoot.querySelectorAll('.enemy-container'));
        const portraits = [];
        enemiesList.forEach(item => {
            portraits.push(item.querySelector('.enemy-portrait'))
        })

        this.bots = [];

        for (let i = 0; i < enemiesList.length; i++) {
            const container = enemiesList[i];
            const element = container.querySelector('.enemy-cards-container');
            setRemoveClass(portraits[i], 'ally', false);
            setRemoveClass(portraits[i], 'enemy', true);

            if (i >= botCount) {
                container.style.display = 'none';
                continue;
            }

            container.style.display = 'flex';

            const wrapper = new CardsPlayableDeck(element, { angle: 20, offset: -3 });
            wrapper.canRemove = false;

            const bot = new Bot(wrapper);
            bot.setStateText(element.parentElement.querySelector('.state'));
            bot.id = `bot_${i + 1}`;
            this.bots.push(bot);
        }
        console.log(rules);

        if (rules.entityMode == EntityMode.Pair) {
            console.log('true');
            setRemoveClass(portraits[1], 'ally', true);
            setRemoveClass(portraits[1], 'enemy', false);
        }

        const playerCardsDeck = this.screenRoot.querySelector('.player-cards-container');
        const playerCardsWrapper = new CardsPlayableDeck(playerCardsDeck);
        player = new Player(playerCardsWrapper);
        player.setStateText(playerCardsDeck.parentElement.querySelector('.state'));
        player.id = 'player';

        const playerBot = new Bot(playerCardsWrapper);
        playerBot.setStateText(playerCardsDeck.parentElement.querySelector('.state'));
        playerBot.id = 'player'

        this.battleFlow = new BattleFlow([playerBot].concat(this.bots), rules);
        this.battleFlow.finishCallback.addListener((result) => {
            console.log(result);
            const { winners, loser } = result;
            if (loser == null) {
                // draw
                console.log('draw');
                navigation.pushID('gameFinishScreen', { state: 'draw' });
                return;
            }

            let isWon = false;
            if (rules.entityMode == EntityMode.Pair) {
                if ((winners.some(i => i.id == player.id) && winners.some(i => i.id == this.bots[1].id))) {
                    isWon = true;
                }
            } else if (winners.some(i => i.id == player.id)) {
                isWon = true;
            }
            console.log(isWon);

            if (isWon) {
                let multiplier = botCount + 1;
                for (let i = 0; i < result.winners.length; i++) {
                    const winner = result.winners[i];

                    if (winner.id == player.id) break;
                    multiplier /= 2;
                }

                const prize = Math.floor(multiplier * bet);
                navigation.pushID('gameFinishScreen', { state: 'win', reward: { type: Items.Currency, count: prize } });
            } else {
                navigation.pushID('gameFinishScreen', { state: 'lose' });
            }
        });

        const closeButton = this.screenRoot.querySelector('.playground-tab-close-button');
        closeButton.onclick = () => {
            navigation.pushID('exitGameScreen', { isGameExit: true })
        }

        this.selectableElements.push({ element: closeButton })
    }

    onScreenUnloaded() {
        if (this.battleFlow) {
            this.battleFlow.clear();
            const elements = Array.from(document.getElementsByClassName('card-element'));
            // .concat(Array.from(document.getElementsByClassName('playground-pare-element')));

            for (let i = elements.length - 1; i >= 0; i--) {
                const element = elements[i];
                element.remove();
            }

            this.battleFlow = null;
            player = null;
            for (let i = 0; i < this.bots.length; i++) {
                this.bots[i] = null;
            }
        }
    }
}

export { PlaygroundScreen }