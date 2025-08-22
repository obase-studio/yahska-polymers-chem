import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SEOForm } from "@/components/admin/seo-form"
import { dbHelpers } from "@/lib/database"

export default async function SEOPage() {
  const seoSettings = dbHelpers.getAllSEOSettings()

  const pages = [
    { id: 'home', name: 'Homepage', description: 'Main landing page' },
    { id: 'about', name: 'About Us', description: 'Company information page' },
    { id: 'products', name: 'Products', description: 'Product catalog page' },
    { id: 'contact', name: 'Contact', description: 'Contact information page' },
    { id: 'clients', name: 'Clients', description: 'Client testimonials page' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SEO Management</h1>
        <p className="text-muted-foreground">
          Manage meta tags, descriptions, and SEO settings for each page
        </p>
      </div>

      {/* SEO Settings for each page */}
      <div className="space-y-6">
        {pages.map((page) => {
          const currentSEO = seoSettings.find((seo: any) => seo.page === page.id)
          
          return (
            <Card key={page.id}>
              <CardHeader>
                <CardTitle>{page.name}</CardTitle>
                <CardDescription>{page.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <SEOForm page={page.id} currentSEO={currentSEO} />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}