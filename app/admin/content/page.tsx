import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContentEditor } from "@/components/admin/content-editor"

export default function ContentPage() {
  const contentSections = [
    {
      id: 'hero',
      title: 'Homepage Hero Section',
      description: 'Main headline and hero content',
      fields: [
        { key: 'headline', label: 'Main Headline', type: 'text' },
        { key: 'subheadline', label: 'Sub Headline', type: 'textarea' },
        { key: 'cta_text', label: 'CTA Button Text', type: 'text' }
      ]
    },
    {
      id: 'stats',
      title: 'Company Statistics',
      description: 'Key numbers and achievements',
      fields: [
        { key: 'years_experience', label: 'Years of Experience', type: 'text' },
        { key: 'happy_clients', label: 'Happy Clients', type: 'text' },
        { key: 'product_range', label: 'Product Range', type: 'text' },
        { key: 'quality_assured', label: 'Quality Assured', type: 'text' }
      ]
    },
    {
      id: 'about',
      title: 'About Company',
      description: 'Company information and story',
      fields: [
        { key: 'company_story', label: 'Company Story', type: 'textarea' },
        { key: 'mission', label: 'Mission Statement', type: 'textarea' },
        { key: 'vision', label: 'Vision Statement', type: 'textarea' }
      ]
    },
    {
      id: 'contact',
      title: 'Contact Information',
      description: 'Company contact details',
      fields: [
        { key: 'address', label: 'Company Address', type: 'textarea' },
        { key: 'phone', label: 'Phone Number', type: 'text' },
        { key: 'email', label: 'Email Address', type: 'text' }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
        <p className="text-muted-foreground">
          Edit website content and messaging
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {contentSections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ContentEditor section={section} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}