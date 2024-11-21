import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertCircle, BookOpen, Code, Lightbulb, Copy, Check, ChevronDown, ExternalLink } from 'lucide-react';
import CodeBlock from '..//CodeBlock';
import { cn } from '@/lib/utils';

interface ExplanationProps {
  title?: string;
  howItWorks: string;
  syntax: string;
  example: {
    code: string;
    explanation: string;
    liveDemo?: React.ReactNode;
  };
  notes: string[];
  additionalResources?: {
    title: string;
    url: string;
  }[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  tags?: string[];
}

export default function Explanation({
  title = "Getting Started",
  howItWorks,
  syntax,
  example,
  notes,
  additionalResources = [],
  difficulty = 'Beginner',
  tags = []
}: ExplanationProps) {
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('explanation');

  const difficultyColor = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800'
  }[difficulty];

  return (
    <Card className="w-full max-w-4xl mx-auto backdrop-blur-xl bg-white/40 shadow-lg mb-3">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-sailorBlue">{title}</CardTitle>
          <Badge className={cn("ml-2", difficultyColor)}>
            {difficulty}
          </Badge>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="explanation" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Explanation
            </TabsTrigger>
            <TabsTrigger value="implementation" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Implementation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explanation" className="space-y-6 mt-6">
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-sailorBlue flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                How It Works
              </h2>
              <p className="text-sailorBlue text-base">{howItWorks}</p>
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
          </TabsContent>

          <TabsContent value="implementation" className="space-y-6 mt-6">
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-sailorBlue">Syntax</h2>
              <CodeBlock initialCode={syntax} />
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-sailorBlue">Example</h2>
              <CodeBlock initialCode={example.code} />
              <p className="text-sailorBlue text-base mt-2">{example.explanation}</p>
              
              {example.liveDemo && (
                <Card className="mt-4 p-4 border-2 border-sailorBlue/10">
                  <h3 className="text-lg font-semibold text-sailorBlue mb-4">Live Demo</h3>
                  <div className="bg-white rounded-lg p-4">
                    {example.liveDemo}
                  </div>
                </Card>
              )}
            </section>
          </TabsContent>
        </Tabs>

        {additionalResources.length > 0 && (
          <Collapsible
            open={isResourcesOpen}
            onOpenChange={setIsResourcesOpen}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex items-center justify-between p-4"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Additional Resources
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isResourcesOpen && "rotate-180"
                  )}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <Card className="bg-gray-100/40">
                <CardContent className="p-4">
                  <ul className="space-y-2">
                    {additionalResources.map((resource, index) => (
                      <li key={index}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sailorBlue hover:text-sailorBlue/80 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          {resource.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}