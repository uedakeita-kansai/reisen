import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "./ui/label";
import { useAppStore } from "@/store/useAppStore";

export function StationSearch() {
  const [open, setOpen] = useState(false);
  
  const stations = useAppStore((state) => state.stations);
  const departureStation = useAppStore((state) => state.departureStation);
  // ◀︎◀︎【修正点】actionsを通さず、直接setDepartureStationを取得
  const setDepartureStation = useAppStore((state) => state.setDepartureStation);

  return (
    <div className="space-y-3">
      <Label htmlFor="station" className="text-lg">出発駅</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between text-base">
            {departureStation ? departureStation.name : "駅を選択..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0">
          <Command>
            <CommandInput placeholder="駅を検索..." />
            <CommandList>
              <CommandEmpty>駅が見つかりません。</CommandEmpty>
              <CommandGroup>
                {stations.map((station) => (
                  <CommandItem
                    key={station.id}
                    value={station.name}
                    onSelect={() => {
                      setDepartureStation(station);
                      setOpen(false);
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", departureStation?.name === station.name ? "opacity-100" : "opacity-0")} />
                    {station.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}