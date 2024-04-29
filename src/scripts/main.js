import { storyLevelDatabase, trialLevelDatabase } from "./data/level_databases.js";
import { useHintBooster } from "./boosters.js";
import Card, { CardColumn } from "./cardModel.js";
import { statistics, updateEvent } from "./gameStatistics.js";
import { completeLevel, failLevel, startLevel } from "./levelStarter.js";
import { log } from "./logger.js";
import { oneSuitSpider } from "../../rules/gameRules.js";
import { load, save } from "../../save_system/SaveSystem.js";
import { CardSide, Rank, Suit } from "../../statics/enums.js";
import { Content, Items } from "../../statics/staticValues.js";

let database = storyLevelDatabase;

database.currentLevel = load("story_level", 0);


user.addItem(Items.Energy, 10);


function testLeveling() {
    let counter = 0;

    while (true) {
        let started = startLevel(database);

        if (!started) break;

        let completed = completeLevel();

        if (!completed) break;

        counter++;
    }

    log(`Levels completed count: ${counter}`);
}
function testUserAchievementCompletion() {
    statistics.ingameDayCount += 3;
    updateEvent.invoke();


    function tryComplete(timeout) {
        setTimeout(() => {
            let reward = user.achievements[0].tryCompleteCurrentTrial();
            if (reward != null) {
                user.addItem(reward.type, reward.count);
            }
        }, timeout)
    }
    tryComplete(500);
    tryComplete(1000);
    tryComplete(1500);
}
function testUserContent() {
    log(user.usedContent.map(i => `(${i.type, i.id})`));

    setTimeout(() => {
        user.removeContent(Content.CardBackSkin01)
        log(user.usedContent.map(i => `(${i.type, i.id})`));
    }, 500);

    setTimeout(() => {
        user.removeContent(Content.CardBackSkin02)
        log(user.usedContent.map(i => `(${i.type, i.id})`));
    }, 1000);

    setTimeout(() => {
        user.useContent(Content.CardBackSkin02)
        log(user.usedContent.map(i => `(${i.type, i.id})`));
    }, 1500);
}
function testRules() {
    const cardDiamondKing = new Card(Suit.Diamonds, Rank.King, CardSide.Face);
    const cardDiamondQueen = new Card(Suit.Diamonds, Rank.Queen, CardSide.Face);
    const cardDiamondJack = new Card(Suit.Diamonds, Rank.Jack, CardSide.Face);
    const cardDiamondTen = new Card(Suit.Diamonds, Rank.Ten, CardSide.Face);
    const cardDiamondNine = new Card(Suit.Diamonds, Rank.Nine, CardSide.Face);
    const cardDiamondEight = new Card(Suit.Diamonds, Rank.Eight, CardSide.Face);
    const cardDiamondSeven = new Card(Suit.Diamonds, Rank.Seven, CardSide.Face);
    const cardDiamondSix = new Card(Suit.Diamonds, Rank.Six, CardSide.Face);
    const cardDiamondFive = new Card(Suit.Diamonds, Rank.Five, CardSide.Face);
    const cardDiamondFour = new Card(Suit.Diamonds, Rank.Four, CardSide.Face);
    const cardDiamondThree = new Card(Suit.Diamonds, Rank.Three, CardSide.Face);
    const cardDiamondTwo = new Card(Suit.Diamonds, Rank.Two, CardSide.Face);
    const cardDiamondAce = new Card(Suit.Diamonds, Rank.Ace, CardSide.Face);

    const column = [];

    column.push(cardDiamondKing);
    column.push(cardDiamondQueen);
    column.push(cardDiamondJack);
    column.push(cardDiamondTen);
    column.push(cardDiamondNine);
    column.push(cardDiamondEight);
    column.push(cardDiamondSeven);
    column.push(cardDiamondSix);
    column.push(cardDiamondFive);
    column.push(cardDiamondFour);
    column.push(cardDiamondThree);
    column.push(cardDiamondTwo);
    column.push(cardDiamondAce);

    console.log(oneSuitSpider.isCardSetCollectable(column));
}

function testHintBooster() {
    const columnOne = new CardColumn();
    const columnTwo = new CardColumn();

    const cardDiamondKing = new Card(Suit.Diamonds, Rank.King, CardSide.Face);
    const cardDiamondQueen = new Card(Suit.Diamonds, Rank.Queen, CardSide.Face);
    const cardDiamondJack = new Card(Suit.Diamonds, Rank.Jack, CardSide.Face);
    const cardDiamondTen = new Card(Suit.Diamonds, Rank.Ten, CardSide.Face);
    const cardDiamondNine = new Card(Suit.Diamonds, Rank.Nine, CardSide.Face);
    const cardDiamondEight = new Card(Suit.Diamonds, Rank.Eight, CardSide.Face);
    const cardDiamondSeven = new Card(Suit.Diamonds, Rank.Seven, CardSide.Face);
    const cardDiamondSix = new Card(Suit.Diamonds, Rank.Six, CardSide.Face);
    const cardDiamondFive = new Card(Suit.Diamonds, Rank.Five, CardSide.Face);
    const cardDiamondFour = new Card(Suit.Diamonds, Rank.Four, CardSide.Face);
    const cardDiamondThree = new Card(Suit.Diamonds, Rank.Three, CardSide.Face);
    const cardDiamondTwo = new Card(Suit.Diamonds, Rank.Two, CardSide.Face);
    const cardDiamondAce = new Card(Suit.Diamonds, Rank.Ace, CardSide.Face);

    columnOne.addCard(cardDiamondNine);
    columnOne.addCard(cardDiamondEight);
    columnOne.addCard(cardDiamondSeven);
    columnOne.addCard(cardDiamondSix);
    columnOne.addCard(cardDiamondFive);
    columnOne.addCard(cardDiamondFour);
    columnOne.addCard(cardDiamondThree);
    columnOne.addCard(cardDiamondTwo);
    columnOne.addCard(cardDiamondAce);


    columnTwo.addCard(cardDiamondTen);

    let result = useHintBooster([columnTwo, columnOne], oneSuitSpider);
    console.log(result);
}

testHintBooster();
// let done = false;
// let lastTimeStamp = 0;

// let timer = 0;

// function step(timeStamp) {

//     let dt = (timeStamp - lastTimeStamp) / 60;

//     timer += dt * 60 / 1000;

//     log(Math.floor(timer));


//     lastTimeStamp = timeStamp;

//     if (!done) {
//         window.requestAnimationFrame(step);
//     }
// }

// window.requestAnimationFrame(step);
