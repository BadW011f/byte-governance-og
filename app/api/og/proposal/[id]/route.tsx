import { ImageResponse } from "next/og"
import { getProposal } from "@/lib/supabase"

export const runtime = "edge"

function money(value: number | string | null | undefined) {
  const num = Number(value || 0)
  return `$${num.toLocaleString()}`
}

function shortText(value: string | null | undefined, max = 150) {
  const text = value || "Vote on this BYTE community proposal."
  return text.length > max ? `${text.slice(0, max)}...` : text
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const proposal = await getProposal(id)

  const goal = proposal.community_goal_usd || proposal.community_goal_amount || proposal.budget_usd || 0
  const raised = proposal.community_raised_usd || proposal.community_raised_amount || 0

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #050505 0%, #121212 58%, #2b1200 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          fontFamily: "Arial",
          border: "1px solid rgba(249,115,22,0.45)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 30, letterSpacing: "8px", color: "#f97316", fontWeight: 800 }}>
            BYTE GOVERNANCE
          </div>
          <div style={{ fontSize: 24, color: "rgba(255,255,255,0.7)" }}>{proposal.category || "Proposal"}</div>
        </div>

        <div>
          <div style={{ fontSize: 68, lineHeight: 1, fontWeight: 900, maxWidth: "1000px" }}>{proposal.title}</div>
          <div style={{ marginTop: 28, fontSize: 30, lineHeight: 1.28, color: "rgba(255,255,255,0.74)", maxWidth: "980px" }}>
            {shortText(proposal.summary)}
          </div>
        </div>

        <div style={{ display: "flex", gap: "18px", fontSize: 25, fontWeight: 700 }}>
          <div style={{ padding: "16px 20px", borderRadius: 18, background: "rgba(255,255,255,0.08)" }}>FOR {proposal.votes_for || 0}</div>
          <div style={{ padding: "16px 20px", borderRadius: 18, background: "rgba(255,255,255,0.08)" }}>AGAINST {proposal.votes_against || 0}</div>
          <div style={{ padding: "16px 20px", borderRadius: 18, background: "rgba(249,115,22,0.18)", color: "#fdba74" }}>STATUS {proposal.status || "Active"}</div>
          <div style={{ padding: "16px 20px", borderRadius: 18, background: "rgba(255,255,255,0.08)" }}>RAISED {money(raised)} / {money(goal)}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
