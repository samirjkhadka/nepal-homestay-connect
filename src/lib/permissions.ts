// ============================================================
// Role-based access control (RBAC) for the admin console.
// Frontend-only model: admin users carry an `adminRole` tier
// that maps to a set of granular permissions.
// ============================================================

export type AdminRole = 'super' | 'manager' | 'moderator';

export type AdminPermission =
  // Homestays
  | 'homestay.view'
  | 'homestay.create'
  | 'homestay.edit'
  | 'homestay.delete'
  | 'homestay.approve'
  | 'homestay.toggle'
  // Users
  | 'user.view'
  | 'user.create'
  | 'user.edit'
  | 'user.delete'
  | 'user.role'
  | 'user.toggle'
  // Bookings
  | 'booking.view'
  | 'booking.edit'
  | 'booking.cancel';

const ALL: AdminPermission[] = [
  'homestay.view', 'homestay.create', 'homestay.edit', 'homestay.delete', 'homestay.approve', 'homestay.toggle',
  'user.view', 'user.create', 'user.edit', 'user.delete', 'user.role', 'user.toggle',
  'booking.view', 'booking.edit', 'booking.cancel',
];

export const ADMIN_ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  // Full control
  super: ALL,
  // Everything except destructive deletes and role changes
  manager: [
    'homestay.view', 'homestay.create', 'homestay.edit', 'homestay.approve', 'homestay.toggle',
    'user.view', 'user.create', 'user.edit', 'user.toggle',
    'booking.view', 'booking.edit', 'booking.cancel',
  ],
  // Review-only: can view, approve, and toggle visibility, nothing destructive
  moderator: [
    'homestay.view', 'homestay.approve', 'homestay.toggle',
    'user.view',
    'booking.view',
  ],
};

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  super: 'Super Admin',
  manager: 'Manager',
  moderator: 'Moderator',
};

export function roleHasPermission(role: AdminRole | undefined, permission: AdminPermission): boolean {
  if (!role) return false;
  return ADMIN_ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
