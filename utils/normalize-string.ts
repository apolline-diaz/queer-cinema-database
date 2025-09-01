export function normalizeString(str: string): string {
  return str
    .trim() // supprime espaces avant/après
    .toLowerCase() // insensible à la casse
    .normalize("NFD") // décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, "") // enlève les diacritiques (accents)
    .replace(/[^\w\s]/g, "") // enlève la ponctuation (optionnel)
    .replace(/\s+/g, " "); // normalise les espaces multiples
}
