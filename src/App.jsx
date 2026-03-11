import { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, ExternalLink, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeGame = () => {
    setSelectedGame(null);
    setIsFullscreen(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={closeGame}
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Gamepad2 className="text-neutral-950 w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">Portal Games</h1>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-neutral-500 hidden md:block uppercase tracking-widest">v1.0.4</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {selectedGame ? (
            <motion.div
              key="player"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <button 
                  onClick={closeGame}
                  className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Back to Library
                </button>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Toggle Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <a 
                    href={selectedGame.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Open in New Tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className={`relative bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'aspect-video'}`}>
                {isFullscreen && (
                  <button 
                    onClick={() => setIsFullscreen(false)}
                    className="absolute top-4 right-4 z-50 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/80 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  allow="fullscreen; autoplay; encrypted-media"
                  title={selectedGame.title}
                />
              </div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold">{selectedGame.title}</h2>
                  <p className="text-neutral-400 mt-2 max-w-2xl">{selectedGame.description}</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-medium uppercase tracking-wider">
                    Unblocked
                  </span>
                  <span className="px-3 py-1 bg-white/5 text-neutral-400 border border-white/10 rounded-full text-xs font-medium uppercase tracking-wider">
                    Web Game
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-12">
                <h2 className="text-4xl font-black tracking-tighter mb-2">DISCOVER GAMES</h2>
                <p className="text-neutral-500">Hand-picked collection of browser-based entertainment.</p>
              </div>

              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredGames.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleGameSelect(game)}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 group-hover:border-emerald-500/50 transition-all duration-300">
                        <img 
                          src={game.thumbnail} 
                          alt={game.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-lg font-bold group-hover:text-emerald-400 transition-colors">{game.title}</h3>
                          <p className="text-xs text-neutral-400 line-clamp-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {game.description}
                          </p>
                        </div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/20">
                            <Gamepad2 className="text-neutral-950 w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-900 rounded-full mb-4">
                    <Search className="w-8 h-8 text-neutral-700" />
                  </div>
                  <h3 className="text-xl font-bold">No games found</h3>
                  <p className="text-neutral-500 mt-2">Try searching for something else.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Gamepad2 className="w-5 h-5" />
            <span className="text-sm font-bold tracking-tight">Portal Games</span>
          </div>
          <div className="flex gap-8 text-sm text-neutral-500">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-xs text-neutral-600 font-mono">
            &copy; 2026 Portal Games. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
