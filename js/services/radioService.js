/**
 * Rádio-América — js/services/radioService.js
 * Estratégia: tenta API Radio Browser com User-Agent correto.
 * Se falhar em todos os mirrors → usa lista hardcoded garantida.
 */

const MIRRORS = [
  'https://de1.api.radio-browser.info',
  'https://nl1.api.radio-browser.info',
  'https://at1.api.radio-browser.info',
  'https://fr1.api.radio-browser.info'
];

// ─── Estações hardcoded — funcionam sem API ───────────────────
const FALLBACK = [
  {
    id: 'band-fm-sp',
    nome: 'Band FM São Paulo',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/BAND_FMAAC.aac',
    logo: 'https://www.band.com.br/media/uploads/bandfm/logos/bandfm_logo.png',
    pais: 'BR',
    genero: 'Pop'
  },
  {
    id: 'jovem-pan-fm',
    nome: 'Jovem Pan FM',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOVPANFMAAC.aac',
    logo: 'https://jovempan.com.br/wp-content/uploads/2019/11/logo_JP_FB-1.jpg',
    pais: 'BR',
    genero: 'Notícias'
  },
  {
    id: 'mix-fm-sp',
    nome: 'Mix FM São Paulo',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/MIXFM_SPAAAC.aac',
    logo: 'https://s3.mixfm.com.br/wp-content/uploads/2019/09/logo_mixfm.png',
    pais: 'BR',
    genero: 'Pop'
  },
  {
    id: 'radio-nacional',
    nome: 'Rádio Nacional AM',
    url: 'https://radiobras.gov.br:9000/nacional',
    logo: '',
    pais: 'BR',
    genero: 'Variedades'
  },
  {
    id: 'radio-cultura-fm',
    nome: 'Cultura FM 97.9',
    url: 'https://ic7.streaming.com.br:9264/live',
    logo: '',
    pais: 'BR',
    genero: 'MPB'
  },
  {
    id: 'rock-mundial-ar',
    nome: 'Rock & Pop Buenos Aires',
    url: 'https://rp-radio.4emedios.com/rockpop',
    logo: '',
    pais: 'AR',
    genero: 'Rock'
  }
];

// ─── Busca via Radio Browser API ─────────────────────────────
async function fetchAPI(countrycode) {
  const params = new URLSearchParams({
    countrycode,
    limit:      '8',
    hidebroken: 'true',
    order:      'clickcount',
    reverse:    'true'
  });

  for (const mirror of MIRRORS) {
    try {
      const res = await fetch(
        `${mirror}/json/stations/search?${params}`,
        {
          headers: { 'User-Agent': 'RadioAmerica/1.0 (github.io)' },
          signal: AbortSignal.timeout(6000)
        }
      );
      if (!res.ok) continue;
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    } catch {
      // tenta o próximo mirror
    }
  }
  return [];
}

export const radioService = {
  async buscarEstacoesAmérica() {
    try {
      // Busca em paralelo nos 3 países
      const [br, ar, mx] = await Promise.all([
        fetchAPI('BR'),
        fetchAPI('AR'),
        fetchAPI('MX')
      ]);

      const todas = [...br, ...ar, ...mx];

      if (todas.length === 0) {
        console.warn('API falhou — usando estações hardcoded');
        return FALLBACK;
      }

      return todas
        .filter(e => e.url_resolved)
        .map(e => ({
          id:     e.stationuuid,
          nome:   e.name.trim(),
          url:    e.url_resolved,
          logo:   e.favicon || '',
          pais:   e.countrycode,
          genero: (e.tags || '').split(',')[0]
        }));

    } catch (err) {
      console.error('radioService erro:', err);
      return FALLBACK;
    }
  }
};
