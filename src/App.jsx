import { useState, useEffect } from 'react'


import './App.css'
import Search from './Components/Search.jsx'
import Spinner from './Components/Spinner.jsx';
import MovieCard from './Components/MovieCard.jsx';


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
  const [isLoading, setIsLoading] = useState(false);


  const fetchMovies = async (searchTerm) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('Failed to fetch movies. Please try again later.');
      }
      const data = await response.json();
      console.log('Fetched movies:', data);

      if (data.Response === "False" || data.total_results === 0) {
        setErrorMessage(data.Error || 'No movies found. Please try a different search term.');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);

    }
    catch (error) {
      console.log('Error fetching movies:', error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    }
    finally {
      setIsLoading(false);
    }

  }
  useEffect(() => {

    fetchMovies();

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

            <section className='all-movies'>
              <h2 className='mt-[40px]'>All Movies</h2>
              {isLoading ?
                (
                  <Spinner />
                )
                 : errorMessage ?
                  (<p className='text-red-500'>{errorMessage}</p>)
                   
                  : (
                    <ul>
                      {movieList.map((movie) => (
                        
                        <MovieCard key={movie.id} movie={movie}/>
                      ))}
                    </ul>

                  )}

            </section>

          </div>
        </div>
      </main>
    </>
  )
}

export default App
