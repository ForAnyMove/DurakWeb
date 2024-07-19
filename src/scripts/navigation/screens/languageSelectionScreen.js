import { initialLocale } from "../../../localization/translator.js";
import { locales } from "../../statics/staticValues.js";
import { ScreenLogic } from "../navigation.js";

class LanguageSelectionScreen extends ScreenLogic {
    onCreate() {
        this.defaultSelectedElement = { element: this.screenRoot.querySelector('.languages-close-button') }
        this.selectableElements.push(this.defaultSelectedElement);

        const uncheckedIcon = './Sprites/Desktop - дурак- настройки/Group 54 4x 451329194.png'
        const checkedIcon = './Sprites/Desktop - дурак- настройки/Group 54 4x -1518726756.png'

        const selectors = Array.from(this.screenRoot.querySelectorAll('.language-container'));

        const languageSelectorStructs = [];

        for (let i = 0; i < selectors.length; i++) {
            const selector = selectors[i];
            const check = selector.querySelector('.settings_checkbox');

            const selectorStruct = {
                locale: locales[i],
                selector: selector,
                check: check,
                select: () => {
                    for (let j = 0; j < languageSelectorStructs.length; j++) {
                        const element = languageSelectorStructs[j];
                        element.check.src = element == selectorStruct ? checkedIcon : uncheckedIcon;
                    }

                    languageChangeEvent.invoke(selectorStruct.locale);
                }
            };

            selector.onclick = () => {
                audioManager.playSound();

                selectorStruct.select();
            };

            this.selectableElements.push({ element: selector })

            languageSelectorStructs.push(selectorStruct)
        }

        for (let i = 0; i < languageSelectorStructs.length; i++) {
            const element = languageSelectorStructs[i];
            if (element.locale == initialLocale) {
                element.select();
                break;
            }
        }
    }
}

export { LanguageSelectionScreen }