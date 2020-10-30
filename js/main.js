console.log("Olá, mundo!");

       


function play(url) {
    return new Promise(function(resolve, reject) {   // return a promise
        var audio = new Audio();                     // create audio wo/ src
        audio.preload = "auto";                      // intend to play through
        audio.autoplay = true;                       // autoplay when loaded
        audio.onerror = reject;                      // on error, reject
        audio.onended = resolve;                     // when done, resolve
        
        var path = './efeitos/';
        var suffix = '.wav';
        audio.src = url; // just for example
        
    });
}

//console.log(som_HIT.play());

const sprites = new Image();
sprites.src ='./sprites.png';

const canvas = document.querySelector('canvas');//Selecionando a tag do canvas

const contexto = canvas.getContext('2d');//Definindo o jogo em 2D

// Plano de fundo
const fundo = {
    spriteX: 390, spriteY: 0,
    largura: 275, altura: 204,
    x: 0,         y: canvas.height - 204,
    desenha(){

        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0,0, canvas.width, canvas.height);

        contexto.drawImage(
            sprites,
            fundo.spriteX, fundo.spriteY, // Sprite y, sprite x
            fundo.largura, fundo.altura,  // tamanho do objeto no sprite
            fundo.x,       fundo.y,       // Posicionamento
            fundo.largura, fundo.altura,  // Tamanho do sprite dentro do canvas
        );
        contexto.drawImage(
            sprites,
            fundo.spriteX,             fundo.spriteY,
            fundo.largura,             fundo.altura,  
            (fundo.x + fundo.largura), fundo.y,       
            fundo.largura,             fundo.altura,  
        );
    }
};

//Chão
const chao ={
    spriteX:   0, spriteY: 610,
    largura: 224, altura:  112,
    x: 0,         y: canvas.height-112,
    desenha(){
        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY, // Sprite y, sprite x
            chao.largura, chao.altura,  // tamanho do objeto no sprite
            chao.x,       chao.y,       // Posicionamento
            chao.largura, chao.altura,  // Tamanho do sprite dentro do canvas
        );
        contexto.drawImage(
            sprites,
            chao.spriteX,          chao.spriteY, // Sprite y, sprite x
            chao.largura,          chao.altura,  // tamanho do objeto no sprite
            chao.x + chao.largura, chao.y,       // Posicionamento
            chao.largura,          chao.altura,  // Tamanho do sprite dentro do canvas
        );
    },
}

// Desenvolvendo a colisão com o chão
function fazColisao (flappyBird, chao){
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;
    if (flappyBirdY >= chaoY) {
        return true;
    }
    return false;
}

function criaFlappyBird(){
    // Objeto/estrutura que da vida ao passarinho
    const flappyBird = { 
        spriteX:  0, spriteY:  0,
        larugra: 33, altura:  24,
        x:       10, y:       50,
        velocidade: 0, gravidade: 0.25,
        pulo: 4.6,  // Criando a gravidade do pulo
        pula() {
            console.log("Devo pular");
            console.log('Antes', flappyBird.velocidade);
            flappyBird.velocidade = -flappyBird.pulo;
            console.log('depois', flappyBird.velocidade);
        },
        atualiza(){ // criando a gravidade
            if(fazColisao(flappyBird, chao)){
                console.log('Fez colisão');
                
                play('./efeitos/hit.wav');

               // console.log(path + hit + suffix);

            

                mudaDeTela(telas.INICIO);
                return;

            }
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        desenha() {
            contexto.drawImage(
                sprites, 
                flappyBird.spriteX, flappyBird.spriteY,// Sprite y, sprite x
                flappyBird.larugra, flappyBird.altura, // tamanho do objeto no sprite
                flappyBird.x,       flappyBird.y,      // Posicionamento
                flappyBird.larugra, flappyBird.altura, // Tamanho do sprite dentro do canvas
            ); 
        }
    }
    return flappyBird;
}



// Denahndo tela inicial
const mensagemIncial = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width /2) - 174 /2,
    y: 50,
    desenha(){
        contexto.drawImage(
            sprites,
            mensagemIncial.sX, mensagemIncial.sY,
            mensagemIncial.w, mensagemIncial.h,
            mensagemIncial.x, mensagemIncial.y,
            mensagemIncial.w, mensagemIncial.h    
        )
    }
};

// [Mudanças de tela]
const globais = {};
let telaAtiva = {};

function mudaDeTela(novaTela) {
    telaAtiva = novaTela;
    if (telaAtiva.inicializa){
       telaAtiva.inicializa();
    }
};


//Tela de início
const telas = {
    INICIO: {
        inicializa(){
            globais.flappyBird = criaFlappyBird();
        },
        desenha(){
            fundo.desenha();
            chao.desenha();
            globais.flappyBird.desenha();
            mensagemIncial.desenha();
        },
        click(){ //chamando a função click e passando o estado de mudança
            mudaDeTela(telas.JOGO);
        },
        atualiza() {
            
        }
    }
};

//Tela do Jogo
telas.JOGO = {
    desenha() {
        fundo.desenha();
        chao.desenha();
        globais.flappyBird.desenha();
    },
    click(){
        globais.flappyBird.pula();
    },
    atualiza() {
        globais.flappyBird.atualiza();
    }
};

function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();
    requestAnimationFrame(loop);
};

// Função que identifica o click na tela
window.addEventListener('click', function(){
    if(telaAtiva.click){
    telaAtiva.click();
    }
});

mudaDeTela(telas.INICIO);
loop();

