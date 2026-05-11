/**
 * Rádio-América — js/services/radioService.js
 * FIX: countrycode não aceita múltiplos países na mesma query.
 *      Fazemos uma requisição por país e combinamos os resultados.
 */

// Servidores espelho do Radio Browser (fallback automático)
const MIRRORS = [
  'https://de1.api.radio-browser.info/json',
  'https://nl1.api.radio-browser.info/json',
  'https://at1.api.radio-browser.info/json'
];

async function fetchWithFallback(path, params) {
  for (const base of MIRRORS) {
    try {
      const url      = `${base}${path}?${new URLSearchParams(params)}`;
      const response = await fetch(url, { signal: AbortSignal.timeout(7000) });
      if (response.ok) return await response.json();
    } catch {
      // tenta o próximo espelho
    }
  }
  return null;
}

export const radioService = {
  /**
   * Busca estações de BR, AR e MX separadamente e mescla os resultados.
   * @param {number} porPais - estações por país
   */
  async buscarEstacoesAmérica(porPais = 6) {
    const paises = ['BR', 'AR', 'MX'];
    const params  = {
      limit:       porPais,
      hidebroken:  'true',
      order:       'clickcount',
      reverse:     'true'
    };

    try {
      const promises = paises.map(code =>
        fetchWithFallback('/stations/search', { ...params, countrycode: code })
      );

      const resultados = await Promise.allSettled(promises);
      const estacoes   = [];

      resultados.forEach(r => {
        if (r.status === 'fulfilled' && Array.isArray(r.value)) {
          r.value.forEach(e => {
            if (e.url_resolved) {           // ignora estações sem URL válida
              estacoes.push({
                id:     e.stationuuid,
                nome:   e.name.trim(),
                url:    e.url_resolved,
                logo:   e.favicon || '',
                pais:   e.countrycode,
                genero: e.tags || ''
              });
            }
          });
        }
      });

      return estacoes.length > 0 ? estacoes : null;

    } catch (error) {
      console.error('RadioService erro:', error);
      return null;
    }
  }
};
