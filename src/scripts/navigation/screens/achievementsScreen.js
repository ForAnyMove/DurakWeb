import { initialLocale } from "../../../localization/translator.js";
import { createElement, createImage, createTextSpan } from "../../helpers.js";
import { ScreenLogic } from "../navigation.js";

class AchievementsScreen extends ScreenLogic {
    onCreate() {
        const achievementsParent = this.screenRoot.querySelector(".achievements_stats-container");
        this.defaultSelectedElement = { element: this.screenRoot.querySelector(".arrow-back-btn") };
        this.selectableElements.push(this.defaultSelectedElement);

        function createAchievementInstance(data, onInserted) {
            const completed = data.completed;

            const valueText = data.getValueText();
            const progress = data.getCompletionPercent() / 100;
            console.log(progress);
            const plane = createElement('div', ['achievements_stats-list-item-tab']);
            {
                if (completed) {
                    plane.classList.add('shine');

                    plane.onclick = () => {
                        const reward = data.tryCompleteCurrentTrial();
                        if (reward) {
                            const newPlane = createAchievementInstance(data, onInserted);
                            achievementsParent.insertBefore(newPlane, plane);
                            onInserted?.(plane, newPlane);
                            plane.remove();

                            setTimeout(() => user.addItem(reward.type, reward.count, { isTrue: true, isMonetized: false }), 15)
                        }
                    }
                    audioManager.addClickableToPull(plane);
                }
                const container = createElement('div', ['achievements_stats-list-item'], null, plane);
                {
                    const headerCountainer = createElement('div', ['achievements_header-container'], null, container);
                    {
                        const icon = createImage(['achievements_header-icon'], null, headerCountainer, data.icon)
                        const titleContainer = createElement('div', ['achievements_stats-list-item-title-container'], null, headerCountainer); {
                            const title = createTextSpan(['achievements_stats-list-item-title'], null, titleContainer, data.title);
                            title.lang = data.langID;
                        }
                    }
                    if (!data.allTrialsCompleted) {
                        const statsContainer = createElement('div', ['achievements_stats-list-item-progress-container'], null, container);
                        {
                            const progressBar = createElement('div', ['achievements_stats-list-item-progress-level-mask'], null, statsContainer);
                            progressBar.style.scale = `${(0.95 * progress)} 0.95`;
                            const progressText = createTextSpan(['achievements_stats-list-item-progress-title'], null, statsContainer, valueText);
                        }
                    }
                }
            }

            return plane;
        }

        const createAchievementInstances = () => {
            for (let i = 0; i < user.achievements.length; i++) {
                const achievement = user.achievements[i];
                const element = createAchievementInstance(achievement, (oldElement, newElement) => {
                    for (let i = 0; i < this.selectableElements.length; i++) {
                        const element = this.selectableElements[i];
                        if (element.element == oldElement) {
                            this.selectableElements.splice(i, 1);
                        }
                    }
                    const newSelectable = {
                        element: newElement,
                        onSelect: () => {
                            const box = newElement.getBoundingClientRect();
                            const height = box.height;
                            const yCenter = box.top + height / 2;

                            if (yCenter + height / 2 >= achievementsParent.getBoundingClientRect().bottom) {
                                achievementsParent.scrollBy(0, height)
                            } else if (yCenter - height / 2 <= achievementsParent.getBoundingClientRect().top) {
                                achievementsParent.scrollBy(0, -height)
                            }
                        }
                    }

                    this.selectableElements.push(newSelectable);
                    input.updateQueryCustom(this.selectableElements, newSelectable);
                });

                const selectable = {
                    element: element,
                    onSelect: () => {
                        const box = element.getBoundingClientRect();
                        const height = box.height;
                        const yCenter = box.top + height / 2;

                        if (yCenter + height / 2 >= achievementsParent.getBoundingClientRect().bottom) {
                            achievementsParent.scrollBy(0, height)
                        } else if (yCenter - height / 2 <= achievementsParent.getBoundingClientRect().top) {
                            achievementsParent.scrollBy(0, -height)
                        }
                    }
                }

                this.selectableElements.push(selectable);
                achievementsParent.appendChild(element);
            }
        }

        createAchievementInstances();

        languageChangeEvent.invoke(initialLocale);
    }

    onScreenLoaded = () => {
        const achievementsParent = this.screenRoot.querySelector(".achievements_stats-container");
        achievementsParent.scrollTo(0, 0);
    }

    onScreenUnloaded = () => {

    }
}

export { AchievementsScreen }