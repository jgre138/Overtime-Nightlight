/*  
    Overtime Nightlight Version 2
    Code written by Jennifer Greene
    For group project in CS-104
    Current date: 12/1/2025
    GitHub Repository: https://github.com/jgre138/Overtime-Nightlight
*/

var humanfound = false;
var userHere = false;
var loop = true;
var userDoor = 'A';
var userChoice = 0;


async function startProgram() {
    await startWork();
}

async function startWork() {
    await speak('Ready to start?', true);
    await checkForHuman();
    if (humanfound) {
        setFrontLed({ r: 238, g: 107, b: 255 });
        await speak('Where do you want to go?', true);
        while (!(userChoice === 0)) {
            await getUserChoice();
            if (userChoice === 1) {
                setLeftLed({ r: 67, g: 255, b: 117 });
            }
            if (userChoice === 2) {
                setRightLed({ r: 255, g: 226, b: 36 });
            }
            if (userChoice === 3) {
                setMainLed({ r: 182, g: 68, b: 255 });
            }
            await delay(0.025);
        }
    }
    setBackLed({ r: 69, g: 143, b: 255 });
}

async function checkForHuman() {
    await speak('Checking for user at this door. Shine your flashlight if you\'re here.', true);
    humanfound = false;
    while (!humanfound) {
        await delay(10);
        for (var _i0 = 0; _i0 < 5; ++_i0) {
            await delay(0.1);
            if (getAmbientLight() > 60) {
                await speak('User found at this door!', true);
                userDoor = 'A';
                humanfound = true;
            }
            await delay(0.025);
        }
        if (humanfound === false) {
            await speak('No user at this door. Moving to the other door', true);
            await goToDoorB();
            await speak('Checking for user at this door. Shine your flashlight if you\'re here.', true);
            await delay(10);
            for (var _i1 = 0; _i1 < 10; ++_i1) {
                await delay(0);
                if (getAmbientLight() > 60) {
                    await speak('User found at this door!', true);
                    userDoor = 'B';
                    humanfound = true;
                }
                await delay(0.025);
            }
            if (humanfound === false) {
                await speak('I could not find the user at either door. Stopping program.', true);
                exitProgram();
            }
        }
        await delay(0.025);
    }
}

async function getUserChoice() {
    await speak('Tap me to choose your destination.', true);
    await speak('One tap: Task 1. Two taps: Task 2. Three taps: Other door.', true);
    userChoice = 0;
    await delay(5);
    for (var _i2 = 0; _i2 < 10; ++_i2) {
        await delay(0.1);
        if (Math.sqrt((getAcceleration().x ** 2) + (getAcceleration().y ** 2) + (getAcceleration().z ** 2)) > 1.01) {
            await speak('Tap', true);
            userChoice = userChoice + 1;
        }
        await delay(0.025);
    }
}

async function goToDoorB() {
    await rollToDistance(0, 50, 100);
    await rollToDistance(90, 50, 245);
    await rollToDistance(180, 50, 40);
    await rollToDistance(90, 50, 280);
    await rollToDistance(0, 50, 40);
    await rollToDistance(90, 50, 398);
    await rollToDistance(180, 50, 100);
}

async function goToDoorA() {
    await rollToDistance(0, 0, 100);
    await rollToDistance(270, 0, 398);
    await rollToDistance(180, 0, 40);
    await rollToDistance(270, 0, 280);
    await rollToDistance(0, 0, 40);
    await rollToDistance(270, 0, 245);
    await rollToDistance(180, 0, 100);
}

async function goToTask1() {
}

async function goToTask2() {
}

async function goToDoor() {
}

async function onAmbientLight(ambientLight) {
}
registerEventCondition(EventType.onAmbientLight, onAmbientLight, function check(ambientLight) { return ambientLight >= 500 });
