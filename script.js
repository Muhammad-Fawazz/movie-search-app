const apiKey = "495f1aa2d86d5f45393d8d88149f96af";
const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;
const searchButton = document.getElementById("search-button");

const display = (data) => {
    const movieContainer = document.querySelector(".movie-container");
    movieContainer.innerHTML = '';
    if (data.results.length > 0) {
        data.results.forEach(movie => {
            const movieCard = document.createElement("div");
            movieCard.className = "movie-card";
            const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'placeholder-image-url.png';
            movieCard.innerHTML = `
                <div class="image-container">
                    <img src="${imageUrl}" alt="${movie.title}" onerror="this.onerror=null; this.src='placeholder-image-url.png';">
                </div>
                <div class="details">
                    <h3>${movie.title}</h3>
                    <p class="release-date">Release Date: ${movie.release_date}</p>
                    <p class="overview">${movie.overview}</p>
                    <button class="more-info" data-movie-id="${movie.id}">More Info</button>
                </div>
            `;
            movieContainer.appendChild(movieCard);
        });
        attachMoreInfoEventListeners();
    } else {
        movieContainer.innerText = "No results found.";
    }
}

const attachMoreInfoEventListeners = () => {
    const moreInfoButtons = document.querySelectorAll(".more-info");
    moreInfoButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const movieId = button.getAttribute("data-movie-id");
            await fetchMovieDetails(movieId);
        });
    });
}

const fetchMovieDetails = async (movieId) => {
    try {
        // Fetch movie details
        const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
        if (!movieResponse.ok) throw new Error("Network response was not ok");
        const movie = await movieResponse.json();

        // Fetch movie credits
        const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`);
        if (!creditsResponse.ok) throw new Error("Network response was not ok");
        const credits = await creditsResponse.json();

        // Extract director and actors
        const director = credits.crew.find(person => person.job === 'Director');
        const actors = credits.cast.slice(0, 5).map(actor => actor.name).join(', ');

        // Display movie details
        displayMovieDetails(movie, director, actors);
    } catch (error) {
        console.error("Failed to fetch movie details:", error);
    }
}

const displayMovieDetails = (movie, director, actors) => {
    const modal = document.getElementById("movie-modal");
    const modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = `
        <h2>${movie.title}</h2>
        <p><strong>Plot:</strong> ${movie.overview}</p>
        <p><strong>Director:</strong> ${director ? director.name : 'N/A'}</p>
        <p><strong>Actors:</strong> ${actors ? actors : 'N/A'}</p>
    `;
    modal.style.display = "block";

    const closeButton = document.querySelector(".close-button");
    closeButton.onclick = () => {
        modal.style.display = "none";
    }

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
}


searchButton.addEventListener("click", async () => {
    const searchInput = document.getElementById("search").value;
    try {
        const response = await fetch(`${apiUrl}${searchInput}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        display(data);
    } catch (error) {
        console.error("Failed to fetch movies:", error);
    }
});
