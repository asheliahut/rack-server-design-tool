export interface ImageLoadResult {
  success: boolean;
  url: string;
  error?: string;
}

export const loadImage = (url: string): Promise<ImageLoadResult> => {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      resolve({ success: true, url });
    };

    img.onerror = () => {
      resolve({
        success: false,
        url: getPlaceholderImage(url),
        error: "Failed to load image",
      });
    };

    img.src = url;
  });
};

export const getPlaceholderImage = (originalUrl: string): string => {
  // Determine component type from URL path
  if (originalUrl.includes("/servers/")) {
    return "/images/placeholders/server-placeholder.svg";
  }
  if (originalUrl.includes("/storage/")) {
    return "/images/placeholders/storage-placeholder.svg";
  }
  if (originalUrl.includes("/network/")) {
    return "/images/placeholders/network-placeholder.svg";
  }
  if (originalUrl.includes("/power/")) {
    return "/images/placeholders/power-placeholder.svg";
  }
  if (originalUrl.includes("/accessories/")) {
    return "/images/placeholders/accessory-placeholder.svg";
  }

  return "/images/placeholders/generic-placeholder.svg";
};

export const preloadImages = async (
  urls: string[]
): Promise<ImageLoadResult[]> => {
  const loadPromises = urls.map((url) => loadImage(url));
  return Promise.all(loadPromises);
};

export const generateComponentImageUrl = (
  category: string,
  manufacturer: string,
  model: string
): string => {
  const normalizedManufacturer = manufacturer
    .toLowerCase()
    .replace(/\s+/g, "-");
  const normalizedModel = model.toLowerCase().replace(/\s+/g, "-");

  return `/images/${category}/${normalizedManufacturer}-${normalizedModel}.jpg`;
};

export const createPlaceholderSVG = (
  width: number,
  height: number,
  text: string,
  category: string
): string => {
  const colors = {
    server: "#3b82f6",
    storage: "#10b981",
    network: "#f59e0b",
    power: "#8b5cf6",
    cooling: "#06b6d4",
    management: "#6b7280",
    blank: "#9ca3af",
  };

  const color = colors[category as keyof typeof colors] || colors.blank;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="${color}20" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="${color}15" stroke="${color}" stroke-width="2" rx="4"/>
      <rect width="100%" height="100%" fill="url(#grid)"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="system-ui, sans-serif" font-size="12" fill="${color}" font-weight="600">
        ${text}
      </text>
      <circle cx="20" cy="20" r="3" fill="${color}80"/>
      <circle cx="30" cy="20" r="3" fill="${color}60"/>
      <rect x="${
        width - 30
      }" y="15" width="15" height="10" fill="${color}40" rx="2"/>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const getImageDimensions = (
  url: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
};

export const resizeImageToFit = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  const aspectRatio = originalWidth / originalHeight;

  let newWidth = maxWidth;
  let newHeight = maxWidth / aspectRatio;

  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = maxHeight * aspectRatio;
  }

  return { width: Math.round(newWidth), height: Math.round(newHeight) };
};

export const createImageCache = () => {
  const cache = new Map<string, ImageLoadResult>();

  return {
    get: (url: string): ImageLoadResult | undefined => cache.get(url),
    set: (url: string, result: ImageLoadResult): void => {
      cache.set(url, result);
    },
    has: (url: string): boolean => cache.has(url),
    clear: (): void => cache.clear(),
    size: (): number => cache.size,
  };
};

// Global image cache instance
export const imageCache = createImageCache();
