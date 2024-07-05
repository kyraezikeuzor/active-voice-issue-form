import { PHASE_DEVELOPMENT_SERVER } from "next/dist/shared/lib/constants";

type SubmissionFileDto = {
    name: string,
    type: string,
    size: number,
    content: ArrayBuffer
}

type File = {
    lastModified: number,
    lastModified: Date,
    name: string,
    size: number,
    type: string,
    webkitRelativePath: string,
}


type SubmissionDto = {
    bio:string,
    email:string,
    name:string,
    city:string,
    highSchool:string,
    title:string,
    file: SubmissionFileDto,
    issueId:number,
    submissionType:string
}

type SubmissionDB = {
    bio:string,
    email:string,
    name:string,
    city:string,
    highSchool:string,
    title:string,
    file: {
        name: string,
        type: string,
        size: number,
        url: string,
    },
    issueId:number,
    submissionType:string
}

type Issue = {
    id:number,
    title:string,
    description:string,
    startDate:any,
    endDate:any,
    active:boolean,
}