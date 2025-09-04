import { useState, useEffect } from 'react';
import { Play, Calendar, Clock, Globe, User, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { StreamingStorage, StreamingLink, MovieWithStreaming } from '../utils/streaming-storage';
import { getMoviesWithLinks } from '@/app/app/server-actions/streaming-links/get-movies-with-links;

export default function TVPage() {
  const [featuredMovie, setFeaturedMovie] = useState<any | null>(null);
  const [availableMovies, setAvailableMovies] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    (async () => {
      const movies = await getMoviesWithLinks();
      if (movies.length > 0) {
        setAvailableMovies(movies);
        setFeaturedMovie(movies[0]);
        setCurrentIndex(0);
      }
    })();
  }, []);
  
  // ... reste de ton code identique mais tu vires `mockMovies`
}


  const handleMovieSelect = (movie: MovieWithStreaming, index: number) => {
    setFeaturedMovie(movie);
    setCurrentIndex(index);
    StreamingStorage.setFeatured(movie.id);
  };

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : availableMovies.length - 1;
    handleMovieSelect(availableMovies[newIndex], newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < availableMovies.length - 1 ? currentIndex + 1 : 0;
    handleMovieSelect(availableMovies[newIndex], newIndex);
  };

  const handleWatchMovie = () => {
    if (featuredMovie?.streamingLink) {
      window.open(featuredMovie.streamingLink.url, '_blank');
    }
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  const getPlatformName = (platform: string) => {
    switch(platform) {
      case 'youtube': return 'YouTube';
      case 'internet_archive': return 'Internet Archive';
      case 'vod': return 'VOD';
      default: return 'Streaming';
    }
  };

  if (!featuredMovie || availableMovies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Aucun film disponible</h1>
          <p className="text-white/70">Ajoutez des liens de streaming depuis l'interface admin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Film principal en plein écran */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0">
          <img
            src={featuredMovie.image_url || '/api/placeholder/1920/1080'}
            alt={featuredMovie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80" />
        </div>

        {/* Contrôles de navigation */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Contenu principal */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-white">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Poster du film */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative group">
                <img
                  src={featuredMovie.image_url || '/api/placeholder/400/600'}
                  alt={featuredMovie.title}
                  className="w-80 h-auto rounded-lg shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            {/* Informations du film */}
            <div className="space-y-6">
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold mb-2 leading-tight">
                  {featuredMovie.title}
                </h1>
                {featuredMovie.original_title && featuredMovie.original_title !== featuredMovie.title && (
                  <p className="text-xl text-white/70 mb-4">{featuredMovie.original_title}</p>
                )}
              </div>

              {/* Métadonnées */}
              <div className="flex flex-wrap gap-6 text-white/80">
                {featuredMovie.release_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{featuredMovie.release_date}</span>
                  </div>
                )}
                
                {featuredMovie.runtime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{formatRuntime(featuredMovie.runtime)}</span>
                  </div>
                )}
                
                {featuredMovie.language && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    <span>{featuredMovie.language}</span>
                  </div>
                )}
                
                {featuredMovie.directors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span>{featuredMovie.directors[0].name}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {featuredMovie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {featuredMovie.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              {featuredMovie.description && (
                <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
                  {featuredMovie.description}
                </p>
              )}

              {/* Bouton de visionnage */}
              {featuredMovie.streamingLink && (
                <div className="pt-4">
                  <button
                    onClick={handleWatchMovie}
                    className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center gap-3"
                  >
                    <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span>Regarder sur {getPlatformName(featuredMovie.streamingLink.platform)}</span>
                    <ExternalLink className="w-5 h-5 opacity-70" />
                  </button>
                  
                  <p className="text-sm text-white/60 mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Disponible gratuitement
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Indicateur de position */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {availableMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => handleMovieSelect(availableMovies[index], index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white scale-110'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Grille des autres films disponibles */}
      {availableMovies.length > 1 && (
        <div className="bg-gradient-to-b from-black to-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white mb-8">Autres films disponibles</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {availableMovies
                .filter(movie => movie.id !== featuredMovie.id)
                .map((movie, index) => (
                  <div
                    key={movie.id}
                    onClick={() => {
                      const realIndex = availableMovies.findIndex(m => m.id === movie.id);
                      handleMovieSelect(movie, realIndex);
                    }}
                    className="group cursor-pointer transition-transform duration-300 hover:scale-105"
                  >
                    <div className="relative">
                      <img
                        src={movie.image_url || '/api/placeholder/200/300'}
                        alt={movie.title}
                        className="w-full h-auto rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
                      />
                      <div className