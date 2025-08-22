import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { dbHelpers } from "@/lib/database"
import { ClientsList } from "@/components/admin/clients-list"

export default async function ClientsPage() {
  const testimonials = dbHelpers.getAllTestimonials()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Management</h1>
          <p className="text-muted-foreground">
            Manage client testimonials and partnerships
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/clients/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Link>
        </Button>
      </div>

      {/* Clients List */}
      <Card>
        <CardHeader>
          <CardTitle>Client Testimonials</CardTitle>
          <CardDescription>
            {testimonials.length} client testimonials and partnerships
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientsList testimonials={testimonials} />
        </CardContent>
      </Card>
    </div>
  )
}