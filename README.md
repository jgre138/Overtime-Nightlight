# Overtime-Nightlight
My Sphero Bolt+ Robot Project done for CS 104 Intro to Problem Solving at Monmouth University

The original idea was to use the robot to guide the user along a set path in the dark using the LED matrix to show signals to the user when its moving and to speak when its beginning to move or it has completed the task. For the final version, there was more to the movement added and more of a reason to the robot guiding a user, as the user needs to go around the room to task spots, where they would do work.

First verision (Nightlight Demo) is testing the fucntions to be used for the final product.
The final (Overtime NightlightFINAL) is having the robot guide a user in the dark around a classroom to do tasks in the dark, as if the person is working a long day.
Name is subject to change 
## CURRENT VERSION: OvertimeNigthlightVer2
A readable JavaScript file has been added of the code for easy viewing. Will nees to update the .lab file once project is tested. The other two JavaScript files are old and now unused code I wanted to keep record of


Programmer Goals: (We have 1 week left to work on the project - As of 11/20/2025)
- W9: Code the paths for navigating to each door, and to each task (Done)
- W10: Testing pathing to make sure it works every time	(Done)
- W11: Use new features like buttons and/or light sensor for new functions, Implement them. (No dependency on Laptop/Phone input) (Done)
  - Add more user input (choose which task to do first) (Done)
  - Use light sensor to check for user rather than tap (“tap” for above bullet) (Done)
  - Add random number system to have robot go in slightly different paths (To seem less robotic) (Skipped)
- W12: Testing again
  - Fixing the robot paths and making sure the new functions work

Current progress:
- Coded all of the paths
- Debugg all the paths
- Play around and possibly add a debug mode using some of the other features the robto has to offer (Ex. the ligth sensors and the button functions)
- Added new functions to make the robot more

Issues Encountered:
-    Getting the angles right for turning directions (Solved)
-    Fixing a traction/friction issue with using the robot on the classroom floors
  -    Floor is bumpy and very smooth, and the outer shell of the Sphero Bolt+ is a very smooth plastic/acrylic. Smooth + Smooth != Good Traction
