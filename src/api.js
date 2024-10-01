const API_KEY = 'd60774ab066ec0efdf963be9858c2c5b'; 
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return null;
  }
};

export const fetchGenres = async () => {
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching genres:", error);
    return null;
  }
};

export const fetchTopRatedMovies = async (page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    return null;
  }
};