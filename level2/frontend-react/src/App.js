import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProductList from "./components/ProductList";
import "./App.css";

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [authView, setAuthView] = useState("login");

  if (loading) return <p className="center-text">Loading...</p>;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Codveda Product Manager</h1>
        <p>Level 2 — React + JWT Auth + MongoDB</p>
        {user && (
          <div className="user-bar">
            <span>
              Logged in as <strong>{user.name}</strong> ({user.role})
            </span>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </header>

      <main>
        {!user ? (
          authView === "login" ? (
            <Login switchToSignup={() => setAuthView("signup")} />
          ) : (
            <Signup switchToLogin={() => setAuthView("login")} />
          )
        ) : null}

        <ProductList />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
