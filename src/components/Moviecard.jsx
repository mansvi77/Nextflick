import React from 'react';

const MovieCard = ({
  movie: { title, vote_average, poster_path, release_date, original_language },
  fallbackPoster,
}) => {
  return (
    <div className="movie-card bg-[#161b22] p-3 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : fallbackPoster
        }
        alt={title}
        className="rounded-lg w-full h-[280px] object-cover"
      />

      <div className="mt-4 text-white text-center">
        <h3 className="font-semibold text-lg truncate">{title}</h3>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <img src="star.svg" alt="Star Icon" className="w-4 h-4" />
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
          </div>
          <span>•</span>
          <p className="uppercase">{original_language}</p>
          <span>•</span>
          <p>{release_date ? release_date.split('-')[0] : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
