import { SequentlyChoosingButton } from "../../button.js";
import { avatars } from "../../data/avatarDatabase.js";
import { load, save } from "../../save_system/SaveSystem.js";
import { ScreenLogic } from "../navigation.js";

class AvatarSelectionScreen extends ScreenLogic {
    onCreate() {
        const icon = this.screenRoot.querySelector('.choose-avatar_avatar-icon');
        selectedAvatarIndex = load('user_avatar', 0);

        this.defaultSelectedElement = { element: this.screenRoot.querySelector('.choose-avatar-tab-close-button'), }
        this.selectableElements.push(this.defaultSelectedElement);

        new SequentlyChoosingButton(
            this.selectableElements,
            null,
            this.screenRoot.querySelector('.arrow-left'),
            this.screenRoot.querySelector('.arrow-right'),
            selectedAvatarIndex,
            avatars.length,
            (level) => {
                icon.src = avatars[level];

                selectedAvatarIndex = level;
                save('user_avatar', selectedAvatarIndex);
            });
    }
}

export { AvatarSelectionScreen }