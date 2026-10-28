export type RolUsuario = 'admin' | 'usuario';

export interface Usuario {
  uid: string;
  email: string;
  nombre: string;
  rol: RolUsuario;
  token?: string;
}