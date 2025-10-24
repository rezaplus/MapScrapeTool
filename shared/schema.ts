import { z } from "zod";

// Business result from Google Maps scraping
export const businessResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  rating: z.number().nullable(),
  reviewCount: z.number().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  website: z.string().nullable(),
  category: z.string().nullable(),
});

export type BusinessResult = z.infer<typeof businessResultSchema>;

// Search query
export const searchQuerySchema = z.object({
  location: z.string().min(1, "Location is required"),
  businessType: z.string().min(1, "Business type is required"),
  maxResults: z.number().min(1).max(100).default(20),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

// Search history item
export const searchHistoryItemSchema = z.object({
  id: z.string(),
  query: z.string(),
  location: z.string(),
  businessType: z.string(),
  resultCount: z.number(),
  timestamp: z.string(),
});

export type SearchHistoryItem = z.infer<typeof searchHistoryItemSchema>;

// Scraping response
export const scrapingResponseSchema = z.object({
  results: z.array(businessResultSchema),
  query: searchQuerySchema,
  timestamp: z.string(),
});

export type ScrapingResponse = z.infer<typeof scrapingResponseSchema>;

// Export types for storage
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = { id: string; username: string; password: string };

const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});
