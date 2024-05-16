import { animator } from "./animator.js";
import { CardsDeck } from "./cardModel.js";
import { DOChangeValue, Delay, Ease, SequencedDelay } from "./dotween/dotween.js";
import { Action, disableInteractions, enableInteractions } from "./globalEvents.js";
import { getRandomInt, lerp } from "./helpers.js";
import { createLevel } from "./levelCreator.js";
import { log } from "./logger.js";
import { battleground, canBeatCard } from "./playgroundBattle.js";

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
    }

    setStateText = function (element) {
        this.stateText = element;
        this.stateText.innerText = '';
    }

    updateStateText = function (state) {
        switch (state) {
            case State.None:
                this.stateText.innerText = '';
                break;
            case State.Attack:
                this.stateText.innerText = 'Attack';
                break;
            case State.Toss:
                this.stateText.innerText = 'Toss';
                break;
            case State.Defend:
                this.stateText.innerText = 'Defend';
                break;
            default:
                this.stateText.innerText = '';
                break;
        }
    }

    async move() {
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

    async toss(isCycled, onToss, checkCanToss) {
        if (!this.isHaveCardsToToss()) {
            await Delay(0.2 / globalGameSpeed);
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

    async defend(canTransfare) {
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

class Bot extends Entity {
    async move() {
        await super.move();

        log(`[Move] by "Bot_${this.id}"`, 'battleFlow');

        if (this.wrapper.cards.length == 0) return MoveResult.SuccessNoCards;

        // write decisions

        const selectedCard = this.wrapper.cards[getRandomInt(this.wrapper.cards.length - 1)];
        selectedCard.setOpened();

        const zone = battleground.createZone();
        zone.wrapper.translateCard(selectedCard);

        await Delay(0.25 / globalGameSpeed);
        this.updateStateText(State.None);
        return this.wrapper.cards.length == 0 ? MoveResult.SuccessNoCards : MoveResult.Success;
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

    async toss(isCycled, onToss, checkCanToss) {
        const canToss = await super.toss(isCycled, onToss, checkCanToss);

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
        if (suitableCards.length == 0) {
            log(`    - FALSE ${suitableCards}`, 'battleFlow');
            await Delay(0.2 / globalGameSpeed);
            this.updateStateText(State.None);

            return TossResult.Fail;
        }
        const cycles = isCycled ? suitableCards.length : 1;

        for (let i = 0; i < cycles; i++) {
            const card = suitableCards[i];

            card.setOpened();
            const zone = battleground.createZone();
            zone.wrapper.translateCard(card);

            onToss?.();
            await Delay(0.2 / globalGameSpeed);

            log(`    - TRUE ${isCycled} ${cycles}`, 'battleFlow');
            if (!checkCanToss?.()) break;
        }

        this.updateStateText(State.None);
        await Delay(0.2 / globalGameSpeed);
        return this.wrapper.cards.length > 0 ? TossResult.Success : TossResult.SuccessNoCards;
    }

    getTransfareCard() {
        for (let i = 0; i < this.wrapper.cards.length; i++) {
            const card = this.wrapper.cards[i];
            if (battleground.canTransfare(card)) return card;
        }

        return null;
    }

    async defend(canTransfare) {
        await super.defend(canTransfare);

        log(`[Defend] Try "Bot_${this.id}"`, 'battleFlow');

        if (this.wrapper.cards.length == 0) return;

        if (canTransfare) {
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
            const playgorundZones = battleground.zones;

            for (let i = 0; i < playgorundZones.length; i++) {
                const zone = playgorundZones[i];
                if (zone.cards.length == 1) {
                    const card = zone.cards[0];

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
}

class Player extends Entity {
    constructor(wrapper) {
        super(wrapper);

        this.cardPlacedByUserEvent = new Action();
        this.isUser = true;
    }

    async move() {
        await super.move();
        log('[Move] by "Player"', 'battleFlow');

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

        return this.wrapper.cards.length == 0 ? MoveResult.SuccessNoCards : MoveResult.Success;
    }

    async defend(canTransfare) {
        await super.defend(canTransfare);

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
        passButtonText.innerText = 'TAKE ALL';

        passButton.style.display = 'flex';
        enableInteractions();

        let result = DefendResult.Fail;

        await new Promise((p) => {

            passButton.onclick = async () => {
                result = DefendResult.Fail;
                await Delay(0.1 / globalGameSpeed);
                p();
            }

            const userMoved = async (moveResult) => {
                passButton.style.display = 'none';
                disableInteractions();

                if (moveResult == null || moveResult.card == null) await Delay(0.2 / globalGameSpeed);

                if (moveResult != null && moveResult.transfare) {
                    result = DefendResult.Transfare;
                    console.log(moveResult);
                    console.log(moveResult.card != null);
                    if (moveResult.card != null) {
                        console.log(moveResult.card);
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
                        return await this.defend(false);
                    }
                }

            }

            this.cardPlacedByUserEvent.addListener(userMoved);
        })

        // this.updateStateText(State.None);
        this.cardPlacedByUserEvent.removeAllListeners();
        passButton.style.display = 'none';
        return result;
    }

    async toss(isCycled, onToss, checkCanToss, previousResult, tossCount) {
        if (tossCount == null) {
            tossCount = 0;
        }

        const canToss = await super.toss(isCycled, onToss, checkCanToss);

        if (!canToss) {
            this.updateStateText(State.None);
            return tossCount > 0 ? TossResult.Success : TossResult.Fail;
        }

        log('[Toss] by "Player"', 'battleFlow');

        const passButton = document.getElementsByClassName('pass-btn')[0];
        const passButtonText = document.getElementsByClassName('pass-btn-title')[0];
        passButtonText.innerText = 'PASS';
        passButton.style.display = 'flex';

        let result = previousResult ?? TossResult.Fail;

        await new Promise((p) => {
            enableInteractions();

            passButton.onclick = async () => {
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
            return await this.toss(isCycled, onToss, checkCanToss, result, tossCount);
        }

        this.updateStateText(State.None);
        await Delay(0.2 / globalGameSpeed);
        if (result == TossResult.Skip) {
            result = TossResult.Success;
        }

        return result;
    }

    async grabPlaygroundCards() {
        await super.grabPlaygroundCards();

        log('[Grab] by "Player"', 'battleFlow');
    }
}

class BattleFlow {
    constructor(entities, rules) {
        this.entities = entities;

        this.result = createLevel(rules.cardsCount);
        this.mainDeck = this.result.mainCardColumn;
        this.playEntityOrder = 0;
        this.begin();

        this.cardRreleaseWrapper = new CardsDeck(document.getElementById('card-release-wrapper'));

        this.winners = [];
        this.rules = rules;
    }

    async distributeCards() {
        let distributionCount = 0
        const distributionDelay = 0.02
        const distributions = [];

        for (let i = 0; i < this.entities.length; i++) {
            const entity = this.entities[i];
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

        await SequencedDelay(distributionCount, distributionDelay / globalGameSpeed, (i) => {
            let distribution = distributions[currentDistribution];
            if (distribution.placed == distribution.count) {
                currentDistribution++;
                if (currentDistribution > distributions.length - 1) return;

                distribution = distributions[currentDistribution];
            }

            const entity = this.entities[distribution.index];
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

            for (let i = 0; i < entityCards.length; i++) {
                const card = entityCards[i];
                if (card.suit == trumpSuit && card.rank < leastCardRank) {
                    entity = this.entities[i];
                    leastCardRank = card.rank;
                }
            }
        }

        return entity;
    }

    begin = async function () {
        await this.distributeCards();

        const firstStepEntity = this.getFirstStepEntity();
        this.playEntityOrder = firstStepEntity != null ? this.entities.indexOf(firstStepEntity) : 1;

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
            element.domElement.remove();
            cards[i] = null;
        }
        await battleground.clearZones();
    }

    finish() {
        console.log('Finish');
        console.log(` - Winners ${this.winners.map((i, index) => `(${index + 1} - ${i.id})`)}`)
        console.log(` - Durak ${this.entities[0].id}`)
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

            console.log(`Attack: ${attackEntities.map(i => i.id)}\nDefend: ${defendEntities.map(i => i.id)}\n`);
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
            // let maxTossCount = Math.min(defendEntities.wrapper.cards.length - 1, 5);

            let maxTossCount = this.rules.entityMode == EntityMode.Self ? Math.min(defendEntities[0].wrapper.cards.length - 1, 5) : 5;
            let tossCanBeCycled = false;

            const removeEntity = (entity, isAttack) => {
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
                console.log(`  >  Added winner ${entity.id}`);
            }

            const toss = async (cycled) => {
                const entity = attackEntities[currentTossEntityQueue];
                if (entity == null) return TossResult.Fail;

                log(`toss by: ${entity?.id} ${attackEntities.map(i => i.id)} ${currentTossEntityQueue}`, 'battleFlow')

                const result = await entity.toss(cycled, () => {
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
                    console.log(`if (tossResult == TossResult.SuccessNoCards) { (${attackEntities.map(i => i.id)})  ${currentTossEntityQueue}`);
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

            const defend = async (canTransfare) => {

                const canTransfareByRules = battleground.canTransfareByRule(defendEntities[currentDefenceEntityQueue].wrapper.cards); // remake
                if (!canTransfareByRules || this.rules.gameMode != GameMode.DurakTransfare) {
                    console.log('awefjwef');
                    canTransfare = false;
                }

                const result = await defendEntities[currentDefenceEntityQueue].defend(canTransfare);
                if (result == DefendResult.DefenceNoCards) {
                    console.log(`result == DefendResult.DefenceNoCards (${attackEntities.map(i => i.id)})  ${currentTossEntityQueue}`);
                    removeEntity(defendEntities[currentDefenceEntityQueue]);
                    return true;
                } else if (result == DefendResult.Defence) {
                    currentDefenceEntityQueue = 0;

                    const tossResult = await nextToss(false, currentTossEntityQueue);
                    if (tossResult == TossResult.SuccessNoCards) {
                        console.log(`No cards after toss`);
                        // removeEntity(attackEntities[currentTossEntityQueue], true);
                    }

                    if (tossResult == TossResult.Success || tossResult == TossResult.SuccessNoCards) {
                        return await defend(false);
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

                    return await defend(true);
                } else {
                    if (currentDefenceEntityQueue >= defendEntities.length - 1) {
                        await nextToss(true, 0);
                        await defendEntities[0].grabPlaygroundCards();
                        await battleground.clearZones();
                        return false;
                    } else {
                        currentDefenceEntityQueue++;
                        return await defend(false);
                    }
                }
            }

            const result = await attackEntities[0].move();
            const tossResult = await toss(true);

            if (result == MoveResult.SuccessNoCards) { // || tossResult == TossResult.SuccessNoCards
                console.log(`if (result == MoveResult.SuccessNoCards) (${attackEntities.map(i => i.id)})  ${currentTossEntityQueue}`);
                removeEntity(attackEntities[0]);
            }

            if (tossResult == TossResult.SuccessNoCards) {
                console.log(`if (tossResult == TossResult.SuccessNoCards) aft move (${attackEntities.map(i => i.id)})  ${currentTossEntityQueue}`);
                removeEntity(attackEntities[0]);
            }

            const isDefenceSuccess = await defend(true);
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

        await this.distributeCards();
        this.nextStep(step + 1);
    }

    clear() {
        animator.clearAll();

        const passButton = document.getElementsByClassName('pass-btn')[0];
        passButton.style.display = 'none';

        this.entities.forEach(element => {
            element.updateStateText(State.None);
        });
    }
}

export { Entity, BattleFlow, Player, Bot, DefendResult, State, Rule, GameMode, EntityMode, CardsCount }