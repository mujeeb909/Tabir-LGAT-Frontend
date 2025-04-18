// components/MathRenderer.tsx
import { useEffect, useRef } from 'react';

interface MathRendererProps {
  content: string;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load MathJax if it doesn't exist
    if (!(window as any).MathJax) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      script.async = true;
      script.id = 'MathJax-script';

      script.onload = () => {
        configureMathJax();
        renderMath();
      };

      document.head.appendChild(script);
    } else {
      // If MathJax is already loaded, render the math
      renderMath();
    }
  }, [content]);

  const configureMathJax = () => {
    (window as any).MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true,
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
        ignoreHtmlClass: 'tex2jax_ignore',
        processHtmlClass: 'tex2jax_process',
      },
      startup: {
        ready: () => {
          (window as any).MathJax.startup.defaultReady();
        }
      }
    };
  };

  const renderMath = () => {
    if (containerRef.current && (window as any).MathJax) {
      // Queue the typesetting
      try {
        (window as any).MathJax.typesetPromise([containerRef.current]).catch((err: any) => {
          console.error('MathJax error:', err);
        });
      } catch (e) {
        console.error('Error rendering MathJax:', e);
      }
    }
  };

  // Pre-process the content to ensure proper math formatting
  const processContent = (text: string): string => {
    // Replace all \( with $ and \) with $ for inline math
    let processed = text
      .replace(/\\\(/g, '$')
      .replace(/\\\)/g, '$')
      // Replace all \[ with $$ and \] with $$ for display math
      .replace(/\\\[/g, '$$')
      .replace(/\\\]/g, '$$')
      // Ensure options are properly separated
      .replace(/([A-D])\\\(/, '$1 $')
      .replace(/\\\)([A-D])/, '$ $1')
      // Fix other common LaTeX commands
      .replace(/\\ldot/g, '\\cdot');

    return processed;
  };

  return (
    <div ref={containerRef} className={className} dangerouslySetInnerHTML={{ __html: processContent(content) }} />
  );
};

export default MathRenderer;
