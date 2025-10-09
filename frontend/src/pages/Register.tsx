import { useState } from "react";
import axios from "axios";
import "../pages/Register.css";

export default function Register() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    age: "",
    telephone: "",
    password: "",
    email: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post("https://mycontact-t1is.onrender.com/users/register", form);
      setSuccess("Inscription réussie !");
      localStorage.setItem("token", response.data.token);
      window.location.href = "/";
    } catch (err: any) {
      console.error("Erreur lors de l'inscription :", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Inscription</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Prénom :</label>
          <input
            type="text"
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Nom :</label>
          <input
            type="text"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Âge :</label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Téléphone :</label>
          <input
            type="tel"
            name="telephone"
            value={form.telephone}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email :</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Mot de passe :</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="form-button">
          S'inscrire
        </button>

        <a href="/login" className="form-link">
          Se connecter
        </a>
      </form>

      {error && <p className="form-error">{error}</p>}
      {success && <p className="form-success">{success}</p>}
    </div>
  );
}
