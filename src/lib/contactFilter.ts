// Blocks casual attempts to move a conversation off-platform. Not bulletproof
// against a determined adversary (no regex filter is), but catches the vast
// majority of real attempts: plain emails/phones/links/handles and the most
// common spaced-out obfuscations ("john at gmail dot com").
const PATTERNS: { label: string; re: RegExp }[] = [
  { label: 'an email address', re: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i },
  { label: 'an email address', re: /\b[a-z0-9._%+-]+\s+(?:\[?at\]?|\(at\))\s+[a-z0-9.-]+\s+(?:\[?dot\]?|\(dot\))\s+[a-z]{2,}\b/i },
  { label: 'a phone number', re: /(\+?\d[\d\s().-]{7,}\d)/ },
  { label: 'a link', re: /\b(?:https?:\/\/|www\.)\S+/i },
  { label: 'a link', re: /\b[a-z0-9-]+\.(com|net|org|io|co|me|app|dev|xyz)\b/i },
  { label: 'a social handle', re: /(?:^|\s)@[a-z0-9_.]{2,}/i },
  { label: 'a social handle', re: /\b(instagram|insta|whatsapp|telegram|snapchat|snap|discord|skype|wechat|linkedin|twitter|x\.com)\b\s*[:=-]?\s*\S+/i },
]

export function findContactInfo(text: string): string | null {
  for (const { label, re } of PATTERNS) {
    if (re.test(text)) return label
  }
  return null
}
