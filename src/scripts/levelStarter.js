import { statistics, updateStatistics } from "./gameStatistics.js";
import { levelManagement } from "./levelManagement.js";
import { log } from "./logger.js";
import { LevelType } from "./statics/enums.js";
// import { Items } from "./statics/staticValues.js";

function startLevel(database) {
    const selectionOptions = levelManagement.selectLevel(database, database.currentLevel);

    if (selectionOptions == null) return;

    let message = `Start level №_${levelManagement.selectedOrder}`;
    console.log(message);

    // let pass = selectionOptions.pass;

    // if (pass != null) {
    //     message += `\n - Has pass requirement: ${pass.type} (${pass.count})`;
    // } else {
    //     message += `\n - Has no pass requirement, level can be started`;
    //     log(message);
    //     return true;
    // }

    // let passed = false;

    // for (let i = 0; i < user.items.length; i++) {
    //     const element = user.items[i];
    //     if (element.type == Items.Energy && element.count >= pass.count) {
    //         message += `\n - Has enougn required pass item: ${element.type} (${element.count})`;
    //         user.removeItem(element.type, pass.count);

    //         message += `\n - Taken item: ${pass.type} (${pass.count})`;
    //         message += `\n - User item left: ${element.type} (${element.count})`;
    //         message += '\n - Level can be started\n\n';

    //         passed = true;
    //         break
    //     } else {
    //         message += `\n - Has no item: ${element.type} (${element.count}), need ${pass.type} (${pass.count})`;
    //         message += '\n - Level can\'t be started';
    //         message += '\n - Exit\n\n';
    //         passed = false;
    //         break;
    //     }
    // }

    // log(message, "levelStarter");
    // return passed;
}

function completeMode(rule) {
    let message = `Win level ${rule}`;
    console.log(message);

    levelManagement.udpateGameCount(LevelType.Default, rule);
    levelManagement.udpateGameRowCount(LevelType.Default, rule, true);

    statistics.winCount.overall++;

    for (let i = 0; i < statistics.winCount.byLevelType.length; i++) {
        const element = statistics.winCount.byLevelType[i];
        if (element.type == LevelType.Default) {
            element.count++;
        }
    }

    for (let i = 0; i < statistics.winCount.byRules.length; i++) {
        const element = statistics.winCount.byRules[i];
        if (element.rule == rule) {
            element.count++;
        }
    }

    updateStatistics();

    return true;
}

function failMode(rule) {
    let message = `Lose level ${rule}`;
    console.log(message);

    levelManagement.udpateGameCount(LevelType.Default, rule);
    levelManagement.udpateGameRowCount(LevelType.Default, rule, false);

    statistics.loseCount.overall++;

    for (let i = 0; i < statistics.loseCount.byLevelType.length; i++) {
        const element = statistics.loseCount.byLevelType[i];
        if (element.type == LevelType.Default) {
            element.count++;
        }
    }

    for (let i = 0; i < statistics.loseCount.byRules.length; i++) {
        const element = statistics.loseCount.byRules[i];
        if (element.rule == rule) {
            element.count++;
        }
    }

    this.selectedDatabase.currentLevel++;

    updateStatistics();

    return true;
}

function completeLevel() {
    let options = levelManagement.winLevel();

    if (options == null) return false;

    let message = `Win level №_${levelManagement.selectedOrder}`;

    let rewards = options.rewards;

    if (rewards != null) {
        let itemRewards = rewards.items;
        let contentRewards = rewards.content;

        if (itemRewards != null) {
            message += "\n - Item rewards:"
            for (let i = 0; i < itemRewards.length; i++) {
                const element = itemRewards[i];
                message += `\n  - ${element.type} (${element.count})`
            }
            message += "\n"
        }

        if (contentRewards != null) {
            message += "\n - Content rewards:"
            for (let i = 0; i < contentRewards.length; i++) {
                const element = contentRewards[i];
                message += `\n  - ${element.type.id} (${element.count})`
            }
        }

        // message += `\n - User content: ${user.availableContent.map(i => `(${i.type}, ${i.id})`)}`;
        // message += `\n - User items: ${user.items.map(i => `(${i.type}, ${i.count})`)}`;
        // message += "\n"
    } else {
        message += "\n - No rewards\n"
    }

    message += "\n"

    message += `Next level: №_${levelManagement.selectedOrder + 1}`;
    log(message, "levelStarter");

    if (rewards != null) {
        user.addItems(rewards.items, { isTrue: true });
        user.addContents(rewards.content);
    }
    // save("story_level", database.currentLevel);

    return true;
}

function failLevel() {
    levelManagement.loseLevel();
}

function leaveLevel() {
    failLevel();
}

export { startLevel, completeLevel, failLevel, leaveLevel, completeMode, failMode }