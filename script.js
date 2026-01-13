const nomeCapitulo = document.getElementById("capitulo");
const audio = document.getElementById("audio-capitulo");
const botaoPlayPause = document.getElementById("play-pause");
const botaoProximoCapitulo = document.getElementById("proximo");
const botaoCapituloAnterior = document.getElementById("anterior");

// Configurações
const quantidadeCapitulos = 12;
let taTocando = false;
let capitulo = 1;

// Variável auxiliar para controlar se a faixa DEVE tocar ao carregar.
// Essencial para diferenciar o avanço automático (true) do manual (false).
let deveTocarAoCarregar = false;

// =======================================================
// FUNÇÕES DE CONTROLE DE REPRODUÇÃO E ESTADO
// =======================================================

function tocarFaixa() {
    // Tentar tocar. Se falhar na primeira vez, o loadeddata irá tentar de novo.
    audio.play(); 
    taTocando = true;
    botaoPlayPause.classList.add("tocando");
}

function pausarFaixa() {
    audio.pause();
    taTocando = false;
    botaoPlayPause.classList.remove("tocando");
}

function tocarOuPausarFaixa() {
    if (taTocando === true) {
        pausarFaixa();
    } else {
        tocarFaixa();
    }
}

// Função auxiliar para atualizar a fonte do áudio e o texto do capítulo
function mudarCapitulo() {
    // Atualiza a fonte do áudio (isso dispara o evento 'loadeddata')
    audio.src = "/audios/" + capitulo + ".mp3";
    nomeCapitulo.innerText = "Capítulo " + capitulo;
}

// =======================================================
// FUNÇÕES DE NAVEGAÇÃO
// =======================================================

function capituloAnterior() {
    // 1. O usuário clicou manualmente: o estado desejado é PAUSADO
    deveTocarAoCarregar = false;
    
    // 2. Pausa o áudio, mas MANTÉM a aparência de pausa no botão
    pausarFaixa();

    // 3. Lógica de loop para o capítulo anterior
    if (capitulo === 1) {
        capitulo = quantidadeCapitulos; // Vai para o último
    } else {
        capitulo -= 1; // Volta um
    }
    
    // 4. Atualiza a fonte
    mudarCapitulo();
}

function proximoCapitulo() {
    // 1. O usuário clicou manualmente: o estado desejado é PAUSADO
    deveTocarAoCarregar = false;

    // 2. Pausa o áudio, mas MANTÉM a aparência de pausa no botão
    pausarFaixa(); 

    // 3. Lógica de loop para o próximo capítulo
    if (capitulo < quantidadeCapitulos) {
        capitulo += 1; // Avança um
    } else {
        capitulo = 1; // Volta para o primeiro
    }

    // 4. Atualiza a fonte
    mudarCapitulo();
}


// =======================================================
// EVENT LISTENERS
// =======================================================

// Ação principal: Tocar/Pausar
botaoPlayPause.addEventListener("click", tocarOuPausarFaixa);

// Ações de navegação
botaoCapituloAnterior.addEventListener("click", capituloAnterior);
botaoProximoCapitulo.addEventListener("click", proximoCapitulo);

// OUVINTE CRÍTICO: Toca a faixa SÓ se os dados foram carregados E 
// (seja porque o 'ended' pediu, ou o usuário estava tocando e a primeira tentativa de play falhou).
audio.addEventListener("loadeddata", () => {
    // Se a flag for 'true' (acionada pelo 'ended') ou se o player estiver no estado 'tocando'
    if (deveTocarAoCarregar === true || taTocando === true) {
        tocarFaixa();
    }
    // Reseta a flag para o estado padrão
    deveTocarAoCarregar = false; 
});


// Quando o áudio atual termina, avança para o próximo (avanço automático).
audio.addEventListener("ended", () => {
    // 1. Define que o próximo capítulo DEVE tocar
    deveTocarAoCarregar = true; 
    
    // 2. Avança para o próximo capítulo
    proximoCapitulo();
});

// =======================================================
// INICIALIZAÇÃO
// =======================================================
// Garante que o estado inicial (Capítulo 1) seja carregado corretamente 
// e o listener 'loadeddata' seja ativado no carregamento da página.
document.addEventListener("DOMContentLoaded", () => {
    mudarCapitulo();
});