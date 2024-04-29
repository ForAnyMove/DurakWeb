import { getElements, setDynamicContainerText, setDynamicFontSize } from "../scripts/helpers.js";
import { initialLocale } from "./translator.js";

export default class DynamicFontChanger {
    constructor() {
        this.texts = [];
        this.containers = [];
        this.updateElementsPull();

        if (languageChangeEvent) { languageChangeEvent.addListener(this.updateTextFont); }
        window.addEventListener('resize', this.updateTextFont)

        this.updateTextFont();
    }

    updateElementsPull = function () {
        const isVisible = (element) => {
            function isElementHidden(element) {
                var computedStyle = window.getComputedStyle(element);

                if (computedStyle.display === 'none') {
                    return true;
                }

                var parent = element.parentElement;
                while (parent) {
                    if (window.getComputedStyle(parent).display === 'none') {
                        return true;
                    }
                    parent = parent.parentElement;
                }
                return false;
            }
            const computedStyle = window.getComputedStyle(element);
            return computedStyle.visibility !== 'hidden' && !isElementHidden(element) && computedStyle.pointerEvents != 'none';
        }

        this.containers = [];
        this.texts = getElements(document, { tags: ['span', 'p', 'h1', 'h2', 'h3'] });

        const getContainer = (parent) => {
            for (let i = 0; i < this.containers.length; i++) {
                const container = this.containers[i];
                if (container.container == parent) {
                    return container;
                }
            }

            return null;
        }

        for (let i = 0; i < this.texts.length; i++) {
            const text = this.texts[i];
            // if (!isVisible(text)) continue;
            const parent = text.parentElement;
            if (parent.classList.contains('ignore-DFC')) continue;

            const sameContainer = getContainer(parent);
            if (sameContainer != null) {
                sameContainer.elements.push(text);
            } else {
                this.containers.push({
                    container: parent,
                    elements: [text]
                })
            }
        }
    }

    update = function () {
        this.updateElementsPull();
        this.updateTextFont();
    }

    updateTextFont = () => {
        for (let i = 0; i < this.containers.length; i++) {
            const container = this.containers[i];
            setDynamicContainerText(initialLocale, container, true);
        }
    }

    updateContainer = function (container) {
        for (let i = 0; i < this.containers.length; i++) {
            const element = this.containers[i];
            if (element.container == container) {
                setDynamicContainerText(initialLocale, element, true);
            }
        }
    }
}