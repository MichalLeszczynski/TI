
let is_board_on = true;
function turn_board() {
    goToId('symulacja');
    let form = document.getElementById('board');
    if(is_board_on)
    {
        form.style.display = "none"
        is_board_on = false;
    }
    else
    {
        form.style.display = "block"
        is_board_on = true;
    }
}
turn_board();


let canvas = document.getElementById('cnv');
let ctx = canvas.getContext('2d');


function grid()
{
    let h = canvas.height;
    let w = canvas.width;
    let range = 100;
    let bl = 1;
    let rangex = w/range;
    let rangey = h/range;
	ctx.strokeStyle = "black";
	for(i=1;i<=Math.floor(rangex*2);i++)
	{
		ctx.lineWidth = 1/6;
		ctx.beginPath();
		ctx.moveTo((range/2)*i,0);
		ctx.lineTo((range/2)*i,h);
		ctx.closePath();
		ctx.stroke();
	}
	for(i=1;i<=Math.floor(rangey*2);i++)
	{
		ctx.lineWidth = 1/6;
		ctx.beginPath();
		ctx.moveTo(0,(range/2)*i);
		ctx.lineTo(w,(range/2)*i);
		ctx.closePath();
		ctx.stroke();
	}
}

let start_v_x = 10;
let start_v_y = 30;

let v_x = start_v_x;
let v_y =  start_v_y;

let start_x = 50;
let start_y = 50;

let x = start_x;
let y = start_y;

let force_x = 0;
let force_y = -1;

function reset() {
    x = Number(start_x);
    y = Number(canvas.height - start_y);

    v_x = Number(start_v_x);
    v_y = Number(start_v_y);
}

const set_form = document.forms['set_params'];
set_form.addEventListener('submit', function(e) {
    e.preventDefault();
    goToId('symulacja');
    force_x = set_form.querySelector('input[id="force_x"]').value;
    force_y = set_form.querySelector('input[id="force_y"]').value;

    start_v_x = set_form.querySelector('input[id="v_x"]').value;
    start_v_y = set_form.querySelector('input[id="v_y"]').value;

    start_x = set_form.querySelector('input[id="x"]').value;
    start_y = set_form.querySelector('input[id="y"]').value;
    reset();
 })


function draw() {
    
    

    let fixed = true;
    if( ! fixed)
    {
        let dimension = [document.documentElement.clientWidth, document.documentElement.clientHeight];
        canvas.width = dimension[0];
        canvas.height = dimension[1];
    }

    
    let ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);   
    grid();

    ctx.fillText("x: " + x.toFixed(0) + "\t y: " + y.toFixed(0), 50, 50)
    ctx.fillText("v_x: " + v_x.toFixed(0) + "\t v_y: " + v_y.toFixed(0), 50, 70)
    ctx.fillText("a_x: " + force_x + "\t a_y: " + force_y, 50, 90)
    

    // uaktualnienie polozenia
    let d = 0.05;
    x  = x + d * v_x ;
    y = y - d * v_y;

    ctx.fillStyle ="black";



    // uaktualnienie predkosci
    v_x += force_x * d;
    v_y += force_y * d;




    ctx.lineWidth = 3;
    
    // wektory predkosci
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + v_x, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - v_y);
    ctx.stroke();

    // reset na brzegach
    if(x > canvas.width || x < 0 || y > canvas.height || y < 0 )
    {
        reset();
    }

    setTimeout(draw, 10);
}
reset();
draw();

function set_ukosny() {
    goToId('symulacja');
    force_x = 0;
    force_y = -4;

    start_v_x = 30;
    start_v_y = 40;

    start_x = 50;
    start_y = 50;
    reset();
}

function set_poziomy() {
    goToId('symulacja');
    force_x = 0;
    force_y = -2;

    start_v_x = 40;
    start_v_y = 0;

    start_x = 50;
    start_y = canvas.height - 100;
    reset();
}
