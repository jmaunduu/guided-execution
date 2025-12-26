import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "sm": "640px",
        "md": "768px",
        "lg": "1024px",
        "xl": "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Semantic colors - blue/orange focused
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(0 0% 100%)",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(0 0% 100%)",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(0 0% 100%)",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(0 0% 100%)",
        },
        // Chart colors
        chart: {
          blue: "hsl(var(--chart-blue))",
          orange: "hsl(var(--chart-orange))",
          purple: "hsl(var(--chart-purple))",
          cyan: "hsl(var(--chart-cyan))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        button: "var(--radius-button)",
        input: "var(--radius-input)",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      spacing: {
        "xs": "4px",
        "sm": "8px",
        "md": "16px",
        "lg": "24px",
        "xl": "32px",
        "2xl": "48px",
      },
      fontSize: {
        hero: ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "hero-lg": ["56px", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" }],
        heading: ["18px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        body: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        label: ["12px", { lineHeight: "1.4", letterSpacing: "0.05em", fontWeight: "500" }],
        micro: ["11px", { lineHeight: "1.3", fontWeight: "400" }],
      },
      boxShadow: {
        farm: "0 1px 3px rgba(0, 0, 0, 0.6)",
        "farm-md": "0 8px 32px rgba(59, 130, 246, 0.1)",
        "farm-lg": "0 16px 48px rgba(59, 130, 246, 0.15)",
        "success": "0 4px 12px rgba(59, 130, 246, 0.4)",
        "danger": "0 4px 12px rgba(239, 68, 68, 0.4)",
        "glow-blue": "0 0 40px rgba(59, 130, 246, 0.4), 0 8px 32px rgba(59, 130, 246, 0.2)",
        "glow-orange": "0 0 40px rgba(249, 115, 22, 0.4), 0 8px 32px rgba(249, 115, 22, 0.2)",
        "card-hover": "0 20px 60px rgba(59, 130, 246, 0.2), 0 0 40px rgba(59, 130, 246, 0.1)",
        "modal": "0 32px 80px rgba(0, 0, 0, 0.5), 0 0 80px rgba(59, 130, 246, 0.15)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "expand-down": {
          from: { maxHeight: "0", opacity: "0" },
          to: { maxHeight: "500px", opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)" },
        },
        "count-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "modal-in": {
          from: { opacity: "0", transform: "scale(0.95) translateY(10px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse-slow 1.5s ease-in-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "scale-in": "scale-in 0.25s ease-out",
        "expand-down": "expand-down 0.4s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "count-up": "count-up 0.5s ease-out forwards",
        "modal-in": "modal-in 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
      },
      transitionDuration: {
        DEFAULT: "200ms",
        "300": "300ms",
        "400": "400ms",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
