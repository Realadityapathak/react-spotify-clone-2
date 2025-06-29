import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, Search, Home, Music, User, Plus, ChevronDown, Shuffle, Repeat } from 'lucide-react';

const SpotifyClone = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [activeView, setActiveView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [likedTracks, setLikedTracks] = useState(new Set());
  const [playlists, setPlaylists] = useState([
    { id: 1, name: 'My Favorites', tracks: [], cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' },
    { id: 2, name: 'Chill Vibes', tracks: [], cover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=300&fit=crop' }
  ]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: no repeat, 1: repeat all, 2: repeat one
  const audioRef = useRef(null);

  // Sample music data
  const musicData = [
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      duration: "3:20",
      genre: "pop",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
      id: 2,
      title: "Shape of You",
      artist: "Ed Sheeran",
      album: "÷ (Divide)",
      duration: "3:53",
      genre: "pop",
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
      id: 3,
      title: "Good 4 U",
      artist: "Olivia Rodrigo",
      album: "SOUR",
      duration: "2:58",
      genre: "rock",
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
      id: 4,
      title: "Levitating",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      duration: "3:23",
      genre: "dance",
      cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
      id: 5,
      title: "Stay",
      artist: "The Kid LAROI & Justin Bieber",
      album: "Stay",
      duration: "2:21",
      genre: "hip-hop",
      cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
      id: 6,
      title: "Heat Waves",
      artist: "Glass Animals",
      album: "Dreamland",
      duration: "3:58",
      genre: "indie",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    }
  ];

  const genres = ['all', 'pop', 'rock', 'hip-hop', 'dance', 'indie', 'jazz', 'classical'];

  const albums = [
    { id: 1, name: "After Hours", artist: "The Weeknd", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop" },
    { id: 2, name: "÷ (Divide)", artist: "Ed Sheeran", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop" },
    { id: 3, name: "SOUR", artist: "Olivia Rodrigo", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop" },
    { id: 4, name: "Future Nostalgia", artist: "Dua Lipa", cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop" }
  ];

  // Filter music based on search and genre
  const filteredMusic = musicData.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.album.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleLike = (trackId) => {
    const newLikedTracks = new Set(likedTracks);
    if (newLikedTracks.has(trackId)) {
      newLikedTracks.delete(trackId);
    } else {
      newLikedTracks.add(trackId);
    }
    setLikedTracks(newLikedTracks);
  };

  const createPlaylist = () => {
    const name = prompt('Enter playlist name:');
    if (name) {
      const newPlaylist = {
        id: Date.now(),
        name,
        tracks: [],
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
      };
      setPlaylists([...playlists, newPlaylist]);
    }
  };

  const nextTrack = () => {
    const currentIndex = musicData.findIndex(track => track.id === currentTrack?.id);
    if (currentIndex < musicData.length - 1) {
      setCurrentTrack(musicData[currentIndex + 1]);
    } else if (repeatMode === 1) {
      setCurrentTrack(musicData[0]);
    }
  };

  const previousTrack = () => {
    const currentIndex = musicData.findIndex(track => track.id === currentTrack?.id);
    if (currentIndex > 0) {
      setCurrentTrack(musicData[currentIndex - 1]);
    } else if (repeatMode === 1) {
      setCurrentTrack(musicData[musicData.length - 1]);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const Sidebar = () => (
    <div className="w-64 bg-black text-white p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-8 text-green-400">Spotify 2.0</h1>
      
      <nav className="space-y-4 mb-8">
        <div 
          className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${activeView === 'home' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          onClick={() => setActiveView('home')}
        >
          <Home size={20} />
          <span>Home</span>
        </div>
        <div 
          className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${activeView === 'search' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          onClick={() => setActiveView('search')}
        >
          <Search size={20} />
          <span>Search</span>
        </div>
        <div 
          className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${activeView === 'library' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          onClick={() => setActiveView('library')}
        >
          <Music size={20} />
          <span>Your Library</span>
        </div>
      </nav>

      <div className="border-t border-gray-800 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Playlists</h3>
          <Plus size={20} className="cursor-pointer hover:text-green-400" onClick={createPlaylist} />
        </div>
        <div className="space-y-2">
          {playlists.map(playlist => (
            <div key={playlist.id} className="p-2 rounded cursor-pointer hover:bg-gray-800 transition-colors">
              {playlist.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TrackRow = ({ track, index }) => (
    <div 
      className="grid grid-cols-12 gap-4 p-3 rounded hover:bg-gray-800 transition-colors cursor-pointer group"
      onClick={() => playTrack(track)}
    >
      <div className="col-span-1 flex items-center justify-center">
        {currentTrack?.id === track.id && isPlaying ? (
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-green-400 animate-pulse"></div>
              <div className="w-1 h-4 bg-green-400 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-4 bg-green-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        ) : (
          <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
        )}
        <Play size={16} className="hidden group-hover:block text-white" />
      </div>
      <div className="col-span-6 flex items-center space-x-3">
        <img src={track.cover} alt={track.title} className="w-10 h-10 rounded" />
        <div>
          <p className="font-medium text-white">{track.title}</p>
          <p className="text-gray-400 text-sm">{track.artist}</p>
        </div>
      </div>
      <div className="col-span-3 flex items-center">
        <span className="text-gray-400">{track.album}</span>
      </div>
      <div className="col-span-1 flex items-center justify-center">
        <Heart 
          size={16} 
          className={`cursor-pointer transition-colors ${likedTracks.has(track.id) ? 'text-green-400 fill-current' : 'text-gray-400 hover:text-white'}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(track.id);
          }}
        />
      </div>
      <div className="col-span-1 flex items-center justify-end">
        <span className="text-gray-400">{track.duration}</span>
      </div>
    </div>
  );

  const MainContent = () => {
    if (activeView === 'search') {
      return (
        <div className="flex-1 bg-gradient-to-b from-gray-900 to-black text-white overflow-y-auto">
          <div className="p-8">
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="What do you want to listen to?"
                className="w-full bg-white text-black pl-12 pr-4 py-3 rounded-full text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Browse by Genre</h2>
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <button
                    key={genre}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedGenre === genre 
                        ? 'bg-green-400 text-black' 
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedGenre(genre)}
                  >
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filteredMusic.map((track, index) => (
                <TrackRow key={track.id} track={track} index={index} />
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 bg-gradient-to-b from-gray-900 to-black text-white overflow-y-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">Good evening</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
            <div className="grid grid-cols-3 gap-6">
              {musicData.slice(0, 6).map(track => (
                <div 
                  key={track.id}
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group"
                  onClick={() => playTrack(track)}
                >
                  <div className="relative mb-4">
                    <img src={track.cover} alt={track.title} className="w-full aspect-square object-cover rounded-md" />
                    <button className="absolute bottom-2 right-2 bg-green-400 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                      <Play size={20} fill="currentColor" />
                    </button>
                  </div>
                  <h3 className="font-bold mb-1">{track.title}</h3>
                  <p className="text-gray-400 text-sm">{track.artist}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Popular Albums</h2>
            <div className="grid grid-cols-4 gap-6">
              {albums.map(album => (
                <div key={album.id} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                  <img src={album.cover} alt={album.name} className="w-full aspect-square object-cover rounded-md mb-4" />
                  <h3 className="font-bold mb-1">{album.name}</h3>
                  <p className="text-gray-400 text-sm">{album.artist}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">All Songs</h2>
            <div className="space-y-2">
              {musicData.map((track, index) => (
                <TrackRow key={track.id} track={track} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Player = () => {
    if (!currentTrack) return null;

    return (
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <img src={currentTrack.cover} alt={currentTrack.title} className="w-14 h-14 rounded" />
            <div className="min-w-0">
              <p className="text-white font-medium truncate">{currentTrack.title}</p>
              <p className="text-gray-400 text-sm truncate">{currentTrack.artist}</p>
            </div>
            <Heart 
              size={20} 
              className={`cursor-pointer transition-colors ml-4 ${likedTracks.has(currentTrack.id) ? 'text-green-400 fill-current' : 'text-gray-400 hover:text-white'}`}
              onClick={() => toggleLike(currentTrack.id)}
            />
          </div>

          <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
            <div className="flex items-center space-x-4">
              <Shuffle 
                size={20} 
                className={`cursor-pointer transition-colors ${isShuffled ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setIsShuffled(!isShuffled)}
              />
              <SkipBack size={20} className="text-gray-400 hover:text-white cursor-pointer" onClick={previousTrack} />
              <button 
                className="bg-white text-black p-2 rounded-full hover:scale-105 transition-transform"
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </button>
              <SkipForward size={20} className="text-gray-400 hover:text-white cursor-pointer" onClick={nextTrack} />
              <Repeat 
                size={20} 
                className={`cursor-pointer transition-colors ${repeatMode > 0 ? 'text-green-400' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setRepeatMode((repeatMode + 1) % 3)}
              />
            </div>
            <div className="flex items-center space-x-2 w-full">
              <span className="text-xs text-gray-400">0:00</span>
              <div className="flex-1 bg-gray-600 rounded-full h-1">
                <div className="bg-white h-1 rounded-full w-1/3"></div>
              </div>
              <span className="text-xs text-gray-400">{currentTrack.duration}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-1 justify-end">
            <Volume2 size={20} className="text-gray-400" />
            <div className="w-24 bg-gray-600 rounded-full h-1">
              <div className="bg-white h-1 rounded-full" style={{ width: `${volume * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
      <Player />
    </div>
  );
};

export default SpotifyClone;