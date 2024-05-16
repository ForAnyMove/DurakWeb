import { ScreenLogic } from "../navigation.js";

class ExitGameScreen extends ScreenLogic {
    onScreenLoaded(parameters) {
        console.log(parameters);
        const acceptButton = this.screenRoot.querySelector('.exit-yes');
        if (parameters != null) {
            const { isGameExit } = parameters;
            if (isGameExit) {
                acceptButton.onclick = () => {
                    acceptButton.onclick = null;
                    navigation.pop();
                    navigation.pop();
                }
            }
        }
    }
}

export { ExitGameScreen }