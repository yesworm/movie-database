import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchUserDiary } from './api';
import './App.css';
import ErrorBoundary from './ErrorBoundary';

const DiaryList = ({ entries }) => (
  <ul className="diary-list">
    {entries.map((entry, index) => (
      <li key={index} className="diary-item">
        {entry.posterUrl && <img src={entry.posterUrl} alt={entry.title} className="movie-poster" />}
        <div className="diary-content">
          <h3>{entry.title} ({entry.year})</h3>
          <p>Watched on: {new Date(entry.pubDate).toLocaleDateString()}</p>
          {entry.rating && <p>Your Rating: {entry.rating} stars</p>}
          <a href={entry.link} target="_blank" rel="noopener noreferrer">View on Letterboxd</a>
        </div>
      </li>
    ))}
  </ul>
);

const YearDistributionChart = ({ entries }) => {
  const data = entries.reduce((acc, entry) => {
    if (entry.year) {
      acc[entry.year] = (acc[entry.year] || 0) + 1;
    }
    return acc;
  }, {});

  const chartData = Object.entries(data).map(([year, count]) => ({ year, count }));

  return (
    <div className="chart">
      <h2>Movies Watched by Release Year</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const Stats = ({ entries }) => {
  const totalMovies = entries.length;
  const moviesWithRatings = entries.filter(entry => entry.rating !== null);
  const averageRating = moviesWithRatings.length > 0
    ? moviesWithRatings.reduce((sum, entry) => sum + entry.rating, 0) / moviesWithRatings.length
    : 0;

  const yearCounts = entries.reduce((acc, entry) => {
    if (entry.year) {
      acc[entry.year] = (acc[entry.year] || 0) + 1;
    }
    return acc;
  }, {});

  const mostWatchedYear = Object.entries(yearCounts).length > 0
    ? Object.entries(yearCounts).reduce((a, b) => a[1] > b[1] ? a : b)
    : null;

  return (
    <div className="stats">
      <h2>Your Movie Watching Stats</h2>
      <p>Total Movies Watched: {totalMovies}</p>
      <p>Average Rating: {averageRating.toFixed(2)} stars</p>
      {mostWatchedYear ? (
        <p>Most Watched Year: {mostWatchedYear[0]} ({mostWatchedYear[1]} movies)</p>
      ) : (
        <p>Most Watched Year: Not enough data</p>
      )}
    </div>
  );
};

const App = () => {
  const [username, setUsername] = useState('');
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const entries = await fetchUserDiary(username);
      if (entries && entries.length > 0) {
        setDiaryEntries(entries);
      } else {
        setError('No entries found or there was an error fetching the diary.');
      }
    } catch (err) {
      setError('An error occurred while fetching the diary. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Letterboxd Diary Dashboard</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Letterboxd username"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Fetching...' : 'Fetch Diary'}
          </button>
          </form>
        {isLoading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {diaryEntries.length > 0 && (
          <ErrorBoundary>
            <Stats entries={diaryEntries} />
            <YearDistributionChart entries={diaryEntries} />
            <DiaryList entries={diaryEntries} />
          </ErrorBoundary>
        )}
      </main>
    </div>
  );
};

export default App;