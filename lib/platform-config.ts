// Platform configuration with formats and grid specifications

// Platform options for selection
export const platformOptions = [
  { id: "instagram", name: "Instagram" },
  { id: "facebook", name: "Facebook" },
  { id: "twitter", name: "Twitter" },
  { id: "linkedin", name: "LinkedIn" },
  { id: "web", name: "Web Banners" },
  { id: "print", name: "Print" },
]

// Platform formats configuration
const platformFormats = {
  instagram: ["feed-square", "feed-portrait", "feed-landscape", "story", "carousel", "reels"],
  facebook: ["post-square", "post-landscape", "cover", "event", "ad"],
  twitter: ["post", "header", "card"],
  linkedin: ["post-square", "post-landscape", "company-cover", "profile-cover"],
  web: ["leaderboard", "medium-rectangle", "wide-skyscraper", "large-rectangle"],
  print: ["business-card", "flyer-a5", "poster-a4", "brochure"],
}

// Format configurations with dimensions and grid specifications
const formatConfigs = {
  // Instagram
  "instagram/feed-square": {
    name: "Instagram Feed (Square)",
    width: 1080,
    height: 1080,
    grid: { columns: 12, rows: 12 },
    rules: {
      logo: { maxSize: { width: 4, height: 2 }, allowedZones: ["top", "bottom"] },
      text: { maxSize: { width: 10, height: 6 }, allowedZones: ["middle", "bottom"] },
      image: { maxSize: { width: 12, height: 12 }, allowedZones: ["full"] },
    },
    defaultElements: [
      {
        id: "default-image",
        type: "image",
        gridPosition: { x: 0, y: 0, width: 12, height: 12 },
        content: { src: "", alt: "Background Image" },
      },
      {
        id: "default-logo",
        type: "logo",
        gridPosition: { x: 1, y: 1, width: 3, height: 1 },
        content: { src: "" },
      },
      {
        id: "default-text",
        type: "text",
        gridPosition: { x: 1, y: 8, width: 10, height: 3 },
        content: { text: "Your campaign message here", fontSize: "24px", color: "#ffffff", textAlign: "center" },
      },
    ],
  },
  "instagram/feed-portrait": {
    name: "Instagram Feed (Portrait)",
    width: 1080,
    height: 1350,
    grid: { columns: 12, rows: 15 },
    rules: {
      logo: { maxSize: { width: 4, height: 2 }, allowedZones: ["top", "bottom"] },
      text: { maxSize: { width: 10, height: 6 }, allowedZones: ["middle", "bottom"] },
      image: { maxSize: { width: 12, height: 15 }, allowedZones: ["full"] },
    },
    defaultElements: [
      {
        id: "default-image",
        type: "image",
        gridPosition: { x: 0, y: 0, width: 12, height: 15 },
        content: { src: "", alt: "Background Image" },
      },
      {
        id: "default-logo",
        type: "logo",
        gridPosition: { x: 1, y: 1, width: 3, height: 1 },
        content: { src: "" },
      },
      {
        id: "default-text",
        type: "text",
        gridPosition: { x: 1, y: 10, width: 10, height: 3 },
        content: { text: "Your campaign message here", fontSize: "24px", color: "#ffffff", textAlign: "center" },
      },
      {
        id: "default-cta",
        type: "cta",
        gridPosition: { x: 4, y: 13, width: 4, height: 1 },
        content: { text: "Learn More", backgroundColor: "#0070f3", fontSize: "16px" },
      },
    ],
  },
  "instagram/story": {
    name: "Instagram Story",
    width: 1080,
    height: 1920,
    grid: { columns: 12, rows: 24 },
    rules: {
      logo: { maxSize: { width: 4, height: 2 }, allowedZones: ["top"] },
      text: { maxSize: { width: 10, height: 8 }, allowedZones: ["middle"] },
      image: { maxSize: { width: 12, height: 24 }, allowedZones: ["full"] },
      cta: { maxSize: { width: 6, height: 2 }, allowedZones: ["bottom"] },
    },
    defaultElements: [
      {
        id: "default-image",
        type: "image",
        gridPosition: { x: 0, y: 0, width: 12, height: 24 },
        content: { src: "", alt: "Background Image" },
      },
      {
        id: "default-logo",
        type: "logo",
        gridPosition: { x: 1, y: 1, width: 3, height: 1 },
        content: { src: "" },
      },
      {
        id: "default-text",
        type: "text",
        gridPosition: { x: 1, y: 10, width: 10, height: 4 },
        content: { text: "Your campaign message here", fontSize: "32px", color: "#ffffff", textAlign: "center" },
      },
      {
        id: "default-cta",
        type: "cta",
        gridPosition: { x: 3, y: 20, width: 6, height: 2 },
        content: { text: "Swipe Up", backgroundColor: "#0070f3", fontSize: "18px" },
      },
    ],
  },

  // Facebook
  "facebook/post-square": {
    name: "Facebook Post (Square)",
    width: 1200,
    height: 1200,
    grid: { columns: 12, rows: 12 },
    rules: {
      logo: { maxSize: { width: 4, height: 2 }, allowedZones: ["top", "bottom"] },
      text: { maxSize: { width: 10, height: 6 }, allowedZones: ["middle", "bottom"] },
      image: { maxSize: { width: 12, height: 12 }, allowedZones: ["full"] },
    },
    defaultElements: [
      {
        id: "default-image",
        type: "image",
        gridPosition: { x: 0, y: 0, width: 12, height: 12 },
        content: { src: "", alt: "Background Image" },
      },
      {
        id: "default-logo",
        type: "logo",
        gridPosition: { x: 1, y: 1, width: 3, height: 1 },
        content: { src: "" },
      },
      {
        id: "default-text",
        type: "text",
        gridPosition: { x: 1, y: 8, width: 10, height: 3 },
        content: { text: "Your campaign message here", fontSize: "24px", color: "#ffffff", textAlign: "center" },
      },
    ],
  },

  // Web
  "web/leaderboard": {
    name: "Leaderboard Banner",
    width: 728,
    height: 90,
    grid: { columns: 12, rows: 3 },
    rules: {
      logo: { maxSize: { width: 2, height: 2 }, allowedZones: ["left"] },
      text: { maxSize: { width: 6, height: 2 }, allowedZones: ["middle"] },
      cta: { maxSize: { width: 3, height: 2 }, allowedZones: ["right"] },
    },
    defaultElements: [
      {
        id: "default-logo",
        type: "logo",
        gridPosition: { x: 0, y: 0, width: 2, height: 3 },
        content: { src: "" },
      },
      {
        id: "default-text",
        type: "text",
        gridPosition: { x: 3, y: 0, width: 6, height: 3 },
        content: { text: "Your campaign message here", fontSize: "16px", color: "#000000", textAlign: "left" },
      },
      {
        id: "default-cta",
        type: "cta",
        gridPosition: { x: 9, y: 1, width: 3, height: 1 },
        content: { text: "Learn More", backgroundColor: "#0070f3", fontSize: "14px" },
      },
    ],
  },
}

// Helper functions to access configuration
export function getPlatformFormats(platform: string): string[] {
  return platformFormats[platform as keyof typeof platformFormats] || []
}

export function getFormatConfig(platform: string, format: string): any {
  const key = `${platform}/${format}`
  return formatConfigs[key as keyof typeof formatConfigs] || null
}
