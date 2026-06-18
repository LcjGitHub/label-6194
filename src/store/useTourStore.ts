import { create } from 'zustand';
import tourRoutes from '../mock/tour-routes.json';
import calligraphyChars from '../mock/calligraphy-chars.json';
import type { TourRoute, CalligraphyChar } from '../types';

const routesData = tourRoutes as TourRoute[];
const charMapData = (calligraphyChars as CalligraphyChar[]).reduce<Record<string, CalligraphyChar>>(
  (acc, char) => {
    acc[char.id] = char;
    return acc;
  },
  {}
);

interface TourStore {
  routes: TourRoute[];
  charMap: Record<string, CalligraphyChar>;
  getRouteById: (id: string) => TourRoute | undefined;
  getCharById: (id: string) => CalligraphyChar | undefined;
}

export const useTourStore = create<TourStore>(() => ({
  routes: routesData,
  charMap: charMapData,
  getRouteById: (id) => routesData.find((r) => r.id === id),
  getCharById: (id) => charMapData[id],
}));
