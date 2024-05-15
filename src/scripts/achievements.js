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
            this.sendEvent();
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
            generateTrial(3, Items.Currency, 200),
            generateTrial(5, Items.Currency, 300),
            generateTrial(7, Items.Currency, 400),
            generateTrial(10, Items.Currency, 500),
            generateTrial(20, Items.Currency, 1000),
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

        this.gameMode = options.gameMode;
        this.entityMode = options.entityMode;
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
        if (this.gameMode == null && this.entityMode != null) {
            for (let i = 0; i < statistics.winCount.byEntityMode.length; i++) {
                const element = statistics.winCount.byEntityMode[i];

                if (element.type == this.entityMode) {
                    this.currentValue = element.count;

                    this.update();
                    this.sendEvent();
                    return;
                }
            }
        } else if (this.gameMode != null && this.entityMode == null) {
            for (let i = 0; i < statistics.winCount.byGameMode.length; i++) {
                const element = statistics.winCount.byGameMode[i];

                if (element.gameMode == this.gameMode) {
                    this.currentValue = element.count;

                    this.update();
                    this.sendEvent();
                    return;
                }
            }
        } else if (this.gameMode == null && this.entityMode == null) {
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

        this.gameMode = options.gameMode;
        this.entityMode = options.entityMode;
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
        if (this.gameMode == null && this.entityMode != null) {
            for (let i = 0; i < statistics.winInARow.byEntityMode.length; i++) {
                const element = statistics.winInARow.byEntityMode[i];

                if (element.type == this.entityMode) {
                    this.currentValue = element.count;

                    this.update();
                    this.sendEvent();
                    return;
                }
            }
        } else if (this.gameMode != null && this.entityMode == null) {
            for (let i = 0; i < statistics.winInARow.byGameMode.length; i++) {
                const element = statistics.winInARow.byGameMode[i];

                if (element.gameMode == this.gameMode) {
                    this.currentValue = element.count;

                    this.update();
                    this.sendEvent();
                    return;
                }
            }
        } else if (this.gameMode == null && this.entityMode == null) {
            this.currentValue = statistics.winInARow.overall;

            this.update();
            this.sendEvent();
            return;
        }
    }
}

class GameCount extends Achievement {
    constructor(options = {}) {
        super(options);

        this.gameMode = options.gameMode;
        this.entityMode = options.entityMode;
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
        if (this.gameMode == null && this.entityMode != null) {
            for (let i = 0; i < statistics.gameCount.byEntityMode.length; i++) {
                const element = statistics.gameCount.byEntityMode[i];

                if (element.type == this.entityMode) {
                    this.currentValue = element.count;

                    this.update();
                    this.sendEvent();
                    return;
                }
            }
        } else if (this.gameMode != null && this.entityMode == null) {
            for (let i = 0; i < statistics.gameCount.byGameMode.length; i++) {
                const element = statistics.gameCount.byGameMode[i];

                if (element.gameMode == this.gameMode) {
                    this.currentValue = element.count;

                    this.update();
                    this.sendEvent();
                    return;
                }
            }
        } else if (this.gameMode == null && this.entityMode == null) {
            this.currentValue = statistics.gameCount.overall;

            this.update();
            this.sendEvent();
            return;
        }
    }
}

class DraftCount extends Achievement {
    constructor(options = {}) {
        super(options);

        this.gameMode = options.gameMode;
        this.entityMode = options.entityMode;
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
        if (this.gameMode == null && this.entityMode != null) {
            for (let i = 0; i < statistics.draft.byEntityMode.length; i++) {
                const element = statistics.draft.byEntityMode[i];

                if (element.type == this.entityMode) {
                    this.currentValue = element.count;

                    this.update();
                    this.sendEvent();
                    return;
                }
            }
        } else if (this.gameMode != null && this.entityMode == null) {
            for (let i = 0; i < statistics.draft.byGameMode.length; i++) {
                const element = statistics.draft.byGameMode[i];

                if (element.gameMode == this.gameMode) {
                    this.currentValue = element.count;

                    this.update();
                    this.sendEvent();
                    return;
                }
            }
        } else if (this.gameMode == null && this.entityMode == null) {
            this.currentValue = statistics.draft.overall;

            this.update();
            this.sendEvent();
            return;
        }
    }
}

class AceLose extends Achievement {
    constructor(options = {}) {
        super(options);

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
        this.currentValue = statistics.lostWithAces;
        this.update();

        this.sendEvent();
    }
}

class TransfareCards extends Achievement {
    constructor(options = {}) {
        super(options);

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
        this.currentValue = statistics.transfaredCards;
        this.update();

        this.sendEvent();
    }
}

class ThrowCards extends Achievement {
    constructor(options = {}) {
        super(options);

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
        this.currentValue = statistics.throwedCards;
        this.update();

        this.sendEvent();
    }
}

class CurrencyCollected extends Achievement {
    constructor(options = {}) {
        super(options);

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
        this.currentValue = statistics.maxCurrencyCollected;
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

export { WinCount, Achievement, WinInARow, InGameDayCount, GameCount, DraftCount, AceLose, TransfareCards, ThrowCards, CurrencyCollected, generateTrial };