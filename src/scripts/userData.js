import { WinCount, WinInARow, InGameDayCount, generateTrial, DraftCount, AceLose, ThrowCards, TransfareCards, CurrencyCollected } from "./achievements.js";
import { EntityMode, GameMode } from "./battleFlow.js";
import { updateCurrencyStatistics } from "./gameStatistics.js";
import { Action } from "./globalEvents.js";
import { log } from "./logger.js";
import { load, save } from "./save_system/SaveSystem.js";
import { Content, Items } from "./statics/staticValues.js";

export default class User {
    constructor() {
        this.items = [{
            type: Items.Currency,
            count: 200
        }]

        this.availableContent = [
            Content.CardSkin01, Content.CardBackSkin01, Content.Background01];

        this.usedContent = [Content.CardSkin01, Content.CardBackSkin01, Content.Background01];

        this.achievements = [];
        this.achievements.push(new InGameDayCount({
            title: 'Дней в игре',
            langID: 'UserData/Achievements/Title/DaysInGame',
            icon: './Sprites/Desktop - дурак- достижения/Achievement Icon 5.png',
            loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinCount({
            title: 'Игр выиграно',
            langID: 'UserData/Achievements/Title/GamesWin',
            icon: './Sprites/Desktop - дурак- достижения/Achievement Icon 4.png',
            trials: [
                generateTrial(1, Items.Currency, 100),
                generateTrial(5, Items.Currency, 200),
                generateTrial(10, Items.Currency, 300),
                generateTrial(15, Items.Currency, 500),
            ],
            loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinCount({
            title: '\"Подкидной\" Игр выиграно',
            langID: 'UserData/Achievements/Title/TossGamesWin',
            icon: './Sprites/Desktop - дурак- достижения/Achievement Icon 1.png',
            trials: [
                generateTrial(1, Items.Currency, 100),
                generateTrial(5, Items.Currency, 200),
                generateTrial(10, Items.Currency, 300),
                generateTrial(15, Items.Currency, 500),
            ],
            loadData: { currentValue: 0, completedIndex: 0 },
            gameMode: GameMode.DurakDefault
        }));
        this.achievements.push(new WinCount({
            title: '\"Переводной\" Игр выиграно',
            langID: 'UserData/Achievements/Title/TransitGamesWin',
            icon: './Sprites/Desktop - дурак- достижения/Achievement Icon 3.png',
            trials: [
                generateTrial(1, Items.Currency, 100),
                generateTrial(5, Items.Currency, 200),
                generateTrial(10, Items.Currency, 300),
                generateTrial(15, Items.Currency, 500),
            ],
            loadData: { currentValue: 0, completedIndex: 0 },
            gameMode: GameMode.DurakTransfare
        }));
        this.achievements.push(new WinCount({
            title: '\"2 на 2\" Игр выиграно',
            langID: 'UserData/Achievements/Title/TeamGamesWin',
            icon: './Sprites/Desktop - дурак- достижения/Achievement Icon 3.png',
            trials: [
                generateTrial(1, Items.Currency, 100),
                generateTrial(5, Items.Currency, 200),
                generateTrial(10, Items.Currency, 300),
                generateTrial(15, Items.Currency, 500),
            ],
            loadData: { currentValue: 0, completedIndex: 0 },
            entityMode: EntityMode.Pair
        }));
        this.achievements.push(new WinInARow({
            title: 'Побед подряд',
            langID: 'UserData/Achievements/Title/WinInRow',
            icon: './Sprites/Desktop - дурак- достижения/Achievement Icon 1.png',
            trials: [
                generateTrial(3, Items.Currency, 300),
                generateTrial(7, Items.Currency, 700),
                generateTrial(10, Items.Currency, 1000),
            ],
            loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinInARow({
            title: '\"Подкидной\" Побед подряд',
            langID: 'UserData/Achievements/Title/TossWinInRow',
            icon: './Sprites/Desktop - дурак- достижения/Achievement Icon 4.png',
            trials: [
                generateTrial(3, Items.Currency, 300),
                generateTrial(7, Items.Currency, 700),
                generateTrial(10, Items.Currency, 1000),
            ],
            loadData: { currentValue: 0, completedIndex: 0 },
            gameMode: GameMode.DurakDefault
        }));
        this.achievements.push(new WinInARow({
            title: '\"Переводной\" Побед подряд',
            langID: 'UserData/Achievements/Title/TransitWinInRow',
            icon: './Sprites/Desktop - дурак- достижения/Achievement Icon 1.png',
            trials: [
                generateTrial(3, Items.Currency, 300),
                generateTrial(7, Items.Currency, 700),
                generateTrial(10, Items.Currency, 1000),
            ],
            loadData: { currentValue: 0, completedIndex: 0 },
            gameMode: GameMode.DurakTransfare
        }));
        this.achievements.push(new WinInARow({
            title: '\"2 на 2\" Побед подряд',
            langID: 'UserData/Achievements/Title/TeamWinInRow',
            icon: './Sprites/Desktop - дурак- достижения/Achievement Icon 3.png',
            trials: [
                generateTrial(3, Items.Currency, 300),
                generateTrial(7, Items.Currency, 700),
                generateTrial(10, Items.Currency, 1000),
            ],
            loadData: { currentValue: 0, completedIndex: 0 },
            entityMode: EntityMode.Pair
        }));
        this.achievements.push(new DraftCount({
            title: 'Закончить ничьей',
            langID: 'UserData/Achievements/Title/EndGameInDraw',
            icon: './Sprites/Desktop - дурак- достижения/Achievement Icon 2.png',
            trials: [
                generateTrial(1, Items.Currency, 100),
                generateTrial(5, Items.Currency, 200),
                generateTrial(10, Items.Currency, 300),
            ],
            loadData: { currentValue: 0, completedIndex: 0 },
        }));
        this.achievements.push(new AceLose({
            title: 'Остаться в дураках с тузами',
            langID: 'UserData/Achievements/Title/LoseGameWithAces',
            icon: './Sprites/Desktop - дурак- достижения/Achievement Icon 1.png',
            trials: [
                generateTrial(1, Items.Currency, 500),
            ],
            loadData: { currentValue: 0, completedIndex: 0 },
        }));
        this.achievements.push(new ThrowCards({
            title: 'Подкинуть карт',
            langID: 'UserData/Achievements/Title/TossCards',
            icon: './Sprites/Desktop - дурак- достижения/Achievement Icon 4.png',
            trials: [
                generateTrial(10, Items.Currency, 100),
                generateTrial(50, Items.Currency, 200),
                generateTrial(100, Items.Currency, 300),
                generateTrial(200, Items.Currency, 400),
                generateTrial(300, Items.Currency, 500),
            ],
            loadData: { currentValue: 0, completedIndex: 0 },
        }));
        this.achievements.push(new TransfareCards({
            title: 'Перевод карт',
            langID: 'UserData/Achievements/Title/TransitCards',
            icon: './Sprites/Desktop - дурак- достижения/Achievement Icon 3.png',
            trials: [
                generateTrial(5, Items.Currency, 100),
                generateTrial(10, Items.Currency, 200),
                generateTrial(20, Items.Currency, 300),
                generateTrial(30, Items.Currency, 400),
                generateTrial(50, Items.Currency, 500),
            ],
            loadData: { currentValue: 0, completedIndex: 0 },
        }));
        this.achievements.push(new CurrencyCollected({
            title: 'Накопить монет',
            langID: 'UserData/Achievements/Title/MoneyEarned',
            icon: './Sprites/Desktop - дурак- достижения/Achievement Icon 1.png',
            trials: [
                generateTrial(500, Items.Currency, 100),
                generateTrial(1000, Items.Currency, 200),
                generateTrial(2000, Items.Currency, 300),
                generateTrial(3000, Items.Currency, 400),
                generateTrial(5000, Items.Currency, 500),
            ],
            loadData: { currentValue: 0, completedIndex: 0 },
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

    addContent = function (content, withView = { isTrue: false, isMonetized: false }) {
        if (content == null) return;

        for (let i = 0; i < this.availableContent.length; i++) {
            const element = this.availableContent[i];
            if (element.id == content.id) return;
        }

        this.availableContent.push(content);
        this.contentListUpdateEvent.invoke(this.availableContent);

        if (withView.isTrue) { this.onItemsPublicReceive.invoke({ content: [content], monetized: withView.isMonetized }); }

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

                if (this.items[i].type == Items.Currency) {
                    updateCurrencyStatistics(this.items[i].count);
                }

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

            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].type == Items.Currency) {
                    updateCurrencyStatistics(this.items[i].count);
                }
            }
            return;
        }

        this.items = data.items;
        this.availableContent = data.availableContent;
        this.usedContent = data.usedContent;

        for (let i = 0; i < this.achievements.length; i++) {
            const element = this.achievements[i];

            element.completedIndex = data.achievements[i];
        }

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].type == Items.Currency) {
                updateCurrencyStatistics(this.items[i].count);
            }
        }
    }
}