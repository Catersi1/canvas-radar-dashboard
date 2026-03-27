# CanvasRadar

**Professional property data and inspection platform for insurance, real estate, and government sectors.**

CanvasRadar is a full-stack application designed to streamline the property inspection and data enrichment process. It provides a centralized hub for surveyors to submit property data, customers to view their property portfolios, and administrators to manage the entire workflow.

---

## 🚀 Key Features

### 1. Multi-Role Portals
- **Admin Portal:** Full oversight of all surveys, properties, and users. Admins can approve surveys, trigger data enrichment, and view high-level analytics.
- **Customer Portal:** Tailored view for property owners or insurance companies to track the status of their property inspections and view enriched data.
- **Surveyor Portal:** Dedicated interface for field agents to submit property surveys, upload photos, and track their earnings.

### 2. AI-Powered Data Discovery & Enrichment
- **Property Discovery:** Scrape property data from the internet and Google Maps using Gemini AI to discover new leads and properties for inspection.
- **Gemini Integration:** Uses the Gemini 3 Flash model to automatically find detailed property information (sqft, year built, last sale price, etc.) and nearby amenities (grocery stores, schools, highways).
- **Automated Photo Search:** Automatically fetches property photos using Google Maps Street View or web search to verify property conditions.

### 3. Real-Time Dashboard & Analytics
- **Executive Summary:** High-level metrics including total surveys, earnings, completion rates, and daily activity.
- **Property Density Heatmap:** Visual representation of survey distribution across different regions.
- **Trends & Insights:** Charts showing survey volume over time and property condition distributions (e.g., roof condition).

### 4. Efficient Workflow Management
- **Survey Review:** Admins can review submitted surveys, check for validation flags, and approve them for final reporting.
- **Data Persistence:** Integrated with Supabase for real-time data storage, with a robust mock data fallback for development.
- **Caching System:** Implements a sophisticated localStorage caching layer for API results to reduce costs and improve performance.

---

## 🛠️ How It Works

### Architecture
CanvasRadar is built as a modern React application using **Vite** for fast development and building. It follows a modular structure:
- **Frontend:** React with TypeScript, styled with **Tailwind CSS**.
- **State Management:** React hooks (`useState`, `useEffect`, `useMemo`) for local state and Supabase for persistent data.
- **Icons:** Powered by **Lucide React**.

### Services
- **Property Discovery (`src/services/propertyDiscovery.ts`):** Scrapes property data from the internet and Google Maps using Gemini AI to discover new leads.
- **Property Enrichment (`src/services/propertyEnrichment.ts`):** Handles communication with the Gemini API to gather property details. It includes a 24-hour caching mechanism.
- **Photo Search (`src/services/propertySearch.ts`):** Searches for property images using Google Maps or web search, with a 7-day caching mechanism.

### Data Flow
1. **Submission:** A surveyor submits a property survey through the Surveyor Portal.
2. **Enrichment:** The system automatically triggers a background process to enrich the property with public record data and photos.
3. **Review:** Admins see the new survey in their dashboard, review the enriched data and photos, and approve the inspection.
4. **Reporting:** Once approved, the data is available for customers to view and export as CSV reports.

### Environment Configuration
The app requires the following environment variables (set in AI Studio Secrets):
- `GEMINI_API_KEY`: Required for AI data enrichment and photo search.
- `GOOGLE_MAPS_PLATFORM_KEY`: (Optional) For high-quality Street View images.
- `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`: For persistent database storage.

---

## 📦 Getting Started

1. **Install Dependencies:** `npm install`
2. **Set Environment Variables:** Copy `.env.example` to `.env` and add your keys.
3. **Run Development Server:** `npm run dev`
4. **Build for Production:** `npm run build`

---

© 2026 CanvasRadar. All rights reserved.
