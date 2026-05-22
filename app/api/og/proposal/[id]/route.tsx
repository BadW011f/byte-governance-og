import { ImageResponse } from "next/og"
import { getProposal } from "@/lib/supabase"

export const runtime = "edge"

function money(value: any, digits = 0) {
    const num = Number(value || 0)
    return `$${num.toLocaleString(undefined, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    })}`
}

function percent(value: any, max: any) {
    const v = Number(value || 0)
    const m = Number(max || 0)
    if (!m) return 0
    return Math.max(0, Math.min(100, Math.round((v / m) * 100)))
}

function safeText(value: any, max = 120, fallback = "") {
    const text = String(value || "")
        .replace(/\s+/g, " ")
        .trim()

    if (!text) return fallback

    return text.length > max ? `${text.slice(0, max).trim()}...` : text
}

function fundingCurrency(proposal: any) {
    return String(
        proposal.funding_currency || proposal.funding_token || "USDC"
    ).toUpperCase()
}

function fundingTotal(proposal: any) {
    return Number(
        proposal.funding_total_amount ??
            proposal.funding_total_usd ??
            proposal.budget_usd ??
            0
    )
}

function treasuryRequested(proposal: any) {
    return Number(
        proposal.treasury_requested_amount ??
            proposal.treasury_requested_usd ??
            0
    )
}

function communityGoal(proposal: any) {
    return Math.max(
        0,
        Number(
            proposal.community_goal_amount ??
                proposal.community_goal_usd ??
                fundingTotal(proposal) - treasuryRequested(proposal)
        )
    )
}

function communityRaised(proposal: any) {
    return Number(
        proposal.community_raised_amount ??
            proposal.community_raised_usd ??
            0
    )
}

function fundingOverall(proposal: any) {
    return treasuryRequested(proposal) + communityRaised(proposal)
}

function statusText(proposal: any) {
    if (
        fundingTotal(proposal) > 0 &&
        communityGoal(proposal) > 0 &&
        communityRaised(proposal) >= communityGoal(proposal)
    ) {
        return "Funded"
    }

    return proposal.status || "Active"
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const proposal = await getProposal(id)

    const currency = fundingCurrency(proposal)
    const total = fundingTotal(proposal)
    const overall = Math.min(total || 0, fundingOverall(proposal))
    const fundedPct = total ? percent(overall, total) : 0

    const votesFor = Number(proposal.votes_for || 0)
    const votesAgainst = Number(proposal.votes_against || 0)
    const votesAbstain = Number(proposal.votes_abstain || 0)
    const totalVotes = votesFor + votesAgainst + votesAbstain
    const yesPct = percent(votesFor, Math.max(totalVotes, 1))

    const risk = safeText(proposal.risk_level || "Unreviewed", 20, "Unreviewed")
    const status = safeText(statusText(proposal), 24, "Active")
    const category = safeText(proposal.category || "General", 24, "General")
    const title = safeText(proposal.title, 64, "BYTE Governance Proposal")
    const summary = safeText(
        proposal.summary,
        118,
        "Vote, fund, and help shape what BYTE builds next."
    )

    return new ImageResponse(
        (
            <div
                style={{
                    width: "1200px",
                    height: "630px",
                    background:
                        "radial-gradient(820px 340px at 82% 6%, rgba(255,255,255,.075), transparent 60%), radial-gradient(520px 260px at 10% 100%, rgba(255,255,255,.038), transparent 58%), linear-gradient(180deg, #050608 0%, #020304 100%)",
                    color: "#eef5ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "44px",
                    fontFamily: "Arial",
                }}
            >
                <div
                    style={{
                        width: "1088px",
                        height: "542px",
                        border: "1px solid rgba(255,255,255,.16)",
                        background:
                            "radial-gradient(620px 260px at 100% 0%, rgba(255,255,255,.052), transparent 58%), linear-gradient(180deg, rgba(255,255,255,.072), rgba(255,255,255,.018))",
                        borderRadius: "34px",
                        boxShadow:
                            "0 36px 95px rgba(0,0,0,.50), 0 0 0 1px rgba(255,255,255,.075), 0 0 32px rgba(255,255,255,.026), inset 0 1px 0 rgba(255,255,255,.22)",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            padding: "34px",
                            flex: 1,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: "14px",
                            }}
                        >
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
                                        color: "#9fffd7",
                                        border: "1px solid rgba(127,255,209,.36)",
                                        background: "rgba(127,255,209,.075)",
                                        borderRadius: "999px",
                                        padding: "9px 13px",
                                        fontSize: 17,
                                        fontWeight: 900,
                                    }}
                                >
                                    {status}
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        color: "#99d8ff",
                                        border: "1px solid rgba(153,216,255,.34)",
                                        background: "rgba(153,216,255,.075)",
                                        borderRadius: "999px",
                                        padding: "9px 13px",
                                        fontSize: 17,
                                        fontWeight: 900,
                                    }}
                                >
                                    {category}
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        color: "#dfe7ef",
                                        border: "1px solid rgba(255,255,255,.15)",
                                        background: "rgba(8,12,18,.82)",
                                        borderRadius: "999px",
                                        padding: "9px 13px",
                                        fontSize: 17,
                                        fontWeight: 900,
                                    }}
                                >
                                    Risk: {risk}
                                </div>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "14px",
                                        background:
                                            "linear-gradient(135deg,#f5f7fa 0%,#c9d2dc 55%,#8f9aa5 100%)",
                                        color: "#071015",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 28,
                                        fontWeight: 950,
                                        boxShadow:
                                            "0 16px 34px rgba(255,122,0,.22), inset 0 1px 0 rgba(255,255,255,.38)",
                                    }}
                                >
                                    B
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-end",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            color: "#dfe7ef",
                                            fontSize: 18,
                                            fontWeight: 950,
                                            letterSpacing: "3px",
                                        }}
                                    >
                                        BYTE
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            color: "#8f9aa5",
                                            fontSize: 14,
                                            fontWeight: 800,
                                        }}
                                    >
                                        Governance
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                marginTop: "34px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    color: "#fff",
                                    fontSize: 58,
                                    lineHeight: 1.04,
                                    letterSpacing: "-2.2px",
                                    fontWeight: 950,
                                    maxWidth: "910px",
                                }}
                            >
                                {title}
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    marginTop: "16px",
                                    color: "#aeb8c2",
                                    fontSize: 24,
                                    lineHeight: 1.35,
                                    maxWidth: "900px",
                                }}
                            >
                                {summary}
                            </div>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: "12px",
                                marginTop: "28px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: total > 0 ? "50%" : "33%",
                                    border: "1px solid rgba(255,179,92,.16)",
                                    background:
                                        "linear-gradient(180deg, rgba(255,255,255,.065), rgba(8,12,18,.88))",
                                    borderRadius: "22px",
                                    padding: "16px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        color: "#8f9aa5",
                                        fontSize: 14,
                                        fontWeight: 900,
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                    }}
                                >
                                    {total > 0 ? "Funded" : "Budget"}
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        color: "#dfe7ef",
                                        fontSize: 34,
                                        fontWeight: 950,
                                        marginTop: "7px",
                                    }}
                                >
                                    {total > 0
                                        ? `${fundedPct}%`
                                        : money(proposal.budget_usd)}
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        color: "#96a1aa",
                                        fontSize: 16,
                                        marginTop: "7px",
                                    }}
                                >
                                    {total > 0
                                        ? `${money(overall)} / ${money(total)} ${currency}`
                                        : "Requested budget"}
                                </div>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: total > 0 ? "50%" : "33%",
                                    border: "1px solid rgba(255,255,255,.105)",
                                    background:
                                        "linear-gradient(180deg, rgba(255,255,255,.065), rgba(8,12,18,.88))",
                                    borderRadius: "22px",
                                    padding: "16px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        color: "#8f9aa5",
                                        fontSize: 14,
                                        fontWeight: 900,
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                    }}
                                >
                                    Yes Support
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        color: "#9fffd7",
                                        fontSize: 34,
                                        fontWeight: 950,
                                        marginTop: "7px",
                                    }}
                                >
                                    {yesPct}%
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        color: "#96a1aa",
                                        fontSize: 16,
                                        marginTop: "7px",
                                    }}
                                >
                                    {votesFor} for · {totalVotes} votes
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                                marginTop: "20px",
                            }}
                        >
                            {total > 0 && (
                                <div
                                    style={{
                                        display: "flex",
                                        height: "14px",
                                        borderRadius: "999px",
                                        overflow: "hidden",
                                        background: "rgba(8,12,18,.72)",
                                        border: "1px solid rgba(255,255,255,.09)",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            width: `${fundedPct}%`,
                                            height: "100%",
                                            borderRadius: "999px",
                                            background:
                                                "linear-gradient(90deg,#c9d2dc,#f5f7fa)",
                                            boxShadow:
                                                "0 0 18px rgba(255,255,255,.12)",
                                        }}
                                    />
                                </div>
                            )}

                            <div
                                style={{
                                    display: "flex",
                                    height: "10px",
                                    borderRadius: "999px",
                                    overflow: "hidden",
                                    background: "rgba(8,12,18,.72)",
                                    border: "1px solid rgba(255,255,255,.09)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        width: `${yesPct}%`,
                                        height: "100%",
                                        borderRadius: "999px",
                                        background:
                                            "linear-gradient(90deg,#80ffd4,#dbffec)",
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "12px",
                            padding: "22px 34px",
                            borderTop: "1px solid rgba(255,255,255,.08)",
                            background: "rgba(0,0,0,.18)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                color: "#98a4ae",
                                fontSize: 20,
                                fontWeight: 800,
                            }}
                        >
                            Review Proposal
                        </div>

                        <div
                            style={{
                                display: "flex",
                                color: "#071015",
                                background:
                                    "linear-gradient(135deg,#f5f7fa 0%,#c9d2dc 55%,#8f9aa5 100%)",
                                border: "1px solid rgba(255,255,255,.22)",
                                borderRadius: "18px",
                                padding: "13px 18px",
                                fontSize: 20,
                                fontWeight: 950,
                                boxShadow:
                                    "0 16px 34px rgba(255,122,0,.22), inset 0 1px 0 rgba(255,255,255,.38)",
                            }}
                        >
                            Vote with the ByteArmy
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
