# Now&Then RESTful API

The Now&Then RESTful API is used to process and create a video from the images in a scene.
It is built with Node.js and uses Hugin, an image stitching library and FFMPEG.

## Installation

```
$ npm install
```

## Usage

To start the server

```
$ npm start
```

The server can also be run in the background as a service using forever

```
$ forever start server.js
```
