// lib/createSubmission.ts
import { createClient } from '@/lib/supabase/client';
import { SubmissionDto } from '@/types';
import getIssue from './getIssue'
import { formatIssueString } from '@/lib/utils'

export const createSubmission = async (entry: SubmissionDto) => {
  const supabase = createClient()

  try {
    const uploadFile = async () => {
      // Upload file to Supabase Storage
      const issue = await getIssue(entry.issueId)
      const issueName = formatIssueString(issue?.title)
      //const fileData = new Uint8Array(await entry.file.arrayBuffer());


      const { data, error } = await supabase.storage
      .from('submission_files') // Replace with your actual storage bucket name
      .upload(`submission_files/${issueName}/${entry.file.name}`, entry.file.content, {
        cacheControl: '3600',
        contentType: entry.file.type,
        upsert: true,
      });

      if (error) {
        console.error('Error uploading file to Supabase Storage:', error.message);
        console.log("Failed to create submission") ;
      }

      return data
    }

    const fileUrlData  = await uploadFile()
    const fileUrl = fileUrlData?.id; // URL or key to access the uploaded file

    // Store metadata in Supabase
    const { data, error  } = await supabase
    .from("Submissions")
    .insert({
      name: entry.name,
      email: entry.email,
      bio: entry.bio,
      city: entry.city,
      high_school: entry.highSchool,
      title: entry.title,
      file: {
        name: entry.file.name,
        type: entry.file.type,
        size: entry.file.size,
        url: fileUrl
      },
      issue_id: entry.issueId,
      submission_type: entry.submissionType,
      archive: false
    });

    if (error) {
      console.error('Error storing submission metadata in Supabase:', error.message);
      return { message: "Failed to create submission" };
    }

    return { message: "Successfully created submission", fileUrl };

  } catch (error:any) {
    console.error('Error creating submission:', error.message);
    return { message: "Failed to create submission" };
  }
};

export default createSubmission;
