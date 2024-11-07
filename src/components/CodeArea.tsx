'use client'
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// Define props for the component
interface CodeAreaProps {
  initialCode?: string;
}


// Custom theme based on the dracula theme but using sailorBlue and mint colors
const customStyle = {
  ...dracula,
  'code[class*="language-"]': {
    backgroundColor: '#00203F', // sailorBlue background
    color: '#ADF0D1', // mint text color
  },
  'pre[class*="language-"]': {
    backgroundColor: '#00203F', // sailorBlue background
    color: '#ADF0D1', // mint text color
    borderRadius: '0.5rem',
    padding: '1rem',
    marginBlock: '1rem',
    fontSize: '0.85rem'
  },
};

export default function CodeBlock({ initialCode = "" }: CodeAreaProps) {
  const [code, setCode] = useState(initialCode);

  return (
    <div >
      <SyntaxHighlighter
        style={customStyle}
        showLineNumbers={true}
        wrapLines={true}
        className="rounded-md"
      >
        {code || "/* No code to display */"}
      </SyntaxHighlighter>
    </div>
  );
}
