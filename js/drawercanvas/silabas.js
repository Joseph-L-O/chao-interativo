let middleScreenW = window.innerWidth / 2
let middleScreenH = window.innerHeight / 2


const words = ["AL-GO-DÃO", "LI-NHO", "FI-BRA"]
const wordsmeaning = [
    {
        title: "ALGODÃO",
        description: "Qui aliqua aliqua deserunt reprehenderit mollit voluptate occaecat anim adipisicing duis ullamco adipisicing pariatur. Aliquip consequat laboris incididunt pariatur aute. Proident ullamco laboris esse esse ut eu do. Quis duis ut sint ad incididunt. Sit mollit anim aute eu exercitation pariatur quis sunt. Voluptate occaecat commodo exercitation aliqua labore consectetur et incididunt veniam et ut."
    },
    {
        title: "LINHO",
        description: "Qui aliqua aliqua deserunt reprehenderit mollit voluptate occaecat anim adipisicing duis ullamco adipisicing pariatur. Aliquip consequat laboris incididunt pariatur aute. Proident ullamco laboris esse esse ut eu do. Quis duis ut sint ad incididunt. Sit mollit anim aute eu exercitation pariatur quis sunt. Voluptate occaecat commodo exercitation aliqua labore consectetur et incididunt veniam et ut."
    },
    {
        title: "FIBRA",
        description: "Qui aliqua aliqua deserunt reprehenderit mollit voluptate occaecat anim adipisicing duis ullamco adipisicing pariatur. Aliquip consequat laboris incididunt pariatur aute. Proident ullamco laboris esse esse ut eu do. Quis duis ut sint ad incididunt. Sit mollit anim aute eu exercitation pariatur quis sunt. Voluptate occaecat commodo exercitation aliqua labore consectetur et incididunt veniam et ut."
    }
]

let syllable = []
words.map(val => syllable.push(val.split("-")))
let textsInitialPosition = []
let texts = []


syllable.map((val, index) => {
    val.map((value, ind) => {
        textsInitialPosition.push({ x: middleScreenW + genRandNum(0, 500), y: middleScreenH + genRandNum(0, 150) })
        texts.push({
            text: value,
            x: textsInitialPosition[textsInitialPosition.length - 1].x,
            y: textsInitialPosition[textsInitialPosition.length - 1].y,
            width: 90,
            height: 90,
            xspd: 0,
            yspd: 0,
            index: ind == 0 ? "first" : ind == val.length - 1 && val.length > 2 ? "last" : "middle",
            word: index
        })
    })
})

function genRandNum(min, max) {
    let num = Math.floor(Math.random() * (max - min + 1)) + min

    if (Math.random() >= 0.5)
        return num
    else
        return num * -1
}


function roundRect(
    ctx,
    x,
    y,
    width,
    height,
    radius = 5,
    fill = false,
    stroke = true
) {
    if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

function printAt(context, text, x, y, lineHeight, fitWidth) {
    fitWidth = fitWidth || 0;

    if (fitWidth <= 0) {
        context.fillText(text, x, y);
        return;
    }

    for (var idx = 1; idx <= text.length; idx++) {
        var str = text.substr(0, idx);
        if (context.measureText(str).width > fitWidth) {
            context.fillText(text.substr(0, idx - 1), x, y);
            printAt(context, text.substr(idx - 1), x, y + lineHeight, lineHeight, fitWidth);
            return;
        }
    }
    context.fillText(text, x, y);
}