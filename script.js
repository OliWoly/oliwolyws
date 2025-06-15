// Global Variables
class NavItem{
    constructor(ID){
        this.id = ID;
        this.element = document.getElementById(ID);
        this.offsetX = 0;
        this.offsetY = 0;
        this.rect = this.element.getBoundingClientRect();
        this.strength = 30;
        this.angle = 0;
        this.distance = 0;
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
    }
}

var site = new Logic();

// Handle Mouse Tracking
document.addEventListener('mousemove', function(event) {
    site.mousePosX = event.clientX;
    site.mousePosY = event.clientY;
});

function calculateStrengths(site){
    const base = 15;
    const upperLimit = 500;

    for (let i=0; i < site.navElements.length; i++){
        
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


function calculateMoveDistances(site){
    for (let i=0; i < site.navElements.length; i++){
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

// Actually calculate the movements of the text.
function move(site){
    calculateMoveDistances(site);
    calculateStrengths(site);
    
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
setInterval(update, 40);