import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection({ onScrollToSearch }: { onScrollToSearch: () => void }) {
  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />
      
      {/* Content */}
      <div className="relative z-10 container px-4 text-center">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Extract Business Data from
              <span className="text-primary"> Google Maps</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Find and export business information instantly. Get names, addresses, ratings, phone numbers, and more in seconds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="text-base px-8"
              onClick={onScrollToSearch}
              data-testid="button-hero-cta"
            >
              <Search className="mr-2 h-5 w-5" />
              Start Scraping Now
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>No credit card required</span>
            </div>
            <span>•</span>
            <span>Export to CSV</span>
            <span>•</span>
            <span>Unlimited searches</span>
          </div>
        </div>
      </div>
    </section>
  );
}
