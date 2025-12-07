/*  
    Overtime Nightlight 
    Code written by Jennifer Greene
    For group project in CS-104
    Current date: 12/7/2025
    GitHub Repository: https://github.com/jgre138/Overtime-Nightlight
    This is the final verison of the project
*/

var humanfound = false;
var tapped = false;
var userChoice = 0;
var userDoor = 1;
var timeout = 0;


async function startProgram() {
	setFrontLed({ r: 51, g: 255, b: 73 });
	await speak('Ready to start?', true);
	await setDisplayAnimation("waving-animation", false);
	await findUser();
	if (humanfound) {
		await speak('Hello!', true);
		await getUserChoice();
		if (userChoice === 1) {
			await scrollMatrixText('T1 Route', { r: 255, g: 255, b: 255 }, 30, true);
			await startAtTask1();
		}
		if (userChoice === 2) {
			await scrollMatrixText('T2 Route', { r: 255, g: 255, b: 255 }, 15, true);
			await startAtTask2();
		}
		if (userChoice === 3) {
			await scrollMatrixText('Clock Out', { r: 255, g: 255, b: 255 }, 15, true);
			await noTasks();
		}
		await setDisplayAnimation("applause", false);
		await speak('Good job today!', true);
		await delay(2);
		await noTasks();
	}
}

async function findUser() {
	await speak('Checking for user at this door. Shine your flashlight if you\'re here.', true);
	humanfound = false;
	await setDisplayImage("magnifying-glass");
	for (var _i0 = 0; _i0 < 5; ++_i0) {
		await delay(1);
		if (getAmbientLight() > 200) {
			humanfound = true;
			await setDisplayAnimation("check-mark-button", false);
		}
		await delay(0.025);
	}
	if (humanfound === true) {
		await speak('User found at this door!', true);
		userDoor = 1;
	} else {
		await speak('No user at this door. Moving to the other door', true);
		await setDisplayAnimation("prohibited-animation", false);
		await goToDoorB();
		await speak('Checking for user at this door. Shine your flashlight if you\'re here.', true);
		await setDisplayImage("magnifying-glass");
		for (var _i1 = 0; _i1 < 5; ++_i1) {
			await delay(1);
			if (getAmbientLight() > 200) {
				humanfound = true;
				await setDisplayAnimation("check-mark-button", false);
			}
			await delay(0.025);
		}
		if (humanfound === true) {
			await speak('User found at this door!', true);
			userDoor = 2;
		} else {
			await speak('I could not find the user at either door. Stopping program.', true);
			await setDisplayAnimation("prohibited-animation", false);
			await goToDoorA();
			exitProgram();
		}
	}
}

async function getUserChoice() {
	await speak('Shake me to choose where you would like to start.', true);
	await speak('One shake for task one. Two shakes for task two.', true);
	await speak('Three shakes for clocking out early.', true);
	userChoice = 0;
	timeout = 0;
	tapped = false;
	while (!(timeout >= 10)) {
		if (Math.sqrt((getAcceleration().x ** 2) + (getAcceleration().y ** 2) + (getAcceleration().z ** 2)) > 1.3 && tapped === false) {
			tapped = true;
			userChoice = userChoice + 1;
			if (userChoice === 1) {
				await speak('One Tap', true);
				await setDisplayImage("number-1");
			}
			if (userChoice === 2) {
				await speak('Two Taps', true);
				await setDisplayImage("number-2");
			}
			if (userChoice === 3) {
				await speak('Three Taps', true);
				await setDisplayImage("number-3");
			}
		}
		if (Math.sqrt((getAcceleration().x ** 2) + (getAcceleration().y ** 2) + (getAcceleration().z ** 2)) < 1.3) {
			tapped = false;
		}
		timeout = timeout + 0.1;
		await delay(0.025);
	}
}

async function startAtTask1() {
	await speak('Lets go to task 1.', true);
	if (userDoor === 1) {
		await rollToDistance(0, 50, 100);
		await rollToDistance(90, 50, 245);
		await rollToDistance(180, 50, 40);
		await rollToDistance(90, 50, 280);
		await rollToDistance(0, 50, 40);
		await rollToDistance(90, 50, 398);
		await rollToDistance(0, 50, 453);
	}
	if (userDoor === 2) {
		await rollToDistance(0, 50, 572);
	}
	await speak('At task 1', true);
	await setDisplayAnimation("clock-animation", false);
	await delay(10);
	await speak('Let\'s go to task 2', true);
	await rollToDistance(270, 50, 183);
	await speak('At  task 2', true);
	await setDisplayAnimation("clock-animation", false);
	await delay(10);
	await speak('All done, lets go back to the door', true);
	if (userDoor === 1) {
		await rollToDistance(90, 50, 183);
		await rollToDistance(180, 50, 572);
		userDoor = 2;
	} else {
		await rollToDistance(90, 50, 183);
		await rollToDistance(180, 50, 453);
		await rollToDistance(270, 50, 398);
		await rollToDistance(180, 50, 40);
		await rollToDistance(270, 50, 280);
		await rollToDistance(0, 50, 40);
		await rollToDistance(270, 50, 245);
		await rollToDistance(180, 50, 100);
		userDoor = 1;
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

async function startAtTask2() {
	await speak('Lets go to task 2.', true);
	if (userDoor === 1) {
		await rollToDistance(0, 50, 100);
		await rollToDistance(90, 50, 245);
		await rollToDistance(180, 50, 40);
		await rollToDistance(90, 50, 280);
		await rollToDistance(0, 50, 40);
		await rollToDistance(90, 50, 398);
		await rollToDistance(0, 50, 453);
		await rollToDistance(270, 50, 183);
	}
	if (userDoor === 2) {
		await rollToDistance(0, 50, 572);
		await rollToDistance(270, 50, 183);
	}
	await speak('At Task 2', true);
	await setDisplayAnimation("clock-animation", false);
	await delay(10);
	await speak('Lets got to task 1', true);
	await rollToDistance(90, 50, 183);
	await speak('At task 1', true);
	await setDisplayAnimation("clock-animation", false);
	await delay(10);
	await speak('All done, lets go back to the door', true);
	if (userDoor === 1) {
		await rollToDistance(180, 50, 572);
		userDoor = 2;
	} else {
		await rollToDistance(180, 50, 453);
		await rollToDistance(270, 50, 398);
		await rollToDistance(180, 50, 40);
		await rollToDistance(270, 50, 280);
		await rollToDistance(0, 50, 40);
		await rollToDistance(270, 50, 245);
		await rollToDistance(180, 50, 100);
		userDoor = 1;
	}
}

async function noTasks() {
	if (userDoor === 1) {
		await speak('Going to sleep', true);
		exitProgram();
	} else {
		await speak('Returning home, then going to sleep.', true);
		await goToDoorA();
	}
	exitProgram();
}

async function goToDoorA() {
	await rollToDistance(0, 50, 100);
	await rollToDistance(270, 50, 398);
	await rollToDistance(180, 50, 40);
	await rollToDistance(270, 50, 280);
	await rollToDistance(0, 50, 40);
	await rollToDistance(270, 50, 245);
	await rollToDistance(180, 50, 100);
}

