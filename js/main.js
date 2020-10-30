console.log("Olá, mundo!");

const sprites = new Image();
sprites.src ='./sprites.png';
//Selecionando a tag do canvas
const canvas = document.querySelector('canvas');
//Definindo o jogo em 2D
const contexto = canvas.getContext('2d');

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
// Objeto/estrutura que da vida ao passarinho
const flappyBird = { 
    spriteX:  0, spriteY:  0,
    larugra: 33, altura:  24,
    x:       10, y:       50,
    velocidade: 0, gravidade: 0.25,
    atualiza(){ // criando a gravidade
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

let telaAtiva = {};

function mudaDeTela(novaTela) {
    telaAtiva = novaTela;
};


//Tela de início
const telas = {
    INICIO: {
        desenha(){
            flappyBird.desenha();
            fundo.desenha();
            chao.desenha();
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
        flappyBird.desenha();
    },
    atualiza() {
        flappyBird.atualiza();
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

