import { animator } from "./animator.js";
import { Action, disableInteractions, enableInteractions } from "./globalEvents.js";

class CardCollector {
    constructor() {
        this.collectedCardColumns = 0;

        this.onCollected = new Action();
    }
    registerCardColums = function (cardColumns) {
        this.cardColumns = cardColumns;
    }

    collect = function (cards, fromColumn) {
        if (cards == null || cards.length < 13) {
            return;
        }

        const index = this.collectedCardColumns;

        if (index < 0 || index > this.cardColumns.length - 1) return;

        const column = this.cardColumns[index];


        const event = this.onCollected;
        const cardColumnsCount = this.cardColumns.length;
        const collectedCount = this.collectedCardColumns + 1;

        column.translateCardsToColumnWithDelay(cards, () => {
            fromColumn.checkIfLastCardClosedAndOpen();

            event.invoke({ columnCount: cardColumnsCount, collectedCount: collectedCount });
        }, { opened: 0.02, closed: 0 }, { opened: 0, closed: 0 }, { affectInteraction: false, addCards: true, openOnFinish: false, closeOnFinish: false, delay: 0.03 });

        // function collect(cards) {
        //     disableInteractions();
        //     let time = 0;

        //     function update(dt) {
        //         time += dt * 60 / 1000;
        //         if (time >= 0.03) {
        //             if (cards.length == 0) {
        //                 fromColumn.checkIfLastCardClosedAndOpen();
        //                 animator.removeRequest(update);
        //                 enableInteractions();

        //                 event.invoke({ columnCount: cardColumnsCount, collectedCount: collectedCount });
        //                 return;
        //             }

        //             const card = cards[cards.length - 1];
        //             column.translateCardsToColumnWithOffset([card], () => {
        //             }, { opened: 0.02, closed: 0 }, { opened: 0, closed: 0 }, { affectInteraction: false, addCards: true, openOnFinish: false, closeOnFinish: false });
        //             cards.splice(cards.length - 1, 1);

        //             time = 0;
        //         }
        //     }

        //     animator.addRequest(update)
        // }

        // collect(cards);

        this.collectedCardColumns++;
    }
}

const cardCollector = new CardCollector();

export { cardCollector }