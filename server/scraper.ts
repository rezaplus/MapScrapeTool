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
    
    // Extract business links and basic data
    const businessLinks = await page.evaluate((maxResults) => {
      const businesses: any[] = [];
      const elements = document.querySelectorAll('div[role="feed"] > div > div > a');
      
      const extractedElements = Array.from(elements).slice(0, maxResults);
      
      extractedElements.forEach((element, index) => {
        try {
          const aria = element.getAttribute('aria-label') || '';
          const href = element.getAttribute('href') || '';
          
          // Extract name
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
          
          // Extract address
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
            href,
            index,
          });
        } catch (err) {
          console.error('Error extracting business:', err);
        }
      });
      
      return businesses;
    }, query.maxResults);
    
    // Click into each business to get detailed information
    const detailedResults: BusinessResult[] = [];
    
    for (let i = 0; i < businessLinks.length; i++) {
      const business = businessLinks[i];
      
      try {
        console.log(`Extracting details for business ${i + 1}/${businessLinks.length}: ${business.name}`);
        
        // Click on the business listing
        const feedSelector = 'div[role="feed"] > div > div > a';
        await page.evaluate((index: number, selector: string) => {
          const elements = document.querySelectorAll(selector);
          const element = elements[index] as HTMLElement;
          if (element) {
            element.click();
          }
        }, i, feedSelector);
        
        // Wait for details panel to load
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Extract detailed information
        const details = await page.evaluate(() => {
          let phone = null;
          let email = null;
          let website = null;
          
          // Try to find phone number
          const phoneButtons = Array.from(document.querySelectorAll('button[data-item-id*="phone"]'));
          if (phoneButtons.length > 0) {
            const phoneButton = phoneButtons[0] as HTMLElement;
            const phoneText = phoneButton.getAttribute('aria-label') || phoneButton.textContent || '';
            const phoneMatch = phoneText.match(/[\d\s\-\(\)]+/);
            if (phoneMatch) {
              phone = phoneMatch[0].trim();
            }
          }
          
          // Look for phone in other places
          if (!phone) {
            const allButtons = Array.from(document.querySelectorAll('button'));
            for (const button of allButtons) {
              const text = button.getAttribute('aria-label') || button.textContent || '';
              if (text.toLowerCase().includes('phone') || text.match(/\(\d{3}\)/)) {
                const phoneMatch = text.match(/[\(\d][\d\s\-\(\)]{8,}/);
                if (phoneMatch) {
                  phone = phoneMatch[0].trim();
                  break;
                }
              }
            }
          }
          
          // Try to find website
          const websiteLinks = Array.from(document.querySelectorAll('a[data-item-id*="authority"]'));
          if (websiteLinks.length > 0) {
            const websiteLink = websiteLinks[0] as HTMLAnchorElement;
            website = websiteLink.href;
          }
          
          // Look for email addresses in the page
          const bodyText = document.body.innerText;
          const emailMatch = bodyText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
          if (emailMatch) {
            email = emailMatch[0];
          }
          
          return { phone, email, website };
        });
        
        detailedResults.push({
          id: randomUUID(),
          name: business.name,
          address: business.address,
          rating: business.rating,
          reviewCount: business.reviewCount,
          category: business.category,
          phone: details.phone,
          email: details.email,
          website: details.website,
        });
        
      } catch (err) {
        console.error(`Error getting details for ${business.name}:`, err);
        // Add business with null details if we fail
        detailedResults.push({
          id: randomUUID(),
          name: business.name,
          address: business.address,
          rating: business.rating,
          reviewCount: business.reviewCount,
          category: business.category,
          phone: null,
          email: null,
          website: null,
        });
      }
    }
    
    await browser.close();
    
    console.log(`Successfully scraped ${detailedResults.length} businesses with details`);
    return detailedResults;
    
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
