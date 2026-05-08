/**
 * Convert hex color to RGB string for use in rgba()
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "255,255,255";
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

/**
 * Validate IUT email format: username@iut-dhaka.edu
 */
export function validateIUTEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@iut-dhaka\.edu$/i;
  return regex.test(email);
}

/**
 * Basic URL validation — must start with https://
 */
export function validateLink(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Get ordinal suffix for semester number: 1st, 2nd, 3rd, etc.
 */
export function getOrdinal(n) {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

/**
 * Format a timestamp (Date object or Firestore Timestamp) to readable string
 */
export function formatTimestamp(ts) {
  if (!ts) return "Unknown";
  let date;
  if (ts.toDate) {
    date = ts.toDate();
  } else if (ts instanceof Date) {
    date = ts;
  } else {
    date = new Date(ts);
  }
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Generate a simple UUID v4
 */
export function generateId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
