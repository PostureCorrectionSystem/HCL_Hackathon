var video = document.getElementById("video");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
let threshold = 0;
let shoulderThreshold = 0;
let currentAngle = 0;
let poses = [];
let key = false;
const Database1 = firebase.database();
const ref1 = Database1.ref("/Callibration");
const ref2 = Database1.ref("/Right/Pitch/Pitch");

const ref3 = Database1.ref("/Right/Status");

// The detected positions will be inside an array

// Create a webcam capture
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
    video.srcObject = stream;
    video.play();
  });
}

function drawCameraIntoCanvas() {
  ctx.drawImage(video, 0, 0, 640, 480);

  window.requestAnimationFrame(drawCameraIntoCanvas);
}

drawCameraIntoCanvas();

const poseNet = ml5.poseNet(video, modelReady);
poseNet.on("pose", (results) => {
  poses = results;
});

function modelReady() {
  console.log("model ready");
}

function show() {
  ref3.once("value").then(function (snapshot) {
    console.log(snapshot.val(), typeof snapshot.val());
  });

  console.log("Received ref3 value");
}
function callibrate() {
  poseNet.singlePose(video);
  threshold = getNoseAngle();
  console.log(threshold);
  ref1.set({ Value: threshold });
  console.log("Pushed to firebase");
  poses = [];
  // console.log(poses)
}

function getDistance(position_1, position_2) {
  return Math.sqrt(
    Math.pow(position_2.x - position_1.x, 2) +
      Math.pow(position_2.y - position_1.y, 2)
  );
}

function toDegrees(angle) {
  return (angle * 180) / Math.PI;
}

function getAngle(a, b, c) {
  let num = Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2);
  let den = 2 * a * b;
  return toDegrees(Math.acos(num / den));
}

function getNoseAngle() {
  let NLS = getDistance(
    poses[0]["pose"]["keypoints"][0]["position"],
    poses[0]["pose"]["keypoints"][5]["position"]
  ); // nose to left shoulder
  let NRS = getDistance(
    poses[0]["pose"]["keypoints"][0]["position"],
    poses[0]["pose"]["keypoints"][6]["position"]
  ); // nose to right shoulder
  let SD = getDistance(
    poses[0]["pose"]["keypoints"][5]["position"],
    poses[0]["pose"]["keypoints"][6]["position"]
  ); // distance between shoulders
  let l = getAngle(NLS, NRS, SD);

  return l;
}

function run() {
  poseNet.on("pose", (results) => {
    poses = results;
  });
  window.setInterval(() => {
    ref3.once("value").then(function (snapshot) {
      currentAngle = getNoseAngle();
      console.log(snapshot.val(), currentAngle);
      if (Math.abs(currentAngle - threshold) > 10 || snapshot.val() == "NO") {
        console.log("Sit properly");
        Push.create("Sit Properly!", {
          body: "PCS web notification!",
          timeout: 2000,
        });
      } else {
        console.log("Okay");
      }
    });
  }, 3000);
}

function Stop() {
  window.clearInterval();
}
