import { Zap, Download, Search, Clock, CheckCircle2, History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: Zap,
    title: "Fast Scraping",
    description: "Extract business data from Google Maps in seconds with our optimized scraping engine.",
  },
  {
    icon: Download,
    title: "CSV Export",
    description: "Download all your scraped data instantly in CSV format, ready for analysis.",
  },
  {
    icon: Search,
    title: "Unlimited Searches",
    description: "No limits on searches or exports. Extract as much data as you need, whenever you need it.",
  },
  {
    icon: Clock,
    title: "No Setup Required",
    description: "Start scraping immediately. No registration, no API keys, no complicated setup process.",
  },
  {
    icon: CheckCircle2,
    title: "Accurate Data",
    description: "Get reliable business information including names, addresses, ratings, phone numbers, and websites.",
  },
  {
    icon: History,
    title: "Search History",
    description: "Keep track of your recent searches and quickly re-run them with a single click.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you extract and export business data efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
