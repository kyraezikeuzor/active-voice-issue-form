'use client'
import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import { Issue } from '@/types'
import { Control, useForm, useFieldArray, useWatch} from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { 
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    useFormField
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast, { Toaster } from "react-hot-toast";
import TipTap from '@/components/editor/tiptap'
import createSubmission from '@/lib/createSubmission'
import { categories } from '@/data/categories'
import getActiveIssues from '@/lib/getActiveIssues'
import { hasEmptyValues } from '@/lib/utils'

type SubmissionFormValues = {
    submission: {
        title: string,
        type: string,
        text: string
    }[]
}

export default function SubmissionPage() {

    const router = useRouter()
    const [contests, setContests] = useState<Issue[]>([])

    useEffect(()=>{
        const handleGetContests = async () => {
            const data = await getActiveIssues()
            if (data) {
                setContests(data)
            }
        }

        handleGetContests()
    })

    // APPLICANT INFO FORM
    const applicantInfoFormSchema = z.object({
        competition: z.string({
            required_error: "Please enter a competition.",
        })
        .min(1,{message: 'Entering a high school is required'})
        .max(500, {message: 'High Schools must be 500 characters or less.'}),
        name: z
        .string({
            required_error: "Please enter a name.",
        })
        .min(1,{message: 'Names must be more than 1 character.'})
        .max(100, {message: 'Names must be less than 100 characters.'}),
        email: z.string({
            required_error: "Please enter an email",
        })
        .min(1,{message: 'Entering a name is required'})
        .max(100, {message: 'Names must be less than 100 characters.'}),
        bio: z
        .string({
            required_error: "Please enter a bio.",
        })
        .min(10,{message: 'Bios must be more than 10 characters.'})
        .max(500, {message: 'Bios must be 500 characters or less.'}),
        city: z.string({
            required_error: "Please enter a city.",
        })
        .min(1,{message: 'Entering a city is required'})
        .max(500, {message: 'Cities must be 500 characters or less.'}),
        highSchool: z.string({
            required_error: "Please enter a school.",
        })
        .min(1,{message: 'Entering a high school is required'})
        .max(500, {message: 'High Schools must be 500 characters or less.'}),
    })

    const applicantInfoForm = useForm<z.infer<typeof applicantInfoFormSchema>>({
        resolver: zodResolver(applicantInfoFormSchema),
        mode: 'onChange',
        defaultValues: {
            competition:'',
            name: '',
            email: '',
            bio: '',
            city: '',
            highSchool: ''
        }
    })


    // SUBMISSION FORM
    const submissionForm = useForm<SubmissionFormValues>({
        defaultValues: {
            submission: [{title: '', type: '', text: ''}]
        }
    })

    const { fields, append, prepend, remove } = useFieldArray({
        name: 'submission',
        control: submissionForm.control,
        
    })

    const handleAddSubmission = () => {
        if (fields.length < 3) {
            append({ title: '', type: '', text: '' });
        } else {
            toast.error('You can only add up to 3 submissions.');
        }

        if (fields.length = 0) {
            toast.error('You must add a submission.');
        }
    };

    const handleTipTapChange = (index: number, newRichText: string) => {
        submissionForm.setValue(`submission.${index}.text`, newRichText);
    }
    

    // COMPLETE FORM SUBMISSION
    const handleSubmit = async (applicantData: z.infer<typeof applicantInfoFormSchema>, submissionData: SubmissionFormValues) => {
        // Check if any applicantData values are empty

        
        // Check if any submissionData values are empty

        if (submissionData.submission.length != 0) {
            for (const submission of submissionData.submission) {
                let counter = 0
                if (hasEmptyValues(applicantData)) {
                    // Display an error message or handle the empty values case
                    toast.error('Please fill in all applicant fields.');
                    counter = counter+1
                } 
    
                if (hasEmptyValues(submission)) {
                    toast.error('Please fill in all submission fields.');
                    counter = counter+1
                }
    
                if (counter > 0) {
                    return; // Prevent further execution
                }
            }
        } else {
            let counter = 0
            if (hasEmptyValues(applicantData)) {
                // Display an error message or handle the empty values case
                toast.error('Please fill in all applicant fields.');
                counter = counter+1
            } 

            toast.error('Please add a submission.');
            if (counter > 0) {
                return; // Prevent further execution
            }
        }
        
        
        for (const submission of submissionData.submission) {
            const entry = {
                name: applicantData.name,
                email: applicantData.email,
                bio: applicantData.bio,
                city: applicantData.city,
                highSchool: applicantData.highSchool,
                title: submission.title,
                text: submission.text,
                issueId: Number(applicantData.competition), // replace with actual issue info
                submissionType: submission.type,
                archive: false
            }
            const response = await createSubmission(entry);
            if (response.message === "Failed to create post") {
                toast.error(`Failed to submit entry: ${submission.title}`);
                
            } else {
                router.push('/submitted')
                toast.success(`Successfully submitted entries!`);
            }
        }
    }

    const onSubmit = async () => {
        const applicantData = applicantInfoForm.getValues();
        const submissionData = submissionForm.getValues();
        await handleSubmit(applicantData, submissionData);
    }

    console.log(submissionForm.watch())

    //{ register, formState: {errors}, control}

    return (
        <section className='w-full flex flex-col gap-10'>
            <section className='w-full flex flex-col gap-5'>
                <h1 className='ft-cooper font-bold text-2xl md:text-3xl 2xl:text-4xl'>Active Voice Submission Form</h1>
                <p className='text-base'>
                    In our third issue, Active Voice is looking for submissions related to any and all social justice and political issues (gun reform, reproductive justice, climate change & the environment, race & identity, etc.)! We welcome all writing and art—both old and new.
                    <br/><br/>
                    We will consider a maximum of three (3) pieces per person. Simultaneous submissions, as well as pieces that have been published elsewhere, are accepted. Though we would love to share as many youth voices as possible, please note that publication in Active Voice is a selective process (this should not stop you from submitting!).
                    <br/><br/>
                    <b>Our Issue #3 reading period closes on Sunday, February 11 at 11:59 EST.</b> Please contact activevoicemag@gmail.com with any questions or concerns, or visit our FAQ page at activevoicemag.com/about.
                    <br/><br/>
                    Interested in joining the Active Voice team? Apply <u><b><Link target='_blank' href='https://docs.google.com/forms/d/e/1FAIpQLScmyUHB6FThu_z2s1lcjAys4QY1jxzrRthjYicdYk5ROqZG3A/viewform'>here</Link></b></u>.
                </p>
            </section>
            <section className='w-full flex flex-col gap-5'>
                <h2 className='ft-cooper font-bold text-xl md:text-2xl 2xl:text-3xl'>Applicant Information</h2>
                <Form {...applicantInfoForm} >
                    <form className='space-y-4'>
                        <FormField
                            control={applicantInfoForm.control}
                            name="competition"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contest</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue {...field} placeholder="Select a current contest for your submission(s)" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {contests?.map((item,index)=>(
                                            <SelectItem key={index} value={item.id.toString()}>
                                                <span>{item.title}</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={applicantInfoForm.control}
                            name="name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>First and Last Name</FormLabel>
                                <FormControl>
                                    <Input required {...field} placeholder='Enter your first and last name'/>
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={applicantInfoForm.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input required {...field} type="email" placeholder='Enter your email'/>
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={applicantInfoForm.control}
                            name="bio"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Textarea required {...field} placeholder='Enter some words about you'/>
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={applicantInfoForm.control}
                            name="city"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input required {...field} placeholder='Enter your city'/>
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={applicantInfoForm.control}
                            name="highSchool"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>High School</FormLabel>
                                <FormControl>
                                    <Input required {...field} placeholder='Enter your high school'/>
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </section>
            <section className='w-full flex flex-col gap-8'>
                <h2 className='ft-cooper font-bold text-xl md:text-2xl 2xl:text-3xl'>Work Submission(s)</h2>
                <Form {...submissionForm} >
                    <form className="space-y-20">
                        {fields.map((submission,index)=>(
                            <fieldset key={submission.id} className='relative space-y-4'>
                                <FormField
                                    control={submissionForm.control}
                                    name={`submission.${index}.title`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Submission Title</FormLabel>
                                        <FormControl>
                                            <Input required {...submissionForm.register(`submission.${index}.title`)} placeholder='Enter your first name'/>
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={submissionForm.control}
                                    name={`submission.${index}.type`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Submission Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue required {...submissionForm.register(`submission.${index}.type`)} placeholder="Select an entry type for your submission" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((item,index)=>(
                                                    <SelectItem key={index} value={item}>{item}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={submissionForm.control}
                                    name={`submission.${index}.text`}
                                    render={( { field }) => (
                                    <FormItem>
                                        <FormLabel>Submission Text</FormLabel>
                                        <FormControl>
                                            <TipTap 
                                                initialValue={submission.text}
                                                onChange={(newRichText) => handleTipTapChange(index, newRichText)}
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <Button className='absolute right-0' variant='destructive' type="button" onClick={() => remove(index)}>
                                    Remove
                                </Button>
                            </fieldset>
                        ))}

                        <br/>
                        <br/>
                        
                        <Button onClick={handleAddSubmission} variant='secondary' type='button'>Add another entry</Button>

                    </form>
                </Form>
            </section> 

            
            <Toaster/>
            
            <Button onClick={onSubmit} type="button">Submit</Button> 
        </section>
    )
}
