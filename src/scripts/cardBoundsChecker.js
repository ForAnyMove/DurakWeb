
// const closedCardOffset = 0.5;
// const openedCardOffset = 1.5;

class BoundsChecker {
    registerColumns = function (columns) {
        this.columns = columns;
    }

    getColumnsByCard = function (card) {
        const cardPosition = { x: card.domElement.getBoundingClientRect().left, y: card.domElement.getBoundingClientRect().top }
        const cardSize = { x: card.domElement.offsetWidth, y: card.domElement.offsetHeight }

        const suitableColumns = [];
        const vwOffset = window.innerWidth / 100;

        const rootStyles = getComputedStyle(document.documentElement);
        const openedCardOffset = parseFloat(rootStyles.getPropertyValue('--opened-card-offset')) * vwOffset;
        const closedCardOffset = parseFloat(rootStyles.getPropertyValue('--closed-card-offset')) * vwOffset;
        const height = parseFloat(rootStyles.getPropertyValue('--card-height')) * vwOffset;
        cardSize.y = height;

        const getColumnHeight = (column) => {
            let h = height;

            for (let i = 0; i < column.cards.length; i++) {
                const element = column.cards[i];
                if (element.domElement.classList.contains('opened')) {
                    const offsetV = height + openedCardOffset;

                    h += offsetV;
                } else if (!element.domElement.classList.contains('locked')) {
                    const offsetV = height + closedCardOffset;

                    h += offsetV;
                }
            }

            return h;
        }

        for (let i = 0; i < this.columns.length; i++) {
            const column = this.columns[i];

            const columnPosition = { x: column.domElement.getBoundingClientRect().left, y: column.domElement.getBoundingClientRect().top }
            const columnSize = { x: cardSize.x, y: getColumnHeight(column) }

            if ((cardPosition.x < columnPosition.x + columnSize.x) && (cardPosition.x + cardSize.x > columnPosition.x) &&
                (cardPosition.y < columnPosition.y + columnSize.y) && (cardPosition.y + cardSize.y > columnPosition.y)) {
                suitableColumns.push(column);
            }
        }

        return suitableColumns;
    }
}

const boundsChecker = new BoundsChecker();

export { boundsChecker }