import { initialLocale } from "../localization/translator.js";
import { trialLevelDatabase } from "../scripts/data/level_databases.js";
import { createButton, createElement, createHSpace, createImage, createTextH3, createTextP, createTextSpan, createVSpace, getIconByContent, getIconByItem, getIconByPattern, getIconBySuit, getPatternLang, getPatternName, getSuitLang, getSuitName } from "../scripts/helpers.js";
import { ScreenParameters } from "../scripts/navigation/navigation.js";
import { showRewarded } from "../scripts/sdk/sdk.js";
import { Items } from "../scripts/statics/staticValues.js";
import('../scripts/rewardReceiverView.js');

const root = document.getElementById('challenges-test-screen');
const screenParameters = new ScreenParameters();

const vh = window.innerHeight / 100;
const vw = window.innerWidth / 100;

screenParameters.defaultSelectedElement = { element: root.querySelector('.main-screen-switch-btn') };
screenParameters.selectableElements.push(screenParameters.defaultSelectedElement);

const parent = root.getElementsByClassName('challenges-test-container')[0];
console.log(parent);
const currentLevel = trialLevelDatabase.currentLevel;
let viewWidth = 0;

const openTestBtn = document.getElementById('challenges-switch-btn');
const testChallengeScreen = document.getElementById('challenges-test-screen');
const mainTab = document.getElementById('main-screen');
openTestBtn.addEventListener('click', () => {
  console.log(testChallengeScreen);
  testChallengeScreen.style.display = 'flex';
  mainTab.style.display = 'none';
});

const arrowBackBtn = document.getElementById('');

function createBooster(itemType, title, langID, user, parent) {
    const plane = createElement('div', ['booster-container'], null, parent);
    {
        const div = createElement('div', ['booster'], null, plane);
        {
            const button = createButton(['add-booster-icon'], {
                background: 'no-repeat',
                backgroundImage: 'url(Sprites/Buttons/Used_plus.png)',
                backgroundSize: '100% 100%',
            }, div, () => {
                showRewarded(null, null, () => user.addItem(itemType, 1, { isTrue: true, isMonetized: false }), null);
            });
            audioManager.addClickableToPull(button);

            screenParameters.selectableElements.push({ element: button });

            createImage(['booster-icon'], null, div, getIconByItem(itemType));
            const count = createTextSpan(['booster-counter'], null, div, user.getItemCount(itemType));

            user.itemListUpdateEvent.addListener(() => {
                count.innerText = user.getItemCount(itemType);
            });

        }
        createTextSpan(['booster-title'], null, plane, title, langID);
    }
}

function createCompletedLevelInstance() {
    const plane = createElement('div', ['challenge-card', 'completed-card']);
    createImage(['check-icon'], null, plane, 'Sprites/Icons/Icon_Check.png');
    createTextH3(['check-info'], null, plane, 'Уровень завершен', 'lvl_completed');

    viewWidth += 42.15 * vh + 4 * vh;

    return plane;
}

function createLockedLevelInstance() {
    const plane = createElement('div', ['challenge-card', 'closed-card']);
    createImage(['lock-icon'], null, plane, 'Sprites/Icons/Icon_Lock.png');
    createTextH3(['lock-screen-info'], null, plane, 'Завершите предыдущее испытание', 'com_prev_trial');

    return plane;
}

function createUnlockedLevelInstance(data) {

    // data
    const suitName = getSuitName(data.gameRule.SuitMode);
    const suitIcon = getIconBySuit(data.gameRule.SuitMode);

    const patternName = getPatternName(data.gameRule.Pattern);
    const patternIcon = getIconByPattern(data.gameRule.Pattern);
    const rewards = data.rewards.items?.concat(data.rewards.content ?? []) ?? data.rewards.content.concat(data.rewards.items ?? []);
    // layout
    const plane = createElement('div', ['challenge-card']);
    {
        const header = createElement('div', ['challenge-header'], null, plane);
        {
            createTextH3(null, null, header, 'Текущее испытание', 'cur_trial');
            createTextP(null, null, header, null, data.trial != null ? data.trial.description : 'Соберите все колоды, чтобы завершить испытание')
        }
        const rules = createElement('div', ['rules-container'], null, plane);
        {
            createTextSpan(null, null, rules, 'Правила', 'rules');
            const rulesContainer = createElement('div', ['rules-cards-container'], null, rules);
            {
                const suitContainer = createElement('div', ['rules-card'], { position: 'relative' }, rulesContainer);
                {
                    createTextSpan(null, { position: 'absolute', top: '-8%' }, suitContainer, 'Масть', 'suit');
                    createElement('div', null, { height: '5.5vh' }, suitContainer);
                    createImage(['rules-icon'], null, suitContainer, suitIcon);
                    createElement('div', null, { height: '5.5vh' }, suitContainer);
                    createTextSpan(null, { position: 'absolute', bottom: '-3%' }, suitContainer, suitName, getSuitLang(data.gameRule.SuitMode));
                }
                const patternContainer = createElement('div', ['rules-card'], { position: 'relative' }, rulesContainer);
                {
                    createTextSpan(null, { position: 'absolute', top: '-8%' }, patternContainer, 'Режим', 'game_mode');
                    createElement('div', null, { height: '5.5vh' }, patternContainer);
                    createImage(['rules-icon'], null, patternContainer, patternIcon);
                    createElement('div', null, { height: '5.5vh' }, patternContainer);
                    createTextSpan(null, { position: 'absolute', bottom: '-3%' }, patternContainer, patternName, getPatternLang(data.gameRule.Pattern));
                }
            }
        }
        const levelInfo = createElement('div', ['level-info'], null, plane);
        {
            createTextH3(['level-info-header'], null, levelInfo, 'Бустеры на уровне', 'boost_in_lvl');
            const boostersContainer = createElement('div', ['boosters-container'], null, levelInfo);
            {
                createBooster(Items.BoosterHint, 'Подсказка', 'hint_b', user, boostersContainer);
                createBooster(Items.BoosterUndo, 'Отмена хода', 'undo_b', user, boostersContainer);
                createBooster(Items.BoosterMage, 'Маг', 'mage_b', user, boostersContainer);
                createBooster(Items.BoosterTime, 'Доп. время', 'timer_b', user, boostersContainer);
            }

            createTextH3(['rewards-title'], null, levelInfo, 'Награда', 'rewards');
            const rewardsContainer = createElement('div', ['rewards-container'], null, levelInfo);
            {
                if (rewards == null || rewards.length == 0) {
                    createVSpace('8vh', rewardsContainer);
                } else {
                    const maxViewCount = Math.min(rewards.length, 4);
                    for (let i = 0; i < maxViewCount; i++) {
                        const element = rewards[i];

                        const reward = createElement('div', ['rewards'], null, rewardsContainer);
                        {
                            const preview = getIconByItem(element.type) ?? getIconByContent(element.type);
                            createImage(['rewards-icon'], null, reward, preview);
                            if (element.count > 1) {
                                createTextSpan(['rewards-title'], null, reward, element.count);
                            }
                        }
                        if (i < maxViewCount - 1) {
                            createHSpace('1vw', rewardsContainer);
                        }
                    }
                }
            }

            const levelStartContainer = createElement('div', ['start-btn-container'], null, levelInfo);
            {
                const startButton = createButton(['start-level-btn'], null, levelStartContainer, () => {
                    window.location.href = `./src/playground/playground.html?levelID=level_trial_${currentLevel}`;
                    // TODO: level scene starting with ID parameter
                });
                audioManager.addClickableToPull(startButton);
                screenParameters.selectableElements.push({ element: startButton });
                startButton.id = 'play-btn';
                {
                    createTextSpan(['start-level-btn-title'], null, startButton, 'Играть', 'play');
                }
            }
        }
    }

    viewWidth += (42 * vh + 4 * vh) / 2;

    return plane;
}

function createLevelsList() {
    for (let i = 0; i < trialLevelDatabase.levels.length; i++) {
        let element = null;

        if (i == currentLevel) {
            element = createUnlockedLevelInstance(trialLevelDatabase.levels[i]);
        } else if (i < currentLevel) {
            element = createCompletedLevelInstance();
        } else if (i > currentLevel) {
            element = createLockedLevelInstance();
        }
        console.log(element);
        if (element != null) {
            parent.appendChild(element);
        }
    }
}

createLevelsList();

const xPos = viewWidth - window.innerWidth / 2;
// parent.scrollTo(xPos, 0);

languageChangeEvent.invoke(initialLocale);

export { screenParameters }