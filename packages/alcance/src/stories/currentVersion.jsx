import React, { useEffect, useState } from 'react';

const VersionComponent = () => {
    const [version, setVersion] = useState('Carregando...');

    useEffect(() => {
        if (window.location.hostname === 'localhost') {
            // Rodando localmente, ler package.json
            import('../../package.json')
                .then((pkg) => setVersion(pkg.version))
                .catch(() => setVersion('Desconhecida'));
        } else {
            // Rodando em produção (Storybook ou documentação), ler version.txt
            fetch('./version.txt')
                .then((res) => res.text())
                .then((data) => setVersion(data.trim()))
                .catch(() => setVersion('Desconhecida'));
        }
    }, []);

    return <span>Versão atual: {version}</span>;
};

export default VersionComponent;