const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const exec = require('child_process').exec;

var videoOptions = {
  fps: 25,
  loop: 5, // seconds
  transition: true,
  transitionDuration: 1, // seconds
  videoBitrate: 1024,
  videoCodec: 'libx264',
  size: '640x?',
  format: 'mp4',
  pixelFormat: 'yuv420p'
}

/**
 * Configuring how images are stored
 * Images are stored in the application folder like so:
 * ./uploads/sceneId/image.jpg
 */
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = './scenes/' + req.params.sceneId;
    if(!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    cb(null, dir);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

//allowing jpg's only
const fileFilter = (req, file, cb) => {
  // reject a file if it's not jpeg or if it already exists
  if (file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'image upload'
  });
});

//Create new images directory and create video
router.post('/create/:sceneId', upload.any(), (req, res, next) => {
  const sceneId = req.params.sceneId;
  const dir = './scenes/' + sceneId;
  const time = req.body.time;
  const images = [];

  fs.readdirSync(dir).forEach(file => {
    images.push('./scenes/' + sceneId + '/' + file);
  });
  
  const vidDir = './scenes/' + sceneId + '/video.mp4';

  const cmd = `ffmpeg -r 1/2 -pattern_type glob -i 'scenes/` 
  + sceneId + `/*.jpeg' -filter:v scale=-2:1080 -c:v libx264 -y -pix_fmt yuv420p scenes/` 
  + sceneId + `/video.mp4`;

  exec(cmd, function(err, stdout, stderr) {
    console.log(stdout);

    res.status(201).json({
      message: 'Video created',
      url: '/scenes/' + sceneId + '/video.mp4'
    });
  });
});

//Get list of files in scene folder
router.get('/:sceneId', (req, res, next) => {
  const sceneId = req.params.sceneId;
  const dir = './scenes/' + sceneId;
  const images = [];

  if(fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      images.push(file);
    });

    res.status(200).json({
      message: 'Directory exists',
      images: images
    });
  } else {
    res.status(404).json({
      message: 'No directory for that scene exists'
    });
  }
});

//Delete scene
router.post('/delete/:sceneId', (req, res, next) => {
  const sceneId = req.params.sceneId;
  const dir = './scenes/' + sceneId;

  const cmd = 'rm -rf scenes/' + sceneId;

  if(fs.existsSync(dir)) {
    exec(cmd, null);

    res.status(201).json({
      message: 'Deleted sceneId:' + sceneId + ' folder!'
    });
  } else {
    res.status(404).json({
      message: 'Scene not found'
    });
  }
});

module.exports = router;
