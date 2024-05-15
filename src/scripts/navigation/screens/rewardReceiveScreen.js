import { getIconByContent, setRemoveClass } from "../../helpers.js";
import { ScreenLogic } from "../navigation.js";

class RewardReceiveScreen extends ScreenLogic {
    async onCreate() {
        const rewardText = this.screenRoot.querySelector('.reward-receiver-reward-text');
        const rewardImage = this.screenRoot.querySelector('.reward-receiver-reward');

        const receiveReward = (data) => {
            input?.backupCurrentState();

            if (data.items) {
                const item = data.items[0];
                if (item) {
                    setRemoveClass(rewardImage, 'hidden-all', true);
                    rewardText.innerText = `+${item.count}$`
                }
            } else if (data.content) {
                const content = data.content[0];
                if (content) {
                    rewardImage.src = getIconByContent(content);

                    setRemoveClass(rewardImage, 'hidden-all', false);
                    rewardText.innerText = '';
                }
            }

            navigation.pushID('reward_receiver');
        }

        user.onItemsPublicReceive.addListener(receiveReward);
    }
}

export { RewardReceiveScreen }

// this.active = true;
// const particles = [];
// while (this.active) {
//     await Delay(0.01);
//     for (let i = 0; i < 2; i++) {
//         const particle = createElement('div', ['reward-receiver-particle'], {
//             scale: 1.5,
//             opacity: 0
//             // animation: `rotate-constant ${getRandomInt(2) + 1}s linear infinite`
//         }, this.screenRoot);
//         const angle = (getRandomInt(360) * Math.PI) / 180.0;
//         const direction = {
//             x: Math.sin(2 * Math.PI * angle),
//             y: Math.cos(2 * Math.PI * angle),
//         }
//         DONormalizedValue((value) => {
//             const tV = lerp(0.1, 1, value);
//             // particle.style.transform = `translate(${tV * 100 * direction.x}%, ${tV * 100 * direction.y}%)`;
//             particle.style.left = `${tV * 35 * direction.x + 45}%`;
//             particle.style.top = `${tV * 35 * direction.y + 42}%`;

//             particle.style.opacity = lerp(1, 0, value)
//             // particle.style.opacity = 1;
//             particle.style.scale = lerp(1, 0, value)
//         }, 0.4, Ease.SineOut).onComplete(() => {
//             particle.remove();
//         })
//     }
// }