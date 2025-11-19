/*  
    Overtime Nightlight 
    Code written by Jennifer Greene
    For group project in CS-104
    Current date: 11/7/2025
    GitHub Repository: https://github.com/jgre138/Overtime-Nightlight
*/


//  --- VARIABLES ---
const WAIT_TIME = 10;             // # of seconds to wait for tap
const TASK_TIME = 30;             //30 seconds for demo purposes (might change to )
const TAP_THRESHOLD = 1.05;       //  G threshold for tap detection
let userFound = false;
let tripDone = false;
let doorUser = 'A';             //This is the door the robot will ALWAYS start at for this demo.


//  --- TAP FUNCTION ---
async function detectTap(timeout) { //  Detect tap via accelerometer spike (DO NOT TOUCH, THIS WORKS)
    let a;
    let mag;
    let waited = 0.0;
    while (waited < timeout) {
        a = getAcceleration(); //gets the acceleration or any changes in it during the wait time
        mag = (a["x"] ** 2 + a["y"] ** 2 + a["z"] ** 2) ** 0.5; //calculates total accel in all directions
        if (mag >= TAP_THRESHOLD) { //checks if total accel is above a set threshold
            return true; //change in accelerometer detected in wait time
        }
        await delay(0.1);
        waited += 0.1;
    } 
    return false; // no change detected
}

//  --- CHECK USER ---
async function checkForUser() { //  Checks for user input to continue
    setMainLed({ "r": 255, "g": 255, "b": 255 }); //  white flash;
    let tapped = await detectTap(WAIT_TIME);
    if (tapped) {
        setMainLed({ "r": 0, "g": 255, "b": 0 }); //  green confirm;
        await speak("User is here! Lets go!", false); 
        //  user is at A along with robot;
        userFound = true;
    } else {
        setMainLed({ "r": 255, "g": 0, "b": 0 }); //  red timeout;
        await speak("User is not here, let me check the other door.", false); 
        // User is at the other door
        userFound = false;
    }
    
}

//  --- DOOR MOVEMENT ---
async function goToDoorA() {
    // add a special light to signal its searching
    await rollToDistance(0, 50, 100); //39 in
    await rollToDistance(270, 50, 398); //153 In +
    await rollToDistance(180, 50, 40); //15.5 in
    await rollToDistance(270, 50, 280); //108 +
    await rollToDistance(0, 50, 40); //15.5 in
    await rollToDistance(270, 50, 245); //96 in +
    await rollToDistance(180, 50, 100); // 39 in
}

async function goToDoorB() {
    // add a special light to signal its searching
    await rollToDistance(0, 50, 100); //39 in
    await rollToDistance(90, 50, 245); //96 in + 1
    await rollToDistance(180, 50, 40); //15.5 in
    await rollToDistance(90, 50, 280); //108 in + 2??
    await rollToDistance(0, 50, 40);  // 15.5 in
    await rollToDistance(90, 50, 398); //153 In +
    await rollToDistance(180, 50, 100); //39 in
}

//  --- TASK MOVEMENT --- 
async function goToTask1(){
    if (doorUser == 'A'){ //Move to the task from door a as starting position
        await rollToDistance(0, 50, 100); //39 in
        await rollToDistance(90, 50, 245); //96 in + 1
        await rollToDistance(180, 50, 40); //15.5 in
        await rollToDistance(90, 50, 280); //108 in + 2??
        await rollToDistance(0, 50, 40); //15.5 in
        await rollToDistance(90, 50, 398); //153 In +
        await rollToDistance(0, 50, 453); // 178 1/4 In
    }
    else if (doorUser == 'B'){ //move to task from door b as starting position
        await rollToDistance(0, 50, 572); //225 in
    } 
}

async function goTotask2(){
    await rollToDistance(270, 50, 183); // 72 in     
}

async function goFromTask(){
    if (doorUser == 'A') { //Move from the task to door b
        await rollToDistance(90, 50, 183); // 72 inch
        await rollToDistance(180, 50, 572); //225 in
    }
    else if (doorUser == 'B') { //move from task from door a
        await rollToDistance(90, 50, 183); // 72 inch
        await rollToDistance(180, 50, 453); // 178 1/4 In
        await rollToDistance(270, 50, 398); //153 In +
        await rollToDistance(180, 50, 40); //15.5 in
        await rollToDistance(270, 50, 280); //108 in + 2??
        await rollToDistance(0, 50, 40); //15.5 in
        await rollToDistance(270, 50, 245); //96 in + 1
        await rollToDistance(180, 50, 100); //39 in
    }
}

//  --- MAIN PROCESS ---
async function startWork() { // need to rework this entire function
    while (tripDone != true) {
        await speak("Good afternoon, ready to do some work?", false);
        await checkForUser();
        if (userFound) { // will not change the door user is currently at.
            await goToTask1();
            let taskComplete = detectTap(TASK_TIME);
            //add stuff here lol
            
            tripDone = true;
            await delay(2);
            playMatrixAnimation(0, false);// Checkmark
            await delay(3);
            await speak("Shuttle complete!", false);
        } 
        else if (!userFound && doorUser == 'B'){  
            //If they dont catch user at door A and doent find them at B
            await goToDoorA(); //Goes to other door to find the user
            await delay(1);
            doorUser = 'A';
        }
        else {
            await goToDoorB();
            doorUser = 'B';
        }
    } 
}
async function doorTest(){  //WORKING
    await speak("Going to door B");
    await delay(1);
    await goToDoorB();
    await delay(1);
    await speak("Made it to door B");
    await delay(10)
    await goToDoorA();
    await delay(1)
    await speak("Made it to door A")

}

async function testTaskRouteA(){
    doorUser = 'A'
    await goToTask1();
    await delay(1);
    await speak("made it to task 1");
    await delay(1)
    await goTotask2();
    await delay(1);
    await speak("made it to task 2");
    await delay(1)
    await goFromTask();
    await delay(1);
    await speak("made it to other door");
}

async function testTaskRouteB(){
    doorUser = 'B'
    await goToTask1();
    await delay(1);
    await speak("made it to task 1");
    await delay(1)
    await goTotask2();
    await delay(1);
    await speak("made it to task 2");
    await delay(1)
    await goFromTask();
    await delay(1);
    await speak("made it to other door");
}


//  --- MAIN PROGRAM ---;
async function startProgram() {
    //  ALWAYS start at Door A (A is Home). 
    //  In this case, Door A is the one by the classroom PC.
    await testTaskRouteA();
}

async function OnButton(){ // make this a debug mode???
    await speak("Process being interupted, apologies.")
    tripDone = true;
}

//  use for future refrence
//  playMatrixAnimation(0, false); //checkmark
//  playMatrixAnimation(1, false); //go
//  playMatrixAnimation(2, false); //slowdown
//  playMatrixAnimation(3, false); //stop
//  playMatrixAnimation(4, false); //checkbox
//  playMatrixAnimation(5, true);  //checking the box


registerMatrixAnimation({
    frames: [[[1, 1, 1, 1, 1, 1, 1, 8], [1, 1, 1, 1, 1, 1, 8, 8], [1, 1, 1, 1, 1, 8, 8, 8], [1, 1, 1, 1, 8, 8, 8, 1], [8, 8, 1, 8, 8, 8, 1, 1], [8, 8, 8, 8, 8, 1, 1, 1], [1, 8, 8, 8, 1, 1, 1, 1], [1, 1, 8, 1, 1, 1, 1, 1]]],
    palette: [{ r: 255, g: 255, b: 255 }, { r: 0, g: 0, b: 0 }, { r: 255, g: 0, b: 0 }, { r: 255, g: 64, b: 0 }, { r: 255, g: 128, b: 0 }, { r: 255, g: 191, b: 0 }, { r: 255, g: 255, b: 0 }, { r: 185, g: 246, b: 30 }, { r: 0, g: 255, b: 0 }, { r: 185, g: 255, b: 255 }, { r: 0, g: 255, b: 255 }, { r: 0, g: 0, b: 255 }, { r: 145, g: 0, b: 211 }, { r: 157, g: 48, b: 118 }, { r: 255, g: 0, b: 255 }, { r: 204, g: 27, b: 126 }],
    fps: 10,
    transition: MatrixAnimationTransition.None
});
registerMatrixAnimation({
    frames: [[[1, 1, 8, 8, 8, 8, 1, 1], [1, 8, 8, 8, 8, 8, 8, 1], [8, 8, 8, 8, 8, 8, 8, 8], [8, 8, 8, 8, 8, 8, 8, 8], [8, 8, 8, 8, 8, 8, 8, 8], [8, 8, 8, 8, 8, 8, 8, 8], [1, 8, 8, 8, 8, 8, 8, 1], [1, 1, 8, 8, 8, 8, 1, 1]]],
    palette: [{ r: 255, g: 255, b: 255 }, { r: 0, g: 0, b: 0 }, { r: 255, g: 0, b: 0 }, { r: 255, g: 64, b: 0 }, { r: 255, g: 128, b: 0 }, { r: 255, g: 191, b: 0 }, { r: 255, g: 255, b: 0 }, { r: 185, g: 246, b: 30 }, { r: 0, g: 255, b: 0 }, { r: 185, g: 255, b: 255 }, { r: 0, g: 255, b: 255 }, { r: 0, g: 0, b: 255 }, { r: 145, g: 0, b: 211 }, { r: 157, g: 48, b: 118 }, { r: 255, g: 0, b: 255 }, { r: 204, g: 27, b: 126 }],
    fps: 10,
    transition: MatrixAnimationTransition.None
});
registerMatrixAnimation({
    frames: [[[1, 1, 6, 6, 6, 6, 1, 1], [1, 6, 6, 6, 6, 6, 6, 1], [6, 6, 6, 6, 6, 6, 6, 6], [6, 6, 6, 6, 6, 6, 6, 6], [6, 6, 6, 6, 6, 6, 6, 6], [6, 6, 6, 6, 6, 6, 6, 6], [1, 6, 6, 6, 6, 6, 6, 1], [1, 1, 6, 6, 6, 6, 1, 1]]],
    palette: [{ r: 255, g: 255, b: 255 }, { r: 0, g: 0, b: 0 }, { r: 255, g: 0, b: 0 }, { r: 255, g: 64, b: 0 }, { r: 255, g: 128, b: 0 }, { r: 255, g: 191, b: 0 }, { r: 255, g: 255, b: 0 }, { r: 185, g: 246, b: 30 }, { r: 0, g: 255, b: 0 }, { r: 185, g: 255, b: 255 }, { r: 0, g: 255, b: 255 }, { r: 0, g: 0, b: 255 }, { r: 145, g: 0, b: 211 }, { r: 157, g: 48, b: 118 }, { r: 255, g: 0, b: 255 }, { r: 204, g: 27, b: 126 }],
    fps: 10,
    transition: MatrixAnimationTransition.None
});
registerMatrixAnimation({
    frames: [[[1, 1, 2, 2, 2, 2, 1, 1], [1, 2, 2, 2, 2, 2, 2, 1], [2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2, 2], [1, 2, 2, 2, 2, 2, 2, 1], [1, 1, 2, 2, 2, 2, 1, 1]]],
    palette: [{ r: 255, g: 255, b: 255 }, { r: 0, g: 0, b: 0 }, { r: 255, g: 0, b: 0 }, { r: 255, g: 64, b: 0 }, { r: 255, g: 128, b: 0 }, { r: 255, g: 191, b: 0 }, { r: 255, g: 255, b: 0 }, { r: 185, g: 246, b: 30 }, { r: 0, g: 255, b: 0 }, { r: 185, g: 255, b: 255 }, { r: 0, g: 255, b: 255 }, { r: 0, g: 0, b: 255 }, { r: 145, g: 0, b: 211 }, { r: 157, g: 48, b: 118 }, { r: 255, g: 0, b: 255 }, { r: 204, g: 27, b: 126 }],
    fps: 10,
    transition: MatrixAnimationTransition.None
});
registerMatrixAnimation({
    frames: [[[0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0]]],
    palette: [{ r: 255, g: 255, b: 255 }, { r: 0, g: 0, b: 0 }, { r: 255, g: 0, b: 0 }, { r: 255, g: 64, b: 0 }, { r: 255, g: 128, b: 0 }, { r: 255, g: 191, b: 0 }, { r: 255, g: 255, b: 0 }, { r: 185, g: 246, b: 30 }, { r: 0, g: 255, b: 0 }, { r: 185, g: 255, b: 255 }, { r: 0, g: 255, b: 255 }, { r: 0, g: 0, b: 255 }, { r: 145, g: 0, b: 211 }, { r: 157, g: 48, b: 118 }, { r: 255, g: 0, b: 255 }, { r: 204, g: 27, b: 126 }],
    fps: 10,
    transition: MatrixAnimationTransition.None
});
registerMatrixAnimation({
    frames: [[[0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 8, 1, 1, 1, 1, 1, 0], [0, 8, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 8, 1, 1, 1, 1, 1, 0], [0, 8, 8, 1, 1, 1, 1, 0], [0, 1, 8, 1, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 8, 1, 8, 1, 1, 1, 0], [0, 8, 8, 8, 1, 1, 1, 0], [0, 1, 8, 1, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 8, 1, 1, 0], [0, 8, 1, 8, 8, 1, 1, 0], [0, 8, 8, 8, 1, 1, 1, 0], [0, 1, 8, 1, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 8, 1, 0], [0, 1, 1, 1, 8, 8, 1, 0], [0, 8, 1, 8, 8, 1, 1, 0], [0, 8, 8, 8, 1, 1, 1, 0], [0, 1, 8, 1, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0]], [[0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 1, 8, 0], [0, 1, 1, 1, 1, 8, 8, 0], [0, 1, 1, 1, 8, 8, 1, 0], [0, 8, 1, 8, 8, 1, 1, 0], [0, 8, 8, 8, 1, 1, 1, 0], [0, 1, 8, 1, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0]]],
    palette: [{ r: 255, g: 255, b: 255 }, { r: 0, g: 0, b: 0 }, { r: 255, g: 0, b: 0 }, { r: 255, g: 64, b: 0 }, { r: 255, g: 128, b: 0 }, { r: 255, g: 191, b: 0 }, { r: 255, g: 255, b: 0 }, { r: 185, g: 246, b: 30 }, { r: 0, g: 255, b: 0 }, { r: 185, g: 255, b: 255 }, { r: 0, g: 255, b: 255 }, { r: 0, g: 0, b: 255 }, { r: 145, g: 0, b: 211 }, { r: 157, g: 48, b: 118 }, { r: 255, g: 0, b: 255 }, { r: 204, g: 27, b: 126 }],
    fps: 10,
    transition: MatrixAnimationTransition.None
});


