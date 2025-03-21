const sin = Math.sin;
const cos = Math.cos;
const PI = Math.PI;
const pow = Math.pow;
const sqrt = Math.sqrt;
const abs = Math.abs;

function round(x,p){
	return Math.round(x*pow(10,p))/pow(10,p);
}

function range(lo, hi, step){
	let result = [];
	for(let i = 0;i*step<hi;i++){
		result.push(round(lo+i*step,12));
	}
	return result;
}


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

function vector_cross_product(v1, v2){
	if(v1.length!=3) throw new Error(`Vector lengths are not 3 equal! ${v1.length} != ${v2.length}`);
	let result =[];
	result[0] = v1[1]*v2[2]-v1[2]*v2[1];
	result[1] = -(v1[0]*v2[2]-v1[2]*v2[0]);
	result[2] = v1[0]*v2[1]-v1[1]*v2[0];
	return result;
}

const dot_product = vector_multiply;

function vector_norm(vector){
	let result = 0;
	for(let i = 0;i<vector.length;i++){
		result += pow(vector[i],2);
	}
	return sqrt(result);
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

function matrix_add(matrix1,matrix2){
	if(matrix1.length!=matrix2.length) throw new Error(`Matrix rows do not match: ${matrix1.length}!=${matrix2.length}`);
	let result=[];
	for(let row = 0; row<matrix1.length;row++){
		result[row] = vector_add(matrix1[row], matrix2[row]);
	}
	return result;
}

function column_of_matrix(column, matrix){
	let result=[];
	for(let row = 0;row<matrix.length;row++){
		result[row]=matrix[row][column];
	}
	return result;
}

function lower_triangular_matrix(matrix,exclude_diagonal=true){
	let offset = 0;
	if(exclude_diagonal) offset = 1;
	let result = [];
	for(let row = 0;row<matrix.length;row++){
		result[row] = [];
		for(let col = 0; col<matrix[row].length;col++){
			result[row][col] = 0;
			if(row>=col+offset){
				result[row][col] = matrix[row][col];
			}
		}
	}
	return result;
}

function upper_triangular_matrix(matrix, exclude_diagonal = false){
	let offset = 0;
	if(exclude_diagonal){offset = 1};
	let result = [];
	for(let row = 0;row<matrix.length;row++){
		result[row]=[];
		for(let col=0;col<matrix.length;col++){
			result[row][col] = matrix[row][col]
			if(row>col+offset){
				result[row][col]=0;
			}
		}
	}
	return result;
}

function determinant_of_triangular_matrix(matrix){
	let result = 1;
	for(let i = 0; i<matrix.length;i++){
		result = result*matrix[i][i];
	}
	return result;
}
function replace_matrix_column(matrix, column, vector){
	if(matrix.length!=vector.length) throw new Error(`Column size does not match: ${matrix.length}!=${vector.length}`);
	let result = copy_matrix(matrix);
	for(let row = 0; row<result.length;row++){
		result[row][column] = vector[row];
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

function empty_matrix(rows,cols){
	let result = [];
	for(let row =0; row<rows;row++){
		result[row]=[];
		for(let col = 0;col<cols;col++){
			result[row][col]=0;
		}
	}
	return result;
}

function matrix_multiply_matrix(matrix1,matrix2){
	if(matrix1.length!=matrix2.length) throw new Error(`Matrix rows do not match: ${matrix1.length}!=${matrix2.length}`);
	let result = empty_matrix(matrix1.length, matrix2[0].length);
	for(let col = 0;col<matrix2[0].length;col++){
		let col_vect = column_of_matrix(col, matrix2);
		col_vect = matrix_multiply_vector(matrix1, col_vect);

		result = replace_matrix_column(result,col,col_vect);
		
	}
	return result;
}

function vector_max(vector){
	/*
	Return the value and index of the maximum
	If the maximum is not unique, returns the index of the
	first occurrence.
	*/
	let value = Math.max(...vector);
	let index = vector.indexOf(value);
	return [value, index];
}

function vector_abs(v){
	return v.map(p=>Math.abs(p));
}

function vector_sum(v){
	return v.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

function identity_matrix(n){
	let result = [];
	for(let i = 0;i<n;i++){
		result[i]=[];
		for(let j = 0;j<n;j++){
			result[i][j]=0;
			if(i==j){
				result[i][j] = 1;
			}
		}
	}
	return result;
}

function copy_matrix(A){
	let result = [];
	for(let row = 0;row<A.length;row++){
		result[row] = A[row].slice();
	}
	return result;
}

//Note that in this language the matrices are 0-indexed (as are the arrays)
function lu_factorization(A){
	/* 
	Based on the Matlab lutx function
	function [L, U, p] = lutx(A)
	LU Triangular factorization:
	Produces a unit lower triangular matrix L
	Produces an upper triangular matrix U
	Produces a permutation vector p so that
	L*U = A(p, :) 
	*/
	let n = A.length; //A must be a square matrix
	if(A.length!=A[0].length) throw new Error("Non-square matrix, cannot perform the LU factorization.");
	let B = copy_matrix(A); //Copy of A for permutation;
	let P = identity_matrix(n);
	let index, value, B_col;
	for(let col = 0; col<B.length;col++){
		B_col = column_of_matrix(col, B);

		[value, index] = vector_max(vector_abs(B_col).slice(col));
		let row = index+col;
		try{
		//Skip if the "max" is just 0 (aka, the whole column is 0)
		if(B[row][col] != 0){

			//Swap the pivot row:
			if(row != col){
				let temp = B[row].slice();
				B[row] = B[col];
				B[col] = temp;
				temp = P[row].slice();
				P[row] = P[col];
				P[col] = temp;
			}
			

			//Compute the multiplier
			let multiplier = 1/B[col][col];
			//Next step is to multiply each element in the column from row+1 onwards by the multiplier
			for(let i = col+1; i<n;i++){
				
				B[i][col] = B[i][col]*multiplier;

				for(let j = col+1; j<n; j++){
					B[i][j] = B[i][j]-B[i][col]*B[col][j];
				}
			}
		}
		}catch(err){console.log(err); console.log(B);throw new Error("WTF")}
	}
	let L = matrix_add(lower_triangular_matrix(B),identity_matrix(n));
	let U = upper_triangular_matrix(B);
	return [L, U, P];
}

function forward(L,b){
	//For lower triangular matrix L, solves the equation L*x = b
	//returns x

	let n = L.length;
	let x = b.slice();
	x[0] = x[0]/L[0][0];
	for(let row = 1; row<n;row++){
		let num = b[row];
		for(let col=0; col<row;col++){
			num = num - x[col]*L[row][col];
		}
		x[row] = num/L[row][row];
	}
	return x;
}

function backward(U,b){
	//For upper triangular matrix U, solves the equation U*x = b
	//returns x
	let n = U.length;
	let x = b.slice();
	x[n-1] = x[n-1]/U[n-1][n-1];
	for(let row = n-2; row>=0;row--){
		let num = b[row];
		for(let col = n-1; col>row;col--){
			num = num- x[col]*U[row][col];
		}
		x[row] = num/U[row][row];
	}
	return x;	
}

function Axb(A,b){
	//Solves A*x = b for square matrix A
	//Ignoring simpler cases, just using LU factorization at this time
	let L, U, P;
	[L,U,P]	= lu_factorization(A);
	let y = forward(L, matrix_multiply_vector(P,b))
	return backward(U,y);
}

function det(A){
	let L,U;
	[L,U] = lu_factorization(A);
	return determinant_of_triangular_matrix(U);
}

function transform(phi,theta,x,y, s=64){
	return [
		[s*cos(theta),    s*cos(phi)*sin(theta),           0, x],
		[s*sin(theta),   -s*cos(phi)*cos(theta),  s*sin(phi), y],
		[0,  0,                  s, 0],
		[0,  0,                  0, 1]
		]
}

function orthographic(l,x, y, s = 64){
	return [
		[s,        s,   0, x],
		[s/l,   -s/l,  -s, y],
		[0,      0,     1, 0],
		[0,      0,     0, 1]
		]
}

export {matrix_multiply_vector, Axb, transform, orthographic,
		 range, round, matrix_add, matrix_multiply_matrix, 
		 vector_multiply, vector_add, vector_cross_product, vector_sub,
		 scalar_vector_multiply};