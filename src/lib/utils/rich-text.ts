/**
 * Utility functions for rich text editor
 */

/**
 * Strips HTML tags and returns plain text
 * @param html - HTML string
 * @returns Plain text without HTML tags
 */
export const stripHtml = (html: string): string => {
  if (!html) return '';
  
  // Create a temporary DOM element to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Get text content and clean up whitespace
  return temp.textContent || temp.innerText || '';
};

/**
 * Counts characters in plain text (without HTML)
 * @param html - HTML string
 * @returns Character count of plain text
 */
export const getTextLength = (html: string): number => {
  return stripHtml(html).length;
};

/**
 * Validates HTML content length (plain text only)
 * @param html - HTML string
 * @param maxLength - Maximum allowed length
 * @returns Validation result
 */
export const validateHtmlLength = (html: string, maxLength: number): boolean => {
  return getTextLength(html) <= maxLength;
};

/**
 * Truncates HTML content to specified length (plain text)
 * @param html - HTML string
 * @param maxLength - Maximum allowed length
 * @returns Truncated HTML string
 */
export const truncateHtml = (html: string, maxLength: number): string => {
  const plainText = stripHtml(html);
  if (plainText.length <= maxLength) return html;
  
  // Simple truncation - in a real app, you might want more sophisticated HTML truncation
  return plainText.substring(0, maxLength);
};
