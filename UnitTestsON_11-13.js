/*
    Overtime Nightlight
    Code written by Jennifer Greene
    For group project in CS-104
    Current date: 11/19/2025
    GitHub Repository: https://github.com/jgre138/Overtime-Nightlight

    This is the code for the tests I created to test each route the robot
    would initialy go. Project has changed to add user input to let the 
    user choose where to go from each stop.

*/

//  ---  UNIT TESTS --- (NOT USED ANYMORE DUE TO NEW SYSTEM)
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
