import { processExit } from "../../sdk/sdk.js";
import { ScreenLogic } from "../navigation.js";

class GlobalExitGameScreen extends ScreenLogic {
    onScreenLoaded(parameters) {
        const acceptButton = this.screenRoot.querySelector('.exit-yes');
        acceptButton.onclick = () => {
            audioManager.playSound();
            processExit();
        }
    }
}

export { GlobalExitGameScreen }