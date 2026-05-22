import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")
if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY")

export const supabase = createClient(supabaseUrl, serviceRoleKey)

export async function getProposal(id: string) {
  const { data, error } = await supabase
    .from("governance_proposals")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}
