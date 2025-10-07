import { useState } from "react";
import axios from "axios";
import "./Register.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/users/login", {
        email,
        password,
      });

      console.log("✅ Utilisateur connecté :", response.data);
      localStorage.setItem("token", response.data.token);
      window.location.href = "/";
    } catch (err: any) {
      console.error("Erreur lors de la connexion :", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur de connexion. Vérifiez vos identifiants.");
      }
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Connexion</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Adresse mail :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="form-button">
          Se connecter
        </button>

        <a href="/register" className="form-link">
          S'inscrire
        </a>
      </form>

      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
