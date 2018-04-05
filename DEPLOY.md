# Now&Then Deployment

This file contains details pertaining to installing the code bundle on your own
machine.

## Client Installation

The first method to install the client application is to install

```
./nowandthen.apk
```

onto an Android device. You can do so by downloading the APK onto an Android
phone. If you do not not have an Android device you can install the [Android SDK and Emulator](https://developer.android.com/studio/install.html). You can
then add the application to the Android Emulator by navigating to __platform-
tools__ in the __android-sdk__ directory and running:

```
./adb install /apkDirectory/nowandthen.apk
```

Alternatively you can run the application from the source as a React Native
application in Expo by following the [Getting Started](https://facebook.github.io/react-native/docs/getting-started.html) guide for installing
_create-react-native-app_. Then navigate to

```
./PhotosProject
```
Install all dependencies with

```
npm install
```
and run the application
```
npm start
```
You can then run the application by installing the Expo App for Android or iOS
and scanning the QR generated for the app on your device.


Alternatively you can also run the app in an Emulator.

## Server Installation

The server is already live over at 
[api.nowandthen.io](http://api.nowandthen.io/), but if you want to run it
locally you can do so by [installing node.js], navigating to

```
./RESTapi
```
and running the following
```
sudo npm start
```
to run the application, or to run as a daemon
```
sudo forever start server.js
```

Sudo may be required as the application is run on port 80 and most operating
systems require roots privilages to run on port 80.

## Demo

We've included the demo of the app from our final presentation in the repo too
if you want to see how the app works in action

```
./demo.mp4
```
