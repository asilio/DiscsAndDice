import {vector_multiply, vector_add, matrix_multiply_vector, Axb, scalar_vector_multiply, vector_cross_product, vector_sub} from "./math.js" 
import {transform_to_screen} from "./coordinate_system.js"

class ENode{
	static ID_COUNTER = -1;
	static ID_POOL = [];

	constructor(name = "", isroot=false){
		if(ENode.ID_POOL.length>0){
			this.id = ENode.ID_POOL.unshift();
		}else{
			this.id = ++ENode.ID_COUNTER;
		}

		this.name=name;
		this.children = [];
		this.parent = undefined;
		this.isRoot = isroot;
	}

	addChild(child){
		this.children[child.id] = child;
		this.children[child.id].parent = this;
		this.children = Array.from(this.children); //remove "empties" in the array
	}

	removeChild(child){
		this.children[child.id].parent = undefined;
		this.children[child.id] = undefined;
	}

	firstChild(){
		let i = 0;
		while(this.children[i] == undefined && i<100000000){
			i++;
		}
		return this.children[i]
	}

	nthChild(n){
		let i = 0;
		let j = 0;
		while((this.children[i] == undefined && i<10000000) && j<n){
			i++;
			if(this.children[i]!=undefined){
				j++;
			}
		}
		return this.children[i];

	}

}

class Scene extends ENode{
	constructor(name, isroot=true){
		super(name, isroot);
	}

	render(){
		for(let i =0; i<this.layers.length;i++){
			this.children.render();
		}
	}

	addChild(child, layer){
		if(!(child instanceof Layer) && this.children.length==0){ throw new Error("Scene has no layers, cannot add child until layers are created");}
		if(child instanceof Layer){
			return super.addChild(child);
		}
		if(layer == undefined){
			return this.firstChild().addChild(child);
		}
		return this.children[layer].addChild(child);
	}

}

class Entity extends ENode{
	constructor(name="",isroot=false){
		super(name,isroot);
	}
}

class Component extends Entity{
	
}

class Path extends Component{}

class Layer extends Component{
	constructor(coordinate_transform){
		super("Layer");
		this.coordinate_transform = coordinate_transform;
	}

	render(){
		for(let i = 0;i<this.children.length;i++){
			if(this.children[i]==undefined)continue;
			this.children[i].render();
		}
	}

	sort_children(v){
		this.children.sort((a,b)=>a.sort(v)-b.sort(v));
	}
}

class Quad extends Entity{
	constructor(p1, p2, p3, p4, color="red"){
		super("Quad");
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
		this.p4 = p4;
		this.color=color;
	}

	render(context, T){
		let p1 = transform_to_screen(T, ...this.p1);
		let p2 = transform_to_screen(T, ...this.p2);
		let p3 = transform_to_screen(T, ...this.p3);
		let p4 = transform_to_screen(T, ...this.p4);
		let region = new Path2D();
		region.moveTo(p1[0],p1[1]);
		region.lineTo(p2[0],p2[1]);
		region.lineTo(p3[0],p3[1]);
		region.lineTo(p4[0],p4[1]);
		region.closePath();
		let temp = context.fillStyle;
		context.fillStyle=this.color;
		context.fill(region);
		context.stroke(region);
		context.fillStyle = temp;
	}

	sort(v){
		let points = [this.p1, this.p2, this.p3, this.p4];
		let v1 = vector_sub(this.p2, this.p1);
		let v2 = vector_sub(this.p4, this.p1);
		let v3 = vector_cross_product(v1, v2);
		//console.log(points, v1, v2, v3);
		//let values = points.map((a)=>vector_multiply(v,a));
		//let value = values.reduce((acc,cur)=>acc+cur);
		let value = vector_multiply(v, v3);
		return value;
	}
}

class Cube extends Entity{
	constructor(x1, y1, z1, l, w, h){
		super("Cube");
		this.quads = [];
		this.quads[0] = new Quad([x1, y1, z1], [x1+l, y1, z1], [x1+l, y1+w, z1], [x1, y1+w, z1]);//bottom
		this.quads[1] = new Quad([x1, y1, z1], [x1+l, y1, z1], [x1+l, y1, z1+h], [x1, y1, z1+h], "green");
		this.quads[2] = new Quad([x1+l, y1, z1], [x1+l, y1+w, z1], [x1+l, y1+w, z1+h], [x1+l, y1, z1+h], "blue");
		this.quads[3] = new Quad([x1+l, y1+w, z1], [x1+l, y1+w, z1+h], [x1, y1+w, z1+h], [x1, y1+w, z1], "gray");
		this.quads[4] = new Quad([x1, y1, z1], [x1, y1+w, z1], [x1, y1+w, z1+h], [x1, y1, z1+h], "pink");
		this.quads[5] = new Quad([x1, y1, z1+h], [x1+l, y1, z1+h], [x1+l, y1+w, z1+h], [x1, y1+w, z1+h], "yellow"); //Top

	}

	sort(v){
		console.log("Sorting Quads:");
		this.quads.sort((a, b)=>a.sort(v)-b.sort(v));
	}

	render(context, T){
		for(let i = 0; i<this.quads.length;i++){
			this.quads[i].render(context, T);

		}
	}
}



class Sprite extends Component{
	static Images = {};
	constructor(sprite_file){
		super("Sprite");
		//Hold only one copy of the image, if multiple entities draw the same image
		//TODO: May need to pre-load image files if there are a lot to load or some of the initial loading may be weird
		if(Sprite.Images[sprite_file] == undefined){
			Sprite.Images[sprite_file] = new Image();
			Sprite.Images[sprite_file].src = sprite_file;
		}
		this.sprite = Sprite.Images[sprite_file];
		this.sprite.src = sprite_file;
	}
}

class Position extends Component{
	constructor(x, y, z){
		super("Position");
		this.position = [x, y, z, 1];
	}

	move(dx, dy, dz=0){
		this.position = [this.position[0]+dx, this.position[1]+dy, this.position[z]+dz, 1];
	}

	set(x, y, z=0){
		this.position=[x, y, z, 1];
	}
}

class Archetype extends Entity{

}

class ImageArchetype extends Archetype{
	constructor(){
		super("Image");
		this.Relation = [];
	}

	create(file, x, y, z=0){
		let e = new Entity();
		let i = new Sprite(file);
		let p = new Position(x,y,z);
		this.Relation[e.id] = {Sprite:i, Position:p};
		this.Relation = Array.from(this.Relation);
	}
}

export {Entity, ImageArchetype, Scene, Layer, Cube}