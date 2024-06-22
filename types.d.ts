import { PHASE_DEVELOPMENT_SERVER } from "next/dist/shared/lib/constants";

type SubmissionDto = {
    bio:string,
    email:string,
    name:string,
    city:string,
    highSchool:string,
    title:string,
    text:string,
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