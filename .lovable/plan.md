

# Admin CMS + Host Property Management Dashboards

Build out the Admin and Host dashboards into proper management consoles. All data persisted to `localStorage` via a new mock content store, structured so it can swap to a Supabase/API backend later without UI changes.

---

## Part 1 — Admin CMS (manages all public-facing content)

Add new sidebar sections to `DashboardLayout.tsx` (admin role) and create matching pages under `src/pages/admin/`:

### 1. `AdminCMSHero.tsx` — Hero & Landing
- Edit hero headline, subheadline, CTA labels, hero image URLs (carousel slides add/remove/reorder)
- Toggle visibility of homepage sections (Featured, Impact, Partners, Blogs, Testimonials, etc.)
- Live preview note: changes reflect after save (reads from store on Index render)

### 2. `AdminCMSPartners.tsx` — Partners Manager
- CRUD for partner categories (Payment, Travel, Events, Community)
- Add/edit/delete partner entries (name, logo URL, website, category)
- Drag-to-reorder within each category

### 3. `AdminCMSFestivals.tsx` — Festivals & Cultural Calendar
- CRUD for festival entries (name, month, region, description, image)
- Toggle "featured" flag

### 4. `AdminCMSExperiences.tsx` — Local Experiences
- CRUD for marketplace experiences (title, host, price, duration, category, image)

### 5. `AdminCMSBlogs.tsx` — Blog Manager
- List, create, edit, delete blog posts (title, slug, excerpt, body, cover image, tags, author, publish toggle)
- Markdown-style textarea for body

### 6. `AdminCMSTestimonials.tsx` — Testimonials
- CRUD testimonials (guest name, location, quote, rating, avatar)

### 7. `AdminCMSPages.tsx` — Static Pages
- Edit copy for About, Contact, Privacy, Terms, Cancellation, Safety (rich textarea per page)

### 8. `AdminCMSNavigation.tsx` — Menu & Footer
- Manage navbar links (label, URL, order, visible toggle)
- Manage footer columns and link groups
- Edit footer tagline + social URLs

### 9. `AdminCMSTheme.tsx` — Theme & Branding
- Color picker for primary, accent, background tokens (writes to CSS variables)
- Logo upload (URL field), site name, favicon URL
- Toggle dark mode default

### 10. `AdminCMSMedia.tsx` — Media Library (mock)
- Grid of uploaded image URLs with copy-to-clipboard
- Add new image by URL, delete, search/filter

### Enhance existing admin pages:
- `AdminBookings.tsx` — add filters (status, date range, host), bulk actions, export CSV button
- `AdminUsers.tsx` — role change, suspend/activate, search & filter, view profile drawer
- `AdminAnalytics.tsx` — add more chart variants (revenue trend, top provinces, conversion funnel) — mock data
- `AdminSettings.tsx` — add tabs: General / Email Templates / Payments / SEO / Integrations

---

## Part 2 — Host Dashboard (manages their own property)

Replace the minimal `HostDashboard.tsx` with a full host console using `DashboardLayout.tsx`. Add sidebar entries (host role) and create:

### 1. `HostDashboard.tsx` — Overview
- Stats cards: total bookings, revenue this month, occupancy %, avg rating
- Upcoming check-ins list, recent reviews, quick actions

### 2. `HostListings.tsx` — My Properties
- List of host's homestays with edit/delete/view
- "Add new property" CTA

### 3. `HostListingEditor.tsx` — Add/Edit Property
- Tabs: Basics (name, location, description, type) / Photos (URL list, drag-reorder, set cover) / Amenities (checklist) / Pricing (per night, weekend uplift, cleaning fee) / Rules (check-in time, house rules) / Experience Badges (toggle eco, female-led, etc.)
- Save draft / publish toggle

### 4. `HostCalendar.tsx` — Availability Manager
- Month grid; click date(s) to block/unblock
- Set custom pricing per date range
- Sync indicator (mock)

### 5. `HostBookings.tsx` — Reservations
- Tabs: Upcoming / Current / Past / Cancelled
- Approve/decline pending requests, message guest, view booking detail drawer

### 6. `HostExperiences.tsx` — My Experiences (add-ons)
- CRUD experiences host offers (cooking class, village walk, etc.)
- Price, duration, max guests, image

### 7. `HostInbox.tsx` — Guest Messages
- Conversation list + thread view (mock chat UI), mark read/unread

### 8. `HostReviews.tsx` — Reviews & Ratings
- All reviews on host's properties, reply form, rating breakdown chart

### 9. `HostEarnings.tsx` — Earnings & Payouts
- Revenue chart (last 12 months), payout history table, pending balance, payout method (mock)

### 10. `HostProfile.tsx` — Host Profile
- Edit name, bio, photo, video intro URL, languages, family members (Meet the Community editor)
- Verification badges status

### 11. `HostSettings.tsx` — Settings
- Notification preferences, calendar sync, payout preferences, account

---

## Part 3 — Shared Infrastructure

### New files
- `src/contexts/CMSContext.tsx` — central provider exposing all CMS content + `update*` setters; persists to `localStorage` under `nh-cms-v1`. All public components (Hero, Partners, Festivals, etc.) read from this instead of hardcoded arrays.
- `src/data/cmsDefaults.ts` — seed content moved from existing hardcoded arrays so first load looks identical.
- `src/contexts/HostDataContext.tsx` — host-scoped store: properties, bookings, messages, reviews, earnings, experiences, blocked dates. Persists per-host in `localStorage`.
- `src/components/admin/EditableTable.tsx`, `ImageUrlInput.tsx`, `RichTextarea.tsx`, `ColorPicker.tsx` — reusable admin form primitives
- `src/components/host/StatCard.tsx`, `BookingRow.tsx`, `CalendarGrid.tsx` — host UI primitives

### Modifications
- `src/App.tsx` — wrap app in `CMSProvider` and `HostDataProvider`; register all new admin & host routes
- `src/components/DashboardLayout.tsx` — extend sidebar nav arrays for admin and host roles with all new sections, grouped (Content / Commerce / Settings for admin; Listings / Reservations / Finance / Profile for host)
- `src/components/HeroSection.tsx`, `PartnersSection.tsx`, `FeaturedHomestays.tsx`, `BlogSection.tsx`, `TestimonialsSection.tsx`, `Footer.tsx`, `Navbar.tsx`, `pages/Festivals.tsx` — read from `useCMS()` instead of hardcoded data so admin edits actually appear on the public site

### Conventions
- Every CRUD form uses shadcn `Dialog` + `Form` with toast confirmations
- Every list uses search + filter + empty state
- All write operations are optimistic with `localStorage` persistence
- Data shapes mirror eventual REST resources (id, createdAt, updatedAt) for easy API swap

---

## Scope Note

This is a **large change** touching 30+ new files and 10+ existing files. Will be implemented in one pass but expect a longer build. No backend, no breaking changes to public site appearance — defaults seed identical content.

