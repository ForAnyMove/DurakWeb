import { State } from "./battleFlow.js";
import { boundsChecker } from "./cardBoundsChecker.js";
import { getSkinBackImage, getSkinImage } from "./data/card_skin_database.js";
import { DOChangeValue, Ease } from "./dotween/dotween.js";
import { Action, CanInteract, disableInteractions, enableInteractions } from "./globalEvents.js";
import { getGlobalScale, getRandomFloat, getRectData, lerp, setScaleBypassingTransition } from "./helpers.js";
import { battleground } from "./playgroundBattle.js";
import { CardSide, FullRanksStringList } from "./statics/enums.js";
import { Platform } from "./statics/staticValues.js";

const root = document.querySelector('.playground-tab') ?? document.body;

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

        this.locked = false;
        this.wrapper = null;
        this.subscribeDragAndDrop();
        this.subscribeFocus();
        this.dropFinishedEvent = new Action();

        this.isFocused = false;
        this.isUsedAsTrumpTransfare = false;
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
    }

    open = function () {
        if (this.side == CardSide.Face) return;
        const duration = 0.06;

        DOChangeValue(() => 1, (value) => {
            this.domElement.style.scale = `${value} 1`;
        }, 0, duration / 2, Ease.SineInOut).onComplete(() => {
            this.setOpened();
            DOChangeValue(() => 0, (value) => {
                this.domElement.style.scale = `${value} 1`;
            }, 1, duration / 2, Ease.SineInOut).onComplete(() => {
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

    subscribeFocus = function () {
        this.domElement.onmouseover = () => {
            this.focus();
        }

        this.domElement.onmouseout = () => {
            this.unfocus();
        }
    }

    focus = () => {
        if (!CanInteract || this.wrapper == null || !this.wrapper.canRemove || this.locked) return;

        if (!this.domElement.classList.contains('focused')) {
            this.domElement.classList.add('focused');
        }

        this.isFocused = true;
    }

    unfocus = () => {
        if (this.domElement.classList.contains('focused')) {
            this.domElement.classList.remove('focused');
        }

        this.isFocused = false;
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

        this.faceImage = getSkinImage(faceContent, this.suit, FullRanksStringList[this.rank - 2]);

        this.lastFaceContent = faceContent;
        if (this.side == CardSide.Face) {
            this.domElement.style.backgroundImage = this.faceImage;
        }
    }

    applyTVInput = () => {
    }

    applyDesktopInput = function () {

        const domElement = this.domElement;
        domElement.onmousedown = async (e) => {
            if (!CanInteract || this.side == CardSide.Back || this.locked) return;

            const card = this;

            const canRemove = this.wrapper.canRemove;
            if (!canRemove) return;

            const x = e.pageX;
            const y = e.pageY;

            const wrapperTemp = this.wrapper;
            const removeResult = await wrapperTemp.removeCard(card, false);

            const offsetX = x - removeResult.x;
            const offsetY = y - removeResult.y;
            const offset = { x: offsetX, y: offsetY };


            moveAt(e);

            function moveAt(e) {
                const x = e.pageX;
                const y = e.pageY;

                card.domElement.style.left = x - offset.x + 'px';
                card.domElement.style.top = y - offset.y + 'px';
            }

            document.onmousemove = (e) => {
                moveAt(e);
            }

            domElement.onmouseup = () => {
                document.onmousemove = null;
                domElement.onmouseup = null;

                this.tryDrop(wrapperTemp, card);
            }
        }
    }

    applyMobileInput = function () {
        const domElement = this.domElement;

        const handleDragStart = async (e) => {
            if (!CanInteract || this.side == CardSide.Back || this.locked) return;

            const card = this;

            const canRemove = this.wrapper.canRemove;
            if (!canRemove) return;

            const touch = e.targetTouches[0];

            const x = touch.clientX;
            const y = touch.clientY;

            const wrapperTemp = this.wrapper;
            const removeResult = await wrapperTemp.removeCard(card, false);

            const offsetX = x - removeResult.x;
            const offsetY = y - removeResult.y;
            const offset = { x: offsetX, y: offsetY };

            const handleDragMove = (e) => {
                const touch = e.targetTouches[0];

                const x = touch.clientX;
                const y = touch.clientY;

                card.domElement.style.left = x - offset.x + 'px';
                card.domElement.style.top = y - offset.y + 'px';

                e.preventDefault();
            }

            handleDragMove(e);

            const handleDrop = (e) => {
                this.tryDrop(wrapperTemp, card);

                domElement.removeEventListener('touchmove', handleDragMove);
                domElement.removeEventListener('touchend', handleDrop);
            }

            domElement.addEventListener('touchmove', handleDragMove);
            domElement.addEventListener('touchend', handleDrop);
        }

        domElement.addEventListener('touchstart', handleDragStart);
    }

    subscribeDragAndDrop = () => {
        // this.applyTVInput();
        // return;

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

    tryDrop = async function (previousColumn, card) {
        this.unfocus();

        const playerState = player.state;

        const insidePlayground = boundsChecker.isCardInPlayground(card)
        if (!insidePlayground) {
            previousColumn.translateCard(card);
            return;
        }

        switch (playerState) {
            case State.Attack:
                const zone = battleground.createZone();
                if (battleground.tryBeatZone(card, zone)) {
                    player.cardPrePlacedByUserEvent.invoke();
                    zone.wrapper.translateCard(card);
                    player.cardPlacedByUserEvent.invoke();
                    return;
                }
                break;
            case State.DefendCanTransfare:
            case State.Defend: {
                const overlapZone = boundsChecker.getBattleZoneByCard(card);
                if (overlapZone == null) {
                    if (playerState == State.DefendCanTransfare && battleground.canTransfare(card)) {
                        if (this.suit == trumpSuit && !this.isUsedAsTrumpTransfare) {
                            player.cardPrePlacedByUserEvent.invoke();
                            player.cardPlacedByUserEvent.invoke({ transfare: true, card: this });
                            this.isUsedAsTrumpTransfare = true;

                            return;
                        }

                        player.cardPrePlacedByUserEvent.invoke();
                        const zone = battleground.createZone();
                        zone.wrapper.translateCard(card);
                        player.cardPlacedByUserEvent.invoke({ transfare: true, card: null });
                        return;
                    }
                    previousColumn.translateCard(card);
                    return;
                } else if (battleground.tryBeatZone(card, overlapZone)) {
                    player.cardPrePlacedByUserEvent.invoke();
                    overlapZone.wrapper.translateCard(card, { durationMultiplier: 0.4 });
                    player.cardPlacedByUserEvent.invoke();
                    return;
                } else {
                    previousColumn.translateCard(card);
                }
                break;
            }
            case State.Toss:
                if (battleground.canToss(card)) {
                    player.cardPrePlacedByUserEvent.invoke();
                    const zone = battleground.createZone();
                    zone.wrapper.translateCard(card);
                    player.cardPlacedByUserEvent.invoke();
                } else {
                    previousColumn.translateCard(card);
                }
                break;

            default:
                break;
        }

        return;
    }

    joinToColumn = function (wrapper) {
        this.wrapper = wrapper;
        this.domElement.style.position = 'relative';
        this.domElement.style.left = 0;
        this.domElement.style.top = 0;
        this.domElement.style.zIndex = null;
    }

    leaveFromColumn = async function (defaultWay = true) {
        this.wrapper = null;

        async function getRotatedElementPosition(element) {
            const currentTransition = element.style.transition;
            const currentTransform = element.style.transform;

            element.style.transition = 'none';
            element.style.transform = '';

            const rect = element.getBoundingClientRect();
            const style = window.getComputedStyle(element);
            const scale = getGlobalScale(element);

            const width = parseFloat(style.width);
            const height = parseFloat(style.height);


            const point = { x: rect.left, y: rect.top };
            const origin = { x: point.x + width / 2, y: point.y + height };

            if (!isNaN(scale) && scale > 0) {
                let direction = { x: point.x - origin.x, y: point.y - origin.y };

                point.x = origin.x + direction.x / scale;
                point.y = origin.y + direction.y / scale;
            }

            element.style.transform = currentTransform;
            await new Promise(p => setTimeout(p, 0));

            element.style.transition = currentTransition;

            return point;

            // next: to get rotated top left position
            if (currentTransform == '') {
                return point;
            }

            const angle = parseFloat(currentTransform.match(/-?\d+(\.\d+)?/));
            console.log(angle);

            function rotate(origin, point, angle) {
                let radians = (Math.PI / 180) * angle;

                let cos = Math.cos(radians);
                let sin = Math.sin(radians);

                let nx = (cos * (point.x - origin.x)) + (sin * (point.y - origin.y)) + origin.x;
                let ny = (cos * (point.y - origin.y)) - (sin * (point.x - origin.x)) + origin.y;

                return { x: nx, y: ny };
            }

            const r = rotate(origin, point, -angle)
            return { x: r.x, y: r.y };
        }

        // const pos = await getRotatedElementPosition(this.domElement);
        this.domElement.style.margin = '';
        let pos = defaultWay ? { x: this.domElement.getBoundingClientRect().left, y: this.domElement.getBoundingClientRect().top } : await getRotatedElementPosition(this.domElement);
        this.domElement.style.position = 'absolute';

        this.domElement.style.left = `${pos.x}px`;
        this.domElement.style.top = `${pos.y}px`;
        this.domElement.style.zIndex = 2;

        root.appendChild(this.domElement);
        return pos;
    }
}

class CardsWrapper {
    constructor(domElement) {
        this.domElement = domElement;
        this.cards = [];
        this.canRemove = false;
        this.canPlace = false;

        this.cardAddedEvent = new Action();
        this.cardRemovedEvent = new Action();
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

    hasCards() {
        return !(this.cards == null || this.cards.length == 0);
    }

    addCard(card) {
        if (this.cards.includes(card)) return false;

        this.cards.push(card);
        card.joinToColumn(this)
        this.cardAddedEvent?.invoke(card);

        return true;
    }

    removeWithTransform(card) {
        if (this.removeCard(card)) {
            card.domElement.style.transformOrigin = ''

            const startPosition = { x: parseFloat(card.domElement.style.left), y: parseFloat(card.domElement.style.top) };
            card.domElement.style.left = `${startPosition.x}px`;
            card.domElement.style.top = `${startPosition.y}px`;
        }
    }

    async removeCard(card, defaultWay = true) {
        if (!this.hasCards()) return;

        if (this.cards.includes(card)) {
            card.domElement.style.margin = '';
            this.cards.splice(this.cards.indexOf(card), 1);
            // this.cardRemovedEvent.invoke(card);

            return await card.leaveFromColumn(defaultWay);
        }
    }

    removeLastCard() {
        if (!this.hasCards()) return;

        this.removeCard(this.cards[this.cards.length - 1]);
    }

    translateCard(card, options = null, callback = null) {
    }
}

class CardsDeck extends CardsWrapper {
    addCard(card) {
        if (super.addCard(card)) {
            this.domElement.appendChild(card.domElement);
        }
    }

    translateCard(card, options = { affectInteraction: false, openOnFinish: false, closeOnFinish: false, callCallbackOnce: false, durationMultiplier: 1 }, finishCallback = null) {
        const duration = 0.075 / globalGameSpeed;
        if (card.wrapper != null) {
            card.wrapper.removeCard(card);
        }

        const wrapperRect = this.domElement.getBoundingClientRect();
        let callbackInvoked = false;

        if (options?.affectInteraction) {
            disableInteractions();
        }

        card.domElement.style.transformOrigin = ''

        const startPosition = { x: parseFloat(card.domElement.style.left), y: parseFloat(card.domElement.style.top) };
        const targetPosition = { x: wrapperRect.left, y: wrapperRect.top };

        DOChangeValue(() => 0, (value) => {
            const t = value / 1;

            const x = lerp(startPosition.x, targetPosition.x, t);
            const y = lerp(startPosition.y, targetPosition.y, t);

            card.domElement.style.left = `${x}px`;
            card.domElement.style.top = `${y}px`;
        }, 1, duration * 2 * options.durationMultiplier, Ease.SineInOut).onComplete(() => {
            this.addCard(card);
            // card.domElement.style.scale = ''
            // card.domElement.style.zIndex = '';

            if (options?.openOnFinish) {
                card.open();
            }

            if (options?.closeOnFinish) {
                card.close();
            }
            if (options?.callCallbackOnce == null && !callbackInvoked || options?.callCallbackOnce == false || options?.callCallbackOnce == true && !callbackInvoked) {
                callbackInvoked = true;
                finishCallback?.();
            }

            if (options?.affectInteraction) {
                enableInteractions();
            }
        });
    }
}

class CardsPlayableDeck extends CardsWrapper {
    constructor(domElement, options = { angle: 35, offset: -2, animationOffset: -2, cardWidth: 6 }) {
        super(domElement);

        this.angle = options.angle;
        this.defaultOffset = options.offset;
        this.animationOffset = options.animationOffset;
        this.offset = options.offset;
        this.cardWidth = options.cardWidth;
        this.canRemove = true;

        this.emptyCard = `<div id="card_king_clubs_01" class="card-element empty"
        style="background-size: 100% 100%; background-image: none; position: relative; left: 0px; top: 0px; width: 0vw; min-width: 0vw; margin:0 0; box-shadow:none; transition: 'none">
        </div>`;
    }

    getCurrentMargin = (cardsLength) => {
        const overoverfilled = Math.max(0, cardsLength - 6);
        const offset = this.defaultOffset / 35;
        const max = this.defaultOffset - 0.6;
        this.offset = this.defaultOffset + overoverfilled * offset;
        if (this.offset > this.defaultOffset) {
            this.offset = theis.defaultOffset;
        } else if (this.offset < max) {
            this.offset = max;
        }
        return this.offset;
    }

    addCard(card) {
        if (super.addCard(card)) {
            const cards = this.domElement.querySelectorAll('.card-element');

            for (let i = 0; i < cards.length; i++) {
                const element = cards[i];
                if (element.classList.contains('empty')) continue;
                this.domElement.insertBefore(card.domElement, element);
                return;
            }

            this.domElement.appendChild(card.domElement);
        }
    }

    async removeCard(card, defaultWay = true) {
        const scale = getGlobalScale(card.domElement);

        const result = await super.removeCard(card, defaultWay);
        this.updateCardAngles();

        setScaleBypassingTransition(card.domElement, scale);


        return result;
    }

    async translateCard(card, options = { affectInteraction: false, openOnFinish: false, closeOnFinish: false, callCallbackOnce: false, durationMultiplier: 1 }, finishCallback = null) {
        const duration = 0.075 / globalGameSpeed;

        this.domElement.insertAdjacentHTML('afterbegin', this.emptyCard);
        let emptyElement = this.domElement.children[0];

        const translation = async () => {
            let callbackInvoked = false;

            if (card.wrapper != null) await card.wrapper.removeCard(card);
            // card.domElement.style.zIndex = -1;

            const style = window.getComputedStyle(card.domElement)

            if (options?.affectInteraction) {
                disableInteractions();
            }

            const startPosition = { x: parseFloat(card.domElement.style.left), y: parseFloat(card.domElement.style.top) };
            card.domElement.style.transformOrigin = ''

            const scale = getGlobalScale(emptyElement.parentElement);
            card.domElement.style.scale = scale;

            DOChangeValue(() => 0, (value) => {
                const emptyElementStyles = emptyElement.getBoundingClientRect();

                const el = parseFloat(emptyElementStyles.left);
                const et = parseFloat(emptyElementStyles.top);
                const ew = emptyElementStyles.width;
                const eh = emptyElementStyles.height;

                const ecx = el + (ew / 2);
                const ecy = et + (eh / 2);

                const cw = parseFloat(style.width);
                const ch = parseFloat(style.height);

                var cl = ecx - (cw / 2);
                var ct = ecy - (ch / 2);

                const targetPosition = { x: cl, y: ct };

                const t = value / 1;

                const x = lerp(startPosition.x, targetPosition.x, t);
                const y = lerp(startPosition.y, targetPosition.y, t);

                card.domElement.style.transform = emptyElement.style.transform;
                card.domElement.style.left = `${x}px`;
                card.domElement.style.top = `${y}px`;

                // card.domElement.style.scale = lerp(0.9, scale ?? 1, t)
            }, 1, duration * 2 * options.durationMultiplier, Ease.SineOut).onComplete(() => {
                this.addCard(card);
                emptyElement.remove();
                this.updateCardAngles();
                card.domElement.style.scale = ''
                card.domElement.style.zIndex = '';

                this.updateMargins(this.cards.length);

                if (options?.openOnFinish) {
                    card.open();
                }

                if (options?.closeOnFinish) {
                    card.close();
                }
                if (options?.callCallbackOnce == null && !callbackInvoked || options?.callCallbackOnce == false || options?.callCallbackOnce == true && !callbackInvoked) {
                    callbackInvoked = true;
                    finishCallback?.();
                }

                if (options?.affectInteraction) {
                    enableInteractions();
                }
            });
        }

        const etm = this.getCurrentMargin(this.cards.length + 1);
        console.log(`etm ${etm}`);
        DOChangeValue(() => 0, (newValue) => {
            emptyElement.style.width = (newValue) + 'vw';
            emptyElement.style.minWidth = (newValue) + 'vw';
            emptyElement.style.margin = `0 ${lerp(0, etm, newValue / this.cardWidth)}vw`;
        }, this.cardWidth, duration, Ease.SineInOut).onComplete(() => {
        });

        await translation();

        this.updateCardAngles();
    }

    updateMargins = (cardsCount) => {
        const duration = 0.075 / globalGameSpeed / 2;
        this.updateTween?.destroy();

        let margins = {};
        const element = this.cards[0].domElement;
        const elementStyleMargin = element.style.margin;
        if (elementStyleMargin == 'none' || elementStyleMargin == '' || elementStyleMargin == undefined) {
            const style = window.getComputedStyle(element);
            const margin = parseFloat(style.margin.substring(4, style.margin.length));
            margins = { current: margin / (window.innerWidth / 100), target: this.getCurrentMargin(cardsCount) }
        } else {
            margins = { current: parseFloat(elementStyleMargin.substring(4, elementStyleMargin.length)), target: this.getCurrentMargin(cardsCount) }
        }

        this.updateTween = DOChangeValue(() => 0, (newValue) => {
            const newMargin = `0 ${lerp(margins.current, margins.target, newValue)}vw`;
            for (let i = 0; i < this.cards.length; i++) {
                const element = this.cards[i].domElement;

                element.style.margin = newMargin;
            }
        }, 1, duration, Ease.SineInOut)
    }

    updateCardAngles() {
        const cards = this.domElement.querySelectorAll('.card-element');

        const maxRotateAngle = this.angle;
        let cardAngleStep2 = maxRotateAngle * 2 / (cards.length - 1)

        for (let i = 0; i < cards.length; i++) {
            const element = cards[i];

            element.style.transform = `rotate(${0 - maxRotateAngle + cardAngleStep2 * i}deg)`
            element.style.transformOrigin = 'center bottom'
        }
    }
}

class CardsPairWrapper extends CardsWrapper {
    constructor(domElement) {
        super(domElement);
    }

    addCard(card) {
        if (super.addCard(card)) {
            this.domElement.appendChild(card.domElement);

            card.lastTransition = window.getComputedStyle(card.domElement).transition;
            const transition = card.lastTransition + ', margin 0.2s ease'
            card.domElement.style.position = 'absolute';
            card.domElement.style.transition = transition;
            card.domElement.style.margin = `${getRandomFloat(2) - 1}vw ${getRandomFloat(2) - 1}vw`
            card.domElement.style.transform = `rotate(${(this.cards.length > 1 ? 15 : -15) + getRandomFloat(10) - 5}deg)`
        }
    }

    async removeCard(card, defaultWay = true) {
        const scale = getGlobalScale(card.domElement);

        const result = await super.removeCard(card, defaultWay);
        card.domElement.style.margin = '';
        card.domElement.style.transition = card.lastTransition;

        setScaleBypassingTransition(card.domElement, scale);

        return result;
    }

    async translateCard(card, options = { affectInteraction: false, openOnFinish: false, closeOnFinish: false, callCallbackOnce: false, durationMultiplier: 1 }, finishCallback = null) {
        const duration = 0.075 / globalGameSpeed;
        if (card.wrapper != null) {
            card.wrapper.removeCard(card);
        }

        const lastScale = this.domElement.style.scale;
        this.domElement.style.scale = 1;
        const wrapperRect = this.domElement.getBoundingClientRect();
        this.domElement.style.scale = lastScale;
        let callbackInvoked = false;

        if (options?.affectInteraction) {
            disableInteractions();
        }

        card.domElement.style.transformOrigin = ''

        const scale = getGlobalScale(this.domElement);

        const targetPosition = getRectData(this.domElement, true).position;
        const startPosition = { x: parseFloat(card.domElement.style.left), y: parseFloat(card.domElement.style.top) };

        setTimeout(() => { card.domElement.style.scale = scale; }, 0)

        DOChangeValue(() => 0, (value) => {
            const t = value / 1;

            const x = lerp(startPosition.x, targetPosition.x, t);
            const y = lerp(startPosition.y, targetPosition.y, t);

            card.domElement.style.left = `${x}px`;
            card.domElement.style.top = `${y}px`;
        }, 1, duration * 2 * options.durationMultiplier, Ease.SineInOut).onComplete(() => {
            card.domElement.style.scale = ''
            this.addCard(card);
            // card.domElement.style.scale = ''
            // card.domElement.style.zIndex = '';

            if (options?.openOnFinish) {
                card.open();
            }

            if (options?.closeOnFinish) {
                card.close();
            }
            if (options?.callCallbackOnce == null && !callbackInvoked || options?.callCallbackOnce == false || options?.callCallbackOnce == true && !callbackInvoked) {
                callbackInvoked = true;
                finishCallback?.();
            }

            if (options?.affectInteraction) {
                enableInteractions();
            }
        });
    }
}

export { CardsPlayableDeck, CardsPairWrapper, CardsDeck }