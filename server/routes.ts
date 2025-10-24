import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { scrapeGoogleMaps } from "./scraper";
import { searchQuerySchema, scrapingResponseSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Scrape Google Maps
  app.post("/api/scrape", async (req, res) => {
    try {
      const query = searchQuerySchema.parse(req.body);
      
      console.log("Starting scrape with query:", query);
      const results = await scrapeGoogleMaps(query);
      
      // Add to search history
      await storage.addSearchHistory({
        query: `${query.businessType} in ${query.location}`,
        location: query.location,
        businessType: query.businessType,
        resultCount: results.length,
        timestamp: new Date().toISOString(),
      });
      
      const response = scrapingResponseSchema.parse({
        results,
        query,
        timestamp: new Date().toISOString(),
      });
      
      res.json(response);
    } catch (error) {
      console.error("Scraping error:", error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: "Invalid request", 
          details: error.errors 
        });
        return;
      }
      
      res.status(500).json({ 
        error: "Failed to scrape Google Maps",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get search history
  app.get("/api/history", async (req, res) => {
    try {
      const history = await storage.getSearchHistory();
      res.json(history);
    } catch (error) {
      console.error("Error fetching history:", error);
      res.status(500).json({ error: "Failed to fetch search history" });
    }
  });

  // Clear search history
  app.delete("/api/history", async (req, res) => {
    try {
      await storage.clearSearchHistory();
      res.json({ success: true });
    } catch (error) {
      console.error("Error clearing history:", error);
      res.status(500).json({ error: "Failed to clear search history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
