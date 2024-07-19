import { load, save } from "./save_system/SaveSystem.js";
import { Items } from "./statics/staticValues.js";

const dailyRewards = [
    {
        item: Items.Currency,
        count: 100,
        completed: true
    }, {
        item: Items.Currency,
        count: 200,
        completed: false
    }, {
        item: Items.Currency,
        count: 300,
        completed: false
    }, {
        item: Items.Currency,
        count: 500,
        completed: false
    }, {
        item: Items.Currency,
        count: 700,
        completed: false
    }, {
        item: Items.Currency,
        count: 1000,
        completed: false
    }
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