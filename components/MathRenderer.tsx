import React from "react";
import { MathJaxContext, MathJax } from "better-react-mathjax";

interface MathRendererProps {
  content: string;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  const config = {
    loader: { load: ["input/tex", "output/chtml"] },
    tex: {
      inlineMath: [
        ["$", "$"],
        ["\\(", "\\)"],
      ],
      displayMath: [
        ["$$", "$$"],
        ["\\[", "\\]"],
      ],
      processEscapes: true,
    },
  };

  // Updated values for the bakery problem
  const problemValues = {
    0: 50,   // Fixed cost
    1: 15,   // Variable cost per cake
    2: 215   // Total cost limit
  };

  const replacePlaceholders = (text: string): string => {
    let result = text;

    // Handle __CURRENCYPLACEHOLDER_0___ format (triple underscore at end)
    result = result.replace(
      /__CURRENCYPLACEHOLDER_(\d+)___/g,
      (_, index) => `$${problemValues[parseInt(index)]}`
    );

    // Handle __CURRENCYPLACEHOLDER_0__ format (double underscore at end)
    result = result.replace(
      /__CURRENCYPLACEHOLDER_(\d+)__/g,
      (_, index) => `$${problemValues[parseInt(index)]}`
    );

    // Handle other currency patterns from original component
    result = result.replace(
      /__CURRrPLACEHOLDER_(\d+)__/g,
      (_, index) => `$${problemValues[parseInt(index)]}`
    );

    return result;
  };

  const fixTextFormatting = (text: string): string => {
    return text
      .replace(/\$(\d+)/g, '$$$1')
      .replace(/(\d+)%(?!\s)/g, '$1% ')
      .replace(/(\d+)million/g, '$1 million');
  };

  const processContent = (text: string): string => {
    if (!text) return "";

    let result = replacePlaceholders(text);
    result = fixTextFormatting(result);

    // Handle mathematical expressions
    const mathRegex = /(\d+[+\-*\/]\d+)/g;
    result = result.replace(mathRegex, match => `$${match}$`);

    return result;
  };

  const finalContent = processContent(content);

  return (
    <MathJaxContext config={config}>
      <MathJax className={className} dynamic>{finalContent}</MathJax>
    </MathJaxContext>
  );
};

export default MathRenderer;
