# Admin Homestay Management

Turn the read-only `/admin/homestays` page into a full management console: **Add, Edit, View Detail, Approve/Reject, Enable/Disable** — all persisted and reflected on the public-facing site.

## Lifecycle & rules
- **Status**: `pending → approved / rejected`. New homestays (admin- or host-created) start `pending`.
- **Enabled toggle**: independent of status. An `approved` homestay can still be paused (disabled).
- **Public visibility rule**: a homestay appears on the public site only when `status === 'approved'` AND `enabled === true`. Everything else is admin-only.
- Every action writes an entry to the existing Audit Log (with before/after where relevant).

## 1. Shared managed store (new context)
Create `src/contexts/HomestayStoreContext.tsx`, following the existing `CMSContext` / `HostDataContext` localStorage pattern (key `nh-homestays-v1`).

- **Seed** from the static `homestaysData` in `src/data/homestays.ts`, extending each record with admin fields: `status: 'pending' | 'approved' | 'rejected'`, `enabled: boolean`, `featured: boolean`, `createdAt`, `rejectionReason?`. Seeded records default to `approved` + `enabled` so the current public site is unchanged on first load.
- **Exposes**: `homestays` (all), `publicHomestays` (approved + enabled), and actions: `addHomestay`, `updateHomestay`, `deleteHomestay`, `approveHomestay`, `rejectHomestay(reason)`, `setEnabled(id, bool)`, `getById`.
- Extend `Homestay` type with the admin fields in `src/data/homestays.ts`.
- Wrap the app with `HomestayStoreProvider` in `src/App.tsx`.

## 2. Route public pages through the store
So admin changes reflect live, update these consumers to read `publicHomestays` (approved+enabled) from the store instead of importing `getAllHomestays`/`getFeaturedHomestays` directly:

`src/pages/Homestays.tsx`, `src/pages/Search.tsx`, `src/pages/HomestayDetail.tsx`, `src/pages/Wishlist.tsx`, `src/pages/TripPlanner.tsx`, `src/pages/guest/GuestDashboard.tsx`, `src/components/HeroSection.tsx`, `src/components/FeaturedHomestays.tsx`, `src/components/CompareWidget.tsx`.

- `HomestayDetail` also guards: if an id isn't in `publicHomestays`, show the existing not-found state.
- Date helpers (`isDateAvailable`, `getUnavailableDates`, `getNearbyHomestays`) stay as pure functions but take the record from the store.

## 3. Admin list page rebuild (`src/pages/admin/AdminHomestays.tsx`)
- Read from the store (all homestays, not just approved).
- **Status filter tabs**: All / Pending / Approved / Rejected / Disabled, with counts.
- Keep search; add a **status badge** and an **enabled/disabled switch** per row.
- Per-row actions: **View** (opens detail drawer), **Edit** (opens editor), **Approve** / **Reject** (shown for pending), **Enable/Disable** toggle, **Delete** (confirm dialog).
- Pending rows get an amber highlight and inline Approve/Reject buttons; Reject opens a small reason dialog.
- **Add Homestay** button opens the tabbed editor in create mode.

## 4. Full tabbed editor (new component)
`src/components/admin/HomestayEditor.tsx` — a Dialog with tabs, mirroring the Host listing editor:
1. **Basics** — name, type, short description, long description
2. **Location** — location, province (select of the 7 provinces), coordinates
3. **Host** — host name, since, superhost flag, languages, expertise, bio
4. **Pricing & Capacity** — price/night, max guests, bedrooms, bathrooms
5. **Amenities** — multi-select chips from the existing amenity keys
6. **Photos** — image URL list with reorder controls + cover selection (reuse the drag-reorder pattern already built for Host listings)

- **Validation** before save: required name, location, province, price > 0, guests ≥ 1, at least one image. Inline field errors; save button disabled until valid.
- Save in create mode → adds with `status: 'pending'`; edit mode → updates in place and logs a before/after diff.
- On create/edit, fire an Audit Log entry and (optional) a Notification to admins.

## 5. View Detail drawer (new component)
`src/components/admin/HomestayDetailDrawer.tsx` — read-only summary: gallery, status/enabled badges, host block, pricing, amenities, description, and a quick action bar (Approve/Reject/Enable-Disable/Edit) so admins can act without leaving the drawer.

## Technical notes
- Reuse existing shadcn `Dialog`, `Tabs`, `Switch`, `Select`, `Badge`, `AlertDialog`, `Textarea`, and `sonner` toasts.
- Audit calls use the existing `useAuditLog().log(...)` signature (`actor: 'admin'`, actions `create|update|delete|approve|reject|publish|unpublish`).
- New homestay ids: slugify the name + short random suffix, matching current id style.
- No backend; all persistence via localStorage, consistent with the current architecture.

## Out of scope
- No color/typography/theme changes.
- No real backend or auth changes.
- Booking/pricing engines and host-side editors stay as-is (only wired for public reflection where they read homestay data).
