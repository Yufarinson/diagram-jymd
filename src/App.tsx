import { useDiagramStore } from './entities/store/diagramStore';
import { HomeScreen } from './pages/home/ui/HomeScreen';
import { EditorPage } from './pages/editor/ui/EditorPage';
import { ReactFlowProvider } from '@xyflow/react';

function App() {
  const { appMode } = useDiagramStore();

  return (
    <ReactFlowProvider>
      <div className="w-full h-screen">
        {appMode === 'home' ? <HomeScreen /> : <EditorPage />}
      </div>
    </ReactFlowProvider>
  );
}

export default App;
