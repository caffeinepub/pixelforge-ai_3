import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Images, Sparkles, Star, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const features = [
  {
    icon: Zap,
    title: "Unlimited Generation",
    description:
      "Create as many images as you want — no caps, no throttling, no waiting.",
  },
  {
    icon: Images,
    title: "Persistent Gallery",
    description:
      "All your generations are saved and accessible from any device, forever.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Quality",
    description:
      "State-of-the-art models produce photorealistic and artistic results from any prompt.",
  },
];

const examplePrompts = [
  "A minimalist architect's studio at dusk with soft diffused lighting",
  "Bioluminescent deep sea creatures in an underwater canyon",
  "Tokyo street food market at night, neon reflections on wet pavement",
  "Abstract geometric landscape with vibrant sunset colors",
];

export default function LandingPage() {
  const { isAuthenticated, login, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/generate" });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-background">
        {/* Background image */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url(/assets/generated/hero-neurogen.dim_1400x787.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.12 0 0 / 0.7) 0%, oklch(0.12 0 0 / 0.4) 50%, oklch(0.12 0 0 / 0.95) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              className="mb-6 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-accent/20 text-accent border-accent/30"
              data-ocid="badge-unlimited"
            >
              <Star className="w-3 h-3" />
              Unlimited Generations — No Limits
            </Badge>
          </motion.div>

          <motion.h1
            className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.05]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Turn words into <span className="text-accent">stunning images</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Describe any image you can imagine. NeurōGen brings it to life
            instantly — with no generation limits, persistent gallery, and
            secure Internet Identity login.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              size="lg"
              onClick={login}
              disabled={isLoading}
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-base font-semibold px-8 py-6 shadow-elevation transition-smooth group"
              data-ocid="btn-hero-login"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-smooth" />
              {isLoading ? "Connecting…" : "Start Generating Free"}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-smooth" />
            </Button>
          </motion.div>

          {/* Example prompts */}
          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <p className="w-full text-xs text-muted-foreground mb-1 uppercase tracking-widest">
              Try prompts like
            </p>
            {examplePrompts.map((prompt) => (
              <span
                key={prompt}
                className="px-3 py-1.5 rounded-full text-xs bg-card/60 border border-border text-muted-foreground backdrop-blur-sm"
              >
                {prompt}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything you need to create
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A professional-grade AI image studio, accessible to everyone.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }, index) => (
              <motion.div
                key={title}
                className="bg-card border border-border rounded-lg p-6 shadow-xs hover:shadow-elevation transition-smooth"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                data-ocid={`feature-card-${index}`}
              >
                <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-background py-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to create something{" "}
              <span className="text-accent">remarkable?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Sign in with Internet Identity — secure, private, no password
              required.
            </p>
            <Button
              size="lg"
              onClick={login}
              disabled={isLoading}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-base shadow-elevation"
              data-ocid="btn-cta-login"
            >
              {isLoading ? "Connecting…" : "Get started — it's free"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
