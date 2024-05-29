import { ScreenLogic } from "../navigation.js";

class ExitGameScreen extends ScreenLogic {
    onCreate() {
        this.defaultSelectedElement = { element: this.screenRoot.querySelector('.exit-no') };
        this.selectableElements.push(this.defaultSelectedElement);
        this.selectableElements.push({ element: this.screenRoot.querySelector('.exit-yes') });
    }
    onScreenLoaded(parameters) {
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