import React from 'react';
import { X, Play, MousePointer, Zap, Infinity } from 'lucide-react';

interface IntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IntroModal: React.FC<IntroModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Hlavička okna */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900">
          <h2 className="text-2xl font-bold text-emerald-400">Vítejte v Hře života</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Obsah */}
        <div className="p-6 overflow-y-auto text-slate-300 space-y-6">
          
          <section>
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Zap size={20} className="text-yellow-400" />
              O co se jedná?
            </h3>
            <p>
              Hra života (Game of Life) je celulární automat, který v roce 1970 vymyslel matematik John Conway. 
              Není to hra v tradičním smyslu – je to simulace, která se vyvíjí sama na základě počátečního stavu.
            </p>
          </section>

          <section className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-3">Pravidla přežití</h3>
            <ul className="space-y-2 list-disc list-inside">
              <li><span className="text-red-400 font-bold">Smrt osaměním:</span> Živá buňka s méně než 2 sousedy umírá.</li>
              <li><span className="text-red-400 font-bold">Smrt přelidněním:</span> Živá buňka s více než 3 sousedy umírá.</li>
              <li><span className="text-emerald-400 font-bold">Přežití:</span> Živá buňka s 2 nebo 3 sousedy žije dál.</li>
              <li><span className="text-blue-400 font-bold">Zrození:</span> Mrtvá buňka s přesně 3 sousedy ožívá.</li>
            </ul>
            
            <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-start gap-3">
              <div className="text-purple-400 mt-0.5"><Infinity size={20} /></div>
              <p className="text-sm text-slate-400">
                <span className="text-purple-400 font-bold">Svět je propojený dokola:</span> 
                Herní plocha nemá pevné okraje. To, co vyletí ven vpravo, přiletí zleva. 
                Stejně tak to funguje i nahoře a dole (tzv. toroidní geometrie).
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <MousePointer size={20} className="text-cyan-400" />
              Ovládání
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center"><span className="block w-2 h-2 bg-white rounded-full"></span></div>
                <span>Kliknutím na mřížku oživíte/zabijete buňky.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600/20 rounded text-emerald-400"><Play size={16} /></div>
                <span>Tlačítkem "Spustit" zahájíte evoluci.</span>
              </div>
            </div>
          </section>
        </div>

        {/* Patička */}
        <div className="p-6 border-t border-slate-700 bg-slate-900 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg shadow-emerald-900/20"
          >
            Rozumím, jdeme na to!
          </button>
        </div>

      </div>
    </div>
  );
};

export default IntroModal;