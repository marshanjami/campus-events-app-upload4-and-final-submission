// Accessibility helper script
document.addEventListener('DOMContentLoaded', () => {
  const skipLink = document.querySelector('.skip-link');
  const main = document.querySelector('#main');

    if (skipLink && main) {
        skipLink.addEventListener('click', (e) => {
        // Delay to ensure browser jumps to target before focusing
        setTimeout(() => main.focus(), 50);
        });
    }
});