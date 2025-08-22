import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContentEditor } from "@/components/admin/content-editor"

export default function ContentPage() {
  const contentSections: Record<string, Array<{
    id: string
    title: string
    description: string
    fields: Array<{
      key: string
      label: string
      type: 'text' | 'textarea' | 'rich_text' | 'number' | 'select' | 'image' | 'link' | 'boolean'
      options?: string[]
      placeholder?: string
      help?: string
    }>
  }>> = {
    home: [
      {
        id: 'hero',
        title: 'Homepage Hero Section',
        description: 'Main headline and hero content for the homepage',
        fields: [
          { 
            key: 'headline', 
            label: 'Main Headline', 
            type: 'text' as const,
            placeholder: 'Welcome to Yahska Polymers',
            help: 'The main title that appears prominently on the homepage'
          },
          { 
            key: 'subheadline', 
            label: 'Sub Headline', 
            type: 'textarea' as const,
            placeholder: 'Leading Chemical Solutions for Industrial Excellence',
            help: 'Supporting text that appears below the main headline'
          },
          { 
            key: 'cta_text', 
            label: 'CTA Button Text', 
            type: 'text' as const,
            placeholder: 'Get Started Today',
            help: 'Text for the main call-to-action button'
          },
          { 
            key: 'hero_image', 
            label: 'Hero Background Image', 
            type: 'image' as const,
            help: 'Background image for the hero section'
          }
        ]
      },
      {
        id: 'stats',
        title: 'Company Statistics',
        description: 'Key numbers and achievements to display',
        fields: [
          { 
            key: 'years_experience', 
            label: 'Years of Experience', 
            type: 'number' as const,
            placeholder: '20',
            help: 'Number of years in business'
          },
          { 
            key: 'happy_clients', 
            label: 'Happy Clients', 
            type: 'number' as const,
            placeholder: '500',
            help: 'Number of satisfied clients'
          },
          { 
            key: 'product_range', 
            label: 'Product Range', 
            type: 'number' as const,
            placeholder: '100',
            help: 'Number of products in our range'
          },
          { 
            key: 'quality_assured', 
            label: 'Quality Assured', 
            type: 'text' as const,
            placeholder: 'ISO 9001:2015',
            help: 'Quality certification or assurance text'
          }
        ]
      },
      {
        id: 'about',
        title: 'About Company',
        description: 'Company information and story',
        fields: [
          { 
            key: 'company_story', 
            label: 'Company Story', 
            type: 'rich_text' as const,
            placeholder: 'Tell your company story here...',
            help: 'Detailed company history and background (supports HTML)'
          },
          { 
            key: 'mission', 
            label: 'Mission Statement', 
            type: 'textarea' as const,
            placeholder: 'Our mission is to...',
            help: 'Company mission statement'
          },
          { 
            key: 'vision', 
            label: 'Vision Statement', 
            type: 'textarea' as const,
            placeholder: 'Our vision is to...',
            help: 'Company vision statement'
          },
          { 
            key: 'values', 
            label: 'Core Values', 
            type: 'textarea' as const,
            placeholder: 'Quality, Innovation, Integrity...',
            help: 'List of core company values'
          }
        ]
      },
      {
        id: 'contact',
        title: 'Contact Information',
        description: 'Company contact details',
        fields: [
          { 
            key: 'address', 
            label: 'Company Address', 
            type: 'textarea' as const,
            placeholder: 'Enter your company address',
            help: 'Full company address'
          },
          { 
            key: 'phone', 
            label: 'Phone Number', 
            type: 'text' as const,
            placeholder: '+91 98250 12345',
            help: 'Main contact phone number'
          },
          { 
            key: 'email', 
            label: 'Email Address', 
            type: 'text' as const,
            placeholder: 'info@yahskapolymers.com',
            help: 'Main contact email address'
          },
          { 
            key: 'business_hours', 
            label: 'Business Hours', 
            type: 'textarea' as const,
            placeholder: 'Monday - Friday: 9:00 AM - 6:00 PM',
            help: 'Business operating hours'
          }
        ]
      }
    ],
    about: [
      {
        id: 'company_overview',
        title: 'Company Overview',
        description: 'Detailed company information',
        fields: [
          { 
            key: 'company_description', 
            label: 'Company Description', 
            type: 'rich_text' as const,
            placeholder: 'Detailed company description...',
            help: 'Comprehensive company overview'
          },
          { 
            key: 'founded_year', 
            label: 'Founded Year', 
            type: 'number' as const,
            placeholder: '2005',
            help: 'Year the company was established'
          },
          { 
            key: 'headquarters', 
            label: 'Headquarters', 
            type: 'text' as const,
            placeholder: 'Mumbai, Maharashtra',
            help: 'Company headquarters location'
          },
          { 
            key: 'team_size', 
            label: 'Team Size', 
            type: 'number' as const,
            placeholder: '150',
            help: 'Number of employees'
          }
        ]
      },
      {
        id: 'leadership',
        title: 'Leadership Team',
        description: 'Information about company leadership',
        fields: [
          { 
            key: 'ceo_name', 
            label: 'CEO Name', 
            type: 'text' as const,
            placeholder: 'Enter CEO name',
            help: 'Name of the Chief Executive Officer'
          },
          { 
            key: 'ceo_bio', 
            label: 'CEO Biography', 
            type: 'textarea' as const,
            placeholder: 'CEO background and experience...',
            help: 'Brief biography of the CEO'
          },
          { 
            key: 'ceo_image', 
            label: 'CEO Photo', 
            type: 'image' as const,
            help: 'CEO profile photograph'
          }
        ]
      }
    ],
    products: [
      {
        id: 'product_intro',
        title: 'Products Introduction',
        description: 'Introduction text for the products page',
        fields: [
          { 
            key: 'products_headline', 
            label: 'Products Page Headline', 
            type: 'text' as const,
            placeholder: 'Our Product Range',
            help: 'Main title for the products page'
          },
          { 
            key: 'products_description', 
            label: 'Products Description', 
            type: 'textarea' as const,
            placeholder: 'Description of your product range...',
            help: 'Overview of your product offerings'
          },
          { 
            key: 'show_pricing', 
            label: 'Show Product Pricing', 
            type: 'boolean' as const,
            help: 'Enable to display product pricing on the website'
          }
        ]
      }
    ],
    projects: [
      {
        id: 'portfolio_intro',
        title: 'Portfolio Introduction',
        description: 'Introduction for the projects portfolio page',
        fields: [
          { 
            key: 'portfolio_headline', 
            label: 'Portfolio Headline', 
            type: 'text' as const,
            placeholder: 'Our Project Portfolio',
            help: 'Main title for the projects page'
          },
          { 
            key: 'portfolio_description', 
            label: 'Portfolio Description', 
            type: 'textarea' as const,
            placeholder: 'Description of your project portfolio...',
            help: 'Overview of your completed projects'
          },
          { 
            key: 'show_stats', 
            label: 'Show Project Statistics', 
            type: 'boolean' as const,
            help: 'Enable to display project statistics on the page'
          }
        ]
      }
    ]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
        <p className="text-muted-foreground">
          Edit website content, text, and messaging across all pages
        </p>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="home" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="home">Homepage</TabsTrigger>
          <TabsTrigger value="about">About Page</TabsTrigger>
          <TabsTrigger value="products">Products Page</TabsTrigger>
          <TabsTrigger value="projects">Projects Page</TabsTrigger>
        </TabsList>

        {/* Homepage Content */}
        <TabsContent value="home" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Homepage Content</h2>
            <p className="text-muted-foreground">
              Manage the main content sections of your homepage
            </p>
          </div>
          
          {contentSections.home.map((section) => (
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
        </TabsContent>

        {/* About Page Content */}
        <TabsContent value="about" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">About Page Content</h2>
            <p className="text-muted-foreground">
              Manage content for the about us page
            </p>
          </div>
          
          {contentSections.about.map((section) => (
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
        </TabsContent>

        {/* Products Page Content */}
        <TabsContent value="products" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Products Page Content</h2>
            <p className="text-muted-foreground">
              Manage content for the products page
            </p>
          </div>
          
          {contentSections.products.map((section) => (
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
        </TabsContent>

        {/* Projects Page Content */}
        <TabsContent value="projects" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Projects Page Content</h2>
            <p className="text-muted-foreground">
              Manage content for the projects portfolio page
            </p>
          </div>
          
          {contentSections.projects.map((section) => (
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
        </TabsContent>
      </Tabs>
    </div>
  )
}