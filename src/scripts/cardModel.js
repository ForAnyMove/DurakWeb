import { animator } from "./animator.js";
import { boundsChecker } from "./cardBoundsChecker.js";
import { cardSelector } from "./cardSelector.js";
import { cardCollector } from "./cardsCollector.js";
import { getSkinBackImage, getSkinImage, getSkinImageCleanPath } from "./data/card_skin_database.js";
import { DOChangeValue, DOChangeXY, DelayedCall, Ease } from "./dotween/dotween.js";
import { Action, CanInteract, disableInteractions, enableInteractions } from "./globalEvents.js";
import { preloadImagesAsync } from "./helpers.js";
import { selectedRules } from "./rules/gameRules.js";
import { CardSide, RanksStringList } from "./statics/enums.js";
import { Platform } from "./statics/staticValues.js";
import { stepRecorder } from "./stepRecorder.js";

export default class Card {
    constructor(suit, rank, side, domElement, id) {
        this.id = id;
        this.faceImage = '';
        this.backImage = '';
        this.lastFaceContent = null;
        this.lastBackContent = null;

        this.suit = suit;
        this.rank = rank;
        this.side = side;
        this.domElement = domElement;

        this.cardColumn = null;
        this.subscribeDragAndDrop();
        this.dropFinishedEvent = new Action();
    }

    setClosed = function () {
        this.side = CardSide.Back;
        this.domElement.style.backgroundImage = this.backImage;

        if (!this.domElement.classList.contains('opened') && !this.domElement.classList.contains('closed')) {
            this.domElement.classList.add('closed');
        } else {
            this.domElement.classList.replace('opened', 'closed');
        }
    }

    setOpened = function () {
        this.side = CardSide.Face;
        this.domElement.style.backgroundImage = this.faceImage;

        if (!this.domElement.classList.contains('opened') && !this.domElement.classList.contains('closed')) {
            this.domElement.classList.add('opened');
        } else {
            this.domElement.classList.replace('closed', 'opened');
        }

        this.cardColumn.recalculateFirstOpened();
    }

    open = function () {
        if (this.side == CardSide.Face) return;

        DOChangeValue(() => 1, (value) => {
            this.domElement.style.scale = `${value} 1`;
        }, 0, 0.03, Ease.SineInOut).onComplete(() => {
            this.setOpened();
            DOChangeValue(() => 0, (value) => {
                this.domElement.style.scale = `${value} 1`;
            }, 1, 0.03, Ease.SineInOut).onComplete(() => {
                this.domElement.style.scale = `1 1`;
            })
        });
    }

    close = function () {
        if (this.side == CardSide.Back) return;

        DOChangeValue(() => 1, (value) => {
            this.domElement.style.scale = `${value} 1`;
        }, 0, 0.03, Ease.SineInOut).onComplete(() => {
            this.setClosed();
            DOChangeValue(() => 0, (value) => {
                this.domElement.style.scale = `${value} 1`;
            }, 1, 0.03, Ease.SineInOut).onComplete(() => {
                this.domElement.style.scale = `1 1`;
            })
        });
    }

    setupCardBackImage = function (backContent) {
        if (this.lastBackContent == backContent) return;

        this.backImage = getSkinBackImage(backContent);

        this.lastBackContent = backContent;

        if (this.side == CardSide.Back) {
            this.domElement.style.backgroundImage = this.backImage;
        }
    }

    setupCardFaceImage = function (faceContent) {
        if (this.lastFaceContent == faceContent) return;

        this.faceImage = getSkinImage(faceContent, this.suit, RanksStringList[this.rank - 1]);
        // preloadImagesAsync([`../../../${getSkinImageCleanPath(faceContent, this.suit, RanksStringList[this.rank - 1])}`]);

        this.lastFaceContent = faceContent;
        if (this.side == CardSide.Face) {
            this.domElement.style.backgroundImage = this.faceImage;
        }
    }

    applyTVInput = () => {
        const domElement = this.domElement;

        domElement.onclick = () => {
            cardSelector.select(this.cardColumn, this.cardColumn.getCardsFrom(this));
        }
    }

    applyDesktopInput = function () {
        const domElement = this.domElement;

        domElement.onmousedown = (e) => {
            if (!CanInteract || this.side == CardSide.Back) return;

            const cards = this.cardColumn.getCardsFrom(this);

            const canRemove = this.cardColumn.canRemove && selectedRules.isCanRemove(cards);
            if (!canRemove) return;

            const x = e.pageX;
            const y = e.pageY;

            const columnTemp = this.cardColumn;
            const offsets = [];

            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                const offsetX = x - card.domElement.getBoundingClientRect().left;
                const offsetY = y - card.domElement.getBoundingClientRect().top;

                offsets.push({ x: offsetX, y: offsetY });
            }

            columnTemp.removeCards(cards);

            moveAt(e);

            function moveAt(e) {
                const x = e.pageX;
                const y = e.pageY;

                for (let i = 0; i < cards.length; i++) {
                    const card = cards[i];
                    card.domElement.style.left = x - offsets[i].x + 'px';
                    card.domElement.style.top = y - offsets[i].y + 'px';
                }
            }

            document.onmousemove = (e) => {
                moveAt(e);
            }

            domElement.onmouseup = () => {
                document.onmousemove = null;
                domElement.onmouseup = null;

                this.tryDrop(columnTemp, cards);
            }
        }
    }

    applyMobileInput = function () {
        const domElement = this.domElement;

        const handleDragStart = (e) => {
            if (this.side == CardSide.Back) return;

            const columnTemp = this.cardColumn;
            if (columnTemp == null) return;

            const touch = e.targetTouches[0];

            const x = touch.clientX;
            const y = touch.clientY;

            const cards = columnTemp.getCardsFrom(this);

            const canRemove = columnTemp.canRemove && selectedRules.isCanRemove(cards);
            if (!canRemove) return;

            const offsets = [];

            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                const offsetX = x - card.domElement.getBoundingClientRect().left;
                const offsetY = y - card.domElement.getBoundingClientRect().top;

                offsets.push({ x: offsetX, y: offsetY });
            }

            columnTemp.removeCards(cards);


            const handleDragMove = (e) => {
                const touch = e.targetTouches[0];

                const x = touch.clientX;
                const y = touch.clientY;

                for (let i = 0; i < cards.length; i++) {
                    const card = cards[i];
                    card.domElement.style.left = x - offsets[i].x + 'px';
                    card.domElement.style.top = y - offsets[i].y + 'px';
                }

                e.preventDefault();
            }

            handleDragMove(e);

            const handleDrop = (e) => {
                this.tryDrop(columnTemp, cards);

                domElement.removeEventListener('touchmove', handleDragMove);
                domElement.removeEventListener('touchend', handleDrop);
            }

            domElement.addEventListener('touchmove', handleDragMove);
            domElement.addEventListener('touchend', handleDrop);
        }

        domElement.addEventListener('touchstart', handleDragStart);
    }

    subscribeDragAndDrop = () => {
        switch (platform) {
            case Platform.Desktop:
                this.applyDesktopInput();
                break
            case Platform.TV:
                this.applyTVInput();
                break
            case Platform.Tablet:
            case Platform.Mobile:
                this.applyMobileInput();
                break
        }
    }

    tryDrop = function (previousColumn, cards) {
        const columns = boundsChecker.getColumnsByCard(this);
        for (let i = 0; i < columns.length; i++) {
            const cardColumn = columns[i];
            if (cardColumn.canPlace && selectedRules.isCanPlace([this], cardColumn.cards)) {
                cardColumn.translateCardsToColumn(cards, () => {
                    this.dropFinishedEvent.invoke(this);
                    previousColumn.checkIfLastCardClosedAndOpen()
                });
                const lastCardSide = previousColumn.getLastCard()?.side;

                stepRecorder.record(() => {
                    previousColumn.translateCardsToColumn(cards, () => {
                        cardColumn.checkIfLastCardClosedAndOpen();
                    });
                    if (previousColumn.cards.length > 0 && lastCardSide == CardSide.Back) {
                        previousColumn.getLastCard().close();
                    }
                })
                return;
            }
        }

        previousColumn.translateCardsToColumn(cards, () => {
            this.dropFinishedEvent.invoke(this);
        });
    }

    joinToColumn = function (cardColumn) {
        this.cardColumn = cardColumn;
        this.domElement.style.position = 'relative';
        this.domElement.style.left = 0;
        this.domElement.style.top = 0;
        this.domElement.style.zIndex = null;
    }

    leaveFromColumn = function () {
        this.cardColumn = null;

        const pos = { x: this.domElement.getBoundingClientRect().left, y: this.domElement.getBoundingClientRect().top };
        this.domElement.style.position = 'absolute';
        document.body.appendChild(this.domElement);

        this.domElement.style.left = `${pos.x}px`;
        this.domElement.style.top = `${pos.y}px`;
        this.domElement.style.zIndex = 2;
    }
}

class CardColumn {
    constructor(domElement) {
        this.domElement = domElement;

        this.cards = [];

        this.canPlace = true;
        this.canRemove = true;

        this.cardAddedEvent = new Action();
        this.cardRemovedEvent = new Action();
    }

    lock = function () {
        if (this.locked) return;
        this.locked = true;

        this.lockedCanPlaceState = this.canPlace;
        this.lockedCanRemoveState = this.canRemove;

        // this.setCantPlace();
        this.setCantRemove();

        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            card.domElement.classList.add('locked')
        }

        this.lockElement = document.createElement('div');
        this.lockElement.classList.add('card-locker-hidden');
        this.domElement.appendChild(this.lockElement)

        DelayedCall(0.1, () => {
            this.lockElement.classList.replace('card-locker-hidden', 'card-locked-showed');
        })

        this.cardAddedEvent.addListener(() => {
            this.unlock();
            this.cardAddedEvent.removeAllListeners();
            this.recalculateFirstOpened();
        })
    }

    unlock = () => {
        if (!this.locked) return;
        this.locked = false;

        this.setCantPlace();
        // if (this.lockedCanPlaceState) {
        //     this.setCanPlace();
        // }

        // if (this.lockedCanRemoveState) {
        // this.setCanRemove();
        // }

        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            card.domElement.classList.remove('locked')
        }

        this.lockElement.remove();
    }

    setCanPlace = function () {
        this.canPlace = true;
    }

    setCantPlace = function () {
        this.canPlace = false;
    }

    setCanRemove = function () {
        this.canRemove = true;
    }

    setCantRemove = function () {
        this.canRemove = false;
    }

    getCardsFrom = function (card) {
        const cards = [];

        let canGrab = false;
        for (let i = 0; i < this.cards.length; i++) {
            const element = this.cards[i];
            if (element == card || canGrab) {
                cards.push(element);
                canGrab = true;
            }
        }

        return cards;
    }

    translateCardsToColumnWithOffset = function (cards, finishCallback, horzontalOffset, verticalOffset, options = { affectInteraction: true, addCards: true, openOnFinish: false, closeOnFinish: false, callCallbackOnce: true }) {
        if (cards == null || cards.length == 0) return;

        let callbackInvoked = false;

        for (let i = 0; i < cards.length; i++) {
            const element = cards[i];
            if (element.cardColumn != null) {
                element.cardColumn.removeCard(element);
            }
        }

        const firstCard = cards[0];
        const targetPosition = { x: this.domElement.getBoundingClientRect().left, y: this.domElement.getBoundingClientRect().top };
        const vwOffset = window.innerWidth / 100;

        const rootStyles = getComputedStyle(document.documentElement);
        const openedCardOffset = parseFloat(rootStyles.getPropertyValue('--opened-card-offset')) * vwOffset;
        const closedCardOffset = parseFloat(rootStyles.getPropertyValue('--closed-card-offset')) * vwOffset;
        const height = parseFloat(rootStyles.getPropertyValue('--card-height')) * vwOffset;

        for (let i = 0; i < this.cards.length; i++) {
            const element = this.cards[i];

            if (element.domElement.classList.contains('opened')) {
                const offsetV = verticalOffset.closed != null ? (vwOffset * verticalOffset.opened) : (height + openedCardOffset);

                targetPosition.y += offsetV;
                targetPosition.x += vwOffset * horzontalOffset.opened;
            } else if (!element.domElement.classList.contains('locked')) {
                const offsetV = verticalOffset.closed != null ? (vwOffset * verticalOffset.closed) : (height + closedCardOffset);

                targetPosition.y += offsetV;
                targetPosition.x += vwOffset * horzontalOffset.closed;
            }
        }

        if (options.affectInteraction) {
            disableInteractions();
        }

        DOChangeXY(() => { return { x: firstCard.domElement.getBoundingClientRect().left, y: firstCard.domElement.getBoundingClientRect().top } }, (value) => {
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                card.domElement.style.left = `${value.x + (i * vwOffset * horzontalOffset.opened)}px`;
                card.domElement.style.top = `${value.y + (i * (height + openedCardOffset))}px`;
            }
        }, targetPosition, 0.08, Ease.SineOut).onComplete(() => {
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                if (options.addCards) {
                    this.addCard(card);
                }

                if (options.openOnFinish) {
                    card.open();
                }

                if (options?.closeOnFinish) {
                    card.close();
                }
                if (options.callCallbackOnce == null && !callbackInvoked || options.callCallbackOnce == false || options.callCallbackOnce == true && !callbackInvoked) {
                    callbackInvoked = true;

                    finishCallback?.();
                }
                if (options.affectInteraction) {
                    enableInteractions();
                }
            }
        });
    }

    translateCardsToColumn = function (cards, finishCallback, options = { affectInteraction: true, addCards: true, openOnFinish: false, closeOnFinish: false, callCallbackOnce: true }) {
        this.translateCardsToColumnWithOffset(cards, finishCallback, { opened: 0, closed: 0 }, { opened: null, closed: null }, options);
    }

    translateCardsToColumnWithDelay = function (cards, finishCallback, horzontalOffset, verticalOffset, options = { affectInteraction: true, addCards: true, openOnFinish: false, closeOnFinish: false, delay: 0.03, callCallbackOnce: true }) {
        const column = this;

        function translate() {
            disableInteractions();
            let time = 0;
            function update(dt) {
                time += dt * 60 / 1000;
                if (time >= options.delay) {
                    if (cards.length == 0) {
                        animator.removeRequest(update);
                        enableInteractions();

                        finishCallback?.();
                        return;
                    }

                    const card = cards[cards.length - 1];
                    column.translateCardsToColumnWithOffset([card], null, horzontalOffset, verticalOffset, options);
                    cards.splice(cards.length - 1, 1);

                    time = 0;
                }
            }

            animator.addRequest(update)
        }

        translate();
    }

    addCard = function (card) {
        if (this.cards.includes(card)) return;

        if (platform == Platform.TV) {
            if (this.cards.length == 0) {
                this.domElement.onclick = null
            }
        }

        this.cards.push(card);
        this.cardAddedEvent.invoke(card);

        card.joinToColumn(this);
        this.domElement.appendChild(card.domElement);
        this.recalculateFirstOpened();
        this.checkIfColumnHasCollectedCardsSet();

    }

    addCards = function (cards) {
        for (let i = 0; i < cards.length; i++) {
            const element = cards[i];
            this.addCard(element)
        }
    }

    removeCard = function (card) {
        if (this.cards.includes(card)) {

            this.cards.splice(this.cards.indexOf(card), 1);
            this.cardRemovedEvent.invoke(card);

            card.leaveFromColumn();
        }

        if (platform == Platform.TV) {
            if (this.cards.length == 0) {
                this.domElement.onclick = () => {
                    cardSelector.select(this, []);
                }
            }
        }
    }

    removeCards = function (cards) {
        for (let i = 0; i < cards.length; i++) {
            const element = cards[i];
            this.removeCard(element)
        }
    }

    checkIfLastCardClosedAndOpen = function () {
        if (this.cards.length == 0) return;

        const card = this.cards[this.cards.length - 1];
        if (card.side == CardSide.Back) {
            card.open();
        }
    }

    checkIfColumnHasCollectedCardsSet = function () {
        const result = selectedRules.isCardSetCollectable(this.cards);

        if (result.isTrue) {
            cardCollector.collect(result.cards, this);
        }
    }

    recalculateFirstOpened = function () {
        let firstSetup = false;

        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            if (!firstSetup && card.side == CardSide.Face) {

                firstSetup = true;
                card.domElement.classList.add('first');
                continue;
            }
            card.domElement.classList.remove('first');
        }
    }

    getOpenedCards = function () {
        if (this.cards == null || this.cards.length == 0) return null;

        const cards = [];

        for (let i = 0; i < this.cards.length; i++) {
            const element = this.cards[i];
            if (element.side == CardSide.Face) {
                cards.push(element);
            }
        }

        return cards.length > 0 ? cards : null;
    }

    getLastCard = function () {
        if (this.cards == null || this.cards.length == 0) return null;

        return this.cards[this.cards.length - 1];
    }

    getRange = function (from, count) {
        if (from < 0 || from > this.cards.length - 1 || count == 0) return null;
        const cards = [];

        for (let i = from; i < from + count; i++) {
            if (i > this.cards.length - 1) break;
            const element = this.cards[i];
            cards.push(element);
        }

        return cards;
    }

    getRangeFromEnd = function (count, includesClosed = true) {
        if (count == 0) return null;
        const cards = [];

        for (let i = this.cards.length - 1; i >= this.cards.length - count; i--) {
            if (i < 0) break;
            const element = this.cards[i];
            if (!includesClosed && element.side == CardSide.Back) continue;
            cards.push(element);
        }

        return cards;
    }
}

class SolitaireCardColumn extends CardColumn {
    constructor(domElement, number, overlapArray, isClosed) {
        super(domElement);

        this.number = number;
        this.overlapArray = overlapArray;
        this.isClosed = isClosed;
        this.topLevelColumns = [];

        this.cardAddedEvent.addListener(this.cardAdded);
    }

    makeColumnFree = function () {
        if (!this.domElement.classList.contains('removed')) {
            this.domElement.classList.add('removed');
        }
    }

    makeColumnFilled = function () {
        this.domElement.classList.remove('removed')
    }

    onCardDropped = (card) => {
        if (card.cardColumn == this) return;

        if (this.cards.length == 0) {
            this.makeColumnFree();
        }

    }

    cardAdded = (card) => {
        this.makeColumnFilled();

        card.dropFinishedEvent.removeListener(this.onCardDropped);
        card.dropFinishedEvent.addListenerToStart(this.onCardDropped);
    }


    addOverlapColumns = function (column) {
        this.topLevelColumns.push(column);

        const lastCard = column.getLastCard();

        lastCard.dropFinishedEvent.addListener((card) => {
            if (card.cardColumn == column) return;

            this.checkIfCanOpen();
            setTimeout(() => {
                lastCard.dropFinishedEvent.removeAllListeners();
            }, 50)
        });
    }

    checkIfCanOpen = function () {
        for (let i = 0; i < this.topLevelColumns.length; i++) {
            const element = this.topLevelColumns[i];
            if (element.getLastCard() != null) {
                return false;
            }
        }

        this.getLastCard()?.open();
        return true;
    }
}

export { CardColumn, SolitaireCardColumn }