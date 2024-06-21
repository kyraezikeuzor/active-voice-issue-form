'use client'
import React from 'react'
import Link from 'next/link'
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
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import TipTap from '@/components/editor/tiptap'
import createSubmission from '@/lib/createSubmission'
import { categories } from '@/data/categories'

type SubmissionFormValues = {
    submission: {
        title: string,
        type: string,
        text: string
    }[]
}

export default function SubmissionPage() {

    const { toast } = useToast()
    const router = useRouter()

    // APPLICANT INFO FORM
    const applicantInfoFormSchema = z.object({
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
            alert('You can only add up to 3 submissions.');
            toast({
                title: "Over Max Submissions",
                description: "You can only add up to 3 submissions",
                action: (
                  <ToastAction altText="More than 3 submissions">Undo</ToastAction>
                ),
            })
        }
    };

    const handleTipTapChange = (index: number, newRichText: string) => {
        submissionForm.setValue(`submission.${index}.text`, newRichText);
    }
    

    // COMPLETE FORM SUBMISSION
    const handleSubmit = async (applicantData: z.infer<typeof applicantInfoFormSchema>, submissionData: SubmissionFormValues) => {
        for (const submission of submissionData.submission) {
            const entry = {
                name: applicantData.name,
                email: applicantData.email,
                bio: applicantData.bio,
                city: applicantData.city,
                highSchool: applicantData.highSchool,
                title: submission.title,
                text: submission.text,
                issue: "Issue 4", // replace with actual issue info
                submissionType: submission.type,
                archive: false
            }
            const response = await createSubmission(entry);
            if (response.message === "Failed to create post") {
                console.log('cant do it')
                toast({
                    title: "Submission Failed",
                    description: `Failed to submit entry: ${submission.title}`,
                    action: (
                      <ToastAction altText="Try Again">Undo</ToastAction>
                    ),
                })
            } else {
                router.push('/submitted')
                
                toast({
                    title: "Submission Successful",
                    description: `Successfully submitted entry: ${submission.title}`,
                })
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
                <h1 className='ft-cooper font-bold text-xl lg:text-4xl'>Active Voice Issue Submissions</h1>
                <p className='text-base'>
                    In our third issue, Active Voice is looking for submissions related to any and all social justice and political issues (gun reform, reproductive justice, climate change & the environment, race & identity, etc.)! We welcome all writing and art—both old and new.
                    <br/><br/>
                    We will consider a maximum of three (3) pieces per person. Simultaneous submissions, as well as pieces that have been published elsewhere, are accepted. Though we would love to share as many youth voices as possible, please note that publication in Active Voice is a selective process (this should not stop you from submitting!).
                    <br/><br/>
                    <b>Our Issue #3 reading period closes on Sunday, February 11 at 11:59 EST.</b> Please contact activevoicemag@gmail.com with any questions or concerns, or visit our FAQ page at activevoicemag.com/about.
                    <br/><br/>
                    Interested in joining the Active Voice team? Apply <u><b><Link href='https://docs.google.com/forms/d/e/1FAIpQLScmyUHB6FThu_z2s1lcjAys4QY1jxzrRthjYicdYk5ROqZG3A/viewform'>here</Link></b></u>.
                </p>
            </section>
            <section className='w-full flex flex-col gap-5'>
                <h1 className='ft-cooper font-bold text-lg lg:text-3xl'>Applicant Information</h1>
                <Form {...applicantInfoForm} >
                    <form className='space-y-4'>
                        <FormField
                            control={applicantInfoForm.control}
                            name="name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input required {...field} placeholder='Enter your first name'/>
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
                <h1 className='ft-cooper font-bold text-lg lg:text-3xl'>Work Submission(s)</h1>
                <Form {...submissionForm} >
                    <form className="space-y-20" onSubmit={()=>console.log('BOOG')}>
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

            <Button onClick={onSubmit} type="button">Submit</Button> 
        </section>
    )
}
