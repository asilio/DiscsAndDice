const sin = Math.sin;
const cos = Math.cos;
const PI = Math.PI;
const pow = Math.pow;
const sqrt = Math.sqrt;
const abs = Math.abs;
/*
2dMatrix:
|a b| 
|c d|
JS: Array of rows:
Matrix = 
[
 [a, b],
 [c, d]
]
*/
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

/*
Transformation Matrices for various isometric setups
0 degree (top point is (0,0)):
T0 maps world coordinates to unscaled or translated pixel coordinates.
T0_inv maps pixel coordinates that *have* been translated back to unscaled world coordinates.
*/
const T0=[
		[1  , -1 , 0], 
		[1/2, 1/2, -1/2]
	];
const T0_inv = [
		[1/2 , 1 ],
		[-1/2, 1 ]
	];

const T90 = [
		[1    , 1 , 0    ],
		[-1/2 ,1/2, -1/2 ]
	];
const T90_inv = [
		[1/2, -1],
		[1/2,  1]
	];
const T180 = [
		[-1  ,   1 , 0   ],
		[-1/2, -1/2, -1/2]
	];
const T180_inv = [
		[-1/2, -1],
		[1/2 , -1]
	];
const T270 = [
		[-1 , -1  , 0   ],
		[1/2, -1/2, -1/2]
	];
const T270_inv = [
		[-1/2,  1],
		[-1/2, -1]
	];

class World{
	constructor(width, length,unit_length = 16){
		this.width = width; //horizontal;
		this.length = length; //vertical;
		this.center = [this.width/2, this.length/2];
		this.unit_length=unit_length;
		this.rotation = 0;
		this.corners = [ 
			[0,0],
			[0,this.length],
			[this.width,this.length],
			[this.width,0]
			];
		//Transformation to rotate and scale; will draw in upper left corner without a screen target location
		//T maps world => screen pixel (untranslated)
		let A = this.unit_length/2;
		let B = 2/this.unit_length;
		this.T = [
			scalar_matrix_multiply(A,T0), 
			scalar_matrix_multiply(A,T90), 
			scalar_matrix_multiply(A,T180), 
			scalar_matrix_multiply(A,T270)];
		//T_inv maps a *translated* pixel coordinate to world coordinate.
		this.T_inv = [
			scalar_matrix_multiply(B,T0_inv), 
			scalar_matrix_multiply(B,T90_inv), 
			scalar_matrix_multiply(B,T180_inv),
			scalar_matrix_multiply(B,T270_inv)];

		this.grid = grid(this.width, this.length);
		this.render_order = [];
		this.render_order[0] = this.grid.toSorted(rotation0sort);
		this.render_order[1] = this.grid.toSorted(rotation1sort);
		this.render_order[2] = this.grid.toSorted(rotation2sort);
		this.render_order[3] = this.grid.toSorted(rotation3sort);


		//For debugging only
		this.sprites =[];
		this.sprites[0] = new Image();
		this.sprites[0].src = "./assets/isocube.png";

		this.sprites[1] = new Image();
		this.sprites[1].src = "./assets/isocube1.png";

		this.sprites[2] = new Image();
		this.sprites[2].src = "./assets/isocube2.png";

		this.sprites[3] = new Image();
		this.sprites[3].src = "./assets/isocube3.png";

	}

	rotateWorldCounterClockwise(){
		this.rotation = (this.rotation+1)%4;
	}

	rotateWorldClockwise(){
		this.rotation = (this.rotation-1)%4;
		if(this.rotation<0) this.rotation = 3;
	}

	PixelToWorldCoordinate(point, C){
		return matrix_multiply_vector(this.T_inv[this.rotation], vector_sub(point,C));
	}

	WorldToPixelCoordinate(point, C){
		let D = vector_sub(point,this.center);
		return vector_add(matrix_multiply_vector(this.T[this.rotation], D),C);
	}

	drawGridToScreenAt(context,screen_target){
		let x_world, y_world, z_world;
		let x, y;
		let render_order = this.render_order[this.rotation];
		for(let i = 0; i<render_order.length;i++){
			[x_world, y_world, z_world] = render_order[i];
	
			// context.fillStyle = `rgb(
			//	${Math.floor(255 - 200/this.width * x_world)}
			//	${Math.floor(255 - 200/this.length * y_world)}
			//	${Math.floor(0 + 100 * z_world)})`;

			[x,y]=this.WorldToPixelCoordinate([x_world,y_world,z_world],screen_target);
			//
			context.drawImage(this.sprites[this.rotation], x-this.width/2, y);
			//
			context.beginPath();
			context.arc(x,y,2,0,2*PI);
			context.fill();
			context.closePath();
		}
	}
}

function euclidean_metric(x,y){
	return sqrt(pow(x,2)+pow(y,2));
}

function grid(width,length, unit = 1){
	let result = [];
	for(let x=0;x<=width;){
		for(let y = 0;y<=length;){
			//Just for debuggin/visualizing
			let z = Math.floor(Math.random()*10)%3;
			//
			result.push([x,y,z]);
			y+=unit;
		}
		x+=unit;
	}
	return result;
}

function rotation0sort(grid_point1, grid_point2){
	let test = grid_point1[0]-grid_point2[0];
	if(test<0) return test;
	if(test>0) return test;
	return grid_point1[1] - grid_point2[1];
}

function rotation1sort(grid_point1, grid_point2){
	let test = grid_point1[1]-grid_point2[1];
	if(test<0) return test;
	if(test>0) return test;
	return grid_point2[0] - grid_point1[0];
}

function rotation2sort(grid_point1, grid_point2){
	let test = grid_point2[0]-grid_point1[0];
	if(test<0) return test;
	if(test>0) return test;
	return grid_point2[1] - grid_point1[1];
}

function rotation3sort(grid_point1, grid_point2){
	let test = grid_point2[1]-grid_point1[1];
	if(test<0) return test;
	if(test>0) return test;
	return grid_point1[0] - grid_point2[0];
}

export {World};