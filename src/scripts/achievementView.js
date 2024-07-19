import { createElement, createImage, createTextSpan, setRemoveClass } from "./helpers.js";

class AchievementView {
    constructor(data) {
        this.data = data;
        this.root = null;
        this.statsContainer = null;
        this.progressBar = null;
        this.progressText = null;

        this.createView();

    }

    updateView() {
        const finished = this.data.allTrialsCompleted;

        setRemoveClass(this.root, 'completed', finished);
        if (finished) {
            setRemoveClass(this.root, 'shine', false);
            this.statsContainer?.remove()
            this.progressBar?.remove()
            this.progressText?.remove()
        } else {
            const completed = this.data.completed;

            setRemoveClass(this.root, 'shine', completed);

            this.progressBar.style.scale = `${Math.min((0.95 * this.data.getCompletionPercent() / 100), 0.95)} 0.95`;
            this.progressText.innerText = this.data.getValueText();
        }
    }

    createView() {

        const plane = createElement('div', ['achievements_stats-list-item-tab']);
        {
            plane.onclick = () => {
                const reward = this.data.tryCompleteCurrentTrial();
                if (reward) {
                    audioManager.playSound();
                    user.addItem(reward.type, reward.count, { isTrue: true });
                }
            }

            const container = createElement('div', ['achievements_stats-list-item'], null, plane);
            {
                const headerCountainer = createElement('div', ['achievements_header-container'], null, container);
                {
                    const icon = createImage(['achievements_header-icon'], null, headerCountainer, this.data.icon)
                    const titleContainer = createElement('div', ['achievements_stats-list-item-title-container'], null, headerCountainer); {
                        const title = createTextSpan(['achievements_stats-list-item-title'], null, titleContainer, this.data.title);
                        title.lang = this.data.langID;
                    }
                }
                if (!this.data.allTrialsCompleted) {
                    this.statsContainer = createElement('div', ['achievements_stats-list-item-progress-container'], null, container);
                    {
                        this.progressBar = createElement('div', ['achievements_stats-list-item-progress-level-mask'], null, this.statsContainer);
                        this.progressBar.style.scale = `${Math.min((0.95 * this.data.getCompletionPercent() / 100), 0.95)} 0.95`;
                        this.progressText = createTextSpan(['achievements_stats-list-item-progress-title'], null, this.statsContainer, this.data.getValueText());
                    }
                }

                setRemoveClass(plane, 'completed', this.data.allTrialsCompleted);
            }
        }

        this.root = plane;
        this.updateView();
    }
}

export { AchievementView }