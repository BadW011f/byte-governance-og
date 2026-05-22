import { getProposal } from "@/lib/supabase"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const proposal = await getProposal(id)
  const title = `${proposal.title} | BYTE Governance`
  const description = proposal.summary || "Vote on this BYTE community proposal."

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: `/api/og/proposal/${id}`,
          width: 1200,
          height: 630,
          alt: proposal.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og/proposal/${id}`],
    },
  }
}

export default async function ProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const proposal = await getProposal(id)

  return (
    <main style={{ minHeight: "100vh", background: "#050505", color: "white", padding: 40 }}>
      <p style={{ color: "#f97316", letterSpacing: "0.25em", fontSize: 12 }}>BYTE GOVERNANCE</p>
      <h1 style={{ fontSize: 44, maxWidth: 900 }}>{proposal.title}</h1>
      <p style={{ color: "rgba(255,255,255,0.72)", maxWidth: 760, fontSize: 18 }}>{proposal.summary}</p>
      <div style={{ marginTop: 28, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, padding: 24, maxWidth: 720 }}>
        <p>Status: {proposal.status || "Active"}</p>
        <p>For: {proposal.votes_for || 0}</p>
        <p>Against: {proposal.votes_against || 0}</p>
        <p>Abstain: {proposal.votes_abstain || 0}</p>
      </div>
    </main>
  )
}
