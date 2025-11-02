import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, X } from "lucide-react";

interface AuthPageProps {
  onAuth: (user: any) => void;
  onClose?: () => void;
}

export function AuthPage({ onAuth, onClose }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:5269/api/auth"; // 👈 Asegúrate que este puerto coincide con el backend

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      window.location.reload();
    }
  };

  // Animación
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = formData.email.trim();
    const password = formData.password.trim();
    const nombre = formData.nombre.trim();

    if (!email || !password) {
      setError("Por favor completa todos los campos");
      setLoading(false);
      return;
    }

    if (!isLogin && !nombre) {
      setError("Por favor ingresa tu nombre");
      setLoading(false);
      return;
    }

    try {
      const API_BASE = "http://localhost:5269/api/auth";

      const endpoint = isLogin 
        ? `${API_BASE}/login`
        : `${API_BASE}/register`;

      const body = isLogin 
        ? { email, passwordHash: password }
        : { email, passwordHash: password, nombre };

      console.log("📤 Enviando al backend:", body); 
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      console.log("📥 Respuesta del backend:", data);
      if (response.ok) {
        console.log("✅ Usuario autenticado:", data);

        // ✅ Guarda el usuario completo incluyendo el id
        const usuarioAutenticado = {
          id: data.id,          // 👈 agregado
          email: data.email,
          name: data.name,
        };

        // Guarda en localStorage (opcional)
        localStorage.setItem("usuarioId", data.id);
        localStorage.setItem("usuarioEmail", data.email);

        onAuth(usuarioAutenticado);
      } else {
        console.error("❌ Error backend:", data);
        setError(data.error || "Error en la autenticación");
      }

    } catch (err) {
      console.error("❌ Error conexión frontend-backend:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };
 
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
        zIndex: 9999,
        padding: "1rem"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "white",
          borderRadius: "1.5rem",
          padding: "2.5rem",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          animation: "slideIn 0.3s ease-out",
          position: "relative"
        }}
      >
        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#9ca3af",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            zIndex: 10
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#f3f4f6";
            e.currentTarget.style.color = "#374151";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#9ca3af";
          }}
          title="Cerrar"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>📝</div>
          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: "800",
              color: "#1f2937",
              margin: 0,
              marginBottom: "0.5rem"
            }}
          >
            {isLogin ? "Bienvenido de nuevo" : "Crear cuenta"}
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.95rem", margin: 0 }}>
            {isLogin
              ? "Ingresa tus credenciales para continuar"
              : "Completa tus datos para registrarte"}
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "2rem",
            background: "#f3f4f6",
            padding: "0.25rem",
            borderRadius: "0.75rem"
          }}
        >
          <button
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "none",
              background: isLogin ? "white" : "transparent",
              color: isLogin ? "#667eea" : "#6b7280",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: isLogin ? "0 2px 8px rgba(0,0,0,0.1)" : "none"
            }}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "none",
              background: !isLogin ? "white" : "transparent",
              color: !isLogin ? "#667eea" : "#6b7280",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: !isLogin ? "0 2px 8px rgba(0,0,0,0.1)" : "none"
            }}
          >
            Registrarse
          </button>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* Nombre */}
          {!isLogin && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0.5rem",
                  marginLeft: "0.25rem"
                }}
              >
                Nombre completo
              </label>
              <div style={{ position: "relative" }}>
                <User
                  size={18}
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    pointerEvents: "none"
                  }}
                />
                <input
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem 0.875rem 3rem",
                    borderRadius: "0.75rem",
                    border: "2px solid #e5e7eb",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "0.5rem",
                marginLeft: "0.25rem"
              }}
            >
              Correo electrónico
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={18}
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  pointerEvents: "none"
                }}
              />
              <input
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem 0.875rem 3rem",
                  borderRadius: "0.75rem",
                  border: "2px solid #e5e7eb",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "0.5rem",
                marginLeft: "0.25rem"
              }}
            >
              Contraseña
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={18}
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  pointerEvents: "none"
                }}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.875rem 3rem 0.875rem 3rem",
                  borderRadius: "0.75rem",
                  border: "2px solid #e5e7eb",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9ca3af",
                  padding: 0,
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                padding: "0.75rem",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "0.5rem",
                color: "#dc2626",
                fontSize: "0.875rem"
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "1rem",
              background: loading
                ? "#9ca3af"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "0.75rem",
              fontSize: "1rem",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              boxShadow: "0 4px 14px rgba(102, 126, 234, 0.4)"
            }}
          >
            {loading ? "Procesando..." : isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}
