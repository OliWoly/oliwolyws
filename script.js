// Global Variables
class NavItem{
    constructor(ID){
        this.id = ID;
        this.element = document.getElementById(ID);
        this.offsetX = 0;
        this.offsetY = 0;
        this.rect = this.element.getBoundingClientRect();
        this.style = window.getComputedStyle(this.element);

        // Movement
        this.strength;
        this.baseStrength = 23;
        this.moveRangeUpperBound = 600;
        this.angle = 0;
        this.distance = 0;

        // Colour Changes
        // converts color to usable values.
        this.baseColour = this.style.color.match(/\d+/g).map(Number);
        this.targetColour = [...this.baseColour];   // shallow copy
        this.colourRangeUpperBound = 300;

        // Abilities
        this.doesMove = true;
        this.doesChangeColour = true;
    }
}

class Logic{
    constructor(){
        // Site metaStatistics
        this.mousePosX = 0;
        this.mousePosY = 0;
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.centreX = window.innerWidth/2;
        this.centreY = window.innerHeight/2;


        this.navElements = [];
        const navIDs = ["homeNav", "projectsNav", "educationNav", "contactNav"];
        for (let i=0; i < navIDs.length; i++){
            this.navElements.push(new NavItem(navIDs[i]));
        }

        // Assign Custom Abilities
        for (let i=0; i < this.navElements.length; i++){
            if (this.navElements[i].id == "logoNav"){
                this.navElements[i].doesChangeColour = true;
                this.navElements[i].doesMove = false;
            }
        }

    }
}

var site = new Logic();
setTargetColour(site, "homeNav", 255, 0, 0);
setTargetColour(site, "projectsNav", 255, 0, 0);
setTargetColour(site, "educationNav", 255, 0, 0);
setTargetColour(site, "contactNav", 255, 0, 0);
setTargetColour(site, "logoNav", 255, 0, 0);

// Handle Mouse Tracking
document.addEventListener('mousemove', function(event) {
    site.mousePosX = event.clientX;
    site.mousePosY = event.clientY;
});

function setBaseColour(site, id){
    for (let i=0; i < site.navElements.length; i++){
        if (site.navElements[i].doesChangeColour == true){
            if (site.navElements[i].id == id){
                site.navElements[i].baseColour = this.style.color.match(/\d+/g).map(Number);
            }
        }
    }
}

function setTargetColour(site, id, r, g, b){
    for (let i=0; i < site.navElements.length; i++){
        if (site.navElements[i].doesChangeColour == true){
            if (site.navElements[i].id == id){
                site.navElements[i].targetColour[0] = r;
                site.navElements[i].targetColour[1] = g;
                site.navElements[i].targetColour[2] = b;
            }
        }
    }
}

function getCurrentColour(element){
    var colour = element.style.color.match(/\d+/g).map(Number);
    return colour;
}







function recalculateElementAttributes(site){
    for (let i=0; i < site.navElements.length; i++){
        // If moves
        if (site.navElements[i].doesMove == true){
            calculateElementStrength(site.navElements[i]);
        }

        // If changes Colour
        if (site.navElements[i].doesChangeColour == true){
            calculateElementColourChange(site.navElements[i])
        }

        // Always
        calculateElementDistance(site, site.navElements[i]);
        calculateElementAngle(site, site.navElements[i]);
    }
}

function calculateElementColourChange(element){
    for (let i=0; i < site.navElements.length; i++){
        if (element.doesChangeColour == true){

            // Clamped Value
            if (element.distance >= element.colourRangeUpperBound){
                multiplier = 1;
            }
            // Get Percentage
            else {
                multiplier = (element.distance / element.colourRangeUpperBound);
            }

            // Colour calculations
            differences = [];
            finalColour = [];
            for (let j=0; j < 3; j++){
                differences[j] = element.targetColour[j] - element.baseColour[j];
                finalColour[j] = element.targetColour[j] - (differences[j] * multiplier);
            }

            element.element.style.color = `rgb(${finalColour[0]}, ${finalColour[1]}, ${finalColour[2]})`;
    
        }
    }
}

function calculateElementStrength(element){
    // Clamp strength when too far away.
    if (element.distance >= element.moveRangeUpperBound){
        multiplier = 1;
    }

    // Begin Fading under upper bound.
    else {
        multiplier = (element.distance / element.moveRangeUpperBound);
    }
        
    // Apply calculations
    element.strength = element.baseStrength * multiplier;
}

function calculateElementDistance(site, element){
    // Distance
    element.distance = 
    Math.sqrt((site.mousePosX - (element.rect.left + (element.rect.width / 2))) ** 2 
    + (site.mousePosY - (element.rect.top + (element.rect.height / 2))) ** 2);
}

function calculateElementAngle(site, element){
    // Angle
    element.angle = 
    (Math.atan2((element.rect.top + (element.rect.height / 2)) - site.mousePosY,
    (element.rect.left + (element.rect.width / 2)) - site.mousePosX) * 180) / Math.PI;
}









// Actually calculate the movements of the text.
function move(site){
    recalculateElementAttributes(site);
    
    // Movement Loop
    for (let i=0; i < site.navElements.length; i++){
        site.navElements[i].offsetX = (Math.cos(site.navElements[i].angle * Math.PI / 180) * site.navElements[i].strength);
        site.navElements[i].offsetY = (Math.sin(site.navElements[i].angle * Math.PI / 180) * site.navElements[i].strength);
    }
}

// Apply the calulcations to the elements on the page.
function applyMoveToElements(site){
    for (let i=0; i < site.navElements.length; i++){
        site.navElements[i].element.style.left = site.navElements[i].offsetX + "px";
        site.navElements[i].element.style.top  = site.navElements[i].offsetY + "px";
    }  
}


// Update game function.
function update(){
    move(site);
    applyMoveToElements(site);
}

// Framerate
setInterval(update, 0);