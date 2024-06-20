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
        <section className='flex flex-col '>
            <h1 className='font-bold text-lg lg:text-2xl'>Entry submitted!</h1>
            <br/>
            <br/>
            <span className='text-base lg:text-xl'>Thank you for submitting to Active Voice Magazine 2024.</span>
            <p>If you have not already submitted 3 enties, feel free to <b><Link href='/'>submit another entry</Link></b>.</p>
        </section>
    )
}