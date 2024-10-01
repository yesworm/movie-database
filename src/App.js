import React, { useState, useEffect } from 'react';
import './App.css';
import { fetchPopularMovies, fetchGenres, fetchTopRatedMovies } from './api';

const Header = () => (
  <header className="app-header">
    <h1>Movie Data Dashboard</h1>
  </header>
);

const MainContent = () => {
  const [popularMovies, setPopularMovies] = useState(null);
  const [genres, setGenres] = useState(null);
  const [topRatedMovies, setTopRatedMovies] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const popular = await fetchPopularMovies();
      const genreList = await fetchGenres();
      const topRated = await fetchTopRatedMovies();
      setPopularMovies(popular);
      setGenres(genreList);
      setTopRatedMovies(topRated);
    };

    fetchData();
  }, []);

  return (
    <main className="app-main">
      <section className="chart-area">
        <h2>Data Overview</h2>
        {popularMovies ? (
          <p>Number of popular movies fetched: {popularMovies.results.length}</p>
        ) : (
          <p>Loading popular movies...</p>
        )}
        {topRatedMovies ? (
          <p>Number of top rated movies fetched: {topRatedMovies.results.length}</p>
        ) : (
          <p>Loading top rated movies...</p>
        )}
      </section>
      <section className="controls-area">
        {genres ? (
          <p>Number of genres: {genres.genres.length}</p>
        ) : (
          <p>Loading genres...</p>
        )}
      </section>
    </main>
  );
};

const Footer = () => (
  <footer className="app-footer">
    <p>&copy; 2024 Sam Geyer - Movie Data Dashboard</p>
  </footer>
);

function App() {
  return (
    <div className="app">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}

export default App;