import { useState } from "react";
import { MapPin, Search, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { SearchQuery } from "@shared/schema";

interface SearchInterfaceProps {
  onSearch: (query: SearchQuery) => void;
  isSearching: boolean;
}

const QUICK_SEARCHES = [
  { location: "New York, NY", type: "restaurants" },
  { location: "Los Angeles, CA", type: "hotels" },
  { location: "Chicago, IL", type: "coffee shops" },
  { location: "San Francisco, CA", type: "gyms" },
];

export function SearchInterface({ onSearch, isSearching }: SearchInterfaceProps) {
  const [location, setLocation] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [maxResults, setMaxResults] = useState([20]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && businessType) {
      onSearch({
        location,
        businessType,
        maxResults: maxResults[0],
      });
    }
  };

  const handleQuickSearch = (search: { location: string; type: string }) => {
    setLocation(search.location);
    setBusinessType(search.type);
    onSearch({
      location: search.location,
      businessType: search.type,
      maxResults: maxResults[0],
    });
  };

  return (
    <section id="search" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-semibold mb-3">
              Start Your Search
            </h2>
            <p className="text-muted-foreground text-lg">
              Enter a location and business type to extract data
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">
                      Location
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="Enter location (e.g., New York, NY)"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-10"
                        disabled={isSearching}
                        data-testid="input-location"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType" className="text-sm font-medium">
                      Business Type
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="businessType"
                        placeholder="Business type (e.g., restaurants, hotels)"
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="pl-10"
                        disabled={isSearching}
                        data-testid="input-business-type"
                      />
                    </div>
                  </div>
                </div>

                <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                  <CollapsibleTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      data-testid="button-advanced-toggle"
                    >
                      <Settings2 className="h-4 w-4" />
                      Advanced Options
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4">
                    <div className="space-y-4 p-4 rounded-md border bg-muted/30">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">
                            Max Results
                          </Label>
                          <span className="text-sm text-muted-foreground">
                            {maxResults[0]}
                          </span>
                        </div>
                        <Slider
                          value={maxResults}
                          onValueChange={setMaxResults}
                          min={5}
                          max={100}
                          step={5}
                          disabled={isSearching}
                          data-testid="slider-max-results"
                        />
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSearching || !location || !businessType}
                  data-testid="button-search-submit"
                >
                  <Search className="mr-2 h-5 w-5" />
                  {isSearching ? "Searching..." : "Search Now"}
                </Button>
              </form>

              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-3">
                  Quick searches:
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SEARCHES.map((search, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover-elevate"
                      onClick={() => !isSearching && handleQuickSearch(search)}
                      data-testid={`badge-quick-search-${index}`}
                    >
                      {search.type} in {search.location}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
