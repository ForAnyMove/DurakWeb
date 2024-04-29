
let mask = document.querySelector('.mask');
let isLoaded = false;
let isPreloading = false;
mask.style.opacity = 1;
mask.style.transition = 'opacity 0.5s ease';

function enablePreloader() {
    mask.style.opacity = 1;
    mask.style.display = 'flex';
}

function disablePreloader() {
    isPreloading = false;
    mask.style.opacity = 0;
    setTimeout(() => {
        isPreloading = false;
        mask.style.display = 'none';
    }, 600);
}

async function preload(middleLoader, callback) {

    //     const body = document.getElementsByTagName('body')[0];
    //     body.insertAdjacentHTML('afterbegin', `<div class="mask">
    //     <div class="banter-loader">
    //       <div class="banter-loader__box"></div>
    //       <div class="banter-loader__box"></div>
    //       <div class="banter-loader__box"></div>
    //       <div class="banter-loader__box"></div>
    //       <div class="banter-loader__box"></div>
    //       <div class="banter-loader__box"></div>
    //       <div class="banter-loader__box"></div>
    //       <div class="banter-loader__box"></div>
    //       <div class="banter-loader__box"></div>
    //     </div>
    //   </div>`)

    if (isPreloading) return;
    isPreloading = true;

    mask.style.opacity = 1;
    mask.style.display = 'flex';

    window.addEventListener('load', () => {
        isLoaded = true;
    });

    await middleLoader?.();

    if (isLoaded) {
        mask.style.opacity = 0;
        setTimeout(() => {
            isPreloading = false;
            mask.style.display = 'none';
        }, 600);
    } else {
        window.addEventListener('load', () => {
            mask.style.opacity = 0;
            setTimeout(() => {
                isPreloading = false;
                mask.style.display = 'none';
            }, 600);
        });
    }

}

export { preload, enablePreloader, disablePreloader }