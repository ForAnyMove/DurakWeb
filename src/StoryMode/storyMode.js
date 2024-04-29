import DynamicFontChanger from "../localization/dynamicFontChanger.js";
import { initialLocale, updateInContainer } from "../localization/translator.js";
import { storyLevelDatabase } from "../scripts/data/level_databases.js";
import { createButton, createElement, createHSpace, createImage, createTextH3, createTextSpan, createVSpace, getIconByContent, getIconByItem, getIconByPattern, getIconBySuit, getPatternLang, getPatternName, getSuitLang, getSuitName } from "../scripts/helpers.js";
import { Screen, ScreenParameters } from "../scripts/navigation/navigation.js";
import { showRewarded } from "../scripts/sdk/sdk.js";
import { Items } from "../scripts/statics/staticValues.js";
import('../scripts/rewardReceiverView.js');

const root = document.getElementById('story-mode-screen');

const screenParameters = new ScreenParameters();

screenParameters.defaultSelectedElement = { element: root.querySelector('.main-screen-switch-btn') };
screenParameters.selectableElements.push(screenParameters.defaultSelectedElement);

const levelButtonsContainer = root.getElementsByClassName('story-map-container')[0]
const tabSize = {
  width: window.innerWidth,
  height: window.innerHeight,
  orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
}
const mainTab = root.getElementsByTagName('main')[0]

window.addEventListener('resize', () => {
  popup.style.width = window.innerWidth;
  popup.style.height = window.innerHeight
})

const currentLevelIndex = storyLevelDatabase.currentLevel;

const currentLevel = storyLevelDatabase.levels[currentLevelIndex];

const popupParent = root.querySelector('#popup');

const levelPreviewPopup = new Screen({
  isPopup: true,
  element: popupParent,
})

const levelViews = [];

const views = root.getElementsByClassName('level-btn');
let levelOrder = 1;
while (levelViews.length < views.length) {
  for (let i = 0; i < views.length; i++) {
    const element = views[i];
    if (element.id == `level-btn-${levelOrder}`) {
      levelViews.push(element);
      levelOrder++;
      break;
    }
  }
}

let offset = { x: 0, y: 0 };

for (let i = 0; i < levelViews.length; i++) {
  const element = levelViews[i];
  if (i == currentLevelIndex) {
    element.classList.remove('closed')
    element.innerText = `${i + 1}`;

    const box = element.getBoundingClientRect();
    offset.x = box.left + box.width / 2;
    offset.y = box.top + box.height / 2;

    screenParameters.selectableElements.push({ element: element });

  } else if (!element.classList.contains('closed')) {
    element.classList.add('closed')
    element.innerText = '';
  }
}

const focusOnCurrentLevel = () => {
  setTimeout(() => {
    let offset = { x: 0, y: 0 };
    for (let i = 0; i < levelViews.length; i++) {
      const element = levelViews[i];
      if (i == currentLevelIndex) {

        const box = element.getBoundingClientRect();
        offset.x = box.left + box.width / 2;
        offset.y = box.top + box.height / 2;
      }
    }

    const targetPosition = { x: offset.x - window.innerWidth / 2, y: offset.y - window.innerHeight / 2 }
    mainTab.scrollBy(targetPosition.x, targetPosition.y);
  }, 10);
}

screenParameters.openCallback = () => focusOnCurrentLevel();

let lastCreatedLevelPreview = null;

function createLevelPreview(data) {
  if (lastCreatedLevelPreview != null) {
    lastCreatedLevelPreview.remove();
  }

  function createBooster(itemType, title, langID, user, parent) {
    const selectables = [];

    const plane = createElement('div', ['booster-container'], null, parent);
    {
      const div = createElement('div', ['booster'], null, plane);
      {
        const button = createButton(['add-booster-icon'], {
          border: 'none',
          background: 'no-repeat',
          backgroundImage: 'url(../../Sprites/Buttons/Used_plus.png)',
          backgroundSize: '100% 100%',
        }, div, () => {
          showRewarded(null, null, () => user.addItem(itemType, 1, { isTrue: true, isMonetized: false }), null);
        });

        selectables.push({ element: button });
        createImage(['booster-icon'], null, div, getIconByItem(itemType));
        const count = createTextSpan(['booster-counter'], null, div, user.getItemCount(itemType));

        user.itemListUpdateEvent.addListener(() => {
          count.innerText = user.getItemCount(itemType);
        });

      }
      createTextSpan(['booster-title'], null, plane, title, langID);
    }

    return selectables;
  }
  // data
  const requiredPass = data.pass.count;
  const suitName = getSuitName(data.gameRule.SuitMode);
  const suitIcon = getIconBySuit(data.gameRule.SuitMode);

  const patternName = getPatternName(data.gameRule.Pattern);
  const patternIcon = getIconByPattern(data.gameRule.Pattern);
  const rewards = data.rewards?.items?.concat(data.rewards?.content ?? []) ?? data.rewards?.content?.concat(data.rewards?.items ?? []);
  // layout

  let selectables = [];

  const plane = createElement('div', ['popup-content']);
  {
    const header = createElement('div', ['popup-header'], null, plane);
    {
      createTextH3(null, null, header, `Уровень №${currentLevelIndex + 1}`, `level {№${currentLevelIndex + 1}}`);
      const closeButton = createButton(null, {
        // border: 'none',
        background: 'no-repeat',
        backgroundImage: 'url(Sprites/Icons/Icon_Close.png)',
        backgroundSize: '100% 100%',
      }, header, () => {
        navigation.pop();
      });
      selectables.push({ element: closeButton });
      closeButton.id = 'close-popup'
    }
    const rules = createElement('div', ['rules-container'], null, plane);
    {
      createTextSpan(null, null, rules, 'Правила', 'rules');
      const rulesContainer = createElement('div', ['rules-cards-container'], null, rules);
      {
        const suitContainer = createElement('div', ['rules-card'], { position: 'relative' }, rulesContainer);
        {
          createTextSpan(null, { position: 'absolute', top: '-3%' }, suitContainer, 'Масть', 'suit');
          createElement('div', null, { height: '4vw' }, suitContainer);
          createImage(['rules-icon'], null, suitContainer, suitIcon);
          createElement('div', null, { height: '4vw' }, suitContainer);
          createTextSpan(null, { position: 'absolute', bottom: '12%', height: '0.5vh', textWrap: 'nowrap' }, suitContainer, suitName, getSuitLang(data.gameRule.SuitMode));
        }
        const patternContainer = createElement('div', ['rules-card'], { position: 'relative' }, rulesContainer);
        {
          createTextSpan(null, { position: 'absolute', top: '-3%' }, patternContainer, 'Режим', 'game_mode');
          createElement('div', null, { height: '4vw' }, patternContainer);
          createImage(['rules-icon'], null, patternContainer, patternIcon);
          createElement('div', null, { height: '4vw' }, patternContainer);
          createTextSpan(null, { position: 'absolute', bottom: '12%', height: '0.5vh', textWrap: 'nowrap' }, patternContainer, patternName, getPatternLang(data.gameRule.Pattern));
        }
      }
    }
    const levelInfo = createElement('div', ['level-info'], null, plane);
    {
      createTextH3(['level-info-header'], null, levelInfo, 'Бустеры на уровне', 'boost_in_lvl');
      const boostersContainer = createElement('div', ['boosters-container'], null, levelInfo);
      {
        selectables = selectables.concat(createBooster(Items.BoosterHint, 'Подсказка', 'hint_b', user, boostersContainer));
        selectables = selectables.concat(createBooster(Items.BoosterUndo, 'Отмена хода', 'undo_b', user, boostersContainer));
        selectables = selectables.concat(createBooster(Items.BoosterMage, 'Маг', 'mage_b', user, boostersContainer));
        selectables = selectables.concat(createBooster(Items.BoosterTime, 'Доп. время', 'timer_b', user, boostersContainer));
      }

      if (rewards == null || rewards.length == 0) {
        createVSpace('8vh', levelInfo);
      }
      else {
        createTextH3(['rewards-title'], null, levelInfo, 'Награда', 'rewards');
        const rewardsContainer = createElement('div', ['rewards-container'], null, levelInfo);
        {
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
        const adsButton = createButton(['start-level-btn'], { textWrap: 'nowrap' }, levelStartContainer, () => {
          showRewarded(null, null, () => user.addItem(Items.Energy, 5, { isTrue: true }), null);
        });
        selectables.push({ element: adsButton });
        adsButton.id = 'ads-btn';
        {
          createImage(['watch-add-icon'], null, adsButton, 'Sprites/Icons/Icon_Ads.png');
          createTextSpan(['start-level-btn-title'], null, adsButton, 'Бесплатно', 'free');
          const priceContainer = createElement('div', ['interactive-btn-info'], null, adsButton);
          {
            createTextSpan(['btn-info-value'], null, priceContainer, '5');
            createImage(['btn-info-icon'], null, priceContainer, 'Sprites/Icons/Icon_Energy.png');
          }
        }

        const startButton = createButton(['start-level-btn'], null, levelStartContainer, () => {
          if (user.getItemCount(Items.Energy) >= requiredPass) {
            user.removeItem(Items.Energy, requiredPass);
          }
          window.location.href = `./src/playground/playground.html?levelID=level_story_${currentLevelIndex}`;
        });
        selectables.push({ element: startButton });
        startButton.id = 'play-btn';
        {
          const textContainer = createElement('div', null, { textWrap: 'nowrap', width: '50%', display: 'flex', justifyContent: 'center' }, startButton);
          createTextSpan(['start-level-btn-title'], null, textContainer, 'Играть', 'play');
          const priceContainer = createElement('div', ['interactive-btn-info'], null, startButton);
          {
            createTextSpan(['btn-info-value'], null, priceContainer, requiredPass);
            createImage(['btn-info-icon'], null, priceContainer, 'Sprites/Icons/Icon_Energy.png');
          }
        }

        function checkStartButtonAccess() {
          if (user.getItemCount(Items.Energy) < requiredPass) {
            if (!startButton.classList.contains('non-interactive')) {
              startButton.classList.add('non-interactive');
            }
          } else {
            startButton.classList.remove('non-interactive');
          }
        }

        checkStartButtonAccess();

        user.itemListUpdateEvent.addListener(() => {
          checkStartButtonAccess();
        });
      }
    }
  }

  input?.updateQueryCustom(selectables, selectables[0]);

  return plane;
}

levelButtonsContainer.addEventListener('click', (event) => {
  if (event.target.matches('.level-btn')) {
    const levelBtn = event.target;
    if (levelBtn.classList.contains('closed')) return;

    lastCreatedLevelPreview = createLevelPreview(currentLevel);
    popupParent.appendChild(lastCreatedLevelPreview);

    updateInContainer(lastCreatedLevelPreview, initialLocale);
    navigation.push(levelPreviewPopup);

    dynamicFontChanger.update();
  }
})

languageChangeEvent.invoke(initialLocale);

export { screenParameters }