'use client';

/**
 * API para obtener el usuario actual desde el servidor
 * Esta función se usa en el cliente para obtener los datos del usuario
 * que están almacenados en cookies httpOnly
 */
export async function getCurrentUser() {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include',
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return null;
  }
}

/**
 * Cierra la sesión del usuario
 */
export async function logout() {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    
    // Recargar la página para limpiar el estado
    window.location.href = '/login';
  } catch (error) {
    console.error('Error cerrando sesión:', error);
  }
}
