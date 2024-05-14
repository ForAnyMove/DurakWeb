import { EntityMode, GameMode } from "../../battleFlow.js";
import { SequentlyChoosingButton, Tabs } from "../../button.js";
import { setRemoveClass } from "../../helpers.js";
import { showRewarded } from "../../sdk/sdk.js";
import { Items } from "../../statics/staticValues.js";
import { ScreenLogic } from "../navigation.js";

class GameSettingsScreen extends ScreenLogic {
    onCreate() {

        this.defaultSelectedElement = { element: this.screenRoot.querySelector('.arrow-back-btn') }
        this.selectableElements.push(this.defaultSelectedElement);
        const playerNumberContainer = this.screenRoot.querySelectorAll('.start-game_slider-container_dark')[1];

        const gameModeContainer = this.screenRoot.querySelectorAll('.start-game_mode-btns-container')[0];
        new Tabs({
            selectableElements: this.selectableElements,
            tabElements: Array.from(gameModeContainer.querySelectorAll('.start-game_switch-mode-btn')),
            initialTabSelected: 0,
            selectedClass: 'start-game_switch-mode-btn_active',
            onSelected: (index) => {
                const gameMode = [GameMode.DurakDefault, GameMode.DurakTransfare][index];

                gameRules.gameMode = gameMode;
            }
        });

        const cardsNumberContainer = this.screenRoot.querySelectorAll('.start-game_slider-container_dark')[0];
        new SequentlyChoosingButton(
            this.selectableElements,
            cardsNumberContainer,
            cardsNumberContainer.querySelector('.arrow-left'),
            cardsNumberContainer.querySelector('.arrow-right'),
            0,
            2,
            (level) => {
                const cardsCount = [36, 52][level];

                const text = cardsNumberContainer.querySelector('.start-game_uptitle');
                text.innerText = cardsCount;

                gameRules.cardsCount = cardsCount;
            });

        const playerNumberSelector = new SequentlyChoosingButton(
            this.selectableElements,
            playerNumberContainer,
            playerNumberContainer.querySelector('.arrow-left'),
            playerNumberContainer.querySelector('.arrow-right'),
            0,
            3,
            (level) => {
                const playerCount = level + 2;

                const text = playerNumberContainer.querySelector('.start-game_uptitle');
                text.innerText = playerCount

                gameRules.numberOfPlayers = playerCount;
            }, () => {
                return gameRules.entityMode != EntityMode.Pair
            });

        let lastSelectedPlayersNumberIndex = 0;
        const entityModeContainer = this.screenRoot.querySelectorAll('.start-game_mode-btns-container')[1];
        new Tabs({
            selectableElements: this.selectableElements,
            tabElements: Array.from(entityModeContainer.querySelectorAll('.start-game_switch-mode-btn')),
            initialTabSelected: 0,
            selectedClass: 'start-game_switch-mode-btn_active',
            onSelected: (index) => {
                const entityMode = [EntityMode.Self, EntityMode.Pair][index];
                if (gameRules.entityMode == entityMode) return;

                gameRules.entityMode = entityMode;
                if (gameRules.entityMode == EntityMode.Pair) {
                    lastSelectedPlayersNumberIndex = playerNumberSelector.currentLevel;
                    playerNumberSelector.select(2);
                } else {
                    playerNumberSelector.select(lastSelectedPlayersNumberIndex)
                }
                setRemoveClass(playerNumberContainer, 'inactive', gameRules.entityMode == EntityMode.Pair)
            }
        });

        const startButton = this.screenRoot.querySelector('.start-game_play-btn');
        startButton.onclick = () => {
            // start game scene
        }

        this.selectableElements.push({ element: startButton });

        const rewardedCurrencyButton = this.screenRoot.querySelector('.start-game_watch-add-btn');
        rewardedCurrencyButton.onclick = () => {
            showRewarded(null, null, () => {
                user.addItem(Items.Currency, 500);
            }, null);
        }

        this.selectableElements.push({ element: rewardedCurrencyButton });

    }
}

export { GameSettingsScreen }