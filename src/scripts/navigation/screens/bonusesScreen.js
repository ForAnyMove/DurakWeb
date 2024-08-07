import { load, save } from "../../save_system/SaveSystem.js";
import { showRewarded } from "../../sdk/sdk.js";
import { Content, Items, Platform } from "../../statics/staticValues.js";
import { Timer } from "../../timer.js";
import { ScreenLogic } from "../navigation.js";

class BonusesScreen extends ScreenLogic {

    onCreate() {
        this.defaultSelectedElement = { element: this.screenRoot.querySelector('.arrow-back-btn') }
        this.selectableElements.push(this.defaultSelectedElement);

        const time = 24 * 60 * 60;

        const data = this.loadData();
        const staticData = [
            {
                reward: {
                    items: [{ type: Items.Currency, count: 100 }]
                },
                timers: []
            }, {
                reward: {
                    items: [{ type: Items.Currency, count: 200 }]
                },
                timers: []
            }, {
                reward: {
                    content: [Content.CardBackSkin05]
                }, timerFinishCallback: () => {
                    user.removeContent(Content.CardBackSkin05)
                },
                timers: [
                    document.getElementById(Content.CardBackSkin05.id)?.querySelector('.collection-skin-timer')
                ]
            }, {
                reward: {
                    content: [Content.Background05]
                }, timerFinishCallback: () => {
                    user.removeContent(Content.Background05)
                },
                timers: [
                    document.getElementById(Content.Background05.id)?.querySelector('.collection-skin-timer')
                ]
            }, {
                reward: {
                    content: [Content.CardSkin05]
                }, timerFinishCallback: () => {
                    user.removeContent(Content.CardSkin05)
                },
                timers: [
                    document.getElementById(Content.CardSkin05.id)?.querySelector('.collection-skin-timer')
                ]
            },
        ]

        const views = this.screenRoot.querySelectorAll('.bonuses_bonus-container');
        for (let i = 0; i < views.length; i++) {
            staticData[i].timers.push(views[i].querySelector('.bonuses_timer'))
            this.selectableElements.push({ element: views[i] });
        }

        const updateView = () => {
            for (let i = 0; i < data.length; i++) {
                const dataElement = data[i];
                const view = views[i];
                if (!dataElement.obtainded && !dataElement.opened) {
                    if (!view.classList.contains('locked')) {
                        view.classList.add('locked')
                    }
                    view.classList.remove('checked')
                    view.classList.remove('opened')
                } else if (dataElement.obtainded) {
                    if (!view.classList.contains('checked')) {
                        view.classList.add('checked')
                    }
                    view.classList.remove('opened')
                    view.classList.remove('locked')
                } else if (!view.classList.contains('opened')) {
                    view.classList.remove('checked')
                    view.classList.add('opened')
                    view.classList.remove('locked')
                }
            }
        }

        const finishTimer = (index) => {
            staticData[index].timerFinishCallback?.();
            data[index].obtainded = false;
            const nextDataElement = data[index + 1];
            if (nextDataElement != null) {
                nextDataElement.opened = true;
            }

            this.save(data);
            updateView();
        }

        for (let i = 0; i < data.length; i++) {
            const dataElement = data[i];
            const nextDataElement = data[i + 1];
            const view = views[i];

            if (dataElement.obtainded) {
                const timer = new Timer(`timer_${i}`, staticData[i].timers);
                const currentTime = Date.now();
                const difference = (currentTime - dataElement.time) / 1000;
                if (difference > time) {
                    finishTimer(i);

                    this.save();
                } else {
                    timer.startTimerUnscaled(time - difference, () => {
                        timer.clear();

                        finishTimer(i);
                    })
                }
            }

            view.onclick = () => {
                if (dataElement.obtainded || !dataElement.opened) return;
                audioManager.playSound();

                showRewarded(null, null, () => {
                    if (platform != Platform.TV)
                        if (nextDataElement != null) {
                            nextDataElement.opened = true;
                        }

                    dataElement.obtainded = true;
                    const reward = staticData[i].reward;

                    if (reward.items) {
                        for (let i = 0; i < reward.items.length; i++) {
                            const element = reward.items[i];
                            user.addItem(element.type, element.count, { isTrue: true });
                        }
                    }
                    if (reward.content) {
                        for (let i = 0; i < reward.content.length; i++) {
                            const element = reward.content[i];
                            user.addContent(element, { isTrue: true });
                        }
                    }

                    const currentTime = Date.now();
                    dataElement.time = currentTime;
                    const timer = new Timer(`timer_${i}`, staticData[i].timers);
                    timer.startTimerUnscaled(time, () => {
                        timer.clear();

                        finishTimer(i);
                    })

                    this.save(data);
                    updateView();
                }, null)
            }
        }

        updateView();
    }

    loadData = () => {
        const defaultData = [
            {
                reward: {
                    items: [{ type: Items.Currency, count: 100 }]
                },
                obtainded: false,
                time: -1,
                opened: true
            },
            {
                reward: {
                    items: [{ type: Items.Currency, count: 200 }]
                },
                obtainded: false,
                time: -1,
                opened: false
            },
            {
                reward: {
                    content: [Content.CardBackSkin02]
                },
                obtainded: false,
                time: -1,
                opened: false
            },
            {
                reward: {
                    content: [Content.Background02]
                },
                obtainded: false,
                time: -1,
                opened: false
            },
            {
                reward: {
                    content: [Content.CardSkin02]
                },
                obtainded: false,
                time: -1,
                opened: false
            },
        ]

        return load('bonuses', defaultData);
    }

    save = (data) => {
        save('bonuses', data)
    }
}

export { BonusesScreen }