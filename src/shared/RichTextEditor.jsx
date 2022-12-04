import React from 'react'
import dynamic from 'next/dynamic'

const QullEditor = dynamic(import("react-quill"), {ssr: false})

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['link'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean'],                                         // remove formatting button
  ];
  

const RichTextEditor = ({ handler, defaultValue,placeholder }) => {
    return (
        <QullEditor modules={{toolbar:toolbarOptions}} onChange={(data) => handler(data)} theme="snow" placeholder={ placeholder ?? 'Enter Your Paragraph'} defaultValue={defaultValue} />
    )
}

export default RichTextEditor