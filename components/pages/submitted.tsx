'use client'
import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import Confetti from 'canvas-confetti';
import getIssueUpdate from '@/lib/getIssueUpdate'
import { 
    Issue
} from '@/types'

type IssueStatus = {
    thisIssue:Issue | null,
    status:string
}

export default function SubmittedPage() {
    const [issueStatus,setIssueStatus] = useState<IssueStatus | null>(null)

    useEffect(() => {
        const confettiSettings = {
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          };
      
          // Trigger confetti effect
          if (issueStatus?.status === 'open') {
            Confetti(confettiSettings);
          }
          
      
          // Clean up confetti effect when component unmounts
          return () => {
            Confetti.reset();
          };
    },[]);

    useEffect(()=>{
        const handleGetIssueUpdate = async () => {
            const data = await getIssueUpdate()
            if (data) {
                setIssueStatus(data)
            }
        }
        handleGetIssueUpdate()
    })

    return (
        <section className='flex flex-col py-[5vh]'>
            {issueStatus !== null && issueStatus?.status === 'open' && 
            <section className='flex flex-col'>
                <h1 className='ft-cooper font-bold text-3xl 2xl:text-4xl'>Your work has been submitted.</h1>
                <br/>
                <span className='text-lg lg:text-xl'>Thank you for submitting to <i>Active Voice</i> {issueStatus?.thisIssue?.title}.</span>
                <p>
                    If you have not already submitted 3 entries, feel free to <u><b><Link href='/'>submit another entry</Link></b></u>.
                </p>
            
                <br/>
                <p>
                    {issueStatus?.thisIssue?.title} results and selections will be released via email towards the end of the summer. 
                    Please contact <u>activevoicemag@gmail.com</u> with any questions or concerns, or <u><b><Link target='_blank' href='/activevoicemag.com/about'>visit</Link></b></u> our FAQ page.
                </p>
            </section> 
            }

            {issueStatus?.status == 'closed' &&
            <section className='flex flex-col'>
                <h1 className='ft-cooper font-bold text-3xl 2xl:text-4xl'>Submissions are closed for now.</h1>
                <br/>

                <p>
                    Submissions to Active Voice Magazine are currently closed for now. 
                    <br/><br/>
                    Please remain updated for the opening of the next issue.
                    Please contact <u>activevoicemag@gmail.com</u> with any questions or concerns, or <u><b><Link target='_blank' href='/activevoicemag.com/about'>visit</Link></b></u> our FAQ page.
                </p>
            </section>
            }

            {issueStatus == null &&
            <section>
            </section>
            }
        </section>
    )
}