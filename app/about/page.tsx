import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Users, Factory, Target, Eye, Heart } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1
              className="text-4xl lg:text-5xl font-black text-foreground mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              About Yahska Polymers
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Two decades of excellence in chemical manufacturing, serving industries with innovative solutions and
              unwavering commitment to quality.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Established in 2003, Yahska Polymers Private Limited has grown from a small chemical manufacturing
                  unit to become a trusted name in the industry. Based in Ahmedabad, Gujarat, we have been serving
                  diverse industries with high-quality chemical solutions for over two decades.
                </p>
                <p>
                  Our journey began with a simple vision: to provide superior chemical products that enhance industrial
                  processes and deliver exceptional value to our clients. Today, we stand as a testament to that vision,
                  having built lasting relationships with clients across construction, textile, dyestuff, and various
                  other industries.
                </p>
                <p>
                  With state-of-the-art manufacturing facilities and a team of experienced professionals, we continue to
                  innovate and expand our product portfolio to meet the evolving needs of modern industries.
                </p>
              </div>
            </div>
            <div>
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Yahska Polymers Manufacturing Facility"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-primary">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To deliver innovative, high-quality chemical solutions that enhance industrial processes while
                  maintaining the highest standards of safety and environmental responsibility.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-primary">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To be the leading chemical solutions provider globally, recognized for innovation, quality, and
                  customer satisfaction across all industries we serve.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-primary">Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Integrity, innovation, quality excellence, customer focus, environmental stewardship, and continuous
                  improvement in everything we do.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Why We Stand Out
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our commitment to excellence is reflected in every aspect of our operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4">ISO Certified</h3>
              <p className="text-muted-foreground">
                Quality management systems certified to international standards ensuring consistent product quality.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Factory className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Modern Facilities</h3>
              <p className="text-muted-foreground">
                State-of-the-art manufacturing equipment and quality control laboratories for superior products.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Expert Team</h3>
              <p className="text-muted-foreground">
                Experienced chemists and engineers dedicated to innovation and customer satisfaction.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Customer Focus</h3>
              <p className="text-muted-foreground">
                Tailored solutions and comprehensive support to meet specific industry requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Information */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                Company Details
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Established</h4>
                    <p className="text-muted-foreground">2003</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Company Age</h4>
                    <p className="text-muted-foreground">20+ Years</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Legal Status</h4>
                    <p className="text-muted-foreground">Private Limited Company</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Location</h4>
                    <p className="text-muted-foreground">Ahmedabad, Gujarat</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Business Type</h4>
                  <p className="text-muted-foreground">
                    Manufacturer and Supplier of Construction Chemicals, Concrete Admixtures, Textile Chemicals, and
                    Dyestuff Chemicals
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Key Personnel</h4>
                  <p className="text-muted-foreground">
                    Led by experienced professionals with decades of combined experience in chemical manufacturing and
                    business development
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                Our Commitment
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  At Yahska Polymers, we are committed to delivering products that not only meet but exceed industry
                  standards. Our rigorous quality control processes ensure that every batch of chemicals leaving our
                  facility maintains the highest level of consistency and performance.
                </p>
                <p>
                  We believe in building long-term partnerships with our clients by providing reliable products,
                  competitive pricing, and exceptional customer service. Our technical support team works closely with
                  customers to understand their specific requirements and provide tailored solutions.
                </p>
                <p>
                  Environmental responsibility is at the core of our operations. We continuously invest in cleaner
                  technologies and sustainable practices to minimize our environmental footprint while maintaining
                  operational efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Partner with Experience
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join hundreds of satisfied clients who trust Yahska Polymers for their chemical solution needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Get in Touch</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              <Link href="/products">View Our Products</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
