import { initialLocale } from "../../../localization/translator.js";
import { AchievementView } from "../../achievementView.js";
import { setRemoveClass } from "../../helpers.js";
import { ScreenLogic } from "../navigation.js";

class AchievementsScreen extends ScreenLogic {
    onCreate() {
        const views = [];
        const notificatorBody = document.getElementsByClassName('achievements-tab-open-button')[0].querySelector('.switch-tab-btn-interactive-counter-container');
        const notificatorText = notificatorBody.querySelector('.switch-tab-btn-interactive-counter');

        const achievementsParent = this.screenRoot.querySelector(".achievements_stats-container");
        this.defaultSelectedElement = { element: this.screenRoot.querySelector(".arrow-back-btn") };
        this.selectableElements.push(this.defaultSelectedElement);

        const createAchievementInstances = () => {
            for (let i = 0; i < user.achievements.length; i++) {
                const achievement = user.achievements[i];
                const view = new AchievementView(achievement)

                const element = view.root;

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
                views.push(view)
                achievementsParent.appendChild(element);
            }
        }

        const updateNotificator = () => {
            let readyCount = 0;
            for (let i = 0; i < user.achievements.length; i++) {
                const achievement = user.achievements[i];
                if (achievement.completed) {
                    readyCount++;
                }
            }

            setRemoveClass(notificatorBody, 'hidden-all', readyCount == 0);
            notificatorText.innerText = readyCount;
        }

        user.updateEvent.addListener(() => {
            updateNotificator();

            for (let i = 0; i < views.length; i++) {
                const element = views[i];
                element.updateView();
            }
        });

        createAchievementInstances();
        updateNotificator();

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