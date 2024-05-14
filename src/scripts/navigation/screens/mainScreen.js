import { getInputElements } from "../../helpers.js";
import { load } from "../../save_system/SaveSystem.js";
import { Items } from "../../statics/staticValues.js";
import { ScreenLogic } from "../navigation.js";

class MainScreen extends ScreenLogic {
    onCreate() {
        const setupCurrencyView = () => {
            this.defaultSelectedElement = { element: document.getElementsByClassName('play-btn')[0] };
            this.selectableElements = getInputElements(document.getElementsByClassName('main-tab')[0], { tags: ['button'] })

            selectedAvatarIndex = load('user_avatar', 0);

            const currencyValueText = document.getElementsByClassName('cash-info-value');

            const updateView = () => {
                for (let i = 0; i < currencyValueText.length; i++) {
                    const text = currencyValueText[i];
                    text.innerHTML = user.getItemCount(Items.Currency);
                }
            }

            user.itemListUpdateEvent.addListener(updateView);
            updateView();
        }

        setupCurrencyView();
    }
}

export { MainScreen }