import { CardSide, Pattern, Rule, Suit, SuitMode } from "../statics/enums.js";

function isSuitableRank(first, second) {
    let compareRank = second.rank + 1;

    return first.rank == compareRank;
}
function isSuitableRankReversed(first, second) {
    let compareRank = first.rank + 1;

    return second.rank == compareRank;
}

function isSameSuitAtAllStuck(cards) {
    if (cards == null || cards.length == 0) {
        return false;
    }

    const lastSuit = cards[0].suit;

    for (let i = 1; i < cards.length; i++)
        if (lastSuit != cards[i].suit) {
            return false;
        }

    return true;
}
function isSuitableRankStuck(cards, maxCount) {
    let count = 0;
    for (let i = 0; i < cards.length - 1; i++) {
        if (count == maxCount - 1) return { isTrue: true, count: count };
        if (!isSuitableRankReversed(cards[i], cards[i + 1])) {
            return { isTrue: false, count: count };
        }
        count++;
    }

    return { isTrue: true, count: count };
}

class GameRule {
    constructor(suits, suitMode, pattern, rule, deckCount) {
        this.suits = suits;
        this.suitMode = suitMode;
        this.pattern = pattern;
        this.deckCount = deckCount;
        this.rule = rule;
    }
}

class OneSuitGameRule extends GameRule {
    isCanRemove = function (selectedCards) {
        if (selectedCards == null || selectedCards.length == 0) return false;

        if (selectedCards.side == CardSide.Back) return false;

        if (selectedCards.length > 1) {
            const sameSuit = isSameSuitAtAllStuck(selectedCards);

            if (!sameSuit) return false;

            const suitableRank = isSuitableRankStuck([].concat(selectedCards).reverse());

            if (!suitableRank.isTrue) return false;
        }

        return true;
    }

    isCanPlace = function (selectedCards, columnCards) {
        if (selectedCards == null || selectedCards.length == 0 || columnCards == null) return false;

        if (columnCards.length == 0) return true;

        const firstPlaceCard = selectedCards[0];
        const lastStackCard = columnCards[columnCards.length - 1];

        if (lastStackCard.side == CardSide.Back) return false;

        if (!isSuitableRank(lastStackCard, firstPlaceCard) /*|| !isSameSuitAtAllStuck([columnCards[columnCards.length - 1]].concat(selectedCards))*/) return false;

        return true;
    }

    isCardSetCollectable = function (columnCards) {
        let collectionCount = 13;

        if (columnCards == null || columnCards.length < collectionCount) {
            return { isTrue: false };
        }

        let cardList = [];

        for (let i = columnCards.length - 1; i >= 0; i--)
            if (columnCards[i].side == CardSide.Face) {
                cardList.push(columnCards[i]);
                if (cardList.length >= collectionCount) break;
            }

        if (cardList.length < collectionCount) {
            return { isTrue: false };
        }


        if (!isSameSuitAtAllStuck(cardList)) {
            return { isTrue: false };
        }

        const result = isSuitableRankStuck(cardList, collectionCount);

        if (result.isTrue) {
            cardList.reverse();
            return { isTrue: true, cards: cardList };
        }

        return { isTrue: false };
    }
}

const oneSuitSpider = new OneSuitGameRule([Suit.Spades, Suit.Spades, Suit.Spades, Suit.Spades], SuitMode.OneSuit, Pattern.Spider, Rule.OneSuitSpider, 2);
const twoSuitSpider = new OneSuitGameRule([Suit.Spades, Suit.Diamonds, Suit.Spades, Suit.Diamonds], SuitMode.TwoSuits, Pattern.Spider, Rule.TwoSuitsSpider, 2);
const fourSuitSpider = new OneSuitGameRule([Suit.Spades, Suit.Diamonds, Suit.Clubs, Suit.Hearts], SuitMode.FourSuits, Pattern.Spider, Rule.FourSuitsSpider, 2);

const oneSuitSpiderLady = new OneSuitGameRule([Suit.Spades, Suit.Spades, Suit.Spades, Suit.Spades], SuitMode.OneSuit, Pattern.SpiderLady, Rule.OneSuitSpiderLady, 1);
const twoSuitSpiderLady = new OneSuitGameRule([Suit.Spades, Suit.Diamonds, Suit.Spades, Suit.Diamonds], SuitMode.TwoSuits, Pattern.SpiderLady, Rule.TwoSuitsSpiderLady, 1);
const fourSuitSpiderLady = new OneSuitGameRule([Suit.Spades, Suit.Diamonds, Suit.Clubs, Suit.Hearts], SuitMode.FourSuits, Pattern.SpiderLady, Rule.FourSuitsSpiderLady, 1);

let selectedRules = oneSuitSpider;

function changeRules(rule) {
    selectedRules = rule;
}

export { selectedRules, changeRules, oneSuitSpider, twoSuitSpider, fourSuitSpider, oneSuitSpiderLady, twoSuitSpiderLady, fourSuitSpiderLady, isSameSuitAtAllStuck, isSuitableRank, isSuitableRankReversed, isSuitableRankStuck }