import { WinCount, WinInARow, WinWithSomeStepCount, WinWithSomeTime, InGameDayCount, GameCount, UsedBoostersCount, generateTrial } from "./achievements.js";
import { Action } from "./globalEvents.js";
import { log } from "./logger.js";
import { load, save } from "./save_system/SaveSystem.js";
import { LevelType, Rule } from "./statics/enums.js";
import { Content, Items } from "./statics/staticValues.js";

export default class User {
    constructor() {
        this.items = [{
            type: Items.Energy,
            count: 0
        }, {
            type: Items.BoosterHint,
            count: 0
        }, {
            type: Items.BoosterUndo,
            count: 0
        }, {
            type: Items.BoosterMage,
            count: 0
        }, {
            type: Items.BoosterTime,
            count: 0
        }]

        this.availableContent = [
            Content.CardSkin01, Content.CardBackSkin01, Content.Background01,
            Content.CardSkin02, Content.CardBackSkin02, Content.Background02];

        //test data
        // this.availableContent = [
        //     Content.CardSkin01, Content.CardBackSkin01, Content.Background01,
        //     Content.CardSkin02, Content.CardBackSkin02, Content.Background02,
        //     Content.CardSkin03, Content.CardBackSkin03, Content.Background03,
        //     Content.CardSkin04, Content.CardBackSkin04, Content.Background04,
        //     Content.CardSkin05, Content.CardBackSkin05, Content.Background05,
        //     Content.CardSkin06, Content.CardBackSkin06, Content.Background06,
        //     Content.CardSkin07, Content.CardBackSkin07, Content.Background07,
        //     Content.CardSkin08, Content.CardBackSkin08, Content.Background08,
        //     Content.CardSkin09, Content.CardBackSkin09, Content.Background09];

        this.usedContent = [Content.CardSkin01, Content.CardBackSkin01, Content.Background01];

        this.achievements = [];
        this.achievements.push(new InGameDayCount({
            title: 'Дней в игре',
            langID: 'day_in_game_a',
            icon: 'Sprites/Icons/Icon_Calendar.png',
            loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinCount({
            title: 'Количество побед',
            langID: 'win_count_a',
            icon: 'Sprites/Icons/Icon_Trophy.png',
            trials: [
                generateTrial(3, Items.BoosterHint, 1),
                generateTrial(5, Items.BoosterTime, 1),
                generateTrial(7, Items.BoosterUndo, 1),
                generateTrial(9, Items.BoosterMage, 2),
                generateTrial(12, Items.BoosterUndo, 3),
            ],
            loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinInARow({
            title: 'Побед подряд',
            langID: 'win_in_row_a',
            icon: 'Sprites/Icons/Icon_Trophy.png',
            trials: [
                generateTrial(3, Items.Energy, 2),
                generateTrial(5, Items.Energy, 2),
                generateTrial(7, Items.Energy, 3),
                generateTrial(9, Items.Energy, 5),
                generateTrial(12, Items.BoosterHint, 3),
            ],
            loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinWithSomeStepCount({
            title: 'Выиграть с заданным количеством шагов',
            langID: 'win_step_a',
            icon: 'Sprites/Icons/Icon_Step.png',
            loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new UsedBoostersCount({
            title: 'Использование бустеров',
            langID: 'booster_use_a',
            icon: 'Sprites/Icons/Icon_Booster.png',
            loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinCount({
            title: 'Количество пройденных испытаний',
            langID: 'twial_win_count_a',
            icon: 'Sprites/Icons/Icon_Trial.png',
            trials: [
                generateTrial(3, Items.Energy, 2),
                generateTrial(5, Items.Energy, 2),
                generateTrial(7, Items.Energy, 3),
                generateTrial(9, Items.Energy, 5),
                generateTrial(12, Items.BoosterHint, 3),
            ], levelType: LevelType.Trial, loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new GameCount({
            title: 'Количество игр в Испытании',
            langID: 'story_game_count_a',
            icon: 'Sprites/Icons/Icon_Story.png',
            trials: [
                generateTrial(3, Items.Energy, 2),
                generateTrial(5, Items.Energy, 2),
                generateTrial(7, Items.Energy, 3),
                generateTrial(9, Items.Energy, 5),
                generateTrial(12, Items.BoosterHint, 3),
            ], levelType: LevelType.Trial, loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinWithSomeTime({
            title: 'Выиграть за время',
            langID: 'win_time_a',
            icon: 'Sprites/Icons/Icon_Stopwatch.png',
            loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinInARow({
            title: 'Победы в Пауке одна масть',
            langID: 'win_s_o_a',
            icon: 'Sprites/Icons/Icon_WS1.png',
            trials: [
                generateTrial(3, Items.Energy, 2),
                generateTrial(5, Items.Energy, 2),
                generateTrial(7, Items.Energy, 3),
                generateTrial(9, Items.Energy, 5),
                generateTrial(12, Items.BoosterHint, 3),
            ], rule: Rule.OneSuitSpider, loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinInARow({
            title: 'Победы в Пауке две масти',
            langID: 'win_s_t_a',
            icon: 'Sprites/Icons/Icon_WS2.png',
            trials: [
                generateTrial(3, Items.Energy, 2),
                generateTrial(5, Items.Energy, 2),
                generateTrial(7, Items.Energy, 3),
                generateTrial(9, Items.Energy, 5),
                generateTrial(12, Items.BoosterHint, 3),
            ], rule: Rule.TwoSuitsSpider, loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinInARow({
            title: 'Победы в Пауке четыре масти',
            langID: 'win_s_f_a',
            icon: 'Sprites/Icons/Icon_WS4.png',
            trials: [
                generateTrial(3, Items.Energy, 2),
                generateTrial(5, Items.Energy, 2),
                generateTrial(7, Items.Energy, 3),
                generateTrial(9, Items.Energy, 5),
                generateTrial(12, Items.BoosterHint, 3),
            ], rule: Rule.FourSuitsSpider, loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinInARow({
            title: 'Победы в Паучихе одна масть',
            langID: 'win_sl_o_a',
            icon: 'Sprites/Icons/Icon_WSL1.png',
            trials: [
                generateTrial(3, Items.Energy, 2),
                generateTrial(5, Items.Energy, 2),
                generateTrial(7, Items.Energy, 3),
                generateTrial(9, Items.Energy, 5),
                generateTrial(12, Items.BoosterHint, 3),
            ], rule: Rule.OneSuitSpiderLady, loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinInARow({
            title: 'Победы в Паучихе две масти',
            langID: 'win_sl_t_a',
            icon: 'Sprites/Icons/Icon_WSL2.png',
            trials: [
                generateTrial(3, Items.Energy, 2),
                generateTrial(5, Items.Energy, 2),
                generateTrial(7, Items.Energy, 3),
                generateTrial(9, Items.Energy, 5),
                generateTrial(12, Items.BoosterHint, 3),
            ], rule: Rule.TwoSuitsSpiderLady, loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinInARow({
            title: 'Победы в Паучихе четыре масти',
            langID: 'win_sl_f_a',
            icon: 'Sprites/Icons/Icon_WSL4.png',
            trials: [
                generateTrial(3, Items.Energy, 2),
                generateTrial(5, Items.Energy, 2),
                generateTrial(7, Items.Energy, 3),
                generateTrial(9, Items.Energy, 5),
                generateTrial(12, Items.BoosterHint, 3),
            ], rule: Rule.FourSuitsSpiderLady, loadData: { currentValue: 0, completedIndex: 0 }
        }));

        this.updateEvent = new Action();

        for (let i = 0; i < this.achievements.length; i++) {
            const element = this.achievements[i];
            element.updateEvent.addListener(this.onUpdate);

            element.onLoad();
        }

        this.contentListUpdateEvent = new Action();
        this.itemListUpdateEvent = new Action();
        this.contentUsageChanged = new Action();
        this.onItemsPublicReceive = new Action();
    }

    useContent = function (content) {
        log(`Try use content ${content.id}`)
        log(`Current available:`);
        log(this.availableContent)
        log(this.usedContent)
        let hasContentInUsageList = false;

        for (let i = 0; i < this.usedContent.length; i++) {
            const element = this.usedContent[i];

            if (element.type == content.type) {

                hasContentInUsageList = true;
                if (element.id != content.id && this.hasContent(content)) {
                    this.usedContent[i] = content;
                    this.contentUsageChanged.invoke(this.usedContent);

                    this.saveData();

                    return;
                }
            }
        }

        if (!hasContentInUsageList) {
            this.usedContent.push(content);
            this.contentUsageChanged.invoke(this.usedContent);

            this.saveData();
        }
    }

    getContentOfType = function (type) {
        for (let i = 0; i < this.usedContent.length; i++) {
            const element = this.usedContent[i];
            if (element.type == type) return element;
        }
    }

    hasContent = function (content) {
        for (let i = 0; i < this.availableContent.length; i++) {
            const element = this.availableContent[i];

            if (element.id == content.id) return true;
        }

        return false;
    }

    hasUsedContent = function (content) {
        for (let i = 0; i < this.usedContent.length; i++) {
            const element = this.usedContent[i];

            if (element.id == content.id) return true;
        }

        return false;
    }

    addContent = function (content) {
        if (content == null) return;

        for (let i = 0; i < this.availableContent.length; i++) {
            const element = this.availableContent[i];
            if (element.id == content.id) return;
        }

        this.availableContent.push(content);
        this.contentListUpdateEvent.invoke(this.availableContent);

        log(`Update user content [${content.type.id} (${content.count})]: ${this.availableContent.map(i => ` ${i.id}`)}`, "user", "details");

        this.saveData();
    }

    addContents = function (contents) { // xd
        if (contents == null) return;

        for (let i = 0; i < contents.length; i++) {
            const element = contents[i];

            this.addContent(element.type);
        }
    }

    removeContent = function (content) {
        for (let i = 0; i < this.availableContent.length; i++) {
            const element = this.availableContent[i];
            if (element.id == content.id) {
                this.availableContent.splice(i, 1);
                log(`Remove user content: [${element.type}, ${element.id}] ${this.availableContent.map(i => `\n\t(${i.type}, ${i.id})`)}`, "user", "details")

                this.useFirstAvalableContentOfType(content.type);

                this.contentListUpdateEvent.invoke(this.availableContent);

                this.saveData();
                return;
            }
        }
    }

    useFirstAvalableContentOfType = function (type) {
        for (let i = 0; i < this.availableContent.length; i++) {
            const element = this.availableContent[i];

            if (element.type == type) {
                this.useContent(element);
                return;
            }
        }

        for (let i = 0; i < this.usedContent.length; i++) {
            const element = this.usedContent[i];
            if (element.type == type) {
                this.usedContent.splice(i, 1);
                break;
            }
        }
    }

    addItem = function (type, count = 1, withView = { isTrue: false, isMonetized: false }) {
        if (type == null || count == null) return false;

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].type == type) {
                this.items[i].count += count;
                if (withView.isTrue) { this.onItemsPublicReceive.invoke({ items: [{ type: type, count: count }], monetized: withView.isMonetized }); }

                log(`Update user items [${type} (${count})]: ${this.items[i].type} (${this.items[i].count})`, "user", "details");
                this.itemListUpdateEvent.invoke(this.items);

                this.saveData();
                return true;
            }
        }

        this.items.push({ type: type, count: count });
        if (withView.isTrue) { this.onItemsPublicReceive.invoke({ items: [{ type: type, count: count }], monetized: withView.isMonetized }); }
        this.itemListUpdateEvent.invoke(this.items);

        this.saveData();
        return true;
    }

    addItems = function (items, withView = { isTrue: false, isMonetized: false }) {
        if (items == null) return;

        for (let i = 0; i < items.length; i++) {
            const element = items[i];
            if (element.type == null || element.count <= 0) items.splice(i, 1);
        }

        for (let i = 0; i < items.length; i++) {
            const element = items[i];
            this.addItem(element.type, element.count);
        }

        if (withView.isTrue) {
            this.onItemsPublicReceive.invoke({ items: items, monetized: withView.isMonetized });
        }
    }

    hasItems = function (itemType, count = 1) {
        if (this.items == null || itemType == null) return false;

        for (let i = 0; i < this.items.length; i++) {
            const element = this.items[i];
            if (element.type == itemType) {
                return element.count >= count;
            }
        }

        return false;
    }
    getItemCount = function (itemType) {
        for (let i = 0; i < this.items.length; i++) {
            const element = this.items[i];
            if (element.type == itemType) {
                return element.count;
            }
        }
    }

    removeItem = function (type, count) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].type == type && this.items[i].count > 0) {
                this.items[i].count -= count;

                // if (this.items[i].count <= 0) {
                //     this.items.splice(this.items.indexOf(this.items[i]), 1);
                // }

                this.itemListUpdateEvent.invoke(this.items);

                this.saveData();
                return;
            }
        }

        this.itemListUpdateEvent.invoke(this.items);

        this.saveData();
    }

    onUpdate = () => {
        this.updateEvent.invoke();

        this.saveData();
    }

    unload = function () {
        for (let i = 0; i < this.achievements.length; i++) {
            const element = this.achievements[i];

            element.unload();
        }
    }

    saveData = function () {
        const saveObject = {
            items: this.items,
            availableContent: this.availableContent,
            usedContent: this.usedContent,
            achievements: this.achievements.map(i => i.completedIndex)
        }

        save("user_01", saveObject);
    }

    loadTestData = function (data) {
        if (data == null) {
            return;
        }

        this.items = data.items;
        this.availableContent = data.availableContent;
        this.usedContent = data.usedContent;

        for (let i = 0; i < this.achievements.length; i++) {
            const element = this.achievements[i];

            element.completedIndex = data.achievements[i];
        }
    }

    loadData = function () {
        let data = load("user_01");

        if (data == null) {
            return;
        }

        this.items = data.items;
        this.availableContent = data.availableContent;
        this.usedContent = data.usedContent;

        for (let i = 0; i < this.achievements.length; i++) {
            const element = this.achievements[i];

            element.completedIndex = data.achievements[i];
        }
    }
}