import { useEffect, useState } from "react";
import axios from "axios";
import "./Contact.css";

interface Contact {
  _id: string;
  firstname: string;
  lastname: string;
  telephone: string;
  email: string;
}


export default function Contact() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    telephone: "",
    email: "",
  });

  const token = localStorage.getItem("token");

  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/contact/liste", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data.contacts);
    } catch (err: any) {
      console.error("Erreur :", err);
      setError("Impossible de charger les contacts.");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/contact/create", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ firstname: "", lastname: "", telephone: "", email: "" });
      fetchContacts();
    } catch (err) {
      console.error("Erreur ajout contact :", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer ce contact ?")) return;
    try {
      await axios.delete(`http://localhost:5000/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchContacts();
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact) return;
    try {
      await axios.patch(`http://localhost:5000/contact/${editingContact._id}`,
        editingContact,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingContact(null);
      fetchContacts();
    } catch (err) {
      console.error("Erreur modification :", err);
    }
  };

  return (
    <div>
      <h2>Mes Contacts</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleAdd} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="firstname"
          value={form.firstname}
          onChange={handleChange}
          placeholder="Prénom"
          required
        />
        <input
          type="text"
          name="lastname"
          value={form.lastname}
          onChange={handleChange}
          placeholder="Nom"
          required
        />
        <input
          type="tel"
          name="telephone"
          value={form.telephone}
          onChange={handleChange}
          placeholder="Téléphone"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <button type="submit">Ajouter</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Téléphone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c._id}>
              <td>{c.firstname}</td>
              <td>{c.lastname}</td>
              <td>{c.telephone}</td>
              <td>{c.email}</td>
              <td>
                <button onClick={() => setEditingContact(c)}>Modifier</button>
                <button onClick={() => handleDelete(c._id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingContact && (
        <form onSubmit={handleEdit} style={{ marginTop: "20px" }}>
          <h4>Modifier le contact</h4>
          <input
            type="text"
            value={editingContact.firstname}
            onChange={(e) =>
              setEditingContact({ ...editingContact, firstname: e.target.value })
            }
          />
          <input
            type="text"
            value={editingContact.lastname}
            onChange={(e) =>
              setEditingContact({ ...editingContact, lastname: e.target.value })
            }
          />
          <input
            type="tel"
            value={editingContact.telephone}
            onChange={(e) =>
              setEditingContact({ ...editingContact, telephone: e.target.value })
            }
          />
          <input
            type="email"
            value={editingContact.email}
            onChange={(e) =>
              setEditingContact({ ...editingContact, email: e.target.value })
            }
          />
          <button type="submit">Enregistrer</button>
          <button onClick={() => setEditingContact(null)}>Annuler</button>
        </form>
      )}
    </div>
  );
}