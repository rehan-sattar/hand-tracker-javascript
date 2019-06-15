// check the media support

window.navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

// getting the elements

const audio = document.querySelector('#audio');
const video = document.querySelector('#video');
const canvas = document.querySelector('#canvas');
const loader = document.querySelector('#loeader');
// setting up the context for canvas => ( 2d or 3d );
const context = canvas.getContext('2d');

// loading the data model.
let model;

const modelParams = {
  flipHorizontal: true, // flip e.g for video
  imageScaleFactor: 0.7, // reduce input image size for gains in speed.
  maxNumBoxes: 20, // maximum number of boxes to detect
  iouThreshold: 0.5, // ioU threshold for non-max suppression
  scoreThreshold: 0.79 // confidence threshold for predictions.
};

handTrack.load(modelParams).then(loadedModel => {
  model = loadedModel;
  loader.style.display = 'none';
});

// video settelment;

handTrack.startVideo(video).then(status => {
  if (status) {
    navigator.getUserMedia(
      { video: {} },
      stream => {
        video.srcObject = stream;
        detector();
      },
      err => console.log(err)
    );
  }
});

// detector
const detector = () => {
  model.detect(video).then(predictions => {
    console.log(predictions);
    //rendering the predicted model into dom.
    model.renderPredictions(predictions, canvas, context, video);
    if (predictions.length > 0) {
      audio.play();
    }
    requestAnimationFrame(detector);
  });
};
