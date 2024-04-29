import { statistics, updateStatistics } from "./gameStatistics.js";

class LevelManagement {
    selectLevel = function (database, order) {
        if (database.levels[order] == null) return null;

        this.selectedDatabase = database;
        this.selectedOrder = order;
        return { pass: this.selectedDatabase.levels[this.selectedOrder].pass };
    }

    startLevel = function () {

    }

    clearLevel = function () {
        this.selectedDatabase = null;
        this.selectedOrder = null;
    }

    loseLevel = function () {
        if (this.selectedDatabase != null) {
            let level = this.selectedDatabase.levels[this.selectedDatabase.currentLevel];
            if (level == null) return;

            this.udpateGameCount(level.type, level.gameRule);
            this.udpateGameRowCount(level.type, level.gameRule, false);

            statistics.loseCount.overall++;

            for (let i = 0; i < statistics.loseCount.byLevelType.length; i++) {
                const element = statistics.loseCount.byLevelType[i];
                if (element.type == level.type) {
                    element.count++;
                }
            }

            for (let i = 0; i < statistics.loseCount.byRules.length; i++) {
                const element = statistics.loseCount.byRules[i];
                if (element.rule == level.gameRule) {
                    element.count++;
                }
            }

            this.selectedDatabase.currentLevel++;

            updateStatistics();
        }
    }

    winLevel = function () {
        if (this.selectedDatabase != null) {
            let level = this.selectedDatabase.levels[this.selectedDatabase.currentLevel];
            if (level == null) return null;

            this.udpateGameCount(level.type, level.gameRule);
            this.udpateGameRowCount(level.type, level.gameRule, true);

            statistics.winCount.overall++;

            for (let i = 0; i < statistics.winCount.byLevelType.length; i++) {
                const element = statistics.winCount.byLevelType[i];
                if (element.type == level.type) {
                    element.count++;
                }
            }

            for (let i = 0; i < statistics.winCount.byRules.length; i++) {
                const element = statistics.winCount.byRules[i];
                if (element.rule == level.gameRule) {
                    element.count++;
                }
            }

            this.selectedDatabase.currentLevel++;

            updateStatistics();

            return { rewards: level.rewards }
        }
    }

    udpateGameCount = function (type, rule) {
        statistics.gameCount.overall++;

        for (let i = 0; i < statistics.gameCount.byLevelType.length; i++) {
            const element = statistics.gameCount.byLevelType[i];
            if (element.type == type) {
                element.count++;
            }
        }

        for (let i = 0; i < statistics.gameCount.byRules.length; i++) {
            const element = statistics.gameCount.byRules[i];
            if (element.rule == rule) {
                element.count++;
            }
        }
    }

    udpateGameRowCount = function (type, rule, isWin) {
        statistics.winInARow.overall = isWin ? (statistics.winInARow.overall + 1) : 0;

        for (let i = 0; i < statistics.winInARow.byLevelType.length; i++) {
            const element = statistics.winInARow.byLevelType[i];
            if (element.type == type) {
                element.count = isWin ? (element.count + 1) : 0;
            }
        }

        for (let i = 0; i < statistics.winInARow.byRules.length; i++) {
            const element = statistics.winInARow.byRules[i];
            if (element.rule == rule) {
                element.count = isWin ? (element.count + 1) : 0;
            }
        }
    }
}

const levelManagement = new LevelManagement();

export { levelManagement }