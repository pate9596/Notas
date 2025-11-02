import React, { useState, useEffect } from "react";
import { NotesPage } from "./pages/NotesPage";
import { AuthPage } from "./components/AuthPage";
import { LogOut, User } from "lucide-react";


export interface User {
  id: string;      // 👈 Nuevo campo, el ObjectId del usuario en MongoDB
  email: string;
  name: string;
}


export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const usuarioId = localStorage.getItem("usuarioId");
    const usuarioEmail = localStorage.getItem("usuarioEmail");
    const usuarioName = localStorage.getItem("usuarioName");

    if (usuarioId && usuarioEmail) {
      setUser({
        id: usuarioId,
        email: usuarioEmail,
        name: usuarioName || "",
      });
    }
  }, []);


  const handleAuth = (userData: User) => {
    setUser(userData);
    localStorage.setItem("usuarioId", userData.id);
    localStorage.setItem("usuarioEmail", userData.email);
    localStorage.setItem("usuarioName", userData.name);
    setShowAuth(false);
  };


  const handleLogout = () => {
    console.log("🚪 Cerrando sesión...");
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("usuarioEmail");
    setUser(null); // 👈 esto dispara el useEffect en NotesPage
  };



  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a855f7 100%)',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <header style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.75rem' }}>📝</span>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'white',
            margin: 0
          }}>
            Gestor de Notas
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Badge del usuario */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <User size={18} color="white" />
            <span style={{
              color: 'white',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}>
              {user?.name || "Invitado"}
            </span>
          </div>

          {/* Botón de acción */}
          {user ? (
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                padding: '0.65rem 1.25rem',
                borderRadius: '0.75rem',
                border: 'none',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.6)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
              }}
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              style={{
                background: 'white',
                color: '#7c3aed',
                padding: '0.65rem 1.25rem',
                borderRadius: '0.75rem',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(255, 255, 255, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.background = '#f8f9fa';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.background = 'white';
              }}
            >
              Iniciar sesión / Registrarse
            </button>
          )}
        </div>
      </header>

      {/* Contenido principal */}
      <main style={{ 
        flex: 1,
        width: '100%',
        overflowX: 'hidden'
      }}>
        {user ? (
          <NotesPage user={user} />
        ) : (
          <NotesPage user={{ id: "", email: "", name: "Invitado" }} />
        )}

      </main>

      {/* Modal Auth */}
      {showAuth && <AuthPage onAuth={handleAuth} onClose={() => setShowAuth(false)} />}
    </div>
  );
}