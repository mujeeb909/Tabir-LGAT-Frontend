import { useEffect } from 'react';

interface MathRendererProps {
  content: string;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  useEffect(() => {

    if (!(window as any).MathJax) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      script.async = true;
      script.id = 'MathJax-script';
      document.head.appendChild(script);

      script.onload = () => {
        (window as any).MathJax.typeset();
      };
    } else {
      setTimeout(() => {
        (window as any).MathJax?.typeset();
      }, 0);
    }
  }, [content]);

  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: formatMathContent(content) }} />
  );
};


const formatMathContent = (content: string): string => {

  let formattedContent = content

    .replace(/\\\(/g, '\\\\(')
    .replace(/\\\)/g, '\\\\)')

    .replace(/\\\[/g, '\\\\[')
    .replace(/\\\]/g, '\\\\]')
    .replace(/\\ldot/g, '\\cdot')
    .replace(/\\cdot/g, '\\cdot');

  return formattedContent;
};

export default MathRenderer;
