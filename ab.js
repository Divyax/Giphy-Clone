const apiKey = 'J0JswxWB5lbaR9RIQXWSfEcnEQn7iAKS';
const gifForm = document.getElementById('gif-form');
const gifInput = document.getElementById('gif-input');
const gifContainer = document.querySelector('.gif-container');
const viewImage = document.querySelector('.view-image');
const fullImage = document.getElementById('full-image');
const gifUrlLink = document.getElementById('gif-url-link');
const closeBtn = document.querySelector('.close-btn');

// Fetch trending GIFs
const fetchTrendingGifs = async () => {
    const url = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=20`;
    const response = await fetch(url);
    const data = await response.json();
    renderGifs(data.data);
};

// Render GIFs
const renderGifs = (gifs) => {
    gifs.forEach(gif => {
        const gifElement = document.createElement('div');
        gifElement.classList.add('gif-wrapper');
        gifElement.innerHTML = `
            <img src="${gif.images.fixed_height.url}" alt="${gif.title}" class="gif-image"/>
            <img src="heart.png" alt="Favorite" class="fav-symbol">
        `;
        gifContainer.appendChild(gifElement);
    });
};

// Search GIFs
gifForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = gifInput.value.trim();
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=20`;
    const response = await fetch(url);
    const data = await response.json();
    gifContainer.innerHTML = '';
    renderGifs(data.data);
});

// Show full GIF on click
gifContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('gif-image')) {
        fullImage.src = e.target.src;
        gifUrlLink.href = e.target.src;
        viewImage.style.display = 'flex';
    }
});

// Close full GIF view
closeBtn.addEventListener('click', () => {
    viewImage.style.display = 'none';
});

// Load trending GIFs on page load
document.addEventListener('DOMContentLoaded', fetchTrendingGifs);
