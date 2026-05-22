export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#050505", color: "white", padding: 40 }}>
      <p style={{ color: "#f97316", letterSpacing: "0.25em", fontSize: 12 }}>BYTE GOVERNANCE OG</p>
      <h1 style={{ fontSize: 44, marginTop: 20 }}>Proposal card generator is live.</h1>
      <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 680 }}>
        Use /proposal/YOUR_PROPOSAL_ID as the link in your Framer share buttons.
      </p>
    </main>
  )
}
