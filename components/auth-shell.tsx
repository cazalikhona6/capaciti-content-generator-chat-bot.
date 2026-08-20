import { Sparkles } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function AuthShell({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 bg-muted/40 px-4 py-12">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="brand-gradient flex size-11 items-center justify-center rounded-xl text-primary-foreground shadow-sm">
          <Sparkles className="size-5" />
        </div>
        <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          CAPACITI Content Studio
        </p>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-balance">{title}</CardTitle>
          <CardDescription className="text-pretty">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </main>
  )
}
