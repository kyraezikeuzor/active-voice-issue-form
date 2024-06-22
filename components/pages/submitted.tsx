'use client'
import React, {useEffect} from 'react'
import Link from 'next/link'
import Confetti from 'canvas-confetti';

export default function SubmittedPage() {

    useEffect(() => {
        const confettiSettings = {
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          };
      
          // Trigger confetti effect
          Confetti(confettiSettings);
      
          // Clean up confetti effect when component unmounts
          return () => {
            Confetti.reset();
          };
    }, []);

    return (
        <section className='flex flex-col py-[5vh]'>
            <h1 className='ft-cooper font-bold text-2xl md:text-3xl 2xl:text-4xl'>Your work has been submitted!</h1>
            <br/>
            <span className='text-lg lg:text-xl'>Thank you for submitting to Active Voice Magazine 2024.</span>
            <p>
                If you have not already submitted 3 entries, feel free to <u><b><Link href='/'>submit another entry</Link></b></u>.
            </p>
        
            <br/>
            <p>
                Issue #3 results and selections will be released via email towards the end of the summer. 
                Please contact <u>activevoicemag@gmail.com</u> with any questions or concerns, or <u><b><Link target='_blank' href='/activevoicemag.com/about'>visit</Link></b></u> our FAQ page.
            </p>
        </section>
    )
}