import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactPage() {

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-6">
            <h1
              className="text-4xl lg:text-5xl font-black text-foreground mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Get in touch with our experts for customized chemical solutions.
              We're here to help you find the perfect products for your
              industrial needs.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Contact Information - Centered */}
          <div className="flex justify-center">
            <div className="space-y-8 w-full max-w-2xl">
              <div>
                <h3
                  className="text-2xl font-bold text-foreground mb-6 text-center"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Get In Touch
                </h3>

                <div className="space-y-6">
                  <Card className="py-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                        Our Locations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <h4 className="font-semibold mb-2">
                          Unit 1 - Changodar
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          S. No 407, Khata No 1217, Bh Sarvodaya Hotel,
                          <br />
                          Moraiya, Changodar, Ahmedabad – 382213
                        </p>
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold mb-2">Unit 2 - Vatva</h4>
                        <p className="text-muted-foreground text-sm">
                          C-1/127, Phase I, Nr Tiger Surgical,
                          <br />
                          GIDC Vatva, Ahmedabad – 382245
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="py-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                        Phone
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground">
                        <a
                          href="tel:+918890913222"
                          className="hover:text-primary"
                        >
                          +91-8890913222
                        </a>
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="py-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                        Email
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground">
                        <a
                          href="mailto:admin@yahskapolymers.com"
                          className="hover:text-primary"
                        >
                          admin@yahskapolymers.com
                        </a>
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
