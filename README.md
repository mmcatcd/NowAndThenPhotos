# SoftwareEngineering16

Now&Then is an Android application and API which supports the process of taking photos from the same location over time.

## What's included in the code bundle?

### Client Application

```
./PhotosProject/
```

Contains the source code for the client application for Android. The
client is written in React Native with Expo. The client allows the user to 
create new scenes of photos.


For information on how to install the client application, please refer to the
Deployment file.

```
./DEPLOY.md
```

### Server Application

```
./RESTapi/
```
Contains the source code for the server application. The application runs an 
Express server that allows for POST and GET requests to generate a video from 
the images in a scene. Currently the server runs at

```
http://api.nowandthen.io/
```

For information on how to run the server on your local machine, please refer to the Deployment file.

### Design

```
./Design/
```

Contains the source for all of the design files used for the project. It
includes the .xd design file created with Adobe XD as well as the UI kit
files we used and image outputs of the individual screen designs.

### APK

```
./nowandthen.apk
```

We've also included an APK file to install the application on Android. More
details about this installation can be found in

```
./DEPLOY.md
```

### Demo

We've included the demo of the app from our final presentation in the repo too
if you want to see how the app works in action

```
./demo.mp4
```
