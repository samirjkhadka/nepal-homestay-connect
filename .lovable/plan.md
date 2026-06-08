# Nepal Homestays — Major Feature Upgrade Roadmap

A three-phase rollout covering Guest experience, Host operations, and Admin platform governance. All features are frontend-first with mock persistence, ready for backend swap later.

---

## Phase 1 — Guest Experience (Bookings, Payments, Loyalty)

### 1.1 End-to-End Booking Flow
- **Search** → **Homestay Detail** → **Select Dates** → **Guest Details** → **Payment** → **Confirmation**
- Date picker on homestay detail page with live availability (reads host blockedDates + customPricing)
- Guest count selector with per-homestay maxGuests validation
- Booking summary sidebar showing nightly breakdown, cleaning fee, service fee, total
- "Instant Book" vs "Request to Book" paths (based on host instantBook setting)
- Booking confirmation page with itinerary PDF download and add-to-calendar buttons
- Booking detail page for guests (reschedule, cancel with policy display, message host)

### 1.2 Guest Payments & Wallet
- Mock payment flow with Khalti / eSewa / Stripe selectors
- Guest "Wallet" / stored payment methods (card ending in, eSewa ID)
- Transaction history with refund status tracking
- Split payment: pay 50% now, 50% on arrival option configurable per property

### 1.3 Guest Dashboard Expansion
- Real booking lifecycle: upcoming → checked-in → completed → reviewed
- Trip timeline view (checklist: packing, directions, host contact, weather)
- Digital check-in QR code generated 24h before arrival
- Review prompt post-stay with photo upload capability
- Booking modification requests (date change, guest count change) with host approval flow

### 1.4 Guest Wishlist & Compare Improvements
- Share wishlist via link / WhatsApp
- Price drop alerts on wishlisted properties
- Side-by-side compare table (amenities, price, rating, host response rate)
- "Notify when available" for blocked date ranges

### 1.5 Loyalty & Rewards
- "Himalayan Hearts" points program: earn 5% of booking value as points
- Redeem points for discounts, free experiences, or donations to village projects
- Tier system: Traveler → Explorer → Mountaineer → Sherpa (perks like late checkout, priority support)
- Referral codes with reward tracking

### 1.6 Guest Safety & Trust
- Verified host badges, ID verification status visible
- Emergency contact sheet per booking with local police, hospital, embassy
- SOS panic button on booking detail (shares GPS + booking info to admin)
- Travel insurance upsell at checkout

---

## Phase 2 — Host Operations (Revenue, Automation, Analytics)

### 2.1 Dynamic Pricing & Yield Management
- Seasonal pricing rules (high season multiplier, festival rates)
- Length-of-stay discounts (weekly 10%, monthly 25%)
- Last-minute discount toggle (auto-reduce price within 7 days)
- Competitor price suggestion (mock benchmark data)
- Pricing calendar heatmap showing occupancy vs rate

### 2.2 Host Co-Host / Team Management
- Add co-hosts or family members with permission levels (view-only, manage calendar, full access)
- Activity log per property showing who changed what
- Team assignment for cleaning, maintenance tasks with due dates

### 2.3 Host Automation Rules
- Auto-decline bookings below minimum stay (configurable per property)
- Auto-message templates triggered by events: booking confirmed, check-in reminder (24h), checkout reminder, review request
- Buffer days between bookings (turnaround time setting)
- Sync blocked dates across multiple platforms (mock iCal import/export)

### 2.4 Host Analytics Deep Dive
- Occupancy rate graph by month
- Revenue per available room (RevPAR)
- Average daily rate (ADR) trends
- Booking source breakdown (direct, social, referral)
- Guest demographics (nationality, group size, length of stay)
- Review sentiment analysis (positive/negative keyword cloud)

### 2.5 Host Payout & Tax Tools
- Payout schedule configuration (weekly, biweekly, monthly)
- Payout method management (eSewa, Khalti, bank transfer)
- Earnings export (CSV/PDF) with tax-ready summaries
- Deduction transparency: service fees, cleaning fees, refund adjustments

### 2.6 Host Experience & Add-on Sales
- Create bookable experiences tied to listings (cooking class, guided trek)
- Upsell add-ons at guest checkout (airport pickup, extra meals, late checkout)
- Package bundling: "3-night stay + 2 experiences" combo pricing

---

## Phase 3 — Admin Platform Governance (Audit, Automation, Content)

### 3.1 Admin Audit Logs & Activity Trail
- Global activity feed: who did what, when, from which IP
- Filterable by: actor (admin/host/guest), action type, entity type, date range
- Immutable log entries with export to CSV
- Critical actions highlighted: payout approvals, policy changes, host status changes
- Admin action replay: view the before/after state of any edit

### 3.2 Host Onboarding & Verification Workflow
- Multi-step host application: basic info → property details → document upload → admin review
- Verification checklist: ID, property photos, safety inspection, tax registration
- Admin approval queue with approve/reject/ request-more-info actions
- Rejected host appeal flow with resubmission

### 3.3 Admin Content Moderation
- Review moderation queue: flag inappropriate reviews, host replies, photos
- Photo moderation for host uploads (blur detection, duplicate check)
- Blog/Experience content approval workflow before publish
- Reported content dashboard with resolve/ban actions

### 3.4 Admin Financial Controls
- Platform-wide transaction ledger (all payments, refunds, payouts)
- Commission configuration per host tier (standard 10%, superhost 8%)
- Promo code / coupon engine: percentage, fixed amount, expiry, usage limits
- Refund approval workflow with partial refund calculator

### 3.5 Admin Dispute Resolution Center
- Guest/Host dispute ticket system with priority levels
- Evidence upload (photos, messages, receipts)
- Admin decision log with refund/payout adjustments
- Dispute outcome analytics to identify problematic users

### 3.6 Admin Notification & Communication Hub
- Broadcast announcements to all hosts or all guests
- Scheduled email campaigns (newsletter, festival promotions)
- Push notification configuration (browser + mobile later)
- Message templates for common admin communications

### 3.7 Admin SEO & Marketing Controls
- Per-page meta title/description editor in CMS
- Structured data (JSON-LD) toggle for homestay listings
- Sitemap generation control
- UTM campaign link builder for partners
- Affiliate / referral tracking codes

### 3.8 Admin System Health
- Platform metrics dashboard: total bookings, revenue, active hosts, guest retention
- Host performance leaderboard (occupancy, rating, response time)
- Churn prediction alerts (hosts with declining bookings)
- Data export for external BI tools

---

## Phase 4 — Cross-Cutting Platform Features

### 4.1 Real-Time Notifications (WebSocket-ready architecture)
- Booking status updates to both guest and host
- New message alerts with unread badges
- Calendar conflict warnings
- Admin alerts: new host signups, disputes, flagged reviews

### 4.2 Multi-Language Booking Flow
- Complete Nepali (NE) localization for booking, payment, and dashboard
- Right-to-left (RTL) layout readiness for future Arabic support
- Currency display: NPR default, USD/EUR/INR switching

### 4.3 Accessibility & Compliance
- WCAG 2.1 AA compliance audit pass
- Cookie consent banner with granular controls
- GDPR-style data export / delete request flow
- Accessibility statement page

---

## Suggested Priority Order

| Priority | Feature | Impact | Effort |
|----------|---------|--------|--------|
| **P0** | End-to-end booking flow (guest) | Critical revenue enabler | High |
| **P0** | Admin audit logs | Trust & compliance | Medium |
| **P1** | Guest wallet & payment flow | Revenue + UX | High |
| **P1** | Host auto-messaging rules | Host retention | Medium |
| **P1** | Admin dispute resolution | Platform trust | Medium |
| **P2** | Dynamic pricing engine | Host revenue + platform GMV | High |
| **P2** | Loyalty / referral program | Guest retention | Medium |
| **P2** | Host verification workflow | Quality control | Medium |
| **P3** | Advanced analytics dashboards | Data-driven decisions | Medium |
| **P3** | Content moderation queue | Brand safety | Low |
| **P4** | Co-host team management | Host scalability | Medium |
| **P4** | SEO / structured data controls | Organic growth | Low |

---

## Technical Notes
- All new features use existing localStorage mock patterns (HostDataContext, CMSContext) for zero-backend start
- Booking flow will require a new `BookingContext` for guest-side state
- Audit logs need an append-only `AuditLogContext` with auto-capture hooks on state changes
- Payment flow is mock UI only — real gateway integration requires Lovable Cloud + Supabase Edge Functions later
- WebSocket notifications can be simulated with polling intervals for now, upgraded to real-time later