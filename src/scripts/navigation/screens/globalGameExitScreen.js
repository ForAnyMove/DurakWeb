import { processExit } from "../../sdk/sdk.js";
import { ScreenLogic } from "../navigation.js";

class GlobalExitGameScreen extends ScreenLogic {
    onScreenLoaded(parameters) {
        console.log(parameters);
        const acceptButton = this.screenRoot.querySelector('.exit-yes');
        if (parameters != null) {
            const { isGameExit } = parameters;
            if (isGameExit) {
                acceptButton.onclick = () => {
                    processExit();
                }
            }
        }
    }
}

export { GlobalExitGameScreen }