const ECS = {};

class Entity{
	static ID_COUNTER = -1;
	static Entities = [];
	static ID_POOL = [];
	static RemoveEntity(id){
		Entity.Entities[id] = undefined;
		Entity.ID_POOL.push(id);
	}

	constructor(name=""){
		if(Entity.ID_POOL.length>0){
			this.id=Entity.ID_POOL.unshift();
		}
		else{
			this.id = ++Entity.ID_COUNTER;
		}
		this.name = name;
		Entity.Entities[this.id] = this;
	}	
}

class Component extends Entity{

}

class Vector3d extends Component{
	static Entities = [];
	constructor(x, y, z, eid){
		super("Vector3d");
		this.vector=[x,y,z];
		Vector3d.Entities.push([this.id, eid]);
	}

	get x(){
		return this.vector[0];
	}

	set x(val){
		this.vector[0]=x;
	}

	get y(){
		return this.vector[1];
	}

	set y(val){
		this.vector[1]=y;
	}

	get z(){
		return this.vector[2];
	}

	set z(val){
		this.vector[2] =val;
	}
}

let e = new Entity();
let c = new Component();
let d = new Vector3d(1, 2, 3, 0);

Entity.RemoveEntity(1);

Entity.Entities;