const palavras = [
    "bananinha", "hype", "brahminha", "lapide", "loucas", "islandia", "wynwood",
    "porks", "edição comemorativa", "comemorativa", "trave", "larva", "brodway",
    "lindsay", "yaglandula", "da lhe", "dar lhe", "faz o l", "botina", "epoca errada",
    "quem estuda é burro", "burro", "trouxa", "rico", "galão", "agua", "pão",
    "mercadinho", "perfumes", "personagem", "eu odeio eu", "vou nanar", "minha toro",
    "toro", "estagiario", "sustentar o muniz na faculdade", "fortal", "financeia",
    "usa portugues quem precisa", "ilha", "farol", "dormiu de botina", "MM", "Ocean Blue",
    "Hamburgueria do X", "X Vinhos", "Oliver", "eu odeio eu", "o pai é bonito", "brahma litrão",
    "paisagismo", "visagismo", "roleta", "lhe da", "bleu de channel"
];

const xingamentos = [
    "um corno", "um jumento", "fudido", "otário", "uma aberração", "um gordo morfético", 
    "uma baleia azul", "um fedido que não sabe nada de perfume", "um eau de channel", "uma bananinha bem passada",
    "amante do netão beef", "uma brahma litrão quente", "casado", "a nutricionista do yagao",
    "fretista do tio do ricieri", "babaca", "estudado", "graduado", "um dublê de rico", "um careca", "um calvo",
    "um pega ninguém", "horroroso"
];

const audiosWin = ['caramaisarrombado.mp3', 'comoconsegueviajar.mp3', 'cuidadavida.mp3', 'gabrielvaixavecar.mp3',
            'grupodemerdadocaraio.mp3', 'grupodepersonagens.mp3', 'inimigodaverdade.mp3', 'invejadocebola.mp3',
            'naotemumpapo.mp3', 'naotoacreditandodeuspai.mp3', 'nossakike.mp3', 'paradefalarmeunome.mp3',
            'pediupromunizvoltar.mp3', 'pqyagotenis.mp3', 'quedecadencia.mp3', 'sabadao10hdamanha.mp3',
            'socompronopda.mp3', 'teniscaro.mp3', 'tonolimite.mp3', 'xparedeacordarcedo.mp3'];

const audiosLose = ['euodeioeu.mp3', 'jumentostrouxas.mp3', 'loucasfalandodogab.mp3', 'tateno.mp3', 'xeumerro.mp3'];

let palavraSecreta;
let letrasErradas;
let letrasCorretas;
let tentativasRestantes;
let audioMutado = false;

document.addEventListener("DOMContentLoaded", iniciarJogo);
document.getElementById("chutar-btn").addEventListener("click", verificarTentativa);
document.getElementById("reiniciar-btn").addEventListener("click", reiniciarJogo);
document.getElementById("mute-btn").addEventListener("click", alternarMute);

const letraInput = document.getElementById("letra-input");

letraInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        verificarTentativa();
    }
});

function normalizarLetra(letra) {
    return letra.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

function iniciarJogo() {
    palavraSecreta = palavras[Math.floor(Math.random() * palavras.length)].toUpperCase();
    letrasErradas = new Set();
    letrasCorretas = new Set();
    tentativasRestantes = 6;
    atualizarEstado();
    tocarAudioInicio();
}

function atualizarEstado() {
    // Cria uma representação da palavra oculta, preservando espaços
    const letrasOcultas = Array.from(palavraSecreta).map(letra => 
        letra === ' ' ? ' ' : (letrasCorretas.has(normalizarLetra(letra)) ? letra : '_')
    ).join('');

    document.getElementById("palavra").textContent = letrasOcultas;
    document.getElementById("tentativas").textContent = `Tentativas restantes: ${tentativasRestantes}`;
    document.getElementById("letras-erradas").textContent = `Letras erradas: ${Array.from(letrasErradas).join(', ')}`;
    document.getElementById("mensagem").textContent = "";
}

function verificarTentativa() {
    const letra = normalizarLetra(letraInput.value);
    letraInput.value = "";

    if (letra && letra.length === 1 && letra.match(/[A-Z]/i)) {
        if (letrasErradas.has(letra) || letrasCorretas.has(letra)) {
            document.getElementById("mensagem").textContent = "Você já chutou essa letra, T R O U X A!";
        } else {
            tentativa(letra);
        }
    } else {
        document.getElementById("mensagem").textContent = "É só pra usar LETRA, seu B U R R O! kkkkkk";
    }
}

function tentativa(letra) {
    let mensagemErro = "";

    if (normalizarLetra(palavraSecreta).includes(letra)) {
        letrasCorretas.add(letra);
    } else {
        letrasErradas.add(letra);
        tentativasRestantes--;
        mensagemErro = `Errou! Você é ${xingamentos[Math.floor(Math.random() * xingamentos.length)]} mesmo.`;
    }

    atualizarEstado();
    checarFimDeJogo(mensagemErro);
}

function checarFimDeJogo(mensagemErro) {
    const letrasPalavraSecreta = new Set(normalizarLetra(palavraSecreta).replace(/ /g, ''));
    const letrasCorretasSet = new Set(Array.from(palavraSecreta).map(letra => normalizarLetra(letra)).filter(letra => letra !== ' '));
    
    if ([...letrasCorretasSet].every(letra => letrasCorretas.has(letra))) {
        tocarAudioVitoria();
        document.getElementById("mensagem").textContent = `Nossa, parabens em, to impressionado com a sua inteligencia... Q inveja que eu to de vc.\na palavra era: ${palavraSecreta}`;
        document.getElementById("letra-input").disabled = true;
        document.getElementById("reiniciar-btn").style.display = 'block';
    } else if (tentativasRestantes <= 0) {
        tocarAudioDerrota();
        document.getElementById("mensagem").textContent = `Vc deve ter estudado muito mesmo porque vc é BURRO KKKKKKKKKKK\n\nA palavra certa era "${palavraSecreta}", nem pelo hype vc consegue se manter, aiaiai...`;
        document.getElementById("letra-input").disabled = true;
        document.getElementById("reiniciar-btn").style.display = 'block';
    } else {
        document.getElementById("mensagem").textContent = mensagemErro;
    }
}

function reiniciarJogo() {
    iniciarJogo();
    document.getElementById("letra-input").disabled = false;
    document.getElementById("reiniciar-btn").style.display = 'none';
    document.getElementById("audio-vitoria").src = '';
    document.getElementById("audio-derrota").src = '';
}

function tocarAudioInicio() {
    if (!audioMutado) {
        document.getElementById("audio-inicio").play();
    }
}

function tocarAudioVitoria() {
    if (!audioMutado) {
        const audio = document.getElementById("audio-vitoria");
        audio.src = `audios/win/${audiosWin[Math.floor(Math.random() * audiosWin.length)]}`;
        audio.play();
    }
}

function tocarAudioDerrota() {
    if (!audioMutado) {
        const audio = document.getElementById("audio-derrota");
        audio.src = `audios/lose/${audiosLose[Math.floor(Math.random() * audiosLose.length)]}`;
        audio.play();
    }
}

function alternarMute() {
    audioMutado = !audioMutado;
    document.getElementById("mute-btn").textContent = audioMutado ? '🔇' : '🔊';
}
