import { StateButton } from "../../button.js";
import { dailyRewards, isCompleted, tryCompleteDailyReward } from "../../dailyRewards.js";
import { setRemoveClass } from "../../helpers.js";
import { inDayGameCount } from "../../ingameDayCounter.js";
import { showRewarded } from "../../sdk/sdk.js";
import { ScreenLogic } from "../navigation.js";

class DailyBonusesScreen extends ScreenLogic {
    onCreate() {
        const dayInGame = inDayGameCount();
        let isForRewarded = false;

        const allDays = Array.from(this.screenRoot.getElementsByClassName('bounty-card-container'));
        const uncheckedIcon = './Sprites/Desktop - дурак- настройки/Group 54 4x 451329194.png';
        const checkedIcon = './Sprites/Desktop - дурак- настройки/Group 54 4x -1518726756.png';

        for (let i = 0; i < allDays.length; i++) {
            const element = allDays[i];

            if (isCompleted(i)) {
                setRemoveClass(element, 'completed', true)
                continue;
            }

            setRemoveClass(element, 'opened', dayInGame - 1 >= i);
            setRemoveClass(element, 'locked', !(dayInGame - 1 >= i));

            if (dayInGame - 1 >= i) {
                element.onclick = function () {
                    if (!isCompleted(i)) {
                        const get = (rewardMultiplier = 1) => {
                            if (tryCompleteDailyReward(i)) {
                                setRemoveClass(element, 'opened', false)
                                setRemoveClass(element, 'completed', true)

                                user.addItem(dailyRewards[i].item, dailyRewards[i].count * rewardMultiplier, { isTrue: true, isMonetized: true });
                            }
                        }

                        if (isForRewarded) {
                            showRewarded(null, null, () => get(2), null);
                        } else {
                            get(1);
                        }
                    }
                };

                audioManager.addClickableToPull(element);
            }
        }

        new StateButton(
            this.selectableElements,
            this.screenRoot.querySelector('.daily-bonuses_multiple-bounty-container'),
            isForRewarded,
            (stateIsTrue) => {
                const checkbox = this.screenRoot.querySelector('.daily-bonuses_multiple-bounty-icon');
                checkbox.src = stateIsTrue ? checkedIcon : uncheckedIcon;

                isForRewarded = stateIsTrue;
            });
    }
}

export { DailyBonusesScreen }