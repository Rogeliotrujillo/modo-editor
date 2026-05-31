export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  images?: string[]; // Multiple images list
  discount?: number;  // Optional discount percent
}

export interface Transaction {
  id: string;
  date: string;
  concept: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'Completado' | 'Pendiente';
  clientName?: string;
  project?: string;
  paymentMethod?: string;
}

export interface SocialLinks {
  instagram: string;
  tiktok: string;
  whatsapp: string;
  whatsappMessage: string;
  gmail?: string;
}

export interface PageContent {
  logoText: string;
  heroHeading: string;
  heroParagraph: string;
  ctaText: string;
  secondaryCtaText: string;
  storyHeading: string;
  storyParagraph: string;
  heroImage: string;
  // Aesthetic configurations requested by the user
  headingFont?: string;     // Font Family for core headings (e.g. Inter, Space Grotesk, Playfair, Outfit)
  bodyFont?: string;        // Font Family for body texts (e.g. Inter, Roboto, Lora, JetBrains Mono)
  themePalette?: string;    // Accent Palette ID (e.g. 'amethyst', 'emerald', 'ocean', 'terracota', 'cosmic', 'mono')
  textColorHeading?: string; // Hex color for main title texts
  textColorBody?: string;    // Hex color for body texts
  primaryBrandColor?: string; // Custom Hex color for buttons and theme highlights
}

export type ScreenType =
  | 'login' // MODO EDITOR - Dashboard Suite
  | 'dashboard' // MODO EDITOR - Dashboard Actualizado
  | 'editor' // MODO EDITOR - Editor Visual Interactivo
  | 'catalog' // MODO EDITOR - Catálogo Actualizado
  | 'finance' // MODO EDITOR - Finanzas (Ventas Simplificadas)
  | 'social'; // MODO EDITOR - Redes Sociales
