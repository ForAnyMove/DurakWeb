import { setRemoveClass } from "../../helpers.js";
import { UserStatus } from "../../userStatus.js";
import { ScreenLogic } from "../navigation.js";

class ProfileScreen extends ScreenLogic {
    onCreate() {
        this.defaultSelectedElement = { element: this.screenRoot.querySelector('.arrow-back-btn') }
        this.selectableElements.push(this.defaultSelectedElement);
        this.selectableElements.push({ element: this.screenRoot.querySelector('.open-profile-tab-btn') });

        this.status = new UserStatus(this.screenRoot);

        for (let i = 0; i < this.status.views.length; i++) {
            const statusView = this.status.views[i];
            this.selectableElements.push({ element: statusView });
        }

        const setupTabs = () => {
            const tabs = [
                {
                    button: this.screenRoot.querySelectorAll('.profile-subtab-switch-btn')[0],
                    body: this.screenRoot.querySelector('.profile-statuses-list'),
                    selected: true
                }, {
                    button: this.screenRoot.querySelectorAll('.profile-subtab-switch-btn')[1],
                    body: this.screenRoot.querySelector('.profile-stats-list'),
                    selected: false
                }
            ];
            const select = (index) => {
                for (let j = 0; j < tabs.length; j++) {
                    setRemoveClass(tabs[j].body, 'hidden-all', j != index)
                    setRemoveClass(tabs[j].button, 'profile-subtab-switch-btn_active', j == index)
                }
            }
            for (let i = 0; i < tabs.length; i++) {
                const tab = tabs[i];
                this.selectableElements.push({ element: tab.button });
                tab.button.onclick = () => {
                    audioManager.playSound();
                    select(i);
                }
            }
        }

        const setupStatistics = () => {
            const statisticsProgressText = Array.from(this.screenRoot.querySelectorAll('.profile-stats-list-item-progress-title'));
            const updateStats = () => {
                statisticsProgressText[0].innerText = `${(statistics.gameCount.overall == 0 ? 0 : Math.floor(statistics.winCount.overall / statistics.gameCount.overall * 100))}`;
                statisticsProgressText[1].innerText = `${(statistics.gameCount.byGameMode[0].count == 0 ? 0 : Math.floor(statistics.winCount.byGameMode[0].count / statistics.gameCount.byGameMode[0].count * 100))}`;
                statisticsProgressText[2].innerText = `${(statistics.gameCount.byGameMode[1].count == 0 ? 0 : Math.floor(statistics.winCount.byGameMode[1].count / statistics.gameCount.byGameMode[1].count * 100))}`;
                statisticsProgressText[3].innerText = `${(statistics.gameCount.byEntityMode[1].count == 0 ? 0 : Math.floor(statistics.winCount.byEntityMode[1].count / statistics.gameCount.byEntityMode[1].count * 100))}`;
            }

            updateEvent.addListener(() => {
                updateStats();
            })

            updateStats();
        }

        setupTabs();
        setupStatistics();
    }
}

export { ProfileScreen }