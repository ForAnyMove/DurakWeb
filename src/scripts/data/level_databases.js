import { createDeckTrial, createItem, createLevelCompleteRequirement, createStoryLevel, createTrialLevel } from "../helpers.js";
import { load, save } from "../save_system/SaveSystem.js";
import { LevelState, LevelType, Rule } from "../statics/enums.js";
import { Items } from "../statics/staticValues.js";
import { backSkinDatabase, backgroundDatabase, skinDatabase } from "./card_skin_database.js";

const levelParameters = {
    order: 1, // 2, 3...
    type: LevelType.Story, // LevelType.Trial, LevelType.Default
    rules: Rule.OneSuitSpider, // Rule.OneSuitSpiderLady, Rule.TwoSuitsSpider...
    rewards: { items: [{ type: Items.Energy, count: 1 }], content: [{ type: skinDatabase.skinList[2].id, count: 1 }] }, // createItem(Items.Energy, 1), createItem(skinDatabase.skinList[2].id, 1)
    requirements: { type: LevelType.Trial, order: 1 /*2, 3...*/ }, // createLevelCompleteRequirement(LevelType.Trial, 1)
    trials: { levelTrial: { decksToComplete: 1 /*2, 3...*/ } }, // createDeckTrial(1),s
    time: -1, // 600s, 1200s...
}

const storyLevelDatabase = {
    id: "story_level_database_01",
    currentLevel: 0,
    levels: [
        //           order              type                state                rule                                     rewards                          pass                                     requirements
        createStoryLevel(1, LevelType.Story, LevelState.Unclocked, Rule.OneSuitSpider, { content: [createItem(skinDatabase.skinList[2].id, 1)] }, createItem(Items.Energy, 1)),
        createStoryLevel(2, LevelType.Story, LevelState.Locked, Rule.OneSuitSpider, null, createItem(Items.Energy, 1)),
        createStoryLevel(3, LevelType.Story, LevelState.Locked, Rule.OneSuitSpider, { content: [createItem(backSkinDatabase.skinList[2].id, 1)] }, createItem(Items.Energy, 2)),
        createStoryLevel(4, LevelType.Story, LevelState.Locked, Rule.OneSuitSpider, null, createItem(Items.Energy, 2)),
        createStoryLevel(5, LevelType.Story, LevelState.Locked, Rule.OneSuitSpiderLady, { content: [createItem(backgroundDatabase.skinList[2].id, 1)] }, createItem(Items.Energy, 3)),
        createStoryLevel(6, LevelType.Story, LevelState.Locked, Rule.OneSuitSpider, null, createItem(Items.Energy, 3)),
        createStoryLevel(7, LevelType.Story, LevelState.Locked, Rule.OneSuitSpider, { content: [createItem(skinDatabase.skinList[3].id, 1)] }, createItem(Items.Energy, 4), createLevelCompleteRequirement(LevelType.Trial, 1)),
        createStoryLevel(8, LevelType.Story, LevelState.Locked, Rule.OneSuitSpider, null, createItem(Items.Energy, 4)),
        createStoryLevel(9, LevelType.Story, LevelState.Locked, Rule.OneSuitSpider, { content: [createItem(backSkinDatabase.skinList[3].id, 1)] }, createItem(Items.Energy, 5), createLevelCompleteRequirement(LevelType.Trial, 2)),
        createStoryLevel(10, LevelType.Story, LevelState.Locked, Rule.OneSuitSpiderLady, null, createItem(Items.Energy, 5)),
        createStoryLevel(11, LevelType.Story, LevelState.Locked, Rule.OneSuitSpider, { content: [createItem(backgroundDatabase.skinList[3].id, 1)] }, createItem(Items.Energy, 6), createLevelCompleteRequirement(LevelType.Trial, 3)),
        createStoryLevel(12, LevelType.Story, LevelState.Locked, Rule.OneSuitSpider, null, createItem(Items.Energy, 6)),
        createStoryLevel(13, LevelType.Story, LevelState.Locked, Rule.OneSuitSpider, { content: [createItem(skinDatabase.skinList[4].id, 1)] }, createItem(Items.Energy, 7), createLevelCompleteRequirement(LevelType.Trial, 4)),
        createStoryLevel(14, LevelType.Story, LevelState.Locked, Rule.OneSuitSpider, null, createItem(Items.Energy, 7)),
        createStoryLevel(15, LevelType.Story, LevelState.Locked, Rule.OneSuitSpiderLady, { content: [createItem(backSkinDatabase.skinList[4].id, 1)] }, createItem(Items.Energy, 8), createLevelCompleteRequirement(LevelType.Trial, 5)),
        createStoryLevel(16, LevelType.Story, LevelState.Locked, Rule.TwoSuitsSpider, null, createItem(Items.Energy, 8)),
        createStoryLevel(17, LevelType.Story, LevelState.Locked, Rule.TwoSuitsSpider, { content: [createItem(backgroundDatabase.skinList[4].id, 1)] }, createItem(Items.Energy, 9), createLevelCompleteRequirement(LevelType.Trial, 6)),
        createStoryLevel(18, LevelType.Story, LevelState.Locked, Rule.TwoSuitsSpider, null, createItem(Items.Energy, 9)),
        createStoryLevel(19, LevelType.Story, LevelState.Locked, Rule.TwoSuitsSpider, { content: [createItem(skinDatabase.skinList[5].id, 1)] }, createItem(Items.Energy, 10), createLevelCompleteRequirement(LevelType.Trial, 7)),
        createStoryLevel(20, LevelType.Story, LevelState.Locked, Rule.TwoSuitsSpiderLady, null, createItem(Items.Energy, 10)),
        createStoryLevel(21, LevelType.Story, LevelState.Locked, Rule.TwoSuitsSpider, { content: [createItem(backSkinDatabase.skinList[5].id, 1)] }, createItem(Items.Energy, 11), createLevelCompleteRequirement(LevelType.Trial, 8)),
        createStoryLevel(22, LevelType.Story, LevelState.Locked, Rule.TwoSuitsSpider, null, createItem(Items.Energy, 11)),
        createStoryLevel(23, LevelType.Story, LevelState.Locked, Rule.TwoSuitsSpider, { content: [createItem(backgroundDatabase.skinList[5].id, 1)] }, createItem(Items.Energy, 12), createLevelCompleteRequirement(LevelType.Trial, 9)),
        createStoryLevel(24, LevelType.Story, LevelState.Locked, Rule.TwoSuitsSpider, null, createItem(Items.Energy, 12)),
        createStoryLevel(25, LevelType.Story, LevelState.Locked, Rule.TwoSuitsSpiderLady, { content: [createItem(skinDatabase.skinList[6].id, 1)] }, createItem(Items.Energy, 13), createLevelCompleteRequirement(LevelType.Trial, 10)),
        createStoryLevel(26, LevelType.Story, LevelState.Locked, Rule.FourSuitsSpider, null, createItem(Items.Energy, 13)),
        createStoryLevel(27, LevelType.Story, LevelState.Locked, Rule.FourSuitsSpider, { content: [createItem(backSkinDatabase.skinList[6].id, 1)] }, createItem(Items.Energy, 14), createLevelCompleteRequirement(LevelType.Trial, 11)),
        createStoryLevel(28, LevelType.Story, LevelState.Locked, Rule.FourSuitsSpider, null, createItem(Items.Energy, 14)),
        createStoryLevel(29, LevelType.Story, LevelState.Locked, Rule.FourSuitsSpider, { content: [createItem(backgroundDatabase.skinList[6].id, 1)] }, createItem(Items.Energy, 15), createLevelCompleteRequirement(LevelType.Trial, 12)),
        createStoryLevel(30, LevelType.Story, LevelState.Locked, Rule.FourSuitsSpiderLady, { content: [createItem(skinDatabase.skinList[7].id, 1)] }, createItem(Items.Energy, 15)),
        createStoryLevel(31, LevelType.Story, LevelState.Locked, Rule.FourSuitsSpider, { content: [createItem(backSkinDatabase.skinList[7].id, 1)] }, createItem(Items.Energy, 16), createLevelCompleteRequirement(LevelType.Trial, 13)),
        createStoryLevel(32, LevelType.Story, LevelState.Locked, Rule.FourSuitsSpiderLady, { content: [createItem(backgroundDatabase.skinList[7].id, 1)] }, createItem(Items.Energy, 16)),
        createStoryLevel(33, LevelType.Story, LevelState.Locked, Rule.FourSuitsSpider, { content: [createItem(skinDatabase.skinList[8].id, 1)] }, createItem(Items.Energy, 17), createLevelCompleteRequirement(LevelType.Trial, 14)),
        createStoryLevel(34, LevelType.Story, LevelState.Locked, Rule.FourSuitsSpiderLady, { content: [createItem(backSkinDatabase.skinList[8].id, 1)] }, createItem(Items.Energy, 17)),
        createStoryLevel(35, LevelType.Story, LevelState.Locked, Rule.FourSuitsSpider, { content: [createItem(backgroundDatabase.skinList[8].id, 1)] }, createItem(Items.Energy, 18), createLevelCompleteRequirement(LevelType.Trial, 15)),
    ],
    loadData: function () {
        this.currentLevel = load(this.id, 0);
    },
    nextLevel: function () {
        this.currentLevel++;
        save(this.id, this.currentLevel);
    }
}

const trialLevelDatabase = {
    id: "trial_level_database_01",
    currentLevel: 0,
    levels: [
        //           order             type                 state                    rule                                   rewards time               trials
        createTrialLevel(1, LevelType.Trial, LevelState.Unclocked, Rule.OneSuitSpiderLady, { items: [createItem(Items.Energy, 5)] }, 600, createDeckTrial(2, 'trial_prefix_01 {2} trial_midfix_01_03{}trial_postfix_01')),
        createTrialLevel(2, LevelType.Trial, LevelState.Locked, Rule.OneSuitSpider, { items: [createItem(Items.Energy, 5)] }, 900, createDeckTrial(3, 'trial_prefix_01 {3} trial_midfix_01_03{}trial_postfix_01')),
        createTrialLevel(3, LevelType.Trial, LevelState.Locked, Rule.OneSuitSpiderLady, { items: [createItem(Items.Energy, 5)] }, 1200, createDeckTrial(4, 'trial_prefix_01 {4} trial_midfix_01_03{}trial_postfix_01')),
        createTrialLevel(4, LevelType.Trial, LevelState.Locked, Rule.OneSuitSpider, { items: [createItem(Items.Energy, 5)] }, 1500, createDeckTrial(8, 'trial_prefix_01 {8} trial_midfix_01_02{}trial_postfix_01')),
        createTrialLevel(5, LevelType.Trial, LevelState.Locked, Rule.TwoSuitsSpiderLady, { items: [createItem(Items.Energy, 5)] }, 1200, createDeckTrial(2, 'trial_prefix_01 {2} trial_midfix_01_03{}trial_postfix_01')),
        createTrialLevel(6, LevelType.Trial, LevelState.Locked, Rule.TwoSuitsSpider, { items: [createItem(Items.Energy, 5)] }, 1200, createDeckTrial(4, 'trial_prefix_01 {4} trial_midfix_01_03{}trial_postfix_01')),
        createTrialLevel(7, LevelType.Trial, LevelState.Locked, Rule.TwoSuitsSpiderLady, { items: [createItem(Items.Energy, 5), createItem(Items.Trophy01, 1)] }, 1200, createDeckTrial(1, 'trial_prefix_01 {1} trial_midfix_01_01{}trial_postfix_01')),
        createTrialLevel(8, LevelType.Trial, LevelState.Locked, Rule.TwoSuitsSpiderLady, { items: [createItem(Items.Energy, 5)] }, 1200, createDeckTrial(6, 'trial_prefix_01 {6} trial_midfix_01_02{}trial_postfix_01')),
        createTrialLevel(9, LevelType.Trial, LevelState.Locked, Rule.FourSuitsSpiderLady, { items: [createItem(Items.Energy, 5), createItem(Items.Trophy02, 1)] }, 1200, createDeckTrial(2, 'trial_prefix_01 {2} trial_midfix_01_03{}trial_postfix_01')),
        createTrialLevel(10, LevelType.Trial, LevelState.Locked, Rule.FourSuitsSpider, { items: [createItem(Items.Energy, 5)] }, 1200, createDeckTrial(8, 'trial_prefix_01 {8} trial_midfix_01_02{}trial_postfix_01')),
        createTrialLevel(11, LevelType.Trial, LevelState.Locked, Rule.FourSuitsSpiderLady, { items: [createItem(Items.Energy, 5), createItem(Items.Trophy03, 1)] }, 1200, createDeckTrial(4, 'trial_prefix_01 {4} trial_midfix_01_03{}trial_postfix_01')),
        createTrialLevel(12, LevelType.Trial, LevelState.Locked, Rule.FourSuitsSpider, { items: [createItem(Items.Energy, 5)] }, 1200, createDeckTrial(2, 'trial_prefix_01 {2} trial_midfix_01_03{}trial_postfix_01')),
        createTrialLevel(13, LevelType.Trial, LevelState.Locked, Rule.FourSuitsSpider, { items: [createItem(Items.Energy, 5), createItem(Items.Trophy04, 1)] }, 1200, createDeckTrial(4, 'trial_prefix_01 {4} trial_midfix_01_03{}trial_postfix_01')),
        createTrialLevel(14, LevelType.Trial, LevelState.Locked, Rule.FourSuitsSpider, { items: [createItem(Items.Energy, 5)] }, 1200, createDeckTrial(6, 'trial_prefix_01 {6} trial_midfix_01_02{}trial_postfix_01')),
        createTrialLevel(15, LevelType.Trial, LevelState.Locked, Rule.FourSuitsSpider, { items: [createItem(Items.Energy, 5), createItem(Items.Trophy05, 1)] }, 1200, createDeckTrial(8, 'trial_prefix_01 {8} trial_midfix_01_02{}trial_postfix_01')),
    ],
    loadData: function () {
        this.currentLevel = load(this.id, 0);
    },
    nextLevel: function () {
        this.currentLevel++;
        save(this.id, this.currentLevel);
    }
}

function saveStoryDatabase() {
    save(storyLevelDatabase.id, storyLevelDatabase.currentLevel)
}

function saveTrialDatabase() {
    save(trialLevelDatabase.id, trialLevelDatabase.currentLevel)
}

storyLevelDatabase.currentLevel = load(storyLevelDatabase.id, 0);
trialLevelDatabase.currentLevel = load(trialLevelDatabase.id, 0);

export { storyLevelDatabase, trialLevelDatabase, saveStoryDatabase, saveTrialDatabase }