const apiKey = 'J0JswxWB5lbaR9RIQXWSfEcnEQn7iAKS';
const gifForm = document.getElementById('gif-form');
const gifInput = document.getElementById('gif-input');
const gifContainer = document.querySelector('.gif-container');
const fullImage = document.getElementById('full-image');
const viewImage = document.querySelector('.view-image');
const gifDetailsHover = document.getElementById('gif-details-hover');
const gifUrlLink = document.getElementById('gif-url-link');
const closeBtn = document.querySelector('.close-btn');
const favoritedGifsList = document.querySelector('.favorited-gifs-list');

let query = '';
let rating = '';
let category = '';
let currentPage = 0;
let isFetching = false;

// Fetch Trending GIFs
const fetchTrendingGifs = async (page = 0) => {
    const url = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=25&offset=${page * 25}&rating=g`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        // console.log(data);
        data.data.forEach(renderGif);
        isFetching = false;
    } catch (error) {
        console.error("Error fetching trending GIFs:", error);
    }
};

// Render a Single GIF Element
const renderGif = (gif) => {
    const gifElement = document.createElement('div');
    gifElement.classList.add('gif-wrapper');
    gifElement.innerHTML = `
        <img src="${gif.images.fixed_height.url}" alt="${gif.title}" class="gif-image"/>
        <img src="heart.png" alt="Favorite" class="fav-symbol">
    `;
    gifContainer.appendChild(gifElement);
};

// Fetch GIFs Based on Search Query
const fetchGifs = async (query, rating, category, page = 0) => {
    const limit = 20;
    const offset = page * limit;
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=${limit}&offset=${offset}`;
    if (rating) {
        url += `&rating=${rating}`;
    }
    
    // Add category to the URL if selected
    if (category) {
        url += `&tag=${category}`; // Giphy API uses 'tag' for categories
    }
    console.log(url);
    try {
        const response = await fetch(url);
        const input = await response.json();
        if (input.data.length === 0) {
            // console.log("No GIFs");
        } else {
            input.data.forEach(renderGif);
        }
    } catch (error) {
        console.error("Error fetching GIFs:", error);
    }
};

// Handle Form Submission
gifForm.addEventListener('submit', (e) => {
    e.preventDefault();
    query = gifInput.value.trim();
    currentPage = 0;
    gifContainer.innerHTML = '';
    if (query) fetchGifs(query, rating, category, currentPage);
});

// Infinite Scrolling for GIFs
window.addEventListener('scroll', () => {
    const { clientHeight, scrollHeight, scrollTop } = document.documentElement;
    if (!isFetching && clientHeight + scrollTop + 1 >= scrollHeight) {
        isFetching = true;
        currentPage++;
        query ? fetchGifs(query, currentPage) : fetchTrendingGifs(currentPage);
    }
});

// Show Full-Screen GIF on Click
// gifContainer.addEventListener('click', (e) => {
//     if (e.target.classList.contains('gif-image')) {
//         viewImage.style.display = "flex";
//         fullImage.src = e.target.src;
//         gifUrlLink.innerHTML = `<button class="gif-link-button">Copy Link</button>`;
//         gifUrlLink.href = e.target.src;
//         gifUrlLink.style.display = 'flex';

        
//     }
// });

gifContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('gif-image')) {
        // console.log(e);
        viewImage.style.display = "flex";  
        fullImage.src = e.target.src; 

        // copy link buyton
        gifUrlLink.innerHTML = `<button class="copy-link-button" data-url="${e.target.src}">Copy Link</button>`;
        gifUrlLink.style.display = 'flex'; 

        const copyButton = gifUrlLink.querySelector('.copy-link-button');

        // event listener for copy button
        copyButton.addEventListener('click', (event) => {
            event.preventDefault();
            const gifUrl = copyButton.getAttribute('data-url'); 
            navigator.clipboard.writeText(gifUrl)  
                .then(() => {
                    alert('Link copied to clipboard!');  
                    copyButton.textContent = 'Copied!';  
                    setTimeout(() => copyButton.textContent = 'Copy Link', 2000);  
                })
                .catch(err => console.error('Failed to copy link:', err));
        });
    }
});

// Close Full-Screen GIF View
closeBtn.addEventListener('click', () => {
    viewImage.style.display = "none";
    gifUrlLink.style.display = "none";
});

// event listener to handle hover details
gifContainer.addEventListener('mouseover', (e) => {
    if (e.target.tagName === 'IMG') {
        // console.log(e.target);
        const gifTitle = e.target.alt;
        gifDetailsHover.textContent = gifTitle;
        gifDetailsHover.style.display = 'block';
        gifDetailsHover.style.left = '4px';   
        gifDetailsHover.style.bottom = '4px';
    }
});


gifContainer.addEventListener('mouseout', (e) => {
    if (e.target.tagName === 'IMG') {
        gifDetailsHover.style.display = 'none'; 
    }
});

// Favorite GIFs
gifContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('fav-symbol')) {
        const gifImage = e.target.previousElementSibling;
        const gifUrl = gifImage.src;
        const gifTitle = gifImage.alt;

        let favorites = JSON.parse(localStorage.getItem('favoritedGifs') || '[]');
        const isFavorited = favorites.some(gif => gif.url === gifUrl);

        if (isFavorited) {
            favorites = favorites.filter(gif => gif.url !== gifUrl);
            e.target.src = 'heart.png';
        } else {
            favorites.push({ url: gifUrl, title: gifTitle });
            e.target.src = 'red.png';
        }
        localStorage.setItem('favoritedGifs', JSON.stringify(favorites));
    }
});

// display favorited GIFs on fav Page
const displayFavoritedGifs = () => {
    const favorites = JSON.parse(localStorage.getItem('favoritedGifs') || '[]');
    // console.log(favorites);
    favoritedGifsList.innerHTML = '';
    if (favorites.length === 0) {
        favoritedGifsList.innerHTML = '<p>No favorite GIFs yet!</p>';
    } else {
        favorites.forEach(gif => {
            const gifElement = document.createElement('div');
            gifElement.classList.add('favorited-gif');
            gifElement.innerHTML = `<img src="${gif.url}" alt="${gif.title}">`;
            favoritedGifsList.appendChild(gifElement);
        });
    }
};





    window.onload = () => {
        const favoritedGifsList = document.querySelector('.favorited-gifs-list');
        fetchTrendingGifs();
        displayFavoritedGifs();
       
    };
    
    


