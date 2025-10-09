export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Accueil</h1>
      <p style={{ marginTop: "1rem", fontSize: "1.2rem", color: "#555" }}>
        Bienvenue sur la page d'accueil de votre application de contacts.
      </p>
    </div>
  );
}