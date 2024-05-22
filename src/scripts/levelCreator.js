import { CardsCount } from './battleFlow.js';
import Card, { CardsDeck } from './cardModel.js';
import { shuffle } from './helpers.js';
import { CardSide, ContentType, FullRanksStringList, RanksStringList, Suit } from './statics/enums.js';
import { Content } from './statics/staticValues.js';

let allCards = [];

function generateCards(cardsCount, shuffleTime, fillCardsToMainDeck = true) {
    const skin = 1;
    const ranksString = FullRanksStringList;

    const suits = [Suit.Clubs, Suit.Diamonds, Suit.Spades, Suit.Hearts];
    const decks = 1;

    const mainCardsContainer = document.getElementById('cards-deck')
    const mainCardColumn = new CardsDeck(mainCardsContainer);

    mainCardColumn.setCantPlace();
    mainCardColumn.setCantRemove();

    let selectedFaceSkin = user.getContentOfType(ContentType.CardSkin) ?? Content.CardSkin01;
    let selectedBackSkin = user.getContentOfType(ContentType.CardBack) ?? Content.CardBackSkin01;

    const generatedCards = [];

    let iteration = 0;
    for (let i = 0; i < decks; i++) {
        for (let j = 0; j < suits.length; j++) {
            const suit = suits[j];

            for (let k = cardsCount == CardsCount[36] ? 4 : 0; k < ranksString.length; k++) {
                const rank = ranksString[k];

                const cardElement = document.createElement('div');

                cardElement.style.backgroundSize = "100% 100%";

                cardElement.id = `card_${rank}_${suit}_${(skin > 9 ? skin : `0${skin}`)}`;
                cardElement.classList.add('card-element');

                const cardModel = new Card(suit, k + 2, CardSide.Face, cardElement, iteration);

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
    return { mainCardColumn: mainCardColumn, cards: generatedCards };
}

function createLevel(cardsCount, pattern) {
    const result = generateCards(cardsCount, (cards) => {
        if (pattern != null) {
            console.log(cards.length);
            const compareTo = (card1, card2) => {
                const index1 = pattern.findIndex(
                    p => p.rank == card1.rank && p.suit == card1.suit
                );
                const index2 = pattern.findIndex(
                    p => p.rank == card2.rank && p.suit == card2.suit
                );
                return index1 - index2;
            }

            cards.sort(compareTo);

        } else {
            shuffle(cards);
            shuffle(cards);
        }

        setTimeout(() => {
            cards[0].setOpened();
            trumpSuit = cards[0].suit;
        }, 0)
    });

    user.contentUsageChanged.addListener(() => {
        const skin = user.getContentOfType(ContentType.CardSkin);
        const back = user.getContentOfType(ContentType.CardBack);

        for (let i = 0; i < allCards.length; i++) {
            const card = allCards[i];

            card.setupCardFaceImage(skin);
            card.setupCardBackImage(back);
        }
    })

    return { mainCardColumn: result.mainCardColumn, cards: result.cards }
}

export { createLevel }