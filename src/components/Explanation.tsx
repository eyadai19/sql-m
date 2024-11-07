'use client'



import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from 'lucide-react'
import CodeBlock from './CodeBlock'

interface ExplanationProps {
  title?: string
  howItWorks: string
  syntax: string
  example: {
    code: string
    explanation: string
  }
  notes: string[]
}



export default function Explanation({ title = "Getting Started", howItWorks, syntax, example, notes }: ExplanationProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto backdrop-blur-xl bg-white/40 shadow-lg mb-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-sailorBlue">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-sailorBlue">How It Works</h2>
          <p className="text-sailorBlue text-base">{howItWorks}</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-sailorBlue">Syntax</h2>
          <CodeBlock initialCode={syntax} />
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-sailorBlue">Example</h2>
          <CodeBlock initialCode={example.code} />
          <p className="text-sailorBlue text-base mt-2">{example.explanation}</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-sailorBlue">Notes & Tips</h2>
          <Card className="bg-gray-100/40 border-sailorBlue/40">
            <CardContent className="p-4">
              <ul className="list-disc pl-5 space-y-2">
                {notes.map((note, index) => (
                  <li key={index} className="text-sailorBlue text-base flex items-start">
                    <AlertCircle className="mr-2 h-5 w-5 text-sailorBlue flex-shrink-0 mt-0.5" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </CardContent>
    </Card>
  )
}