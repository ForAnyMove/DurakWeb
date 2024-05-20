import { SequentlyChoosingButton } from "../../button.js";
import { avatars } from "../../data/avatarDatabase.js";
import { load, save } from "../../save_system/SaveSystem.js";
import { ScreenLogic } from "../navigation.js";

class AvatarSelectionScreen extends ScreenLogic {
    onCreate() {
        selectedAvatarIndex = load('user_avatar', 0);

        this.defaultSelectedElement = { element: this.screenRoot.querySelector('.choose-avatar-tab-close-button'), }
        this.selectableElements.push(this.defaultSelectedElement);

        new SequentlyChoosingButton(
            this.selectableElements,
            null,
            this.screenRoot.querySelector('.arrow-left'),
            this.screenRoot.querySelector('.arrow-right'),
            0,
            avatars.length,
            (level) => {
                const icon = this.screenRoot.querySelector('.choose-avatar_avatar-icon');
                icon.src = avatars[level];

                selectedAvatarIndex = level;
                save('user_avatar', selectedAvatarIndex);
            });
    }
}

export { AvatarSelectionScreen }