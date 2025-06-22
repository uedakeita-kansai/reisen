import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

export interface Station {
  id: string;
  name: string;
  position: { lat: number; lng: number };
}

interface AppState {
  stations: Station[];
  departureStation: Station | null;
  price: number;
  reachableStationIds: Set<string> | null;
  isSearching: boolean;
  
  initializeStations: () => Promise<void>;
  setDepartureStation: (station: Station | null) => void;
  setPrice: (price: number) => void;
  search: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  stations: [],
  departureStation: null,
  price: 300,
  reachableStationIds: null,
  isSearching: false,

  initializeStations: async () => {
    const { data, error } = await supabase
      .from('stations')
      .select('id, name, lat, lng')
      .order('id', { ascending: true });

    if (error) {
      console.error('駅データの取得に失敗:', error);
      return;
    }
    const formattedStations = data.map(s => ({
      id: s.id,
      name: s.name,
      position: { lat: s.lat, lng: s.lng }
    }));
    set({ stations: formattedStations });
  },

  setDepartureStation: (station) => set({ departureStation: station, reachableStationIds: null }),
  
  setPrice: (price) => set({ price: price }),
  
  search: async () => {
    const { departureStation, price } = get();
    if (!departureStation) return;

    set({ isSearching: true, reachableStationIds: null });

    try {
      const { data, error } = await supabase.functions.invoke('get-reachable-stations', {
        body: { 
          departureStationId: departureStation.id,
          maxPrice: price
        },
      });

      if (error) throw error;
      
      const resultSet = new Set(data as string[]);
      set({ reachableStationIds: resultSet });
    } catch (error) {
      console.error('検索の実行に失敗:', error);
    } finally {
      set({ isSearching: false });
    }
  },
}));