// Global Variables
class NavItem{
    constructor(ID){
        // Attributes
        this.id = ID;
        this.element = document.getElementById(ID);
        this.offsetX = 0;
        this.offsetY = 0;

        // Element Attributes
        this.rect = this.element.getBoundingClientRect();
        this.style = window.getComputedStyle(this.element);

        // Movement
        this.strength = 30;
        this.angle = 0;
        this.distance = 0;

        // Colour Changes
        // converts color to usable values.
        this.baseColour = this.style.color.match(/\d+/g).map(Number);
        this.targetColour = [...this.baseColour];   // shallow copy

        // Abilities
        this.doesMove = true;
        this.doesChangeColour = false;
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
        const navIDs = ["homeNav", "projectsNav", "educationNav", "contactNav", "logoNav"];
        for (let i=0; i < navIDs.length; i++){
            this.navElements.push(new NavItem(navIDs[i]));
        }

        // Assign Custom Abilities
        for (let i=0; i < this.navElements.length; i++){
            if (this.navElements[i].id == "logoNav"){
                this.navElements[i].doesChangeColour = true;
                this.navElements[i].doesMove = true;
            }
        }

    }
}

var site = new Logic();
changeTargetColours(site, "logoNav", 255, 0, 0);

// Handle Mouse Tracking
document.addEventListener('mousemove', function(event) {
    site.mousePosX = event.clientX;
    site.mousePosY = event.clientY;
});

function updateBaseColour(site, id){
    for (let i=0; i < site.navElements.length; i++){
        if (site.navElements[i].doesChangeColour == true){
            if (site.navElements[i].id == id){
                site.navElements[i].baseColour = this.style.color.match(/\d+/g).map(Number);
            }
        }
    }
}

function changeTargetColours(site, id, r, g, b){
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

function getCurrentColour(navElement){
    var colour = navElement.style.color.match(/\d+/g).map(Number);
    return colour;
}

function distanceColour(site){
    for (let i=0; i < site.navElements.length; i++){
        if (site.navElements[i].doesChangeColour == true){
            const upperLimit = 300;
            let multiplier = 1;

            // Clamped Value
            if (site.navElements[i].distance >= upperLimit){
                multiplier = 1;
            }
            // Get Percentage
            else {
                multiplier = (site.navElements[i].distance / upperLimit);
            }

            // Colour calculations
            differences = [];
            finalColour = [];
            for (let j=0; j < 3; j++){
                differences[j] = site.navElements[i].targetColour[j] - site.navElements[i].baseColour[j];
                finalColour[j] = site.navElements[i].targetColour[j] - (differences[j] * multiplier);
            }

            site.navElements[i].element.style.color = `rgb(${finalColour[0]}, ${finalColour[1]}, ${finalColour[2]})`;
    
        }
    }
}

function calculateStrengths(site){
    const base = 15;
    const upperLimit = 500;

    for (let i=0; i < site.navElements.length; i++){
        if (site.navElements[i].doesMove == true){
            // Clamp strength when too far away.
            if (site.navElements[i].distance >= upperLimit){
                multiplier = 1;
            }

            // Begin Fading under upper bound.
            else {
                multiplier = (site.navElements[i].distance / upperLimit);
            }
            
            // Apply calculations
            site.navElements[i].strength = base * multiplier;
        }
    }  
}

function calculateMoveDistances(site){
    for (let i=0; i < site.navElements.length; i++){
        if (site.navElements[i].doesMove == true){
            // Angle
            site.navElements[i].angle = 
            (Math.atan2((site.navElements[i].rect.top + (site.navElements[i].rect.height / 2)) - site.mousePosY,
            (site.navElements[i].rect.left + (site.navElements[i].rect.width / 2)) - site.mousePosX) * 180) / Math.PI;
        
            // Distance
            site.navElements[i].distance = 
            Math.sqrt((site.mousePosX - (site.navElements[i].rect.left + (site.navElements[i].rect.width / 2))) ** 2 
            + (site.mousePosY - (site.navElements[i].rect.top + (site.navElements[i].rect.height / 2))) ** 2);
        }
    }
}

// Actually calculate the movements of the text.
function move(site){
    calculateMoveDistances(site);
    calculateStrengths(site);
    
    // Movement Loop
    for (let i=0; i < site.navElements.length; i++){
        if (site.navElements[i].doesMove == true){
            site.navElements[i].offsetX = (Math.cos(site.navElements[i].angle * Math.PI / 180) * site.navElements[i].strength);
            site.navElements[i].offsetY = (Math.sin(site.navElements[i].angle * Math.PI / 180) * site.navElements[i].strength);
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


// Update game function.
function update(){
    move(site);
    apply(site);
    distanceColour(site);
}

// Framerate
setInterval(update, 40);