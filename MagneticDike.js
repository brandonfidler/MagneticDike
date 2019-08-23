// Define width and height of Applet Draw Area
// This includes portions that will be used to plot gravity
// data graphic and cross-section with tunnel
const C_WIDTH = 500;
const C_HEIGHT = 500;
const X_OFFSET = 100;

//Define some  constants for the gravity data plot
// Width of plotting Area
const AP_WIDTH = 500;
const P_WIDTH = AP_WIDTH;
// Height of plotting Area
const P_HEIGHT = 300;
const AP_HEIGHT = 500;
// Width of Graph within plotting Area
const G_WIDTH = P_WIDTH - 125;
// Height of Graph within plotting Area
const G_HEIGHT = P_HEIGHT - 100;

//Define width and height of Applet Draw Area
//This includes portions that will be used to plot magnetic
//data graphic and cross-section with tunnel
let apwidth = 500;
let apheight = 500;

//Define some static constants for the magnetic data plot
let pwidth = apwidth; //Width of plotting Area
let pheight = 300; //Height of plotting Area
let gwidth = pwidth - 125; //Width of Graph within plotting Area
let gheight = pheight - 100; //Height of Graph within plotting Area

//Now define the absolute coordinates of each of the four corners of
//the plotting area
let ulcorx = Math.trunc((pwidth - gwidth) / 2.0);
let ulcory = Math.trunc((pheight - gheight) / 2.0);
let urcory = ulcory;
let urcorx = ulcorx + gwidth;
let llcorx = ulcorx;
let llcory = ulcory + gheight;
let lrcorx = urcorx;
let lrcory = llcory;


// Define width and height of cross-section plotting area
let x_width = apwidth- 125;
let x_height = apheight - P_HEIGHT - 50;


// Now define the absolute coordinates of each of the four corners of
// the plotting area
let xulcorx = Math.trunc(((AP_WIDTH - x_width) / 2.0));
let xulcory = Math.trunc((llcory + 25));
let xurcory = xulcory;
let xurcorx = (xulcorx + x_width);
let xllcorx = xulcorx;
let xllcory = xulcory + x_height;
let xlrcorx = xurcorx;
let xlrcory = xllcory;
let dikeOffset = 30;



//Now define variables that we will need compute plot scale
let xmin = -250.0; //Minimum Station location
let xmax = 250.0;
let ymin = 1000.0; //Minimum field strength value - This is computed
let ymax = -1000.0;
let dmax = 25.0; //Maximum plotting depth
let dmin = -25.0;
let xscale;
let yscale;
let dscale;


//Define Variables used to some initial values

let yf=0.0;

let rad = 1.0;
let depth = 5.0;

//Define Variables used to Describe Model Parameters - In this case,
//magnetic anomaly is going to be computed over a vertical dike with
//an arbitrary trend along an east-west trending survey line.
let dx = 1.0; //Magnetic station spacing (m)
let k = 0.0001; //Susceptibility contrast
let width = 25.0; //Width of dike (m)
let depth2top = -5.0; //Depth to top of dike
let depth2bot = 500.0; //Depth to bottom of dike
let std = 2.0; //Standard Deviation of individual readings (nT)
let ndata = 2; //Number of Readings to take at each station
let fe = 55000.0; //Field strength of inducing field (nT)
let dkt = -45.0; //Dike trend in degrees
let inc = 52.0; //Inclination of inducing field in degrees
let len = 500.0; // Length of profile in meters
let DIKE_OFFSET = 30;
// Define Variables used to Describe Model Parameters.
// Density contrast gm/cm^3
let rho = k;
// In line location of cylinder along line (m)
let xloc = 0.0;
// Radius of cylinder (m)
let radius = 15;
// Horizontal location of cylinder across line (m)
let yloc = 0.0;
// Number of readings to average
let nobs = 1;





//Define a few miscellaneous variables - iset and gset are used by

//the Gaussian random number generator.
let myRandom; //Instance of a random number generator
let LastY;
let LastX; //Variables used to smooth image generation
//while dike is being moved with mouse

//Establish Frame from which model parameters can
//be manipulated
// MagFrame ControlFrame;

//Number of prints made
let pnum = 0;

//Define object to hold image of tree
let tree;


let force = 0;
let key_pressed = false;

const canvas = document.querySelector('.gtCanvas');
const width_canvas = document.querySelector('.gtRadSample');
const ctx = canvas.getContext('2d');
const r_ctx = width_canvas.getContext('2d');




function paint()
{
    // Plot Cross section
    plotXSection();
    // Plot Gravity Data
    plotData();
    // Draw Parameter Labels on lower left side of plot
    labels();
    // Draw Axes
    drawAxes();
}


function drawAxes()
{
    let run = false;
    let xint;
    ctx.font = "12px Arial";

    ctx.beginPath();
    ctx.strokeStyle = "#000000";

    //do x axis first
    drawLine(ulcorx, ulcory, urcorx, urcory);
    for (xint = xmin; xint <= xmax; xint += (xmax - xmin) / 5.0)
    {
        drawLine(getDX(xint), ulcory, getDX(xint), ulcory - 5);
        ctx.fillText((xint), getDX(xint) - 7, ulcory - 8);
    }
    ctx.fillText("Distance (m)", apwidth / 2 - 30 , 25);


    drawLine(10 + urcorx, urcory, 10 + lrcorx, lrcory);
    for (xint = ymin; xint <= ymax; xint += Math.abs(ymax - ymin) / 5.0)
    {
        drawLine(10 + urcorx, getDY(xint), 5 + urcorx, getDY(xint));
        ctx.fillText(xint.toFixed(1), 18 + urcorx, getDY(xint)+5);
    }
    ctx.fillText("Field Strength (nT)", lrcorx - 40, lrcory + 20);

    drawLine(20 + urcorx, pheight, 20 + urcorx, apheight);
    for (xint = 0; xint < dmax; xint +=dmax / 5.0)
    {
        run = true;
        drawLine(20+urcorx, Math.trunc(pheight+xint*dscale),
            15 +urcorx, Math.trunc(pheight + xint * dscale));//dscale is in setScale()
        ctx.fillText(xint.toFixed(1), 28+urcorx, Math.trunc(pheight+xint*dscale) +5);
    }

    ctx.fillText("Depth (m)", urcorx - 45, apheight - 10);
    ctx.closePath();
    ctx.stroke()
    // alert("drawAxes")
}



function plotXSection()
{
    // alert("plotXsection")
    // Draw grass rectangle.
    ctx.beginPath();
    ctx.fillStyle = "#55ee33";
    ctx.rect( (ulcorx - 20), P_HEIGHT, (G_WIDTH + 40), (apheight - 50));
    ctx.closePath();
    ctx.fill();

    let px, py, px1, py1;

    ctx.fillStyle = "#000000";
    ctx.fillText("West", ulcorx-15, pheight +20);
    ctx.fillText("East", pwidth-75, pheight+20);


    // Draw Xsection of cylinder
    let x1 = xloc - width;
    let x2 = xloc + width;
    if(x1 < xmin)
        x1 = xmin;
    if(x2 > xmax)
        x2 = xmax;
    px = getDX(x1);
    py = getXY(depth2top-4);
    px1 = getDX(x2)-px;
    py1 = getXY(dmin) - py +DIKE_OFFSET;

    ctx.beginPath();
    ctx.fillStyle = "#777777";
    ctx.rect(px, py, px1, py1);
    ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    ctx.rect(px, py, px1, py1);
    ctx.stroke();
    ctx.fillStyle = "#000000";
}

function labels()
{
    ctx.fillStyle = "#000000";
    r_ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";
    r_ctx.fillText("Depth: ", 5, 12);
    r_ctx.fillText("Width: ", 5, 24);
    r_ctx.fillText("Move to Surface ", 83, 24);
    r_ctx.fillText("Move to Deeper Depth", 73, 222);
    r_ctx.fillText("Decrease Radius", 2, 87);
    r_ctx.fillText("Increase Radius", 159, 87);
}

function drawParticle(x, y)
{
    // alert("drawParticle")
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0,2*Math.PI);
    ctx.strokeStyle = "#0000bb";
    ctx.stroke();
    ctx.closePath();
}

function plotData()
{
    // alert("plotDate")
    let x;
    let temp;
    for (x = xmin; x <= xmax; x += dx) {
        temp = getFieldStrength(x);
        drawParticle(getDX(x), getDY(temp));
    }

}

function drawLine(x1, y1, x2, y2)
{
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

    function getDX(x) {
        return Math.trunc((( (x - xmin) * xscale + llcorx)));
    }

    function getDY(y) {
    return Math.trunc((( (ymax - y) * yscale + ulcory)));
    }

    function  getXY(y) {
    return Math.trunc(((-1*y)*dscale+xulcory));
    }

    function getTY() {
    return Math.trunc(depth * dscale + P_HEIGHT)
    }

function setScales()
{

    let x, temp;
    ymax = -1000.0;
    ymin = 1000.0;

    for (x = xmin; x <=xmax; x += dx)
    {
        temp = getFieldStrength(x);
        if (temp < ymin) {
            ymin = temp * 1.1;
        }
        if (temp > ymax) {
            ymax = temp * 1.1;
        }
    }

    xscale = gwidth / (xmax-xmin);
    yscale = gheight / (ymax - ymin);
    dscale = (apheight - pheight) / dmax;
}
function gaussianRand(increase)
{
    let x1, x2, width, y1;
    do {
        x1 = 2 * Math.random() - 1;
        x2 = 2 * Math.random() - 1;
        width = x1 * x1 + x2 * x2;
    } while(width >= 1 || width === 0);
    let c = Math.sqrt(-2 * Math.log(width) / width);
    return (x1 * c) * increase;
}

function getFieldStrength(x)
{
//First Convert angles in degrees to radians and compute angle
    //between profile line and trend of dike
    let incr = inc * Math.PI / 180.0;
    let bn = -1.0 * dkt;
    let ang = (360.0 - bn) * Math.PI / 180.0; //Angle between profile and dike
    let br = bn * Math.PI / 180.0;

    //Compute constants needed for calculation. Constants are as
    //defined in Telford
    //double xs = (width / 2.0 - x);
    //double xs = x + width / 2.0;
    //double xsp = xs * Math.cos(ang);
    let xs = x * Math.cos(ang);
    let xsp = xs + width / 2.0;
    let r1 = Math.sqrt(depth2top * depth2top + xsp * xsp);
    let r2 = Math.sqrt(depth2bot * depth2bot + xsp * xsp);
    let r3 = Math.sqrt(depth2top * depth2top +
    (xsp - width) * (xsp - width));
    let r4 = Math.sqrt(depth2bot * depth2bot +
    (xsp - width) * (xsp - width));
    let phi1 = Math.atan2(depth2top, xsp);
    let phi2 = Math.atan2(depth2bot, xsp);
    let phi3 = Math.atan2(depth2top, (xsp - width));
    let phi4 = Math.atan2(depth2bot, (xsp - width));

    //Compute field strength at x
    let save = 2.0 * k * fe * (Math.sin(2.0 * incr) * Math.sin(br) *
    Math.log(r2 * r3 / (r4 * r1)) +
    (Math.cos(incr) * Math.cos(incr) * Math.sin(br) *
        Math.sin(br) - Math.sin(incr) * Math.sin(incr)) *
    (phi1 - phi2 - phi3 + phi4))+
        gaussianRand(150) * std / Math.sqrt(ndata);

    return save;
}

// Controls for the shaft object
window.addEventListener('keydown', function (e) {
    e.preventDefault();
    if(e.key === "ArrowDown" && (-depth2top)<25)
    {
        key_pressed = true;
        depth2top -= 0.1;
        force += 1;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        r_ctx.clearRect(0,0, width_canvas.width, width_canvas.height);
        paint();
        displaySliderValues();
    }
    else if(e.key === "ArrowUp" && (-depth2top)>0.2)
    {
        key_pressed = true;
        depth2top += 0.1;
        force += 1;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        r_ctx.clearRect(0,0, width_canvas.width, width_canvas.height);
        paint();
        displaySliderValues();
    }
    else if(e.key === "ArrowRight" && (width<150))
    {
        key_pressed = true;
        if(force >= 30 && force < 90)
            width += 0.2;
        else if(force >= 90)
            width += 1;
        else
            width += 0.1;

        force += 1;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        r_ctx.clearRect(0,0, width_canvas.width, width_canvas.height);
        paint();
        displaySliderValues();
    }
    else if(e.key === "ArrowLeft" && (width > 2.1))
    {
        key_pressed = true;
        if(force >= 30 && force < 90)
            width -= 0.2;
        else if(force >= 90)
            width -= 1;
        else
            width -= 0.1;
        force += 1;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        r_ctx.clearRect(0,0, width_canvas.width, width_canvas.height);
        paint();
        displaySliderValues();
    }
});

// Check if a key was released
window.addEventListener('keyup', function (e) {
    if (e.defaultPrevented){
        return;
    }
    key_pressed = false;
    force = 0;
});

// window.addEventListener('keydown', function (e) {
//     e.preventDefault();
//     //alert(e.key);
//     if(e.key === "ArrowDown" && (depth < 25))
//     {
//         depth -= 0.1;
//         setValues(dx, rho, depth, std, ndata, dkt, inc, len);
//         ctx.clearRect(0,0, canvas.width, canvas.height);
//         r_ctx.clearRect(0,0, width_canvas.width, width_canvas.height);
//         r_ctx.backgroundColor = "#e9e9e9";
//         paint();
//         displaySliderValues();
//         r_ctx.fillStyle = "#cc0000";
//         r_ctx.fillText("Move to Deeper Depth", 73, 222);
//
//     }
//     else if(e.key === "ArrowUp" && (width < 25-0.1))
//     {
//         depth += 0.2;
//         setValues(dx, rho, depth, std, ndata, dkt, inc, len);
//         ctx.clearRect(0,0, canvas.width, canvas.height);
//         r_ctx.clearRect(0,0, width_canvas.width, width_canvas.height);
//         r_ctx.backgroundColor = "#e9e9e9";
//         paint();
//         displaySliderValues();
//         r_ctx.fillStyle = "#cc0000";
//         r_ctx.fillText("Move to Surface ", 83, 24);
//     }
//     else if(e.key === "ArrowRight" && (width < 500))
//     {
//         width += 0.2;
//         ctx.clearRect(0,0, canvas.width, canvas.height);
//         r_ctx.clearRect(0,0, width_canvas.width, width_canvas.height);
//         r_ctx.backgroundColor = "#e9e9e9";
//
//         paint();
//         displaySliderValues();
//         r_ctx.fillStyle = "#cc0000";
//         r_ctx.fillText("Increase Width", 159, 87);
//     }
//     else if(e.key === "ArrowLeft" && (rad > 0.6))
//     {
//         width -= 0.2;
//         ctx.clearRect(0,0, canvas.width, canvas.height);
//         r_ctx.clearRect(0,0, width_canvas.width, width_canvas.height);
//         r_ctx.backgroundColor = "#e9e9e9";
//         paint();
//         displaySliderValues();
//         r_ctx.fillStyle = "#cc0000";
//         r_ctx.fillText("Decrease Width", 2, 87);
//     }
// });

let dragging = false;

function radArrowLeft()
{
    if(width > -500)
    {
        if(force >= 30 && force < 90)
            width -= 0.2;
        else if(force >= 90)
            width -= 1;
        else
            width -= 0.1;
        force += 1;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        r_ctx.clearRect(0,0, width_canvas.width, width_canvas.height);
        paint();
        displaySliderValues();
    }
}
function radArrowRight()
{
    if(width < 2000)
    {
        if(force >= 30 && force < 90)
            width += 0.2;
        else if(force >= 90)
            width += 1;
        else
            width += 0.1;

        force += 1;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        r_ctx.clearRect(0,0, width_canvas.width, width_canvas.height);
        paint();
        displaySliderValues();
    }
}
function radArrowUp()
{
    if(-depth2top > 0)
    {
        key_pressed = true;
        depth2top += 0.1;
        force += 1;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        r_ctx.clearRect(0,0, width_canvas.width, width_canvas.height);
        paint();
        displaySliderValues();
    }
}
function radArrowDown()
{
    if(-depth2top < 25)
    {
        key_pressed = true;
        depth2top -= 0.1;
        force += 1;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        r_ctx.clearRect(0,0, width_canvas.width, width_canvas.height);
        paint();
        displaySliderValues();
    }
}










