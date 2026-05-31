import { Product, Transaction, SocialLinks, PageContent } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'MDO-8821',
    name: 'Modo Chrono Silver',
    category: 'Accesorios',
    price: 249.00,
    stock: 12,
    description: 'Reloj cronógrafo de acero inoxidable cepillado, esfera de zafiro y correa de cuero italiano. Resistente al agua 50m.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'MDO-9430',
    name: 'Neo Velocity Red',
    category: 'Calzado',
    price: 185.50,
    stock: 3,
    description: 'Zapatillas de alto rendimiento con amortiguación de fibra de carbono, tejido transpirable ultrasuave y suela de tracción inteligente.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'MDO-7120',
    name: 'Teclado Minimal Alum',
    category: 'Oficina',
    price: 129.00,
    stock: 25,
    description: 'Teclado mecánico de perfil bajo con chasis de aluminio anodizado, interruptores táctiles ultra silenciados y retroiluminación ámbar.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'MDO-4421',
    name: 'Studio Lamp Pro',
    category: 'Iluminación',
    price: 95.00,
    stock: 8,
    description: 'Luz LED inteligente para escritorio con temperatura de color ajustable de 2700K a 6500K y control de brillo táctil sin parpadeos.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TRX-9482',
    date: '2026-05-24',
    concept: 'Design System Pro - Licencia de Kit UI',
    amount: 2400.00,
    type: 'income',
    status: 'Completado',
    clientName: 'Acme Corp',
    project: 'Estudio de Diseño UI/UX',
    paymentMethod: 'Tarjeta'
  },
  {
    id: 'TRX-9483',
    date: '2026-05-22',
    concept: 'AWS Cloud Services - Infraestructura',
    amount: 840.12,
    type: 'expense',
    status: 'Completado',
    clientName: 'Amazon Web Services',
    project: 'Infraestructura de servidores',
    paymentMethod: 'Banco'
  },
  {
    id: 'TRX-9484',
    date: '2026-05-20',
    concept: 'Colaboración Freelance - Motion Graphics',
    amount: 1200.00,
    type: 'income',
    status: 'Pendiente',
    clientName: 'Vortex Studio',
    project: 'Retainer de Motion Graphics',
    paymentMethod: 'Cripto'
  },
  {
    id: 'TRX-9485',
    date: '2026-05-18',
    concept: 'Suscripción Anual Figma Team',
    amount: 480.00,
    type: 'expense',
    status: 'Completado',
    clientName: 'Figma Inc',
    project: 'Herramientas de diseño',
    paymentMethod: 'Tarjeta'
  },
  {
    id: 'TRX-9486',
    date: '2026-05-15',
    concept: 'Desarrollo Web Fase 1 - Landing Page',
    amount: 3200.00,
    type: 'income',
    status: 'Completado',
    clientName: 'Novos Wellness',
    project: 'Desarrollo Web Fase 1',
    paymentMethod: 'Banco'
  }
];

export const DEFAULT_SOCIAL: SocialLinks = {
  instagram: 'https://instagram.com/tu_marca',
  tiktok: 'https://tiktok.com/@usuario',
  whatsapp: '+34 600 000 000',
  whatsappMessage: 'Hola! Me gustaría recibir más información sobre vuestros servicios que he visto en el catálogo digital. ¿Podríais ayudarme?',
  gmail: 'contacto@tu_marca.com'
};

export const DEFAULT_CONTENT: PageContent = {
  logoText: 'DESIGN.STU',
  heroHeading: 'Revoluciona tu flujo creativo.',
  heroParagraph: 'La plataforma diseñada para organizar y acceder a tus notas con precisión de alta gama.',
  ctaText: 'Comenzar Ahora',
  secondaryCtaText: 'Saber más',
  storyHeading: 'Nuestra Historia',
  storyParagraph: 'Fundada en 2021, MODO EDITOR nació de la necesidad de fusionar la estética minimalista con la funcionalidad corporativa más robusta. Creemos que las herramientas de trabajo deben ser tan hermosas como los productos que ayudan a crear.',
  heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
  headingFont: 'Space Grotesk',
  bodyFont: 'Inter',
  themePalette: 'amethyst',
  textColorHeading: '#ffffff',
  textColorBody: '#cbc3d7',
  primaryBrandColor: '#8b5cf6'
};
