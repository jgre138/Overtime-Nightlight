/*  
    Overtime Nightlight 
    Code written by Jennifer Greene
    For group project in CS-104
    Current date: 11/19/2025
    GitHub Repository: https://github.com/jgre138/Overtime-Nightlight
*/

//  --- VARIABLES ---
const WAIT_TIME = 10;             // # of seconds to wait for tap
const TASK_TIME = 30;             // 30 seconds for demo purposes, uses this to wait for user confimation on completion of task
const TAP_THRESHOLD = 1.05;       //  G threshold for tap detection
let doorUser = 'A';               //This is to keep track of what door the user starts at.
let currLocation = "A"                // this is to keep track of which task the user is at.

//  --- TAP FUNCTION ---
// Use for user choice
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

//  --- LIGHT FUNCTION ---
//user for confirmation and to start user interaction
async function detectLightFlash(timeout) {
    let baseline = getAmbientLight();
    let elapsed = 0;
    while (elapsed < timeout) {
        let current = getAmbientLight();

        // Bright flashlight → confirm
        if (current > baseline + 30) {
            return true;
        }
        await delay(0.1);
        elapsed += 0.1;
    }
    return false;
}

//  --- USER CHOICE ---
async function getUserChoice() {
    await speak("Tap me to choose your destination.", false);
    await speak("One tap: Task 1. Two taps: Task 2. Three taps: Other door.", false);

    let taps = 0;
    let elapsed = 0;

    // We loop until WAIT_TIME seconds have passed
    while (elapsed < WAIT_TIME) {

        // detectTap already handles its own short wait
        if (await detectTap(0.4)) {
            taps++;
            playMatrixAnimation(1, false); // show tap detected
        }

        await delay(0.1);  
        elapsed += 0.1;    
    }

    if (taps === 1) return "task1";
    if (taps === 2) return "task2";
    if (taps === 3) return "door";
    return "done";
}

//  --- CHECK USER ---
//optimize this 
async function checkForUser() { //  Checks for user input to continue
    setMainLed({ r: 255, g: 255, b: 255 }); 
    await speak("Checking for user at this door. Shine your flashlight if you're here.", false);
    let found = await detectLightFlash(WAIT_TIME);
    if (found) {
        setMainLed({ r: 0, g: 255, b: 0 }); // green
        await speak("User found at this door!", false);
        doorUser = 'A'; //Make sure the user is at A
        return true;
    }
    // --- NOT AT A -> GO TO B ---
    setMainLed({ r: 255, g: 128, b: 0 }); // change this later
    await speak("No user at this door. Moving to the other door", false);
    await goToDoorB();
    await delay(0.5);

    setMainLed({ r: 255, g: 255, b: 255 }); // white
    await speak("Checking for user at this door. Shine your flashlight if you're here.", false);
    found = await detectLightFlash(WAIT_TIME);
    if (found) {
        setMainLed({ r: 0, g: 255, b: 0 }); // green
        await speak("User found at this door", false);
        doorUser = 'B';
        return true;
    }
    // --- NOT AT B EITHER -> STOP PROGRAM ---
    setMainLed({ r: 255, g: 0, b: 0 }); // red 
    await speak("I could not find the user at either door. Stopping program.", false);
    return false;
}

//  --- DOOR MOVEMENT --- (need to modify if going to start at any place)
async function goToDoorA() {
    await rollToDistance(0, 50, 100); //39 in
    await rollToDistance(270, 50, 398); //153 In +
    await rollToDistance(180, 50, 40); //15.5 in
    await rollToDistance(270, 50, 280); //108 +
    await rollToDistance(0, 50, 40); //15.5 in
    await rollToDistance(270, 50, 245); //96 in +
    await rollToDistance(180, 50, 100); // 39 in
}

async function goToDoorB() {
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
async function startWork() { // need to make sure this works
    await speak("Good afternoon, ready to do some work?", false);
    let userHere = await checkForUser();
    if (!userHere) return;

    let destination = await getUserChoice();

    do {

        if (destination === "done") {
            await speak("Okay, we're finished.", false);
            playMatrixAnimation(0, false);
            return;
        }

        if (destination === "door") {
            await speak("Heading to the other door.", false);

            if (doorUser === "A") {
                await goToDoorB();
                doorUser = "B";
            } else {
                await goToDoorA();
                doorUser = "A";
            }

            await speak("We have arrived. Program complete.", false);
            return;
        }

        if (destination === "task1") {
            await speak("Going to Task 1.", false);
            await goToTask1();

            await speak("Shine your flashlight when you're done.", false);

            let confirmed = await detectLightFlash(TASK_TIME);

            while (!confirmed) {
                playMatrixAnimation(3, false); // 
                await speak("No confirmation detected, let me give you a little more time.", false);
            }
            playMatrixAnimation(0, false); // 
                await speak("Task 1 complete.", false);
        }

        if (destination === "task2") {
            await speak("Going to Task 2.", false);
            await goTotask2();

             await speak("Shine your flashlight when you're done.", false);

            let confirmed = await detectLightFlash(TASK_TIME);

            while (!confirmed) {
                playMatrixAnimation(3, false); //
                await speak("No confirmation detected, let me give you a little more time.", false);
            }
            playMatrixAnimation(0, false); // 
                await speak("Task 1 complete.", false);
        }

        // 4. ASK WHERE TO GO *NEXT*
        destination = await getUserChoice();

    } while (true); // exit conditions happen inside via returns
    
}

//  ---  UNIT TESTS --- 
async function testingLight() {
    let lightTest = detectLightFlash(WAIT_TIME);

    if (lightTest){
        setMainLed({ r: 255, g: 255, b: 255 });
        await speak("LIGHT! :>")
    }
}

async function testingChoice(){
    let choice = getUserChoice();

    if (choice === "door"){
        await speak("door");
    }
    else if(choice === "task1"){
        await speak("task 1");
    }
    else if (choice === "task2") {
        await speak("task 2");
    }
    else if (choice === "done") {
        await speak("done");
    }
}


//  --- MAIN PROGRAM ---;
async function startProgram() {
    //  ALWAYS start at Door A (A is Home). 
    //  In this case, Door A is the one by the classroom PC.
    await startWork();
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


