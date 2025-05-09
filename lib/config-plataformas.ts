// Configuração de plataformas com formatos e especificações de grid

// Opções de plataformas para seleção
export const opcoesDePlataformas = [
  { id: "instagram", nome: "Instagram" },
  { id: "facebook", nome: "Facebook" },
  { id: "twitter", nome: "Twitter" },
  { id: "linkedin", nome: "LinkedIn" },
  { id: "web", nome: "Banners Web" },
  { id: "impresso", nome: "Materiais Impressos" },
];

// Configuração de formatos por plataforma
export const formatosPorPlataforma = {
  instagram: [
    { nome: "feed-quadrado", largura: 1080, altura: 1080 },
    { nome: "feed-retrato", largura: 1080, altura: 1350 },
    { nome: "feed-paisagem", largura: 1080, altura: 608 },
    { nome: "stories", largura: 1080, altura: 1920 },
    { nome: "carrossel", largura: 1080, altura: 1080 },
    { nome: "reels", largura: 1080, altura: 1920 },
  ],
  facebook: [
    { nome: "post-quadrado", largura: 1200, altura: 1200 },
    { nome: "post-paisagem", largura: 1200, altura: 630 },
    { nome: "capa", largura: 1640, altura: 924 },
    { nome: "evento", largura: 1920, altura: 1080 },
    { nome: "anuncio", largura: 1200, altura: 628 },
  ],
  twitter: [
    { nome: "post", largura: 1600, altura: 900 },
    { nome: "cabecalho", largura: 1500, altura: 500 },
    { nome: "card", largura: 1200, altura: 628 },
  ],
  linkedin: [
    { nome: "post-quadrado", largura: 1200, altura: 1200 },
    { nome: "post-paisagem", largura: 1200, altura: 627 },
    { nome: "capa-empresa", largura: 1584, altura: 396 },
    { nome: "capa-perfil", largura: 1584, altura: 396 },
  ],
  web: [
    { nome: "leaderboard", largura: 728, altura: 90 },
    { nome: "retangulo-medio", largura: 300, altura: 250 },
    { nome: "skyscraper-largo", largura: 160, altura: 600 },
    { nome: "retangulo-grande", largura: 336, altura: 280 },
  ],
  impresso: [
    { nome: "cartao-visita", largura: 1050, altura: 600 },
    { nome: "flyer-a5", largura: 1748, altura: 2480 },
    { nome: "poster-a4", largura: 2480, altura: 3508 },
    { nome: "folder", largura: 2480, altura: 1748 },
  ],
};

// Configurações de formatos com dimensões e especificações de grid
const configsFormatos = {
  // Instagram - Dimensões atualizadas com grid proporcional
  "instagram/feed-quadrado": {
    nome: "Instagram Feed (Quadrado)",
    width: 1080,
    height: 1080,
    grid: { columns: 18, rows: 18 }, // Grid proporcional 1:1
    regras: {
      logo: {
        tamanhoMaximo: { width: 6, height: 3 },
        zonasPermitidas: ["topo", "base"],
      },
      texto: {
        tamanhoMaximo: { width: 16, height: 8 },
        zonasPermitidas: ["meio", "base"],
      },
      imagem: {
        tamanhoMaximo: { width: 18, height: 18 },
        zonasPermitidas: ["completo"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 18, height: 18 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
        camada: 5, // Camada mais baixa para ficar no fundo
      },
      {
        id: "default-logo",
        tipo: "logo",
        posicaoGrid: { x: 1, y: 1, width: 5, height: 2 },
        conteudo: { src: "" },
        camada: 15, // Camada mais alta para ficar na frente
      },
      {
        id: "default-texto",
        tipo: "texto",
        posicaoGrid: { x: 1, y: 13, width: 16, height: 4 },
        conteudo: {
          texto: "Sua mensagem de campanha aqui",
          fontSize: "24px",
          color: "#ffffff",
          textAlign: "center",
        },
        camada: 10, // Camada intermediária
      },
    ],
  },
  "instagram/feed-retrato": {
    nome: "Instagram Feed (Retrato)",
    width: 1080,
    height: 1350,
    grid: { columns: 18, rows: 22 }, // Grid proporcional 4:5
    regras: {
      logo: {
        tamanhoMaximo: { width: 6, height: 3 },
        zonasPermitidas: ["topo", "base"],
      },
      texto: {
        tamanhoMaximo: { width: 16, height: 8 },
        zonasPermitidas: ["meio", "base"],
      },
      imagem: {
        tamanhoMaximo: { width: 18, height: 22 },
        zonasPermitidas: ["completo"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 18, height: 22 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-logo",
        tipo: "logo",
        posicaoGrid: { x: 1, y: 1, width: 5, height: 2 },
        conteudo: { src: "" },
      },
      {
        id: "default-texto",
        tipo: "texto",
        posicaoGrid: { x: 1, y: 15, width: 16, height: 4 },
        conteudo: {
          texto: "Sua mensagem de campanha aqui",
          fontSize: "24px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
      {
        id: "default-cta",
        tipo: "cta",
        posicaoGrid: { x: 6, y: 19, width: 6, height: 2 },
        conteudo: {
          texto: "Saiba Mais",
          backgroundColor: "#0070f3",
          fontSize: "16px",
        },
      },
    ],
  },
  "instagram/feed-paisagem": {
    nome: "Instagram Feed (Paisagem)",
    width: 1080,
    height: 608,
    grid: { columns: 18, rows: 10 }, // Grid proporcional 16:9
    regras: {
      logo: {
        tamanhoMaximo: { width: 6, height: 3 },
        zonasPermitidas: ["topo", "base"],
      },
      texto: {
        tamanhoMaximo: { width: 16, height: 6 },
        zonasPermitidas: ["meio", "base"],
      },
      imagem: {
        tamanhoMaximo: { width: 18, height: 10 },
        zonasPermitidas: ["completo"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 18, height: 10 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-logo",
        tipo: "logo",
        posicaoGrid: { x: 1, y: 1, width: 5, height: 2 },
        conteudo: { src: "" },
      },
      {
        id: "default-texto",
        tipo: "texto",
        posicaoGrid: { x: 1, y: 5, width: 16, height: 4 },
        conteudo: {
          texto: "Sua mensagem de campanha aqui",
          fontSize: "24px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
    ],
  },
  "instagram/stories": {
    nome: "Instagram Stories",
    width: 1080,
    height: 1920,
    grid: { columns: 18, rows: 32 }, // Grid proporcional 9:16
    regras: {
      logo: {
        tamanhoMaximo: { width: 6, height: 3 },
        zonasPermitidas: ["topo"],
      },
      texto: {
        tamanhoMaximo: { width: 16, height: 10 },
        zonasPermitidas: ["meio"],
      },
      imagem: {
        tamanhoMaximo: { width: 18, height: 32 },
        zonasPermitidas: ["completo"],
      },
      cta: {
        tamanhoMaximo: { width: 10, height: 3 },
        zonasPermitidas: ["base"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 18, height: 32 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
        camada: 5, // Camada mais baixa para ficar no fundo
      },
      {
        id: "default-logo",
        tipo: "logo",
        posicaoGrid: { x: 1, y: 2, width: 5, height: 2 },
        conteudo: { src: "" },
        camada: 15, // Camada mais alta para ficar na frente
      },
      {
        id: "default-texto",
        tipo: "texto",
        posicaoGrid: { x: 1, y: 14, width: 16, height: 6 },
        conteudo: {
          texto: "Sua mensagem de campanha aqui",
          fontSize: "32px",
          color: "#ffffff",
          textAlign: "center",
        },
        camada: 10, // Camada intermediária
      },
      {
        id: "default-cta",
        tipo: "cta",
        posicaoGrid: { x: 4, y: 27, width: 10, height: 3 },
        conteudo: {
          texto: "Deslize para Cima",
          backgroundColor: "#0070f3",
          fontSize: "18px",
        },
        camada: 20, // Camada mais alta para o CTA
      },
    ],
  },
  "instagram/reels": {
    nome: "Instagram Reels",
    width: 1080,
    height: 1920,
    grid: { columns: 18, rows: 32 }, // Grid proporcional 9:16
    regras: {
      logo: {
        tamanhoMaximo: { width: 6, height: 3 },
        zonasPermitidas: ["topo"],
      },
      texto: {
        tamanhoMaximo: { width: 16, height: 10 },
        zonasPermitidas: ["meio"],
      },
      imagem: {
        tamanhoMaximo: { width: 18, height: 32 },
        zonasPermitidas: ["completo"],
      },
      cta: {
        tamanhoMaximo: { width: 10, height: 3 },
        zonasPermitidas: ["base"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 18, height: 32 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-texto",
        tipo: "texto",
        posicaoGrid: { x: 1, y: 14, width: 16, height: 6 },
        conteudo: {
          texto: "Sua mensagem de campanha aqui",
          fontSize: "32px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
    ],
  },
  "instagram/carrossel": {
    nome: "Instagram Carrossel",
    width: 1080,
    height: 1080,
    grid: { columns: 18, rows: 18 }, // Grid proporcional 1:1
    regras: {
      logo: {
        tamanhoMaximo: { width: 6, height: 3 },
        zonasPermitidas: ["topo", "base"],
      },
      texto: {
        tamanhoMaximo: { width: 16, height: 8 },
        zonasPermitidas: ["meio", "base"],
      },
      imagem: {
        tamanhoMaximo: { width: 18, height: 18 },
        zonasPermitidas: ["completo"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 18, height: 18 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-texto",
        tipo: "texto",
        posicaoGrid: { x: 1, y: 13, width: 16, height: 4 },
        conteudo: {
          texto: "Sua mensagem de campanha aqui",
          fontSize: "24px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
    ],
  },

  // Facebook - Dimensões atualizadas com grid proporcional
  "facebook/post-quadrado": {
    nome: "Facebook Post (Quadrado)",
    width: 1200,
    height: 1200,
    grid: { columns: 20, rows: 20 }, // Grid proporcional 1:1
    regras: {
      logo: {
        tamanhoMaximo: { width: 6, height: 3 },
        zonasPermitidas: ["topo", "base"],
      },
      texto: {
        tamanhoMaximo: { width: 18, height: 8 },
        zonasPermitidas: ["meio", "base"],
      },
      imagem: {
        tamanhoMaximo: { width: 20, height: 20 },
        zonasPermitidas: ["completo"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 20, height: 20 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-logo",
        tipo: "logo",
        posicaoGrid: { x: 1, y: 1, width: 5, height: 2 },
        conteudo: { src: "" },
      },
      {
        id: "default-texto",
        tipo: "texto",
        posicaoGrid: { x: 1, y: 14, width: 18, height: 5 },
        conteudo: {
          texto: "Sua mensagem de campanha aqui",
          fontSize: "24px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
    ],
  },
  "facebook/post-paisagem": {
    nome: "Facebook Post (Paisagem)",
    width: 1200,
    height: 630,
    grid: { columns: 20, rows: 10 }, // Grid proporcional 1.9:1
    regras: {
      logo: {
        tamanhoMaximo: { width: 6, height: 3 },
        zonasPermitidas: ["topo", "base"],
      },
      texto: {
        tamanhoMaximo: { width: 18, height: 6 },
        zonasPermitidas: ["meio", "base"],
      },
      imagem: {
        tamanhoMaximo: { width: 20, height: 10 },
        zonasPermitidas: ["completo"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 20, height: 10 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-texto",
        tipo: "texto",
        posicaoGrid: { x: 1, y: 4, width: 18, height: 4 },
        conteudo: {
          texto: "Sua mensagem de campanha aqui",
          fontSize: "24px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
    ],
  },
  "facebook/capa": {
    nome: "Facebook Capa",
    width: 1640,
    height: 924,
    grid: { columns: 24, rows: 14 }, // Grid proporcional 16:9 aproximado
    regras: {
      logo: {
        tamanhoMaximo: { width: 8, height: 4 },
        zonasPermitidas: ["topo", "base"],
      },
      texto: {
        tamanhoMaximo: { width: 20, height: 8 },
        zonasPermitidas: ["meio", "base"],
      },
      imagem: {
        tamanhoMaximo: { width: 24, height: 14 },
        zonasPermitidas: ["completo"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 24, height: 14 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-texto",
        tipo: "texto",
        posicaoGrid: { x: 2, y: 5, width: 20, height: 4 },
        conteudo: {
          texto: "Sua mensagem de campanha aqui",
          fontSize: "32px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
    ],
  },
  "facebook/evento": {
    nome: "Facebook Evento",
    width: 1920,
    height: 1080,
    grid: { columns: 32, rows: 18 }, // Grid proporcional 16:9
    regras: {
      logo: {
        tamanhoMaximo: { width: 8, height: 4 },
        zonasPermitidas: ["topo", "base"],
      },
      texto: {
        tamanhoMaximo: { width: 24, height: 10 },
        zonasPermitidas: ["meio", "base"],
      },
      imagem: {
        tamanhoMaximo: { width: 32, height: 18 },
        zonasPermitidas: ["completo"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 32, height: 18 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-texto",
        tipo: "texto",
        posicaoGrid: { x: 4, y: 6, width: 24, height: 4 },
        conteudo: {
          texto: "Nome do Evento",
          fontSize: "42px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
      {
        id: "default-texto-2",
        tipo: "texto",
        posicaoGrid: { x: 8, y: 10, width: 16, height: 2 },
        conteudo: {
          texto: "Data e Local",
          fontSize: "24px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
    ],
  },
  "facebook/anuncio": {
    nome: "Facebook Anúncio",
    width: 1200,
    height: 628,
    grid: { columns: 20, rows: 10 }, // Grid proporcional 1.9:1
    regras: {
      logo: {
        tamanhoMaximo: { width: 6, height: 3 },
        zonasPermitidas: ["topo", "base"],
      },
      texto: {
        tamanhoMaximo: { width: 18, height: 6 },
        zonasPermitidas: ["meio", "base"],
      },
      imagem: {
        tamanhoMaximo: { width: 20, height: 10 },
        zonasPermitidas: ["completo"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 20, height: 10 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-texto",
        tipo: "texto",
        posicaoGrid: { x: 1, y: 3, width: 18, height: 3 },
        conteudo: {
          texto: "Sua mensagem de anúncio aqui",
          fontSize: "28px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
      {
        id: "default-cta",
        tipo: "cta",
        posicaoGrid: { x: 7, y: 7, width: 6, height: 2 },
        conteudo: {
          texto: "Comprar Agora",
          backgroundColor: "#0070f3",
          fontSize: "16px",
        },
      },
    ],
  },

  // Twitter - Dimensões atualizadas com grid proporcional
  "twitter/post": {
    nome: "Twitter Post",
    width: 1600,
    height: 900,
    grid: { columns: 32, rows: 18 }, // Grid proporcional 16:9
    regras: {
      logo: {
        tamanhoMaximo: { width: 8, height: 4 },
        zonasPermitidas: ["topo", "base"],
      },
      texto: {
        tamanhoMaximo: { width: 28, height: 10 },
        zonasPermitidas: ["meio", "base"],
      },
      imagem: {
        tamanhoMaximo: { width: 32, height: 18 },
        zonasPermitidas: ["completo"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 32, height: 18 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-texto",
        tipo: "texto",
        posicaoGrid: { x: 2, y: 6, width: 28, height: 6 },
        conteudo: {
          texto: "Sua mensagem de tweet aqui",
          fontSize: "32px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
    ],
  },
  "twitter/cabecalho": {
    nome: "Twitter Cabeçalho",
    width: 1500,
    height: 500,
    grid: { columns: 30, rows: 10 }, // Grid proporcional 3:1
    regras: {
      logo: {
        tamanhoMaximo: { width: 8, height: 4 },
        zonasPermitidas: ["topo", "base"],
      },
      texto: {
        tamanhoMaximo: { width: 24, height: 6 },
        zonasPermitidas: ["meio", "base"],
      },
      imagem: {
        tamanhoMaximo: { width: 30, height: 10 },
        zonasPermitidas: ["completo"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 30, height: 10 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-logo",
        tipo: "logo",
        posicaoGrid: { x: 2, y: 2, width: 6, height: 3 },
        conteudo: { src: "" },
      },
    ],
  },
  "twitter/card": {
    nome: "Twitter Card",
    width: 1200,
    height: 628,
    grid: { columns: 24, rows: 12 }, // Grid proporcional 1.9:1
    regras: {
      logo: {
        tamanhoMaximo: { width: 6, height: 3 },
        zonasPermitidas: ["topo", "base"],
      },
      texto: {
        tamanhoMaximo: { width: 20, height: 8 },
        zonasPermitidas: ["meio", "base"],
      },
      imagem: {
        tamanhoMaximo: { width: 24, height: 12 },
        zonasPermitidas: ["completo"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 24, height: 12 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-texto",
        tipo: "texto",
        posicaoGrid: { x: 2, y: 4, width: 20, height: 3 },
        conteudo: {
          texto: "Título do seu card",
          fontSize: "28px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
      {
        id: "default-texto-2",
        tipo: "texto",
        posicaoGrid: { x: 4, y: 8, width: 16, height: 2 },
        conteudo: {
          texto: "Descrição do card",
          fontSize: "18px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
    ],
  },

  // LinkedIn - Dimensões atualizadas com grid proporcional
  "linkedin/post-quadrado": {
    nome: "LinkedIn Post (Quadrado)",
    width: 1200,
    height: 1200,
    grid: { columns: 20, rows: 20 }, // Grid proporcional 1:1
    regras: {
      logo: {
        tamanhoMaximo: { width: 6, height: 3 },
        zonasPermitidas: ["topo", "base"],
      },
      texto: {
        tamanhoMaximo: { width: 18, height: 8 },
        zonasPermitidas: ["meio", "base"],
      },
      imagem: {
        tamanhoMaximo: { width: 20, height: 20 },
        zonasPermitidas: ["completo"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 20, height: 20 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-logo",
        tipo: "logo",
        posicaoGrid: { x: 1, y: 1, width: 5, height: 2 },
        conteudo: { src: "" },
      },
      {
        id: "default-texto",
        tipo: "texto",
        posicaoGrid: { x: 1, y: 14, width: 18, height: 5 },
        conteudo: {
          texto: "Sua mensagem profissional aqui",
          fontSize: "24px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
    ],
  },
  "linkedin/post-paisagem": {
    nome: "LinkedIn Post (Paisagem)",
    width: 1200,
    height: 627,
    grid: { columns: 24, rows: 12 }, // Grid proporcional 1.9:1
    regras: {
      logo: {
        tamanhoMaximo: { width: 6, height: 3 },
        zonasPermitidas: ["topo", "base"],
      },
      texto: {
        tamanhoMaximo: { width: 20, height: 8 },
        zonasPermitidas: ["meio", "base"],
      },
      imagem: {
        tamanhoMaximo: { width: 24, height: 12 },
        zonasPermitidas: ["completo"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 24, height: 12 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-logo",
        tipo: "logo",
        posicaoGrid: { x: 1, y: 1, width: 5, height: 2 },
        conteudo: { src: "" },
      },
      {
        id: "default-texto",
        tipo: "texto",
        posicaoGrid: { x: 2, y: 6, width: 20, height: 4 },
        conteudo: {
          texto: "Sua mensagem profissional aqui",
          fontSize: "24px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
    ],
  },
  "linkedin/capa-empresa": {
    nome: "LinkedIn Capa de Empresa",
    width: 1584,
    height: 396,
    grid: { columns: 32, rows: 8 }, // Grid proporcional 4:1
    regras: {
      logo: {
        tamanhoMaximo: { width: 8, height: 4 },
        zonasPermitidas: ["topo", "base"],
      },
      texto: {
        tamanhoMaximo: { width: 24, height: 6 },
        zonasPermitidas: ["meio", "base"],
      },
      imagem: {
        tamanhoMaximo: { width: 32, height: 8 },
        zonasPermitidas: ["completo"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 32, height: 8 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-texto",
        tipo: "texto",
        posicaoGrid: { x: 4, y: 2, width: 24, height: 4 },
        conteudo: {
          texto: "Sua empresa",
          fontSize: "32px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
    ],
  },
  "linkedin/capa-perfil": {
    nome: "LinkedIn Capa de Perfil",
    width: 1584,
    height: 396,
    grid: { columns: 32, rows: 8 }, // Grid proporcional 4:1
    regras: {
      logo: {
        tamanhoMaximo: { width: 8, height: 4 },
        zonasPermitidas: ["topo", "base"],
      },
      texto: {
        tamanhoMaximo: { width: 24, height: 6 },
        zonasPermitidas: ["meio", "base"],
      },
      imagem: {
        tamanhoMaximo: { width: 32, height: 8 },
        zonasPermitidas: ["completo"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 32, height: 8 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-texto",
        tipo: "texto",
        posicaoGrid: { x: 12, y: 2, width: 16, height: 4 },
        conteudo: {
          texto: "Seu perfil profissional",
          fontSize: "28px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
    ],
  },

  // Web - Dimensões atualizadas com grid proporcional
  "web/leaderboard": {
    nome: "Banner Leaderboard",
    width: 728,
    height: 90,
    grid: { columns: 24, rows: 3 }, // Grid proporcional 8:1
    regras: {
      logo: {
        tamanhoMaximo: { width: 6, height: 3 },
        zonasPermitidas: ["esquerda"],
      },
      texto: {
        tamanhoMaximo: { width: 12, height: 3 },
        zonasPermitidas: ["meio"],
      },
      cta: {
        tamanhoMaximo: { width: 6, height: 2 },
        zonasPermitidas: ["direita"],
      },
    },
    elementosPadrao: [
      {
        id: "default-logo",
        tipo: "logo",
        posicaoGrid: { x: 0, y: 0, width: 4, height: 3 },
        conteudo: { src: "" },
      },
      {
        id: "default-texto",
        tipo: "texto",
        posicaoGrid: { x: 5, y: 0, width: 12, height: 3 },
        conteudo: {
          texto: "Sua mensagem de campanha aqui",
          fontSize: "16px",
          color: "#000000",
          textAlign: "left",
        },
      },
      {
        id: "default-cta",
        tipo: "cta",
        posicaoGrid: { x: 18, y: 0, width: 5, height: 3 },
        conteudo: {
          texto: "Saiba Mais",
          backgroundColor: "#0070f3",
          fontSize: "14px",
        },
      },
    ],
  },
  "web/retangulo-medio": {
    nome: "Retângulo Médio",
    width: 300,
    height: 250,
    grid: { columns: 12, rows: 10 }, // Grid proporcional 6:5
    regras: {
      logo: {
        tamanhoMaximo: { width: 4, height: 2 },
        zonasPermitidas: ["topo"],
      },
      texto: {
        tamanhoMaximo: { width: 10, height: 4 },
        zonasPermitidas: ["meio"],
      },
      cta: {
        tamanhoMaximo: { width: 8, height: 2 },
        zonasPermitidas: ["base"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 12, height: 10 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-texto",
        tipo: "texto",
        posicaoGrid: { x: 1, y: 4, width: 10, height: 2 },
        conteudo: {
          texto: "Sua mensagem aqui",
          fontSize: "18px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
      {
        id: "default-cta",
        tipo: "cta",
        posicaoGrid: { x: 2, y: 7, width: 8, height: 2 },
        conteudo: {
          texto: "Clique Aqui",
          backgroundColor: "#0070f3",
          fontSize: "14px",
        },
      },
    ],
  },
  "web/skyscraper-largo": {
    nome: "Skyscraper Largo",
    width: 160,
    height: 600,
    grid: { columns: 8, rows: 30 }, // Grid proporcional 4:15
    regras: {
      logo: {
        tamanhoMaximo: { width: 6, height: 4 },
        zonasPermitidas: ["topo"],
      },
      texto: {
        tamanhoMaximo: { width: 6, height: 10 },
        zonasPermitidas: ["meio"],
      },
      cta: {
        tamanhoMaximo: { width: 6, height: 4 },
        zonasPermitidas: ["base"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 8, height: 30 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-logo",
        tipo: "logo",
        posicaoGrid: { x: 1, y: 2, width: 6, height: 4 },
        conteudo: { src: "" },
      },
      {
        id: "default-texto",
        tipo: "texto",
        posicaoGrid: { x: 1, y: 12, width: 6, height: 6 },
        conteudo: {
          texto: "Sua mensagem aqui",
          fontSize: "16px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
      {
        id: "default-cta",
        tipo: "cta",
        posicaoGrid: { x: 1, y: 24, width: 6, height: 4 },
        conteudo: {
          texto: "Saiba Mais",
          backgroundColor: "#0070f3",
          fontSize: "14px",
        },
      },
    ],
  },
  "web/retangulo-grande": {
    nome: "Retângulo Grande",
    width: 336,
    height: 280,
    grid: { columns: 12, rows: 10 }, // Grid proporcional 6:5
    regras: {
      logo: {
        tamanhoMaximo: { width: 4, height: 2 },
        zonasPermitidas: ["topo"],
      },
      texto: {
        tamanhoMaximo: { width: 10, height: 4 },
        zonasPermitidas: ["meio"],
      },
      cta: {
        tamanhoMaximo: { width: 8, height: 2 },
        zonasPermitidas: ["base"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 12, height: 10 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-texto",
        tipo: "texto",
        posicaoGrid: { x: 1, y: 4, width: 10, height: 2 },
        conteudo: {
          texto: "Sua mensagem aqui",
          fontSize: "20px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
      {
        id: "default-cta",
        tipo: "cta",
        posicaoGrid: { x: 2, y: 7, width: 8, height: 2 },
        conteudo: {
          texto: "Clique Aqui",
          backgroundColor: "#0070f3",
          fontSize: "16px",
        },
      },
    ],
  },

  // Impresso - Dimensões atualizadas com grid proporcional
  "impresso/cartao-visita": {
    nome: "Cartão de Visita",
    width: 1050,
    height: 600, // 9x5cm em 300dpi
    grid: { columns: 21, rows: 12 }, // Grid proporcional 7:4
    regras: {
      logo: {
        tamanhoMaximo: { width: 7, height: 4 },
        zonasPermitidas: ["topo", "esquerda"],
      },
      texto: {
        tamanhoMaximo: { width: 14, height: 8 },
        zonasPermitidas: ["meio", "direita"],
      },
    },
    elementosPadrao: [
      {
        id: "default-logo",
        tipo: "logo",
        posicaoGrid: { x: 1, y: 1, width: 6, height: 4 },
        conteudo: { src: "" },
      },
      {
        id: "default-texto-nome",
        tipo: "texto",
        posicaoGrid: { x: 8, y: 2, width: 12, height: 2 },
        conteudo: {
          texto: "Nome Completo",
          fontSize: "18px",
          color: "#000000",
          textAlign: "left",
        },
      },
      {
        id: "default-texto-cargo",
        tipo: "texto",
        posicaoGrid: { x: 8, y: 4, width: 12, height: 2 },
        conteudo: {
          texto: "Cargo / Função",
          fontSize: "14px",
          color: "#666666",
          textAlign: "left",
        },
      },
      {
        id: "default-texto-contato",
        tipo: "texto",
        posicaoGrid: { x: 1, y: 7, width: 19, height: 4 },
        conteudo: {
          texto: "email@empresa.com\n+55 (11) 98765-4321\nwww.empresa.com",
          fontSize: "12px",
          color: "#333333",
          textAlign: "center",
        },
      },
    ],
  },
  "impresso/flyer-a5": {
    nome: "Flyer A5",
    width: 1748,
    height: 2480, // A5 em 300dpi
    grid: { columns: 21, rows: 30 }, // Grid proporcional A5
    regras: {
      logo: {
        tamanhoMaximo: { width: 10, height: 6 },
        zonasPermitidas: ["topo"],
      },
      texto: {
        tamanhoMaximo: { width: 17, height: 15 },
        zonasPermitidas: ["meio", "base"],
      },
      imagem: {
        tamanhoMaximo: { width: 21, height: 20 },
        zonasPermitidas: ["meio", "completo"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 21, height: 30 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-logo",
        tipo: "logo",
        posicaoGrid: { x: 5, y: 2, width: 11, height: 4 },
        conteudo: { src: "" },
      },
      {
        id: "default-texto-titulo",
        tipo: "texto",
        posicaoGrid: { x: 2, y: 8, width: 17, height: 4 },
        conteudo: {
          texto: "Título Principal",
          fontSize: "32px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
      {
        id: "default-texto-descricao",
        tipo: "texto",
        posicaoGrid: { x: 3, y: 14, width: 15, height: 8 },
        conteudo: {
          texto:
            "Descrição do evento ou promoção. Adicione detalhes importantes aqui.",
          fontSize: "18px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
      {
        id: "default-texto-contato",
        tipo: "texto",
        posicaoGrid: { x: 3, y: 24, width: 15, height: 4 },
        conteudo: {
          texto: "Contato: email@empresa.com\nTelefone: (11) 98765-4321",
          fontSize: "14px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
    ],
  },
  "impresso/poster-a4": {
    nome: "Pôster A4",
    width: 2480,
    height: 3508, // A4 em 300dpi
    grid: { columns: 24, rows: 34 }, // Grid proporcional A4
    regras: {
      logo: {
        tamanhoMaximo: { width: 12, height: 6 },
        zonasPermitidas: ["topo"],
      },
      texto: {
        tamanhoMaximo: { width: 20, height: 16 },
        zonasPermitidas: ["meio", "base"],
      },
      imagem: {
        tamanhoMaximo: { width: 24, height: 20 },
        zonasPermitidas: ["meio", "completo"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 24, height: 34 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-logo",
        tipo: "logo",
        posicaoGrid: { x: 6, y: 2, width: 12, height: 4 },
        conteudo: { src: "" },
      },
      {
        id: "default-texto-titulo",
        tipo: "texto",
        posicaoGrid: { x: 2, y: 8, width: 20, height: 4 },
        conteudo: {
          texto: "Título Principal",
          fontSize: "42px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
      {
        id: "default-texto-subtitulo",
        tipo: "texto",
        posicaoGrid: { x: 4, y: 12, width: 16, height: 2 },
        conteudo: {
          texto: "Subtítulo ou slogan",
          fontSize: "24px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
      {
        id: "default-texto-descricao",
        tipo: "texto",
        posicaoGrid: { x: 4, y: 16, width: 16, height: 10 },
        conteudo: {
          texto:
            "Descrição detalhada do evento, produto ou serviço. Adicione informações importantes aqui.",
          fontSize: "18px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
      {
        id: "default-texto-contato",
        tipo: "texto",
        posicaoGrid: { x: 4, y: 28, width: 16, height: 4 },
        conteudo: {
          texto:
            "Contato: email@empresa.com\nTelefone: (11) 98765-4321\nwww.empresa.com",
          fontSize: "16px",
          color: "#ffffff",
          textAlign: "center",
        },
      },
    ],
  },
  "impresso/folder": {
    nome: "Folder",
    width: 2480,
    height: 1748, // A4 paisagem em 300dpi
    grid: { columns: 34, rows: 24 }, // Grid proporcional A4 paisagem
    regras: {
      logo: {
        tamanhoMaximo: { width: 12, height: 6 },
        zonasPermitidas: ["topo", "esquerda"],
      },
      texto: {
        tamanhoMaximo: { width: 28, height: 16 },
        zonasPermitidas: ["meio", "direita"],
      },
      imagem: {
        tamanhoMaximo: { width: 16, height: 16 },
        zonasPermitidas: ["meio", "esquerda"],
      },
    },
    elementosPadrao: [
      {
        id: "default-imagem",
        tipo: "imagem",
        posicaoGrid: { x: 0, y: 0, width: 34, height: 24 },
        conteudo: { src: "", alt: "Imagem de Fundo" },
      },
      {
        id: "default-logo",
        tipo: "logo",
        posicaoGrid: { x: 2, y: 2, width: 8, height: 4 },
        conteudo: { src: "" },
      },
      {
        id: "default-texto-titulo",
        tipo: "texto",
        posicaoGrid: { x: 12, y: 4, width: 20, height: 4 },
        conteudo: {
          texto: "Título Principal",
          fontSize: "36px",
          color: "#ffffff",
          textAlign: "left",
        },
      },
      {
        id: "default-texto-descricao",
        tipo: "texto",
        posicaoGrid: { x: 12, y: 10, width: 20, height: 10 },
        conteudo: {
          texto:
            "Descrição detalhada do produto, serviço ou evento. Adicione informações importantes aqui.",
          fontSize: "18px",
          color: "#ffffff",
          textAlign: "left",
        },
      },
      {
        id: "default-imagem-secundaria",
        tipo: "imagem",
        posicaoGrid: { x: 2, y: 8, width: 8, height: 12 },
        conteudo: { src: "", alt: "Imagem Secundária" },
      },
    ],
  },
};

// Funções auxiliares para acessar configurações
export function getFormatosPorPlataforma(plataforma: string): any[] {
  // Revertendo para a implementação original, mais eficiente
  return (
    formatosPorPlataforma[plataforma as keyof typeof formatosPorPlataforma] ||
    []
  );
}

/**
 * Verifica se um formato existe na configuração usando uma string no formato "plataforma/formato"
 * @param formatoString Uma string no formato "plataforma/formato" (ex: "instagram/stories")
 * @returns {boolean} Retorna true se o formato existir, false caso contrário
 */
export function verificarFormatoExiste(formatoString: string): boolean {
  // Verifica se o formato é válido e tem o formato esperado
  if (!formatoString || !formatoString.includes("/")) {
    return false;
  }

  // Divide a string em plataforma e formato
  const [plataforma, formato] = formatoString.split("/");

  // Verifica se a plataforma existe
  if (
    !formatosPorPlataforma[plataforma as keyof typeof formatosPorPlataforma]
  ) {
    return false;
  }

  // Busca os formatos disponíveis para a plataforma
  const formatosDisponiveis = getFormatosPorPlataforma(plataforma);

  // Verifica se o formato existe na plataforma
  return formatosDisponiveis.some((f) => f.nome === formato);
}

/**
 * Verifica se um formato existe em qualquer plataforma
 * @param formato Nome do formato a verificar
 * @returns {boolean} Retorna true se o formato existir em qualquer plataforma, false caso contrário
 */
export function verificarFormatoExisteEmQualquerPlataforma(
  formato: string
): boolean {
  if (!formato) return false;

  // Verifica em todas as plataformas
  for (const plataforma of Object.keys(formatosPorPlataforma)) {
    const formatosDisponiveis = getFormatosPorPlataforma(plataforma);
    if (formatosDisponiveis.some((f) => f.nome === formato)) {
      return true;
    }
  }

  return false;
}

export function getConfigFormato(plataforma: string, formato: string): any {
  const key = `${plataforma}/${formato}`;
  const config = configsFormatos[key as keyof typeof configsFormatos];

  // Se a configuração não existir, retorne um objeto padrão
  if (!config) {
    console.warn(
      `Configuração não encontrada para ${key}. Usando configuração padrão.`
    );
    return {
      nome: `${plataforma} - ${formato}`,
      width: 1080,
      height: 1080,
      grid: { columns: 18, rows: 18 },
      elementosPadrao: [],
    };
  }

  return config;
}

export const configPlataformas = formatosPorPlataforma;
