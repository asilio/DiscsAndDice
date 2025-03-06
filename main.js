import {World} from "./modules/isometric.js"

//create 30 x 40 world grid
const DiscWorld = new World(30,40);
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const HALF_WIDTH = WIDTH/2;
const HALF_HEIGHT = HEIGHT/2;

function main(){
	DiscWorld.drawGridToScreenAt(context,[HALF_WIDTH,HALF_HEIGHT]);
	requestAnimationFrame(main);
}

main();