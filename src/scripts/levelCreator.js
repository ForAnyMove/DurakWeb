import { boundsChecker } from './cardBoundsChecker.js';
import Card, { CardColumn } from './cardModel.js';
import { cardCollector } from './cardsCollector.js';
import { SpiderCroupier, SpiderLadyCroupier } from './croupier.js';
import { getSkinBackImage, getSkinImage } from './data/card_skin_database.js';
import { compareCards, compareCardsFull, getRandomInt, isCardAtRankLower, isCardHasRange, isSameCard, shuffle } from './helpers.js';
import { changeRules, selectedRules } from './rules/gameRules.js';
import { CardSide, ContentType, Pattern, Rank, RanksStringList, Suit, SuitMode } from './statics/enums.js';
import { Content } from './statics/staticValues.js';

let croupier = null;
let allCards = [];

function createCollectableCardColumns() {
    let collectContainers = document.getElementsByClassName('cards-container');
    let cardColums = [];

    for (let i = 0; i < collectContainers.length; i++) {
        const container = collectContainers[i];

        const cardColumn = new CardColumn(container);
        cardColums.push(cardColumn);
    }

    cardCollector.registerCardColums(cardColums);
}


function generateCards(shuffleTime, fillCardsToMainDeck = true) {
    const skin = 1;

    const ranks = RanksStringList;
    const suits = selectedRules.suits;
    const decks = selectedRules.deckCount;

    let columnContainers = document.getElementsByClassName('playable-card-column');

    let cardColumns = [];

    for (let i = 0; i < columnContainers.length; i++) {
        const container = columnContainers[i];

        const cardColumn = new CardColumn(container);
        cardColumns.push(cardColumn);
    }

    boundsChecker.registerColumns(cardColumns);

    const mainCardsContainer = document.getElementById('extra-cards-container')
    const mainCardColumn = new CardColumn(mainCardsContainer);

    mainCardColumn.setCantPlace();
    mainCardColumn.setCantRemove();

    let selectedFaceSkin = user.getContentOfType(ContentType.CardSkin) ?? Content.CardSkin01;
    let selectedBackSkin = user.getContentOfType(ContentType.CardBack) ?? Content.CardBackSkin01;

    const generatedCards = [];

    let iteration = 0;
    for (let i = 0; i < decks; i++) {
        for (let j = 0; j < suits.length; j++) {
            const suit = suits[j];

            for (let k = 0; k < ranks.length; k++) {
                const rank = ranks[k];

                const cardElement = document.createElement('div');

                cardElement.style.backgroundSize = "100% 100%";

                cardElement.id = `card_${rank}_${suit}_${(skin > 9 ? skin : `0${skin}`)}`;
                cardElement.classList.add('card-element');

                const cardModel = new Card(suit, k + 1, CardSide.Face, cardElement, iteration);

                cardModel.setupCardFaceImage(selectedFaceSkin);
                cardModel.setupCardBackImage(selectedBackSkin);

                generatedCards.push(cardModel);
                iteration++;
            }
        }
    }

    allCards = generatedCards;


    shuffleTime?.(generatedCards);

    if (fillCardsToMainDeck) {
        for (let i = 0; i < generatedCards.length; i++) {
            const cardModel = generatedCards[i];

            mainCardColumn.addCard(cardModel);
            cardModel.setClosed();
        }
    }
    return { mainCardColumn: mainCardColumn, playableCardColumns: cardColumns, cards: generatedCards };
}

function createLevel(options = { rules }) {
    changeRules(options.rules);

    createCollectableCardColumns();
    const result = generateCards((cards) => {
        shuffle(cards);
        shuffle(cards);
    });

    croupier = selectedRules.pattern == Pattern.Spider ? new SpiderCroupier({ mainCardColumn: result.mainCardColumn, playableCardColumns: result.playableCardColumns }) : new SpiderLadyCroupier({ mainCardColumn: result.mainCardColumn, playableCardColumns: result.playableCardColumns });
    croupier.initialDistribution();

    user.contentUsageChanged.addListener(() => {
        const skin = user.getContentOfType(ContentType.CardSkin);
        const back = user.getContentOfType(ContentType.CardBack);

        for (let i = 0; i < allCards.length; i++) {
            const card = allCards[i];

            card.setupCardFaceImage(skin);
            card.setupCardBackImage(back);
        }
    })

    return { croupier: croupier, playableCardColumns: result.playableCardColumns, mainCardColumn: result.mainCardColumn }
}

function createSolitaireLevel(options = { ruled, solitaireColumns }) {
    changeRules(options.rules);

    createCollectableCardColumns();
    const result = generateCards(null, false);
    const comparedCards = [];

    shuffle(result.cards);
    shuffle(result.cards);

    croupier = selectedRules.pattern == Pattern.Spider ? new SpiderCroupier({ mainCardColumn: result.mainCardColumn, playableCardColumns: result.playableCardColumns }) : new SpiderLadyCroupier({ mainCardColumn: result.mainCardColumn, playableCardColumns: result.playableCardColumns });

    function specialShuffle(cards, distributions) {

        const cardCopy = [].concat(cards);

        const more = selectedRules.pattern == Pattern.Spider && selectedRules.suitMode == SuitMode.OneSuit;

        function fillComparedCards(mainList, cardList, templateList) {
            for (let i = 0; i < mainList.length; i++) {
                const card = mainList[i];

                if (cardList.includes(card) || templateList.includes(card)) continue;

                if (isCardAtRankLower(card, templateList[cardList.length])) {
                    cardList.push(card);
                    if (cardList.length == templateList.length) break;
                }
            }

            if (cardList.length != templateList.length) fillComparedCards(mainList, cardList, templateList);
        }

        function fillRandomNCount(count, list, exceptions, allDifferent = false) {
            const selectedCard = cardCopy[getRandomInt(cardCopy.length - 1)];

            if (list.includes(selectedCard) ||
                (allDifferent && isCardHasRange(list, selectedCard, 1, more ? 3 : 1))) {
                fillRandomNCount(count, list, exceptions, allDifferent);
                return;
            }

            for (let i = 0; i < exceptions.length; i++) {
                const compared = compareCardsFull(exceptions[i].rank, exceptions[i].suit, selectedCard.rank, selectedCard.suit);
                if (compared) {
                    fillRandomNCount(count, list, exceptions, allDifferent);
                    return;
                }
            }

            list.push(selectedCard);
            if (list.length != count) fillRandomNCount(count, list, exceptions, allDifferent);
        }

        function indexOf(array, card) {
            for (let i = 0; i < array.length; i++)
                if (isSameCard(array[i], card))
                    return i;

            return -1;
        }

        function setupCardsToDeckEnd(cardList) {
            let completeCount = 0;
            let offset = 0;

            while (completeCount < cardList.length) {
                const card = cardList[completeCount];
                const index = indexOf(cards, card);

                const lastIndex = cards.length - 1 - offset;
                const lastCard = cards[lastIndex];

                if (cardList.includes(lastCard)) {
                    offset++;
                    continue;
                }

                cards[index] = lastCard;
                cards[lastIndex] = card;
                completeCount++;
            }
        }

        const randomCards = [];

        const allRandom = selectedRules.pattern == Pattern.Spider;

        fillRandomNCount(result.playableCardColumns.length, randomCards, [
            { rank: Rank.Ace, suit: Suit.Hearts },
            { rank: Rank.Ace, suit: Suit.Spades },
            { rank: Rank.Ace, suit: Suit.Diamonds },
            { rank: Rank.Ace, suit: Suit.Clubs }
        ], allRandom);

        fillComparedCards(cards, comparedCards, randomCards);

        setupCardsToDeckEnd(comparedCards);

        let counter = 0;
        for (let i = 0; i < distributions.length; i++) {
            if (distributions[i].opened) {
                const currentCardIndex = i;
                const currentCard = cards[currentCardIndex];

                const selected = randomCards[counter];

                const index = indexOf(cards, selected);

                cards[index] = currentCard;
                cards[currentCardIndex] = selected;

                counter++;
            }
        }
    }

    specialShuffle(result.cards, croupier.firstDistribution);

    for (let i = result.cards.length - 1; i >= 0; i--) {
        const cardModel = result.cards[i];

        result.mainCardColumn.addCard(cardModel);
        cardModel.setClosed();
    }

    croupier.initialDistribution();

    user.contentUsageChanged.addListener(() => {
        const skin = user.getContentOfType(ContentType.CardSkin);
        const back = user.getContentOfType(ContentType.CardBack);

        for (let i = 0; i < allCards.length; i++) {
            const card = allCards[i];

            card.setupCardFaceImage(skin);
            card.setupCardBackImage(back);
        }
    })

    return { croupier: croupier, playableCardColumns: result.playableCardColumns, mainCardColumn: result.mainCardColumn, solitaireCards: comparedCards }
}

export { createLevel, createSolitaireLevel }