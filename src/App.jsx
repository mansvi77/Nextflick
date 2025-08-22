import React, { useState, useEffect } from 'react';
import Search from './components/search.jsx';
import Spinner from './components/spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import { useDebounce } from 'react-use';
import { updateSearchCount } from './appwrite.js';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
 
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
   const [errorMessage, setErrorMessage] = useState('');
  const [popularMovies, setPopularMovies] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500, [searchTerm]);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
        );
        if (!response.ok) throw new Error('Failed to fetch popular movies');
        const data = await response.json();
        setPopularMovies(data.results || []);
      } catch (error) {
        console.error(error);
        setErrorMessage('Failed to load popular movies.');
      }
    };

    const fetchTrendingMovies = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/trending/movie/day?api_key=${API_KEY}`
        );
        if (!response.ok) throw new Error('Failed to fetch trending movies');
        const data = await response.json();
        setTrendingMovies(data.results?.slice(0, 5) || []);
      } catch (error) {
        console.error(error);
        setErrorMessage('Failed to load trending movies.');
      }
    };

    fetchPopularMovies();
    fetchTrendingMovies();
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm.trim() === '') {
      setMovieList([]);
      setErrorMessage('');
      setIsLoading(false);
      return;
    }

    const fetchSearchedMovies = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
          debouncedSearchTerm
        )}&api_key=${API_KEY}`;
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to fetch movies');
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
          setErrorMessage('No movies found!');
          setMovieList([]);
        } else {
          setMovieList(data.results);
          await updateSearchCount(debouncedSearchTerm, data.results[0]);
        }
      } catch (error) {
        setErrorMessage('Error fetching movies, please try again later');
        setMovieList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchedMovies();
  }, [debouncedSearchTerm]);

  const moviesToShow = debouncedSearchTerm.trim() === '' ? popularMovies : movieList;

  return (
    <main
      className="flex flex-col items-center min-h-screen p-4 bg-[#10141e]"
      style={{
        backgroundImage: 'url(/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <header>
        <h1 className="text-5xl font-bold text-center mb-4 text-white">
          Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
        </h1>
        <img src="/hero.png" alt="Hero Banner" className="mb-6" />
      </header>

      {/* Trending Movies Section */}
      <section className="w-full max-w-7xl mb-14">
        <h2 className="text-white text-3xl font-semibold mb-4 pl-2">Trending Movies</h2>
        <div
          className="flex flex-row gap-8 justify-start items-end pb-4 overflow-x-auto no-scrollbar"
        >
          {trendingMovies.map((movie, idx) => (
            <div
              key={movie.id}
              className="relative flex flex-col items-center"
              style={{ width: 220, minWidth: 220, height: 350 }}
            >
              {/* Outlined and centered huge number */}
              <span className="trending-rank">{idx + 1}</span>
              <MovieCard movie={movie} fallbackPoster="/no-movie.png" />
            </div>
          ))}
        </div>
      </section>

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {isLoading && (
        <div className="mt-4">
          <Spinner />
        </div>
      )}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

      {/* All Movies Section */}
      <section className="w-full max-w-7xl mt-10 mb-20">
        <h2 className="text-white text-3xl font-semibold mb-4 pl-2">All Movies</h2>
        <div
          className="movie-list grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 w-full"
        >
          {moviesToShow.map((movie) => (
            <MovieCard key={movie.id} movie={movie} fallbackPoster="/no-movie.png" />
          ))}
        </div>
      </section>
    </main>
  );
};

export default App;
