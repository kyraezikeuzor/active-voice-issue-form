import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const hasEmptyValues = (data: any): boolean => {
  for (const key in data) {
      if (!data[key]) {
          return true; // Found an empty value
      }
  }
  return false; // No empty values found
};


export const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export function formatTimestamp(timestamp:any) {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    timeZoneName: 'short' as const 
  };
  const date = new Date(timestamp);
  
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const formattedDate = formatter.format(date);

  // Split the formatted date to rearrange components
  const [weekday, month, day, time, period, timezoneName] = formattedDate.split(/,?\s+/);
  
  return `${weekday}, ${month} ${day} ${time} ${period} ${timezoneName} ET`;
}


export function formatIssueString(issueString:string) {
  return issueString
    .toLowerCase()    // Convert to lowercase
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/#/g, '');   // Remove the hash symbol
}