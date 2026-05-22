import { getProposal } from "@/lib/supabase"

const SITE_URL = "https://byte-governance-og.vercel.app"
const CARD_VERSION = "governance-v2"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const proposal = await getProposal(id)

    const title = `${proposal.title} | BYTE Governance`
    const description =
        proposal.summary || "Vote on this BYTE community proposal."

    const pageUrl = `${SITE_URL}/proposal/${id}?card=${CARD_VERSION}`
    const imageUrl = `${SITE_URL}/api/og/proposal/${id}?card=${CARD_VERSION}`

    return {
        title,
        description,
        alternates: {
            canonical: pageUrl,
        },
        openGraph: {
            title,
            description,
            type: "website",
            url: pageUrl,
            siteName: "BYTE Governance",
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
    }
}

export default async function ProposalPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const proposal = await getProposal(id)

    return (
        <main
            style={{
                minHeight: "100vh",
                background:
                    "radial-gradient(700px 300px at 85% 8%, rgba(255,122,24,.16), transparent 62%), linear-gradient(180deg, #05080c 0%, #020406 100%)",
                color: "white",
                padding: 40,
                fontFamily: "Arial, Helvetica, sans-serif",
            }}
        >
            <div
                style={{
                    maxWidth: 920,
                    margin: "0 auto",
                    border: "1px solid rgba(255,255,255,.16)",
                    background:
                        "linear-gradient(180deg, rgba(255,255,255,.078), rgba(255,255,255,.026))",
                    borderRadius: 28,
                    padding: 28,
                    boxShadow:
                        "0 36px 95px rgba(0,0,0,.50), inset 0 1px 0 rgba(255,255,255,.18)",
                }}
            >
                <p
                    style={{
                        margin: 0,
                        color: "#ffbd72",
                        fontSize: 13,
                        fontWeight: 900,
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                    }}
                >
                    BYTE Governance
                </p>

                <h1
                    style={{
                        margin: "18px 0 10px",
                        fontSize: 44,
                        lineHeight: 1.05,
                        letterSpacing: "-0.04em",
                    }}
                >
                    {proposal.title}
                </h1>

                <p
                    style={{
                        color: "rgba(255,255,255,.72)",
                        fontSize: 18,
                        lineHeight: 1.5,
                        maxWidth: 760,
                    }}
                >
                    {proposal.summary ||
                        "Vote, fund, and help shape what BYTE builds next."}
                </p>
            </div>
        </main>
    )
}
