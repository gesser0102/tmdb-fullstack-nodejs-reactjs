const mediaType = {
    movie: 'movie',
    tv: 'tv'
}

const mediaCategory = {
    top_rated: 'top_rated',
    popular: 'popular',
    upcoming: 'upcoming'
}

const backdropPath = (imgEndpoint) => `https://image.tmdb.org/t/p/original/${imgEndpoint}`

const posterPath = (imgEndpoint) => `https://image.tmdb.org/t/p/w500/${imgEndpoint}`

const youtubePath = (videoId) => `https://www.youtube.com/embed/${videoId}?controls=0`

const tmdbConfig = {
    mediaType,
    mediaCategory,
    backdropPath,
    posterPath,
    youtubePath
}
export default tmdbConfig;

