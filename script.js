const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext('2d');

const image = new Image();
image.src = 'img5.jpg';

//image.width *= 2;
//image.height *= 2;

/*
let tmp = resizeImg(image);
console.log(tmp);
*/

let lastTime = 0;

let rad = 0;

let v = 7.0;

let dot_x = canvas.width / 2;
let dot_y = canvas.height / 4 * 3;

class Scene {
  constructor() {
    this.game = 0;
    this.gameover = 1;
    this.goal = 2;
  }
}
const SceneType = new Scene();
let scene = SceneType.game;

let keys = {};
function keyDown(event){
    keys[event.key] = true;
    console.log(keys);
    console.log(rad);
}

function keyUp(event){
    keys[event.key] = false;
    console.log(keys);
    console.log(rad);
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

let x = 0;
let y = 0;
image.decode().then(() => {
    //x = image.width / 2;
    //y = image.height / 2 + 20;
    x = 500 - 300;
    y = 350 - 170;
    
})

/*
function resizeImg(imgData) {
  const canvas = document.createElement('canvas');
  canvas.width = 150;
  canvas.height = 150;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgData, 0, 0, 150, 150, 0, 0, 150, 150);
  return canvas.toDataURL('image/png')
}
  */

function drawMap(resize_rate = 10) {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    

    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    let width = image.width * resize_rate;
    let height = image.height * resize_rate;

    //console.log(width, height);

    ctx.translate(dot_x, dot_y);


    ctx.rotate(rad);
    ctx.drawImage(image,  - x * resize_rate,  -y * resize_rate, width, height);
    //console.log(- x * resize_rate,  -y * resize_rate, width, height);
    ctx.restore();
}

function atari_hantei(hanni = 5) {
    var imgData = ctx.getImageData(dot_x - 2, dot_y - 2, hanni, hanni);

    for (i = 0; i < 25; i++) {
        let red = imgData.data[i * 4];
        let green = imgData.data[i * 4 + 1];
        let blue = imgData.data[i * 4 + 2];

        if (red < 128 && green < 128 && blue < 128 && red >= 1) {
            console.log(red, green, blue, i);
            return true;
        }

    }
    return false;
}

function goal_hantei(hanni = 5) {
    var imgData = ctx.getImageData(dot_x - 2, dot_y - 2, hanni, hanni);

    for (i = 0; i < 25; i++) {
        let red = imgData.data[i * 4];
        let green = imgData.data[i * 4 + 1];
        let blue = imgData.data[i * 4 + 2];

        if (red > 192 && green < 128 && blue < 128 && red >= 1) {
            console.log(red, green, blue, i);
            return true;
        }

    }
    return false;
}


function update(timestamp) {
    // 前回フレームからの経過時間（ミリ秒）を計算

    
    const deltaTime = timestamp - lastTime;

    if (scene == SceneType.game) {

        if (keys["d"]) rad -= deltaTime / 1000 * 50 * Math.PI / 180;
        if (keys["a"]) rad += deltaTime / 1000 * 50 * Math.PI / 180;

        if (keys["w"]) v *= 2;

        if (keys["w"] || true) {
            x -= v * deltaTime / 1000 * Math.sin(rad);
            y -= v * deltaTime / 1000 * Math.cos(rad);
        }

        if (keys["w"]) v /= 2;
        

        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawMap();

        kekka = atari_hantei()
        if (kekka) scene = SceneType.gameover;
        kekka2 = goal_hantei();
        if (kekka2) scene = SceneType.goal;
        
        ctx.beginPath();
        ctx.arc(dot_x, dot_y, 5, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

    } else if (scene == SceneType.gameover) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMap();
        
        
        ctx.beginPath();
        ctx.arc(dot_x, dot_y, 5, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.save();
        
        ctx.fillStyle = '#b30095';
        ctx.font = '100px Roboto medium';
        ctx.fillText("GAME OVER", canvas.width / 2 - 300, canvas.height / 2 - 10);
        ctx.restore();

    } else if (scene == SceneType.goal) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMap();
        
        
        ctx.beginPath();
        ctx.arc(dot_x, dot_y, 5, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        ctx.save();
        ctx.fillStyle = '#0069b3';
        ctx.font = '100px Roboto medium';
        ctx.fillText("Clear", canvas.width / 2 - 150, canvas.height / 2 - 10);
        ctx.restore();

    }

    

    lastTime = timestamp;

    requestAnimationFrame(update);


}


requestAnimationFrame(update);
