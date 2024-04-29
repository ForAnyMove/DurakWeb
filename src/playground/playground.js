import { animator } from "../scripts/animator.js";
import { useHintBooster, useMageBooster, useUndoBooster } from "../scripts/boosters.js";
import { cardCollector } from "../scripts/cardsCollector.js";
import { DOChangeValue, DOChangeXY, DelayedCall, Ease, Sequence, createTweener } from "../scripts/dotween/dotween.js";
import { CanInteract, disableInteractions, enableInteractions } from "../scripts/globalEvents.js";
import { createElement, createImage, createTextSpan, getElements, getIconByItem, getInputElements, secondsToTime } from "../scripts/helpers.js";
import { createLevel, createSolitaireLevel } from "../scripts/levelCreator.js";
import { CardSide, ContentType, Pattern, SuitMode } from "../scripts/statics/enums.js";
import { Content, Items, Platform, locales } from "../scripts/statics/staticValues.js";
import { stepRecorder } from "../scripts/stepRecorder.js";

import { fourSuitSpider, fourSuitSpiderLady, oneSuitSpider, oneSuitSpiderLady, selectedRules, twoSuitSpider, twoSuitSpiderLady } from "../scripts/rules/gameRules.js";
import { getBackgroundImage } from "../scripts/data/card_skin_database.js";
import { trialLevelDatabase, storyLevelDatabase } from "../scripts/data/level_databases.js";
import { SolitaireCardColumn } from "../scripts/cardModel.js";
import { completeLevel, completeMode, failLevel, failMode, startLevel } from "../scripts/levelStarter.js";
import { showInterstitial, showRewarded } from "../scripts/sdk/sdk.js";
import DirectionalInput from "../scripts/directionInput.js";
import { StackNavigation, Screen, BackActionHandler } from "../scripts/navigation/navigation.js";
import DynamicFontChanger from "../localization/dynamicFontChanger.js";
import { initialLocale } from "../localization/translator.js";
import { closePopup, openPopup } from "../scripts/screen addons/ingameSkinSelector.js";
import { solitaireHTMLevels } from "../scripts/data/solitaireLevels.js";
import { cardSelector } from "../scripts/cardSelector.js";

input = new DirectionalInput({ element: null });

let isKeyboardWasDown = false;

navigation = new StackNavigation();

const settingsRoot = document.getElementById('settings');
const settingsScreen = new Screen({
  isPopup: true,
  element: settingsRoot,
  openButtons: getElements(document, { classNames: ['settings-button'] }),
  closeButtons: [settingsRoot.querySelector('#close-popup-settings'), settingsRoot.querySelector('#popup-fade-close')],
  onFocus: () => {
    dynamicFontChanger.update();
    input.updateQueryCustom(getInputElements(settingsScreen.element, { tags: ['button'] }).concat({ element: settingsScreen.closeButtons[0] }), { element: settingsScreen.closeButtons[0] });
  }, onUnfocus: () => {
    const elements = getInputElements(menuScreen.element, { tags: ['button'] });
    input.updateQueryCustom(elements, elements[0])
  }
});

const languageRoot = document.getElementById('languages');
const languageScreen = new Screen({
  isPopup: true,
  element: languageRoot,
  openButtons: [document.getElementById('lang-btn')],
  closeButtons: [languageRoot.querySelector('#close-popup-languages'), languageRoot.querySelector('#popup-fade-close')],
  onFocus: () => {
    dynamicFontChanger.update();
    input.updateQueryCustom(getInputElements(languageScreen.element, { classNames: ['language'] }).concat({ element: languageScreen.closeButtons[0] }), { element: languageScreen.closeButtons[0] });
  }, onUnfocus: () => {
    input.updateQueryCustom(getInputElements(settingsScreen.element, { tags: ['button'] }).concat({ element: settingsScreen.closeButtons[0] }), { element: settingsScreen.closeButtons[0] });
  }
});

const menuRoot = document.getElementById('menu');
const menuScreen = new Screen({
  isPopup: true,
  element: menuRoot,
  onFocus: () => {
    dynamicFontChanger.update();
    const elements = getInputElements(menuScreen.element, { tags: ['button'] });
    input.updateQueryCustom(elements, elements[0]);
  }, onUnfocus: () => {
    if (isKeyboardWasDown) {
      input.loadFromSavedPull('ingame');
    }
  }
});

const exitScreen = new Screen({
  isPopup: true,
  element: document.getElementById('exid-game'),
  closeButtons: [document.getElementById('exid-game').getElementsByClassName('exid-no')[0]],
  onFocus: () => {
    dynamicFontChanger.update();
    const elements = getInputElements(exitScreen.element, { tags: ['button'] });
    input.updateQueryCustom(elements, elements[1]);

  }, onUnfocus: () => {
    if (isKeyboardWasDown) {
      input.loadFromSavedPull('ingame');
    }
  }
});

const exitButton = exitScreen.element.getElementsByClassName('exid-yes')[0];
if (exitButton != null) {
  exitButton.onclick = function () { SDK?.dispatchEvent(SDK.EVENTS.EXIT); }
}

navigation.registerScreen(settingsScreen);
navigation.registerScreen(languageScreen);
navigation.registerScreen(menuScreen);
navigation.registerScreen(exitScreen);

new BackActionHandler(input,
  () => {
    if (navigation.openedScreens.length == 0) {
      navigation.push(menuScreen);
    } else {
      navigation.pop();
    }
  },
  () => {
    navigation.push(exitScreen);
  });

let timer = 0;

showInterstitial();

const hintButtons = document.getElementsByClassName('hint-button');
const mageButtons = document.getElementsByClassName('mage-button');
const undoButtons = document.getElementsByClassName('undo-button');
const timeButtons = document.getElementsByClassName('time-button');

const screenParameters = { rules: oneSuitSpider, decksToWin: 8, onWinCallback: null, onLoseCallback: null, isSolitaire: false, onRestart: null, time: -1 };

function trySelectLevel() {
  const levelTypesList = [
    'level_def_s_',
    'level_def_sl_',
    'level_story_',
    'level_trial_'
  ]
  const urlParams = new URLSearchParams(window.location.search);
  const levelID = urlParams.get('levelID');
  if (levelID == null) return;

  const type = levelID.substring(0, levelID.lastIndexOf('_') + 1);
  const number = parseInt(levelID.substring(type.length, levelID.length));

  function removeBoosters() {
    for (let i = mageButtons.length - 1; i >= 0; i--) {
      const element = mageButtons[i];
      if (element) { element.remove(); }
    }
    for (let i = undoButtons.length - 1; i >= 0; i--) {
      const element = undoButtons[i];
      if (element) { element.remove(); }
    }
    for (let i = timeButtons.length - 1; i >= 0; i--) {
      const element = timeButtons[i];
      if (element) { element.remove(); }
    }
  }

  switch (type) {
    case levelTypesList[0]:
      switch (number) {
        case 1:
          screenParameters.rules = oneSuitSpider;
          break;
        case 2:
          screenParameters.rules = twoSuitSpider;
          break;
        case 4:
          screenParameters.rules = fourSuitSpider;
          break;
      }
      screenParameters.decksToWin = 8;
      screenParameters.onWinCallback = () => {
        completeMode(screenParameters.rules.rule);
      };
      screenParameters.onLoseCallback = () => {
        failMode(screenParameters.rules.rule);
      }
      removeBoosters();
      break
    case levelTypesList[1]:
      switch (number) {
        case 1:
          screenParameters.rules = oneSuitSpiderLady;
          break;
        case 2:
          screenParameters.rules = twoSuitSpiderLady;
          break;
        case 4:
          screenParameters.rules = fourSuitSpiderLady;
          break;
      }
      screenParameters.decksToWin = 4;
      screenParameters.onWinCallback = () => {
        completeMode(screenParameters.rules.rule);
      };
      screenParameters.onLoseCallback = () => {
        failMode(screenParameters.rules.rule);
      }
      removeBoosters();
      break
    case levelTypesList[2]:
      const storyLevel = storyLevelDatabase.levels[number];

      switch (storyLevel.gameRule.Pattern) {
        case Pattern.Spider:
          screenParameters.decksToWin = 8;
          switch (storyLevel.gameRule.SuitMode) {
            case SuitMode.OneSuit:
              screenParameters.rules = oneSuitSpider;
              break
            case SuitMode.TwoSuits:
              screenParameters.rules = twoSuitSpider;
              break
            case SuitMode.FourSuits:
              screenParameters.rules = fourSuitSpider;
              break
          }
          break;
        case Pattern.SpiderLady:
          screenParameters.decksToWin = 4;
          switch (storyLevel.gameRule.SuitMode) {
            case SuitMode.OneSuit:
              screenParameters.rules = oneSuitSpiderLady;
              break
            case SuitMode.TwoSuits:
              screenParameters.rules = twoSuitSpiderLady;
              break
            case SuitMode.FourSuits:
              screenParameters.rules = fourSuitSpiderLady;
              break
          }
          break;
      }
      screenParameters.isSolitaire = true;

      screenParameters.onWinCallback = () => {
        subscribeFinishScreenRewardsObtain();
        completeLevel();
      };
      screenParameters.onLoseCallback = () => {
        failLevel();
      }
      startLevel(storyLevelDatabase);
      break
    case levelTypesList[3]:

      const trialLevel = trialLevelDatabase.levels[number];
      switch (trialLevel.gameRule.Pattern) {
        case Pattern.Spider:
          switch (trialLevel.gameRule.SuitMode) {
            case SuitMode.OneSuit:
              screenParameters.rules = oneSuitSpider;
              break
            case SuitMode.TwoSuits:
              screenParameters.rules = twoSuitSpider;
              break
            case SuitMode.FourSuits:
              screenParameters.rules = fourSuitSpider;
              break
          }
          break;
        case Pattern.SpiderLady:
          switch (trialLevel.gameRule.SuitMode) {
            case SuitMode.OneSuit:
              screenParameters.rules = oneSuitSpiderLady;
              break
            case SuitMode.TwoSuits:
              screenParameters.rules = twoSuitSpiderLady;
              break
            case SuitMode.FourSuits:
              screenParameters.rules = fourSuitSpiderLady;
              break
          }
          break;
      }

      screenParameters.decksToWin = trialLevel.trial.decksToComplete;
      screenParameters.time = trialLevel.time;

      startTimer(trialLevel.time);

      screenParameters.onWinCallback = () => {
        subscribeFinishScreenRewardsObtain();
        completeLevel();
      };
      screenParameters.onLoseCallback = () => {
        failLevel();
      }
      startLevel(trialLevelDatabase);
      screenParameters.onRestart = () => startTimer(trialLevel.time);
      break
  }
}

trySelectLevel();

function startTimer(seconds) {
  let container = document.getElementsByClassName('header-timer hidden')[0];
  if (container != null) {
    container.classList.remove('hidden');
  } else {
    container = document.getElementsByClassName('header-timer')[0];
  }

  const textAttribute = container.getElementsByTagName('span')[0] ?? document.createElement('span');
  textAttribute.classList.add('counter-text');
  container.appendChild(textAttribute);

  timer = seconds;

  let lastSecond = 0;
  function request(dt) {
    timer -= dt * 60 / 1000;

    const second = Math.floor(timer);
    if (lastSecond != second) {
      lastSecond = second;
      textAttribute.innerText = secondsToTime(second);

      if (second <= 0) {
        levelLostFlow();
        animator.removeRequest(request);
      }
    }
  }

  animator.addRequest(request);
}

function checkAndMakeSpiderLadyPatternView() {
  if (screenParameters.rules.pattern == Pattern.SpiderLady) {
    const playableCardColumns = document.getElementsByClassName('playable-card-column');
    const collectableCardColumns = document.getElementsByClassName('cards-container');

    for (let i = playableCardColumns.length - 1; i >= 0; i--) {
      if (i == 6) break;
      const element = playableCardColumns[i];
      document.getElementsByClassName('active-cards-zone')[0].removeChild(element);
    }

    for (let i = collectableCardColumns.length - 1; i >= 0; i--) {
      if (i == 3) break;
      const element = collectableCardColumns[i];

      if (i > 5) {
        document.getElementsByClassName('bottom-cards-zone')[0].removeChild(element);
        continue;
      }
      element.classList.add('fade-hidden');
    }

    const main = document.getElementsByTagName('main')[0];
    if (main) {
      // main.style.width = '48vw';
    }
    setSpiderLadyStyles()
  }
}

function setSpiderLadyStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
  @media only screen and (orientation: portrait) {
    .active-cards-container,
    .cards-container,
    .extra-cards-container,
    .card-element,
    .test-card {
      width: 13.5vw;
      height: 18vw;
    }
    .active-cards-zone,
    .bottom-cards-zone {
      column-gap: 0;
    }
    .bottom-cards-zone:last-child {
      transform: translate(-3%);
    }

    .active-cards-container>.card-element.closed:not(:first-child, .locked) {
      margin-top: -16vw;
      transition: margin-top 0.25s ease, width 0.25s ease, height 0.25s ease,
        margin-left 0.25s ease;
    }

    .active-cards-container>.card-element.first:not(:first-child, .locked) {
      margin-top: -16vw;
      transition: margin-top 0.25s ease, width 0.25s ease, height 0.25s ease,
        margin-left 0.25s ease;
    }

    .active-cards-container>.card-element.opened:not(:first-child, .first, .locked) {
      margin-top: -13vw;
      transition: margin-top 0.25s ease, width 0.25s ease, height 0.25s ease,
        margin-left 0.25s ease;
    }

    .active-cards-container>.card-element.locked:not(:first-child) {
      margin-top: -16.5vw;
      transition: margin-top 0.25s ease, width 0.25s ease, height 0.25s ease,
        margin-left 0.25s ease;
    }

    .bottom-cards-zone>.cards-container {
      transform: translate(15%);
    }
    .bottom-cards-zone>.extra-cards-container {
      transform: translate(35%);
    }
    :root {
      --closed-card-offset: -16vw;
      --opened-card-offset: -13vw;
      --card-height: 18vw;
    }
  }
`;
  document.head.appendChild(styleElement);
}

checkAndMakeSpiderLadyPatternView();


let solitaireColumns;

const updateSolitaireInput = () => {
  const openedCards = [];
  for (let i = 0; i < solitaireColumns.length; i++) {
    const element = solitaireColumns[i];
    if (element.cards != null && element.cards.length > 0 && element.cards[0].side == CardSide.Face) {
      const selectable = {
        element: element.domElement,
        onSubmit: () => {
          cardSelector.select(element, element.cards)
          input.loadFromSavedPull('ingame_s');
        }
      };
      openedCards.push(selectable);
    }
  }

  input.updateQueryCustom(openedCards, openedCards[0]);
}
let result = null;

function startCurrentLevel() {
  const cards = document.getElementsByClassName('card-element');

  for (let i = cards.length - 1; i >= 0; i--) {
    const element = cards[i];
    if (element.classList.contains('sol-slot')) continue;
    element.remove();
  }

  createTweener();
  animator.reset();
  stepRecorder.reset();
  result = screenParameters.isSolitaire ? createSolitaireLevel({ rules: screenParameters.rules }) : createLevel({ rules: screenParameters.rules });
  screenParameters.onRestart?.();

  stepRecorder.stepRecordedEvent.addListener(updateStepText);
  updateStepText(0);

  if (screenParameters.isSolitaire) {
    setupSolitaireLevel();
  } else {
    setupDefaultLevel();
  }

  tryCloseLoseScreen();
}

startCurrentLevel();

function setupDistribution() {
  function distributeDefault() {
    if (result.croupier != null) {
      for (let i = 0; i < result.playableCardColumns.length; i++) {
        const column = result.playableCardColumns[i];
        if (column.cards.length == 0) return;
      }

      result.croupier.ingameDistribution();
    }
  }

  // extra-cards-container
  document.getElementById('extra-cards-container').onclick = function () {
    distributeDefault();
  }
}

function setupBackgroundChange() {

  const backgroundImage = document.getElementById('background');

  let usedBackground = user.getContentOfType(ContentType.Background) ?? Content.Background01;

  backgroundImage.style.backgroundImage = getBackgroundImage(usedBackground);

  user.contentUsageChanged.addListener(() => {
    const background = user.getContentOfType(ContentType.Background);

    if (background == usedBackground) return;

    usedBackground = background;
    backgroundImage.style.backgroundImage = getBackgroundImage(usedBackground);
  });
}

function setupButtons() {
  const hb = hintButtons;
  const mb = mageButtons;
  const tb = timeButtons;
  const ub = undoButtons;

  function updateCounter(element, itemType) {
    const itemCount = user.getItemCount(itemType);

    if (itemCount > 0) {
      element.getElementsByTagName('span')[0].innerText = `x${itemCount}`
      element.getElementsByClassName('ads-icon')[0].style.display = 'none';
    } else {
      element.getElementsByTagName('span')[0].innerText = '';
      element.getElementsByClassName('ads-icon')[0].style.display = 'block';
    }
  }

  const hintCounters = [];
  for (let i = 0; i < hintButtons.length; i++) {
    const element = hintButtons[i];
    if (element != null) {
      hintCounters.push(element.getElementsByTagName('span')[0]);
      element.onclick = function () {
        if (user.hasItems(Items.BoosterHint)) {
          if (useHintBooster(result.playableCardColumns, screenParameters.rules).isTrue) {
            user.removeItem(Items.BoosterHint, 1);
          }
        } else {
          showRewarded(null, null, () => user.addItem(Items.BoosterHint, 4, { isTrue: true, isMonetized: false }))
        }
      }
      updateCounter(element, Items.BoosterHint);
    }
  }

  const mageCounters = [];
  for (let i = 0; i < mageButtons.length; i++) {
    const element = mageButtons[i];
    if (element != null) {
      mageCounters.push(element.getElementsByTagName('span')[0]);
      element.onclick = function () {
        if (user.hasItems(Items.BoosterMage)) {
          if (useMageBooster(result.mainCardColumn, result.playableCardColumns, screenParameters.rules).isTrue) {
            user.removeItem(Items.BoosterMage, 1);
          }
        } else {
          showRewarded(null, null, () => user.addItem(Items.BoosterMage, 2, { isTrue: true, isMonetized: false }))
        }
      }

      updateCounter(element, Items.BoosterMage);
    }
  }

  const timeCounters = [];
  for (let i = 0; i < timeButtons.length; i++) {
    const element = timeButtons[i];
    if (element != null) {
      timeCounters.push(element.getElementsByTagName('span')[0]);
      element.onclick = function () {
        if (user.hasItems(Items.BoosterTime)) {
          timer += 60;

          user.removeItem(Items.BoosterTime, 1);
        } else {
          showRewarded(null, null, () => user.addItem(Items.BoosterTime, 1, { isTrue: true, isMonetized: false }))
        }
      }

      updateCounter(element, Items.BoosterTime);
    }
  }

  const undoCounters = [];
  for (let i = 0; i < undoButtons.length; i++) {
    const element = undoButtons[i];
    if (element != null) {
      undoCounters.push(element.getElementsByTagName('span')[0]);
      element.onclick = function () {
        if (user.hasItems(Items.BoosterUndo)) {
          if (useUndoBooster()) {
            user.removeItem(Items.BoosterUndo, 1);
          }
        } else {
          showRewarded(null, null, () => user.addItem(Items.BoosterUndo, 5, { isTrue: true, isMonetized: false }))
        }
      }

      updateCounter(element, Items.BoosterUndo);
    }
  }

  user.itemListUpdateEvent.addListener(() => {
    for (let i = 0; i < hb.length; i++) {
      const element = hb[i];
      if (element != null) {
        updateCounter(element, Items.BoosterHint);
      }
    }
    for (let i = 0; i < mb.length; i++) {
      const element = mb[i];
      if (element != null) {
        updateCounter(element, Items.BoosterMage);
      }
    }
    for (let i = 0; i < tb.length; i++) {
      const element = tb[i];
      if (element != null) {
        updateCounter(element, Items.BoosterTime);
      }
    }
    for (let i = 0; i < ub.length; i++) {
      const element = ub[i];
      if (element != null) {
        updateCounter(element, Items.BoosterUndo);
      }
    }
  })

  const restartButtons = document.getElementsByClassName('reset-level-button');
  for (let i = 0; i < restartButtons.length; i++) {
    const element = restartButtons[i];

    element.onclick = function () {
      if (!CanInteract) return;

      startCurrentLevel();
      navigation.pop();
    }
  }

  const continueButton = document.getElementsByClassName('next-ads-btn')[0];

  if (continueButton != null) {
    continueButton.onclick = function () {
      showRewarded(null, null, () => {
        tryCloseLoseScreen();
        startTimer(screenParameters.time);

        enableInteractions();
      }, null);
    }
  }
}

function subscribeFinishScreenRewardsObtain() {
  rewardsReceiver?.disable();
  user.onItemsPublicReceive.addListener((data) => {
    const { items } = data;
    const parent = document.getElementById('win-screen-rewards');

    for (let i = 0; i < items.length; i++) {
      const element = items[i];
      parent.appendChild(createRewardView(element));
    }
  });
}

function checkIfLevelWon(options) {

  if (options.collectedCount >= screenParameters.decksToWin) {
    const winScreen = document.getElementById('win-screen-popup');

    winScreen.classList.add('visible');
    winScreen.classList.remove('hidden-popup');
  }
}

function showLoseScreen() {
  const loseScreen = document.getElementById('lose-screen-popup');

  loseScreen.classList.add('visible');
  loseScreen.classList.remove('hidden-popup');
}

function tryCloseLoseScreen() {
  const loseScreen = document.getElementById('lose-screen-popup');

  loseScreen.classList.remove('visible');
  if (!loseScreen.classList.contains('hidden-popup')) {
    loseScreen.classList.add('hidden-popup');
  }
}

function levelLostFlow() {
  disableInteractions();

  showLoseScreen();
}

function updateStepText(stepCount) {
  document.getElementById('step-counter').innerText = stepCount;
}

function defineDefaultSelectables() {
  const selectables = [];

  for (let i = 0; i < result.playableCardColumns.length; i++) {
    const element = result.playableCardColumns[i];
    const selectable = {
      customData: {
        selectedLevel: 1, clearAllSelection: () => {
          const cards = element.getRangeFromEnd(selectable.customData.selectedLevel, false).reverse();
          for (let i = 0; i < cards.length - 1; i++) {
            const element = cards[i];
            element.domElement.classList.remove('selected-card');

          }
          selectable.customData.selectedLevel = 1;
        }
      },
      element: element.domElement,
      onLeft: () => {
        selectable.customData.clearAllSelection();
      },
      onRight: () => {
        selectable.customData.clearAllSelection();
      },
      onSubmit: () => {
        const cards = element.getRangeFromEnd(selectable.customData.selectedLevel, false).reverse();
        if (cards != null && cards.length > 0) {
          cards[0].domElement.click();
        }
      },
      onUp: () => {
        const cards = element.getRangeFromEnd(selectable.customData.selectedLevel + 1, false).reverse();
        if (selectedRules.isCanRemove(cards)) {
          cards[0].domElement.classList.add('selected-card');
          selectable.customData.selectedLevel++;

          return { preventDefault: true }
        }
      },
      onDown: () => {
        if (selectable.customData.selectedLevel > 1) {
          const cards = element.getRangeFromEnd(selectable.customData.selectedLevel, false).reverse();
          cards[0].domElement.classList.remove('selected-card');
          selectable.customData.selectedLevel--;

          return { preventDefault: true }
        }
      },
    };

    selectables.push(selectable);
  }

  selectables.push({
    element: result.mainCardColumn.domElement, onSubmit: () => {
      for (let i = 0; i < input.selectableElements.length; i++) {
        const element = input.selectableElements[i];
        if (element.customData != null) {
          element.customData.clearAllSelection();
        }
      }
    }
  })

  input.saveSelectableState('ingame', selectables, selectables[0]);
}

function defineSolitaireSelectables() {
  const selectables = [];

  for (let i = 0; i < result.playableCardColumns.length; i++) {
    const element = result.playableCardColumns[i];
    const selectable = {
      element: element.domElement,
      onSubmit: () => {
        const cards = element.getRangeFromEnd(1, false).reverse();
        if (cards != null && cards.length > 0) {
          cards[0].domElement.click();
        }

        input.deselect();
        DelayedCall(0.2, () => {
          updateSolitaireInput?.();
        })
      },
    };

    selectables.push(selectable);
  }

  input.saveSelectableState('ingame_s', selectables, selectables[0]);
}

if (platform == Platform.TV) {
  result.croupier.onDistributionFinished.addListener(() => {
    defineDefaultSelectables();
  });
}


function setupDefaultLevel() {
  setupDistribution();
  setupButtons();
  stepRecorder.stepRecordedEvent.addListener(updateStepText);

  const buttonContainers = document.getElementsByClassName('footer-control-panel');
  for (let i = 0; i < buttonContainers.length; i++) {
    const element = buttonContainers[i];
    element.classList.remove('hidden');
  }

  result.croupier.onDistributionFinished.addListener(() => {
    if (platform == Platform.TV) {
      input.keyWasTriggered.addListener(() => {
        input.loadFromSavedPull('ingame');
        input.keyWasTriggered.removeAllListeners();
      })
    }
  })
}

function setupSolitaireLevel() {

  defineSolitaireSelectables();

  const buttonContainers = document.getElementsByClassName('footer-control-panel');
  for (let i = 0; i < buttonContainers.length; i++) {
    const element = buttonContainers[i];
    if (!element.classList.contains('hidden')) {
      element.classList.add('hidden');
    }
  }

  const storyModeContainer = document.getElementsByClassName('story-mode-card-zone')[0];

  const childCount = storyModeContainer.children.length;
  for (let i = 0; i < childCount; i++) {
    storyModeContainer.children[i].remove();
  }

  const levelHTML = solitaireHTMLevels[storyLevelDatabase.currentLevel];
  storyModeContainer.insertAdjacentHTML('beforeend', levelHTML);

  const solitaireSlots = storyModeContainer.getElementsByClassName('sol-slot');

  const cardColumns = [];

  for (let i = 0; i < solitaireSlots.length; i++) {
    {
      const element = solitaireSlots[i];
      const elementNumer = parseInt(element.id.substring(element.id.lastIndexOf('-') + 1, element.id.lastIndexOf('-') + 3));
      let overlapArray = null;

      if (element.id.includes('<')) {
        let arrayText = element.id.substring(element.id.indexOf('['), element.id.indexOf(']') + 1);
        arrayText = arrayText.replace(' ', '').replace('[0', '[').replace(',0', ',');
        overlapArray = JSON.parse(arrayText);
      }

      const cardColumn = new SolitaireCardColumn(element, elementNumer, overlapArray, element.classList.contains('closed'));
      cardColumns.push(cardColumn);
    }

  }
  solitaireColumns = cardColumns;

  result.croupier.onDistributionFinished.addListener(() => {
    if (platform == Platform.TV) {
      DelayedCall(0.2, () => {
        input.keyWasTriggered.addListener(() => {
          updateSolitaireInput();
          input.keyWasTriggered.removeAllListeners();
        })
      })
    }

    result.croupier.onDistributionFinished.removeAllListeners();
    let unlockedCount = 0;

    for (let i = 0; i < result.playableCardColumns.length; i++) {
      const element = result.playableCardColumns[i];
      element.cardAddedEvent.addListener(() => {
        unlockedCount++;
        if (unlockedCount == result.playableCardColumns.length) {
          setupDefaultLevel();
          input.loadFromSavedPull('ingame');

          DelayedCall(0.2, () => {
            for (let j = 0; j < result.playableCardColumns.length; j++) {
              const element = result.playableCardColumns[j];
              element.setCanRemove();
              element.setCanPlace();
            }
          })
        }
      });
      element.lock();
    }

    function transitionFinishedCallback() {
      for (let i = 0; i < cardColumns.length; i++) {
        const column = cardColumns[i];

        if (column.overlapArray == null) continue;
        for (let j = 0; j < cardColumns.length; j++) {
          if (i == j) continue;
          const other = cardColumns[j];

          if (column.overlapArray.includes(other.number)) {
            column.addOverlapColumns(other);
          }
        }
      }
    }

    for (let i = 0; i < cardColumns.length; i++) {
      const column = cardColumns[i];
      const card = result.solitaireCards[i];

      column.translateCardsToColumn([card], () => {
        if (i == 0) {
          transitionFinishedCallback();
        }
        if (column.isClosed) {
          card.close();
        } else {
          card.open();
        }
      })
    }

  })
}

function createRewardView(data) {
  const container = createElement('div', ['bounty'], { scale: 1, marginLeft: '1vh', marginRight: '1vh' });
  {
    createImage(['bounty-icon'], null, container, '../../' + getIconByItem(data.type));
    if (data.count > 1) createTextSpan(['bounty-title'], null, container, `x${data.count}`);
  }

  return container;
}

updateStepText(0);
setupBackgroundChange();
cardCollector.onCollected.addListener(checkIfLevelWon);


function setupLanguageSelector(initialLocale) {
  const selectors = document.getElementsByClassName('language-container');

  const languageSelectorStructs = [];

  for (let i = 0; i < selectors.length; i++) {
    const selector = selectors[i];
    const check = selector.getElementsByClassName('accept-checkbox-icon')[0];

    const selectorStruct = {
      locale: locales[i],
      selector: selector,
      check: check,
      select: () => {
        for (let j = 0; j < languageSelectorStructs.length; j++) {
          const element = languageSelectorStructs[j];
          if (element == selectorStruct) {
            element.check.classList.remove('hidden');
          } else if (!element.check.classList.contains('hidden')) {
            element.check.classList.add('hidden');
          }
        }

        languageChangeEvent.invoke(selectorStruct.locale);
      }
    };

    selector.onclick = () => {
      selectorStruct.select();
    };

    languageSelectorStructs.push(selectorStruct)
  }

  for (let i = 0; i < languageSelectorStructs.length; i++) {
    const element = languageSelectorStructs[i];
    if (element.locale == initialLocale) {
      element.select();
      break;
    }
  }
}

const skinSelectButton = document.getElementById('skin-change-btn');
const skinBackSelectButton = document.getElementById('skin-back-change-btn');
const backgroundSelectButton = document.getElementById('background-change-btn');
const backSelectorButton = document.getElementById('skins-collection-back-btn');

const skinSelectionScreen = new Screen({
  isPopup: true,
  element: document.getElementById('skins-collection-slider-tab'),
  openButtons: [skinSelectButton, skinBackSelectButton, backgroundSelectButton],
  closeButtons: [backSelectorButton],
  onFocus: () => { },
  onUnfocus: () => { }
})

skinSelectButton.addEventListener('click', () => {
  openPopup(ContentType.CardSkin);
});
skinBackSelectButton.addEventListener('click', () => {
  openPopup(ContentType.CardBack);
});
backgroundSelectButton.addEventListener('click', () => {
  openPopup(ContentType.Background);
});

backSelectorButton.addEventListener('click', () => {
  closePopup();
});

navigation.registerScreen(skinSelectionScreen);

function invokeTutorial() {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const isTutorial = params.get('isTutorial');

  const tutorialTab = document.getElementById('tutorial')
  if (isTutorial) {
    tutorialTab.style.display = 'flex'
  } else {
    tutorialTab.remove();
    return;
  }


  const tutorialScreens = Array.from(document.getElementsByClassName('tutorial-screen'));
  const finger = tutorialTab.querySelector('#finger');

  const tutorial_01 = {
    customData: {}, screen: tutorialScreens[0],
    open: () => {
      tutorial_01.screen.style.display = 'flex';
      const cards = tutorial_01.screen.getElementsByClassName('tutorial-card-element');
      const sequenceOne = new Sequence();
      const sequenceTwo = new Sequence();

      function partOne() {
        sequenceOne.clear();

        for (let i = 1; i < cards.length; i++) {
          const element = cards[i];
          element.style.scale = 0;
          element.style.opacity = 0;
          sequenceOne.append(DOChangeValue(() => 0, (val) => {
            element.style.scale = Math.min((val + .3), 1);
            element.style.opacity = val;
          }, 1, 0.1, Ease.SineOut));
        }
      }

      function partTwo() {
        sequenceTwo.clear();

        for (let i = 1; i < cards.length; i++) {
          const element = cards[i];
          element.style.scale = 1;
          element.style.opacity = 1;
          sequenceTwo.append(DOChangeValue(() => 1, (val) => {
            element.style.scale = (1 + (1 - val) * 0.2);
            element.style.opacity = val;
          }, 0, 0.02, Ease.Linear));
        }
      }

      partOne();

      sequenceOne.onComplete(() => { DelayedCall(0.25, () => { partTwo(); }) });
      sequenceTwo.onComplete(() => { DelayedCall(0.2, () => { partOne(); }) });

      tutorial_01.customData.kill = () => {
        sequenceOne.kill();
        sequenceTwo.kill();
      }
    },
    close: () => {
    }
  }

  const tutorial_02 = {
    customData: {}, screen: tutorialScreens[0],
    open: () => {
      tutorial_02.screen.getElementsByClassName('tutorial-cards-info')[0].lang = 'tutorial_02';
      languageChangeEvent.invoke(initialLocale);
    },
    close: () => {
      tutorial_01.customData.kill?.();
      tutorial_01.screen.style.display = 'none';
    }
  }

  const tutorial_03 = {
    customData: {}, screen: tutorialScreens[1],
    open: () => {
      tutorial_03.screen.style.display = 'flex';

      finger.style.zIndex = 1001;
      document.body.appendChild(finger);

      const targetColumn = tutorial_03.screen.getElementsByClassName('movable-cards-column')[0];
      const targetColumnCards = targetColumn.getElementsByClassName('tutorial-card-element');
      const lastCardBox = targetColumnCards[targetColumnCards.length - 1].getBoundingClientRect();

      const offset = lastCardBox.height + parseFloat(window.getComputedStyle(targetColumnCards[targetColumnCards.length - 1]).marginTop);

      const movableCards = tutorial_03.screen.getElementsByClassName('movable-cards-column')[1].getElementsByClassName('tutorial-card-element');
      const sequence = new Sequence();

      const elements = [];
      for (let i = 0; i < movableCards.length; i++) {
        const element = movableCards[i];
        elements.push(element)
      }

      function remove(element) {
        const pos = { x: element.getBoundingClientRect().left, y: element.getBoundingClientRect().top };
        element.style.position = 'absolute';
        document.body.appendChild(element);

        element.style.left = `${pos.x}px`;
        element.style.top = `${pos.y}px`;
        element.style.zIndex = 1000;
      }

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        remove(element);
        move(element, { x: parseFloat(element.style.left), y: parseFloat(element.style.top) + offset * i });
      }

      function move(element, position) {
        element.style.left = position.x + 'px';
        element.style.top = position.y + 'px';
      }

      const startPosition = { x: parseFloat(elements[0].style.left), y: parseFloat(elements[0].style.top) }
      const targetPosition = { x: lastCardBox.left, y: lastCardBox.top + offset };

      function startAnimation() {
        sequence.kill();


        finger.style.left = startPosition.x + offset + 'px';
        finger.style.top = startPosition.y + 'px';

        sequence.append(DOChangeValue(() => 0, (val) => {
          finger.style.opacity = val;
          finger.style.scale = val;
        }, 1, .2, Ease.BackOut));
        sequence.append(DOChangeXY(() => startPosition, (val) => {
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            move(element, { x: val.x, y: val.y + offset * i })
          }

          finger.style.left = val.x + offset + 'px';
          finger.style.top = val.y + 'px';
        }, targetPosition, .25, Ease.Linear));
        sequence.append(DelayedCall(0.2, null));
        sequence.append(DOChangeXY(() => targetPosition, (val) => {
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            move(element, { x: val.x, y: val.y + offset * i })
          }

          finger.style.left = val.x + offset + 'px';
          finger.style.top = val.y + 'px';
        }, startPosition, .25, Ease.Linear));
        sequence.append(DOChangeValue(() => 1, (val) => {
          finger.style.opacity = val;
          finger.style.scale = val;
        }, 0, .1, Ease.Linear));
        sequence.append(DelayedCall(0.2, null));
      }

      sequence.onComplete(() => startAnimation());
      startAnimation();

      tutorial_03.customData.kill = function () {
        sequence.kill();

        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          element.remove();
        }
      }
    },
    close: () => {
      tutorial_03.customData.kill?.();
      tutorial_03.screen.style.display = 'none';
    }
  }

  const tutorial_04 = {
    customData: {}, screen: tutorialScreens[2],
    open: () => {
      tutorial_04.screen.style.display = 'flex';

      finger.style.zIndex = 1001;
      document.body.appendChild(finger);

      const targetColumn = tutorial_04.screen.getElementsByClassName('tutorial-cards-column')[1];
      const lastCardBox = targetColumn.getBoundingClientRect();

      const movableCards = tutorial_04.screen.getElementsByClassName('tutorial-cards-column')[0].getElementsByClassName('tutorial-card-element');
      const offset = lastCardBox.height + parseFloat(window.getComputedStyle(movableCards[movableCards.length - 1]).marginTop);

      const sequence = new Sequence();

      const elements = [];
      for (let i = 0; i < movableCards.length; i++) {
        const element = movableCards[i];
        if (i > 3)
          elements.push(element)
      }

      function remove(element) {
        const pos = { x: element.getBoundingClientRect().left, y: element.getBoundingClientRect().top };
        element.style.position = 'absolute';
        document.body.appendChild(element);

        element.style.left = `${pos.x}px`;
        element.style.top = `${pos.y}px`;
        element.style.zIndex = 1000;
      }

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        remove(element);
        move(element, { x: parseFloat(element.style.left), y: parseFloat(element.style.top) + offset * i });
      }

      function move(element, position) {
        element.style.left = position.x + 'px';
        element.style.top = position.y + 'px';
      }

      const startPosition = { x: parseFloat(elements[0].style.left), y: parseFloat(elements[0].style.top) }
      const targetPosition = { x: lastCardBox.left, y: lastCardBox.top };

      function startAnimation() {
        sequence.kill();

        finger.style.left = startPosition.x + offset + 'px';
        finger.style.top = startPosition.y + 'px';

        sequence.append(DOChangeValue(() => 0, (val) => {
          finger.style.opacity = val;
          finger.style.scale = val;
        }, 1, .2, Ease.BackOut));
        sequence.append(DOChangeXY(() => startPosition, (val) => {
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            move(element, { x: val.x, y: val.y + offset * i })
          }

          finger.style.left = val.x + offset + 'px';
          finger.style.top = val.y + 'px';
        }, targetPosition, .25, Ease.Linear));
        sequence.append(DelayedCall(0.2, null));
        sequence.append(DOChangeXY(() => targetPosition, (val) => {
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            move(element, { x: val.x, y: val.y + offset * i })
          }

          finger.style.left = val.x + offset + 'px';
          finger.style.top = val.y + 'px';
        }, startPosition, .25, Ease.Linear));
        sequence.append(DOChangeValue(() => 1, (val) => {
          finger.style.opacity = val;
          finger.style.scale = val;
        }, 0, .1, Ease.Linear));
        sequence.append(DelayedCall(0.2, null));
      }

      sequence.onComplete(() => startAnimation());
      startAnimation();


      tutorial_04.customData.kill = function () {
        sequence.kill();

        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          element.remove();
        }
      }
    },
    close: () => {
      tutorial_04.customData.kill?.();
      tutorial_04.screen.style.display = 'none';
    }
  }

  const tutorial_05 = {
    customData: {},
    screen: tutorialScreens[3],
    open: () => {
      tutorial_05.screen.style.display = 'flex';

      const deck = tutorial_05.screen.getElementsByClassName('cards-deck')[0];
      const deckCards = deck.children;
      const deckBox = deck.getBoundingClientRect();

      const targetColumns = tutorial_05.screen.getElementsByClassName('tutorial-cards-column');
      const targetColumnsBoxes = [
        targetColumns[0].getBoundingClientRect(),
        targetColumns[1].getBoundingClientRect(),
      ]
      const offset = targetColumns[0].children[0].getBoundingClientRect().height + parseFloat(window.getComputedStyle(targetColumns[0].children[1]).marginTop);

      const sequence = new Sequence();

      const elements = [];
      for (let i = 0; i < deckCards.length; i++) {
        const element = deckCards[i];
        elements.push(element);
        remove(element);
        if (i >= 1) break;
      }

      function remove(element) {
        const pos = { x: element.getBoundingClientRect().left, y: element.getBoundingClientRect().top };
        element.style.position = 'absolute';
        document.body.appendChild(element);

        element.style.left = `${pos.x}px`;
        element.style.top = `${pos.y}px`;
        element.style.zIndex = 1000;
      }

      remove(finger);


      function move(element, position) {
        element.style.left = position.x + 'px';
        element.style.top = position.y + 'px';
      }

      const startPosition = { x: deckBox.left, y: deckBox.top };
      const targetPositions = [
        { x: targetColumnsBoxes[0].left, y: targetColumnsBoxes[0].top + targetColumns[0].childElementCount * offset },
        { x: targetColumnsBoxes[1].left, y: targetColumnsBoxes[1].top + targetColumns[1].childElementCount * offset },
      ]

      function startAnimation() {
        sequence.kill();

        finger.style.left = startPosition.x + deckBox.width / 3 + 'px';
        finger.style.top = startPosition.y + deckBox.height / 3 + 'px';

        sequence.append(DOChangeValue(() => 0, (val) => {
          finger.style.opacity = val;
          finger.style.scale = val;
        }, 1, .2, Ease.BackOut));

        for (let i = 0; i < targetPositions.length; i++) {
          const targetPosition = targetPositions[i];
          if (i == 0) {
            sequence.append(DOChangeXY(() => startPosition, (val) => {
              move(elements[i], { x: val.x, y: val.y })
            }, targetPosition, .1, Ease.SineInOut));
          } else {
            sequence.join(DOChangeXY(() => startPosition, (val) => {
              move(elements[i], { x: val.x, y: val.y })
            }, targetPosition, .1, Ease.SineInOut));
          }
        }

        const cards = [
          `url('../../Sprites/Card Skins/Release/Skin_01/seven_spades_01.png')`,
          `url('../../Sprites/Card Skins/Release/Skin_01/ace_spades_01.png')`,
        ];
        for (let i = 0; i < elements.length; i++) {
          const tween = DOChangeValue(() => 1, (value) => {
            elements[i].style.scale = `${value} 1`;
          }, 0, 0.05, Ease.SineInOut);
          tween.onComplete(() => {
            elements[i].style.backgroundImage = cards[i];
            DOChangeValue(() => 0, (value) => {
              elements[i].style.scale = `${value} 1`;
            }, 1, 0.05, Ease.SineInOut).onComplete(() => {
              elements[i].style.scale = `1 1`;
            })
          })
          sequence.join(tween);
        }
        sequence.append(DelayedCall(0.3, null));
        sequence.append(DOChangeValue(() => 1, (val) => {
          finger.style.opacity = val;
          finger.style.scale = val;
        }, 0, .2, Ease.BackOut));

        for (let i = 0; i < targetPositions.length; i++) {
          const targetPosition = targetPositions[i];
          if (i == 0) {
            sequence.append(DOChangeXY(() => targetPosition, (val) => {
              move(elements[i], { x: val.x, y: val.y })
            }, startPosition, .1, Ease.SineInOut));
          } else {
            sequence.join(DOChangeXY(() => targetPosition, (val) => {
              move(elements[i], { x: val.x, y: val.y })
            }, startPosition, .1, Ease.SineInOut));
          }
        }
        for (let i = 0; i < elements.length; i++) {
          const tween = DOChangeValue(() => 1, (value) => {
            elements[i].style.scale = `${value} 1`;
          }, 0, 0.05, Ease.SineInOut);
          tween.onComplete(() => {
            elements[i].style.backgroundImage = `url(../../Sprites/CardBacks/Card_Back_01.png)`
            DOChangeValue(() => 0, (value) => {
              elements[i].style.scale = `${value} 1`;
            }, 1, 0.05, Ease.SineInOut).onComplete(() => {
              elements[i].style.scale = `1 1`;
            })
          })
          sequence.join(tween);
        }
        sequence.append(DelayedCall(0.3, null));
      }

      sequence.onComplete(() => {
        startAnimation();
      })
      startAnimation();


      tutorial_05.customData.kill = function () {
        sequence.kill();

        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          element.remove();
        }

        finger.remove();
      }

    }, close: () => {
      tutorial_05.customData.kill?.();
      tutorial_05.screen.style.display = 'none';
    }
  }

  const tutorial_06 = {
    screen: tutorialScreens[4],
    open: () => {
      tutorial_06.screen.style.display = 'flex';
    },
    close: () => {
      tutorial_06.screen.style.display = 'none';
    }
  }

  const tutorial_07 = {
    screen: tutorialScreens[5],
    open: () => {
      tutorial_07.screen.style.display = 'flex';
    },
    close: () => {
      tutorial_07.screen.style.display = 'none';
    }
  }

  const tutorial_08 = {
    screen: tutorialScreens[6],
    open: () => {
      tutorial_08.screen.style.display = 'flex';
    },
    close: () => {
      tutorial_08.screen.style.display = 'none';
    }
  }


  const tutorials = [tutorial_01, tutorial_02, tutorial_03, tutorial_04, tutorial_05, tutorial_06, tutorial_07, tutorial_08];

  const nextTutorialScreenBtn = document.getElementById('next-tutorial-screen-btn')
  input.updateQueryCustom([{ element: nextTutorialScreenBtn }], { element: nextTutorialScreenBtn });

  let tutorialStep = 0;

  function nextTutorial() {
    tutorials[tutorialStep].close();
    tutorialStep++;
    if (tutorialStep == tutorials.length) {
      tutorialTab.style.display = 'none'
      window.location.href = '../../index.html';
      return;
    }

    tutorials[tutorialStep].open();
  }

  nextTutorialScreenBtn.onclick = function () {
    nextTutorial();
  };

  tutorials[tutorialStep].open();
}

invokeTutorial();

dynamicFontChanger = new DynamicFontChanger();

export { setupLanguageSelector }