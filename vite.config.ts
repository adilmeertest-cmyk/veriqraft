import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Support both Vite-prefixed and Next.js-style public Supabase variable names.
  envPrefix: ["VITE_", "NEXT_PUBLIC_"],
});
