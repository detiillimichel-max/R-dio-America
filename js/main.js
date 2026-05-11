/**
 * Rádio-América — js/main.js
 * FIX: checar estacaoAtual em vez de mainPlayer.src (src nunca é vazio após assignment)
 */

import { radioService } from './services/radioService.js';

const stationName = document.getElementById('station-name');
const btnPlay     = document.getElementById('btn-play');
const mainPlayer  = document.getElementById('main-player');
const orbitalNav  = document.getElementById('orbital-nav');

let estacoes      = [];
let estacaoAtual  = null;   // ← flag confiável de seleção
let carregando    = false;

/* ── Inicialização ── */
const init = async () => {
  stationName.innerText = 'Buscando rádios…';
  btnPlay.disabled      = true;

  estacoes = await radioService.buscarEstacoesAmérica(6);

  if (estacoes && estacoes.length > 0) {
    renderizarLista(estacoes);
    stationName.innerText = 'Rádio América';
  } else {
    stationName.innerText = 'Sem conexão com o servidor de rádios.';
    orbitalNav.innerHTML  = '<p style="opacity:.6;font-size:13px">Tente recarregar a página.</p>';
  }

  btnPlay.disabled = false;
};

/* ── Renderiza lista de estações ── */
const renderizarLista = (lista) => {
  orbitalNav.innerHTML = '';

  lista.forEach(estacao => {
    const item = document.createElement('div');
    item.className = 'station-item';

    const flagEmoji = { BR: '🇧🇷', AR: '🇦🇷', MX: '🇲🇽' }[estacao.pais] || '📻';

    item.innerHTML = `
      <img
        src="${estacao.logo || ''}"
        onerror="this.style.display='none'"
        style="width:36px;height:36px;border-radius:8px;object-fit:cover;flex-shrink:0"
      >
      <div style="min-width:0">
        <div style="font-weight:500;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          ${flagEmoji} ${escHtml(estacao.nome)}
        </div>
        <div style="font-size:11px;opacity:.6">${estacao.pais} ${estacao.genero ? '· ' + estacao.genero.split(',')[0] : ''}</div>
      </div>
    `;

    item.onclick = () => sintonizarRadio(estacao);
    orbitalNav.appendChild(item);
  });
};

/* ── Sintoniza uma estação ── */
const sintonizarRadio = async (estacao) => {
  if (!estacao.url) {
    stationName.innerText = 'Estação indisponível';
    return;
  }

  estacaoAtual          = estacao;
  stationName.innerText = `⏳ ${estacao.nome}`;
  btnPlay.innerText     = 'Carregando…';
  btnPlay.disabled      = true;

  mainPlayer.src = estacao.url;

  // Marca visualmente o item ativo
  document.querySelectorAll('.station-item').forEach(el =>
    el.classList.remove('active'));
  event?.currentTarget?.classList.add('active');

  try {
    await mainPlayer.play();
    stationName.innerText = `▶ ${estacao.nome}`;
    btnPlay.innerText     = 'Pausar';
  } catch (err) {
    console.error('Erro ao dar play:', err);
    stationName.innerText = `❌ ${estacao.nome} — sem sinal`;
    btnPlay.innerText     = 'Sintonizar';
    estacaoAtual          = null;
  } finally {
    btnPlay.disabled = false;
  }
};

/* ── Botão Play / Pausar ── */
btnPlay.onclick = () => {
  // FIX: usa flag estacaoAtual, não mainPlayer.src
  if (!estacaoAtual) {
    stationName.innerText = 'Selecione uma rádio acima ↑';
    return;
  }

  if (mainPlayer.paused) {
    mainPlayer.play().catch(console.error);
    stationName.innerText = `▶ ${estacaoAtual.nome}`;
    btnPlay.innerText     = 'Pausar';
  } else {
    mainPlayer.pause();
    stationName.innerText = `⏸ ${estacaoAtual.nome}`;
    btnPlay.innerText     = 'Sintonizar';
  }
};

/* ── Utilitário ── */
function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

init();
