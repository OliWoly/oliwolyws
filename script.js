// Figured out how to make it moe through this.
//document.getElementById("homeNav").style.top = 3 + "em";


// Global Variables
class Logic{
    constructor(){
        // Site metaStatistics
        this.mousePosX = 0;
        this.mousePosY = 0;
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.centreX = window.innerWidth/2;
        this.centreY = window.innerHeight/2;

        // Position Offsets
        this.home = document.getElementById("homeNav");
        this.homeOffX = 0;
        this.homeOffY = 0;
        this.homeRect = this.home.getBoundingClientRect();
        this.homeStrength = 1;
        this.homeAngle = 0;
        this.homeDistance = 0;

        this.project = document.getElementById("projectsNav");
        this.projOffX = 0;
        this.projOffY = 0;
        this.projRect = this.project.getBoundingClientRect();
        this.projStrength = 1;
        this.projAngle = 0;
        this.projDistance = 0;

        this.education = document.getElementById("educationNav");
        this.eduOffX = 0;
        this.eduOffY = 0;
        this.eduRect = this.education.getBoundingClientRect();
        this.eduStrength = 1;
        this.eduAngle = 0;
        this.eduDistance = 0;

        this.contact = document.getElementById("contactNav");
        this.contOffX = 0;
        this.contOffY = 0;
        this.contRect = this.contact.getBoundingClientRect();
        this.contStrength = 1;
        this.contAngle = 0;
        this.contDistance = 0;
    }
}


var site = new Logic();

// Handle Mouse Tracking
document.addEventListener('mousemove', function(event) {
    site.mousePosX = event.clientX;
    site.mousePosY = event.clientY;
});

function calculateStrengths(site){
    var base = 10;
    var upperLimit = 300;

    if (site.homeDistance >= upperLimit){
        multiplier = 1;
    }
    else{
        multiplier = (site.homeDistance / upperLimit);
    }
    
    site.homeStrength = base * multiplier;
    site.projStrength = base;
    site.eduStrength = base;
    site.contStrength = base;
}


function calculateMoveDistances(site){
    site.homeAngle = (Math.atan2((site.homeRect.top + (site.homeRect.height / 2)) - site.mousePosY, (site.homeRect.left + (site.homeRect.width / 2)) - site.mousePosX) * 180) / Math.PI;
    site.homeDistance = Math.sqrt((site.mousePosX - (site.homeRect.left + (site.homeRect.width / 2))) ** 2 + (site.mousePosY - (site.homeRect.top + (site.homeRect.height / 2))) ** 2);

    site.projAngle = (Math.atan2((site.projRect.top + (site.projRect.height / 2)) - site.mousePosY, (site.projRect.left + (site.projRect.width / 2)) - site.mousePosX) * 180) / Math.PI;
    site.projDistance = Math.sqrt((site.mousePosX - (site.projRect.left + (site.projRect.width / 2))) ** 2 + (site.mousePosY - (site.projRect.top + (site.projRect.height / 2))) ** 2);

    site.eduAngle = (Math.atan2((site.eduRect.top + (site.eduRect.height / 2)) - site.mousePosY, (site.eduRect.left + (site.eduRect.width / 2)) - site.mousePosX) * 180) / Math.PI;
    site.eduDistance = Math.sqrt((site.mousePosX - (site.eduRect.left + (site.eduRect.width / 2))) ** 2 + (site.mousePosY - (site.eduRect.top + (site.eduRect.height / 2))) ** 2);

    site.contAngle = (Math.atan2((site.contRect.top + (site.contRect.height / 2)) - site.mousePosY, (site.contRect.left + (site.contRect.width / 2)) - site.mousePosX) * 180) / Math.PI;
    site.contDistance = Math.sqrt((site.mousePosX - (site.contRect.left + (site.contRect.width / 2))) ** 2 + (site.mousePosY - (site.contRect.top) + (site.contRect.height / 2)) ** 2);
}

// Actually calculate the movements of the text.
function move(site){
    calculateMoveDistances(site);
    calculateStrengths(site);
    

    site.homeOffX = (Math.cos(site.homeAngle * Math.PI / 180) * site.homeStrength);
    site.homeOffY = (Math.sin(site.homeAngle * Math.PI / 180) * site.homeStrength);

    site.projOffX = (Math.cos(site.projAngle * Math.PI / 180) * site.projStrength);
    site.projOffY = (Math.sin(site.projAngle * Math.PI / 180) * site.projStrength);

    site.eduOffX = (Math.cos(site.eduAngle * Math.PI / 180) * site.eduStrength);
    site.eduOffY = (Math.sin(site.eduAngle * Math.PI / 180) * site.eduStrength);

    site.contOffX = (Math.cos(site.contAngle * Math.PI / 180) * site.contStrength);
    site.contOffY = (Math.sin(site.contAngle * Math.PI / 180) * site.contStrength);

}

// Apply the calulcations to the elements on the page.
function applyMoveToElements(site){
    site.home.style.left = site.homeOffX + "px";
    site.home.style.top  = site.homeOffY + "px";

    site.project.style.left = site.projOffX + "px";
    site.project.style.top  = site.projOffY + "px";

    site.education.style.left = site.eduOffX + "px";
    site.education.style.top  = site.eduOffY + "px";

    site.contact.style.left = site.contOffX + "px";
    site.contact.style.top  = site.contOffY + "px";
}


// Update game function.
function update(){
    move(site);
    applyMoveToElements(site);
}

// Framerate
setInterval(update, 4);