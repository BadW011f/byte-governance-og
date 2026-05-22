import { ImageResponse } from "next/og"
import { getProposal } from "@/lib/supabase"

export const runtime = "edge"

function money(value: any) {
    const num = Number(value || 0)
    return `$${num.toLocaleString()}`
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const proposal = await getProposal(id)

    const goal =
        proposal.community_goal_usd ||
        proposal.community_goal_amount ||
        proposal.budget_usd ||
        0

    const raised =
        proposal.community_raised_usd ||
        proposal.community_raised_amount ||
        0

    return new ImageResponse(
        (
            <div
                style={{
                    width: "1200px",
                    height: "630px",
                    background: "#050505",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "64px",
                    fontFamily: "Arial",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            fontSize: 30,
                            letterSpacing: "8px",
                            color: "#f97316",
                            fontWeight: 800,
                        }}
                    >
                        BYTE GOVERNANCE
                    </div>

                    <div
                        style={{
                            display: "flex",
                            fontSize: 24,
                            color: "#b8b8b8",
                        }}
                    >
                        {proposal.category || "Proposal"}
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            fontSize: 72,
                            lineHeight: 1,
                            fontWeight: 900,
                            maxWidth: "1000px",
                        }}
                    >
                        {proposal.title}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            marginTop: 28,
                            fontSize: 32,
                            lineHeight: 1.25,
                            color: "#cfcfcf",
                            maxWidth: "980px",
                        }}
                    >
                        {proposal.summary}
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "18px",
                        fontSize: 25,
                        fontWeight: 700,
                    }}
                >
                    <div style={{ display: "flex" }}>
                        FOR {proposal.votes_for || 0}
                    </div>

                    <div style={{ display: "flex" }}>
                        AGAINST {proposal.votes_against || 0}
                    </div>

                    <div style={{ display: "flex", color: "#fdba74" }}>
                        STATUS {proposal.status || "Active"}
                    </div>

                    <div style={{ display: "flex" }}>
                        RAISED {money(raised)} / {money(goal)}
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    )
}
