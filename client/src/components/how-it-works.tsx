import { Search, Database, Download } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Enter Search Criteria",
    description: "Specify the location and type of businesses you want to find.",
    number: "01",
  },
  {
    icon: Database,
    title: "We Extract the Data",
    description: "Our scraper collects business information from Google Maps instantly.",
    number: "02",
  },
  {
    icon: Download,
    title: "Export to CSV",
    description: "Download your results in CSV format for easy analysis and use.",
    number: "03",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to extract business data from Google Maps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="text-center space-y-4">
                    <div className="relative inline-flex">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-10 w-10 text-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {step.number}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-border" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
