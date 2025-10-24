import puppeteer from "puppeteer";
import type { BusinessResult, SearchQuery } from "@shared/schema";
import { randomUUID } from "crypto";
import { execSync } from "child_process";

function findChromiumPath(): string {
  try {
    const path = execSync('which chromium || which chromium-browser', { encoding: 'utf8' }).trim();
    if (path) return path;
  } catch {
    // Try to find in nix store
    try {
      const nixPath = execSync('find /nix/store -name "chromium" -type f 2>/dev/null | grep -E "bin/chromium$" | head -1', { encoding: 'utf8' }).trim();
      if (nixPath) return nixPath;
    } catch {}
  }
  // Fallback to puppeteer's bundled chromium
  return '';
}

export async function scrapeGoogleMaps(query: SearchQuery): Promise<BusinessResult[]> {
  let browser;
  
  try {
    const chromiumPath = findChromiumPath();
    const launchOptions: any = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-extensions'
      ]
    };
    
    if (chromiumPath) {
      launchOptions.executablePath = chromiumPath;
      console.log('Using system Chromium at:', chromiumPath);
    } else {
      console.log('Using Puppeteer bundled Chromium');
    }
    
    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Construct search URL
    const searchQuery = `${query.businessType} in ${query.location}`;
    const encodedQuery = encodeURIComponent(searchQuery);
    const url = `https://www.google.com/maps/search/${encodedQuery}`;
    
    console.log(`Scraping Google Maps for: ${searchQuery}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for results to load
    await page.waitForSelector('div[role="feed"]', { timeout: 10000 }).catch(() => {
      console.log('Results feed not found, continuing anyway...');
    });
    
    // Give page time to load dynamically
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Scroll to load more results
    await scrollFeed(page, query.maxResults);
    
    // Extract business data
    const results = await page.evaluate((maxResults) => {
      const businesses: any[] = [];
      const elements = document.querySelectorAll('div[role="feed"] > div > div > a');
      
      const extractedElements = Array.from(elements).slice(0, maxResults);
      
      extractedElements.forEach((element, index) => {
        try {
          const aria = element.getAttribute('aria-label') || '';
          
          // Extract name (first part before rating or address)
          let name = '';
          const nameMatch = aria.match(/^([^·]+)/);
          if (nameMatch) {
            name = nameMatch[1].trim();
          }
          
          // Extract rating
          let rating = null;
          let reviewCount = null;
          const ratingMatch = aria.match(/([\d.]+)\s*stars?/i);
          if (ratingMatch) {
            rating = parseFloat(ratingMatch[1]);
          }
          
          const reviewMatch = aria.match(/([\d,]+)\s*reviews?/i);
          if (reviewMatch) {
            reviewCount = parseInt(reviewMatch[1].replace(/,/g, ''));
          }
          
          // Try to get more details from the parent container
          const parent = element.closest('div[role="article"]') || element.parentElement;
          
          // Extract category
          let category = null;
          const categoryElem = parent?.querySelector('[class*="fontBodyMedium"]');
          if (categoryElem && categoryElem.textContent) {
            category = categoryElem.textContent.trim();
          }
          
          // Extract address (usually after ·)
          let address = '';
          const addressMatch = aria.match(/·\s*([^·]+?)(?:\s*·|$)/);
          if (addressMatch) {
            address = addressMatch[1].trim();
          }
          
          if (!name) {
            name = `Business ${index + 1}`;
          }
          
          if (!address) {
            address = 'Address not available';
          }
          
          businesses.push({
            name,
            address,
            rating,
            reviewCount,
            category,
            phone: null,
            website: null,
          });
        } catch (err) {
          console.error('Error extracting business:', err);
        }
      });
      
      return businesses;
    }, query.maxResults);
    
    await browser.close();
    
    // Add IDs to results
    const resultsWithIds: BusinessResult[] = results.map(result => ({
      ...result,
      id: randomUUID(),
    }));
    
    console.log(`Successfully scraped ${resultsWithIds.length} businesses`);
    return resultsWithIds;
    
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    console.error('Scraping error:', error);
    throw new Error(`Failed to scrape Google Maps: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function scrollFeed(page: any, targetCount: number) {
  const feedSelector = 'div[role="feed"]';
  
  try {
    for (let i = 0; i < 5; i++) {
      await page.evaluate((selector: string) => {
        const feed = document.querySelector(selector);
        if (feed) {
          feed.scrollTo(0, feed.scrollHeight);
        }
      }, feedSelector);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if we have enough results
      const count = await page.evaluate((selector: string) => {
        const elements = document.querySelectorAll(`${selector} > div > div > a`);
        return elements.length;
      }, feedSelector);
      
      if (count >= targetCount) {
        break;
      }
    }
  } catch (error) {
    console.log('Error scrolling feed:', error);
  }
}
