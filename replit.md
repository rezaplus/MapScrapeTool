# Google Maps Scraper Tool

## Overview

A web application that enables users to extract business data from Google Maps through automated scraping. Users can search for specific business types in any location and receive comprehensive business information including names, addresses, ratings, reviews, phone numbers, and websites. Results can be instantly exported to CSV format for further analysis.

The application is built as a modern, productivity-focused tool emphasizing clean data presentation, efficient workflows, and professional aesthetics inspired by Linear, Notion, and Airtable design principles.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**Routing**: Wouter for lightweight client-side routing

**State Management**: 
- TanStack Query (React Query) for server state management
- Local component state with React hooks
- No global state management beyond query caching

**UI Component System**:
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- CSS variables for theming (light/dark mode support)
- Component aliases configured for clean imports (@/components, @/lib, etc.)

**Design System**:
- Typography: Inter for UI elements, JetBrains Mono for technical data
- Spacing system based on Tailwind units (2, 4, 6, 8, 12, 16)
- Custom color scheme using HSL format for theme flexibility
- Consistent border radius and shadow conventions

### Backend Architecture

**Runtime**: Node.js with Express server

**Build Process**:
- Development: tsx for TypeScript execution
- Production: esbuild for server bundling, Vite for client bundling

**API Structure**:
- RESTful API with `/api` prefix
- Single scraping endpoint: POST `/api/scrape`
- Request/response validation using Zod schemas
- Centralized error handling with appropriate HTTP status codes

**Scraping Engine**:
- Puppeteer for headless browser automation
- Configurable result limits (1-100 businesses per search)
- Automatic scrolling to load dynamic content
- DOM parsing to extract business information from Google Maps UI

**Data Flow**:
1. Client submits search query (location, business type, max results)
2. Server validates request against Zod schema
3. Puppeteer launches headless browser and navigates to Google Maps
4. Script scrolls feed and extracts business data from DOM
5. Results validated and returned to client
6. Search added to in-memory history (last 10 searches retained)

### Data Storage Solutions

**Current Implementation**: In-memory storage using JavaScript Maps
- Search history stored temporarily (maximum 10 recent searches)
- No persistent database currently configured
- Storage abstraction layer (IStorage interface) designed for future database integration

**Database Configuration**:
- Drizzle ORM configured with PostgreSQL dialect
- Connection string expected via DATABASE_URL environment variable
- Schema defined in shared/schema.ts
- Migration output directory: ./migrations
- Note: While Drizzle is configured, actual database usage is not implemented in current codebase

**Data Schemas** (Zod validation):
- SearchQuery: location, businessType, maxResults
- BusinessResult: id, name, address, rating, reviewCount, phone, website, category
- SearchHistoryItem: id, query, location, businessType, resultCount, timestamp
- ScrapingResponse: results array, original query, timestamp

### Authentication and Authorization

No authentication or authorization mechanisms are currently implemented. The application is designed as a free, unrestricted tool with no user accounts or access controls.

### External Dependencies

**Web Scraping**:
- Puppeteer: Headless browser automation for Google Maps data extraction
- Launch arguments configured for containerized environments (no-sandbox, disable-setuid-sandbox)

**Database (Configured but Not Active)**:
- @neondatabase/serverless: Neon serverless PostgreSQL driver
- Drizzle ORM: Type-safe database toolkit
- connect-pg-simple: PostgreSQL session store (dependency present but sessions not implemented)

**Frontend Libraries**:
- Radix UI: Unstyled, accessible component primitives for all interactive elements
- TanStack Query: Server state management with caching, refetching strategies disabled (staleTime: Infinity)
- Tailwind CSS: Utility-first CSS framework
- class-variance-authority: Type-safe variant management for components
- date-fns: Date manipulation and formatting

**UI Components** (shadcn/ui):
Complete set of pre-built components including buttons, forms, cards, dialogs, tables, toasts, and more - all using Radix UI primitives with Tailwind styling

**Development Tools**:
- TypeScript: Type safety across full stack
- Vite plugins: Runtime error overlay, Replit-specific tooling (cartographer, dev banner)
- ESM module format throughout

**Key Integration Points**:
- Google Maps website (scraped via Puppeteer, no official API used)
- CSV generation handled client-side (implied by export functionality)
- No external API authentication or rate limiting considerations