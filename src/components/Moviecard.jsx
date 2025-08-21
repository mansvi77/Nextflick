import React from 'react';

const MovieCard = ({
  movie: { title, vote_average, poster_path, release_date, original_language },
  fallbackPoster = '/no-movie.png',
}) => {
  return (
    <div className="movie-card bg-[#20283d] rounded-lg shadow-md flex flex-col items-center p-4 text-white">
      <img
        src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : fallbackPoster}
        alt={title}
        className="w-32 h-48 object-cover rounded mb-2"
      />
      <div className="mt-4 text-center">
        <h3 className="font-semibold">{title}</h3>
        <div className="content mt-1">
          <div className="rating flex items-center justify-center">
            <img src="public/star.svg" alt="star-icon" className="w-4 h-4 mr-1" />
            <p>{vote_average !== undefined ? vote_average.toFixed(1) : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
