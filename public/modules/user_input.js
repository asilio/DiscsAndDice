const canvas = document.getElementById('canvas');
let mousedown = false;
let mdx, mdy, mux, muy, cx, cy;

canvas.addEventListener('mousedown',(event)=>{
	mousedown = true;
	mdx = event.offsetX;
	mdy = event.offsetY;
});

canvas.addEventListener('mouseup', (event)=>{
	mousedown = false;
	mux = event.offsetX;
	muy = event.offsetY;
	mdx = undefined;
});

canvas.addEventListener('mousemove',(event)=>{
	cx = event.offsetX;
	cy = event.offsetY;
	
});

document.addEventListener('keydown', (event)=>{
	event.preventDefault();
	switch(event.key){
		case "ArrowUp": 
			l+=0.1;
			break;
		case "ArrowDown":
			l-=0.1;
			break;
		case "Enter":
			l= 2;
			break;

	}
});

function consume_mouse_up(){
	mux = undefined;
	muy = undefined;
}

export {mdx, mdy, mux, muy, cx, cy, consume_mouse_up};