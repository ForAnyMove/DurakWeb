import { Action } from "./globalEvents.js";
import { Items } from "./statics/staticValues.js";
import { statistics, updateEvent } from "./gameStatistics.js";
import { log } from "./logger.js";

class Achievement {
    constructor(options) {
        this.title = options.title;
        this.icon = options.icon;
        this.langID = options.langID;

        this.currentValue = options.loadData.currentValue;
        this.completedIndex = options.loadData.completedIndex;

        this.updateEvent = new Action();

        this.completed = false;
        this.allTrialsCompleted = false;
        this.isValueInversed = false;
    }

    onLoad = function () {
    }
    unload = function () {
        this.updateEvent.removeAllListeners();
    }

    sendEvent = () => {
        this.updateEvent.invoke();
    }

    getValueText = function () {
        return `${this.currentValue}/${this.trials[this.completedIndex].targetValue}`;
    }

    getCompletionPercent = function () {
        return (Math.floor(this.currentValue / this.trials[this.completedIndex].targetValue * 100));
    }

    tryCompleteCurrentTrial = function () {
        if (this.completed) {
            let temp = this.completedIndex;
            this.completedIndex++;
            this.update();

            log(`Successed achievement completion, current index ${this.completedIndex}`, "achievements");
            return this.trials[temp].reward;
        } else {
            log(`Failed achievement completion try`, "achievements");
        }
    }

    update = function () {
        if (this.trials != null) {
            if (this.completedIndex >= this.trials.length) {
                // all achievements completed
                this.completed = false;
                this.allTrialsCompleted = true;

                return;
            }

            const currentTrial = this.trials[this.completedIndex];

            const currentValue = this.currentValue;
            const targetValue = currentTrial.targetValue;

            if (this.isValueInversed ? currentValue <= targetValue : currentValue >= targetValue) {
                this.completed = true;

                log(`can complete ${this.trials.map(i => `[${i.targetValue}, ${i.reward.type}]`)}`, "achievements")

                // completed current trial
            } else {
                this.completed = false;
            }
        }
    }
}

class InGameDayCount extends Achievement {
    constructor(options = {}) {
        super(options);

        this.trials = options.trials || [
            generateTrial(1, Items.Energy, 1),
            generateTrial(3, Items.Energy, 2),
            generateTrial(7, Items.BoosterHint, 1),
            generateTrial(15, Items.Energy, 4),
            generateTrial(30, Items.BoosterMage, 1),
        ]

        this.handle();
    }

    onLoad = function () {
        updateEvent.addListener(this.handle);
    }
    unload = function () {
        updateEvent.removeListener(this.handle);
    }

    handle = () => {
        this.currentValue = statistics.ingameDayCount;
        this.update();

        this.sendEvent();
    }
}

class WinCount extends Achievement {
    constructor(options = {}) {
        super(options);

        this.rule = options.rule;
        this.levelType = options.levelType;
        this.trials = options.trials;

        this.handle();
    }

    onLoad = function () {
        updateEvent.addListener(this.handle);
    }

    unload = function () {
        updateEvent.removeListener(this.handle);
    }

    handle = () => {
        if (this.rule == null && this.levelType != null) {
            for (let i = 0; i < statistics.winCount.byLevelType.length; i++) {
                const element = statistics.winCount.byLevelType[i];

                if (element.type == this.levelType) {
                    this.currentValue = element.count;

                    this.update();
                    this.sendEvent();
                    return;
                }
            }
        } else if (this.rule != null && this.levelType == null) {
            for (let i = 0; i < statistics.winCount.byRules.length; i++) {
                const element = statistics.winCount.byRules[i];

                if (element.rule == this.rule) {
                    this.currentValue = element.count;

                    this.update();
                    this.sendEvent();
                    return;
                }
            }
        } else if (this.rule == null && this.levelType == null) {
            this.currentValue = statistics.winCount.overall;

            this.update();
            this.sendEvent();
            return;
        }
    }
}

class WinInARow extends Achievement {
    constructor(options = {}) {
        super(options);

        this.rule = options.rule;
        this.levelType = options.levelType;
        this.trials = options.trials;

        this.handle();
    }

    onLoad = function () {
        updateEvent.addListener(this.handle);
    }

    unload = function () {
        updateEvent.removeListener(this.handle);
    }

    handle = () => {
        if (this.rule == null && this.levelType != null) {
            for (let i = 0; i < statistics.winInARow.byLevelType.length; i++) {
                const element = statistics.winInARow.byLevelType[i];

                if (element.type == this.levelType) {
                    this.currentValue = element.count;

                    this.update();
                    this.sendEvent();
                    return;
                }
            }
        } else if (this.rule != null && this.levelType == null) {
            for (let i = 0; i < statistics.winInARow.byRules.length; i++) {
                const element = statistics.winInARow.byRules[i];

                if (element.rule == this.rule) {
                    this.currentValue = element.count;

                    this.update();
                    this.sendEvent();
                    return;
                }
            }
        } else if (this.rule == null && this.levelType == null) {
            this.currentValue = statistics.winInARow.overall;

            this.update();
            this.sendEvent();
            return;
        }
    }
}

class WinWithSomeStepCount extends Achievement {
    constructor(options = {}) {
        super(options);

        this.isValueInversed = true;

        this.trials = options.trials || [
            generateTrial(300, Items.Energy, 1),
            generateTrial(250, Items.Energy, 1),
            generateTrial(200, Items.Energy, 1),
            generateTrial(150, Items.Energy, 2),
            generateTrial(100, Items.Energy, 3),
        ]

        this.handle();
    }

    getValueText = function () {
        return `${this.currentValue == 9999999 ? '∞' : this.currentValue}/${this.trials[this.completedIndex].targetValue}`;
    }

    getCompletionPercent = function () {
        return this.currentValue == 9999999 ? 0 : (Math.floor(this.trials[this.completedIndex].targetValue / this.currentValue * 100));
    }

    onLoad = function () {
        updateEvent.addListener(this.handle);
    }

    unload = function () {
        updateEvent.removeListener(this.handle);
    }
    handle = () => {
        this.currentValue = statistics.leastSteps;
        this.update();

        this.sendEvent();
    }
}

class UsedBoostersCount extends Achievement {
    constructor(options = {}) {
        super(options);

        this.trials = options.trials || [
            generateTrial(10, Items.Energy, 1),
            generateTrial(20, Items.Energy, 3),
            generateTrial(30, Items.BoosterMage, 5),
            generateTrial(40, Items.Energy, 5),
            generateTrial(50, Items.Energy, 10),
        ]

        this.handle();
    }

    onLoad = function () {
        updateEvent.addListener(this.handle);
    }

    unload = function () {
        updateEvent.removeListener(this.handle);
    }
    handle = () => {
        this.currentValue = statistics.boosterUsage;
        this.update();

        this.sendEvent();
    }
}

class GameCount extends Achievement {
    constructor(options = {}) {
        super(options);

        this.rule = options.rule;
        this.levelType = options.levelType;
        this.trials = options.trials;

        this.handle();
    }

    onLoad = function () {
        updateEvent.addListener(this.handle);
    }

    unload = function () {
        updateEvent.removeListener(this.handle);
    }

    handle = () => {
        if (this.rule == null && this.levelType != null) {
            for (let i = 0; i < statistics.gameCount.byLevelType.length; i++) {
                const element = statistics.gameCount.byLevelType[i];

                if (element.type == this.levelType) {
                    this.currentValue = element.count;

                    this.update();
                    this.sendEvent();
                    return;
                }
            }
        } else if (this.rule != null && this.levelType == null) {
            for (let i = 0; i < statistics.gameCount.byRules.length; i++) {
                const element = statistics.gameCount.byRules[i];

                if (element.rule == this.rule) {
                    this.currentValue = element.count;

                    this.update();
                    this.sendEvent();
                    return;
                }
            }
        } else if (this.rule == null && this.levelType == null) {
            this.currentValue = statistics.gameCount.overall;

            this.update();
            this.sendEvent();
            return;
        }
    }
}

class WinWithSomeTime extends Achievement {
    constructor(options = {}) {
        super(options);

        this.isValueInversed = true;

        this.trials = options.trials || [
            generateTrial(900, Items.Energy, 2),
            generateTrial(600, Items.BoosterHint, 1),
            generateTrial(480, Items.Energy, 3),
            generateTrial(300, Items.Energy, 4),
            generateTrial(180, Items.BoosterTime, 2),
        ]

        this.handle();
    }

    getValueText = function () {
        return `${this.currentValue == 9999999 ? '∞' : this.currentValue}/${this.trials[this.completedIndex].targetValue}`;
    }

    getCompletionPercent = function () {
        return this.currentValue == 9999999 ? 0 : (Math.floor(this.trials[this.completedIndex].targetValue / this.currentValue * 100));
    }

    onLoad = function () {
        updateEvent.addListener(this.handle);
    }

    unload = function () {
        updateEvent.removeListener(this.handle);
    }
    handle = () => {
        this.currentValue = statistics.leastTime;
        this.update();

        this.sendEvent();
    }
}


function generateTrial(targetValue, rewardType, rewardCount) {
    return {
        targetValue: targetValue,
        reward: {
            type: rewardType,
            count: rewardCount
        }
    }
}

export { WinCount, Achievement, WinInARow, WinWithSomeStepCount, WinWithSomeTime, InGameDayCount, GameCount, UsedBoostersCount, generateTrial };