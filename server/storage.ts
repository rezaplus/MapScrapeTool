import { type SearchHistoryItem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  addSearchHistory(item: Omit<SearchHistoryItem, "id">): Promise<SearchHistoryItem>;
  getSearchHistory(): Promise<SearchHistoryItem[]>;
  clearSearchHistory(): Promise<void>;
}

export class MemStorage implements IStorage {
  private searchHistory: Map<string, SearchHistoryItem>;

  constructor() {
    this.searchHistory = new Map();
  }

  async addSearchHistory(item: Omit<SearchHistoryItem, "id">): Promise<SearchHistoryItem> {
    const id = randomUUID();
    const historyItem: SearchHistoryItem = { ...item, id };
    this.searchHistory.set(id, historyItem);
    
    // Keep only last 10 items
    const items = Array.from(this.searchHistory.values());
    if (items.length > 10) {
      const oldestId = items.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )[0].id;
      this.searchHistory.delete(oldestId);
    }
    
    return historyItem;
  }

  async getSearchHistory(): Promise<SearchHistoryItem[]> {
    return Array.from(this.searchHistory.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async clearSearchHistory(): Promise<void> {
    this.searchHistory.clear();
  }
}

export const storage = new MemStorage();
