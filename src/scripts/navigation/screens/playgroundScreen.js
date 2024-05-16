import { ScreenLogic } from "../navigation.js";
import { BattleFlow, Bot, EntityMode, Player, Rule } from "../../../scripts/battleFlow.js"
import { CardsPlayableDeck } from "../../../scripts/cardModel.js"
import { createTweener } from "../../../scripts/dotween/dotween.js"
import { setRemoveClass } from "../../helpers.js";

class PlaygroundScreen extends ScreenLogic {
    onCreate() {

    }

    onScreenLoaded() {
        const rules = gameRules;

        createTweener();

        const botCount = rules.entityMove == EntityMode.Pair ? 3 : rules.numberOfPlayers - 1;
        console.log(botCount);
        const enemiesList = this.screenRoot.querySelectorAll('.enemy-container');

        console.log(enemiesList);
        const bots = [];

        for (let i = 0; i < enemiesList.length; i++) {
            const container = enemiesList[i];
            const element = container.querySelector('.enemy-cards-container');
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
            bots.push(bot);
        }

        const playerCardsDeck = this.screenRoot.querySelector('.player-cards-container');
        const playerCardsWrapper = new CardsPlayableDeck(playerCardsDeck);
        player = new Player(playerCardsWrapper);
        player.setStateText(playerCardsDeck.parentElement.querySelector('.state'));
        player.id = 'player';

        // const playerBot = new Bot(playerCardsWrapper);
        // playerBot.setStateText(playerCardsDeck.parentElement.querySelector('.state'));
        // playerBot.id = 'bot_4'

        this.battleFlow = new BattleFlow([player].concat(bots), rules);
    }

    onScreenUnloaded() {
        if (this.battleFlow) {
            this.battleFlow.clear();
            const elements = Array.from(document.getElementsByClassName('card-element'))
                .concat(Array.from(document.getElementsByClassName('playground-pare-element')));

            for (let i = elements.length - 1; i >= 0; i--) {
                const element = elements[i];
                element.remove();
            }
            this.battleFlow = null;
        }
    }
}

export { PlaygroundScreen }