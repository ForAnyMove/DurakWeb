import { initialLocale } from "../../../localization/translator.js";
import { SequentlyChoosingButton, StateButton } from "../../button.js";
import { ScreenLogic } from "../navigation.js";

class SettingsScreen extends ScreenLogic {
    onCreate() {
        this.defaultSelectedElement = { element: this.screenRoot.querySelector('.arrow-back-btn') }
        this.selectableElements.push(this.defaultSelectedElement);

        const uncheckedIcon = './Sprites/Desktop - дурак- настройки/Group 54 4x 451329194.png'
        const checkedIcon = './Sprites/Desktop - дурак- настройки/Group 54 4x -1518726756.png'

        const soundButton = new StateButton(
            this.selectableElements,
            this.screenRoot.querySelectorAll('.settings_tune-switch-container')[0],
            audioManager.isSoundEnabled,
            (stateIsTrue) => {
                const checkbox = soundButton.element.querySelector('.settings_checkbox');
                checkbox.src = stateIsTrue ? checkedIcon : uncheckedIcon;

                audioManager.setSoundState(stateIsTrue);
            });
        const musicButton = new StateButton(
            this.selectableElements,
            this.screenRoot.querySelectorAll('.settings_tune-switch-container')[1],
            audioManager.isMusicEnabled,
            (stateIsTrue) => {
                const checkbox = musicButton.element.querySelector('.settings_checkbox');
                checkbox.src = stateIsTrue ? checkedIcon : uncheckedIcon;

                audioManager.setMusicState(stateIsTrue);
            });
        const sortButton = new StateButton(
            this.selectableElements,
            this.screenRoot.querySelectorAll('.settings_tune-switch-container')[2],
            false,
            (stateIsTrue) => {
                const checkbox = sortButton.element.querySelector('.settings_checkbox');
                checkbox.src = stateIsTrue ? checkedIcon : uncheckedIcon;
            });

        const gameSpeedButtonContainer = this.screenRoot.querySelectorAll('.settings_slider-container_dark')[0];
        const gameSpeedSelector = new SequentlyChoosingButton(
            this.selectableElements,
            gameSpeedButtonContainer,
            gameSpeedButtonContainer.querySelector('.arrow-left'),
            gameSpeedButtonContainer.querySelector('.arrow-right'),
            0,
            4,
            (level) => {
                const gameSpeed = level + 1;

                const text = gameSpeedButtonContainer.querySelector('.settings_game-speed');
                text.innerText = gameSpeed;

                globalGameSpeed = gameSpeed;
                // globalGameSpeed = 8;
            });


        const bostDifficult = [
            {
                lateGameRatio: 0,
                luck: 0,
                maxTossCount: 0
            }, {
                lateGameRatio: 0,
                luck: 0.25,
                maxTossCount: 1
            }, {
                lateGameRatio: 0.1,
                luck: 0.5,
                maxTossCount: 2
            }, {
                lateGameRatio: 0.2,
                luck: 0.85,
                maxTossCount: 4
            },
        ]

        const gameDifficultButtonContainer = this.screenRoot.querySelectorAll('.settings_slider-container_dark')[1];
        const gameDifficultSelector = new SequentlyChoosingButton(
            this.selectableElements,
            gameDifficultButtonContainer,
            gameDifficultButtonContainer.querySelector('.arrow-left'),
            gameDifficultButtonContainer.querySelector('.arrow-right'),
            0,
            4,
            (level) => {
                const text = gameDifficultButtonContainer.querySelector('.settings_difficult');
                const innerText = [
                    'MainMenu/SystemSettings/Difficulty/Easy',
                    'MainMenu/SystemSettings/Difficulty/Normal',
                    'MainMenu/SystemSettings/Difficulty/Hard',
                    'MainMenu/SystemSettings/Difficulty/Ultra'
                ]
                botsConfiguration = bostDifficult[level];
                text.lang = innerText[level];
                languageChangeEvent.invoke(initialLocale);
            });

        const tutorialButton = this.screenRoot.querySelector('.tutorial-btn');
        tutorialButton.onclick = () => {
            // start tutorial
            isTutorial = true;
            navigation.pushID('playground');
        }

        this.selectableElements.push({ element: tutorialButton });

        const languageButton = this.screenRoot.querySelector('.languages-open-button');
        languageButton.onclick = () => {
            navigation.pushID('languagesScreen');
        }

        this.selectableElements.push({ element: languageButton });

    }
}

export { SettingsScreen }