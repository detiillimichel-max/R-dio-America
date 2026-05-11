/**
 * Rádio-América - Script Principal (Main)
 * Responsável por inicializar o app e controlar o player
 */

import { radioService } from './services/radioService.js';

// Seleção de elementos do DOM (conforme o index.html que criamos)
const stationName = document.getElementById('station-name');
const btnPlay = document.getElementById('btn-play');
const mainPlayer = document.getElementById('main-player');
const orbitalNav = document.getElementById('orbital-nav');

let estacoes = [];
let estacaoAtual = null;

// Função para inicializar o App
const init = async () => {
    console.log("Iniciando Rádio América...");
    
    // 1. Busca as rádios da América Latina
    estacoes = await radioService.buscarEstacoesAmérica(10);
    
    if (estacoes.length > 0) {
        renderizarLista(estacoes);
    } else {
        stationName.innerText = "Erro ao carregar rádios.";
    }
};

// Função para renderizar as opções no estilo Orbital
const renderizarLista = (lista) => {
    orbitalNav.innerHTML = ''; // Limpa antes de renderizar
    
    lista.forEach((estacao, index) => {
        const item = document.createElement('div');
        item.className = 'radio-item glass-card';
        item.style.margin = "10px 0";
        item.style.cursor = "pointer";
        item.innerHTML = `<strong>${estacao.nome}</strong> <br> <small>${estacao.pais}</small>`;
        
        item.onclick = () => sintonizarRadio(estacao);
        orbitalNav.appendChild(item);
    });
};

// Função para dar o Play na rádio selecionada
const sintonizarRadio = (estacao) => {
    estacaoAtual = estacao;
    stationName.innerText = estacao.nome;
    
    mainPlayer.src = estacao.url;
    mainPlayer.play();
    
    btnPlay.innerText = "Pausar";
    console.log(`Sintonizado em: ${estacao.nome}`);
};

// Evento do Botão Play/Pause Principal
btnPlay.onclick = () => {
    if (mainPlayer.paused) {
        mainPlayer.play();
        btnPlay.innerText = "Pausar";
    } else {
        mainPlayer.pause();
        btnPlay.innerText = "Sintonizar";
    }
};

// Rodar inicialização
init();

