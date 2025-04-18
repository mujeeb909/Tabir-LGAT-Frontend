// utils/quizFormatter.ts

/**
 * Formats quiz text to properly display math expressions and options
 */
export const formatQuizText = (text: string): string => {
  if (!text) return '';

  // Step 1: Format math expressions for MathJax
  let formatted = text
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$')
    .replace(/\\\[/g, '$$')
    .replace(/\\\]/g, '$$')
    .replace(/\\ldot/g, '\\cdot');

  // Step 2: Fix options formatting - add line breaks and spacing
  formatted = formatted.replace(/([A-D])(\\\(|\$)/, '\n$1. $2');

  // Step 3: Add space between options
  formatted = formatted.replace(/(\\\)|\$)([A-D])(\\\(|\$)/g, '$1\n$2. $3');

  return formatted;
}

/**
 * Formats quiz options for display
 */
export const formatQuizOptions = (options: Array<{id: string, text: string}>): Array<{id: string, text: string}> => {
  return options.map(option => ({
    id: option.id,
    text: option.text
      .replace(/\\\(/g, '$')
      .replace(/\\\)/g, '$')
      .replace(/\\\[/g, '$$')
      .replace(/\\\]/g, '$$')
      .replace(/\\ldot/g, '\\cdot')
  }));
}
