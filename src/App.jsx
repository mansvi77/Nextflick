import React, { useState, useEffect } from 'react';
import Search from './components/search.jsx';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;


const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch popular movies once on component mount
  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);

        if (!response.ok) throw new Error('Failed to fetch popular movies');
        const data = await response.json();
        setPopularMovies(data.results || []);
      } catch (error) {
        console.error(error);
        setErrorMessage('Failed to load popular movies.');
      }
    };
    fetchPopularMovies();
  }, []);

  // Fetch movies on search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setMovieList([]);
      setErrorMessage('');
      setIsLoading(false);
      return;
    }
    const fetchSearchedMovies = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(searchTerm)}&api_key=${API_KEY}`;
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to fetch movies');
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
          setErrorMessage('No movies found!');
          setMovieList([]);
        } else {
          setMovieList(data.results);
        }
      } catch (error) {
        setErrorMessage('Error fetching movies, please try again later');
        setMovieList([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSearchedMovies();
  }, [searchTerm]);

  // List to show
  const moviesToShow = searchTerm.trim() === '' ? popularMovies : movieList;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#10141e]">
      <header>
        <h1 className="text-5xl font-bold text-center mb-4 text-white">
          Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
        </h1>
        <img src="/hero.png" alt="Hero Banner" className="mb-6" />
      </header>

      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {isLoading && <p className="text-white mt-4">Loading movies...</p>}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

      {/* Scrollable movie cards section */}
      <div className="movie-list mt-6 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl overflow-y-auto" style={{maxHeight: "60vh"}}>
        {moviesToShow.map((movie) => (
          <div key={movie.id} className="movie-card bg-[#20283d] rounded-lg shadow-md flex flex-col items-center p-4 text-white">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                alt={movie.title}
                className="w-32 h-48 object-cover rounded mb-2"
              />
            ) : (
              <div className="w-32 h-48 bg-gray-700 flex items-center justify-center rounded mb-2">No Image</div>
            )}
            <h3 className="text-center font-semibold">{movie.title}</h3>
          </div>
        ))}
      </div>
    </main>
  );
};

export default App;
