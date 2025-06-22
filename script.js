let video = document.querySelector(".video-display");
let playButton = document.querySelector(".play-btn");
let muteButton = document.querySelector(".mute-btn");
let speedLabel = document.querySelector(".speed-lbl");
let progressBar = document.querySelector(".progress-bar");

const videoSizes = [
  { width: 256, height: 144 },
  { width: 512, height: 288 },
  { width: 768, height: 432 },
  { width: 1024, height: 576 },
  { width: 1280, height: 720 },
];
let sizeIndex = 2;

video.addEventListener('loadedmetadata', function () {
  progressBar.value = 0;
  progressBar.setAttribute('max', video.duration);
});

video.addEventListener("ended", function () {
  video.currentTime = 0;
  playButton.textContent = 'PLAY';
});

video.addEventListener('timeupdate', function () {
  progressBar.value = video.currentTime;
});

function play() {
  if (video.paused) {
    video.play();
    playButton.textContent = 'PAUSE';
  }
  else {
    video.pause();
    playButton.textContent = 'PLAY';
  }
}

function shiftVideo() {
  video.currentTime = progressBar.value;
}

function mute() {
  video.muted = !video.muted;

  if (video.muted) {
    muteButton.textContent = 'UNMUTE';
  } else {
    muteButton.textContent = 'MUTE';
  }
}

function changeVolume(operation) {
  const currentVolume = Math.floor(video.volume * 10) / 10;

  if (operation === 'decrease' && currentVolume > 0) {
    video.volume -= 0.1;
  } else if (operation === 'increase' && currentVolume < 1) {
    video.volume += 0.1;
  }
}

function changeSpeed(operation) {
  if (operation === 'slower' && video.playbackRate > 0.25) {
    video.playbackRate -= 0.25;
  } else if (operation === 'faster') {
    video.playbackRate += 0.25;
  } else if (operation === 'default') {
    video.playbackRate = 1;
  }

  speedLabel.textContent = `x${video.playbackRate}`;
}

function changeSize(operation) {
  if (operation === 'down' && sizeIndex > 0) {
    sizeIndex -= 1;
  } else if (operation === 'up' && sizeIndex < videoSizes.length - 1) {
    sizeIndex += 1;
  }

  video.width = videoSizes[sizeIndex].width;
  video.height = videoSizes[sizeIndex].height;
}

