import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { StationSearch } from "./StationSearch";
import { useAppStore } from "@/store/useAppStore";

export function ControlPanel() {
  const price = useAppStore((state) => state.price);
  const departureStation = useAppStore((state) => state.departureStation);
  const isSearching = useAppStore((state) => state.isSearching);
  const setPrice = useAppStore((state) => state.setPrice);
  const search = useAppStore((state) => state.search);

  return (
    <div className="w-96 space-y-8 bg-white p-8 shadow-2xl">
      <h1 className="text-3xl font-bold">REISEN</h1>
      <p>駅と金額を指定して金額内で旅行できる範囲がわかります。</p>
      <StationSearch />
      <div className="space-y-3">
        <Label htmlFor="price" className="text-lg">上限金額（片道）</Label>
        <Slider
          id="price"
          value={[price]}
          max={500}
          step={10}
          onValueChange={(value) => setPrice(value[0])}
        />
        <p className="text-right text-xl font-semibold text-gray-700">{price}円</p>
      </div>
      <Button
        className="w-full py-6 text-lg"
        onClick={search}
        disabled={!departureStation || isSearching}
      >
        {isSearching ? '検索中...' : 'この範囲で行ける駅を探す'}
      </Button>
    </div>
  );
}