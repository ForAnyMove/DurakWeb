import { statistics, updateEvent } from "./gameStatistics.js";
import { setRemoveClass } from "./helpers.js";
import { load, save } from "./save_system/SaveSystem.js"
import { Content } from "./statics/staticValues.js"

class UserStatus {
    constructor(screenRoot) {
        const staticData = [
            {
                reward: {
                    content: [Content.CardSkin02]
                }, targetValue: 0,
            },
            {
                reward: {
                    content: [Content.Background02]
                }, targetValue: 500,
            },
            {
                reward: {
                    content: [Content.CardBackSkin02]
                }, targetValue: 1000,
            },
            {
                reward: {
                    content: [Content.CardSkin03]
                }, targetValue: 2000,
            },
            {
                reward: {
                    content: [Content.Background03]
                }, targetValue: 5000,
            },
            {
                reward: {
                    content: [Content.CardBackSkin03]
                }, targetValue: 10000,
            },
            {
                reward: {
                    content: [Content.CardSkin04]
                }, targetValue: 50000,
            },
            {
                reward: {
                    content: [Content.Background04]
                }, targetValue: 100000,
            }];

        const data = this.loadData();

        this.views = Array.from(screenRoot.querySelectorAll('.profile-status-item')).reverse();
        const progressBars = Array.from(screenRoot.querySelectorAll('.profile-status-loading')).reverse();
        const obtainReward = (index) => {
            const reward = staticData[index].reward;
            if (reward.items) {
                for (let i = 0; i < reward.items.length; i++) {
                    const element = reward.items[i];
                    user.addItem(element.type, element.count);
                }
            }

            if (reward.content) {
                for (let i = 0; i < reward.content.length; i++) {
                    const element = reward.content[i];
                    user.addContent(element);
                }
            }

            data[index] = true;
            this.saveData(data);
        }

        const initialize = () => {
            for (let i = 0; i < this.views.length; i++) {
                const view = this.views[i];
                const obtained = data[i];
                if (obtained) {
                    view.classList.add('profile-status-item_obtained'); continue;
                }

                view.onclick = () => {
                    if (!data[i] && view.classList.contains('profile-status-item_completed')) {
                        obtainReward(i);

                        view.classList.add('profile-status-item_obtained');
                    }
                }
            }
        }

        const updateState = () => {
            const currentCurrecyValue = statistics.maxCurrencyCollected;

            for (let i = 0; i < this.views.length; i++) {
                const view = this.views[i];
                const progressBar = progressBars[i];
                const staticDataElement = staticData[i];

                setRemoveClass(view, 'profile-status-item_completed', currentCurrecyValue >= staticDataElement.targetValue);

                const percent = staticDataElement.targetValue <= 0 ? 100 : Math.floor(Math.min(1, currentCurrecyValue / staticDataElement.targetValue) * 100);
                progressBar.style.width = `${percent}%`
            }
        }

        updateEvent.addListener(() => {
            updateState();
        })

        initialize();
        updateState();
    }

    loadData = () => {
        const defaultData = [false, false, false, false, false, false, false, false];
        return load('user_status_01', defaultData);
    }

    saveData = (data) => {
        save('user_status_01', data)
    }
}

export { UserStatus }