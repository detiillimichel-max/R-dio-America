/**
 * Rádio-América - Serviço de Integração com Radio Browser API
 * Localização: js/services/radioService.js
 */

const API_BASE_URL = 'https://at1.api.radio-browser.info/json';

export const radioService = {
    /**
     * Busca estações da América Latina (Brasil, Argentina, México)
     * @param {number} limite - Quantidade de estações
     */
    async buscarEstacoesAmérica(limite = 15) {
        try {
            const countryCodes = 'BR,AR,MX';
            
            const params = new URLSearchParams({
                countrycode: countryCodes,
                limit: limite,
                hidebroken: true,
                order: 'clickcount', 
                reverse: true
            });

            const response = await fetch(`${API_BASE_URL}/stations/search?${params}`);
            
            if (!response.ok) {
                throw new Error('Falha na conexão com o servidor de rádio');
            }
            
            const data = await response.json();
            
            return data.map(estacao => ({
                id: estacao.stationuuid,
                nome: estacao.name,
                url: estacao.url_resolved, 
                logo: estacao.favicon || 'img/default-radio.png',
                pais: estacao.countrycode,
                genero: estacao.tags
            }));
            
        } catch (error) {
            console.error("Erro no RadioService:", error);
            return [{
                id: 'offline',
                nome: 'Modo Offline ou Erro de Conexão',
                url: '',
                logo: '',
                pais: 'N/A'
            }];
        }
    }
};
