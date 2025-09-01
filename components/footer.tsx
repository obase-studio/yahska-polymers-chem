import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Send,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      {/* Newsletter Section */}
      {/* <div className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Stay Updated with Industry Insights
            </h3>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest product updates, industry trends, and technical insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email address"
                className="bg-primary-foreground text-primary placeholder:text-primary/60"
              />
              <Button variant="secondary" size="default">
                <Send className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-bold text-primary mb-4">
              Yahska Polymers
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Leading manufacturer of construction chemicals, concrete
              admixtures, textile chemicals, and dyestuff chemicals with over 20
              years of industry excellence.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>
                  Plot No. 123, Industrial Area, Ahmedabad - 380015, Gujarat
                </span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>+91 98250 12345</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>info@yahskapolymers.in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/clients"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Clients
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Our Products</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products?category=construction"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Construction Chemicals
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=concrete"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Concrete Admixtures
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=textile"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Textile Chemicals
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=dyestuff"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Dyestuff Chemicals
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Custom Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Services & Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              Services & Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Technical Support
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Quality Assurance
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Application Guidance
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Career Opportunities
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  News & Updates
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Business Hours and Certifications */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h4 className="font-semibold text-foreground mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Business Hours
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span>9:00 AM - 1:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
              </div>
              <div className="mt-4 text-xs">
                <span className="text-accent font-medium">
                  Emergency Support:
                </span>{" "}
                Available 24/7 for critical requirements
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">
              Quality Certifications
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>• ISO 9001:2015 - Quality Management System</div>
              <div>• ISO 14001:2015 - Environmental Management</div>
              <div>• OHSAS 18001 - Occupational Health & Safety</div>
              <div>• BIS Certification - Bureau of Indian Standards</div>
              <div className="mt-4 text-xs">
                <span className="text-accent font-medium">Established:</span>{" "}
                2003 |{" "}
                <span className="text-accent font-medium">Experience:</span> 20+
                Years
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-muted-foreground">
            © 2024 Yahska Polymers Private Limited. All rights reserved.
          </div>

          {/* Social Media Links */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground mr-2">
              Follow us:
            </span>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </Link>
          </div>

          {/* Legal Links */}
          <div className="flex items-center space-x-4 text-sm">
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
