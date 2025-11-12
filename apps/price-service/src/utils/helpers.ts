// Price Service - Slug Generator
import slugify from 'slugify';

export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
}

export function parseSeedName(fullName: string): {
  name: string;
  breeder?: string;
} {
  // Format: "Gorilla Glue #4 (Zamnesia Seeds)"
  const match = fullName.match(/^(.+?)\s*(?:\((.+?)\))?$/);
  
  if (match) {
    return {
      name: match[1].trim(),
      breeder: match[2]?.trim()
    };
  }
  
  return { name: fullName.trim() };
}

export function normalizePrice(priceStr: string): number | null {
  // Remove currency symbols and convert to number
  const cleaned = priceStr
    .replace(/[€$£]/g, '')
    .replace(/,/g, '.')
    .replace(/\s/g, '')
    .trim();
  
  const price = parseFloat(cleaned);
  return isNaN(price) ? null : price;
}

export function parsePackSize(packStr: string): {
  packSize: string;
  seedCount: number;
} {
  // Examples: "3 Seeds", "5 Samen", "10x"
  const match = packStr.match(/(\d+)\s*(seeds?|samen|x)?/i);
  
  if (match) {
    const count = parseInt(match[1], 10);
    return {
      packSize: packStr,
      seedCount: count
    };
  }
  
  return {
    packSize: packStr,
    seedCount: 1
  };
}
