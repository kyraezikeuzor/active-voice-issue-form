import { createClient } from "@/lib/supabase/client";
import { SubmissionDto } from '@/types'
import moment from 'moment-timezone'
// Initialize Supabase
const supabase = createClient()

export default async function getIssueUpdate() {
  try {
    // Get the current date and time in ET timezone
    const nowET = moment().tz('America/New_York');

    // Fetch Issues from the database
    let { data: Issues, error } = await supabase
      .from('Issues')
      .select('*')

    if (error) {
      console.error('Error fetching issues:', error);
      return {thisIssue: null, status:'closed'};
    }

    if (!Issues || Issues.length === 0) {
      console.log('No active issues found');
      return {thisIssue: null, status:'closed'};
    }

    //Find most current issue based on end date
    let mostCurrentIssue = Issues[0];
    Issues.forEach(issue => {
      const issueEndDateET = moment(issue.end_date).tz('America/New_York');
      const mostCurrentIssueEndDateET = moment(mostCurrentIssue.end_date).tz('America/New_York');
      if (issueEndDateET.isAfter(mostCurrentIssueEndDateET)) {
        mostCurrentIssue = issue;
      }
    });

    // Determine if the issue is still open or closed
    const mostCurrentIssueEndDateET = moment(mostCurrentIssue.end_date).tz('America/New_York');
    const status = nowET.isBefore(mostCurrentIssueEndDateET) ? 'open' : 'closed';

    // Transform the issue details
    const transformedIssue = {
      id: mostCurrentIssue.id,
      title: mostCurrentIssue.title,
      description: mostCurrentIssue.description,
      startDate: mostCurrentIssue.start_date, // assuming the field name is start_date
      endDate: mostCurrentIssue.end_date, // assuming the field name is end_date
      active: mostCurrentIssue.active
    };

    // Return the status and transformed issue details
    if (transformedIssue.active == true) {
      return {
        "thisIssue": transformedIssue,
        "status": status
      };
    } else {
      return {
        "thisIssue": transformedIssue,
        "status": 'closed'
      };
    }

  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

getIssueUpdate().then(issueUpdate => {
  if (issueUpdate) {
    console.log('Issue Status:', issueUpdate);
  } else {
    console.log('No active issues found or an error occurred');
  }
});