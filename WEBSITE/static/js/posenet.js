var video = document.getElementById("video");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

/**
 * initial thresholds; Global variables so do not modify or change
 */
let threshold = 0;
let shoulderThreshold = 0;
let currentAngle = 0;
let poses = [];
let key = false;
let mainInterval;

/**
 * firebase references to access the database
 */
const Database1 = firebase.database();
const ref1 = Database1.ref("/Callibration_Face");
const ref2 = Database1.ref("/Right/Pitch/Pitch");
const ref3 = Database1.ref("/Right/Status");
const ref4 = Database1.ref("/Calibration")
const ref5 = Database1.ref("/Hunch")
const ref6 = Database1.ref("/PastData")

/**
 * Camera setup. Need to add option to use product by switching off camera(Using camera but not displaying person)
 */
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
    video.srcObject = stream;
    video.play();
  });
}
/**
 * Functions to display video feed
 */
function drawCameraIntoCanvas() {
  ctx.drawImage(video, 0, 0, 640, 480);

  // window.requestAnimationFrame(drawCameraIntoCanvas);
}

drawCameraIntoCanvas();

/**
 * Loading of posenet model
 */
const poseNet = ml5.poseNet(video, modelReady);
poseNet.on("pose", (results) => {
  poses = results;
});

function modelReady() {
  //add code to enable buttons to use product
  let buttons = document.querySelectorAll("button");
  // console.log(button)
  buttons.forEach((button)=>{
    button.disabled = false;
  })
}

/**
 * "Function" to debug product
 */
function show() {
  ref3.once("value").then(function (snapshot) {
    console.log(snapshot.val(), typeof snapshot.val());
  });

  console.log("Received ref3 value");
}

/**
 * Function to callibrate the facial seating angle.
 * Need to add the sensor callibration as well. Make changes here for sensor callibration
 */
function callibrate() {
  ref4.set({Value:"YES"})
  poseNet.singlePose(video);
  threshold = getNoseAngle();
  console.log(threshold);
  ref1.set({ Value: threshold });
  console.log("Pushed to firebase");
  poses = [];
  setTimeout(()=>{ref4.set({Value:"NULL"})},1000);
}

/**
 * Helper functions to process angle and distance between nose and shoulders. Need to add error handling
 * getDistance,toDegrees,getAngle,getNoseAngle
 */

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

  try{
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
  catch(err){
    console.log("Unable to detect face");  
    Push.create("Face not found", {
      body: "Please sit in callibrated position",
      timeout: 2000,
    });
    return threshold+11;
  }
  
}

/**
 * Main driver function which checks for seating posture and shoulder status from firebase
 * and displays the notification
 */

function run() {

  poseNet.on("pose", (results) => {
    poses = results;
  });
  mainInterval = setInterval(() => {
    ref3.once("value").then(function (snapshot) {
      currentAngle = getNoseAngle();
      console.log(snapshot.val(), currentAngle);
      if (Math.abs(currentAngle - threshold) > 10 || snapshot.val() == "NO") {
        var currentTime = new Date();
        var Data1 = {
          Time: String(currentTime),
          Posture: "YES"
        }
        console.log("Sit properly");
        ref5.set({test:"YES"})
        ref6.push(Data1)
        Push.create("Sit Properly!", {
          body: "PCS web notification!",
          timeout: 2000,
        });
      } else {
        var currentTime = new Date();
        var Data2 = {
          Time: String(currentTime),
          Posture: "NO"
        }
        ref5.set({test:"NO"})
        ref6.push(Data2)
        console.log("Okay");
      }
    });
  }, 3000);
}

function Stop() {
  // poseNet.removeEventListener("on");
  poseNet.on("pose",(results)=>{}); //dummy function; "pose" events will listen but not do anything
  
}
