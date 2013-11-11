function createLoop(video, timeIn, timeOut) {
  var debug;
  var enableDebug = function() {
    debug = document.getElementById("loopdebug");
    video.controls = true;
  };

  video.controls = video.loop = false;
  video.volume = 1.0;

  if (location.hash.substr(1).toLowerCase() == "debug") {
    enableDebug();
  }

  var markers = [timeIn, timeOut];

  video.addEventListener("click", function() {
    e.preventDefault();
    video[video.paused ? "play" : "pause"]();
  }, false);

  video.addEventListener("error", function() {
    if (video.error.code < 2) {
      return;
    }
    alert("Whoops, "+(["a network error", "a decoding fault", "your browser is doodoo"])[video.error.code-2]);
  }, false);

  var checkMarkers = function() {
    if (debug) {
      debug.innerHTML = [video.currentTime, markers.join(","), video.src.split("/").splice(-1)[0], video.paused].join("<br/>");
    }
  };

  var worker = new Worker("./worker.js");
  worker.onmessage = function(e) {
    if (e.data == "tick") {
      checkMarkers();
    }
  };

  video.play();
};
