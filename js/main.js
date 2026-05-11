/**
 * Rádio-América - Script Principal (Main)
 * Localização: js/main.js
 */

import { radioService } from './services/radioService.js';

// Seleção de elementos do DOM
const stationName = document.getElementById('station-name');
const btnPlay = document.getElementById('btn-play');
const mainPlayer = document.getElementById('main-player');
const orbitalNav = document.getElementById('orbital-nav');

let estacoes = [];
let estacaoAtual = null;

/**
 * Inicializa o aplicativo buscando as rádios
 */
const init = async () => {
    console.log("Iniciando Rádio América...");
    
    // Busca as rádios da América Latina via serviço modular
    estacoes = await radioService.buscarEstacoesAmérica(10);
    
    if (estacoes.length > 0 && estacoes[0].id !== 'offline') {
        renderizarLista(estacoes);
    } else {
        stationName.innerText = "Verifique sua conexão.";
    }
};

/**
 * Renderiza a lista de rádios com estilo Glassmorphism
 */
const renderizarLista = (lista) => {
    orbitalNav.innerHTML = ''; 
    
    lista.forEach((estacao) => {
        const item = document.createElement('div');
        // Estilo inline para garantir o visual enquanto o CSS externo é carregado
        item.style.background = "rgba(255, 255, 255, 0.1)";
        item.style.backdropFilter = "blur(10px)";
        item.style.webkitBackdropFilter = "blur(10px)";
        item.style.border = "1px solid rgba(255, 255, 255, 0.1)";
        item.style.borderRadius = "15px";
        item.style.padding = "15px";
        item.style.margin = "10px 0";
        item.style.cursor = "pointer";
        item.style.textAlign = "left";
        
        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <img src="${estacao.logo}" onerror="this.src='https://via.placeholder.com/40'" style="width: 40px; height: 40px; border-radius: 8px;">
                <div>
                    <div style="font-weight: 500; font-size: 14px;">${estacao.nome}</div>
                    <div style="font-size: 12px; opacity: 0.7;">${estacao.pais}</div>
                </div>
            </div>
        `;
        
        item.onclick = () => sintonizarRadio(estacao);
        orbitalNav.appendChild(item);
    });
};

/**
 * Controla a reprodução da rádio
 */
const sintonizarRadio = (estacao) => {
    if (!estacao.url) return;
    
    estacaoAtual = estacao;
    stationName.innerText = estacao.nome;
    
    mainPlayer.src = estacao.url;
    mainPlayer.play().catch(err => {
        console.error("Erro ao dar play:", err);
        alert("Não foi possível reproduzir esta estação no momento.");
    });
    
    btnPlay.innerText = "Pausar";
};

// Controle de Play/Pause do botão principal
btnPlay.onclick = () => {
    if (!mainPlayer.src) {
        alert("Selecione uma rádio primeiro!");
        return;
    }

    if (mainPlayer.paused) {
        mainPlayer.play();
        btnPlay.innerText = "Pausar";
    } else {
        mainPlayer.pause();
        btnPlay.innerText = "Sintonizar";
    }
};

// Dispara a inicialização
init();
