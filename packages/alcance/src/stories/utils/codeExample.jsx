import React, { useState } from 'react';
import styled from 'styled-components';
import { Highlight, themes } from 'prism-react-renderer';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-json';
import { CheckIcon, CopyIcon } from '@storybook/icons';
import { Unstyled } from '@storybook/addon-docs/blocks';

const CodeContainer = styled.div`
  background: #2d2d2d;
  border-radius: 8px;
  overflow: hidden;
  margin: 10px 0;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
`;

const Toolbar = styled.div`
  background: #1d1f24;
  padding: 10px;
  display: flex;
  align-items: center;
`;

const TabButtonContainer = styled.div`
  display: flex;
`;

const TabButton = styled.button`
  background: ${({ active }) => (active ? '#27292e' : 'none')};
  border: none;
  color: ${({ active }) => (active ? '#fff' : '#b0b0b0')};
  padding: 5px 10px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 5px;

  &:hover {
    background: #27292e;
    color: #fff;
  }
`;

const CodeArea = styled.div`
  position: relative;
`;

const CopyButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #1d1f24;
  border: none;
  color: #b0b0b0;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 4px;

  &:hover {
    color: #fff;
  }
`;

const Pre = styled.pre`
  margin: 0;
  padding: 15px;
  background: #232a35;
  font-size: 13px;
  line-height: 1.5;
  color: #ccc;
  font-family: 'Source Code Pro', monospace;
  overflow: auto;
`;

const Line = styled.div`
  display: flex;
  background-color: ${({ isHighlighted, isNewLine }) =>
    isHighlighted ? 'rgb(0 255 43 / 10%)' : isNewLine ? 'rgb(0 255 43 / 10%)' : 'transparent'};
`;

const LineNumber = styled.span`
  text-align: right;
  margin-right: 10px;
  user-select: none;
  opacity: 0.5;
`;

const LineContent = styled.span`
  flex: 1;
`;

const CodeExample = ({
  title,
  examples,
  language,
  type,
  highlightedLines = [],
  highlightedWords = [],
  newLines = [],
  showLineNumbers = false,
  theme = 'dracula',
  children,
}) => {
  const [activeTab, setActiveTab] = useState(
    examples ? Object.keys(examples)[0] : null
  );
  const [copied, setCopied] = useState(false);

  const activeLanguage = examples ? activeTab : language || type || 'html';

  const codeString = examples
    ? examples[activeLanguage]
    : typeof children === 'string'
    ? children
    : React.Children.map(children, (child) => child).join('');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeString).then(
      () => setCopied(true),
      (err) => console.error('Falha ao copiar: ', err)
    );
  };

  React.useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const getHighlightedLines = () => {
    if (examples) {
      return highlightedLines[activeLanguage] || [];
    }
    return highlightedLines;
  };

  const getNewLines = () => {
    if (examples) {
      return newLines[activeLanguage] || [];
    }
    return newLines;
  };

  // Função para nomear as abas
  const getTabName = (lang) => {
    switch (lang) {
      case 'js':
      case 'javascript':
        return 'JavaScript';
      case 'ts':
      case 'typescript':
        return 'TypeScript';
      case 'jsx':
        return 'JSX';
      case 'html':
        return 'HTML';
      case 'scss':
        return 'SCSS';
      default:
        return lang;
    }
  };

  // Obter o tema selecionado
  const selectedTheme = themes[theme] || themes.oneDark;

  return (
    <Unstyled>
      <CodeContainer>
        {title && (
          <div
            style={{
              background: '#1d1f24',
              padding: '10px',
              color: '#b0b0b0',
              fontSize: '14px',
            }}
          >
            {title}
          </div>
        )}
        {examples && (
          <Toolbar>
            <TabButtonContainer>
              {Object.keys(examples).map((lang) => (
                <TabButton
                  title={getTabName(lang)}
                  aira-label={getTabName(lang)}
                  key={lang}
                  active={activeTab === lang}
                  onClick={() => setActiveTab(lang)}
                >
                  {lang.toUpperCase()}
                </TabButton>
              ))}
            </TabButtonContainer>
          </Toolbar>
        )}
        <CodeArea>
          <CopyButton onClick={copyToClipboard} title='Copiar código' aria-label='Copiar código'>
            {copied ? <CheckIcon color="lime" /> : <CopyIcon />}
          </CopyButton>
          <Highlight
            prism={Prism}
            code={codeString}
            language={activeLanguage}
            theme={selectedTheme}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <Pre className={className} style={style}>
                {tokens.map((line, i) => {
                  const lineNumber = i + 1;
                  const isHighlighted = getHighlightedLines().includes(lineNumber);
                  const isNewLine = getNewLines().includes(lineNumber);

                  return (
                    <Line
                      key={i}
                      isHighlighted={isHighlighted}
                      isNewLine={isNewLine}
                      {...getLineProps({ line, key: i })}
                    >
                      {showLineNumbers && <LineNumber>{lineNumber}</LineNumber>}
                      <LineContent>
                        {line.map((token, key) => {
                          // Pega as propriedades do token
                          const tokenProps = { ...getTokenProps({ token, key }) };

                          // Define a cor do texto para o token de comentário (adiciona mais contraste)
                          if (token.types.includes("comment")) {
                            tokenProps.style.color = "#939BC8";
                          }

                          const content = highlightedWords.includes(token.content) ? (
                            <span
                              {...tokenProps}
                              style={{
                                ...tokenProps.style,
                                backgroundColor: 'hsl(228deg 83.02% 74.11% / 20%)',
                              }}
                            />
                          ) : (
                            <span {...tokenProps} />
                          );
                          return content;
                        })}
                      </LineContent>
                    </Line>
                  );
                })}
              </Pre>
            )}
          </Highlight>
        </CodeArea>
      </CodeContainer>
    </Unstyled>
  );
};

export default CodeExample;