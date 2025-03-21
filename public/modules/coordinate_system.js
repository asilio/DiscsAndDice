import {Axb, transform, orthographic, matrix_multiply_vector, round, range} from "./math.js"
const sin = Math.sin;
const cos = Math.cos;
const PI = Math.PI;
const pow = Math.pow;
const sqrt = Math.sqrt;
const abs = Math.abs;

function transform_to_screen(T,x,y,z=0){
	return matrix_multiply_vector(T,[x,y,z,1]);
}

function screen_to_transform(T,x,y){
	return Axb(T,[x,y,0,1]);
}

function lineTo(context,p1, p2){
	context.beginPath();
	context.moveTo(p1[0],p1[1]);
	context.lineTo(p2[0],p2[1]);
	context.stroke();
	context.closePath();
}

function drawQuad(context, p1, p2, p3, p4){
	let region = new Path2D();
	region.moveTo(p1[0],p1[1]);
	region.lineTo(p2[0],p2[1]);
	region.lineTo(p3[0],p3[1]);
	region.lineTo(p4[0],p4[1]);
	region.closePath();
	context.fill(region);
	context.stroke(region);
}

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let wx, wy, cx, cy;

function draw_transform_grid(context, T,xmin=-10, xmax=10, ymin=-10, ymax=10){
	for(let y = ymin;y<=ymax; y++){
		lineTo(context, transform_to_screen(T,xmin,y,0), transform_to_screen(T,xmax,y,0));
	}
	for(let x = xmin; x<=xmax; x++){
		lineTo(context, transform_to_screen(T,x,ymin,0), transform_to_screen(T,x,ymax,0));
	}
	let temp = context.strokeStyle;
	context.strokeStyle = 'black';
	lineTo(context, transform_to_screen(T, 0, 0, -10), transform_to_screen(T,0, 0, 10));
	lineTo(context, transform_to_screen(T, -10, 0, 0), transform_to_screen(T,10, 0, 0));
	lineTo(context, transform_to_screen(T, 0, -10, 0), transform_to_screen(T,0, 10, 0));
	context.strokeStyle=temp;
}



let time_now = Date.now();
let time_last = time_now;
let theta= 0;
let phi =PI/4;
let l = 5;

function f(t){
	return [5*cos(t)+5, 5*sin(t)+5,5*cos(t)*sin(t)];
}

let t_domain = range(0,2*PI,PI/360);

let path = t_domain.map((p)=>f(p));
let n = 0;

function draw_world_path(context, T, path){
	let point = transform_to_screen(T, path[0][0], path[0][1], path[0][2]);
	context.beginPath();
	context.moveTo(...point);
	for(let i = 1;i<path.length;i++){
		point =transform_to_screen(T, path[i][0], path[i][1], path[i][2])
		context.lineTo(...point);
	}
	context.stroke();
	context.closePath();
}

function main(){

	let T1 = transform(0, 0, 300, 320, 16);
	let T2 = orthographic(l, 800, 500, 16);
	time_now = Date.now();
	if(time_now -time_last > 10){
		time_last = Date.now();
		n=(n+1)%path.length;
	}	
	context.clearRect(0,0,context.canvas.width,context.canvas.height);
	context.strokeStyle='black';
	draw_transform_grid(context,T1);
	draw_world_path(context, T1, path);

	context.strokeStyle ='rgb(155 0 0)';
	draw_transform_grid(context,T2, -8, 8);
	draw_world_path(context, T2, path);
	
	[wx, wy] = screen_to_transform(T1,cx,cy);
	context.fillStyle='black';
	context.fillText(`(${round(wx,2)},${round(wy,2)})`,cx+10, cy+10);
	
	[wx, wy] = screen_to_transform(T2,cx,cy);
	context.fillStyle='red';
	context.fillText(`(${round(wx,2)},${round(wy,2)})`,cx+10, cy-20);

	context.fillStyle = 'black';
	let p = transform_to_screen(T1,...path[n]);
	context.beginPath();
	context.moveTo(p[0],p[1]);
	context.arc(p[0],p[1],5, 0, 2*PI);
	context.fill();



	let p1, p2, p3, p4;
	let x = 3;
	let y = 4;
	let z = 0;
	context.strokeStyle="black";
	context.fillStyle = 'red';
	p1 = transform_to_screen(T2,x, y, z);
	p2 = transform_to_screen(T2,x, y+1, z);
	p3 = transform_to_screen(T2,x-1, y+1, z);
	p4 = transform_to_screen(T2,x-1, y, z);
	drawQuad(context,p1, p2, p3, p4);
	p1 = transform_to_screen(T1,x, y, z);
	p2 = transform_to_screen(T1,x, y+1, z);
	p3 = transform_to_screen(T1,x-1, y+1, z);
	p4 = transform_to_screen(T1,x-1, y, z);
	drawQuad(context,p1, p2, p3, p4);
	
	context.fillStyle = 'red';
	p = transform_to_screen(T2,...path[n]);
	let p0 = transform_to_screen(T2,path[n][0],path[n][1],0);
	context.beginPath();
	context.moveTo(p[0],p[1]);
	context.arc(p[0],p[1],5, 0, 2*PI);
	context.fill();
	lineTo(context, p, p0);

	context.fillStyle="blue";
	p1 = transform_to_screen(T2,x, y, z);
	p2 = transform_to_screen(T2,x, y+1,z);
	p3 = transform_to_screen(T2,x, y+1, z-1);
	p4 = transform_to_screen(T2,x, y, z-1);
	//drawQuad(context,p1, p2, p3, p4);
	context.fillStyle="green";
	p1 = transform_to_screen(T2,x,  y, z);
	p2 = transform_to_screen(T2,x-1, y, z);
	p3 = transform_to_screen(T2,x-1, y, z-1);
	p4 = transform_to_screen(T2,x, y, z-1);
	//drawQuad(context,p1, p2, p3, p4);

	requestAnimationFrame(main);
}
//main();

export{draw_transform_grid,orthographic, transform_to_screen, Axb, screen_to_transform}
