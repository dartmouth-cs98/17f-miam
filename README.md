
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
![Feed](readmeGifs/gif1.gif)

#### MiAM Editor:
![Editor](readmeGifs/gif2.gif)

#### MiAM Meme Battle:
![Meme Battle](readmeGifs/gif3.gif)

#### MiAM Meme Remixing:
![Meme Remixing](readmeGifs/gif4.gif)

## Authors

- Nicole Chen
- Weijia Tang
- Sophia Jiang
- Edward Camp
- Nina Liu

## Acknowledgments
Thanks Tim for helping us along the way these last two terms!
