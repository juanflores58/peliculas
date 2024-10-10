async function show_popup(card) {
    const movie_id = card.getAttribute('data-id');
    
    // Cargar el contenido de popup.html en el popup-container
    const popupContainer = document.getElementById('popup-container');
    const response = await fetch('popup.html');
    const popupHtml = await response.text();
    popupContainer.innerHTML = popupHtml;

    // Mostrar el pop-up
    popupContainer.classList.add('show-popup');
    
    // Cargar los detalles de la película
    const movie = await get_movie_by_id(movie_id);
    const movie_trailer = await get_movie_trailer(movie_id);

    // Insertar los datos de la película en el contenido del pop-up
    popupContainer.querySelector('.popup-content').innerHTML = `
        <span class="x-icon">&#10006;</span>
        <div class="content">
            <div class="left">
                <div class="poster-img">
                    <img src="${image_path + movie.poster_path}" alt="">
                </div>
                <div class="single-info">
                    <span>Add to favorites:</span>
                    <span class="heart-icon">&#9829;</span>
                </div>
            </div>
            <div class="right">
                <h1>${movie.title}</h1>
                <h3>${movie.tagline}</h3>
                <div class="single-info-container">
                    <div class="single-info">
                        <span>Language:</span>
                        <span>${movie.spoken_languages[0].name}</span>
                    </div>
                    <div class="single-info">
                        <span>Length:</span>
                        <span>${movie.runtime} minutes</span>
                    </div>
                    <div class="single-info">
                        <span>Rate:</span>
                        <span>${movie.vote_average} / 10</span>
                    </div>
                    <div class="single-info">
                        <span>Budget:</span>
                        <span>$ ${movie.budget}</span>
                    </div>
                    <div class="single-info">
                        <span>Release Date:</span>
                        <span>${movie.release_date}</span>
                    </div>
                </div>
                <div class="genres">
                    <h2>Genres</h2>
                    <ul>
                        ${movie.genres.map(e => `<li>${e.name}</li>`).join('')}
                    </ul>
                </div>
                <div class="overview">
                    <h2>Overview</h2>
                    <p>${movie.overview}</p>
                </div>
                <div class="trailer">
                    <h2>Trailer</h2>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${movie_trailer}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            </div>
        </div>
    `;

    // Manejar el cierre del pop-up
    const x_icon = popupContainer.querySelector('.x-icon');
    x_icon.addEventListener('click', () => popupContainer.classList.remove('show-popup'));

    // Manejar favoritos
    const heart_icon = popupContainer.querySelector('.heart-icon');
    const movie_ids = get_LS();
    for (let i = 0; i <= movie_ids.length; i++) {
        if (movie_ids[i] == movie_id) heart_icon.classList.add('change-color');
    }

    heart_icon.addEventListener('click', () => {
        if (heart_icon.classList.contains('change-color')) {
            remove_LS(movie_id);
            heart_icon.classList.remove('change-color');
        } else {
            add_to_LS(movie_id);
            heart_icon.classList.add('change-color');
        }
        fetch_favorite_movies();
    });
}
