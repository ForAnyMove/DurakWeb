import { SequentlyChoosingButton } from "../../button.js";
import { save } from "../../save_system/SaveSystem.js";
import { ScreenLogic } from "../navigation.js";

class AvatarSelectionScreen extends ScreenLogic {
    onCreate() {
        this.defaultSelectedElement = { element: this.screenRoot.querySelector('.choose-avatar-tab-close-button'), }
        this.selectableElements.push(this.defaultSelectedElement);

        const icons = [
            './Sprites/Avatars/avatar-1_part1.png',
            './Sprites/Avatars/avatar-2_part1.png',
            './Sprites/Avatars/avatar-4_part1.png',
        ]

        new SequentlyChoosingButton(
            this.selectableElements,
            null,
            this.screenRoot.querySelector('.arrow-left'),
            this.screenRoot.querySelector('.arrow-right'),
            0,
            icons.length,
            (level) => {
                const icon = this.screenRoot.querySelector('.choose-avatar_avatar-icon');
                icon.src = icons[level];

                selectedAvatarIndex = level;
                save('user_avatar', selectedAvatarIndex);
            });
    }
}

export { AvatarSelectionScreen }