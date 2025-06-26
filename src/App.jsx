import { useState, useEffect, use } from 'react'
import { useDebounce } from 'react-use';
// Importing styles and components

import './App.css'
import Search from './Components/Search.jsx'
import Spinner from './Components/Spinner.jsx';
import MovieCard from './Components/MovieCard.jsx';
import { getTrendingMovies, updateSearchCount } from './appwrite.js';


// API configuration
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  // Debounce the search term for 500ms to prevent excessive API calls
  // This will update the debouncedSearchTerm after 500ms of inactivity

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm])



  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query ?
        `${API_BASE_URL}/search/movie?query=${encodeURI(query)} `
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('Failed to fetch movies. Please try again later.');
      }
      const data = await response.json();
      //console.log('Fetched movies:', data);

      if (!data.results || data.total_results === 0) {
        setErrorMessage(data.Error || 'No movies found. Please try a different search term.');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

    }
    catch (error) {
      console.log('Error fetching movies:', error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    }
    finally {
      setIsLoading(false);
    }

  }

  const loadTrendingMovies = async () => {

    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);

    }
    catch (error) {
      console.error(`Error fetching trending movies: ${error}`);

    }
  }
  useEffect(() => {

    fetchMovies(debouncedSearchTerm);

  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);


  return (
    <>
      <main>
        <div className='pattern'>
          <div className='Wrapper'>
            <header>
              <img src="./hero.png" alt="hero image" />
              <h1>
                Find Your <span className='text-gradient'>Movie</span> Without Any Hassle
              </h1>
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </header>
            {trendingMovies.length > 0 && (
              <section className='trending'>
                <h2 >Trending Movies</h2>
                <ul className="hide-scrollbar">
                  {trendingMovies.map((movie, index) => (
                    <li key={movie.$id}>
                      <p className="fancy-text">{index + 1}</p>
                      <img src={movie.poster_url} alt={movie.title} />

                    </li>
                  ))}
                </ul>

              </section>
            )}
            <section className='all-movies'>
              <h2>All Movies</h2>
              {isLoading ?
                (
                  <Spinner />

                )
                : errorMessage ?
                  (<p className='error-message'>{errorMessage}</p>)

                  : (
                    <ul>
                      {movieList.map((movie) => (

                        <MovieCard key={movie.id} movie={movie} />
                      ))}
                    </ul>

                  )}

            </section>
            <footer className="footer">
              <p>&copy; {new Date().getFullYear()} Movie Explorer. All rights reserved.</p>
            </footer>

          </div>
        </div>
      </main>
    </>
  )
}

export default App
