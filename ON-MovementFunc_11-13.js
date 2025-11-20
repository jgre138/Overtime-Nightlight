/*
    Overtime Nightlight
    Code written by Jennifer Greene
    For group project in CS-104
    Current date: 11/19/2025
    GitHub Repository: https://github.com/jgre138/Overtime-Nightlight

    This is the code for the movement functions before the changes in the program.
    I would like to keep a record of old cone in case I use it in the future.

*/

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