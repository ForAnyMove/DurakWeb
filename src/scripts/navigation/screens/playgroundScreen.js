import { ScreenLogic } from "../navigation.js";
import { BattleFlow, Bot, EntityMode, GameMode, Player, Rule } from "../../../scripts/battleFlow.js"
import { CardsPlayableDeck } from "../../../scripts/cardModel.js"
import { createTweener } from "../../../scripts/dotween/dotween.js"
import { getRandomInt, setRemoveClass } from "../../helpers.js";
import { Items, Platform, locales } from "../../statics/staticValues.js";
import { statistics, updateStatistics } from "../../gameStatistics.js";
import { ContentType } from "../../statics/enums.js";
import { getBackgroundImage } from "../../data/card_skin_database.js";
import { initialLocale } from "../../../localization/translator.js";
import { nicknames } from "../../data/namesDatabase.js";
import { avatars } from "../../data/avatarDatabase.js";
import { TutorialFlow } from "../../tutorialFlow.js";
import { showInterstitial } from "../../sdk/sdk.js";

class PlaygroundScreen extends ScreenLogic {
    onCreate() {
        const updateBackground = () => {
            const background = this.screenRoot;
            const skin = user.getContentOfType(ContentType.Background);
            console.log(skin);
            background.style.backgroundImage = getBackgroundImage(skin);
        }
        user.contentUsageChanged.addListener(() => updateBackground());

        updateBackground();
    }

    onScreenLoaded() {
        const rules = isTutorial ? new Rule() : gameRules;
        createTweener();

        const getRandomNickname = () => {
            if (initialLocale == locales[0]) {
                return nicknames.ru[getRandomInt(nicknames.ru.length - 1)];
            }

            return nicknames.en[getRandomInt(nicknames.en.length - 1)];
        }

        const getRandomAvatar = () => {
            return avatars[getRandomInt(avatars.length - 1)];
        }


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
            const name = container.querySelector('.name-container>.name');
            if (name) {
                name.innerText = getRandomNickname();
            }
            const icon = container.querySelector('.portrait>.portrait-icon');
            if (icon) {
                icon.src = getRandomAvatar();
            }
            setRemoveClass(portraits[i], 'ally', false);
            setRemoveClass(portraits[i], 'enemy', true);

            if (i >= botCount) {
                container.style.display = 'none';
                continue;
            }

            container.style.display = 'flex';

            const elementStyle = window.getComputedStyle(element);
            const margin = parseFloat(elementStyle.getPropertyValue('--cards-margin'));
            const width = parseFloat(elementStyle.getPropertyValue('--cards-width'));
            const wrapper = new CardsPlayableDeck(element, { angle: 20, offset: margin, cardWidth: width });
            wrapper.canRemove = false;

            const bot = new Bot(wrapper);
            bot.setStateText(element.parentElement.querySelector('.state'));
            bot.id = (rules.entityMode == EntityMode.Pair && i == 1) ? 'playerSupport' : `bot_${i + 1}`;
            this.bots.push(bot);
        }

        if (rules.entityMode == EntityMode.Pair) {
            console.log('true');
            setRemoveClass(portraits[1], 'ally', true);
            setRemoveClass(portraits[1], 'enemy', false);
        }

        const configureBots = () => {
            for (let i = 0; i < this.bots.length; i++) {
                const bot = this.bots[i];
                bot.lateGameRatio = botsConfiguration.lateGameRatio;
                bot.luck = botsConfiguration.luck;
                bot.maxTossCount = botsConfiguration.maxTossCount;

                console.log(bot);
            }

        }

        const playerCardsDeck = this.screenRoot.querySelector('.player-cards-container');

        const elementStyle = window.getComputedStyle(playerCardsDeck);
        const margin = parseFloat(elementStyle.getPropertyValue('--cards-margin'));
        const width = parseFloat(elementStyle.getPropertyValue('--cards-width'));
        const playerCardsWrapper = new CardsPlayableDeck(playerCardsDeck, { angle: 35, offset: margin, cardWidth: width, needToRecalculateMargins: true });
        player = new Player(playerCardsWrapper);
        player.setStateText(playerCardsDeck.parentElement.querySelector('.state'));
        player.id = 'player';

        const playerBot = new Bot(playerCardsWrapper);
        playerBot.setStateText(playerCardsDeck.parentElement.querySelector('.state'));
        playerBot.id = 'player'

        if (isTutorial) {
            globalGameSpeed = 1;
            this.battleFlow = new TutorialFlow([player].concat(this.bots), rules);
        } else {

            configureBots();

            this.battleFlow = new BattleFlow([player].concat(this.bots), rules);
            this.battleFlow.finishCallback.addListener((result) => {
                input.clearSavedState('tv-gameplay');

                const { winners, loser } = result;
                if (loser == null) {
                    // draw
                    console.log('draw');
                    navigation.pushID('gameFinishScreen', { state: 'draw' });
                    this.updateStatistics('draw', rules);
                    return;
                }

                let isWon = false;
                if (rules.entityMode == EntityMode.Pair) {
                    if ((winners.some(i => i.id == player.id) && winners.some(i => i.id == 'playerSupport'))) {
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
                    this.updateStatistics('win', rules);

                    navigation.pushID('gameFinishScreen', { state: 'win', reward: { type: Items.Currency, count: prize } });
                } else {
                    this.updateStatistics('lose', rules);

                    navigation.pushID('gameFinishScreen', { state: 'lose' });
                }
            });
        }

        const closeButton = this.screenRoot.querySelector('.playground-tab-close-button');
        closeButton.onclick = () => {
            navigation.pushID('exitGameScreen', { isGameExit: true })
        }

        setRemoveClass(closeButton, 'hidden-all', platform == Platform.TV)

        this.selectableElements.push({ element: closeButton })

        const updatePlayerAvatar = () => {
            const icon = this.screenRoot.querySelector('.player-portrait>.portrait-icon');
            if (icon) {
                icon.src = avatars[selectedAvatarIndex];
            }
        }

        updatePlayerAvatar();

        isTutorial = false;
    }

    updateStatistics(state, rules) {
        statistics.gameCount.overall++;
        switch (rules.entityMode) {
            case EntityMode.Self:
                statistics.gameCount.byEntityMode[0].count++;
                break;
            case EntityMode.Pair:
                statistics.gameCount.byEntityMode[1].count++;
                break;
        }

        switch (rules.gameMode) {
            case GameMode.DurakDefault:
                statistics.gameCount.byGameMode[0].count++;
                break;
            case GameMode.DurakTransfare:
                statistics.gameCount.byGameMode[1].count++;
                break;
        }

        switch (state) {
            case 'win': {
                switch (rules.entityMode) {
                    case EntityMode.Self:
                        statistics.winCount.byEntityMode[0].count++;
                        statistics.winInARow.byEntityMode[0].count++;
                        break;
                    case EntityMode.Pair:
                        statistics.winCount.byEntityMode[1].count++;
                        statistics.winInARow.byEntityMode[1].count++;
                        break;
                }

                switch (rules.gameMode) {
                    case GameMode.DurakDefault:
                        statistics.winCount.byGameMode[0].count++;
                        statistics.winInARow.byGameMode[0].count++;
                        break;
                    case GameMode.DurakTransfare:
                        statistics.winCount.byGameMode[1].count++;
                        statistics.winInARow.byGameMode[1].count++;
                        break;
                }

                statistics.winCount.overall++;
                statistics.winInARow.overall++;
                break;
            }
            case 'lose': {
                switch (rules.entityMode) {
                    case EntityMode.Self:
                        statistics.loseCount.byEntityMode[0].count++;
                        statistics.winInARow.byEntityMode[0].count = 0;
                        break;
                    case EntityMode.Pair:
                        statistics.loseCount.byEntityMode[1].count++;
                        statistics.winInARow.byEntityMode[1].count = 0;
                        break;
                }

                switch (rules.gameMode) {
                    case GameMode.DurakDefault:
                        statistics.loseCount.byGameMode[0].count++;
                        statistics.winInARow.byGameMode[0].count = 0;
                        break;
                    case GameMode.DurakTransfare:
                        statistics.loseCount.byGameMode[1].count++;
                        statistics.winInARow.byGameMode[1].count = 0;
                        break;
                }

                statistics.loseCount.overall++;
                statistics.winInARow.overall = 0;
                break;
            }
            case 'draw': {
                switch (rules.entityMode) {
                    case EntityMode.Self:
                        statistics.draw.byEntityMode[0].count++;
                        statistics.winInARow.byEntityMode[0].count = 0;
                        break;
                    case EntityMode.Pair:
                        statistics.draw.byEntityMode[1].count++;
                        statistics.winInARow.byEntityMode[1].count = 0;
                        break;
                }

                switch (rules.gameMode) {
                    case GameMode.DurakDefault:
                        statistics.draw.byGameMode[0].count++;
                        statistics.winInARow.byGameMode[0].count = 0;
                        break;
                    case GameMode.DurakTransfare:
                        statistics.draw.byGameMode[1].count++;
                        statistics.winInARow.byGameMode[1].count = 0;
                        break;
                }

                statistics.draw.overall++;
                statistics.winInARow.overall = 0;
                break;
            }
        }

        updateStatistics();
        showInterstitial();
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