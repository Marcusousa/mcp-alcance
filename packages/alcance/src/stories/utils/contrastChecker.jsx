import React, { useState, useEffect, useRef } from 'react';
import { Unstyled } from '@storybook/addon-docs/blocks';
import colors from './colors-library'; // Importando o arquivo de paleta de cores
import './contrastChecker.css';

// Função para converter uma cor HEX em RGB
const hexToRgb = (hex) => {
  let hexCode = hex.replace('#', '');
  if (hexCode.length === 3) {
    hexCode = hexCode.split('').map((h) => h + h).join('');
  }
  const bigint = parseInt(hexCode, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b];
};

// Função para calcular a luminância relativa de uma cor
const getLuminance = (rgb) => {
  const [r, g, b] = rgb.map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Função para calcular a taxa de contraste entre duas cores
const getContrastRatio = (color1, color2) => {
  const luminance1 = getLuminance(hexToRgb(color1));
  const luminance2 = getLuminance(hexToRgb(color2));
  const brightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);

  return (brightest + 0.05) / (darkest + 0.05);
};

// Função para calcular a conformidade da taxa de contraste
const checkCompliance = (contrastRatio, largeText = false) => {
  if (largeText) {
    return {
      AA: contrastRatio >= 3,
      AAA: contrastRatio >= 4.5,
    };
  }
  return {
    AA: contrastRatio >= 4.5,
    AAA: contrastRatio >= 7,
  };
};

// Função para calcular contraste usando a metodologia APCA
const calculateAPCA = (foreground, background) => {
  const fgLuminance = getLuminance(hexToRgb(foreground));
  const bgLuminance = getLuminance(hexToRgb(background));

  // Calcula a diferença de luminância
  let contrastValue = fgLuminance - bgLuminance;
  const isNegative = contrastValue < 0;

  contrastValue = Math.abs(contrastValue);

  // Aplica uma fórmula aproximada de APCA (simplificada)
  contrastValue = contrastValue * 100;

  return isNegative ? -contrastValue : contrastValue;
};

// Função para verificar se passa no teste de conformidade da APCA
const checkAPCACompliance = (apcaContrast, isLargeText = false) => {
  const absContrast = Math.abs(apcaContrast);

  if (isLargeText) {
    return {
      PassAA: absContrast >= 45, // Texto grande precisa de 45+ para passar
      PassAAA: absContrast >= 60, // Texto grande precisa de 60+ para AAA
    };
  }

  return {
    PassAA: absContrast >= 60, // Texto normal precisa de 60+ para passar AA
    PassAAA: absContrast >= 75, // Texto normal precisa de 75+ para AAA
  };
};

// Função para renderizar o estado de conformidade
const renderCompliance = (isCompliant, level) => {
  if (isCompliant) {
    return (
      <span>
        <alc-icon name="check-circle-fill" label="Passa" style={{ color: '#28a745', marginRight: '4px' }}></alc-icon>
        {level}
      </span>
    )
  } else {
    return (
      <span>
        <alc-icon name="x-circle-fill" label="Não passa" style={{ color: '#dc3545', marginRight: '4px' }}></alc-icon>
        {level}
      </span>
    )
  }
};

// Função para gerar as opções do seletor de cores
const generateColorOptions = (colors, onSelect, focusedIndex, setFocusedIndex, keyboardNavigation) => {
  const options = [];
  let index = 0;
  for (const colorGroup in colors) {
    for (const shade in colors[colorGroup]) {
      const colorValue = colors[colorGroup][shade];
      const optionLabel = `${colorGroup}-${shade}`;
      const isFocused = focusedIndex === index;

      options.push(
        <li
          key={optionLabel}
          id={`color-option-${index}`}
          role="option"
          aria-selected={isFocused ? 'true' : 'false'}
          tabIndex={isFocused ? 0 : -1} // Foco deve ir para o item atualmente focado
          onClick={() => onSelect({ name: optionLabel, value: colorValue })}
          onMouseEnter={() => {
            if (!keyboardNavigation) { // Ignora o mouse quando a navegação por teclado estiver ativa
              setFocusedIndex(index);
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px',
            cursor: 'pointer',
            borderBottom: '1px solid #f0f0f0',
            backgroundColor: isFocused ? '#e6f7ff' : '#fff', // Destaque no item focado
            listStyleType: 'none',
          }}
          ref={(element) => {
            if (isFocused && element) {
              element.scrollIntoView({ block: 'nearest' });
            }
          }}
        >
          <div
            style={{
              backgroundColor: colorValue,
              width: '24px',
              height: '24px',
              marginRight: '8px',
              border: '1px solid #ccc',
              borderRadius: '3px',
            }}
          />
          <span>{optionLabel} ({colorValue})</span>
        </li>
      );
      index++;
    }
  }
  return options;
};

// Componente Customizado de Seleção de Cores
const ColorSelector = ({ selectedColor, onSelectColor, colors, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0); // Índice da opção atualmente focada
  const [keyboardNavigation, setKeyboardNavigation] = useState(false); // Controle de navegação por teclado
  const dropdownRef = useRef(null);
  const inputRef = useRef(null); // Ref para o input
  const listboxRef = useRef(null); // Ref para o listbox

  // Fecha o dropdown quando clicar fora do componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Move o foco para o primeiro item ao abrir o dropdown
  useEffect(() => {
    if (isOpen) {
      setFocusedIndex(0); // Sempre inicia com o primeiro item focado
    }
  }, [isOpen]);

  // Função para navegar até o primeiro item que começa com a letra pressionada
  const navigateToLetter = (colors, letter, currentIndex) => {
    const lowerLetter = letter.toLowerCase();
    const colorArray = Object.entries(colors).flatMap(([group, shades]) =>
      Object.keys(shades).map((shade) => `${group}-${shade}`)
    );

    for (let i = currentIndex + 1; i < colorArray.length; i++) {
      if (colorArray[i].toLowerCase().startsWith(lowerLetter)) {
        return i;
      }
    }

    // Recomeça a busca se o item não for encontrado após o índice atual
    for (let i = 0; i <= currentIndex; i++) {
      if (colorArray[i].toLowerCase().startsWith(lowerLetter)) {
        return i;
      }
    }

    return currentIndex; // Mantém o índice atual se não encontrar nenhuma correspondência
  };

  // Manipulação de teclas para navegação por teclado
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if(!isOpen) {
        setIsOpen(true);
      }

      const colorArray = Object.values(colors).flatMap(group => Object.values(group)); // Transforma as cores em array para poder pegar o length
      setKeyboardNavigation(true); // Define navegação por teclado ao usar as setas
      setFocusedIndex((prevIndex) => {
        const nextIndex = prevIndex + 1 < colorArray.length ? prevIndex + 1 : prevIndex;
        updateSelectedColor(nextIndex); // Atualiza a cor selecionada dinamicamente
        return nextIndex;
      });
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();

      if(!isOpen) {
        setIsOpen(true);
      }
      
      setKeyboardNavigation(true); // Define navegação por teclado ao usar as setas
      setFocusedIndex((prevIndex) => {
        const nextIndex = Math.max(prevIndex - 1, 0);
        updateSelectedColor(nextIndex); // Atualiza a cor selecionada dinamicamente
        return nextIndex;
      });
    } else if (/^[a-zA-Z]$/.test(event.key)) {
      event.preventDefault();
      const newIndex = navigateToLetter(colors, event.key, focusedIndex);
      setFocusedIndex(newIndex); // Navega para o primeiro item que começa com a letra pressionada
      updateSelectedColor(newIndex); // Atualiza a cor dinamicamente
    } else if (event.key === 'Enter' || event.key === ' ' && isOpen === true) {
      event.preventDefault();
      // Seleciona o item atualmente focado
      selectColorAtIndex(focusedIndex);
      setIsOpen(false);
      inputRef.current.focus(); // Retorna o foco ao input
    } else if(event.key === ' ' && isOpen === false) {
      event.preventDefault();
      setIsOpen(true);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      inputRef.current.focus(); // Retorna o foco ao input
    } else if (event.key === 'Tab' && isOpen) {
      event.preventDefault();
      // Seleciona o item com foco ao pressionar Tab e fecha o dropdown
      selectColorAtIndex(focusedIndex);
      setIsOpen(false);
      inputRef.current.focus(); // Retorna o foco ao input
    }
  };
  // Função para atualizar dinamicamente o item selecionado enquanto navega
  const updateSelectedColor = (index) => {
    const colorGroups = Object.keys(colors);
    const selectedGroup = colorGroups[Math.floor(index / Object.keys(colors[colorGroups[0]]).length)];
    const selectedShade = Object.keys(colors[selectedGroup])[index % Object.keys(colors[selectedGroup]).length];
    onSelectColor({ name: `${selectedGroup}-${selectedShade}`, value: colors[selectedGroup][selectedShade] });
  };

  // Função para selecionar a cor no índice atual
  const selectColorAtIndex = (index) => {
    updateSelectedColor(index);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }} ref={dropdownRef}>
      <div
        ref={inputRef}
        onClick={() => {
          setIsOpen(!isOpen);
          setKeyboardNavigation(false); // Reseta a navegação do teclado quando abrir pelo clique
        }}
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          cursor: 'pointer',
          backgroundColor: '#fff',
        }}
        aria-expanded={isOpen}
        role="combobox"
        aria-haspopup="listbox"
        aria-owns="color-selector-list"
        aria-controls="color-selector-list"
        aria-activedescendant={isOpen ? `color-option-${focusedIndex}` : undefined}
        tabIndex="0"
        title={title}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            WebkitFlexWrap: 'nowrap'
          }}>
          {selectedColor?.value ? (
            <>
              <div
                style={{
                  backgroundColor: selectedColor.value,
                  width: '24px',
                  height: '24px',
                  marginRight: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '3px',
                }}
              />
              <span>{selectedColor.name} ({selectedColor.value})</span>
            </>

          ) : (
            <span>Selecione uma cor</span>

          )}
        </div>
        <svg
          style={{ width: '16px', height: '16px', marginLeft: '8px' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
      {isOpen && (
        <ul
          id="color-selector-list"
          ref={listboxRef}
          role="listbox"
          aria-labelledby="combobox"
          style={{
            position: 'absolute',
            zIndex: '10',
            width: '100%',
            marginTop: '4px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '5px',
            maxHeight: '200px',
            overflowY: 'auto',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '0',
          }}
        >
          {generateColorOptions(colors, onSelectColor, focusedIndex, setFocusedIndex, keyboardNavigation)}
        </ul>
      )}
    </div>
  );
};

// Componente de Contraste
const ContrastChecker = () => {
  const [foregroundColor, setForegroundColor] = useState({
    name: 'blue-90 ',
    value: '#11181d',
  });
  const [backgroundColor, setBackgroundColor] = useState({
    name: 'blue-5',
    value: '#eff6fb',
  });

  // Cálculo do contraste usando WCAG
  const contrastRatio = getContrastRatio(foregroundColor.value, backgroundColor.value);
  const normalTextCompliance = checkCompliance(contrastRatio);
  const largeTextCompliance = checkCompliance(contrastRatio, true);
  const uiCompliance = checkCompliance(contrastRatio, true); // Para componentes gráficos, usa-se a mesma métrica de Large Text.

  // Cálculo do contraste usando APCA
  const apcaContrast = calculateAPCA(foregroundColor.value, backgroundColor.value);
  const apcaComplianceNormal = checkAPCACompliance(apcaContrast); // Conformidade para texto normal
  const apcaComplianceLarge = checkAPCACompliance(apcaContrast, true); // Conformidade para texto grande

  return (
    <Unstyled>

      <div
        className='color-contrast__container'
      >
        {/* Info */}
        <div className='color-contrast__info'>
          <div className='color-contrast__inputs-container'>
            {/* Seletor customizado de cor para o texto */}
            <div className='color-contrast__input-field'>
              <label className='color-contrast__input-label'>Cor do Texto:</label>
              <ColorSelector
                selectedColor={foregroundColor}
                onSelectColor={setForegroundColor}
                colors={colors}
                title="cor do texto"
              />
            </div>

            {/* Seletor customizado de cor para o fundo */}
            <div className='color-contrast__input-field'>
              <label className='color-contrast__input-label'>Cor de Fundo:</label>
              <ColorSelector
                selectedColor={backgroundColor}
                onSelectColor={setBackgroundColor}
                colors={colors}
                title="cor de fundo"
              />
            </div>

          </div>

          {/* WCAG Result */}
          <div className='color-contrast__results'>
            <table>
              <tbody>
              <tr className='color-contrast__table-content'>
                <th className='color-contrast__table-contrast-text'>Taxa de Contraste WCAG:</th>
                <td className='color-contrast__table-contrast-ratio'>{contrastRatio.toFixed(2)}:1</td>
              </tr>

              <tr className='color-contrast__table-content'>
                <th className='color-contrast__table-title'>Texto grande <span className='color-contrast__table-title--detail'>(acima de 18pt)</span></th>
                <td className='color-contrast__table-result'>{renderCompliance(largeTextCompliance.AA, 'AA')} {renderCompliance(largeTextCompliance.AAA, 'AAA')}</td>
              </tr>

              <tr className='color-contrast__table-content'>
                <th className='color-contrast__table-title'>Texto normal <span className='color-contrast__table-title--detail'>(abaixo de 18pt ou 14pt bold)</span></th>
                <td className='color-contrast__table-result'>{renderCompliance(normalTextCompliance.AA, 'AA')} {renderCompliance(normalTextCompliance.AAA, 'AAA')}</td>
              </tr>

              <tr>
                <th className='color-contrast__table-title'>Objeto gráfico e componentes UI</th>
                <td className='color-contrast__table-result'>{renderCompliance(uiCompliance.AA, '')}</td>
              </tr>
              </tbody>
            </table>
          </div>

          {/* APCA Result */}
          <div className='color-contrast__results'>
            <table>
              <tbody>
                <tr className='color-contrast__table-content'>
                  <th className='color-contrast__table-contrast-text'>Taxa de Contraste APCA:</th>
                  <td className='color-contrast__table-contrast-ratio '>{apcaContrast.toFixed(2)}</td>
                </tr>

                <tr className='color-contrast__table-content'>
                  <th className='color-contrast__table-title'>Texto grande <span className='color-contrast__table-title--detail'>(acima de 18pt)</span></th>
                  <td className='color-contrast__table-result'>{renderCompliance(apcaComplianceLarge.PassAA, '')}</td>
                </tr>

                <tr>
                  <th className='color-contrast__table-title'>Texto normal <span className='color-contrast__table-title--detail'>(abaixo de 18pt ou 14pt bold)</span></th>
                  <td style={{ display: 'flex', gap: '32px', padding: '8px 16px' }}>{renderCompliance(apcaComplianceNormal.PassAA, '')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Preview */}
        <div
          className='color-contrast__preview'
          style={{
            backgroundColor: backgroundColor.value,
            color: foregroundColor.value,
          }}
        >
          <span className='color-contrast__preview--large-text'>Este é um texto grande</span>
          <span>Este é um texto normal</span>
          <span>Este ícone é um objeto gráfico <alc-icon name='heart' label='coração'></alc-icon></span>
        </div>
      </div>
    </Unstyled>
  );
};

export default ContrastChecker;