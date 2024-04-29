import { DelayedCall } from "./dotween/dotween.js";
import { CanInteract, disableInteractions } from "./globalEvents.js";
import { isSameSuitAtAllStuck, isSuitableRankStuck } from "./rules/gameRules.js";
import { stepRecorder } from "./stepRecorder.js";

function useHintBooster(playableColumns, gameRule) {
    if (!CanInteract) return false;

    const pairs = [];

    for (let i = 0; i < playableColumns.length; i++) {
        const column = playableColumns[i];
        const columnCards = column.getOpenedCards();

        const suitableIteration = isSuitableRankStuck([].concat(columnCards).reverse()).count;

        if (columnCards == null) continue;

        for (let j = 0; j < playableColumns.length; j++) {
            if (i == j) continue;

            const secondColumn = playableColumns[j];
            const secondColumnLastCard = secondColumn.getLastCard();

            if (secondColumnLastCard == null) continue;

            const columnCardsCopy = [].concat(columnCards);

            let pair = { columnOne: null, columnTwo: null, cards: null };

            while (columnCardsCopy.length > 0 && columnCardsCopy.length > suitableIteration) {
                const cardList = [secondColumnLastCard].concat(columnCardsCopy).reverse();

                if (isSameSuitAtAllStuck(cardList) && isSuitableRankStuck(cardList).isTrue) {
                    pair.columnOne = column;
                    pair.columnTwo = secondColumn;
                    pair.cards = columnCardsCopy;

                    break;
                }

                columnCardsCopy.splice(0, 1);
            }

            if (pair.columnOne == null || pair.columnTwo == null || pair.cards == null) continue;

            pairs.push(pair);
        }
    }

    if (pairs.length == 0) {
        return { isTrue: false };
    } else {

        pairs.sort((a, b) => b.cards.length - a.cards.length);

        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            if (pair.columnTwo.canPlace && gameRule.isCanPlace(pair.cards, pair.columnTwo.cards)) {
                function animate() {
                    disableInteractions();

                    const fromColumn = pair.columnOne;
                    const toColumn = pair.columnTwo;
                    for (let i = 0; i < pair.cards.length; i++) {
                        const card = pair.cards[i];
                        card.domElement.classList.add('highlighted');
                    }

                    toColumn.translateCardsToColumn(pair.cards, null, { affectInteraction: false, addCards: false });
                    DelayedCall(0.25, () => {
                        fromColumn.translateCardsToColumn(pair.cards, null, { affectInteraction: true, addCards: true });

                        for (let i = 0; i < pair.cards.length; i++) {
                            const card = pair.cards[i];
                            card.domElement.classList.remove('highlighted');
                        }
                    })
                }

                animate();

                return { isTrue: true, result: pair };
            }
        }

        return { isTrue: false };
    }
}

function useTimerBooster() {
    // ?
}

function useUndoBooster() {
    if (!CanInteract) return false;
    return stepRecorder.undo()
}

function useMageBooster(mainColumn, playableColumns, gameRule) {
    if (!CanInteract || mainColumn.length == 0) {
        return { isTrue: false }
    }

    const lastColumnCards = [];

    for (let i = 0; i < playableColumns.length; i++) {
        const column = playableColumns[i];

        const lastCard = column.getLastCard();

        if (lastCard == null) continue;

        lastColumnCards.push({ column: column, card: lastCard });

    }

    if (lastColumnCards.length == 0) return { isTrue: false };

    const suitablePairs = [];
    const usedMainCardsList = [];

    for (let i = 0; i < mainColumn.cards.length; i++) {
        const card = mainColumn.cards[i];
        if (usedMainCardsList.includes(card)) continue;

        for (let j = 0; j < lastColumnCards.length; j++) {
            const element = lastColumnCards[j];

            const column = element.column;
            const lastColumnCard = element.card;

            if (card.suit == lastColumnCard.suit && card.rank == lastColumnCard.rank - 1) {
                suitablePairs.push({ column: column, card: card });
                lastColumnCards.splice(j, 1);
                usedMainCardsList.push(card);
                break;
            }
        }
    }

    const len = Math.min(2, suitablePairs.length);
    if (len == 0) return { isTrue: false };

    const finalCards = [];

    for (let i = 0; i < Math.min(2, suitablePairs.length); i++) {
        const pair = suitablePairs[i];
        finalCards.push(pair.card);
        pair.column.translateCardsToColumn([pair.card], () => {
            DelayedCall(0.1, () => { pair.column.checkIfColumnHasCollectedCardsSet(); });
        }, { affectInteraction: true, addCards: true, openOnFinish: true });
    }

    stepRecorder.record(() => {
        disableInteractions();

        mainColumn.translateCardsToColumnWithDelay(finalCards,
            null,
            { opened: 0.02, closed: 0 },
            { opened: 0, closed: 0 },
            { affectInteraction: false, addCards: true, openOnFinish: false, closeOnFinish: true, delay: 0.03 });
    });

    return { isTrue: true };
}

export { useHintBooster, useMageBooster, useUndoBooster }