import { setRemoveClass } from "./helpers.js";

class Button {
    constructor(selectableList, clickableElement) {
        const selectable = { element: clickableElement };
        for (let i = 0; i < selectableList.length; i++) {
            const element = selectableList[i];
            if (element.element == clickableElement) return false;
        }

        this.element = clickableElement;
        selectableList.push(selectable);
        return true;
    }
}

class StateButton extends Button {
    constructor(selectableList, clickableElement, initialState, onClicked) {
        if (!super(selectableList, clickableElement)) return;

        this.selected = initialState;

        clickableElement.onclick = () => {
            this.selected = !this.selected;
            onClicked?.(this.selected);
        }

        setTimeout(() => {
            onClicked?.(this.selected);
        }, 0)
    }
}

class SequentlyChoosingButton {
    constructor(selectableList, arrowInputElement, previousButton, nextButton, initialLevel, level, onClicked, canClick) {
        this.maxCount = level;
        this.currentLevel = initialLevel;
        this.onClicked = onClicked;

        const defineSelectable = () => {
            if (arrowInputElement != null) {
                for (let i = 0; i < selectableList.length; i++) {
                    const element = selectableList[i];
                    if (element.element == arrowInputElement) return;
                }
                const selectable = {
                    element: arrowInputElement, onSubmit: () => {
                        if (canClick == null || canClick()) {
                            this.currentLevel = (this.currentLevel + 1) % (this.maxCount);
                            this.select(this.currentLevel);
                        }
                    }
                };

                selectableList.push(selectable);
            } else {
                selectableList.push({ element: previousButton });
                selectableList.push({ element: nextButton });
            }
        }

        defineSelectable();

        nextButton.onclick = () => {
            if (canClick == null || canClick()) {
                this.currentLevel = (this.currentLevel + 1) % (this.maxCount);
                this.select(this.currentLevel);
            }
        }

        previousButton.onclick = () => {
            if (canClick == null || canClick()) {
                this.currentLevel = this.currentLevel - 1;
                if (this.currentLevel < 0) {
                    this.currentLevel = this.maxCount - 1;
                }

                this.select(this.currentLevel);
            }
        }

        setTimeout(() => {
            this.select(this.currentLevel);
        }, 0)
    }

    select = (index) => {
        this.currentLevel = index;
        this.onClicked?.(index);
    }
}

class Tabs {
    constructor(options = { selectableElements, tabElements, initialTabSelected, onSelected, selectedClass }) {


        this.selected = options.initialTabSelected;

        for (let i = 0; i < options.tabElements.length; i++) {
            const element = options.tabElements[i];

            element.onclick = () => {
                for (let j = 0; j < options.tabElements.length; j++) {
                    if (i == j) {
                        this.selected = i;
                        options.onSelected?.(this.selected);
                    }
                    setRemoveClass(options.tabElements[j], options.selectedClass, i == j)
                }
            }

            options.selectableElements.push({ element: element });
        }

        options.onSelected?.(this.selected);
    }
}

export { Button, StateButton, SequentlyChoosingButton, Tabs }