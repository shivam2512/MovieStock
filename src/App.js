import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddMovieForm, setShowAddMovieForm] = useState(false);
  const [newMovieObj, setNewMovieObj] = useState({
    title: '',
    openingText: '',
    releaseDate: '',
  });

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://swapi.dev/api/films/');
      if (!response.ok) {
        throw new Error('Something went wrong ....Retrying');
      }

      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });

      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const handleShowAddMovieForm = () => {
    setShowAddMovieForm(true);
  };

  const handleHideAddMovieForm = () => {
    setShowAddMovieForm(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewMovieObj({
      ...newMovieObj,
      [name]: value,
    });
  };

  const handleAddMovie = () => {
    const updatedMovies = [...movies, newMovieObj];
    setMovies(updatedMovies);

    // Here, you can do something with the new movie object, like adding it to a list of movies.
    // For now, we'll just log it.
    console.log(newMovieObj);
    setNewMovieObj({
      title: '',
      openingText: '',
      releaseDate: '',
    });
    setShowAddMovieForm(false);
  };

  const content = useMemo(() => {
    if (isLoading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>{error}</p>;
    }

    if (movies.length === 0) {
      return <p>Found no movies.</p>;
    }

    return <MoviesList movies={movies} />;
  }, [isLoading, error, movies]);

  return (
    <React.Fragment>
      <section>
        <button onClick={handleShowAddMovieForm}>Add Movies</button>
      </section>
      {showAddMovieForm && (
        <section className="add-movie-form">
          <div className="form-header">
            <h2>Add Movie</h2>
            <button onClick={handleHideAddMovieForm} className="close-button">
              Close
            </button>
          </div>
          <form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newMovieObj.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="openingText">Opening Text</label>
              <textarea
                id="openingText"
                name="openingText"
                value={newMovieObj.openingText}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="releaseDate">Release Date</label>
              <input
                type="date"
                id="releaseDate"
                name="releaseDate"
                value={newMovieObj.releaseDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <button type="button" onClick={handleAddMovie}>
                Add Movie
              </button>
            </div>
          </form>
        </section>
      )}
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
