import { initialLocale, updateLanguage } from "../localization/translator.js";
import { animator } from "./animator.js";
import { State } from "./battleFlow.js";
import { CardsDeck } from "./cardModel.js";
import { DONormalizedValue, Delay, DelayedCall, Ease, Sequence, SequencedDelay } from "./dotween/dotween.js";
import { enableInteractions } from "./globalEvents.js";
import { createElement, getGlobalScale, getRectData, getTargetPosition, lerp, pullOutClear, pullOutElement, removeCard, setRemoveClass } from "./helpers.js";
import { createLevel } from "./levelCreator.js";
import { battleground } from "./playgroundBattle.js";
import { Rank, Suit } from "./statics/enums.js";

const pattern = [
    { rank: Rank.Queen, suit: Suit.Spades },
    { rank: Rank.King, suit: Suit.Spades },
    { rank: Rank.Ten, suit: Suit.Diamonds },
    { rank: Rank.King, suit: Suit.Clubs },
    { rank: Rank.Nine, suit: Suit.Clubs },
    { rank: Rank.Nine, suit: Suit.Hearts },
    { rank: Rank.Queen, suit: Suit.Hearts },
    { rank: Rank.Jack, suit: Suit.Hearts },
    { rank: Rank.Eight, suit: Suit.Spades },
    { rank: Rank.Ace, suit: Suit.Diamonds },
    { rank: Rank.Jack, suit: Suit.Clubs },
    { rank: Rank.Six, suit: Suit.Clubs },
    { rank: Rank.Queen, suit: Suit.Clubs },
    { rank: Rank.Jack, suit: Suit.Diamonds },
    { rank: Rank.Six, suit: Suit.Spades },
    { rank: Rank.Seven, suit: Suit.Spades },
    { rank: Rank.Ace, suit: Suit.Spades },
    { rank: Rank.King, suit: Suit.Hearts },
    { rank: Rank.Eight, suit: Suit.Diamonds },
    { rank: Rank.Ace, suit: Suit.Clubs },
    { rank: Rank.Ace, suit: Suit.Hearts },
    { rank: Rank.Nine, suit: Suit.Diamonds },
    { rank: Rank.Six, suit: Suit.Hearts },
    { rank: Rank.Seven, suit: Suit.Hearts },
    { rank: Rank.Ten, suit: Suit.Spades },
    { rank: Rank.Eight, suit: Suit.Hearts },
    { rank: Rank.Jack, suit: Suit.Spades },
    { rank: Rank.Ten, suit: Suit.Clubs },
    { rank: Rank.Eight, suit: Suit.Clubs },
    { rank: Rank.Seven, suit: Suit.Diamonds },
    { rank: Rank.Ten, suit: Suit.Hearts },
    { rank: Rank.Six, suit: Suit.Diamonds },
    { rank: Rank.Queen, suit: Suit.Diamonds },
    { rank: Rank.King, suit: Suit.Diamonds },
    { rank: Rank.Seven, suit: Suit.Clubs },
    { rank: Rank.Nine, suit: Suit.Spades },
]

class TutorialFlow {
    constructor(entities, rules) {
        this.entities = entities;

        this.result = createLevel(rules.cardsCount, pattern);
        this.mainDeck = this.result.mainCardColumn;

        for (let i = 0; i < this.mainDeck.cards.length; i++) {
            const element = this.mainDeck.cards[i];
            element.locked = true;
        }

        this.cardRreleaseWrapper = new CardsDeck(document.getElementById('card-release-wrapper'));

        this.begin();
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

    begin = async () => {
        const screen = document.querySelector('.tutorial-flow');
        const button = screen.getElementsByClassName('tutorial-continue-button')[0];
        const passContainer = document.querySelector('.player-button-container');
        setRemoveClass(passContainer, 'hidden-all', true);

        const updateButtonText = (lang) => {
            setTimeout(() => {
                button.children[0].lang = lang;
                updateLanguage([button], initialLocale);

                input.updateQueryCustom([{ element: button }], { element: button });
                dynamicFontChanger.updateElement(button.children[0]);
            }, 0);
        }

        input.saveSelectableState('tutorial', [{ element: button }], () => { return { element: button } });

        updateButtonText('Tutorial/Continue');

        // await Delay(0.2);

        const waitContinue = async () => {
            return new Promise(p => {
                button.onclick = () => {
                    audioManager.playSound();
                    p();
                }
            })
        }

        const tutorial01 = async () => {
            const container = screen.querySelector('#tutorial-01');
            setRemoveClass(container, 'hidden-all', false);

            await waitContinue();

            setRemoveClass(container, 'hidden-all', true);
        }

        const tutorial02 = async () => {
            const container = screen.querySelector('#tutorial-02');
            setRemoveClass(container, 'hidden-all', false);
            const deckWrapper = container.querySelector('.tutorial-flow-deck-container');

            const transformElement = this.mainDeck.domElement;
            const lastTransformElementParent = transformElement.parentElement;

            const data = pullOutElement(transformElement, 3000);
            const startPosition = getRectData(transformElement).position;
            const finishPosition = getTargetPosition(transformElement, deckWrapper);

            await DONormalizedValue(t => {
                transformElement.style.left = lerp(startPosition.x, finishPosition.x, t) + 'px';
                transformElement.style.top = lerp(startPosition.y, finishPosition.y, t) + 'px';
            }, 0.1, Ease.SineOut);

            await waitContinue();

            DONormalizedValue(t => {
                transformElement.style.left = lerp(finishPosition.x, startPosition.x, t) + 'px';
                transformElement.style.top = lerp(finishPosition.y, startPosition.y, t) + 'px';
            }, 0.1, Ease.SineOut).onComplete(() => {
                pullOutClear(transformElement, data)
                lastTransformElementParent.appendChild(transformElement)
            });

            setRemoveClass(container, 'hidden-all', true);
            setRemoveClass(screen, 'hidden-all', true);
        }

        const tutorial03 = async () => {
            const container = screen.querySelector('#tutorial-03');
            setRemoveClass(container, 'hidden-all', false);
            setRemoveClass(screen, 'hidden-all', false);

            const deckWrapper = screen.querySelector('#tutorial-03>.tutorial-flow-deck-container');

            const playerDeck = this.entities[0].wrapper.domElement;

            const lastPlayerDeckParent = playerDeck.parentElement;
            const mock = lastPlayerDeckParent.querySelector('.mock');
            const emptyElement = createElement('div', null, {
                width: playerDeck.offsetWidth + 'px',
                height: playerDeck.offsetHeight + 'px'
            })

            const data = pullOutElement(playerDeck, 3000);
            playerDeck.style.rotate = '';
            // return;
            lastPlayerDeckParent.appendChild(emptyElement);
            const startPosition = { x: parseFloat(playerDeck.style.left), y: parseFloat(playerDeck.style.top) };
            // const startPosition = getRectData(playerDeck).position;
            const finishPosition = getTargetPosition(playerDeck, deckWrapper);

            await DONormalizedValue(t => {
                playerDeck.style.left = lerp(startPosition.x, finishPosition.x, t) + 'px';
                playerDeck.style.top = lerp(startPosition.y, finishPosition.y, t) + 'px';
            }, 0.1, Ease.SineOut);

            await waitContinue();

            DONormalizedValue(t => {
                playerDeck.style.left = lerp(finishPosition.x, startPosition.x, t) + 'px';
                playerDeck.style.top = lerp(finishPosition.y, startPosition.y, t) + 'px';
            }, 0.1, Ease.SineOut).onComplete(() => {
                emptyElement.remove()
                pullOutClear(playerDeck, data)
                lastPlayerDeckParent.insertBefore(playerDeck, mock);
            });

            setRemoveClass(container, 'hidden-all', true);
        }

        const tutorial04 = async () => {
            const container = screen.querySelector('#tutorial-04');
            setRemoveClass(container, 'hidden-all', false);

            await waitContinue();

            setRemoveClass(container, 'hidden-all', true);
        }

        const tutorial05 = async () => {
            const container = screen.querySelector('#tutorial-05');
            setRemoveClass(container, 'hidden-all', false);
            setRemoveClass(button, 'tutorial-05', true);

            const playerDeck = this.entities[0].wrapper.domElement;
            const lastPlayerDeckParent = playerDeck.parentElement;
            const mock = lastPlayerDeckParent.querySelector('.mock');
            const emptyElement = createElement('div', null, {
                width: playerDeck.offsetWidth + 'px',
                height: playerDeck.offsetHeight + 'px'
            })

            const data = pullOutElement(playerDeck, 3000);
            playerDeck.style.rotate = '';
            lastPlayerDeckParent.appendChild(emptyElement);

            const card = this.entities[0].wrapper.cards[4].domElement;
            card.style.zIndex = 3001;
            const cardParent = card.parentElement;

            const cardEmptyElement = createElement('div', ['card-element'], {
                'box-shadow': 'none'
            })

            const pos = await removeCard(card);
            cardParent.insertBefore(cardEmptyElement, cardParent.children[1]);

            const startPosition = { x: parseFloat(card.style.left), y: parseFloat(card.style.top) };
            const finishPosition = { x: parseFloat(card.style.left), y: window.innerHeight / 2 - window.innerHeight / 100 * 8 };

            const sequence = new Sequence();
            const loop = () => {
                sequence.kill();
                sequence.append(DONormalizedValue(t => {
                    card.style.left = lerp(startPosition.x, finishPosition.x, t) + 'px';
                    card.style.top = lerp(startPosition.y, finishPosition.y, t) + 'px';

                }, 0.2, Ease.SineInOut));
                sequence.append(DelayedCall(0.2, null));
                sequence.append(DONormalizedValue(t => {
                    card.style.left = lerp(finishPosition.x, startPosition.x, t) + 'px';
                    card.style.top = lerp(finishPosition.y, startPosition.y, t) + 'px';

                }, 0.2, Ease.SineInOut));
                sequence.append(DelayedCall(0.2, null));
            }

            sequence.onComplete(() => loop());
            loop();

            await waitContinue();
            sequence.kill();

            card.style.zIndex = '';
            card.style.position = '';
            cardEmptyElement.remove();
            cardParent.insertBefore(card, cardParent.children[1]);

            emptyElement.remove();

            pullOutClear(playerDeck, data)
            lastPlayerDeckParent.insertBefore(playerDeck, mock);

            setRemoveClass(container, 'hidden-all', true);
        }

        const tutorial05p2 = async () => {
            setRemoveClass(screen, 'hidden-all', true);

            await new Promise(async p => {
                let index = 0;
                for (let i = this.entities[0].wrapper.cards.length - 1; i >= 0; i--) {
                    const card = this.entities[0].wrapper.cards[i];

                    card.locked = index != 1;
                    index++;
                }

                enableInteractions();

                input.deselect();
                await this.entities[0].move();
                await Delay(0.1);
                await this.entities[1].defend();

                p();
            });
        }

        const tutorial06 = async () => {
            const container = screen.querySelector('#tutorial-06');

            setRemoveClass(screen, 'hidden-all', false);
            setRemoveClass(container, 'hidden-all', false);

            updateButtonText('Tutorial/Continue');

            await waitContinue();

            setRemoveClass(container, 'hidden-all', true);
        }

        const tutorial07 = async () => {
            const container = screen.querySelector('#tutorial-07');
            setRemoveClass(container, 'hidden-all', false);

            const cards = this.entities[0].wrapper.cards;

            const cardParent = cards[0].domElement.parentElement;
            const cardContainers = container.querySelectorAll('.tutorial-flow-card-container');
            const empties = [];

            for (let i = 0; i < cards.length; i++) {
                const card = cards[cards.length - 1 - i].domElement;
                const cardContainer = cardContainers[i];

                const cardEmptyElement = createElement('div', ['card-element'], {
                    'box-shadow': 'none'
                })

                const pos = await removeCard(card);
                empties.push(cardEmptyElement);

                cardParent.insertBefore(cardEmptyElement, cardParent.children[1]);

                const ccRect = getRectData(cardContainer, true);
                const startPosition = { x: parseFloat(card.style.left), y: parseFloat(card.style.top) };
                const finishPosition = { x: ccRect.position.x, y: ccRect.position.y };

                card.style.transform = '';
                card.style.margin = '';

                DONormalizedValue(t => {
                    card.style.left = lerp(startPosition.x, finishPosition.x, t) + 'px';
                    card.style.top = lerp(startPosition.y, finishPosition.y, t) + 'px';

                }, 0.15, Ease.SineInOut).onComplete(() => {
                    card.style.position = '';
                    cardContainer.appendChild(card);

                    setRemoveClass(cardContainer, 'suitable', i == 3);
                    setRemoveClass(cardContainer, 'non-suitable', i != 3);
                })
            }

            await waitContinue();

            for (let i = 0; i < cardContainers.length; i++) {
                setRemoveClass(cardContainers[i], 'suitable', false);
                setRemoveClass(cardContainers[i], 'non-suitable', false);
            }

            for (let i = cards.length - 1; i >= 0; i--) {
                empties[i].remove();

                this.entities[0].wrapper.translateCard(cards[cards.length - 1 - i]);
                await Delay(0.01);
            }

            await Delay(0.15);

            setRemoveClass(container, 'hidden-all', true);
        }

        const tutorial07p2 = async () => {
            setRemoveClass(screen, 'hidden-all', true);

            await new Promise(async p => {
                let index = 0;
                for (let i = this.entities[0].wrapper.cards.length - 1; i >= 0; i--) {
                    const card = this.entities[0].wrapper.cards[i];

                    card.locked = !(card.suit == Suit.Clubs && card.rank == Rank.Seven);
                    index++;
                }

                enableInteractions();

                input.deselect();
                await this.entities[0].toss(this.entities[0], true, null, () => true);
                await Delay(0.1);
                await this.entities[1].defend();

                p();
            });
        }

        const tutorial08 = async () => {
            const container = screen.querySelector('#tutorial-08');
            setRemoveClass(container, 'hidden-all', false);
            setRemoveClass(screen, 'hidden-all', false);

            updateButtonText('Buttons/Pass');

            await waitContinue();
            setRemoveClass(container, 'hidden-all', true);
            setRemoveClass(screen, 'hidden-all', true);
            await Delay(0.1);

            await this.cardRelease();
        }

        const tutorial09 = async () => {
            await this.distributeCards([this.entities[1], this.entities[0]]);
            await this.entities[1].moveSelected(Rank.Eight, Suit.Hearts);
            await Delay(0.1);

            const container = screen.querySelector('#tutorial-09');
            setRemoveClass(container, 'hidden-all', false);
            setRemoveClass(screen, 'hidden-all', false);

            updateButtonText('Tutorial/Continue');

            const cards = this.entities[0].wrapper.cards;

            const cardParent = cards[0].domElement.parentElement;
            const cardContainers = container.querySelectorAll('.tutorial-flow-card-container');
            const empties = [];

            for (let i = 0; i < cards.length; i++) {
                const card = cards[cards.length - 1 - i].domElement;
                const cardContainer = cardContainers[i];

                const cardEmptyElement = createElement('div', ['card-element'], {
                    'box-shadow': 'none'
                })

                const pos = await removeCard(card);
                empties.push(cardEmptyElement);

                cardParent.insertBefore(cardEmptyElement, cardParent.children[1]);

                const ccRect = cardContainer.getBoundingClientRect();
                const startPosition = { x: parseFloat(card.style.left), y: parseFloat(card.style.top) };
                const finishPosition = { x: parseFloat(ccRect.left), y: parseFloat(ccRect.top) };

                card.style.transform = '';
                card.style.margin = '';

                DONormalizedValue(t => {
                    card.style.left = lerp(startPosition.x, finishPosition.x, t) + 'px';
                    card.style.top = lerp(startPosition.y, finishPosition.y, t) + 'px';

                }, 0.15, Ease.SineInOut).onComplete(() => {
                    card.style.position = '';
                    cardContainer.appendChild(card);


                    setRemoveClass(cardContainer, 'suitable', i == 2 || i == 0 || i == cards.length - 1);
                    setRemoveClass(cardContainer, 'non-suitable', i != 2 && i != 0 && i != cards.length - 1);
                })
            }

            await waitContinue();

            for (let i = 0; i < cardContainers.length; i++) {
                setRemoveClass(cardContainers[i], 'suitable', false);
                setRemoveClass(cardContainers[i], 'non-suitable', false);
            }

            for (let i = cards.length - 1; i >= 0; i--) {
                empties[i].remove();

                this.entities[0].wrapper.translateCard(cards[cards.length - 1 - i]);
                await Delay(0.01);
            }

            await Delay(0.15);

            setRemoveClass(container, 'hidden-all', true);
        }

        const tutorial09p2 = async () => {
            setRemoveClass(screen, 'hidden-all', true);

            for (let i = 0; i < this.entities[0].wrapper.cards.length; i++) {
                const card = this.entities[0].wrapper.cards[i];
                card.locked = !(card.suit == Suit.Hearts && card.rank == Rank.Ten);
            }

            input.deselect();
            await this.entities[0].defend();
            await this.entities[1].moveSelected(Rank.Ten, Suit.Clubs);
            for (let i = 0; i < this.entities[0].wrapper.cards.length; i++) {
                const card = this.entities[0].wrapper.cards[i];
                card.locked = !(card.suit == Suit.Spades && card.rank == Rank.Nine);
            }

            await this.entities[0].defend();
            await this.entities[1].moveSelected(Rank.Ten, Suit.Spades);

            updateButtonText('Buttons/TakeAll');

            const container = screen.querySelector('#tutorial-09p2');
            setRemoveClass(container, 'hidden-all', false);
            setRemoveClass(screen, 'hidden-all', false);
            screen.style.backgroundColor = '#00000000';

            await waitContinue();

            setRemoveClass(container, 'hidden-all', true);
            setRemoveClass(screen, 'hidden-all', true);
            screen.style.backgroundColor = '';

            await this.entities[0].grabPlaygroundCards();
            await battleground.clearZones();
        }

        const tutorial10 = async () => {
            const container = screen.querySelector('#tutorial-10');
            setRemoveClass(screen, 'hidden-all', false);
            setRemoveClass(container, 'hidden-all', false);

            const enemyContainer = document.querySelector('.enemy-container');
            const data = pullOutElement(enemyContainer, 3000, true);
            const scale = getGlobalScale(enemyContainer);

            const sequence = new Sequence();
            const loop = () => {
                sequence.kill();
                sequence.append(DONormalizedValue(t => {
                    if (t < 0.5) {
                        enemyContainer.style.scale = lerp(scale, scale * 1.2, t * 2);
                    } else {
                        enemyContainer.style.scale = lerp(scale * 1.2, scale, (t - 0.5) * 2);
                    }

                }, 0.2, Ease.SineInOut));
            }

            sequence.onComplete(() => loop());
            loop();

            updateButtonText('Tutorial/Continue');

            await waitContinue();
            sequence.kill();
            enemyContainer.style.scale = '';

            data.parent.insertAdjacentElement('afterbegin', enemyContainer)
            data.parent = null;
            pullOutClear(enemyContainer, data);

            setRemoveClass(screen, 'hidden-all', true);
            setRemoveClass(container, 'hidden-all', true);
        }

        const tutorial11 = async () => {
            await this.distributeCards([this.entities[1], this.entities[0]]);
            const container = screen.querySelector('#tutorial-11');
            setRemoveClass(screen, 'hidden-all', false);
            setRemoveClass(container, 'hidden-all', false);

            await waitContinue();

            setRemoveClass(container, 'hidden-all', true);
        }

        const tutorial11p2 = async () => {
            setRemoveClass(screen, 'hidden-all', true);
            await this.entities[1].moveSelected(Rank.Eight, Suit.Diamonds);
        }

        const tutorial12 = async () => {
            const container = screen.querySelector('#tutorial-12');
            setRemoveClass(screen, 'hidden-all', false);
            setRemoveClass(container, 'hidden-all', false);
            setRemoveClass(button, 'tutorial-12', true);

            const playerDeck = this.entities[0].wrapper.domElement;
            const lastPlayerDeckParent = playerDeck.parentElement;
            const mock = lastPlayerDeckParent.querySelector('.mock');
            const emptyElement = createElement('div', null, {
                width: playerDeck.offsetWidth + 'px',
                height: playerDeck.offsetHeight + 'px'
            })

            const data = pullOutElement(playerDeck, 3000);
            playerDeck.style.rotate = '';
            lastPlayerDeckParent.appendChild(emptyElement);

            const card = this.entities[0].wrapper.cards[4].domElement;
            card.style.zIndex = 3001;
            const cardParent = card.parentElement;

            const cardEmptyElement = createElement('div', ['card-element'], {
                'box-shadow': 'none'
            })

            const pos = await removeCard(card);
            cardParent.insertBefore(cardEmptyElement, cardParent.children[0]);
            const transfareContainer = screen.querySelector('.card-transfare-hint').getBoundingClientRect();

            const startPosition = { x: parseFloat(card.style.left), y: parseFloat(card.style.top) };
            const finishPosition = { x: parseFloat(transfareContainer.left), y: parseFloat(transfareContainer.top) };

            card.style.margin = '';

            const sequence = new Sequence();
            const loop = () => {
                sequence.kill();
                sequence.append(DONormalizedValue(t => {
                    card.style.left = lerp(startPosition.x, finishPosition.x, t) + 'px';
                    card.style.top = lerp(startPosition.y, finishPosition.y, t) + 'px';

                }, 0.2, Ease.SineInOut));
                sequence.append(DelayedCall(0.2, null));
                sequence.append(DONormalizedValue(t => {
                    card.style.left = lerp(finishPosition.x, startPosition.x, t) + 'px';
                    card.style.top = lerp(finishPosition.y, startPosition.y, t) + 'px';

                }, 0.2, Ease.SineInOut));
                sequence.append(DelayedCall(0.2, null));
            }

            sequence.onComplete(() => loop());
            loop();

            await waitContinue();
            sequence.kill();

            card.style.zIndex = '';
            card.style.position = '';
            cardEmptyElement.remove();
            cardParent.insertBefore(card, cardParent.children[4]);

            emptyElement.remove();

            pullOutClear(playerDeck, data)
            lastPlayerDeckParent.insertBefore(playerDeck, mock);

            setRemoveClass(container, 'hidden-all', true);
            setRemoveClass(screen, 'hidden-all', true);
        }

        const tutorial12p2 = async () => {
            setRemoveClass(screen, 'hidden-all', true);

            await new Promise(async p => {
                let index = 0;
                for (let i = 0; i < this.entities[0].wrapper.cards.length; i++) {
                    const card = this.entities[0].wrapper.cards[i];

                    card.locked = i != 4;
                    index++;
                }

                enableInteractions();

                input.deselect();
                await this.entities[0].defend(true);
                await Delay(0.2);
                await this.entities[1].defend();
                await Delay(0.1);
                await this.entities[1].defend();
                await this.cardRelease();

                p();
            });
        }

        setRemoveClass(screen, 'hidden-all', false);
        await tutorial01();
        await tutorial02();
        await this.distributeCards([this.entities[0], this.entities[1]]);
        await tutorial03();
        await tutorial04();
        await tutorial05();
        await tutorial05p2();
        await tutorial06();
        await tutorial07();
        await tutorial07p2();
        await tutorial08();
        await tutorial09();
        await tutorial09p2();
        await tutorial10();
        await tutorial11();
        await tutorial11p2();
        await tutorial12();
        await tutorial12p2();
        setRemoveClass(passContainer, 'hidden-all', false);

        navigation.pop();
        return;
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

        await SequencedDelay(distributionCount, distributionDelay, (i) => {
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

        await Delay(0.2);
    }

    clear() {
        input.clearSavedState('tutorial');

        animator.clearAll();

        setRemoveClass(document.querySelector('.tutorial-flow'), 'hidden-all', true);

        const passContainer = document.querySelector('.player-button-container');
        setRemoveClass(passContainer, 'hidden-all', false);

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
    }
}

export { TutorialFlow }