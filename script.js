const moviesContainer = document.getElementById('movie-container');
const addMovieBtn = document.getElementById('add-movie-btn');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementsByClassName('close')[0];
const saveMovieBtn = document.getElementById('save-movie-btn');
const imageInput = document.getElementById('image-input');
const titleInput = document.getElementById('title-input');
const releaseDateInput = document.getElementById('release-date-input');

let watchStatus;
let favoriteStatus;
let movies = JSON.parse(localStorage.getItem('movies')) || [];
let typeMovies = 'default';

let options = { // необходимо для корректного отображения даты релиза фильма
    year: 'numeric',
    month: 'long',
    day: 'numeric',
};

function createEmptyMovieElement(movie, index, typeMovies) {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');
    let date = new Date(movie.releaseDate);
    movieElement.innerHTML = `
                <img src="${movie.image}" alt="${movie.title}">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-title">Дата выхода: <br /> ${date.toLocaleString("ru", options)}</p>
                <button type="button" class="movie-btn favorite-btn">В избранное</button>
                <button type="button" class="movie-btn watched-btn">Просмотренно</button>
                <button type="button" class="movie-btn edit-btn">Редактировать</button>
                <button type="button" class="movie-btn delete-btn">Удалить</button>`

    const favoriteBtn = movieElement.querySelector('.favorite-btn');
    const watchedBtn = movieElement.querySelector('.watched-btn');
    const editBtn = movieElement.querySelector('.edit-btn');
    const deleteBtn = movieElement.querySelector('.delete-btn');

    favoriteBtn.addEventListener('click', function () {
        movies[index].favoriteStatus = !movies[index].favoriteStatus;
        checkStateBtn(index, favoriteBtn, watchedBtn);
        saveMoviesToLocalStorage()
        displayMovies(typeMovies);
    });
    watchedBtn.addEventListener('click', function () {
        movies[index].watchStatus = !movies[index].watchStatus;
        checkStateBtn(index, favoriteBtn, watchedBtn)
        saveMoviesToLocalStorage();
        displayMovies(typeMovies);
    });
    editBtn.addEventListener('click', function () {
       openModal(index);
       displayMovies(typeMovies);
    });
    deleteBtn.addEventListener('click', function () {
        deleteMovie(index);
        displayMovies(typeMovies);
    });
    checkStateBtn(index,favoriteBtn, watchedBtn)
    return movieElement;
}

export function displayMovies(typeMovies) {
    moviesContainer.innerHTML = '';
    movies.forEach(function (movie, index) {
        switch (typeMovies) {
            case 'default':
                const movieElement = createEmptyMovieElement(movie, index, typeMovies);
                moviesContainer.appendChild(movieElement);
                break;
            case 'favorite':
                const movieElementFavorite = createEmptyMovieElement(movie, index, typeMovies);
                if (movies[index].favoriteStatus === true) {
                    moviesContainer.appendChild(movieElementFavorite);
                }
                break;
            case 'watched':
                const movieElementWatched = createEmptyMovieElement(movie, index, typeMovies);
                if (movies[index].watchStatus === true) {
                    moviesContainer.appendChild(movieElementWatched);
                }
                break;
        }
    })
}

function saveMoviesToLocalStorage() {
    localStorage.setItem('movies', JSON.stringify(movies));
}

function openModal(index = null) {
    if (index !== null) {
        const movie = movies[index];
        imageInput.value = movie.image;
        titleInput.value = movie.title;
        releaseDateInput.value = movie.releaseDate;
        saveMovieBtn.setAttribute('data-index', index);
    } else {
        imageInput.value = '';
        titleInput.value = '';
        releaseDateInput.value = '';
        saveMovieBtn.removeAttribute('data-index');
    }

    modal.style.display = 'block';
}

function addMovie() {
    const image = imageInput.value;
    const title = titleInput.value;
    const releaseDate = releaseDateInput.value;
    let favoriteStatus = false;
    let watchStatus = false;

    if (!validationFields(image, title, releaseDate)) {
        return;
    }

    const movie = {
        image: image,
        title: title,
        releaseDate: releaseDate,
        favoriteStatus: favoriteStatus,
        watchStatus: watchStatus
    };

    movies.push(movie);
    saveMoviesToLocalStorage();
    closeModal();
    displayMovies('default');
}

function editMovie(index) {
    const image = imageInput.value;
    const title = titleInput.value;
    const releaseDate = releaseDateInput.value;
    favoriteStatus = movies[index].favoriteStatus;
    watchStatus = movies[index].watchStatus;

    console.log(title.length)

    if (!validationFields(image, title, releaseDate)) {
        return;
    }

    movies[index] = {
        image: image,
        title: title,
        releaseDate: releaseDate,
        favoriteStatus: favoriteStatus,
        watchStatus: watchStatus
    };
    saveMoviesToLocalStorage();
    closeModal();
}

function validationFields(image, title, releaseDate) {
    if (!image || !title || !releaseDate) {
        alert('Заполните все поля!');
        return false;
    }
    if (!title.trim()) {
        alert("Введите корректное название");
        return false; 
    }
    if (releaseDate < "1900-01-01" || releaseDate > "2024-01-01" || String(releaseDate).length != 10) {
        console.log(String(releaseDate).length)
        alert("Введите корректную дату релиза")   
        return false;
    }
    if (!isImgLink(image)) {
        alert("Введите корректную ссылку на изображение");
        return false;     
    }

    else { return true; }
}
function deleteMovie(index) {
    if (confirm('Вы уверены, что хотите удалить фильм?')) {
        movies.splice(index, 1);
        saveMoviesToLocalStorage();
    }
}
function closeModal(typeMovies) {
    modal.style.display = 'none';
}

addMovieBtn.addEventListener('click', function () {
    openModal();
});

closeModalBtn.addEventListener('click', function () {
    closeModal();
});

saveMovieBtn.addEventListener('click', function () {
    const index = saveMovieBtn.getAttribute('data-index');
    if (index !== null) {
        editMovie(index);
        window.location.reload()
    } else {
        addMovie();
    }
});

function checkStateBtn(index, favoriteBtn, watchedBtn) {
    if (movies[index].favoriteStatus === true) {
        favoriteBtn.classList.add('another-state-btn')
        favoriteBtn.innerHTML = 'Удалить из избранных';
    } else if (movies[index].favoriteStatus === false) {
        favoriteBtn.classList.remove('another-state-btn')
        favoriteBtn.innerHTML = 'В избранное';
    }

    if (movies[index].watchStatus === true) {
        watchedBtn.classList.add('another-state-btn')
        watchedBtn.innerHTML = 'Удалить из просмотренных';
    } else if (movies[index].watchStatus === false) {
        watchedBtn.classList.remove('another-state-btn')
        watchedBtn.innerHTML = 'Просмотренно';
    }
}

function isImgLink(url) {
    if(typeof url !== 'string') return false;
    return(url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) != null);
}

displayMovies(typeMovies)