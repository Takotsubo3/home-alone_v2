const storyContent = document.getElementById('story-content');
const storyText = document.getElementById('story-text');
const nextBtn = document.getElementById('next-btn');

const storyData = [
    { text: 'WELCOME TO HOME ALONE....' },
    { text: 'Claire has always felt an inexplicable void in her memories, as if an essential part of her past was missing' },
    { text: 'You find yourself with a diary that you found while cleaning your room, not remembering to have ever written it.' },
    { text: 'As she delves into the journal, reality around her begins to shift, pulling her. You must act quickly before the shadows consume the last bit of light.' }
];

let currentPage = 0;

storyText.classList.remove('hidden');  // Ensure that the story text is visible at first
storyContent.textContent = storyData[currentPage].text;

nextBtn.addEventListener('click', () => {
    storyText.classList.add('hidden');
    setTimeout(() => {
        currentPage++;
        if (currentPage < storyData.length) {
            storyContent.textContent = storyData[currentPage].text;
            storyText.classList.remove('hidden');
        } else {
            nextBtn.textContent = 'Start Game';
            nextBtn.addEventListener('click', () => {
                window.location.href = '../../kitchen/kitchen.html';
            });
        }
    }, 1000);
});