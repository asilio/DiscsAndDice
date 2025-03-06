const sin = Math.sin;
const cos = Math.cos;
const PI = Math.PI;
const pow = Math.pow;
const sqrt = Math.sqrt;

class World{
	constructor(width, length,unit_length = 16,iso_angle = PI/6){
		this.width = width; //horizontal;
		this.length = length; //vertical;
		this.unit_length=16;
		this.rotation = 0;
		this.corners = [ 
			[0,0],
			[0,this.length],
			[this.width,this.length],
			[this.width,0]
			];
		this.rotatedCorners = [
			[0,0],
			[0,this.length],
			[this.width,this.length],
			[this.width,0]
			];
		this.iso_angle = iso_angle;
	}

	rotateWorldCounterClockwise(){
		this.rotation = (this.rotation+90)%360;
		//this.rotatedCorners = this.corners.map(this.pointFromWorldRotation);
		
	}
	rotateWorldClockwise(){
		this.rotation = (this.rotation-90)%360;
		//this.rotatedCorners = this.corners.map(this.pointFromWorldRotation);
	}

	pointFromWorldRotation(point){
		//returns the point as if the world were *not* rotated. Used for drawing to screen
		switch(this.rotation){
			case -270:
			case 90:
				return [
					point[1], this.height-point[0]
					];
			case -180:
			case 180:
				return [
					this.width-point[0],
					this.height-point[1]
					];
			case -90:
			case 270:
				return [
					this.width-point[0],
					point[1]
					];
			case 0:
			case 360:
			case -360:
			default:
				return point
		}
	}

	pointToScreen(point,screen_target){
		let tpoint=this.pointFromWorldRotation(point);
		return [
			screen_target[0] + (tpoint[0]-tpoint[1])*this.unit_length,
			screen_target[1] + (tpoint[0]+tpoint[1])*this.unit_length*sin(this.iso_angle)
			];
	}

	drawGridToScreenAt(context,screen_target){
		for(let x_world = 0; x_world<this.width;x_world++){
			for(let y_world = 0;y_world<this.length;y_world++){
				 context.fillStyle = `rgb(
					${Math.floor(255 - 255/this.width * x_world)}
					${Math.floor(255 - 255/this.length * y_world)}
					0)`;
				let x,y;
				[x,y]=this.pointToScreen([x_world,y_world],screen_target);
				context.beginPath();
				context.arc(x,y,2,0,2*PI);
				context.fill();
				context.closePath();
			}
		}
	}
}

function euclidean_metric(x,y){
	return sqrt(pow(x,2)+pow(y,2));
}


export {World};