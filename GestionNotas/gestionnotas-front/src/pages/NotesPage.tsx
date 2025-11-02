import { useEffect, useState } from "react";
import { getNotas, createNota, deleteNota } from "../api/NoteApi";
import type { User } from "../types";
import { Trash2, Plus, Calendar } from "lucide-react";

interface Note {
  id: string;
  titulo: string;
  contenido: string;
  fechaCreacion: string;
}

interface NotesPageProps {
  user: User | null;
  onLogout?: () => void;
}

export function NotesPage({ user }: NotesPageProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ titulo: "", contenido: "" });

  const fetchNotas = async () => {
    if (!user?.id) return;
    try {
      if (!user || !user.id) {
        setNotes([]); // 👈 Limpia notas si no hay usuario logeado
        return;
      }
      const res = await getNotas(user.id);
      setNotes(res.data);
    } catch (err) {
      console.error("Error al obtener notas:", err);
    }
  };


  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🟡 Si no hay usuario, no permitas guardar
    if (!user || !user.id) {
      alert("⚠️ Debes iniciar sesión para guardar una nota.");
      return;
    }

    if (!newNote.titulo.trim() || !newNote.contenido.trim()) return;

    try {
      await createNota({
        ...newNote,
        usuarioId: user.id, // 👈 importante: asociar nota al usuario
      });
      setNewNote({ titulo: "", contenido: "" });
      await fetchNotas();
    } catch (err) {
      console.error("Error al crear nota:", err);
    }
  };


  const handleDeleteNote = async (id: string) => {
    if (confirm("¿Seguro que deseas eliminar esta nota?")) {
      try {
        await deleteNota(id);
        await fetchNotas();
      } catch (err) {
        console.error("Error al eliminar nota:", err);
      }
    }
  };

  useEffect(() => {
    // Si no hay usuario logeado → limpia notas
    if (!user || !user.id) {
      console.log("🧽 Usuario no logeado o invitado, limpiando notas...");
      setNotes([]);
      return;
    }

    // Si hay usuario logeado → obtiene sus notas
    const fetch = async () => {
      try {
        const res = await getNotas(user.id);
        setNotes(res.data);
      } catch (err) {
        console.error("Error al obtener notas:", err);
      }
    };

    fetch();
  }, [user]); // 👈 se ejecuta cada vez que cambia el usuario


 

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a855f7 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '3rem' }}>📝</span>
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: '800', 
              color: 'white',
              margin: 0,
              textShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
              Mis Notas
            </h1>
          </div>
          <p style={{ color: '#e9d5ff', fontSize: '1.1rem', margin: 0 }}>
            Organiza tus ideas y pensamientos
          </p>
        </div>

        {/* Formulario de creación */}
        <div style={{ maxWidth: '700px', margin: '0 auto 3rem auto' }}>
          {!user && (
            <div
              style={{
                background: "#fef3c7",
                color: "#92400e",
                padding: "0.75rem",
                borderRadius: "0.75rem",
                border: "1px solid #fde68a",
                marginBottom: "1rem",
                textAlign: "center",
                fontWeight: "600"
              }}
            >
              🔒 Estás navegando como invitado. Inicia sesión para guardar tus notas.
            </div>
          )}

          <form
            onSubmit={handleCreateNote}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              borderRadius: '1.5rem',
              padding: '2rem',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                color: 'white', 
                fontWeight: '600',
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}>
                Título
              </label>
              <input
                type="text"
                placeholder="Título de tu nota..."
                value={newNote.titulo}
                onChange={(e) => setNewNote({ ...newNote, titulo: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                color: 'white', 
                fontWeight: '600',
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}>
                Contenido
              </label>
              <textarea
                placeholder="Escribe tu nota aquí..."
                value={newNote.contenido}
                onChange={(e) => {
                  const target = e.target;
                  target.style.height = "auto"; // Resetea antes de medir
                  target.style.height = `${target.scrollHeight}px`; // Ajusta al contenido
                  setNewNote({ ...newNote, contenido: target.value });
                }}
                rows={1}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  resize: 'none', // 👈 evita el drag manual
                  fontFamily: 'inherit',
                  overflow: 'hidden', // 👈 quita el scroll
                  transition: 'height 0.2s ease'
                }}
              />

            </div>

          <button
            type="submit"
            disabled={!user || !user.id}
            style={{
              width: "100%",
              background: (!user || !user.id)
                ? "#9ca3af"
                : "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
              color: "white",
              fontWeight: "700",
              padding: "1rem",
              borderRadius: "0.75rem",
              border: "none",
              cursor: (!user || !user.id) ? "not-allowed" : "pointer",
              opacity: (!user || !user.id) ? 0.7 : 1,
              transition: "all 0.2s",
            }}
          >
            <Plus size={22} />
            {(!user || !user.id) ? "Inicia sesión para guardar" : "Crear Nota"}
          </button>

          </form>
        </div>

        {/* Grid de notas */}
        {notes.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem'
          }}>
            {notes.map((nota) => (
              <div
                key={nota.id}
                style={{
                  position: 'relative',
                  background: 'white',
                  borderRadius: '1.25rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s',
                  cursor: 'default'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.25)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
                }}
              >
                {/* Barra superior con gradiente */}
                <div style={{
                  height: '6px',
                  background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 50%, #f97316 100%)'
                }} />
                
                <div style={{ padding: '1.5rem' }}>
                  {/* Header */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{ 
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#1f2937',
                      margin: 0,
                      flex: 1,
                      paddingRight: '0.5rem',
                      wordWrap: 'break-word'
                    }}>
                      {nota.titulo || "Sin título"}
                    </h3>
                    <button
                      onClick={() => handleDeleteNote(nota.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#fef2f2';
                        e.currentTarget.style.color = '#dc2626';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#9ca3af';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      title="Eliminar nota"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Contenido */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <p style={{
                      color: '#4b5563',
                      lineHeight: '1.6',
                      margin: 0,
                      whiteSpace: 'pre-line',
                      wordWrap: 'break-word',
                      display: '-webkit-box',
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {nota.contenido}
                    </p>
                  </div>

                  {/* Footer con fecha */}
                  <div style={{
                    paddingTop: '1rem',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.375rem 0.75rem',
                      background: '#f3e8ff',
                      borderRadius: '0.5rem'
                    }}>
                      <Calendar size={14} style={{ color: '#9333ea' }} />
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#7e22ce',
                        fontWeight: '600'
                      }}>
                        {new Date(nota.fechaCreacion).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <div style={{
              display: 'inline-block',
              padding: '2.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: 'white',
                marginBottom: '0.5rem'
              }}>
                No hay notas todavía
              </h3>
              <p style={{ color: '#e9d5ff' }}>
                Crea tu primera nota usando el formulario de arriba
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}