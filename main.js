import {World} from "./modules/isometric.js"

//create 30 x 40 world grid
const DiscWorld = new World(30,40,32);
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const HALF_WIDTH = WIDTH/2;
const HALF_HEIGHT = HEIGHT/2;
const C = [HALF_WIDTH, HALF_HEIGHT/2];
document.addEventListener('keyup', (event)=>{
	switch(event.code){
		case 'ArrowUp':
		case 'KeyW':
			C[1]-=32;
			break;
		case 'ArrowDown':
		case 'KeyS':
			C[1]+=32;
		case 'KeyA':
		case 'ArrowLeft':
			C[0]-=32;
			break;
		case 'ArrowRight':
		case 'KeyD':
			C[0]+=32
			break;
		case 'KeyE':
			DiscWorld.rotateWorldCounterClockwise();
			break;
		case 'KeyQ':
			DiscWorld.rotateWorldClockwise();
		default:
			break;
	}
});

function main(){
	context.clearRect(0,0,context.canvas.width,context.canvas.height);
	DiscWorld.drawGridToScreenAt(context,C);
	requestAnimationFrame(main);
}

main();