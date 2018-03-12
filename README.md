
# MiAM

MiAM is a social media app in which users can generate memes easily, share them freely under their username or anonymously, remix/re-edit likable memes, follow favorite meme-masters, and participate in meme battles. The app also has a reward system and keeps track of the user profiles and their meme battles. 

## Mock Up
See our original mock-ups: [[link]](https://projects.invisionapp.com/share/9VDW1X3SU#/sceens)

## Architecture

### Frontend:
* React Native
* __Deployment__: Expo

### Backend:
* MongoDB (Database)
* ExpressJS
* Node with Babel
* __Deployment__: Heroku


## Setup
Assuming Node.js and Node Package Manager (npm) has been downloaded and installed:
1. Download `Expo XDE` from app store or the Internet
2. `npm install exp --global`
3. `git clone https://github.com/dartmouth-cs98/17f-miam.git`
4. `cd 17f-miam/miam`
5. `npm install`
6. `cd node_modules/react-native-keyboard-aware-view`
7. `rm -rf node_modules`
8. Open up Expo XDE. Click _"Open Existing Project"_ and navigate to 17f-miam/miam. Select this file.
9. Once the message _"Project opened!"_ appears in the XDE console, click on the _"Device"_ button at the top right of the window and click on _"Open on iOS Simulator"_.
10. After the scripts finish loading, have fun :)


## Deployment

The frontend was deployed on Expo XDE during development. The app is now available on the Apple iOS store! Type in _"MIAM Make it a Meme"_ to find it.

The backend was deployed on Heroku. To learn more about it, follow this link to the github page: [[link]](https://github.com/dartmouth-cs98/17f-miam-backend)

## Demo
#### The Feed and Commenting:
<img src="readmeGifs/gif1.gif" height="40%" width="40%" >

#### MiAM Editor:
<img src="readmeGifs/gif2.gif" height="40%" width="40%" >

#### MiAM Meme Battle:
<img src="readmeGifs/gif3.gif" height="40%" width="40%" >

#### MiAM Meme Remixing:
<img src="readmeGifs/gif4.gif" height="40%" width="40%" >

## End of Class Summary:
### 1. What worked and didn't work:
* What worked:
	* The core features that we wanted to incorporate into our app (i.e. the meme editor, meme battles, befriend/following users) were implemented into the app.
	* We were able to better split up the tasks between group members who wanted to work on particular parts of the app they wanted to code.
	* Going back into coding in January and being more familiar with React Native, we were able to code more efficiently. In addition, we were able to better understand the limitations of React Native and find work arounds.
	* We were able to hold some meetings online through software like Slack and Skype.
	* Github issues were a better way to keep track of bugs, features, and other notes on our project rather than keeping them in our heads.
	* We were able to finally publish our app onto the Apple iOS store!
* What didn't work:
	* Although github milestones were eventually met, they didn’t necessarily push us to finish issues by a certain date.
	* We were unable to get a stable Android build.

### 2. Brief summary of any insights from user testing / conclusions drawn:
* Overall, it seemed that many enjoyed using the app during demo day, especially the core features (i.e. editor and meme battle). We even got some people to download the app and post some dank memes.
* Nonetheless, we did receive some feedback providing pointers to increase the convenience of using out app. For example:
	* When adding a text object to the meme, automatically go into text editing mode.
	* Use an color palette instead of sliders for change text color.
	* Instead of a chat feature, use polling instead for battles.
	* __*"GIVE ME ANDROID VERSION"*__
* In conclusion, people enjoyed the concept and wish to see the app grow.

### 3. Any potential next steps (if you were going to take this further):
* We noticed that the Heroku web server we use goes to sleep after some inactivity. Thus, when someone opens the app for the first time in awhile, it takes around 10-20 seconds for the app to receive data from the server. Thus, in order to prevent this, we could move to a different web server provider.
* A professor mentioned that a student who graduated some time ago was coming to visit Dartmouth in April. We were told he had created a startup that was creating an app similar to ours and could approach him to get more feedback on how to better scale our app.
* We would advertise our app onto the Dartmouth Meme Facebook Page to increase the number of users on our app to better find bugs and improve user experience. In addition, we could implement some features users would like to see.

### 4. What would have made this a better experience?
* There was some minor compatibility issue with styling and keyboard in iphone x. We could have adjust the style according to different devices.
* In the notification center, it would be more user-friendly is the user can be directed to other users profile. This functionality only exists in the posts section.

## Authors

- Nicole Chen
- Weijia Tang
- Sophia Jiang
- Edward Camp
- Nina Liu

## Acknowledgments
Thanks Tim for helping us along the way these last two terms!
