import { useEffect } from 'react';
import Map from './components/Map';
import { ControlPanel } from './components/ControlPanel';
import { useAppStore } from './store/useAppStore';

function App() {
  const initializeStations = useAppStore((state) => state.initializeStations);

  useEffect(() => {
    initializeStations();
  }, [initializeStations]);

  return (
    <div className="flex h-screen">
      <ControlPanel />
      <div className="flex-1">
        <Map />
      </div>
    </div>
  );
}

export default App;