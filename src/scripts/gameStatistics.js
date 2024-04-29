import { Action } from "./globalEvents.js";
import { load, save } from "./save_system/SaveSystem.js";
import { LevelType, Rule } from "./statics/enums.js";

let updateEvent = new Action();

let statistics = {
    ingameDayCount: 0,
    gameCount: {
        byRules: [
            { rule: Rule.OneSuitSpider, count: 0 },
            { rule: Rule.TwoSuitsSpider, count: 0 },
            { rule: Rule.FourSuitsSpider, count: 0 },
            { rule: Rule.OneSuitSpiderLady, count: 0 },
            { rule: Rule.TwoSuitsSpiderLady, count: 0 },
            { rule: Rule.FourSuitsSpiderLady, count: 0 },
        ],
        byLevelType: [
            { type: LevelType.Default, count: 0 },
            { type: LevelType.Trial, count: 0 },
            { type: LevelType.Story, count: 0 },
        ],
        overall: 0
    },
    winCount: {
        byRules: [
            { rule: Rule.OneSuitSpider, count: 0 },
            { rule: Rule.TwoSuitsSpider, count: 0 },
            { rule: Rule.FourSuitsSpider, count: 0 },
            { rule: Rule.OneSuitSpiderLady, count: 0 },
            { rule: Rule.TwoSuitsSpiderLady, count: 0 },
            { rule: Rule.FourSuitsSpiderLady, count: 0 },
        ],
        byLevelType: [
            { type: LevelType.Default, count: 0 },
            { type: LevelType.Trial, count: 0 },
            { type: LevelType.Story, count: 0 },
        ],
        overall: 0
    },
    loseCount: {
        byRules: [
            { rule: Rule.OneSuitSpider, count: 0 },
            { rule: Rule.TwoSuitsSpider, count: 0 },
            { rule: Rule.FourSuitsSpider, count: 0 },
            { rule: Rule.OneSuitSpiderLady, count: 0 },
            { rule: Rule.TwoSuitsSpiderLady, count: 0 },
            { rule: Rule.FourSuitsSpiderLady, count: 0 },
        ],
        byLevelType: [
            { type: LevelType.Default, count: 0 },
            { type: LevelType.Trial, count: 0 },
            { type: LevelType.Story, count: 0 },
        ],
        overall: 0
    },
    winInARow: {
        byRules: [
            { rule: Rule.OneSuitSpider, count: 0 },
            { rule: Rule.TwoSuitsSpider, count: 0 },
            { rule: Rule.FourSuitsSpider, count: 0 },
            { rule: Rule.OneSuitSpiderLady, count: 0 },
            { rule: Rule.TwoSuitsSpiderLady, count: 0 },
            { rule: Rule.FourSuitsSpiderLady, count: 0 },
        ],
        byLevelType: [
            { type: LevelType.Default, count: 0 },
            { type: LevelType.Trial, count: 0 },
            { type: LevelType.Story, count: 0 },
        ],
        overall: 0
    },
    boosterUsage: 0,
    leastTime: 9999999,
    leastSteps: 9999999
};

statistics = load("game_statistics", statistics);

function updateStatistics() {
    updateEvent.invoke();

    save("game_statistics", statistics);
}

export { statistics, updateStatistics, updateEvent }