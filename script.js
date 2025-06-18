// Global Variables
// id from document.
const navElementIDs = ["homeNav", "projectsNav", "educationNav", "contactNav", "logoNav"];

// Class Declarations
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
        this.horizontalStrengthMultiplier = 1;
        this.verticalStrengthMultiplier = 0.5;
        this.moveRangeUpperBound = 600;
        this.angle = 0;
        this.distance = 0;

        // Colour Changes
        // converts colour to usable values.
        this.baseColour = this.style.color.match(/\d+/g).map(Number);
        this.targetColour = [...this.baseColour];   // shallow copy
        this.colourRangeUpperBound = 300;

        // Abilities
        this.doesMove = true;
        this.doesChangeColour = true;
    }
    
    // Class Methods

printDetails() {
    const output = 
        `id: ${this.id}
        offsetX: ${this.offsetX}
        offsetY: ${this.offsetY}
        strength: ${this.strength}
        angle: ${this.angle}
        distance: ${this.distance}
        baseColour: ${this.baseColour}
        targetColour: ${this.targetColour}
        doesMove: ${this.doesMove}
        doesChangeColour: ${this.doesChangeColour}`;

    console.log(output);
}


    getCurrentColour(){
        var colour = this.style.color.match(/\d+/g).map(Number);
    return colour;
    }

    // Setters
    setHorizontalStrengthMultiplier(value){
        this.horizontalStrengthMultiplier = value;
    }

    setVerticalStrengthMultiplier(value){
        this.verticalStrengthMultiplier = value;
    }

    setAbilities(doesMove = Boolean, doesChangeColour = Boolean){
        this.doesMove = doesMove;
        this.doesChangeColour = doesChangeColour;
    }

    resetBaseColour(){
        this.baseColour = this.style.color.match(/\d+/g).map(Number);
    }

    setTargetColour(r, g, b){
        this.targetColour[0] = r;
        this.targetColour[1] = g;
        this.targetColour[2] = b;
    }

}

class Logic{
    constructor(){
        // Site Meta Statistics
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.centreX = window.innerWidth/2;
        this.centreY = window.innerHeight/2;
        
        // Mouse Statistics
        this.mousePosX = 0;
        this.mousePosY = 0;
        this.timeOfLastMouseMovement = new Date();
        this.mouseMoveAge = 0;

        this.navElements = [];
        for (let i=0; i < navElementIDs.length; i++){
            this.navElements.push(new NavItem(navElementIDs[i]));
        }

    }

    // Class Methods
    setMouseMoveAge(){
        // Should run every frame.
        var currentTime = new Date();
        this.mouseMoveAge = currentTime.getTime() - this.timeOfLastMouseMovement.getTime();
    }

    setNavElementAttributes(){
        for (let i=0; i < this.navElements.length; i++){
            if (this.navElements[i].id == "homeNav"){
                this.navElements[i].setTargetColour(255, 0, 0);
            }

            if (this.navElements[i].id == "projectsNav"){
                this.navElements[i].setTargetColour(255, 0, 0);
            }

            if (this.navElements[i].id == "educationNav"){
                this.navElements[i].setTargetColour(255, 0, 0);
            }

            if (this.navElements[i].id == "contactNav"){
                this.navElements[i].setTargetColour(255, 0, 0);
            }

            if (this.navElements[i].id == "logoNav"){
                this.navElements[i].setTargetColour(255, 0, 0);
                this.navElements[i].setAbilities(false, true);
            }
        }
    }

}

// Create the site object.
var site = new Logic();
site.setNavElementAttributes();

// Handle Mouse Tracking
document.addEventListener('mousemove', function(event) {
    site.mousePosX = event.clientX;
    site.mousePosY = event.clientY;
    site.timeOfLastMouseMovement = new Date();
});















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
        if (site.navElements[i].doesMove == true){
            site.navElements[i].offsetX = (Math.cos(site.navElements[i].angle * Math.PI / 180) * site.navElements[i].strength) * site.navElements[i].horizontalStrengthMultiplier;
            site.navElements[i].offsetY = (Math.sin(site.navElements[i].angle * Math.PI / 180) * site.navElements[i].strength) * site.navElements[i].verticalStrengthMultiplier;
        }
    }
}
// Apply the calulcations to the elements on the page.
function applyMoveToElements(site){
    for (let i=0; i < site.navElements.length; i++){
        site.navElements[i].element.style.left = site.navElements[i].offsetX + "px";
        site.navElements[i].element.style.top  = site.navElements[i].offsetY + "px";
    }  
}

function apply(site){
    applyMoveToElements(site);
}

site.navElements[0].printDetails();
site.navElements[1].printDetails();
site.navElements[2].printDetails();
// Update game function.
function update(){
    site.setMouseMoveAge();
    move(site);
    apply(site);
}

// Framerate
setInterval(update, 40);