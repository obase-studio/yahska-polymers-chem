"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"

interface ClientsListProps {
  testimonials: any[]
}

export function ClientsList({ testimonials }: ClientsListProps) {
  if (testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-muted/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No client testimonials yet</h3>
        <p className="text-muted-foreground mb-4">
          Add your first client testimonial to showcase partnerships.
        </p>
        <Button asChild>
          <Link href="/admin/clients/new">
            <Plus className="h-4 w-4 mr-2" />
            Add First Client
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {testimonials.map((testimonial: any) => (
        <div key={testimonial.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-medium">{testimonial.client_name}</h3>
              <Badge variant="secondary">{testimonial.client_description}</Badge>
              {testimonial.partnership_years && (
                <Badge variant="outline">{testimonial.partnership_years} Partnership</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {testimonial.testimonial_text}
            </p>
            {testimonial.logo_url && (
              <p className="text-xs text-muted-foreground">
                Logo: {testimonial.logo_url}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/admin/clients/${testimonial.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}