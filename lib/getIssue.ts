import { createClient } from "@/lib/supabase/client";
// Initialize Supabase
const supabase = createClient()


export const getIssue = async (issueId:number) => {
  const supabase = createClient();

  const {data, error} = await supabase
  .from("Issues")
  .select("*")
  .eq("id", issueId)

  if (error) {
    throw error.message;
  }

  const issue = data?.map((item:any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    startDate: item.start_date, // assuming the field name is start_date
    endDate: item.end_date, // assuming the field name is end_date
    active: item.active
  }))

  return issue[0];
}


export default getIssue
