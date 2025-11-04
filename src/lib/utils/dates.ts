import { format, lastDayOfMonth, startOfMonth, endOfMonth, isBefore, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';

export function getMesActual(): number {
  return new Date().getMonth() + 1; // 1-12
}

export function getAnioActual(): number {
  return new Date().getFullYear();
}

export function getNombreMes(mes: number): string {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return meses[mes - 1];
}

export function getInicioMes(mes: number, anio: number): Date {
  return startOfMonth(new Date(anio, mes - 1));
}

export function getFinMes(mes: number, anio: number): Date {
  const ultimoDia = lastDayOfMonth(new Date(anio, mes - 1));
  ultimoDia.setHours(23, 59, 59, 999);
  return ultimoDia;
}

export function esFinDeMes(): boolean {
  const hoy = new Date();
  const ultimoDia = lastDayOfMonth(hoy);
  return hoy.getDate() === ultimoDia.getDate();
}

export function formatearFecha(fecha: Date | string): string {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es });
}

export function formatearFechaCorta(fecha: Date | string): string {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return format(date, 'dd/MM/yyyy');
}

export function estaDentroDeMes(fecha: Date, mes: number, anio: number): boolean {
  const inicio = getInicioMes(mes, anio);
  const fin = getFinMes(mes, anio);
  return !isBefore(fecha, inicio) && !isAfter(fecha, fin);
}
