//------------------- variáveis ------------------------------------

const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];

const canvasCtx = canvasElement.getContext('2d');
canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;
let land = [];
let indicator = [];
let picked = false;
let wordData
let wordCompleted = false
let img = new Image();
img.src = "./Background.png";
let backgroundColor = 0x000000;

//------------------------- métodos -------------------------------

// método de renderização dos itens
function onResults(results) {
    canvasCtx.save();
    drawRectbackground(canvasCtx);
    // mapeando todos os textos
    texts.map((silaba, ind) => {
        //seta a cor, a fonte e desenha o texto no canvas
        canvasCtx.fillStyle = "rgba(255,255,255,1)";
        canvasCtx.font = "50px Heavitas";
        canvasCtx.fillText(silaba?.text, silaba?.x, silaba?.y + silaba?.height / 2)

        //verificações de física
        if (silaba) silaba.x += silaba?.xspd / 10
        if (silaba) silaba.y += silaba?.yspd / 10
        //verificações de atrito
        if (silaba?.xspd - 10 > 0)
            silaba.xspd -= 10
        else if (silaba?.xspd + 10 < 0)
            silaba.xspd += 10
        else if (silaba)
            silaba.xspd = 0

        if (silaba?.yspd - 10 > 0)
            silaba.yspd -= 10;
        else if (silaba?.yspd + 10 < 0)
            silaba.yspd += 10
        else if (silaba)
            silaba.yspd = 0

        // verifica se está fora da tela
        if (silaba?.x > window.innerWidth - silaba?.width || silaba?.x < 0) {
            if (silaba) silaba.x = textsInitialPosition[ind].x
            if (silaba) silaba.y = textsInitialPosition[ind].y
            if (silaba) silaba.xspd = 0
            if (silaba) silaba.yspd = 0
        }
        if (silaba?.y + silaba?.height > window.innerHeight || silaba?.y < 0) {
            if (silaba) silaba.x = textsInitialPosition[ind].x
            if (silaba) silaba.y = textsInitialPosition[ind].y
            if (silaba) silaba.xspd = 0
            if (silaba) silaba.yspd = 0
        }

        //mapeamento de colisões com outros textos
        texts.map((boxpos, index) => {
            var side = index != ind && silaba ? collide(silaba, boxpos) : 0;
            let x = silaba?.x;
            let y = silaba?.y;
            if (index != ind && side !== 0 && silaba.word == boxpos.word) {
                redrawWord(silaba, ind, boxpos, index, side)
            }
        })

        // mapeamento de colisões com a mão
        indicator.map((hand) => {
            // posição x da colisão
            let x = hand?.centro.x * canvasElement.width;
            // posição y da colisão
            let y = hand?.centro.y * canvasElement.height;


            // validação da colisão
            if (x - 30 < silaba?.x + silaba?.width &&
                x + 30 > silaba?.x &&
                y - 30 < silaba?.y + silaba?.height &&
                y + 30 > silaba?.y) {

                silaba.xspd -= x - silaba?.x - (silaba?.width / 3)
                silaba.yspd -= y - silaba?.y - (silaba?.height / 3)
            }
        })

    })


    // reset do array de mãos
    indicator = []

    // implementação das mãos no código
    if (results.multiHandLandmarks) {
        results.multiHandLandmarks.map((landmarks, index) => {
            landmarks.map((mao, ind,) => {
                land[ind] = { x: (mao?.x * -1) + 1, y: mao?.y, z: mao?.z, visible: mao?.visible };
            });
            for (let i = 0; i < landmarks.length; i++) {
                if (i != 8) {
                    landmarks[i].x = undefined
                }
                landmarks[i].x = (landmarks[i].x)
            }
            indicator.push({ centro: landmarks[8] });

            // drawConnectors(canvasCtx, land, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
            // drawLandmarks(canvasCtx, land, { color: '#FF0000', lineWidth: 2 });
            drawLandmarks(canvasCtx, landmarks, { color: '#FFFF00', lineWidth: 60 });

        })
    }

    if (wordCompleted) {
        canvasCtx.save();
        canvasCtx.fillStyle = "rgba(0,0,0,0.4)";
        roundRect(canvasCtx, middleScreenW / 4, middleScreenH / 2, middleScreenW / 1.5, middleScreenH, 20, true);
        canvasCtx.fillStyle = "rgba(255,255,255,1)";
        canvasCtx.font = "30px Heavitas";
        canvasCtx.fillText(wordData.title, middleScreenW / 2 - 15, middleScreenH / 2 + 50)
        canvasCtx.font = "20px Heavitas";
        printAt(canvasCtx, wordData.description, middleScreenW / 4 + 15, middleScreenH / 2 + 80, 20, middleScreenW / 1.5 - 25)
        canvasCtx.translate(window.innerWidth, window.innerHeight);
        canvasCtx.rotate(180 * (Math.PI / 180));

        canvasCtx.fillStyle = "rgba(0,0,0,0.4)";
        roundRect(canvasCtx, middleScreenW / 4, middleScreenH / 2, middleScreenW / 1.5, middleScreenH, 20, true);
        canvasCtx.fillStyle = "rgba(255,255,255,1)";
        canvasCtx.font = "30px Heavitas";
        canvasCtx.fillText(wordData.title, middleScreenW / 2 - 15, middleScreenH / 2 + 50)
        canvasCtx.font = "20px Heavitas";
        printAt(canvasCtx, wordData.description, middleScreenW / 4 + 15, middleScreenH / 2 + 80, 20, middleScreenW / 1.5 - 25)
        canvasCtx.restore();
    }

    // restauração do canvas
    canvasCtx.restore();
}

// desenho do background
function drawRectbackground(silaba) {
    silaba?.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(img, 0, 1, img.width, img.height, 0, 0, window.innerWidth, window.innerHeight)
}

// desenho da caixa de colisão
function drawBoxExample(canvasCtx, pos, sizeW, sizeH, depth) {
    canvasCtx.fillStyle = "rgba(0,0,255," + depth + ")";
    canvasCtx.fillRect(pos?.x, pos?.y, sizeW, sizeH);
}

// método de verificação de colisões
function collide(r1, r2) {
    var dx = (r1.x + r1.width / 2) - (r2.x + r2.width / 2);
    var dy = (r1.y + r1.height / 2) - (r2.y + r2.height / 2);
    var width = (r1.width + r2.width) / 2;
    var height = (r1.height + r2.height) / 2;
    var crossWidth = width * dy;
    var crossHeight = height * dx;
    var collision = 0;

    if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
        if (crossWidth > crossHeight) {
            collision = (crossWidth > (-crossHeight)) ? 0 : (-1);
        } else {
            collision = (crossWidth > -(crossHeight)) ? 1 : 0;
        }
    }
    return (collision);
}

// método para redesenhar as sílabas unindo elas
function redrawWord(silaba, ind, boxpos, index, side) {

    if ((silaba.index == "first" || silaba.index == "last") && boxpos.index == "middle") {
        newText = (side > 0 && silaba.index == "last") ? boxpos.text + silaba?.text :
            (side < 0 && silaba.index == "first") ? silaba?.text + boxpos.text : undefined
        if (newText) {
            newTextsOperation = {
                text: newText,
                x: silaba?.x,
                y: silaba?.y,
                width: boxpos?.width + 90,
                height: 90,
                xspd: 0,
                yspd: 0,
                index: "middle",
                word: silaba.word
            };

            texts.push(newTextsOperation)
            texts[ind] = undefined
            texts[index] = undefined
            texts = texts.filter((element) => element !== undefined)
        }
        if (texts.filter(elem => elem.word == silaba.word).length == 1) {
            showTheWordMeaning(silaba.word)
        }
    }
}

function showTheWordMeaning(word) {
    wordData = wordsmeaning[word]
    wordCompleted = true
    setTimeout(() => {
        wordCompleted = false;
        texts[texts.length - 1] = undefined
        texts = texts.filter(ele => ele !== undefined)
    }, 30000);
}
