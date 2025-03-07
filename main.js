import {World} from "./modules/isometric.js"

//create 30 x 40 world grid
const DiscWorld = new World(30,40,32);
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const HALF_WIDTH = WIDTH/2;
const HALF_HEIGHT = HEIGHT/2;

document.addEventListener('keyup', (event)=>{
	switch(event.code){
		case 'KeyA':
		case 'ArrowLeft':
			DiscWorld.rotateWorldCounterClockwise();
			break;
		case 'ArrowRight':
		case 'KeyD':
			DiscWorld.rotateWorldClockwise();
			break;
		default:
			break;
	}
});

function main(){
	context.clearRect(0,0,context.canvas.width,context.canvas.height);
	DiscWorld.drawGridToScreenAt(context,[HALF_WIDTH,5]);
	requestAnimationFrame(main);
}

main();