const videoSizes = [
  { width: 256, height: 144 },
  { width: 512, height: 288 },
  { width: 768, height: 432 },
  { width: 1024, height: 576 },
];
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
    subtitle: "",
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

// VIDEO PLAYER CONFIGURATION
let sizeIndex = 2;
let videoId = "the-less-i-know";
let speed = 1;
let volume = 0.5;
let trackMode = "disabled";
let muted = false;
// ----------

let videoContainer = document.querySelector(".video-container");

let progressBar = document.querySelector(".progress-bar");
let playButtonIcon = document.querySelector(".play-btn .icon");
let muteButtonIcon = document.querySelector(".mute-btn .icon");
let volumeLabel = document.querySelector(".volume-lbl");
let speedLabel = document.querySelector(".speed-lbl");
let subtitlesButton = document.querySelector(".subtitles-btn");
let subtitlesButtonIcon = document.querySelector(".subtitles-btn .icon");

let modal = document.querySelector(".capture-modal");
let canvas = document.querySelector(".photo-canvas");

let video = null;

function createVideoPlayer() {
  video = document.createElement("video");
  video.className = "video-display";
  video.width = videoSizes[sizeIndex].width;
  video.height = videoSizes[sizeIndex].height;
  video.disablePictureInPicture = true;
  video.playbackRate = speed;
  video.volume = volume;
  video.muted = muted;

  video.addEventListener("loadedmetadata", function () {
    progressBar.value = 0;
    progressBar.setAttribute("max", video.duration);
  });

  video.addEventListener("ended", function () {
    video.currentTime = 0;
    playButtonIcon.classList.remove("icon-pause");
    playButtonIcon.classList.add("icon-play");
  });

  video.addEventListener("timeupdate", function () {
    progressBar.value = video.currentTime;
  });

  const newVideo = videos.find((item) => item.id === videoId);

  const source = document.createElement("source");
  source.src = `./videos/${newVideo.file}`;
  source.type = "video/mp4";
  video.appendChild(source);

  const track = document.createElement("track");

  if (newVideo.subtitle) {
    track.src = `./videos/${newVideo.subtitle}`;
    track.srclang = "en";
    track.classList = "subtitles";

    subtitlesButton.removeAttribute("disabled");
    if (trackMode === "showing") {
      enableSubtitles(track.track);
    } else if (trackMode === "hidden") {
      hideSubtitles(track.track);
    }
  } else {
    disableSubtitles(track.track);
  }

  video.appendChild(track);

  videoContainer.append(video);

  video.muted ? showMuteIcon() : showUnmuteIcon();
  volumeLabel.textContent = `Volume: ${video.volume.toFixed(2)}`;
  speedLabel.textContent = `Speed: x${video.playbackRate}`;
}

function playNewVideo(newVideoId) {
  pauseVideo();

  videoId = newVideoId;
  videoContainer.innerHTML = "";
  createVideoPlayer();

  playVideo();
}

function play() {
  if (video.paused) {
    playVideo();
  } else {
    pauseVideo();
  }
}

function playVideo() {
  playButtonIcon.classList.remove("icon-play");
  playButtonIcon.classList.add("icon-pause");

  video.play();
}

function pauseVideo() {
  playButtonIcon.classList.remove("icon-pause");
  playButtonIcon.classList.add("icon-play");

  video.pause();
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
    showMuteIcon();
  } else {
    showUnmuteIcon();
  }

  muted = video.muted;
}

function showUnmuteIcon() {
  muteButtonIcon.classList.remove("icon-mute");
  muteButtonIcon.classList.add("icon-dont-mute");
}

function showMuteIcon() {
  muteButtonIcon.classList.remove("icon-dont-mute");
  muteButtonIcon.classList.add("icon-mute");
}

function changeVolume(operation) {
  const currentVolume = Math.floor(video.volume * 10) / 10;

  if (operation === "decrease" && currentVolume > 0) {
    video.volume -= 0.1;
  } else if (operation === "increase" && currentVolume < 1) {
    video.volume += 0.1;
  }

  volume = video.volume;
  volumeLabel.textContent = `Volume: ${video.volume.toFixed(2)}`;
}

function changeSpeed(operation) {
  if (operation === "slower" && video.playbackRate > 0.25) {
    video.playbackRate -= 0.25;
  } else if (operation === "faster") {
    video.playbackRate += 0.25;
  } else if (operation === "default") {
    video.playbackRate = 1;
  }

  speed = video.playbackRate;
  speedLabel.textContent = `Speed: x${video.playbackRate}`;
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

  if (track.mode === "disabled" || track.mode === "hidden") {
    enableSubtitles(track);
  } else if (track.mode === "showing") {
    hideSubtitles(track);
  }

  trackMode = track.mode;
}

function enableSubtitles(track) {
  track.mode = "showing";

  subtitlesButtonIcon.classList.remove("icon-subtitles");
  subtitlesButtonIcon.classList.add("icon-no-subtitles");
}

function hideSubtitles(track) {
  track.mode = "hidden";
  subtitlesIconShow();
}

function disableSubtitles(track) {
  track.mode = "disabled";
  subtitlesIconShow();
  subtitlesButton.setAttribute("disabled", "true");
  trackMode = track.mode;
}

function subtitlesIconShow() {
  subtitlesButtonIcon.classList.remove("icon-no-subtitles");
  subtitlesButtonIcon.classList.add("icon-subtitles");
}

function takePicture() {
  pauseVideo();

  const context = canvas.getContext("2d");
  canvas.width = video.width;
  canvas.height = video.height;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  modal.style.visibility = "visible";
}

async function downloadCanvas(el) {
  const imageURI = canvas.toDataURL("image/png");
  el.download = `${Date.now()}`;
  el.href = imageURI;
}

function closeModal() {
  modal.style.visibility = "hidden";
}
