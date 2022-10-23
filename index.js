
var n_o_circles = 10;
var x_field_size = 400;
var y_field_size = 700;
var field_left = 50;
var field_top = 50;
var circle_radius = 25;
var animation_on = true;
var circle;
var x_vector = [];
var y_vector = [];
var vx_vector = [];
var vy_vector = [];
var overlapped = false;
var max_speed = 10;
var frame_rate = 60;
var inital_run

// create playing field
createField();


// create the circles as specified at the top of file and add to 'list'
for(var i = 0; i < n_o_circles; i++){
    createCircle(i);
}
var circles = document.getElementsByClassName("circle");

for(var i = 0; i < 10; i++){
    
}

// Start game clock
var update_frame_timer = setInterval(updateFrame, 1000/frame_rate);


function updateFrame(){

    if(animation_on){
        // make sure circles do not leave playing field
        bounceWalls();

        // make sure there is not wall overlaps
        separate_from_walls();

        // check if there are circles colliding and change to new appropriate velcities
        checkOverlap();

        // Update location
        for(var i = 0; i < n_o_circles; i++){
            circle = circles[i];

            // update position vectors
            x_vector[i] = x_vector[i] + vx_vector[i];
            y_vector[i] = y_vector[i] + vy_vector[i];

            // update circle locations
            circle.style.left = x_vector[i] + "px";
            circle.style.top = y_vector[i]  + "px";

        }
    }
}


// Change ball-direction if it hits wall of 'playing-field'
function bounceWalls(){
    for(var i = 0; i<n_o_circles; i++){
        circle = circles[i]
        if( ((x_vector[i] <= field_left) || (x_vector[i] >= (x_field_size + field_left - 2*circle_radius)))){
            vx_vector[i] = -1 * vx_vector[i];
        } 
        else if((y_vector[i] <= field_top) || (y_vector[i] >= (y_field_size + field_top - 2*circle_radius))){
            vy_vector[i] = -1 * vy_vector[i];
        }
    }
}


// step through array of circles to check for overlap
// u is i-circle, and v is j-circle
var ux;
var uy;
var u1;
var u2;
var vx;
var vy;
var v1;
var v2;
var vel_temp;
var check_passed = false;
var temp_index = 0;

function checkOverlap(){
    for(var i = 0; i < n_o_circles-1; i++){
        for(var j = i+1; j < n_o_circles; j++){
            //alert(i + " " + j);
            overlapped = isOverlapping( i, j);
            if(overlapped){

                // make sure objects are not overlapping
                
                    temp_index = 0;
                    while(!check_passed){
                        x_vector[i] = x_vector[i] - 0.1*vx_vector[i];
                        y_vector[i] = y_vector[i] - 0.1*vy_vector[i];
                        x_vector[j] = x_vector[j] - 0.1*vx_vector[j];
                        y_vector[j] = y_vector[j] - 0.1*vy_vector[j];
                        check_passed = !isOverlapping(i, j);
                        temp_index += 1;
                    }
                    check_passed = false;
                    console.log(temp_index);
                    
                    
                // First ball's velocities
                ux = vx_vector[i];//x_vector[i];
                uy = vy_vector[i];
                // second balls velocities
                vx = vx_vector[j];
                vy = vy_vector[j];


                var Y = ball_angles(i, j);
                

                // Translate velocities into new collision-frame
                // first balls veloities in new frame
                u1 = ux*Math.cos(Y) + uy*Math.sin(Y);
                u2 = uy*Math.cos(Y) - ux*Math.sin(Y);
                // second ball's veloities in new frame
                v1 = vx*Math.cos(Y) + vy*Math.sin(Y);
                v2 = vy*Math.cos(Y) - vx*Math.sin(Y);

                // momentum-transfer
                vel_temp = u1;
                u1 = v1;
                v1 = vel_temp;

                // express velcities in original x/y-frame
                ux = u1*Math.cos(Y) - u2*Math.sin(Y);
                uy = u2*Math.cos(Y) + u1*Math.sin(Y);

                vx = v1*Math.cos(Y) - v2*Math.sin(Y);
                vy = v2*Math.cos(Y) + v1*Math.sin(Y);


                
                // store new velocities in 
                vx_vector[i] = ux;
                vy_vector[i] = uy;

                vx_vector[j] = vx;
                vy_vector[j] = vy;

                
            } 
        }
    }
}
    


// measures distance between two circles and detects collision
function isOverlapping(i, j){
    var dist = ball_distance(i, j);
    if(dist <= 2*circle_radius){
        return true;
    }
    else {
        return false;
    }
}


// Get distance between two balls with index i and j
var dx;
var dy;
var distance;
function ball_distance(i, j){
    // 
    dx = x_vector[j] - x_vector[i];
    dy = y_vector[j] - y_vector[i];
    
    // distance and compare
    distance = Math.sqrt( Math.pow( dx, 2) + Math.pow( dy, 2) );
    return distance;
}

function ball_angles(i, j){

    var Y = (Math.atan((y_vector[j] - y_vector[i])/(x_vector[j] - x_vector[i]))); // * 180 / Math.PI;
    return Y;
}


function separate_from_walls(){
    for(var m = 0; m < n_o_circles; m++){
        if( (x_vector[m] <= field_left)){
            x_vector[m] = 1 + field_left;
        } 
        else if(x_vector[m] >= (x_field_size + field_left - 2*circle_radius)){
            x_vector[m] = x_field_size + field_left - 2*circle_radius - 1;
        }
        else if((y_vector[m] <= field_top)){
            y_vector[m] = 1 + field_top;
        } 
        else if(y_vector[m] >= (y_field_size + field_top - 2*circle_radius)){
            y_vector[m] = y_field_size + field_top - 2*circle_radius;
        }
    }
    
}



function createCircle(i){
    // Instantiate
    circle = document.createElement("div");
    circle.setAttribute("class", "circle");

    // initial position and size
    circle.style.height = 2*circle_radius+"px";
    circle.style.width = 2*circle_radius+"px";
    circle.style.borderRadius = 50 + "%";
    circle.style.position = "absolute";
    x_vector[i] = 2*circle_radius + (Math.random() * (x_field_size + field_left - 4*circle_radius));
    y_vector[i] = 2*circle_radius + (Math.random() * (y_field_size + field_top - 4*circle_radius));
    circle.style.left = x_vector[i] + "px";
    circle.style.top = y_vector[i] + "px";

    
    // initial velocities
    vx_vector[i] = (Math.random() * 2*max_speed) - max_speed;
    vy_vector[i] = (Math.random() * 2*max_speed) - max_speed;
    
    // visual
    circle.style.backgroundColor = "red";
    circle.appendChild(document.createTextNode("" + i));
    circle.style.textAlign = "center";
    circle.style.verticalAlign = "middle";
    
    
    /*
    var img = document.createElement("IMG");
    if(Math.random() < 0.5){
        img.src = "apa.jpg";
    }
    else{
        img.src = "godzilla.jpg";
    }
    
    circle.appendChild(img);
    circle.borderRadius = 50+"%";
    */

    // add to body
    document.body.appendChild(circle);
}

var field;
function createField(){
    field = document.createElement("div");
    field.style.width = x_field_size + "px";
    field.style.height = y_field_size + "px";
    field.style.position = "absolute";
    field.style.left = field_left + "px";
    field.style.top = field_top +"px";
    field.style.backgroundColor = "blue";

    document.body.appendChild(field);


}
