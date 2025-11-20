import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Trash2, 
  Shuffle, 
  HelpCircle, 
  Cpu,
  Save,
  FolderOpen,
  CheckCircle2
} from 'lucide-react';
import { 
  generateEmptyGrid, 
  generateRandomGrid, 
  computeNextGeneration, 
  COLS 
} from './utils/gameLogic';
import IntroModal from './components/IntroModal';

const App: React.FC = () => {
  // State
  const [grid, setGrid] = useState<number[][]>(() => generateEmptyGrid());
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(100); // ms per generation
  const [generation, setGeneration] = useState(0);
  const [isIntroOpen, setIsIntroOpen] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Refs
  const runningRef = useRef(running);
  runningRef.current = running;

  // Handlers
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => computeNextGeneration(g));
    setGeneration((gen) => gen + 1);

    setTimeout(runSimulation, speed);
  }, [speed]);

  // Effect to handle start/stop
  useEffect(() => {
    if (running) {
      runningRef.current = true;
      runSimulation();
    } else {
      runningRef.current = false;
    }
  }, [running, runSimulation]);

  // Notification helper
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleCell = (i: number, j: number) => {
    const newGrid = [...grid];
    newGrid[i] = [...newGrid[i]];
    newGrid[i][j] = grid[i][j] ? 0 : 1;
    setGrid(newGrid);
  };

  const handleRandomize = () => {
    setGrid(generateRandomGrid());
    setGeneration(0);
  };

  const handleClear = () => {
    setGrid(generateEmptyGrid());
    setRunning(false);
    setGeneration(0);
  };

  const handleSave = () => {
    try {
      localStorage.setItem('gol_saved_state', JSON.stringify(grid));
      showNotification("Stav byl úspěšně uložen!");
    } catch (e) {
      showNotification("Chyba při ukládání.");
    }
  };

  const handleLoad = () => {
    const saved = localStorage.getItem('gol_saved_state');
    if (saved) {
      try {
        const parsedGrid = JSON.parse(saved);
        // Basic validation to ensure grid matches dimensions roughly or exists
        if (Array.isArray(parsedGrid) && parsedGrid.length > 0) {
          setGrid(parsedGrid);
          setGeneration(0); // Reset generation count on load
          setRunning(false);
          showNotification("Stav byl načten!");
        } else {
          showNotification("Uložená data jsou poškozená.");
        }
      } catch (e) {
        showNotification("Chyba při načítání dat.");
      }
    } else {
      showNotification("Žádný uložený stav nebyl nalezen.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans selection:bg-emerald-500/30">
      
      {/* Modal */}
      <IntroModal isOpen={isIntroOpen} onClose={() => setIsIntroOpen(false)} />

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-lg text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <Cpu size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Simulátor Hry života</h1>
              <p className="text-xs text-slate-400">Generace: <span className="text-emerald-400 font-mono text-sm">{generation}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
             <button 
              onClick={() => setIsIntroOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            >
              <HelpCircle size={16} />
              <span className="hidden sm:inline">Nápověda</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        
        <div className="flex flex-col lg:flex-row gap-8 items-start w-full max-w-6xl">
          
          {/* Left Panel: Controls */}
          <div className="w-full lg:w-1/4 flex flex-col gap-6 order-2 lg:order-1">
            
            {/* Playback Controls */}
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Ovládání</h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setRunning(!running)}
                  className={`col-span-2 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${
                    running 
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/20' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                  }`}
                >
                  {running ? <><Pause size={20} /> Zastavit</> : <><Play size={20} /> Spustit</>}
                </button>

                <button onClick={handleRandomize} className="flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors">
                  <Shuffle size={16} /> Náhodně
                </button>
                
                <button onClick={handleClear} className="flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors">
                  <Trash2 size={16} /> Vyčistit
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-400 flex justify-between">
                  <span>Rychlost simulace</span>
                  <span>{speed}ms</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="20"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            {/* Storage Section */}
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl relative overflow-hidden">
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Save size={16} />
                Uložení stavu
              </h3>
              
              <p className="text-xs text-slate-400 mb-4">
                Uložte si aktuální rozložení buněk do prohlížeče a vraťte se k němu později.
              </p>

              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={handleSave}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Save size={16} /> Uložit aktuální stav
                </button>

                <button 
                  onClick={handleLoad}
                  className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
                >
                  <FolderOpen size={16} /> Načíst uložený stav
                </button>
              </div>

              {notification && (
                <div className="mt-3 bg-emerald-900/30 border border-emerald-500/30 text-emerald-200 text-xs p-2 rounded flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                   <CheckCircle2 size={14} /> {notification}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: The Grid */}
          <div className="w-full lg:w-3/4 flex justify-center order-1 lg:order-2">
            <div 
              className="grid gap-[1px] bg-slate-800 border border-slate-700 shadow-2xl p-1 rounded-lg select-none"
              style={{
                gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
              }}
            >
              {grid.map((row, i) =>
                row.map((col, j) => (
                  <div
                    key={`${i}-${j}`}
                    onClick={() => toggleCell(i, j)}
                    // Using inline styles for dimensions to keep it responsive but square
                    className={`
                      w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-6 lg:h-6 
                      transition-all duration-300 ease-in-out cursor-pointer
                      ${grid[i][j] 
                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] scale-100 rounded-sm' 
                        : 'bg-slate-900 hover:bg-slate-800 scale-95 rounded-sm'
                      }
                    `}
                  />
                ))
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;