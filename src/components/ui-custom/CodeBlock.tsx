import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

// C# keywords for syntax highlighting
const csharpKeywords = [
  'class', 'public', 'private', 'static', 'void', 'new', 'if', 'else', 'return',
  'get', 'set', 'this', 'interface', 'abstract', 'sealed', 'override', 'virtual',
  'enum', 'struct', 'delegate', 'event', 'using', 'namespace', 'foreach', 'in',
  'is', 'as', 'ref', 'params', 'out', 'int', 'string', 'float', 'double', 'bool',
  'char', 'object', 'var', 'true', 'false', 'null', 'base', 'sizeof', 'typeof'
];

const types = ['int', 'string', 'float', 'double', 'bool', 'char', 'object', 'void', 'var'];

function highlightLine(line: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = line;
  let keyIdx = 0;

  // Tokenize by matching keywords, strings, comments, numbers
  const regex = /("(?:[^"\\]|\\.)*")|(\/\/.*$)|(\b\d+\b)|(\b[a-zA-Z_]\w*\b)|(\s+)|(.)/g;
  let match;

  while ((match = regex.exec(line)) !== null) {
    const [full, str, comment, num, word, ws, other] = match;
    const k = `tok-${keyIdx++}`;

    if (str) {
      parts.push(<span key={k} className="text-[#FFB84D]">{str}</span>);
    } else if (comment) {
      parts.push(<span key={k} className="text-[#5A6388]">{comment}</span>);
    } else if (num) {
      parts.push(<span key={k} className="text-[#7B5CFF]">{num}</span>);
    } else if (word) {
      if (csharpKeywords.includes(word)) {
        if (types.includes(word)) {
          parts.push(<span key={k} className="text-[#00D4FF]">{word}</span>);
        } else {
          parts.push(<span key={k} className="text-[#FF6B9D]">{word}</span>);
        }
      } else {
        parts.push(<span key={k} className="text-[#E2E8F0]">{word}</span>);
      }
    } else if (ws) {
      parts.push(<span key={k}>{ws}</span>);
    } else if (other) {
      parts.push(<span key={k} className="text-[#E2E8F0]">{other}</span>);
    }
  }

  return parts;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'csharp' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const lines = code.split('\n');

  return (
    <div className="rounded-xl overflow-hidden my-4 border border-[#2A3260]" dir="ltr">
      {/* Header */}
      <div className="bg-[rgba(21,25,41,0.8)] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF4757]" />
          <span className="w-3 h-3 rounded-full bg-[#FFB84D]" />
          <span className="w-3 h-3 rounded-full bg-[#00D4A0]" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#5A6388] text-xs font-mono">{language}</span>
          <button
            onClick={handleCopy}
            className="text-[#5A6388] hover:text-[#00D4FF] transition-colors"
            title="Copy"
          >
            {copied ? <Check className="w-4 h-4 text-[#00D4A0]" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {/* Code */}
      <div className="bg-[rgba(11,14,26,0.95)] p-2.5 sm:p-4 overflow-x-auto">
        <pre className="font-mono text-[11px] sm:text-sm leading-relaxed">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="text-[#5A6388] select-none w-8 text-right mr-4 flex-shrink-0 text-xs leading-relaxed pt-0.5">
                  {i + 1}
                </span>
                <span className="text-[#E2E8F0]">
                  {line.length > 0 ? highlightLine(line) : <span>&nbsp;</span>}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default React.memo(CodeBlock);
