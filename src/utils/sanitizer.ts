import DOMPurify from 'dompurify';

export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
};

export const sanitizeString = (str: string): string => {
  // Simple string sanitization (removes potential script tags/event handlers)
  return str.replace(/[<>]/g, '');
};
