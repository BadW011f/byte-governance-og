import { ImageResponse } from "next/og"
import { getProposal } from "@/lib/supabase"

export const runtime = "edge"

function money(value: any) {
    const num = Number(value || 0)
    return `$${num.toLocaleString(undefined, {
        maximumFractionDigits: 0,
    })}`
}

function compact(value: any) {
    const num = Number(value || 0)
    return num.toLocaleString(undefined, {
        maximumFractionDigits: 0,
    })
}

function cleanSummary(value: any) {
    const text = String(value || "").trim()

    // Hide junk placeholder summaries so the card still looks premium.
    if (!text || text.length < 12) return "Vote, discuss, and help shape what BYTE builds next."

    return text.length > 120 ? `${text.slice(0, 120)}...` : text
}

function percent(value: any, max: any) {
    const v = Number(value || 0)
    const m = Number(max || 0)
    if (!m) return 0
    return Math.max(0, Math.min(100, Math.round((v / m) * 100)))
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const proposal = await getProposal(id)

    const category = proposal.category || "Proposal"
    const status = proposal.status || "Active"

    const goal =
        proposal.community_goal_usd ||
        proposal.community_goal_amount ||
        proposal.budget_usd ||
        0

    const raised =
        proposal.community_raised_usd ||
        proposal.community_raised_amount ||
        0

    const fundedPct = percent(raised, goal)
    const totalVotes =
        Number(proposal.votes_for || 0) +
        Number(proposal.votes_against || 0) +
        Number(proposal.votes_abstain || 0)

    const yesPct = percent(proposal.votes_for, Math.max(totalVotes, 1))

    return new ImageResponse(
        (
            <div
                style={{
                    width: "1200px",
                    height: "630px",
                    background:
                        "linear-gradient(135deg, #030303 0%, #090909 45%, #1d0b02 100%)",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    padding: "54px",
                    fontFamily: "Arial",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Glow */}
                <div
                    style={{
                        position: "absolute",
                        right: "-170px",
                        top: "-160px",
                        width: "520px",
                        height: "520px",
                        borderRadius: "999px",
                        background: "rgba(249, 115, 22, 0.28)",
                        filter: "blur(70px)",
                        display: "flex",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        left: "-180px",
                        bottom: "-200px",
                        width: "520px",
                        height: "520px",
                        borderRadius: "999px",
                        background: "rgba(255, 255, 255, 0.06)",
                        filter: "blur(80px)",
                        display: "flex",
                    }}
                />

                {/* Border */}
                <div
                    style={{
                        position: "absolute",
                        inset: "24px",
                        border: "1px solid rgba(249, 115, 22, 0.34)",
                        borderRadius: "34px",
                        display: "flex",
                    }}
                />

                {/* Header */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "18px",
                        }}
                    >
                        <div
                            style={{
                                width: "58px",
                                height: "58px",
                                borderRadius: "18px",
                                background:
                                    "linear-gradient(135deg, #ff7a18, #ffbd72)",
                                color: "#120600",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 31,
                                fontWeight: 900,
                            }}
                        >
                            B
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    fontSize: 28,
                                    letterSpacing: "8px",
                                    color: "#ff8a2a",
                                    fontWeight: 900,
                                }}
                            >
                                BYTE GOVERNANCE
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    fontSize: 18,
                                    color: "rgba(255,255,255,0.55)",
                                    marginTop: "6px",
                                }}
                            >
                                Community proposal card
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                fontSize: 20,
                                color: "#fdba74",
                                border: "1px solid rgba(253,186,116,0.35)",
                                background: "rgba(249,115,22,0.12)",
                                padding: "12px 16px",
                                borderRadius: "999px",
                                fontWeight: 800,
                            }}
                        >
                            {status}
                        </div>

                        <div
                            style={{
                                display: "flex",
                                fontSize: 20,
                                color: "rgba(255,255,255,0.78)",
                                border: "1px solid rgba(255,255,255,0.16)",
                                background: "rgba(255,255,255,0.06)",
                                padding: "12px 16px",
                                borderRadius: "999px",
                                fontWeight: 800,
                            }}
                        >
                            {category}
                        </div>
                    </div>
                </div>

                {/* Main */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 2,
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "76px",
                        width: "100%",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            fontSize: 76,
                            lineHeight: 0.96,
                            fontWeight: 900,
                            maxWidth: "930px",
                            letterSpacing: "-4px",
                        }}
                    >
                        {proposal.title}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            marginTop: "24px",
                            fontSize: 30,
                            lineHeight: 1.25,
                            color: "rgba(255,255,255,0.70)",
                            maxWidth: "900px",
                        }}
                    >
                        {cleanSummary(proposal.summary)}
                    </div>
                </div>

                {/* Footer stats */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 2,
                        marginTop: "auto",
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: "18px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                            width: "100%",
                            gap: "22px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                width: "55%",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: 20,
                                    color: "rgba(255,255,255,0.72)",
                                    marginBottom: "8px",
                                    fontWeight: 800,
                                }}
                            >
                                <span>Funding Progress</span>
                                <span>{money(raised)} / {money(goal)}</span>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    width: "100%",
                                    height: "18px",
                                    borderRadius: "999px",
                                    background: "rgba(255,255,255,0.10)",
                                    overflow: "hidden",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        width: `${fundedPct}%`,
                                        height: "100%",
                                        background:
                                            "linear-gradient(90deg, #ff7a18, #fdba74, #ffffff)",
                                        borderRadius: "999px",
                                    }}
                                />
                            </div>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: "12px",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "130px",
                                    height: "84px",
                                    borderRadius: "22px",
                                    background: "rgba(255,255,255,0.07)",
                                    border: "1px solid rgba(255,255,255,0.13)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        fontSize: 32,
                                        fontWeight: 900,
                                    }}
                                >
                                    {proposal.votes_for || 0}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        color: "#9fffd7",
                                        fontSize: 15,
                                        fontWeight: 900,
                                    }}
                                >
                                    FOR
                                </div>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "130px",
                                    height: "84px",
                                    borderRadius: "22px",
                                    background: "rgba(255,255,255,0.07)",
                                    border: "1px solid rgba(255,255,255,0.13)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        fontSize: 32,
                                        fontWeight: 900,
                                    }}
                                >
                                    {yesPct}%
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        color: "#fdba74",
                                        fontSize: 15,
                                        fontWeight: 900,
                                    }}
                                >
                                    SUPPORT
                                </div>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "130px",
                                    height: "84px",
                                    borderRadius: "22px",
                                    background: "rgba(255,255,255,0.07)",
                                    border: "1px solid rgba(255,255,255,0.13)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        fontSize: 32,
                                        fontWeight: 900,
                                    }}
                                >
                                    {compact(totalVotes)}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        color: "rgba(255,255,255,0.62)",
                                        fontSize: 15,
                                        fontWeight: 900,
                                    }}
                                >
                                    VOTES
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            fontSize: 20,
                            color: "rgba(255,255,255,0.48)",
                            fontWeight: 700,
                        }}
                    >
                        <div style={{ display: "flex" }}>
                            Share. Vote. Fund. Build BYTE together.
                        </div>

                        <div style={{ display: "flex", color: "#fdba74" }}>
                            byte-governance-og.vercel.app
                        </div>
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
