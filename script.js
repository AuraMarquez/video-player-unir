let videoContainer = document.querySelector(".video-container");
let playButton = document.querySelector(".play-btn");
let muteButton = document.querySelector(".mute-btn");
let speedLabel = document.querySelector(".speed-lbl");
let progressBar = document.querySelector(".progress-bar");

let canvas = document.querySelector(".photo-canvas");
let photo = document.querySelector("#photo");

let video = null;

const videos = [
  {
    id: "i-dont-love-you",
    file: "IDontLoveYou_MyChemicalRomance.mp4",
    subtitle: "",
  },
  {
    id: "taste",
    file: "Taste_SabrinaCarpenter.mp4",
    subtitle: "Taste_SabrinaCarpenter.vtt",
  },
  {
    id: "tear-you-apart",
    file: "TearYouApart_SheWantsRevenge.mp4",
    subtitle: "TearYouApart_SheWantsRevenge.vtt",
  },
  {
    id: "the-less-i-know",
    file: "TheLessIKnowTheBetter_TameImpala.mp4",
    subtitle: "TheLessIKnowTheBetter_TameImpala.vtt",
  },
  {
    id: "you-know-im",
    file: "YouKnowImNoGood_AmyWinehouse.mp4",
    subtitle: "YouKnowImNoGood_AmyWinehouse.vtt",
  },
];

const videoSizes = [
  { width: 256, height: 144 },
  { width: 512, height: 288 },
  { width: 768, height: 432 },
  { width: 1024, height: 576 },
  // { width: 1280, height: 720 },
];
let sizeIndex = 2;
let videoId = "the-less-i-know";
let showSubtitles = false;

// window.addEventListener("load", (event) => {
//   let trackElem = document.querySelector("track");
//   let track = trackElem.track;

//   track.mode = "showing";

//   for (const cue of track.cues) {
//     cue.pauseOnExit = true;
//   }
// });

function createVideoPlayer() {
  video = document.createElement("video");
  video.className = "video-display";
  video.width = videoSizes[sizeIndex].width;
  video.height = videoSizes[sizeIndex].height;

  video.addEventListener("loadedmetadata", function () {
    progressBar.value = 0;
    progressBar.setAttribute("max", video.duration);
  });

  video.addEventListener("ended", function () {
    video.currentTime = 0;
    playButton.textContent = "PLAY";
  });

  video.addEventListener("timeupdate", function () {
    progressBar.value = video.currentTime;
  });

  const newVideo = videos.find((item) => item.id === videoId);

  const source = document.createElement("source");
  source.src = `./videos/${newVideo.file}`;
  source.type = "video/mp4";
  video.appendChild(source);

  if (newVideo.subtitle) {
    const track = document.createElement("track");
    track.src = `./videos/${newVideo.subtitle}`;
    track.srclang = "en";
    track.classList = "subtitles";
    video.appendChild(track);
  }

  videoContainer.append(video);
}

function playVideo(newVideoId) {
  video.pause();

  videoId = newVideoId;
  videoContainer.innerHTML = "";
  createVideoPlayer();

  video.play();
  playButton.textContent = "PAUSE";

  // let subtitules = document.querySelector(".subtitles");
  // let track = subtitules.track;
  // console.log(track.mode);

  // console.log(track.mode);
}

function play() {
  if (video.paused) {
    video.play();
    playButton.textContent = "PAUSE";
  } else {
    video.pause();
    playButton.textContent = "PLAY";
  }
}

function shiftVideo() {
  video.currentTime = progressBar.value;
}

function changeVideo(operation) {
  let videoIndex = videos.findIndex((item) => item.id === videoId);

  if (operation === "previous" && videoIndex > 0) {
    videoIndex -= 1;
  } else if (operation === "next" && videoIndex < videos.length - 1) {
    videoIndex += 1;
  } else {
    return;
  }

  playVideo(videos[videoIndex].id);
}

function mute() {
  video.muted = !video.muted;

  if (video.muted) {
    muteButton.textContent = "UNMUTE";
  } else {
    muteButton.textContent = "MUTE";
  }
}

function changeVolume(operation) {
  const currentVolume = Math.floor(video.volume * 10) / 10;

  if (operation === "decrease" && currentVolume > 0) {
    video.volume -= 0.1;
  } else if (operation === "increase" && currentVolume < 1) {
    video.volume += 0.1;
  }
}

function changeSpeed(operation) {
  if (operation === "slower" && video.playbackRate > 0.25) {
    video.playbackRate -= 0.25;
  } else if (operation === "faster") {
    video.playbackRate += 0.25;
  } else if (operation === "default") {
    video.playbackRate = 1;
  }

  speedLabel.textContent = `x${video.playbackRate}`;
}

function changeSize(operation) {
  if (operation === "down" && sizeIndex > 0) {
    sizeIndex -= 1;
  } else if (operation === "up" && sizeIndex < videoSizes.length - 1) {
    sizeIndex += 1;
  }

  video.width = videoSizes[sizeIndex].width;
  video.height = videoSizes[sizeIndex].height;
}

function toogleSubtitles() {
  let subtitules = document.querySelector(".subtitles");
  let track = subtitules.track;

  showSubtitles = !showSubtitles;

  if (showSubtitles) {
    track.mode = "showing";
  } else {
    track.mode = "hidden";
  }
}

function takePicture() {
  const context = canvas.getContext("2d");

  // if (width && height) {
  canvas.width = video.width;
  canvas.height = video.height;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  // window.open(canvas.toDataURL("image/png"));

  // const data = canvas.toDataURL("image/png");
  // photo.setAttribute("src", data);
  // } else {
  //   clearPhoto();
  // }
}

async function downloadCanvas(el) {
  const imageURI = canvas.toDataURL("image/jpg");
  el.href = imageURI;
};
