# 📻 R-dio-America

**R-dio-America** é um Web App (PWA) de alta performance desenvolvido para sintonizar as melhores estações de rádio do Brasil e da América Latina. O projeto utiliza uma estética **Glassmorphism** e uma arquitetura modular focada em dispositivos móveis.

---

## 🚀 Funcionalidades

- **Streaming em Tempo Real:** Conexão direta com diretórios globais de rádio via Radio Browser API.
- **Alcance Continental:** Filtro especializado para rádios do Brasil, Argentina, Chile, México e Colômbia.
- **Design Glassmorphism:** Interface moderna com efeitos de transparência e desfoque (Blur).
- **PWA (Progressive Web App):** Pode ser instalado na tela inicial do celular e funciona de forma independente.
- **Offline Ready:** Graças ao Service Worker, a interface carrega mesmo sem conexão com a internet.

## 🛠️ Tecnologias Utilizadas

* **HTML5 & CSS3:** Estrutura e estilização avançada com variáveis CSS.
* **JavaScript (ES6+):** Lógica modular com uso de `import/export`.
* **Radio Browser API:** Backend de dados gratuito e comunitário.
* **Service Workers:** Cache e suporte offline.
* **GitHub Pages:** Hospedagem rápida e segura.

## 📁 Estrutura de Pastas

```text
R-dio-America/
├── index.html          # Ponto de entrada e estrutura UI
├── sw.js               # Service Worker (Suporte Offline)
├── manifest.json       # Configurações de instalação mobile
├── js/
│   ├── main.js         # Lógica de controle do player e DOM
│   └── services/
│       └── radioService.js  # Integração com a API de Rádios
└── css/
    └── style.css       # Estilos Glassmorphism e Orbital UI
