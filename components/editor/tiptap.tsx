'use client'
import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Toolbar from './toolbar'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import TextAlign from '@tiptap/extension-text-align'

type TipTapProps = {
    initialValue: string;
    onChange: (richText: string) => void;
}

const Tiptap = ({initialValue,onChange}:TipTapProps) => {
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}), 
      Heading.configure({
      HTMLAttributes: {
        class: 'text-xl font-bold',
        levels: [2]
      },
      
    }),
    BulletList.configure({
      HTMLAttributes: { 
        class: "list-disc ml-5" 
      }
    }),
    OrderedList.configure({
      HTMLAttributes: { 
        class: "list-decimal ml-5" 
      }
    }),
    ],
    content: initialValue,
    editorProps: {
      attributes: {
        class:
        'rounded-md border min-h-[150px] p-3 border-input bg-back'
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      console.log(editor.getHTML())
    },
  });

  const handleBold = useCallback(() => {
    if (editor) {
      editor.chain().focus().toggleBold().run();
    }
  }, [editor]);

  const handleHeading = useCallback((level: any) => {
    if (editor) {
      editor.chain().focus().toggleHeading({ level }).run();
    }
  }, [editor]);

  return (
    <div className='flex flex-col justify-stretch'>
      <Toolbar editor={editor}/>
      
      <EditorContent  editor={editor} />

    </div>
  );
};

export default Tiptap;

