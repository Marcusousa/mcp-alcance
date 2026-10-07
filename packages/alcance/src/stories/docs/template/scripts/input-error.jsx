import { Source } from '@storybook/addon-docs/blocks';
import React, { useEffect, useRef } from 'react';
import CodeExample from '../../../utils/codeExample'
// import { CopyBlock, atomOneDark } from 'react-code-blocks';

export const Template = () => {
    const input = useRef(null);

    const html = `\
<alc-field id="password-field" label="Senha" required="true">
    <input type="password" value="12345678" id="password" />
</alc-field>
    `;
  
    const js = `\
const passwordField = document.getElementById('password-field');
const passwordInput = document.getElementById('password');

function validatePassword() {
    const password = passwordInput.value;
    let errorMsg = "";

    if (!password) {
        errorMsg = "Campo obrigatório";
    } else if (password.length < 4) {
        errorMsg = "A senha deve ter no mínimo 4 caracteres";
    }

    // Mostra a mensagem de erro
    passwordField.errorMsg = errorMsg;
    // É possível fazer o mesmo usando o atributo
    // passwordField.setAttribute("error-msg", errorMsg);
}

passwordField.addEventListener("change", validatePassword);
    `;

    useEffect(() => {
      input.current.innerHTML = html;
      eval(js);
    }, []);
  
    const RenderHTMLCode = () => (
      // <CopyBlock
      //   text={html}
      //   language="html"
      //   theme={atomOneDark}
      //   showLineNumbers
      // />
      <CodeExample type="html">{html}</CodeExample>
    );
  
    const RenderJSCode = () => (
      // <CopyBlock
      //   text={js}
      //   language="javascript"
      //   theme={atomOneDark}
      //   showLineNumbers
      // />
      <CodeExample type="js">{js}</CodeExample>
    );
  
    return (
      <>
        <div ref={input} style={{marginTop: 'var(--alc-spacing-05)'}}></div>
        <RenderHTMLCode />
        <RenderJSCode />
      </>
    );
  };