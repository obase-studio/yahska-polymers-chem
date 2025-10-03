import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail } from "lucide-react";
import { supabaseHelpers } from "@/lib/supabase-helpers";

function getContentValue(
  items: any[],
  section: string,
  key: string,
  fallback: string
) {
  return (
    items
      .find((item) => item.section === section && item.content_key === key)
      ?.content_value?.trim() || fallback
  );
}

export default async function ContactPage() {
  let contactContent: any[] = [];

  try {
    contactContent = await supabaseHelpers.getContent("contact");
  } catch (error) {
    console.error("Failed to load contact page content:", error);
  }

  const heroHeadline = getContentValue(
    contactContent,
    "hero",
    "headline",
    "Contact Us"
  );

  const heroDescription = getContentValue(
    contactContent,
    "hero",
    "description",
    ""
  );

  const locationsContent = getContentValue(
    contactContent,
    "locations",
    "content",
    ""
  );

  const phoneNumber = getContentValue(
    contactContent,
    "contact_details",
    "phone",
    ""
  );

  const emailAddress = getContentValue(
    contactContent,
    "contact_details",
    "email",
    ""
  );

  const sanitizedTel = phoneNumber.replace(/[^0-9+]/g, "");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-6">
            <h1
              className="text-4xl lg:text-5xl text-foreground mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {heroHeadline}
            </h1>
            {heroDescription && (
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {heroDescription}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="space-y-8 w-full max-w-2xl">
              <div>
                <div className="space-y-6">
                  {locationsContent && (
                    <Card className="py-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 justify-center">
                          <MapPin className="h-5 w-5 text-primary" />
                          Our Locations
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-muted-foreground whitespace-pre-line">
                          {locationsContent}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {phoneNumber && (
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
                            href={`tel:${sanitizedTel}`}
                            className="hover:text-primary"
                          >
                            {phoneNumber}
                          </a>
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {emailAddress && (
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
                            href={`mailto:${emailAddress}`}
                            className="hover:text-primary"
                          >
                            {emailAddress}
                          </a>
                        </p>
                      </CardContent>
                    </Card>
                  )}
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
