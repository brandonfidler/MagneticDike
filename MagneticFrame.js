let DxMin=1.25;   //meters
let DxMax=10.0;
let dDx=0.25;	//Increment in Spacing allowed
let DxBarMin=1;	//Minimum Scroll Bar Value
let DxBarMax=Math.trunc((DxMax-DxMin)/dDx+2.1)-DxMin; //Maximum Scroll Bar Value
let RhoMin=-0.0001; //gm/cm^3
let RhoMax=.1;
let dRho=.0001;
let RhoBarMin=1;
let RhoBarMax=Math.trunc((RhoMax-RhoMin)/dRho+2.1)-0.5;
let StdMin=.01;  //mgal
let StdMax=.50;
let dStd=.01;
let StdBarMin=1;
let StdBarMax=Math.trunc((StdMax-StdMin)/dStd+2.1)-0.05;
let NMin=1;
let NMax=50;
let dN=1;
let NBarMin=1;
let NBarMax=Math.trunc((NMax-NMin)/dN+0.5)-1;
let DktMin=-90; //gm/cm^3
let DktMax=90;
let dDkt=1;
let DktBarMin = 1;
let DktBarMax=Math.trunc((DktMax-DktMin)/dDkt+2.1)-0.5;
let IncMin = -90;
let IncMax = 90;
let dInc = 1;
let IncBarMin = 1;
let IncBarMax = Math.trunc((IncMax - IncMin) / dInc + 2.1)-0.5;

//Now define user controllable plotting variables
let LengthMin = 50.0; //meters
let LengthMax = 500.0;
let dLength = 50.0;
let LengthBarMin = 1;
let LengthBarMax = Math.trunc((LengthMax - LengthMin) / dLength + 2.1) -0.5;


let s_value;	//variable used to collect scrollbar info
let s_size;   //variable to hold scroller size

//Define Variables used to some initial values
let dxf=1.0;
let incf = -42.0;
let rhof= 0.0001;
let stdf=.02;
let ndataf=2;
let dktf = -45;
let lengthf = 500.0;
let last_y = 0;

// Range Sliders
let dxf_slider = document.getElementById("station_spacing");
let rho_slider = document.getElementById("Susceptability");
let n_of_obs_slider = document.getElementById("nOfObservations");
let std_dev_slider = document.getElementById("stdDev");
let dike_trend_slider = document.getElementById("dike_trend");
let inclination_slider = document.getElementById("incline_trend");
let LengthBar_slider = document.getElementById("profile_length");

let label_list_x_loc = X_OFFSET;
let label_list_y_loc  = 400;



function start()
{
    // alert("hello")
    if (canvas.getContext)
    {
        canvas.width = (C_WIDTH+10);
        canvas.height = (C_HEIGHT+5);
        rho = rhof;
        std = stdf;
        dkt = dktf;
        nobs = ndataf;
        dx = dxf;
        inc = incf;
        len = lengthf;
        yloc = yf;

        setScales();
        setValues(dx, rho, std, nobs , dkt, inc, len);
        setSlideBars();
        paint();
        displaySliderValues();
    }
}

function rescale()
{
    ctx.clearRect(0,0, canvas.width, canvas.height);
    r_ctx.clearRect(0,0, width_canvas.width, width_canvas.height);
    setScales();
    paint();
    displaySliderValues();
}


function displaySliderValues(dxf_v = dxf_slider.value, rho_v = rho_slider.value,
                             n_of_obs_v = n_of_obs_slider.value, std_v = std_dev_slider.value,
                             dkt_v = dike_trend_slider.value, inc_v = inclination_slider.value)
{
    document.getElementById("depth_val").innerHTML = ((-depth2top).toFixed(1)+" m");
    document.getElementById("width_val").innerHTML = (width.toFixed(1)+" m");
    r_ctx.fillText((-depth2top).toFixed(1)+" m", 42, 12);
    r_ctx.fillText(width.toFixed(1)+" m", 42, 24);
    document.getElementById("contrast_val").innerHTML = (rhoFormat(rho_v));
    document.getElementById("station_spacing_val").innerHTML = (dxfFormat(dxf_v)+" m");
    document.getElementById("num_of_obs_value").innerHTML = n_of_obs_v.toString();
    document.getElementById("std_val").innerHTML = ((stdFormat(std_v)*100).toFixed(1)+" NT");
    document.getElementById("dike_trend_value").innerHTML = (dktFormat(dkt_v)+ " degrees");
    document.getElementById("incline_value").innerHTML = (incFormat(inc_v)+ " degrees");
}

// Trigger events for the range sliders, each time the user moves the slider
// (e.g. Station Spacing) the corresponding function below will fire.

dxf_slider.oninput = function()
{
    textOutputChange(this.value);
    dxf = dxfFormat(this.value, true);
    frameChanged();
    // alert("hello")
};

function dxf_LeftButton()
{
    dxf_slider.value--;
    dxf = dxfFormat(dxf_slider.value, true);
    textOutputChange(dxf_slider.value);
    frameChanged();
}

function dxf_RightButton()
{
    dxf_slider.value++;
    dxf = dxfFormat(dxf_slider.value, true);
    textOutputChange(dxf_slider.value);
    frameChanged();
}

rho_slider.oninput = function ()
{

    textOutputChange(dxf_slider.value, this.value);
    rhof = rhoFormat(this.value, true);
    frameChanged();
};
function rho_LeftButton()
{

    rho_slider.value--;
    rhof = rhoFormat(rho_slider.value, true);
    textOutputChange(dxf_slider.value, rho_slider.value);
    frameChanged();
}
function rho_RightButton()
{
    rho_slider.value++;
    rhof = rhoFormat(rho_slider.value, true);
    textOutputChange(dxf_slider.value, rho_slider.value);
    frameChanged();
}


n_of_obs_slider.oninput = function ()
{
    textOutputChange(dxf_slider.value, rho_slider.value, this.value);
    ndataf = this.value;
    frameChanged();
};
function n_of_obs_LeftButton()
{
    n_of_obs_slider.value--;
    ndataf = n_of_obs_slider.value;
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value);
    frameChanged();
}
function n_of_obs_RightButton()
{
    n_of_obs_slider.value++;
    ndataf = n_of_obs_slider.value;
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value);
    frameChanged();
}

std_dev_slider.oninput = function ()
{

    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value,
        this.value);
    stdf = stdFormat(this.value, true);
    frameChanged();
};
function std_LeftButton()
{
    std_dev_slider.value--;
    stdf = stdFormat(std_dev_slider.value, true);
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value);
    frameChanged();
}
function std_RightButton()
{
    std_dev_slider.value++;
    stdf = stdFormat(std_dev_slider.value, true);
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value);
    frameChanged();
}

dike_trend_slider.oninput = function ()
{
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value,
        this.value);
    dktf = dktFormat(this.value, true);
    frameChanged();
};
function dkt_LeftButton()
{
    dike_trend_slider.value--;
    dktf = dktFormat(dike_trend_slider.value, true);
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value, dike_trend_slider.value);
    frameChanged();
}
function dkt_RightButton()
{
    dike_trend_slider.value++;
    dktf = dktFormat(dike_trend_slider.value, true);
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value, dike_trend_slider.value);
    frameChanged();
}

inclination_slider.oninput = function () {
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value, dike_trend_slider.value,
        this.value)
    incf = incFormat(this.value, true);
    frameChanged();
};

function inc_LeftButton()
{
    inclination_slider.value--;
    incf = incFormat(inclination_slider.value, true);
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value, dike_trend_slider.value, inclination_slider.value);
    frameChanged();
}

function inc_RightButton()
{
    inclination_slider.value++;
    incf = incFormat(inclination_slider.value, true);
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value, dike_trend_slider.value, inclination_slider.value);
    frameChanged();
}

LengthBar_slider.oninput = function () {
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value, dike_trend_slider.value,inclination_slider.value,
        this.value)
    lengthf = lenFormat(this.value, true);
    frameChanged();
};

function len_LeftButton()
{
    LengthBar_slider.value--;
    lengthf = lenFormat(LengthBar_slider.value, true);
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value, dike_trend_slider.value, inclination_slider.value, LengthBar_slider.value);
    frameChanged();
}

function len_RightButton()
{
    LengthBar_slider.value++;
    lengthf = lenFormat(LengthBar_slider.value, true);
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value, dike_trend_slider.value, inclination_slider.value, LengthBar_slider.value);
    frameChanged();
}

// If the Boolean value "number_val" is set to true, then the following format
// functions will return float values instead of a string.
function dxfFormat(val, number_val=false)
{
    if(number_val)
        return ((val-1)*dDx+DxMin);
    return ((val-1)*dDx+DxMin).toFixed(2);
}

function rhoFormat(val, number_val=false)
{
    if(number_val)
        return ((val-1)*dRho+RhoMin);
    return ((val-1)*dRho+RhoMin).toFixed(4);
}

function stdFormat(val, number_val=false)
{
    if(number_val)
        return (((val-1)*dStd+StdMin));
    return (((val-1)*dStd+StdMin)).toFixed(3);
}

function dktFormat(val, number_val=false)
{
    if(number_val)
        return ((val-1)*dDkt+DktMin);
    return ((val-1)*dDkt+DktMin).toFixed(1);
}

function incFormat(val, number_val=false)
{
    if(number_val)
        return((val-1)*dInc+IncMin);
    return((val-1)*dInc+IncMin).toFixed(2);
}
function lenFormat(val, number_val=false)
{
    if(number_val)
        return((val-1)*dLength+LengthMin);
    return((val-1)*dLength+LengthMin).toFixed(2);
}

// This function clears the space where the unit text is, and redraws it.
function textOutputChange(dxf_v = dxf_slider.value, rho_v = rho_slider.value,
                          n_of_obs_v = n_of_obs_slider.value, std_v = std_dev_slider.value,
                          dkt_v = dike_trend_slider.value, inc_v = inclination_slider.value,
                          len_v = LengthBar_slider.value)
{
    // alert("textOutputChange")
    ctx.clearRect(X_OFFSET, label_list_y_loc-10, 130, 70);
    ctx.fillStyle = "#00DD00";
    ctx.rect( X_OFFSET, label_list_y_loc-10, 130, 70);
    ctx.fill();
    labels();
    displaySliderValues(dxf_v, rho_v, n_of_obs_v, std_v, dkt_v, inc_v, len_v);
}

//Set slide-bars
function setSlideBars() {
    // alert("setSlideBars")
    let s_value;

    //Set Station Spacing
    s_value = Math.trunc((dxf - DxMin) * (DxBarMax - DxBarMin) /
        (DxMax - DxMin) + DxBarMin + 0.5);
    dxf_slider.value = s_value;
    dxf_slider.min = DxBarMin;
    dxf_slider.max = DxBarMax;
    // alert(s_value);
    // //Set Susceptability
    s_value = Math.trunc((rhof - RhoMin) * (RhoBarMax - RhoBarMin) /
        (RhoMax - RhoMin) + RhoBarMin + 0.5);
    rho_slider.value = s_value;
    rho_slider.min = RhoBarMin;
    rho_slider.max = RhoBarMax;
    // alert(s_value);
    //Set Number of Observations, N:
    s_value = Math.trunc((ndataf-NMin) * (NBarMax - NBarMin) /
        (NMax - NMin) + NBarMin + 0.5);
    n_of_obs_slider.value = s_value;
    n_of_obs_slider.min = NBarMin;
    n_of_obs_slider.max = NBarMax;
    // alert(s_value);
    // // Set Standard Deviation
    s_value = Math.trunc((stdf-StdMin) * (StdBarMax - StdBarMin) /
        (StdMax - StdMin) + StdBarMin + 0.5);
    std_dev_slider.value = s_value;
    std_dev_slider.min = StdBarMin;
    std_dev_slider.max = StdBarMax;
    // alert(s_value);
    // // Set Dike Trend
    s_value = Math.trunc((dktf-DktMin) * (DktBarMax - DktBarMin) /
        (DktMax - DktMin) + DktBarMin + 0.5);
    dike_trend_slider.value = s_value;
    dike_trend_slider.min = DktBarMin;
    dike_trend_slider.max = DktBarMax;

    //Set Inclination
    s_value = Math.trunc((incf-IncMin) * (IncBarMax - IncBarMin) /
        (IncMax - IncMin) + IncBarMin + 0.5);
    inclination_slider.value = s_value;
    inclination_slider.min = IncBarMin;
    inclination_slider.max = IncBarMax;


    s_value = Math.trunc((lengthf-LengthMin) * (LengthBarMax - LengthBarMin) /
        (LengthMax - LengthMin) + LengthBarMin + 0.5);
    LengthBar_slider.value = s_value;
    LengthBar_slider.min = LengthBarMin;
    LengthBar_slider.max = LengthBarMax;
}

function setValues(dx, rho, std, nobs,  dkt, inc, len)
{

    dxf = dx;
    rhof = rho;
    stdf = std;
    ndataf = nobs;
    dktf = dkt;
    incf = inc;
    lengthf = len;

    // reset range sliders
    //Set Station Spacing
    s_value = Math.trunc((dxf - DxMin) * (DxBarMax - DxBarMin) /
        (DxMax - DxMin) + DxBarMin + 0.5);
    dxf_slider.value = s_value;


    // //Set Density Contrast
    s_value =  Math.trunc((rhof - RhoMin) * (RhoBarMax - RhoBarMin) /
        (RhoMax - RhoMin) + RhoBarMin + 0.5);
    rho_slider.value = s_value;

    //Set Number of Observations, N:
    s_value = Math.trunc((ndataf-NMin) * (NBarMax - NBarMin) /
        (NMax - NMin) + NBarMin + 0.5);
    n_of_obs_slider.value = s_value;
    //
    // Set Standard Deviation
    s_value = Math.trunc((stdf-StdMin) * (StdBarMax - StdBarMin) /
        (StdMax - StdMin) + StdBarMin + 0.5);
    std_dev_slider.value = s_value;

    // Set Dike Trend
    s_value = Math.trunc((dktf-DktMin) * (DktBarMax - DktBarMin) /
        (DktMax - DktMin) + DktBarMin + 0.5);
    dike_trend_slider.value = s_value;

    //Set Incline of Main Field
    s_value = Math.trunc((incf-IncMin) * (IncBarMax - IncBarMin) /
        (IncMax - IncMin) + IncBarMin + 0.5);
    inclination_slider.value = s_value;

    //Set Length
    s_value = Math.trunc((lengthf - LengthMin) * (LengthBarMax - LengthBarMin) /
        (LengthMax - LengthMin) + LengthBarMin + 0.5);
    LengthBar_slider.value = s_value;

}

function frameChanged()
{
    dx = dxf;
    k = rhof;
    dkt = dktf;
    ndata = ndataf;
    inc = incf;
    std = stdf;
    let len = lengthf;
    xmin = -1.0 * len / 2.0;
    xmax = xmin + len;
    xscale = gwidth / (xmax - xmin);

    ctx.clearRect(0,0, canvas.width, canvas.height);
    r_ctx.clearRect(0,0, width_canvas.width, width_canvas.height);
    r_ctx.backgroundColor = "#e9e9e9";
    paint();
    displaySliderValues();
}

