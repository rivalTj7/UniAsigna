// Utilidad para verificar permisos basados en roles

export function isAdmin(user: any): boolean {
  return user && user.rol === 'ADMIN';
}

export function isUsuario(user: any): boolean {
  return user && user.rol === 'USUARIO';
}

export function canAccessAllData(user: any): boolean {
  return isAdmin(user);
}

export function canOnlyAccessOwnData(user: any): boolean {
  return isUsuario(user);
}

export function canManageStudents(user: any): boolean {
  return isAdmin(user);
}

export function canManageExpendios(user: any): boolean {
  return isAdmin(user);
}

export function canCreateAssignments(user: any): boolean {
  return isAdmin(user);
}

export function canEditProfile(user: any, targetUserId: number): boolean {
  if (isAdmin(user)) return true;
  return user && user.id === targetUserId;
}

export function canViewAllAssignments(user: any): boolean {
  return isAdmin(user);
}

export function canViewOwnAssignments(user: any): boolean {
  return user !== null; // Todos los usuarios logueados pueden ver sus propias asignaciones
}

export function getUserFromLocalStorage() {
  if (typeof window === 'undefined') return null;
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
}
