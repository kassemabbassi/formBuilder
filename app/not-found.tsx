import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Form Not Found</CardTitle>
          <CardDescription>The form you're looking for doesn't exist or has been deactivated.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/">
            <Button>Go to Homepage</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
