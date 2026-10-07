import React, { useState, useEffect } from 'react';
import { Unstyled } from '@storybook/addon-docs/blocks';
import dayjs from 'dayjs';

export function AlcanceFetch({ }) {
    const [data, setData] = useState(null);
    const [vueData, setVueData] = useState(null);
    const [reactData, setReactData] = useState(null);

    useEffect(() => {
        fetch('https://hub.camara.gov.br/repository/npm-camara/alcance')
            .then((response) => response.json())
            .then((json) => setData(json));

        fetch('https://hub.camara.gov.br/repository/npm-camara/alcance-vue-library')
            .then((response) => response.json())
            .then((json) => setVueData(json));

        fetch('https://hub.camara.gov.br/repository/npm-camara/alcance-react-library')
            .then((response) => response.json())
            .then((json) => setReactData(json));
    }, []);

    if (!data || !vueData || !reactData) {
        return <div>Carregando...</div>;
    }

    const versions = Object.keys(data.versions);

    return (
        <Unstyled>
            <div>
                <alc-datatable options='{"pageLength": 10, "columnDefs": [ { "type": "br-data", "targets": [3] }, { "orderable": false, "targets": [0, 1, 2] } ], "order": [[3, "desc"]] }'>
                    <table>
                        <thead>
                            <tr>
                                <th>WebComponents</th>
                                <th>Vue</th>
                                <th>React</th>
                                <th>Data do lançamento</th>
                            </tr>
                        </thead>
                        <tbody>
                            {versions.map((version) => {
                                const webComponentUrl = data.versions[version].dist.tarball;
                                const vueVersion = vueData.versions[version]?.dist?.tarball || 'N/A';
                                const reactVersion = reactData.versions[version]?.dist?.tarball || 'N/A';

                                return (
                                    <tr key={version}>
                                        <td>
                                            <a className="alc-link" href={webComponentUrl} rel="noopener noreferrer">
                                                {version}
                                            </a>
                                        </td>
                                        <td>
                                            {vueVersion !== 'N/A' ? (
                                                <a className="alc-link" href={vueVersion} rel="noopener noreferrer">
                                                    {version}
                                                </a>
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                        <td>
                                            {reactVersion !== 'N/A' ? (
                                                <a className="alc-link" href={reactVersion} rel="noopener noreferrer">
                                                    {version}
                                                </a>
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                        <td>{dayjs(data.time[version]).format('DD/MM/YYYY HH:mm')}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </alc-datatable>
            </div>
        </Unstyled>
    );
}
