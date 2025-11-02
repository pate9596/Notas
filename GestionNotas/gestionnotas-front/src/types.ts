export interface Note {
  id: string;          // MongoDB ObjectId, pero en frontend lo manejamos como string
  titulo: string;
  contenido: string;
  fechaCreacion: Date; // viene como ISO string desde el backend
  color: string;
}


export interface User {
  id: string;
  email: string;
  name: string;
}
