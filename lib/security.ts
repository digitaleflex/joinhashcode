/**
 * List of offensive terms in French and English.
 * This list is intentionally kept small and focused on high-impact terms.
 */
const PROFANITY_LIST = [
  // French
  "merde", "con", "connard", "salope", "pute", "encule", "nique", "pd", "pute", "salaud",
  "bite", "couille", "chatte", "fion", "gueule", "baiser", "niquer", "pet", "cul",
  "hitler", "nazi", "fasciste", "racisme", "negre", "bougnoule", "nioume",

  // English
  "fuck", "shit", "bitch", "asshole", "dick", "pussy", "cunt", "faggot", "nigger",
  "bastard", "slut", "whore", "piss", "cock", "bollocks", "motherfucker", "fucker",
  "retard", "rape", "gay", "lesbian", "homo", "porn", "pussy", "sexe", "sex",

  // Common variants / leetspeak (basic)
  "f*ck", "sh*t", "b*tch", "fuk", "shit", "a$$hole", "phuck", "p0rn",
];

/**
 * Checks if a string contains any profanity from the list.
 * Case-insensitive.
 */
export function containsProfanity(text: string): boolean {
  if (!text) return false;
  
  const normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remove accents

  // Check for exact matches and sub-string matches
  // We use word boundaries to avoid false positives (e.g., "con" in "consultant")
  // but for slugs we might not have spaces, so we check both.
  
  return PROFANITY_LIST.some(badWord => {
    // Escape badWord for regex
    const escaped = badWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Check as a separate word
    const wordRegex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (wordRegex.test(normalized)) return true;
    
    // Check if the bad word is directly contained (for slugs or concatenated names)
    // Only do this for words longer than 3 chars to avoid too many false positives
    if (badWord.length > 3 && normalized.includes(badWord)) return true;
    
    return false;
  });
}
