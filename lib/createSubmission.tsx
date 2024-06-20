import { createClient } from "@/lib/supabase/client";
import { SubmissionDto } from '@/types'
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const createSubmission = async (entry:SubmissionDto) => {
  const supabase = createClient();

  
  const { error } = await supabase
    .from("Submissions")
    .insert({
        name: entry.name,
        email: entry.email,
        bio: entry.bio,
        city: entry.city,
        high_school: entry.highSchool,
        title: entry.title,
        text: entry.text,
        issue: entry.issue,
        submission_type: entry.submissionType,
        archive: false
    });

  if (error) {
    return { message: "Failed to create post" };
  }
  return { message: "Successfully created post" };

};


export default createSubmission;