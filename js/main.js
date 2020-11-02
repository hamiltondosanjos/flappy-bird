console.log("Olá, mundo!");

//console.log(som_HIT.play());
let frames = 0;
const sprites = new Image();
sprites.src ='./sprites.png';

const canvas = document.querySelector('canvas');//Selecionando a tag do canvas
const contexto = canvas.getContext('2d');//Definindo o jogo em 2D

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

// [PLANO DE FUNDO]
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
//[CHÃO]
function criaChao(){
    const chao ={
        spriteX:   0, spriteY: 610,
        largura: 224, altura:  112,
        x: 0, y: canvas.height-112,
        atualiza(){
            
            const movimentoDoChao = 1;
            const repeteEm = chao.largura / 2;
            chao.x = chao.x - movimentoDoChao;
            const movimentacao = chao.x - movimentoDoChao;
            chao.x = movimentacao % repeteEm;
        },

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
                chao.spriteX,          chao.spriteY,
                chao.largura,          chao.altura,  
                chao.x + chao.largura, chao.y,       
                chao.largura,          chao.altura,  
            );
        },
    };
    return chao;
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
//[PÁSSARO]
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
            
            flappyBird.velocidade = -flappyBird.pulo;
           
        },
        atualiza(){ // criando a gravidade
            if(fazColisao(flappyBird, globais.chao)){
                //play('./efeitos/hit.wav');
                setTimeout(() => { 
                    mudaDeTela (Telas.INICIO);
                     
                }, 60 ); 
                return;
            }

            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },

        movimentos: [
            { spriteX: 0, spriteY:  0,  }, // asa pra cima
            { spriteX: 0, spriteY: 26, }, // asa no meio 
            { spriteX: 0, spriteY: 52, }, // asa pra baixo
            { spriteX: 0, spriteY: 26, }, // asa no meio 
          ],

        frameAtual: 0,

        atualizaFrameAtual() {     
            const intervaloDeFrames = 10;
            const passouOIntervalo  = frames % intervaloDeFrames === 0;
            // console.log('passouOIntervalo', passouOIntervalo)
      
            if(passouOIntervalo) {
              const baseDoIncremento = 1;
              const incremento       = baseDoIncremento + flappyBird.frameAtual;
              const baseRepeticao    = flappyBird.movimentos.length;
              flappyBird.frameAtual  = incremento % baseRepeticao
            }
              // console.log('[incremento]', incremento);
              // console.log('[baseRepeticao]',baseRepeticao);
              // console.log('[frame]', incremento % baseRepeticao);
          },

        desenha() {
            flappyBird.atualizaFrameAtual();
            const {spriteX, spriteY}= flappyBird.movimentos[flappyBird.frameAtual];

            contexto.drawImage(
                sprites, 
                spriteX, spriteY,// Sprite y, sprite x
                flappyBird.larugra, flappyBird.altura, // tamanho do objeto no sprite
                flappyBird.x,       flappyBird.y,      // Posicionamento
                flappyBird.larugra, flappyBird.altura, // Tamanho do sprite dentro do canvas
            ); 
        }
    }
    return flappyBird;
}
//[CANOS]
function criaCanos() {
    const canos = {
        largura: 52, altura: 400,
        chao: {
            spriteX: 0, spriteY: 169,
        },
        ceu: {
            spriteX: 52, spriteY: 169,
        },
        espaco: 80,
        desenha() {
            canos.pares.forEach(function(par) {

                const yRandom = par.y;
                const espacamentoEntreCanos = 130;
        
                const canoCeuX = par.x;
                const canoCeuY = yRandom; 
    
                // [Cano do Céu]
                contexto.drawImage(
                    sprites, 
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura,     canos.altura,
                    canoCeuX,          canoCeuY,
                    canos.largura,     canos.altura,
                )
            
                // [Cano do Chão]
                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom; 
                contexto.drawImage(
                    sprites, 
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura,      canos.altura,
                    canoChaoX,          canoChaoY,
                    canos.largura,      canos.altura,
                )
    
                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY
                }
                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY
                }
            })
        },

        temColisaoComOFlappyBird(par){
            const cabecaDoFlappy = globais.flappyBird.y;
            const peDoPlappy = globais.flappyBird.y + globais.flappyBird.altura;

            if(globais.flappyBird.x >= par.x)
            {
                console.log('Flappy bird invadiu a área dos canos');

                if (cabecaDoFlappy <= par.canoCeu.y) {
                    return true;
                }
                if (peDoPlappy >= par.canoChao.y) {
                    return true;
                }
            };

            return false;
        },

        pares: [],
   
        atualiza() {
        const passou100Frames = frames % 100 === 0;
        if(passou100Frames) {
            console.log('Passou 100 frames');
            canos.pares.push(
                {
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                }
            );
        };

       canos.pares.forEach(function(par) {
        par.x = par.x - 2;

        if (canos.temColisaoComOFlappyBird(par)) {
            console.log("Você perdeu");
            mudaDeTela(Telas.INICIO);
        }

        if (par.x + canos.largura <= 0) {
             canos.pares.shift();
        
        }

    //     if(canos.temColisaoComOFlappyBird(par)) {
    //       console.log('Você perdeu!')
    //       mudaParaTela(Telas.INICIO);
    //     }

    //     if(par.x + canos.largura <= 0) {
    //       canos.pares.shift();
    //     }
      });

    }
  }

  return canos;
};

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
// [VARIÁVEIS DE TELA]
const globais = {};
let telaAtiva = {};

function mudaDeTela(novaTela) {
    telaAtiva = novaTela;
    if (telaAtiva.inicializa){
       telaAtiva.inicializa();
    }
};
//[TELA DE INÍCIO]
const Telas = {
    INICIO: {
        inicializa(){
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos();
            
        },
        desenha(){
            fundo.desenha();
            globais.flappyBird.desenha(); 
            globais.chao.desenha();
            mensagemIncial.desenha();

        },
        click(){ //chamando a função click e passando o estado de mudança
            mudaDeTela(Telas.JOGO);
        },
        atualiza() {
            globais.chao.atualiza(); 
        }
    }
};
//Tela do Jogo
Telas.JOGO = {
    desenha() {
      fundo.desenha();
      globais.canos.desenha();
      globais.chao.desenha();
      globais.flappyBird.desenha();
    },
    click() {
      globais.flappyBird.pula();
    },
    atualiza() {
      globais.canos.atualiza();
      globais.chao.atualiza();
      globais.flappyBird.atualiza();
    }
  };
  
  
//[LOOP]
function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames = frames + 1;
    requestAnimationFrame(loop);
};
// Função que identifica o click na tela
window.addEventListener('click', function(){
    if(telaAtiva.click){
    telaAtiva.click();
    }
});

mudaDeTela(Telas.INICIO);
    loop();

