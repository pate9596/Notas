import axios from "axios";

const API_URL = "http://localhost:5269/api/Notas";

// 🔹 Obtener todas las notas de un usuario
export const getNotas = (usuarioId: string) =>
  axios.get(`${API_URL}/${usuarioId}`);

// 🔹 Crear una nueva nota
export const createNota = (nota: {
  titulo: string;
  contenido: string;
  usuarioId: string;
}) => axios.post(API_URL, nota);

// 🔹 Actualizar nota existente (nuevo)
export const updateNota = (
  id: string,
  notaActualizada: { titulo: string; contenido: string; usuarioId: string }
) => axios.put(`${API_URL}/${id}`, notaActualizada);

// 🔹 Eliminar nota
export const deleteNota = (id: string) => axios.delete(`${API_URL}/${id}`);
