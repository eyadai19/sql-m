import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
interface headingProps {
    title: string,
    subtitle?: string,
}
export default function Heading({title, subtitle}:headingProps) {
    
  return (
      <Card className="w-full max-w-4xl mx-auto  overflow-hidden border-0">
        <div className="bg-gradient-to-br from-sailorBlue via-lightSailorBlue to-mint ">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white mb-1">
              {title}
            </CardTitle>
            <CardDescription className="text-lg text-gray-200">
              {subtitle}
            </CardDescription>
          </CardHeader>
        </div>
      </Card>
  )
}