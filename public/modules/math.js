const sin = Math.sin;
const cos = Math.cos;
const PI = Math.PI;
const pow = Math.pow;
const sqrt = Math.sqrt;
const abs = Math.abs;

function scalar_vector_multiply(value, vector){
	let result = [];
	for(let i = 0;i<vector.length;i++){
		result.push(vector[i]*value);
	}
	return result;
}

function scalar_matrix_multiply(value, matrix){
	let result = [];
	for(let row = 0; row<matrix.length;row++){
		result.push(scalar_vector_multiply(value, matrix[row]));
	}
	return result;
}

function vector_multiply(row_vector, col_vector){
	if(row_vector.length!=col_vector.length) throw new Error(`Vector lengths are not equal! ${row_vector.length} != ${col_vector.length}`);
	let result = 0;
	for(let i = 0; i<row_vector.length;i++){
		result += row_vector[i]*col_vector[i];
	}
	return result;
}

function vector_add(vector1, vector2){
	if(vector1.length!=vector2.length) throw new Error(`Vector lengths are not equal! ${vector1.length} != ${vector2.length}`);
	let result = [];
	for(let i = 0; i<vector1.length;i++){
		result.push(vector1[i]+vector2[i]);
	}
	return result;
}

function vector_sub(vector1, vector2){
	if(vector1.length!=vector2.length) throw new Error(`Vector lengths are not equal! ${vector1.length} != ${vector2.length}`);
	let result = [];
	for(let i = 0; i<vector1.length;i++){
		result.push(vector1[i]-vector2[i]);
	}
	return result;
}

function column_of_matrix(column, matrix){
	let result=[];
	for(let row = 0;row<matrix.length;row++){
		result.push(matrix[row][column]);
	}
	return result;
}

function matrix_multiply_vector(matrix,vector){
	if(matrix[0].length!=vector.length) throw new Error(`Matrix dimension mismatch with vector , matrix row length = ${matrix[0].length} != ${vector.length}`);
	let result = [];
	for(let row = 0;row<matrix.length;row++){
		result.push(vector_multiply(matrix[row], vector));
	}	
	return result;
}

let T = [
	[-10,10 , 0, 250],
	[5, 5, -5, 250],
	[0, 0, 1, 0],
	[0, 0, 0, 1]
	];

function L(x, y, s = 1){
	return [
	[-1*s,s , 0, x],
	[s/1.5, s/1.5, -s/2, y],
	[0, 0, 1, 0],
	[0, 0, 0, 1]
	];
}

let L1 = L(300,50,30);


function world_to_screen(x,y,z=0){
	return matrix_multiply_vector(L1, [x, y, z, 1]);
}

function lineTo(context,p1, p2){
	context.beginPath();
	context.moveTo(p1[0],p1[1]);
	context.lineTo(p2[0],p2[1]);
	context.stroke();
	context.closePath();
}

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

for(let y = 0;y<=10; y++){
	lineTo(context, world_to_screen(0,y,0), world_to_screen(10,y,0));
}
for(let x = 0; x<=10; x++){
	lineTo(context, world_to_screen(x,0,0), world_to_screen(x,10,0));
}

context.fillStyle = 'rgb(255,0,0)';
let p = world_to_screen(5, 9, 0);
console.log(p);
context.beginPath();
context.moveTo(p[0],p[1]);
context.arc(p[0],p[1],5, 0, 2*PI);
context.fill();
export {matrix_multiply_vector};