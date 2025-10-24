# Design Guidelines: Google Maps Scraper Tool

## Design Approach

**Selected Approach**: Modern Productivity Tool Design (inspired by Linear, Notion, Airtable)

**Justification**: This data-focused scraping tool requires clarity, efficiency, and a professional aesthetic that builds trust. The design balances clean data presentation with approachable usability, ensuring users can quickly input searches, review results, and export data.

**Key Design Principles**:
- Information clarity: Data should be scannable and well-organized
- Efficient workflows: Minimize steps between search and export
- Professional credibility: Clean, polished interface inspires confidence
- Responsive data display: Adapts gracefully across devices

---

## Core Design Elements

### Typography

**Font Families**: 
- Primary: Inter (headings, UI elements, data)
- Monospace: JetBrains Mono (technical data, URLs)

**Hierarchy**:
- Hero Headline: text-5xl md:text-6xl, font-bold, tracking-tight
- Section Headers: text-3xl md:text-4xl, font-semibold
- Card Titles: text-xl, font-semibold
- Body Text: text-base, font-normal
- Small Labels: text-sm, font-medium
- Table Headers: text-sm, font-semibold, uppercase, tracking-wide
- Table Data: text-sm, font-normal

### Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, and 16
- Micro spacing (buttons, inputs): p-2, gap-2
- Component spacing: p-4, gap-4, mb-6
- Section spacing: py-12 md:py-16, gap-8
- Major sections: py-16 md:py-24, mb-12

**Container Strategy**:
- Full-width sections: w-full with max-w-7xl mx-auto px-4
- Content areas: max-w-6xl mx-auto
- Forms and tables: max-w-5xl mx-auto

---

## Component Library

### Hero Section
- Height: min-h-[500px] md:min-h-[600px]
- Background: Hero image showing data visualization, maps interface, or abstract business network graphics
- Overlay: Dark gradient overlay (gradient-to-b from-transparent to-background)
- Content: Centered layout with headline, subheadline, and primary CTA
- Headline communicates: "Extract Business Data from Google Maps"
- Subheadline: Brief explanation of tool capabilities
- Primary CTA: "Start Scraping" with blurred background (backdrop-blur-md)
- Trust indicator below CTA: "No credit card required • Export to CSV • Unlimited searches"

### Search Interface Section
**Layout**: Two-column grid on desktop (grid-cols-1 md:grid-cols-2), single column mobile
**Components**:
- Location Input: Large text input with icon prefix, placeholder "Enter location (e.g., New York, NY)"
- Business Type Input: Text input with icon, placeholder "Business type (e.g., restaurants, hotels)"
- Search Button: Full-width on mobile, prominent with icon
- Advanced options toggle (collapsed by default): Max results slider, radius selector
- Quick search suggestions: Chips/pills below inputs with common searches ("Restaurants in Manhattan", "Hotels in LA")

### Results Display Section
**Table Design**:
- Full-width responsive table with horizontal scroll on mobile
- Sticky header row
- Columns: Business Name, Address, Rating (with star visualization), Phone, Website (truncated with tooltip)
- Row hover state for interactivity
- Alternating row background for readability
- Action column: Individual export button per row
- Pagination controls at bottom: Previous/Next with page numbers

**Empty State**: 
- Centered illustration placeholder
- Message: "No results yet. Start a search above."
- Quick start tips

**Loading State**:
- Skeleton loaders for table rows
- Progress indicator showing scraping status

### Export Controls
**Position**: Sticky top bar above results table
**Elements**:
- "Export All to CSV" primary button
- "Select rows" checkbox mode toggle
- Results count indicator: "Showing 47 results"
- Filter dropdown for quick data refinement

### Search History Sidebar/Section
**Layout**: Right sidebar on desktop (w-72), collapsible panel on mobile
**Content**:
- Recent searches list (max 10)
- Each item shows: query text, timestamp, result count
- Click to re-run search
- Clear history button at bottom

### Features Showcase Section
**Grid Layout**: Three-column grid (grid-cols-1 md:grid-cols-3)
**Cards Include**:
1. Fast Scraping: Icon + title + description
2. CSV Export: Icon + title + description  
3. Unlimited Searches: Icon + title + description
4. No Setup Required: Icon + title + description
5. Accurate Data: Icon + title + description
6. Search History: Icon + title + description

Each card: p-6, rounded-lg border, hover elevation effect

### Footer
**Multi-column layout** (grid-cols-1 md:grid-cols-4):
- Column 1: Product info and tagline
- Column 2: Quick links (How It Works, FAQ, Pricing)
- Column 3: Legal (Privacy, Terms, Contact)
- Column 4: Newsletter signup form with input + button
- Bottom row: Copyright, social links, trust badges

---

## Images

**Hero Image**: Full-bleed background image depicting either:
- Abstract data visualization with network nodes and connections
- Stylized Google Maps interface mockup with pins and location markers
- Modern office workspace with analytics dashboard on screen
- Clean gradient mesh with subtle map-inspired geometric patterns

**Features Section Icons**: Use Heroicons or Material Icons via CDN for feature cards

**Empty State Illustration**: Placeholder comment for custom illustration showing map with magnifying glass

---

## Navigation

**Header**: Sticky navigation (sticky top-0)
- Logo left-aligned
- Navigation links: How It Works, Pricing, FAQ (hidden on mobile, hamburger menu)
- CTA button: "Start Scraping" (always visible)
- Simple, clean design with backdrop-blur on scroll

---

## Responsive Behavior

**Mobile Priorities**:
- Stack all multi-column grids to single column
- Make search inputs full-width
- Table converts to card-based layout for better mobile viewing
- Collapsible search history (drawer from bottom)
- Fixed bottom CTA bar with "Export CSV" always accessible

**Tablet Adjustments**:
- Two-column grids where appropriate
- Maintain table view with horizontal scroll
- Show abbreviated navigation

---

## Key Interactions

**Form Validation**: Real-time validation with inline error messages below inputs
**Search Execution**: Loading state with progress indicator, disable form during scrape
**Table Interactions**: Row selection via checkboxes, bulk actions when selected
**Export Flow**: Immediate CSV download, success toast notification
**History Items**: Hover preview of search parameters, click to re-execute

---

This design creates a professional, trustworthy scraping tool that balances powerful functionality with approachable usability. The clean aesthetic and efficient workflows ensure users can extract business data quickly while maintaining confidence in the tool's capabilities.