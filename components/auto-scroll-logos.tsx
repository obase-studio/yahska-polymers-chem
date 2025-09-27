"use client";

import { Card, CardContent } from "@/components/ui/card";

interface Logo {
  id: string;
  file_path: string;
  original_name: string;
  alt_text?: string;
}

interface AutoScrollLogosProps {
  logos: Logo[];
  title: string;
  description: string;
  className?: string;
}

export function AutoScrollLogos({
  logos,
  title,
  description,
  className = "",
}: AutoScrollLogosProps) {
  if (!logos || logos.length === 0) {
    return (
      <section className={`py-12 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {description}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Loading logos...</p>
          </div>
        </div>
      </section>
    );
  }

  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos];

  // Calculate consistent scroll speed: each logo should take ~4 seconds to pass (slower)
  const logoWidth = 200; // 180px width + 20px gap
  const speedPerLogo = 4; // seconds per logo (increased from 2.5 for slower scrolling)
  const animationDuration = Math.max(
    logos.length * speedPerLogo,
    speedPerLogo * 4
  );

  return (
    <section className={`py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex items-center gap-6 hover:pause-animation"
            style={{
              width: `${duplicatedLogos.length * logoWidth}px`,
              animation: `scroll ${animationDuration}s linear infinite`,
            }}
          >
            {duplicatedLogos.map((logo, index) => (
              <Card
                key={`${logo.id}-${index}`}
                className="flex-shrink-0 bg-background border-0 shadow-none"
                style={{ width: "180px" }}
              >
                <CardContent className="p-3 flex items-center justify-center h-20">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={logo.file_path}
                      alt={
                        logo.alt_text ||
                        logo.original_name.replace(
                          /\.(jpg|jpeg|png|webp|svg)$/i,
                          ""
                        )
                      }
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        console.log("Image failed to load:", logo.file_path, e);
                        // Fallback to company name text when image is unavailable
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class=\"text-xs text-center text-muted-foreground p-2\">${logo.original_name.replace(
                            /\.(jpg|jpeg|png|webp|svg)$/i,
                            ""
                          )}</div>`;
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .hover\\:pause-animation:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
