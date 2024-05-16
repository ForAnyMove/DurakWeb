import { setRemoveClass } from "../../helpers.js";
import { ScreenLogic } from "../navigation.js";

class GameFinishScreen extends ScreenLogic {
    onScreenLoaded(parameters) {
        if (parameters == null) return;
        const { state, reward } = parameters;

        const continueButton = this.screenRoot.querySelector('.continue-button');

        this.defaultSelectedElement = { element: continueButton };
        this.selectableElements.push(this.defaultSelectedElement);

        const popupContainer = this.screenRoot.querySelector('.end-popup_container');
        const betText = this.screenRoot.querySelector('.end-popup_bet-value');
        const prizeText = this.screenRoot.querySelector('.end-popup_reward-value');

        // win-popup/lose-popup/draw-popup
        setRemoveClass(popupContainer, 'lose-popup', state == 'lose');
        setRemoveClass(popupContainer, 'win-popup', state == 'win');
        setRemoveClass(popupContainer, 'draw-popup', state == 'draw');

        betText.innerText = bet;
        prizeText.innerText = reward == null ? 0 : reward.count;

        if (reward != null) {
            user.addItem(reward.type, reward.count);
            parameters.reward = null;
        }

        continueButton.onclick = () => {
            navigation.pop();
            navigation.pop();
        }
    }
}

export { GameFinishScreen }