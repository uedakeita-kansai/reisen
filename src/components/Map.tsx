import { GoogleMap, useJsApiLoader, InfoWindowF } from '@react-google-maps/api';
import { useAppStore } from '@/store/useAppStore';
import { useState, useCallback } from 'react';
import { NativeAdvancedMarker } from './NativeAdvancedMarker';
import { getLineColor } from '@/lib/line-colors';

const containerStyle = { width: '100%', height: '100%' };
const center = { lat: 35.681236, lng: 139.767125 };
const MAP_ID = 'YOUR_MAP_ID_HERE'; // 以前設定したあなたのMap ID

function Map() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_Maps_API_KEY,
    libraries: ['marker'],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  
  const stations = useAppStore((state) => state.stations);
  const reachableStationIds = useAppStore((state) => state.reachableStationIds);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    mapInstance.setOptions({ gestureHandling: 'greedy' });
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);
  
  if (!isLoaded) return <div>Loading...</div>;

  const activeStation = stations.find(s => s.id === activeMarkerId);

  return (
    <GoogleMap 
      mapContainerStyle={containerStyle} 
      center={center} 
      zoom={12} 
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{ mapId: MAP_ID, gestureHandling: 'greedy' }}
      onClick={() => setActiveMarkerId(null)}
    >
      {map && stations.map((station) => {
        const isReachable = reachableStationIds?.has(station.id);
        
        // マーカーのスタイルを決定するロジック
        let markerOptions;
        if (isReachable) {
          // 行ける駅の場合
          const lineColor = getLineColor(station.id);
          markerOptions = {
            color: lineColor,
            borderColor: lineColor,
            scale: 1.0,
            opacity: 1.0,
          };
        } else {
          // 行けない駅の場合（ただし、一度も検索していない場合は通常表示）
          markerOptions = {
            color: '#808080', // 灰色
            borderColor: '#696969',
            scale: reachableStationIds ? 0.6 : 1.0,
            opacity: reachableStationIds ? 0.3 : 1.0,
          };
        }

        return (
          <NativeAdvancedMarker
            key={station.id}
            map={map}
            position={station.position}
            title={station.name}
            onClick={() => setActiveMarkerId(station.id)}
            // スタイルオプションを展開して渡す
            {...markerOptions}
          />
        );
      })}

      {/* 開くべき情報ウィンドウがあれば表示 */}
      {activeStation && (
        <InfoWindowF
          position={activeStation.position}
          onCloseClick={() => setActiveMarkerId(null)}
        >
          <div className="p-1 font-semibold">{activeStation.name}</div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}

export default Map;