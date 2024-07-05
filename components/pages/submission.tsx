'use client'
import React, {useState, useEffect, useCallback} from 'react'
import Link from 'next/link'
import { 
    Issue
} from '@/types'
import { 
    Control, 
    useForm, 
    useFieldArray, 
    useWatch
} from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Loader } from '@/components/ui/loader'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
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
import createSubmission from '@/lib/createSubmission'
import { categories } from '@/data/categories'
import getIssueUpdate from '@/lib/getIssueUpdate'
import { 
    hasEmptyValues,
    formatTimestamp
} from '@/lib/utils'
import { ReloadIcon } from '@radix-ui/react-icons'


type IssueStatus = {
    thisIssue:Issue | null,
    status:string
}

const fileSchema = z.object({
    name: z.string(),
    size: z.number()
    .max(6 * 1024 * 1024, { message: 'File size must be less than 6 MB' }),
    type: z.string(),
    content: z.any()
    // Add more file properties as needed 6000000
});
  
const submissionSchema = z.object({
    title: z.string(),
    type: z.string(),
    file: fileSchema
});

const formSchema = z.object({
    name: 
    z.string({required_error: "Please enter a name.",})
    .min(1,{message: 'Names must be more than 1 character.'})
    .max(100, {message: 'Names must be less than 100 characters.'}),
    email: 
    z.string({
        required_error: "Entering an email is required",
    })
    .min(1,{message: 'Entering an email is required'})
    .max(100, {message: 'Names must be less than 100 characters.'}),
    bio: z
    .string({
        required_error: "Please enter a bio.",
    })
    .min(10,{message: 'Bios must be more than 10 characters.'})
    .max(500, {message: 'Bios must be 500 characters or less.'}),
    city: 
    z.string({
        required_error: "Please enter a city.",
    })
    .min(1,{message: 'Entering a city is required'})
    .max(500, {message: 'Cities must be 500 characters or less.'}),
        highSchool: z.string({
        required_error: "Please enter a school.",
    })
    .min(1,{message: 'Entering a high school is required'})
    .max(500, {message: 'High Schools must be 500 characters or less.'}),
    submissions: 
    z.array(submissionSchema).nonempty(),
})
  
const fetchIssueUpdate = async () => {
    try {
        const data = await getIssueUpdate();
        return data;
    } catch (error) {
        console.error('Failed to fetch issue update:', error);
        return null;
    }
};

export default function SubmissionPage() {

    const router = useRouter()
    const [issueStatus,setIssueStatus] = useState<IssueStatus | null>(null)
    const [issueStatusLoading, setIssueStatusLoading] = useState<boolean>(false)
    const [formSubmitting,setFormSubmitting] = useState<boolean>(false)

    useEffect(() => {
        const loadIssueStatus = async () => {
            const data = await fetchIssueUpdate();
            setIssueStatus(data);
            setIssueStatusLoading(false);
        };
        loadIssueStatus();
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            email: '',
            bio: '',
            city: '',
            highSchool: '',
            submissions: [{ title: '', type: '', file: { name: '', size: 0, type: '' } }]
        }
    })

    const { control, handleSubmit, setValue, register, formState: { errors } } = form;
   
    const { fields, append, remove } = useFieldArray({
        control, 
        name: 'submissions',
    });

    //console.log(form.watch())

    const handleAddSubmission = useCallback(() => {
        if (fields.length < 3) {
            append({ title: '', type: '', file: { name: '', size: 0, type: '', content:'' } });
        } else {
            toast.error('You can only add up to 3 submissions.');
        }
    }, [append, fields.length]);

    const handleFileChange = async (file: File, index: number) => {
        const reader = new FileReader();
        reader.onload = () => {
          const content = reader.result;
          setValue(`submissions.${index}.file`, {
            name: file.name,
            size: file.size,
            type: file.type,
            content: content instanceof ArrayBuffer ? new Uint8Array(content) : undefined
          });
        };
        reader.readAsArrayBuffer(file);
    };

    const onSubmit = async (formData: z.infer<typeof formSchema>) => {
        setFormSubmitting(true)
        const { name, email, bio, city, highSchool, submissions } = formData;
        const issueStatus = await getIssueUpdate(); // Replace with your actual function to get issue status
      
        if (issueStatus && issueStatus.status === 'open') {
          // Check if any submissionData values are empty
          /*if (submissions.length !== 0) {
            for (const submission of submissions) {
              let counter = 0;
      
              // Check if any applicantData values are empty
              if (hasEmptyValues({ name, email, bio, city, highSchool })) {
                // Display an error message or handle the empty values case
                toast.error('Please fill in all applicant fields.');
                counter += 1;
              }
      
              if (hasEmptyValues(submission)) {
                toast.error('Please fill in all submission fields.');
                counter += 1;
              }
      
              if (counter > 0) {
                return; // Prevent further execution
              }
            }
          } else {
            let counter = 0;
            if (hasEmptyValues({ name, email, bio, city, highSchool })) {
              // Display an error message or handle the empty values case
              toast.error('Please fill in all applicant fields.');
              counter += 1;
            }
      
            toast.error('Please add a submission.');
            if (counter > 0) {
              return; // Prevent further execution
            }
          }
        */
      
          for (const submission of submissions) {
            const file = submission.file;
      
            // Now you can use fileContent in your submission logic
            const submissionFile = {
              name: file.name,
              type: file.type,
              size: file.size,
              content: file.content,
            };
      
            const entry = {
              name,
              email,
              bio,
              city,
              highSchool,
              title: submission.title,
              file: submissionFile,
              issueId: issueStatus?.thisIssue?.id, // replace with actual issue info
              submissionType: submission.type,
              archive: false,
            };
      
            const response = await createSubmission(entry);
            if (response?.message === "Failed to create submission") {
              toast.error(`Failed to submit entry: ${submission.title}`);
            } else {
              setFormSubmitting(false)
              toast.success(`Successfully submitted entries!`);
              router.push('/submitted');
            }
          }
        }
    };


    return (
        <section className='w-full flex flex-col gap-10'>
            
            {issueStatus?.thisIssue != null && issueStatus.status === 'open' &&
                // ISSUE OPEN
                <section className='w-full flex flex-col gap-3'>
                    <h1 className='ft-cooper font-bold text-4xl 2xl:text-[42px]'>{issueStatus?.thisIssue?.title} Submissions Open</h1>
                    <p className='text-base'>
                        In {issueStatus?.thisIssue?.title}, Active Voice is looking for submissions related to any and all social justice and political issues (gun reform, reproductive justice, climate change & the environment, race & identity, etc.)! We welcome all writing and art—both old and new.
                        <br/><br/>
                        We will consider a <b>maximum of three (3) pieces per person</b>. Simultaneous submissions, as well as pieces that have been published elsewhere, are accepted. Though we would love to share as many youth voices as possible, please note that publication in Active Voice is a selective process (this should not stop you from submitting!).
                        <br/><br/>
                        <b>Our {issueStatus?.thisIssue?.title} reading period closes on {formatTimestamp(issueStatus?.thisIssue?.endDate)}.</b> Please contact activevoicemag@gmail.com with any questions or concerns, or visit our FAQ page at activevoicemag.com/about.
                        <br/><br/>
                        Interested in joining the Active Voice team? Apply <u><b><Link target='_blank' href='https://docs.google.com/forms/d/e/1FAIpQLScmyUHB6FThu_z2s1lcjAys4QY1jxzrRthjYicdYk5ROqZG3A/viewform'>here</Link></b></u>.
                    </p>
                </section>
            }   

            {issueStatus?.thisIssue != null && issueStatus.status === 'closed' &&
                <section className='w-full flex flex-col gap-3'>
                    <h1 className='ft-cooper font-bold text-4xl 2xl:text-[42px]'>{issueStatus?.thisIssue?.title} Submissions Closed</h1>
                    <p className='text-base'>
                        <b>Our {issueStatus?.thisIssue?.title} reading period closed {formatTimestamp(issueStatus?.thisIssue?.endDate)}.</b> 
                        <br/>
                        Please contact activevoicemag@gmail.com with any questions or concerns, or visit our FAQ page at activevoicemag.com/about.
                        <br/><br/>
                        Active Voice looks for submissions related to any and all social justice and political issues (gun reform, reproductive justice, climate change & the environment, race & identity, etc.)! We welcome all writing and art—both old and new.
                        <br/><br/>
                        We consider a maximum of three (3) pieces per person. Simultaneous submissions, as well as pieces that have been published elsewhere, are accepted. Though we would love to share as many youth voices as possible, please note that publication in Active Voice is a selective process (this should not stop you from submitting!).
                        <br/><br/>
                        Please remain updated for the release of our next issue. 
                        <br/>
                        Interested in joining the Active Voice team? Apply <u><b><Link target='_blank' href='https://docs.google.com/forms/d/e/1FAIpQLScmyUHB6FThu_z2s1lcjAys4QY1jxzrRthjYicdYk5ROqZG3A/viewform'>here</Link></b></u>.
                    </p>
                </section>
            }

            {issueStatusLoading == true && issueStatus == null &&
            <div>
                <Loader/>
            </div>
            }

            {issueStatusLoading == false && issueStatus?.thisIssue == null &&
                // ISSUE CLOSED
                <section className='hidden w-full flex flex-col gap-3'>
                    <h1 className='ft-cooper font-bold text-4xl 2xl:text-[42px]'>Closed for Submissions</h1>
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
            }

            {issueStatus?.thisIssue != null && issueStatus.status === 'open' &&
                <section className='w-full flex flex-col gap-5'>  
                    <Form {...form} >   
                        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-12'>
                            <div className='flex flex-col space-y-4'>
                                <h2 className='ft-cooper font-bold text-3xl 2xl:text-4xl'>Applicant Information</h2>
                                <FormField
                                    control={form.control}
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
                                    control={form.control}
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
                                    control={form.control}
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
                                    control={form.control}
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
                                    control={form.control}
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
                            </div>

                            <div className='flex flex-col space-y-4'>
                                <h2 className='ft-cooper font-bold text-3xl 2xl:text-4xl'>Submission(s)</h2>
                                <div className='flex flex-col space-y-14'>
                                    {fields.map((field, index) => (
                                        <div key={field.id} className='relative h-fit flex flex-col space-y-4'>             
                                            <FormField
                                                control={form.control}
                                                name={`submissions.${index}.title`}
                                                render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Submission Title</FormLabel>
                                                    <FormControl>
                                                        <Input required {...form.register(`submissions.${index}.title`)} placeholder='Enter your submission title'/>
                                                    </FormControl>
                                                    <FormDescription />
                                                    <FormMessage />
                                                </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`submissions.${index}.type`}
                                                render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Submission Type</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue required {...form.register(`submissions.${index}.type`)} placeholder="Select an entry type for your submission" />
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
                                                control={form.control}
                                                name={`submissions.${index}.file`}
                                                render={( { field: { value, onChange, ...fieldProps }  }) => (
                                                <FormItem>
                                                    <FormLabel>File Submission</FormLabel>
                                                    <FormControl>
                                                        <input 
                                                        {...fieldProps}
                                                        type="file"
                                                        required 
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                handleFileChange(file, index);
                                                            }
                                                        }}
                                                        placeholder="Select file for your submission" 
                                                        className='"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"'
                                                        />
                                                    </FormControl>
                                                    <FormDescription />
                                                    <FormMessage />
                                                </FormItem>
                                                )}
                                            />
                                            <div className='flex justify-end'>
                                                <Button variant='destructive' type="button" onClick={() => remove(index)}>
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button className='mt-20' onClick={handleAddSubmission} variant='secondary' type='button'>
                                    Add Submission
                                </Button>
                            </div>
                            {formSubmitting == false ? 
                            <Button type='submit'>
                                Submit
                            </Button> :
                            <Button disabled type='submit'>
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                Form submitting...
                            </Button> 
                            }
                        </form>
                    </Form>
                </section>  
            }

            <Toaster/>          
        </section>
    )
}
