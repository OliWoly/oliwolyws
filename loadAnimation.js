window.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    main.style.opacity = 0;
    main.style.transition = 'opacity 1s ease-in';

    setTimeout(() => {
        main.style.opacity = 1;
    }, 100);
});