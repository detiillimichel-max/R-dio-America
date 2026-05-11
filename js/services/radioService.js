/**
 * Rádio-América - Serviço de Integração com Radio Browser API
 * Localização: js/services/radioService.js
 */

const API_BASE_URL = 'https://de1.api.radio-browser.info/json';

export const radioService = {
    /**
     * Busca estações do Brasil e de países da América Latina
     * @param {number} limite - Quantidade de estações por busca
     */
    async buscarEstacoesAmérica(limite = 20) {
        try {
            // Códigos ISO dos países da América Latina para busca
            // BR (Brasil), AR (Argentina), CL (Chile), CO (Colômbia), MX (México)
            const countryCodes = 'BR,AR,CL,CO,MX';
            
            const params = new URLSearchParams({
                countrycode: countryCodes,
                limit: limite,
                hidebroken: true, // Filtra apenas links ativos
                order: 'votes',   // Prioriza as rádios com melhor avaliação
                reverse: true
            });

            const response = await fetch(`${API_BASE_URL}/stations/search?${params}`);
            
            if (!response.ok) {
                throw new Error('Falha na conexão com o servidor de rádio');
            }
            
            const data = await response.json();
            
            // Tratamento dos dados para o formato do nosso Player
            return data.map(estacao => ({
                id: estacao.stationuuid,
                nome: estacao.name,
                url: estacao.url_resolved, // Link direto para o player de áudio
                logo: estacao.favicon || 'img/default-radio.png', // Logo da rádio ou padrão
                pais: estacao.countrycode,
                genero: estacao.tags
            }));
            
        } catch (error) {
            console.error("Erro no RadioService:", error);
            return []; // Retorna lista vazia para evitar quebras no app
        }
    }
};

