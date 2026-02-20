import { Play, Database, Upload, ArrowRight, FileJson } from 'lucide-react';
import { EXERCISES, getExerciseById } from './exercises';

interface HomeScreenProps {
  onSelectMode: (mode: 'conceptual' | 'relational') => void;
  onImport: () => void;
  onLoadTemplate: (nodes: any[], edges: any[], mode: 'conceptual' | 'relational') => void;
}

export function HomeScreen({ onSelectMode, onImport, onLoadTemplate }: HomeScreenProps) {
  const handleTemplateClick = (exerciseId: string) => {
    const exercise = getExerciseById(exerciseId);
    if (!exercise) return;
    
    // Auto-detect mode of the template
    const hasConceptualNodes = exercise.nodes.some((n: any) => ['entity', 'attribute', 'relationship'].includes(n.type));
    onLoadTemplate(exercise.nodes, exercise.edges, hasConceptualNodes ? 'conceptual' : 'relational');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden" 
         style={{ backgroundColor: '#020617' }}>
      
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="z-10 flex flex-col items-center max-w-5xl w-full">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 mb-6 text-center tracking-tight">
          Diagram.Jymd
        </h1>
        <p className="text-slate-400 text-lg md:text-xl text-center max-w-2xl mb-16 leading-relaxed">
          La plataforma profesional de modelado de datos. Diseña esquemas conceptuales y transfórmalos automáticamente en arquitecturas relacionales físicas listas para producción.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-12">
          
          {/* Card 1: Conceptual */}
          <button 
            onClick={() => onSelectMode('conceptual')}
            className="group relative flex flex-col items-start p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/20 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Play className="w-32 h-32 text-indigo-400 transform rotate-12" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
              <Play className="w-6 h-6" fill="currentColor" />
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-3">Modelo Conceptual</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 relative z-10 w-4/5">
              Utiliza la Notación de Chen. Dibuja Entidades, Atributos y Rombos, y deja que el motor matemático automatice las reglas de negocio.
            </p>
            <div className="mt-auto flex items-center text-indigo-400 font-semibold text-sm group-hover:gap-2 transition-all gap-1">
              Crear nuevo lienzo <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Card 2: Relational */}
          <button 
            onClick={() => onSelectMode('relational')}
            className="group relative flex flex-col items-start p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/20 text-left overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Database className="w-32 h-32 text-cyan-400 transform -rotate-12" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-3">Modelo Relacional (Físico)</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 relative z-10 w-4/5">
              Diseña directamente la base de datos SQL. Crea Tablas, define tipos de datos, Primary Keys y traza las llaves foráneas.
            </p>
            <div className="mt-auto flex items-center text-cyan-400 font-semibold text-sm group-hover:gap-2 transition-all gap-1">
              Crear nuevo esquema <ArrowRight className="w-4 h-4" />
            </div>
          </button>

        </div>

        {/* Import Zone */}
        <div className="w-full max-w-3xl flex flex-col items-center">
          <div className="flex items-center gap-4 w-full">
            <div className="h-px bg-slate-800 flex-1"></div>
            <span className="text-slate-500 text-sm font-medium uppercase tracking-widest">o continúa estructurando</span>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
            <button 
              onClick={onImport}
              className="px-8 py-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-slate-500 text-slate-300 flex items-center gap-3 transition-all hover:shadow-lg justify-center group"
            >
              <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              <span className="font-medium">Abrir archivo local (.jymd)</span>
            </button>

            <div className="relative group/dropdown">
              <button 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-slate-500 text-slate-300 flex items-center gap-3 transition-all hover:shadow-lg justify-center"
              >
                <FileJson className="w-5 h-5" />
                <span className="font-medium">Cargar Plantilla Destacada</span>
              </button>
              
              <div className="absolute bottom-full left-0 mb-2 w-full sm:w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-50 overflow-hidden">
                {EXERCISES.slice(1).map((ex) => (
                  <button 
                    key={ex.id}
                    onClick={() => handleTemplateClick(ex.id)}
                    className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-400 border-b border-slate-700/50 last:border-0 transition-colors"
                  >
                    {ex.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
      
      {/* Footer */}
      <div className="absolute bottom-6 text-slate-600 text-xs flex gap-6">
        <span>© {new Date().getFullYear()} Diagram.Jymd</span>
        <span>Local-First Security</span>
        <span>Version 2.0</span>
      </div>
    </div>
  );
}
