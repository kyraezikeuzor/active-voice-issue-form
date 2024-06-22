import { createClient } from "@/lib/supabase/client";

export const getActiveIssues = async () => {
    const supabase = createClient();

    let { data: Issues, error } = await supabase
        .from('Issues')
        .select("*")
        .eq("active", true)

    if (error) {
        console.log(error)
    }
    
    if (Issues) {
        return Issues.map((issue:any) => ({
            id:issue.id,
            title:issue.title,
            description:issue.description,
            startDate:issue.startDate,
            endDate:issue.endDate,
            active:issue.active
        }))
    } else {
        return 
    }
};

export default getActiveIssues