
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

async function preload(middleLoader) {
    if (isPreloading) return;
    isPreloading = true;

    mask.style.opacity = 1;
    mask.style.display = 'flex';

    if (document.readyState === "complete")
        isLoaded = true;
    else
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