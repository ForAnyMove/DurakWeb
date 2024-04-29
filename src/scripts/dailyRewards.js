import { load, save } from "./save_system/SaveSystem.js";
import { Items } from "./statics/staticValues.js";

const dailyRewards = [
    {
        item: Items.Energy,
        count: 2,
        completed: false
    }, {
        item: Items.BoosterHint,
        count: 3,
        completed: false
    }, {
        item: Items.Energy,
        count: 5,
        completed: false
    }, {
        item: Items.BoosterMage,
        count: 3,
        completed: false
    }, {
        item: Items.Energy,
        count: 10,
        completed: false
    }, {
        item: Items.BoosterUndo,
        count: 5,
        completed: false
    }, {
        item: [
            {
                item: Items.Energy,
                count: 5
            }, {
                item: Items.BoosterHint,
                count: 4
            }, {
                item: Items.BoosterMage,
                count: 2
            }, {
                item: Items.BoosterUndo,
                count: 4
            }
        ],
        completed: false
    },
]

function loadDailyRewards() {
    const loads = load('daily_rewards', { completion: dailyRewards.map(i => false) }).completion;

    for (let i = 0; i < dailyRewards.length; i++) {
        dailyRewards[i].completed = loads[i];
    }
}

function saveDailyRewards() {
    save('daily_rewards', { completion: dailyRewards.map(i => i.completed) })
}

function tryCompleteDailyReward(index) {
    if (dailyRewards[index].completed) return false;

    dailyRewards[index].completed = true;
    saveDailyRewards();
    return true;
}

function isCompleted(index) {
    if (index < 0 || index > dailyRewards.length - 1) return false;
    return dailyRewards[index].completed;
}

loadDailyRewards();

export { dailyRewards, tryCompleteDailyReward, isCompleted }