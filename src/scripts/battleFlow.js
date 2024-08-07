import { initialLocale, updateLanguage } from "../localization/translator.js";
import { animator } from "./animator.js";
import { CardsDeck } from "./cardModel.js";
import { DOChangeValue, Delay, Ease, SequencedDelay } from "./dotween/dotween.js";
import { Action, disableInteractions, enableInteractions } from "./globalEvents.js";
import { createElement, getRandomInt, lerp } from "./helpers.js";
import { createLevel } from "./levelCreator.js";
import { log } from "./logger.js";
import { battleground, canBeatCard } from "./playgroundBattle.js";
import { Platform } from "./statics/staticValues.js";

const GameMode = {
    DurakDefault: 'DurakDefault',
    DurakTransfare: 'DurakTransfare'
}

const EntityMode = {
    Self: 'Self',
    Pair: 'Pair'
}

const CardsCount = {
    36: 36,
    52: 52
}

class Rule {
    constructor() {
        this.isTutorial = false;
        this.gameMode = GameMode.DurakTransfare;
        this.entityMode = EntityMode.Self;
        this.cardsCount = CardsCount[36];
        this.numberOfPlayers = 2;
    }
}

const DefendResult = {
    Defence: 'Defence',
    DefenceNoCards: 'DefenceNoCards',
    Transfare: 'Transfare',
    Fail: 'Fail'
}

const TossResult = {
    Success: 'Success',
    SuccessNoCards: 'SuccessNoCards',
    Fail: 'Fail',
    Skip: 'Skip'
}

const MoveResult = {
    Success: 'Success',
    SuccessNoCards: 'SuccessNoCards',
}

const State = {
    None: 'None',
    Attack: 'Attack',
    Toss: 'Toss',
    Defend: 'Defend',
    DefendCanTransfare: 'DefendCanTransfare'
}

class Entity {
    constructor(wrapper) {
        this.wrapper = wrapper;

        this.onMoveFinished = new Action();
        this.onDefendFinished = new Action();
        this.state = State.None;
        this.isUser = false;
        this.id = '';

        this.stateText = null;

        this.mainDeck = null;
        this.startDeckCount = 36;
        this.discardPile = null;
    }

    setStateText = function (element) {
        this.stateText = element;
        this.stateText.innerText = '';
    }

    updateStateText = function (state) {
        switch (state) {
            case State.None:
                this.stateText.lang = '';
                this.stateText.innerText = '';
                break;
            case State.Attack:
                this.stateText.lang = 'Player/State/Attack';
                updateLanguage([this.stateText], initialLocale);
                break;
            case State.Toss:
                this.stateText.lang = 'Player/State/Attack';
                updateLanguage([this.stateText], initialLocale);
                break;
            case State.Defend:
                this.stateText.lang = 'Player/State/Defend';
                updateLanguage([this.stateText], initialLocale);
                break;
            default:
                this.stateText.lang = '';
                this.stateText.innerText = '';
                break;
        }
    }

    getMainDeckCards = () => {
        if (this.mainDeck == null) return null;
        const cardsData = [];

        for (let i = 0; i < this.mainDeck.cards.length; i++) {
            const card = this.mainDeck.cards[i];
            cardsData.push({
                rank: card.rank,
                suit: card.suit
            })
        }

        return cardsData;
    }

    getReleasedCards = () => {
        if (this.discardPile == null) return null;
        return discardPile.cards;
    }

    async move(defendEntity) {
        this.state = State.Attack;
        this.updateStateText(this.state);
    }

    isHaveCardsToToss() {
        const playgorundCards = battleground.getCards();
        for (let i = 0; i < playgorundCards.length; i++) {
            const playgorundCard = playgorundCards[i];
            for (let j = 0; j < this.wrapper.cards.length; j++) {
                const wrapperCard = this.wrapper.cards[j];
                if (playgorundCard.rank == wrapperCard.rank) return true;
            }
        }

        return false;
    }

    async toss(defendEntity, isCycled, onToss, checkCanToss) {
        if (!this.isHaveCardsToToss()) {
            await Delay(0.1 / globalGameSpeed);
            return false;
        }

        this.state = State.Toss;
        const canToss = checkCanToss?.();
        if (!canToss) {
            await Delay(0.1 / globalGameSpeed);
        }

        this.updateStateText(this.state);

        return canToss;
    }

    async defend(canTransfare, thisEntityDefend = true) {
        this.state = canTransfare ? State.DefendCanTransfare : State.Defend;
        this.updateStateText(State.Defend);
    }

    async grabPlaygroundCards() {
        this.updateStateText(State.None);

        const playgorundCards = battleground.getCards();

        await SequencedDelay(playgorundCards.length, 0.02 / globalGameSpeed, (i) => {
            if (!this.isUser) {
                playgorundCards[i].setClosed();
            }
            this.wrapper.translateCard(playgorundCards[i], { durationMultiplier: this.isUser ? 1 : 0.5 });
        })
        await Delay(0.1 / globalGameSpeed);
    }

    async transfareTrump(card) {
        await Delay(0);
        card.setOpened();
        card.wrapper?.removeWithTransform(card);

        card.domElement.style.transformOrigin = ''
        const startPosition = { x: parseFloat(card.domElement.style.left), y: parseFloat(card.domElement.style.top) };
        const targetPosition = { x: window.innerWidth / 2 - card.domElement.style.width / 2, y: window.innerHeight / 2 - card.domElement.style.height / 2 };
        card.domElement.style.scale = 2;
        card.domElement.style.transform = `rotate(0deg)`

        DOChangeValue(() => 0, (value) => {
            const t = value / 1;

            const x = lerp(startPosition.x, targetPosition.x, t);
            const y = lerp(startPosition.y, targetPosition.y, t);
            // const newAngle = lerp(angle, 0, t);

            card.domElement.style.left = `${x}px`;
            card.domElement.style.top = `${y}px`;
        }, 1, 0.1 / globalGameSpeed, Ease.SineOut);
        await Delay(0.3 / globalGameSpeed);
        this.wrapper.translateCard(card);

        await Delay(0.2 / globalGameSpeed);
        if (!this.isUser) {
            card.setClosed();
        }
    }
}

class AIDefenceData {
    constructor(zone, defendCard) {
        this.zone = zone;
        this.defendCard = defendCard;
        this.differencePower = this.calculateDifferencePower(zone.wrapper.cards[0], defendCard);
    }

    calculateDifferencePower(attackCard, defendCard) {
        var power = defendCard.rank - attackCard.rank;

        if (defendCard.suit === trumpSuit && attackCard.suit !== trumpSuit) {
            power += this.startDeckCount / 4;
        }

        return power;
    }
}

class Bot extends Entity {
    constructor(wrapper) {
        super(wrapper);

        this.lateGameRatio = 0.25;
        this.luck = 0.85;
        this.maxTossCount = 4;
    }

    lerp(a, b, t) {
        return a + t * (b - a);
    }

    inverseLerp(a, b, value) {
        return (value - a) / (b - a);
    }

    getCardRankPower(card) {
        var rank = card.rank;

        if (card.suit == trumpSuit)
            rank += this.startDeckCount / 4;

        return rank;
    }

    checkCanCardDefend(attackCard, defendCard) {
        if (defendCard.suit == trumpSuit && attackCard.suit != trumpSuit)
            return true;

        if (attackCard.suit != defendCard.suit)
            return false;

        if (attackCard.rank < defendCard.rank)
            return true;
        else
            return false;
    }

    sortCards(unsortedCards) {

        let sortedCards = unsortedCards.filter(card => card.suit !== trumpSuit).sort((a, b) => a.rank - b.rank);
        let sortedTrumpCards = unsortedCards.filter(card => card.suit === trumpSuit).sort((a, b) => a.rank - b.rank);

        return sortedCards.concat(sortedTrumpCards);
    }

    getBestAttackCard(attackCards, defendCards, minRankPower) {
        let nonDefendableCards = [];
        let defendableCardsPower = new Map();

        attackCards.forEach(attackCard => {
            if (this.getCardRankPower(attackCard) > minRankPower)
                return;

            var nonDefendable = true;

            defendCards.forEach(defendCard => {
                if (this.checkCanCardDefend(attackCard, defendCard)) {
                    nonDefendable = false;

                    var power = defendCard.rank - attackCard.rank;

                    if (defendCard.suit == trumpSuit && attackCard.suit != trumpSuit) {
                        power += this.startDeckCount / 4;
                    }

                    if (defendableCardsPower.has(attackCard)) {
                        if (power < defendableCardsPower.get(attackCard)) {
                            defendableCardsPower.delete(attackCard);
                            defendableCardsPower.set(attackCard, power);
                        }
                    }
                    else {
                        defendableCardsPower.set(attackCard, power);
                    }
                }
            });

            if (nonDefendable) {
                nonDefendableCards.push(attackCard);
            }
        });

        if (nonDefendableCards.length > 0) {
            return this.sortCards(nonDefendableCards)[0];
        }

        if (defendableCardsPower.size > 0) {
            var maxPowerCard = null;
            var max = 0;

            defendableCardsPower.forEach((card, power) => {
                if (card > max) {
                    max = card;
                    maxPowerCard = power;
                }
            });
            return maxPowerCard;
        }

        return this.getLowestAttackCard(attackCards);
    }

    getLowestAttackCard(attackCards) {
        let sortedCards = this.sortCards(attackCards);

        var attackCard = sortedCards[0]
        var maxCardRankRepeat = 0;

        for (let i = 0; i < sortedCards.length / 2; i++) {
            const card = sortedCards[i];
            var repeatCount = 0;

            if (card.suit == trumpSuit)
                continue;

            for (let j = 0; j < sortedCards.length; j++) {
                const checkCard = sortedCards[j];

                if (card == checkCard) {
                    continue;
                }

                if (card.rank == checkCard.rank && checkCard.suit != trumpSuit) {
                    repeatCount++;
                }
            }

            if (maxCardRankRepeat < repeatCount) {
                maxCardRankRepeat = repeatCount;
                attackCard = card;
            }
        }

        return attackCard;
    }

    // Функция move() вызывается 1 раз в начале хода заходящим.
    // для бота это может быть либо рандомная карта, либо если уровень по сложнее, мб выбор, основанный на картах в руке или другая логика
    async move(defendEntity) {
        await super.move(defendEntity);

        log(`[Move] by "Bot_${this.id}"`, 'battleFlow');

        if (this.wrapper.cards.length == 0) return MoveResult.SuccessNoCards;

        let myCards = [];

        for (let index = 0; index < this.wrapper.cards.length; index++) {
            const card = this.wrapper.cards[index];
            myCards.push(card);
        }

        let defenderCards = [];

        for (let index = 0; index < defendEntity.wrapper.cards.length; index++) {
            const card = defendEntity.wrapper.cards[index];
            defenderCards.push(card);
        }

        var selectedCard = this.getLowestAttackCard(myCards);

        if (this.mainDeck.cards.length <= this.startDeckCount * this.lateGameRatio) {
            const inverceLerp = this.inverseLerp(14, 2, defenderCards.length);
            const minRank = 6;
            const maxRank = 15 + (this.startDeckCount / 4);
            const minRankPower = this.lerp(minRank, maxRank, inverceLerp);

            const rand = Math.random();

            log('RANDOM ' + this.luck * inverceLerp + " - " + rand);

            if (this.luck * inverceLerp >= rand) {

                selectedCard = this.getBestAttackCard(myCards, defenderCards, Math.round(minRankPower));
            }
        }

        /*
        if(this.mainDeck.cards.length > this.startDeckCount * this.lateGameRatio){
            // Lowest Card Attack

            selectedCard = this.getLowestAttackCard(myCards);
        }
        else{
            // Best Card Attack

            const inverceLerp = this.inverseLerp(12, 4, defenderCards.length);
            const minRank = 9;
            const maxRank = 15 + (this.startDeckCount / 4);
            const minRankPower = this.lerp(minRank, maxRank, inverceLerp);

            if(this.luck * inverceLerp >= Math.random())
                selectedCard = this.getBestAttackCard(myCards, defenderCards, Math.round(minRankPower));
            else
                selectedCard = this.getLowestAttackCard(myCards);
        }
        */

        selectedCard.setOpened();

        // selectedCard - карта для хода
        // this.wrapper.cards - карты в руке
        // карты на столе в данном случае не нужны, т.к. это первый ход. Если нужно будет брать карты у других игроков/ботов, для чит режима, напиши, я реализую


        //const selectedCard = this.wrapper.cards[getRandomInt(this.wrapper.cards.length - 1)];
        //selectedCard.setOpened();


        // когда ходим, подкидываем или любая ситуация, когда действие добавляет карту на стол, создаем zone
        // zone - это обертка для двух карт, первыя - которой походили, вторая - которой отбились
        // zone.wrapper.translateCard(selectedCard); - функция переноса карты с зону.
        // для принятия решение для бота это не нужно
        const zone = battleground.createZone();
        zone.wrapper.translateCard(selectedCard);

        await Delay(0.16 / globalGameSpeed);
        this.updateStateText(State.None);
        return this.wrapper.cards.length == 0 ? MoveResult.SuccessNoCards : MoveResult.Success;
    }

    async moveSelected(cardRank, cardSuit) {
        await super.move();

        log(`[Move] by "Bot_${this.id}"`, 'battleFlow');

        if (this.wrapper.cards.length == 0) return MoveResult.SuccessNoCards;

        // write decisions
        let selectedCard = null;

        for (let i = 0; i < this.wrapper.cards.length; i++) {
            const card = this.wrapper.cards[i];
            if (card.rank == cardRank && card.suit == cardSuit) {
                selectedCard = card;
                break
            }
        }
        if (selectedCard == null) {
            return MoveResult.Fail;
        }

        selectedCard.setOpened();

        const zone = battleground.createZone();
        zone.wrapper.translateCard(selectedCard);

        await Delay(0.16 / globalGameSpeed);
        this.updateStateText(State.None);
        return this.wrapper.cards.length == 0 ? MoveResult.SuccessNoCards : MoveResult.Success;
    }

    // Функция toss() вызывается в ситуациях, нужно подкидывать карты отбивающему.
    // для бота это может быть либо рандомная карта, либо если уровень по сложнее, мб выбор, основанный на картах в руке или другая логика
    async toss(defendEntity, isCycled, onToss, checkCanToss) {
        const canToss = await super.toss(defendEntity, isCycled, onToss, checkCanToss);

        log(`[Toss] "Bot_${this.id}"`, 'battleFlow');

        if (!canToss) {
            log(`    - FALSE`, 'battleFlow');

            this.updateStateText(State.None);
            return TossResult.Fail;
        }

        const suitableCards = [];
        for (let i = 0; i < this.wrapper.cards.length; i++) {
            const card = this.wrapper.cards[i];
            if (battleground.canToss(card)) {
                suitableCards.push(card);
            }
        }

        /*
        if (suitableCards.length == 0) {
            log(`    - FALSE ${suitableCards}`, 'battleFlow');
            this.updateStateText(State.None);

            return TossResult.Fail;
        }
        */

        const zones = battleground.zones;

        let tossCards = [];

        for (let i = 0; i < suitableCards.length; i++) {
            const card = suitableCards[i];

            if (card.suit == trumpSuit && this.mainDeck.cards.length != 0)
                continue;

            if ((zones.length + tossCards.length) > this.maxTossCount)
                continue;

            tossCards.push(card);
        }

        if (tossCards.length == 0) {
            this.updateStateText(State.None);
            return TossResult.Fail;
        }

        // suitableCards - выбранные карты, который будут подкинуты, на данный момент берутся все подходящие

        // [Выноска 1]
        // Для получения карт на столе, для более сложных решений, можно сделать так: 
        // Все играбельные зоны на столе:

        // Карты в этой зоне, их можно быть 2. 
        // zoneCards[0] - карта, которой походили или подкинули
        // zoneCards[1] - карта, которой отбились. 
        // Если zoneCards.length == 1, то карту еще не побили, и на основе карты zoneCards[0] можно принимать решения, это полезно для защиты
        const index = 0;
        const zoneCards = zones[index].cards;
        // Если нужно будет брать карты у других игроков/ботов, для чит режима, напиши, я реализую

        const cycles = isCycled ? tossCards.length : 1;

        for (let i = 0; i < cycles; i++) {
            const card = tossCards[i];

            card.setOpened();
            const zone = battleground.createZone();
            zone.wrapper.translateCard(card);

            onToss?.();
            await Delay(0.2 / globalGameSpeed);

            log(`    - TRUE ${isCycled} ${cycles}`, 'battleFlow');
            if (!checkCanToss?.()) break;
        }

        this.updateStateText(State.None);
        if (cycles == 0) await Delay(0.2 / globalGameSpeed);
        return this.wrapper.cards.length > 0 ? TossResult.Success : TossResult.SuccessNoCards;
    }

    getAllDefenceVariants() {
        let targetCards = [];
        let zones = [];
        let defendCards = [];

        const playgorundZones = battleground.zones;

        for (let i = 0; i < playgorundZones.length; i++) {
            const zone = playgorundZones[i];
            if (zone.cards.length == 1) {
                zones.push(zone);
            }
        }

        for (let i = 0; i < this.wrapper.cards.length; i++) {
            const card = this.wrapper.cards[i];
            defendCards.push(card);
        }

        zones.forEach(zone => {
            const attackCard = zone.cards[0];
            defendCards.forEach(defendCard => {
                if (this.checkCanCardDefend(attackCard, defendCard)) {
                    const defenceData = new AIDefenceData(zone, defendCard);
                    targetCards.push(defenceData);
                }
            });
        });

        return targetCards;
    }

    checkAllZonesDefended() {
        const playgorundZones = battleground.zones;

        for (let i = 0; i < playgorundZones.length; i++) {
            const zone = playgorundZones[i];
            if (zone.cards.length == 1) {
                return false;
            }
        }

        return true;
    }

    // Функция defend() вызывается в ситуациях, когда нужно отбиваться.
    // для бота это может быть либо рандомная подходящая карта, либо если уровень по сложнее, мб выбор, основанный на картах в руке или картах на столе, прочее.
    async defend(canTransfare) {
        await super.defend(canTransfare);

        log(`[Defend] Try "Bot_${this.id}"`, 'battleFlow');

        if (this.wrapper.cards.length == 0) return;

        // canTransfare - показывает, что в данном случае можно сделать перевод 
        if (canTransfare) {

            // transfareCard - выбранная карта, которой осуществится перевод
            // this.getTransfareCard() - фукнция выбора подходящей карты. Пока реализован простой выбор первой подходящей карты.
            // для принятия решения на основе карт стола смотри в поиске: [Выноска 1]
            const transfareCard = this.getTransfareCard();

            if (transfareCard != null) {
                await Delay(0.1 / globalGameSpeed);
                if (transfareCard.suit == trumpSuit && !transfareCard.isUsedAsTrumpTransfare) {
                    transfareCard.isUsedAsTrumpTransfare = true;
                    this.transfareTrump(transfareCard);
                } else {
                    transfareCard.setOpened();

                    const zone = battleground.createZone();
                    zone.wrapper.translateCard(transfareCard);
                }
                await Delay(0.2 / globalGameSpeed);

                this.state = State.None;
                this.updateStateText(this.state);
                return DefendResult.Transfare;
            }
        }

        const tryDefend = async () => {

            if (this.checkAllZonesDefended())
                return DefendResult.Defence;

            let targetCards = this.getAllDefenceVariants();

            if (targetCards.length == 0) {
                return DefendResult.Fail;
            }

            const bestDefendData = targetCards.sort((a, b) => a.differencePower - b.differencePower)[0];
            const minDifferencePower = 16;

            if (bestDefendData.differencePower >= minDifferencePower && this.mainDeck.length > this.startDeckCount * this.lateGameRatio) {
                return DefendResult.Fail;
            }

            const zone = bestDefendData.zone;
            const cardToAttack = bestDefendData.defendCard;

            cardToAttack.setOpened();
            zone.wrapper.translateCard(cardToAttack);

            await Delay(0.2 / globalGameSpeed);
            return await tryDefend();

            /*
            const playgorundZones = battleground.zones;

            for (let i = 0; i < playgorundZones.length; i++) {
                const zone = playgorundZones[i];
                if (zone.cards.length == 1) {
                    const card = zone.cards[0];

                    // cardToAttack - выбранная карта, которой осуществится защита
                    // this.getSuitableCard(card) - выбор подходящей карты. Пока выбор сделан рандомно из подходящих с приоритетом на некозырные карты.
                    // логику выбора можно делать в методе getSuitableCard
                    // для принятия решения на основе карт стола смотри в поиске: [Выноска 1]
                    const cardToAttack = this.getSuitableCard(card);
                    if (cardToAttack == null) {
                        continue;
                    } else {
                        cardToAttack.setOpened();
                        zone.wrapper.translateCard(cardToAttack);

                        await Delay(0.2 / globalGameSpeed);
                        return await tryDefend();
                    }
                }
            } for (let i = 0; i < playgorundZones.length; i++) {
                const zone = playgorundZones[i];
                if (zone.cards.length == 1) {
                    return DefendResult.Fail
                }
            }

            return DefendResult.Defence;
            */
        }

        let result = await tryDefend();
        await Delay(0.1 / globalGameSpeed);
        // this.updateStateText(State.None);

        if (result == DefendResult.Defence) {
            if (this.wrapper.cards.length == 0) result = DefendResult.DefenceNoCards;
            log(`    - TRUE`, 'battleFlow');
        } else {
            log(`    - FALSE`, 'battleFlow');
        }
        return result;
    }

    getTransfareCard() {
        for (let i = 0; i < this.wrapper.cards.length; i++) {
            const card = this.wrapper.cards[i];
            // battleground.canTransfare(card) - автоматически проверяет подходит ли карта для перевода.
            if (battleground.canTransfare(card)) return card;
        }

        return null;
    }

    getSuitableCard(compareTo) {
        if (this.wrapper.cards.length == 0) return null;

        const suitableDefaultCards = [];
        const suitableTrumpCards = [];
        for (let i = 0; i < this.wrapper.cards.length; i++) {
            const card = this.wrapper.cards[i];
            if (canBeatCard(card, compareTo)) {
                if (card.suit == trumpSuit) {
                    suitableTrumpCards.push(card);
                } else {
                    suitableDefaultCards.push(card);
                }
            }
        }

        if (suitableDefaultCards.length > 0) return suitableDefaultCards[getRandomInt(suitableDefaultCards.length - 1)];
        if (suitableTrumpCards.length > 0) return suitableTrumpCards[getRandomInt(suitableTrumpCards.length - 1)];
        return null;
    }

    async grabPlaygroundCards() {
        log(`[Grab] "Bot_${this.id}"`, 'battleFlow');

        await super.grabPlaygroundCards();
    }
}

class Player extends Entity {
    constructor(wrapper) {
        super(wrapper);

        this.cardPlacedByUserEvent = new Action();
        this.cardPrePlacedByUserEvent = new Action();
        this.isUser = true;
    }

    async move(defendEntity) {
        await super.move(defendEntity);
        log('[Move] by "Player"', 'battleFlow');

        if (platform == Platform.TV) {
            this.updateSelectables(async (selected, elements) => {
                player.cardPrePlacedByUserEvent.invoke();
                input.deselect();
                input.updateQueryCustom([], null);
                const selectedCard = selected.card;

                const zone = battleground.createZone();
                zone.wrapper.translateCard(selectedCard);
                player.cardPlacedByUserEvent.invoke();

                elements.forEach(item => item.element.onclick = null);
            });
        }

        await new Promise((p) => {
            enableInteractions();

            const userMoved = async () => {
                disableInteractions();

                this.cardPlacedByUserEvent.removeListener(userMoved);
                log('[Move Done] by "Player", waiting', 'battleFlow');
                this.updateStateText(State.None);

                await Delay(0.22 / globalGameSpeed);
                p();

            }

            this.cardPlacedByUserEvent.addListener(userMoved);
        })

        this.clearSelectables();
        return this.wrapper.cards.length == 0 ? MoveResult.SuccessNoCards : MoveResult.Success;
    }

    async defend(canTransfare, thisEntityDefend = true) {
        this.cardPlacedByUserEvent.removeAllListeners();
        this.cardPrePlacedByUserEvent.removeAllListeners();

        await super.defend(canTransfare, thisEntityDefend);

        log('[Defend] by "Player"', 'battleFlow');

        const checkIfAllCardsDefended = () => {
            const zones = battleground.zones;
            for (let i = 0; i < zones.length; i++) {
                const zone = zones[i];
                if (zone.cards.length == 1) {
                    return false;
                }
            }

            return true;
        }

        if (checkIfAllCardsDefended()) {
            await Delay(0.1 / globalGameSpeed);
            // this.updateStateText(State.None);

            if (this.wrapper.cards.length == 0) return DefendResult.DefenceNoCards;

            return DefendResult.Defence;
        }

        const passButton = document.getElementsByClassName('pass-btn')[0];
        const passButtonText = document.getElementsByClassName('pass-btn-title')[0];
        passButton.style.display = 'flex';

        passButtonText.lang = thisEntityDefend ? 'Buttons/TakeAll' : 'Buttons/Pass';
        languageChangeEvent?.invoke(initialLocale);

        enableInteractions();

        let result = DefendResult.Fail;

        if (platform == Platform.TV) {
            this.updateSelectables(async (selected, elements) => {
                const selectedCard = selected.card;

                const zones = battleground.zones;

                const moveZone = (zone) => {
                    if (battleground.tryBeatZone(selectedCard, zone)) {
                        this.cardPrePlacedByUserEvent.invoke();
                        zone.wrapper.translateCard(selectedCard);
                        this.cardPlacedByUserEvent.invoke();

                        zones.forEach((item) => { item.wrapper.domElement.onclick = null });
                        elements.forEach((item) => { item.element.onclick = null });

                        input.deselect();
                        input.updateQueryCustom([], null);

                        selected.onUp = selected.customData.upFunctionBackup;
                        return true;
                    }
                    return false;
                }

                const transfare = () => {
                    if (selectedCard.suit == trumpSuit && !selectedCard.isUsedAsTrumpTransfare) {
                        this.cardPrePlacedByUserEvent.invoke();
                        this.cardPlacedByUserEvent.invoke({ transfare: true, card: selectedCard });
                        selectedCard.isUsedAsTrumpTransfare = true;

                        return;
                    }

                    this.cardPrePlacedByUserEvent.invoke();
                    const zone = battleground.createZone();
                    zone.wrapper.translateCard(selectedCard);
                    this.cardPlacedByUserEvent.invoke({ transfare: true, card: null });
                    return;
                }

                if (zones.length == 1 && (this.state != State.DefendCanTransfare || !battleground.canTransfare(selectedCard))) {
                    moveZone(zones[0]);
                    return;
                } else if (zones.length > 1 && (this.state != State.DefendCanTransfare || !battleground.canTransfare(selectedCard))) {
                    let variants = 0;
                    for (let i = 0; i < zones.length; i++) {
                        const zone = zones[i];
                        if (battleground.tryBeatZone(selectedCard, zone)) variants++;
                    }
                    if (variants == 0) return;

                    if (variants == 1) {
                        for (let i = 0; i < zones.length; i++) {
                            const zone = zones[i];
                            if (moveZone(zone)) break;
                        }

                        return;
                    }
                }

                const selectables = [];
                selectables.push(selected);

                for (let i = 0; i < zones.length; i++) {
                    const zone = zones[i];
                    if (!battleground.tryBeatZone(selectedCard, zone)) continue;
                    selectables.push({
                        element: zone.wrapper.domElement,
                    });

                    zone.wrapper.domElement.onclick = () => {
                        moveZone(zone);
                    }
                }
                if (this.state == State.DefendCanTransfare && battleground.canTransfare(selectedCard)) {
                    if (selectables.length > 1) {
                        selectables.push({
                            element: battleground.playgroundZone.querySelector('.card-transfare-hint-static'),
                            onSubmit: () => {
                                transfare();
                            }
                        });
                    } else {
                        transfare();
                    }
                }

                // input.deselect();
                input.updateQueryCustom(selectables, selectables[1]);

                selected.onUp = null;

                selected.element.onclick = () => {
                    selected.element.onclick = selected.customData.submitFunctionBackup;
                    selected.onUp = selected.customData.upFunctionBackup;

                    input.updateQueryCustom(elements, selected);
                }
            }, { element: passButton });
        }

        let transfareView;
        await new Promise((p) => {
            if (canTransfare) {
                transfareView = createElement('div', ['playground-pare-element', 'card-transfare-hint-static'], null, battleground.playgroundZone);
            }

            passButton.onclick = async () => {
                transfareView?.remove();
                result = DefendResult.Fail;
                p();
            }

            const userPreMoved = () => {
                transfareView?.remove();
            }

            const userMoved = async (moveResult) => {
                passButton.style.display = 'none';
                disableInteractions();

                if (moveResult == null || moveResult.card == null) await Delay(0.2 / globalGameSpeed);

                if (moveResult != null && moveResult.transfare) {
                    result = DefendResult.Transfare;
                    if (moveResult.card != null) {
                        await this.transfareTrump(moveResult.card);
                    }

                    await Delay(0.1 / globalGameSpeed);
                    p();
                } else {
                    if (checkIfAllCardsDefended()) {
                        result = DefendResult.Defence;
                        if (this.wrapper.cards.length == 0) result = DefendResult.DefenceNoCards;
                        await Delay(0.1 / globalGameSpeed);
                        p();
                    } else {
                        await Delay(0.1 / globalGameSpeed);

                        passButton.style.display = 'flex';
                        result = await this.defend(false);
                        p();
                    }
                }

            }

            this.cardPlacedByUserEvent.addListener(userMoved);
            this.cardPrePlacedByUserEvent.addListener(userPreMoved);
        })

        // this.updateStateText(State.None);
        this.cardPlacedByUserEvent.removeAllListeners();
        this.cardPrePlacedByUserEvent.removeAllListeners();
        passButton.style.display = 'none';
        this.clearSelectables();
        return result;
    }

    async toss(defendEntity, isCycled, onToss, checkCanToss, previousResult, tossCount) {
        if (tossCount == null) {
            tossCount = 0;
        }

        const canToss = await super.toss(defendEntity, isCycled, onToss, checkCanToss);

        if (!canToss) {
            this.updateStateText(State.None);
            return tossCount > 0 ? TossResult.Success : TossResult.Fail;
        }

        log('[Toss] by "Player"', 'battleFlow');

        const passButton = document.getElementsByClassName('pass-btn')[0];
        const passButtonText = document.getElementsByClassName('pass-btn-title')[0];
        passButton.style.display = 'flex';

        passButtonText.lang = 'Buttons/Pass';
        languageChangeEvent?.invoke(initialLocale);

        let result = previousResult ?? TossResult.Fail;

        if (platform == Platform.TV) {
            this.updateSelectables(async (selected, elements) => {
                const selectedCard = selected.card;
                if (battleground.canToss(selectedCard)) {
                    input.deselect();
                    input.updateQueryCustom([], null);

                    const zone = battleground.createZone();
                    zone.wrapper.translateCard(selectedCard);
                    player.cardPlacedByUserEvent.invoke();

                    elements.forEach(item => item.element.onclick = null);
                }
            }, { element: passButton });
        }

        await new Promise((p) => {
            enableInteractions();

            passButton.onclick = async () => {
                audioManager.playSound();
                result = tossCount > 0 ? TossResult.Skip : TossResult.Fail;
                // await Delay(0.1 / globalGameSpeed);
                p();
            }

            const userMoved = async () => {
                tossCount++;
                onToss?.();
                passButton.style.display = 'none';
                disableInteractions();

                await Delay(0.18 / globalGameSpeed);
                result = this.wrapper.cards.length == 0 ? TossResult.SuccessNoCards : TossResult.Success;

                p();
            }

            this.cardPlacedByUserEvent.addListener(userMoved);
        })

        this.cardPlacedByUserEvent.removeAllListeners();

        passButton.style.display = 'none';

        if (result == TossResult.SuccessNoCards) {
            await Delay(0.2 / globalGameSpeed);
            return result;
        }

        if (result != TossResult.Fail && result != TossResult.Skip && isCycled && checkCanToss?.()) {
            return await this.toss(defendEntity, isCycled, onToss, checkCanToss, result, tossCount);
        }

        this.updateStateText(State.None);
        await Delay(0.2 / globalGameSpeed);
        if (result == TossResult.Skip) {
            result = TossResult.Success;
        }

        this.clearSelectables();
        return result;
    }

    async grabPlaygroundCards() {
        await super.grabPlaygroundCards();

        log('[Grab] by "Player"', 'battleFlow');
    }

    updateSelectables = (onSubmit, button) => {
        let currentSelected = 0;

        const elements = [];
        for (let i = 0; i < this.wrapper.cards.length; i++) {
            const card = this.wrapper.cards[i];
            if (!card.locked) {
                const selectable = {
                    card: card,
                    element: card.domElement,
                    customData: {
                        upFunctionBackup: () => {
                            input.selectFromPull(button);

                            return { preventDefault: true };
                        },
                        submitFunctionBackup: () => {
                            onSubmit(selectable, elements);
                        }
                    },
                    onSelect: () => {
                        selectable.card.focus();
                    },
                    onDeselect: () => {
                        selectable.card.unfocus();
                    },
                    onRight: () => {
                        currentSelected = Math.min(Math.max((currentSelected + 1), 0), elements.length - (button != null ? 2 : 1));
                        const next = elements[currentSelected];

                        input.selectFromPull(next);

                        return { preventDefault: true };
                    },
                    onLeft: () => {
                        currentSelected = Math.min(Math.max((currentSelected - 1), 0), elements.length - (button != null ? 2 : 1));
                        const next = elements[currentSelected];

                        input.selectFromPull(next);

                        return { preventDefault: true };
                    },
                    onUp: () => {
                        input.selectFromPull(button);

                        return { preventDefault: true };
                    }
                };

                elements.push(selectable);
            }
        }

        elements.forEach((item) => {
            item.element.onclick = () =>
                onSubmit(item, elements)
        })
        elements.reverse();

        if (button != null) {
            button.onDown = () => {
                input.selectFromPull(elements[currentSelected]);
                return { preventDefault: true };
            }
            button.onLeft = () => {
                return { preventDefault: true };
            }
            button.onRight = () => {
                return { preventDefault: true };
            }
            button.onUp = () => {
                return { preventDefault: true };
            }

            elements.push(button);
        }

        input.saveSelectableState('tv-gameplay', elements, () => {
            return elements[currentSelected];
        })

        setTimeout(() => {
            if (input.selected == null)
                input.updateQueryCustom(elements, elements[currentSelected]);
        }, 0)
    }

    clearSelectables = () => {
        input.updateQueryCustom([], null);
        input.deselect();
        input.clearSavedState('tv-gameplay');
    }
}

class BattleFlow {
    constructor(entities, rules) {
        this.entities = entities;
        this.staticEntities = [].concat(entities);

        this.result = createLevel(rules.cardsCount);
        this.mainDeck = this.result.mainCardColumn;
        this.playEntityOrder = 0;
        this.begin();

        this.cardRreleaseWrapper = new CardsDeck(document.getElementById('card-release-wrapper'));

        this.winners = [];
        this.rules = rules;
        this.finishCallback = new Action();

        for (let i = 0; i < this.entities.length; i++) {
            const entity = this.entities[i];
            entity.mainDeck = this.mainDeck;
            entity.startDeckCountb = this.mainDeck.cards.length;
        }

        this.discardPile = { cards: [] };

        for (let i = 0; i < this.entities.length; i++) {
            const entity = this.entities[i];
            entity.discardPile = this.discardPile;
        }

        // setTimeout(() => {
        //     this.winners.push(this.entities[1]);
        //     this.entities = [this.entities[0]]
        //     this.finish();
        // }, 1000);
    }

    async distributeCards(entities) {
        let distributionCount = 0
        const distributionDelay = 0.02
        const distributions = [];

        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            const cardsCount = entity.wrapper.cards.length;

            const requiredCardsCount = Math.max((6 - cardsCount), 0);
            if (requiredCardsCount > 0) {
                distributionCount += requiredCardsCount;
                distributions.push({
                    index: i,
                    count: requiredCardsCount,
                    placed: 0
                })
            }
        }

        let currentDistribution = 0;
        distributionCount = Math.min(distributionCount, this.mainDeck.cards.length);

        log('Try distribute')
        await SequencedDelay(distributionCount, distributionDelay / globalGameSpeed, (i) => {
            log('upd distribute')
            let distribution = distributions[currentDistribution];
            if (distribution.placed == distribution.count) {
                currentDistribution++;
                if (currentDistribution > distributions.length - 1) return;

                distribution = distributions[currentDistribution];
            }

            const entity = entities[distribution.index];
            const card = this.mainDeck.cards[this.mainDeck.cards.length - 1];

            if (this.mainDeck.cards.length == 1) {
                const copy = card.domElement.cloneNode(true);
                copy.style.transition = 'none';
                copy.style.transform = '';
                copy.style.opacity = 0.5;
                this.mainDeck.domElement.appendChild(copy);
            }

            if (entity.isUser) {
                card.setOpened();
            } else {
                card.setClosed();
            }

            distribution.placed++;
            entity.wrapper.translateCard(card);
        })

        await Delay(0.2 / globalGameSpeed);
    }

    getFirstStepEntity() {
        let leastCardRank = 999;
        let entity = null;

        for (let i = 0; i < this.entities.length; i++) {
            const entityCards = this.entities[i].wrapper.cards;

            for (let j = 0; j < entityCards.length; j++) {
                const card = entityCards[j];
                if (card.suit == trumpSuit && card.rank < leastCardRank) {
                    entity = this.entities[i];
                    leastCardRank = card.rank;
                }
            }
        }

        return entity;
    }

    begin = async function () {
        await this.distributeCards(this.entities);

        const firstStepEntity = this.getFirstStepEntity();
        this.playEntityOrder = firstStepEntity != null ? this.entities.indexOf(firstStepEntity) : 0;

        this.nextStep(1);
    }

    async cardRelease() {
        const cards = battleground.getCards();

        await SequencedDelay(cards.length, 0.02 / globalGameSpeed, (i) => {
            this.cardRreleaseWrapper.translateCard(cards[i]);
        })

        await Delay(0.2 / globalGameSpeed);

        for (let i = 0; i < cards.length; i++) {
            const element = cards[i];

            this.discardPile.cards.push({
                rank: element.rank,
                suit: element.suit
            })

            element.domElement.remove();
            cards[i] = null;
        }
        await battleground.clearZones();
    }

    finish() {

        this.finishCallback.invoke({ winners: this.winners, loser: this.entities.length == 0 ? null : this.entities[0] })
    }

    playerFinish() {
        this.finishCallback.invoke({ winners: this.winners, loser: this.entities.length == 0 ? null : this.entities[this.entities.length - 1] })
    }

    clearCycle() {
        for (let i = 0; i < this.entities.length; i++) {
            const entity = this.entities[i];
            for (let j = 0; j < entity.wrapper.cards.length; j++) {
                const card = entity.wrapper.cards[j];
                card.isUsedAsTrumpTransfare = false;
            }
        }
    }

    nextStep = async (step) => {
        this.clearCycle();

        if (this.entities.length == 1) {
            this.finish();
            return;
        }

        if (this.rules.entityMode == EntityMode.Self ? this.winners.some(i => i.id == 'player') : (this.winners.some(i => i.id == 'player') && this.winners.some(i => i.id == 'playerSupport'))) {
            this.playerFinish();
            return;
        }

        let attackEntities = [];
        let defendEntities = [];

        const nextCycled = function (current, max) {
            return (current + 1) % max;
        }

        const updatePlaygroundEntityState = () => {
            attackEntities = [];
            defendEntities = [];

            const cycled = (index, max) => {
                return index % (max == null ? this.entities.length : max);
            }

            switch (this.rules.entityMode) {
                case EntityMode.Pair: {
                    for (let i = 0; i < this.entities.length; i++) {
                        const index = cycled(this.playEntityOrder + i);
                        const entity = this.entities[index];
                        entity.updateStateText(State.None);

                        if (entity.wrapper.cards.length > 0) {
                            if (index == cycled(this.playEntityOrder + 1) || index == cycled(this.playEntityOrder + 3)) {
                                defendEntities.push(entity);
                                continue;
                            } else {
                                attackEntities.push(entity);
                            }
                        }
                    }
                    break;
                }
                case EntityMode.Self:
                default: {

                    const noEmptyEntities = [];
                    for (let i = 0; i < this.entities.length; i++) {
                        const entity = this.entities[i];
                        if (entity.wrapper.cards.length == 0) continue;

                        noEmptyEntities.push(entity);
                    }
                    for (let i = 0; i < noEmptyEntities.length; i++) {
                        const index = cycled(this.playEntityOrder + i, noEmptyEntities.length);
                        const entity = noEmptyEntities[index];
                        entity.updateStateText(State.None);

                        if (entity.wrapper.cards.length == 0) {
                            continue;
                        }

                        if (index == cycled(this.playEntityOrder + 1, noEmptyEntities.length)) {
                            defendEntities.push(entity);
                            continue;
                        } else {
                            attackEntities.push(entity);
                        }
                    }
                    break;
                }
            }
        }

        updatePlaygroundEntityState();

        if (attackEntities.length == 0 || defendEntities.length == 0) {
            this.finish();
            return;
        }

        log(` =>>> Next step: entities: ${this.entities.length} (${this.entities.map(i => i.id)}), attack entities: ${attackEntities.length} (${attackEntities.map(i => i.id)})`, 'battleFlow')

        const attackFlow = async () => {
            let currentTossEntityQueue = 0;
            let currentDefenceEntityQueue = 0;

            let tossCount = 0;
            let maxTossCount = Math.min(defendEntities[0].wrapper.cards.length - 1, 5);

            // let maxTossCount = this.rules.entityMode == EntityMode.Self ? Math.min(defendEntities[0].wrapper.cards.length - 1, 5) : 5;
            let tossCanBeCycled = false;

            const removeEntity = (entity, isAttack) => {
                if (this.mainDeck.cards.length > 0) return;
                log(`No cards in entity ${entity.id} CC:${entity.wrapper.cards.length}`, 'battleFlow');
                if (isAttack && attackEntities.includes(entity)) {
                    attackEntities.splice(attackEntities.indexOf(entity), 1);
                    if (attackEntities.length == 0) {
                        currentTossEntityQueue = 0;
                    } else {
                        currentTossEntityQueue = Math.max((currentTossEntityQueue - 1) % attackEntities.length, 0);
                        if (isNaN(currentTossEntityQueue)) {
                            currentTossEntityQueue = 0;
                        }
                    }
                    log(` - attackEntities:  ${attackEntities.map(i => i.id)} ${currentTossEntityQueue}`, 'battleFlow');
                }

                if (this.rules.entityMode == EntityMode.Self) {
                    this.entities.splice(this.entities.indexOf(entity), 1);
                }
                this.winners.push(entity);
            }

            const toss = async (cycled) => {
                const entity = attackEntities[currentTossEntityQueue];
                if (entity == null) return TossResult.Fail;

                log(`toss by: ${entity?.id} ${attackEntities.map(i => i.id)} ${currentTossEntityQueue}`, 'battleFlow')

                const result = await entity.toss(this.entities.indexOf(defendEntities[0]), cycled, () => {
                    tossCount++;
                }, () => {
                    return tossCount < maxTossCount
                });


                return result;
            }

            const nextToss = async (cycled, tossQueue) => {
                if (attackEntities.length == 0 || tossCount >= maxTossCount) {
                    currentTossEntityQueue = 0;
                    return TossResult.Fail;
                }

                log(`Next Toss ${currentTossEntityQueue}`, 'battleFlow');

                if (tossQueue >= attackEntities.length) {
                    log(`> Reset Queue ${tossQueue}`, 'battleFlow');
                    tossQueue = 0;
                    if (!tossCanBeCycled || cycled) {
                        return TossResult.Fail;
                    }

                    log(`> Next cycle ${tossQueue}`, 'battleFlow');
                    tossCanBeCycled = false;
                }

                const tossResult = await toss(true);

                log(`Toss result ${tossResult} || ${cycled} ${tossCanBeCycled} ${tossQueue}`, 'battleFlow');

                if (tossResult == TossResult.SuccessNoCards) {
                    removeEntity(attackEntities[currentTossEntityQueue], true);

                    currentTossEntityQueue = (currentTossEntityQueue) % attackEntities.length;
                }

                if (tossResult == TossResult.Fail) {
                    currentTossEntityQueue = (currentTossEntityQueue + 1) % attackEntities.length;
                    tossQueue++;

                    return await nextToss(cycled, tossQueue);
                }

                if (tossQueue > 0 && !cycled) {
                    log(`> > Allow next cycle ${tossQueue} ${cycled}`, 'battleFlow');
                    tossCanBeCycled = true;
                }

                if (cycled) {
                    currentTossEntityQueue = (currentTossEntityQueue + 1) % attackEntities.length;
                    tossQueue++;

                    return await nextToss(cycled, tossQueue);
                }

                return tossResult;
            }

            const defend = async (canTransfare, noChance = false) => {

                const canTransfareByRules = battleground.canTransfareByRule((defendEntities.length > 1 ? defendEntities[(currentDefenceEntityQueue + 1) % defendEntities.length] : attackEntities[attackEntities.length - 1]).wrapper.cards); // remake
                if (!canTransfareByRules || this.rules.gameMode != GameMode.DurakTransfare) {
                    canTransfare = false;
                }

                const result = await defendEntities[currentDefenceEntityQueue].defend(canTransfare, noChance);
                if (result == DefendResult.DefenceNoCards) {
                    removeEntity(defendEntities[currentDefenceEntityQueue]);
                    return true;
                } else if (result == DefendResult.Defence) {
                    currentDefenceEntityQueue = 0;

                    const tossResult = await nextToss(false, currentTossEntityQueue);
                    if (tossResult == TossResult.SuccessNoCards) {
                        // removeEntity(attackEntities[currentTossEntityQueue], true);
                    }

                    if (tossResult == TossResult.Success || tossResult == TossResult.SuccessNoCards) {
                        return await defend(false, noChance);
                    }
                    return true;
                } else if (result == DefendResult.Transfare) {
                    switch (this.rules.entityMode) {
                        case EntityMode.Pair: {
                            this.playEntityOrder = (this.playEntityOrder + 1) % this.entities.length;
                            break
                        }
                        case EntityMode.Self:
                        default: {
                            const noEmptyEntities = [];
                            for (let i = 0; i < this.entities.length; i++) {
                                const entity = this.entities[i];
                                if (entity.wrapper.cards.length == 0) continue;

                                noEmptyEntities.push(entity);
                            }
                            this.playEntityOrder = (this.playEntityOrder + 1) % noEmptyEntities.length;
                            break
                        }
                    }
                    tossCount++;
                    updatePlaygroundEntityState();

                    // maxTossCount = Math.min(defendEntities.wrapper.cards.length - 1, 5);
                    maxTossCount = this.rules.entityMode == EntityMode.Self ? Math.min(defendEntities[0].wrapper.cards.length - 1, 5) : 5;
                    // maxTossCount = 5;
                    // maxTossCount = -1;

                    currentTossEntityQueue = 0;

                    return await defend(true, noChance);
                } else {
                    if (noChance) {
                        await nextToss(true, 0);
                        await defendEntities[0].grabPlaygroundCards();
                        await battleground.clearZones();
                        return false;
                    }

                    if (currentDefenceEntityQueue >= defendEntities.length - 1) {

                        if (noChance) {
                            await nextToss(true, 0);
                            await defendEntities[0].grabPlaygroundCards();
                            await battleground.clearZones();
                            return false;
                        } else {
                            currentDefenceEntityQueue = 0;
                            return await defend(false, true);
                        }
                    } else {
                        currentDefenceEntityQueue++;
                        currentDefenceEntityQueue = currentDefenceEntityQueue % defendEntities.length;
                        return await defend(false, noChance);
                    }
                }
            }

            const result = await attackEntities[0].move(defendEntities[0]);
            const tossResult = await toss(true);

            if (result == MoveResult.SuccessNoCards) { // || tossResult == TossResult.SuccessNoCards
                removeEntity(attackEntities[0]);
            }

            if (tossResult == TossResult.SuccessNoCards) {
                removeEntity(attackEntities[0]);
            }

            const isDefenceSuccess = await defend(true, false);
            log(` > > Defence result ${isDefenceSuccess}`, 'battleFlow');

            if (isDefenceSuccess) {
                await this.cardRelease();
                return true;
            }

            return false;
        }

        const defenceSuccess = await attackFlow();
        if (this.entities.length != 0) {
            if (defenceSuccess) {
                const next = this.entities.indexOf(defendEntities[0]);
                if (next >= 0) {
                    this.playEntityOrder = next;
                } else {
                    this.playEntityOrder = (this.playEntityOrder + 1) % this.entities.length;
                }
            } else {
                this.playEntityOrder = (this.entities.indexOf(defendEntities[0]) + 1) % this.entities.length;
            }
        }

        const getEntitiesFrom = (entity) => {
            const index = this.staticEntities.indexOf(entity);
            const array = [];
            for (let i = 0; i < this.staticEntities.length; i++) {
                const entity = this.staticEntities[(index + i) % this.staticEntities.length];
                array.push(entity);
            }

            return array;
        }

        await this.distributeCards(getEntitiesFrom(defendEntities[0]));
        this.nextStep(step + 1);
    }

    clear() {
        animator.clearAll();

        const passButton = document.getElementsByClassName('pass-btn')[0];
        passButton.style.display = 'none';

        for (let i = this.result.cards.length - 1; i >= 0; i--) {
            const element = this.result.cards[i].domElement;
            element.remove();
        }

        this.entities.forEach(element => {
            element.updateStateText(State.None);
        });

        battleground.clear();
        battleground.playgroundZone.querySelector('.card-transfare-hint-static')?.remove();
    }
}

export { Entity, BattleFlow, Player, Bot, DefendResult, State, Rule, GameMode, EntityMode, CardsCount }