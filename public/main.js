import {Entity, ImageArchetype, Scene, Layer, Cube} from  "./modules/framework.js"
import {draw_transform_grid, orthographic, transform_to_screen, Axb} from "./modules/coordinate_system.js"
import {mdx, mdy, mux, muy, cx, cy, consume_mouse_up} from "./modules/user_input.js"
import {matrix_add, matrix_multiply_matrix} from "./modules/math.js"

const MS_PER_UPDATE = 20;
let previous = Date.now();
let lag = 0.0;

//updates in constant time, determined by MS_PER_UPDATE
function fixedUpdate(){
	theta=n*Math.PI/2;
	if(theta>2*Math.PI){theta = 0};
}

function processUserInput(){
	if(mux){
		n=(n+1)%4;
		v = V[n];
		cube.sort(v);
		console.log(v);
		consume_mouse_up();
	}
}

/*Testing stuff*/
let scene = new Scene("Root",true);
let obj = new Entity();
let background = new Layer();
let n =0;
scene.addChild(background);
scene.addChild(obj);
function scaled_matrix(s, l1=2, l2=1){
	return [
		[s/l2,  s/l2,   0, 0],
		[-s/l1,  s/l1,  0, 0],
		[0,      0,     1, 0],
		[0,      0,     0, 1]];
}

function rotation_matrix(theta){
	return [
		[Math.cos(theta), Math.sin(theta), 0, 0],
		[-Math.sin(theta), Math.cos(theta), 0, 0],
		[0, 0, 1, 0],
		[0, 0, 0, 1]
		]
}

function translation_matrix(x,y){
	return [
	[0, 0, 0, x],
	[0, 0, 0, y],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
	];
}

function translation_rotation_matrix(x, y, theta){
		return [
		[Math.cos(theta), Math.sin(theta), 0, x],
		[-Math.sin(theta), Math.cos(theta), 0, y],
		[0, 0, 1, 0],
		[0, 0, 0, 1]
		]
}
let T1 = scaled_matrix(32, 1, 2);
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const buffer = document.createElement('canvas');
buffer.width = canvas.width;
buffer.height = canvas.height;
const buffer_context = buffer.getContext('2d');

let theta = n*Math.PI/2;
let cube = new Cube(1,1,0,1,1,1);

let V = [
	[1, -1,  1],
	[1, 1,   1],
	[-1, 1,  1],
	[-1, -1, 1]
	];
let v = V[n]
cube.sort(v);
/*
theta = n*Math.PI/2, n = 0, 1, 2, 3
theta rotates the coordinate system, based on my standard transform:
	[  s,   s ]
	[-s/2, s/2]
We can determine the far distance objects based on the orientation of the vector pointing away (aka up on the screen)
 	n = 0 -->v=[-1,  1, 1]
 	n = 1 -->v=[ 1,  1, 1]
 	n = 2 -->v=[-1,  1, 1]
 	n = 3 -->v=[-1, -1, 1]
Ordering the render:
	 Sort by v[0]*x + v[1]*y + v[2]*z (aka, the dot product) which will give a signed numerical value we can sort by
	 --The v[2] = 1 effectively prioritizes rendering lower z values (always).

*/
function prerender(){
	buffer_context.clearRect(0,0,buffer.width,buffer.height);
	
	
	//buffer_context.drawImage(sprite,x, y);

	//Debug:
	T1 = scaled_matrix(32, Math.abs(Math.cos(theta))+1,-Math.abs(Math.cos(theta))+2);
	let T4 = matrix_multiply_matrix(translation_rotation_matrix(600,600,theta), T1);
	T4[1][2]=-32;
	//let T3 = translation_matrix(600,600);
	//let T4 = matrix_add(T2, T3);

	draw_transform_grid(buffer_context, T4, -20, 20, -20, 20);
	cube.render(buffer_context, T4);
	let p = Axb(T4, [cx, cy, 0, 1]);
	let o = transform_to_screen(T4, 0, 0);
	buffer_context.fillText(`Screen Coords: (${cx}, ${cy})`, cx+10, cy+10);
	buffer_context.fillText(`World Coords: (${p[0]}, ${p[1]})`, cx+10, cy-10);
	buffer_context.fillText(`(0, 0)`, o[0], o[1]);
	o = transform_to_screen(T4, 1, 1);
	buffer_context.fillText(`(1, 1)`, o[0], o[1]);
	o = transform_to_screen(T4, 1, 2);
	buffer_context.fillText(`(1, 2)`, o[0], o[1]);
	o = transform_to_screen(T4, 2, 1);
	buffer_context.fillText(`(2, 1)`, o[0], o[1]);

	o = transform_to_screen(T4, 10, 10);
	buffer_context.fillText(`(10, 10)`, o[0], o[1]);

	o = transform_to_screen(T4, -10, -10);
	buffer_context.fillText(`(-10, -10)`, o[0], o[1]);
	o = transform_to_screen(T4, 10, -10);
	buffer_context.fillText(`(10, -10)`, o[0], o[1]);

	o = transform_to_screen(T4, -10, 10);
	buffer_context.fillText(`(-10, 10)`, o[0], o[1]);


	o = transform_to_screen(T4, 0, 10);
	buffer_context.fillText(`(0, 10)`, o[0], o[1]);
	o = transform_to_screen(T4, 10, 0);
	buffer_context.fillText(`(10, 0)`, o[0], o[1]);
	o = transform_to_screen(T4, 0, -10);
	buffer_context.fillText(`(0, -10)`, o[0], o[1]);
	o = transform_to_screen(T4, -10, 0);
	buffer_context.fillText(`(-10, 0)`, o[0], o[1]);
}

function render(){
	context.clearRect(0,0,context.canvas.width,context.canvas.height);
	context.drawImage(buffer,0,0);
}

function main(){
	let current = Date.now();
	let elapsed = current-previous;
	previous = current;
	lag += elapsed;

	processUserInput();

	while(lag >= MS_PER_UPDATE){
		fixedUpdate();
		lag -= MS_PER_UPDATE;
	}

	prerender();

	render();

	requestAnimationFrame(main);
}
main();