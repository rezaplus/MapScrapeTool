import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { SearchInterface } from "@/components/search-interface";
import { ResultsTable } from "@/components/results-table";
import { SearchHistory } from "@/components/search-history";
import { HowItWorks } from "@/components/how-it-works";
import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { SearchQuery, BusinessResult, SearchHistoryItem, ScrapingResponse } from "@shared/schema";

export default function Home() {
  const [results, setResults] = useState<BusinessResult[]>([]);
  const { toast } = useToast();
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: historyData = [] } = useQuery<SearchHistoryItem[]>({
    queryKey: ["/api/history"],
  });

  const scrapeMutation = useMutation({
    mutationFn: async (query: SearchQuery) => {
      const response = await apiRequest("POST", "/api/scrape", query);
      return await response.json() as ScrapingResponse;
    },
    onSuccess: (data) => {
      setResults(data.results);
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
      
      toast({
        title: "Search complete",
        description: `Found ${data.results.length} businesses`,
      });

      setTimeout(() => {
        const resultsSection = document.getElementById("results");
        resultsSection?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    onError: (error) => {
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "There was an error processing your search. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = (query: SearchQuery) => {
    toast({
      title: "Search started",
      description: "Extracting business data from Google Maps...",
    });

    setTimeout(() => {
      searchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    scrapeMutation.mutate(query);
  };

  const handleExportAll = () => {
    if (results.length === 0) return;
    
    const csv = convertToCSV(results);
    downloadCSV(csv, `google-maps-export-${Date.now()}.csv`);
    
    toast({
      title: "Export successful",
      description: `Exported ${results.length} results to CSV`,
    });
  };

  const handleExportSingle = (result: BusinessResult) => {
    const csv = convertToCSV([result]);
    downloadCSV(csv, `${result.name.replace(/[^a-z0-9]/gi, '-')}.csv`);
    
    toast({
      title: "Export successful",
      description: "Business data exported to CSV",
    });
  };

  const handleRerunSearch = (item: SearchHistoryItem) => {
    handleSearch({
      location: item.location,
      businessType: item.businessType,
      maxResults: 20,
    });
  };

  const handleClearHistory = async () => {
    try {
      await apiRequest("DELETE", "/api/history");
      await queryClient.invalidateQueries({ queryKey: ["/api/history"] });
      
      toast({
        title: "History cleared",
        description: "Your search history has been cleared",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear history",
        variant: "destructive",
      });
    }
  };

  const scrollToSearch = () => {
    const searchSection = document.getElementById("search");
    searchSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection onScrollToSearch={scrollToSearch} />
        <div ref={searchRef}>
          <SearchInterface onSearch={handleSearch} isSearching={scrapeMutation.isPending} />
        </div>
        <ResultsTable
          results={results}
          isLoading={scrapeMutation.isPending}
          onExportAll={handleExportAll}
          onExportSingle={handleExportSingle}
        />
        <SearchHistory
          history={historyData}
          onRerun={handleRerunSearch}
          onClear={handleClearHistory}
        />
        <HowItWorks />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}

function convertToCSV(data: BusinessResult[]): string {
  const headers = ["Name", "Address", "Rating", "Review Count", "Phone", "Email", "Website", "Category"];
  const rows = data.map((item) => [
    item.name,
    item.address,
    item.rating?.toString() || "",
    item.reviewCount?.toString() || "",
    item.phone || "",
    item.email || "",
    item.website || "",
    item.category || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  return csvContent;
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
