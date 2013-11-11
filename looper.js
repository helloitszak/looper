function createLoop(video, timeIn, timeOut) {
  var debug;
  var enableDebug = function() {
    debug = document.getElementById("loopdebug");
    console.log("DEBUGGING!");
    debug.style.visibility = "visible";
    video.controls = true;
  };

  video.controls = video.loop = false;
  video.volume = 1.0;

  if (location.hash.substr(1).toLowerCase() == "debug") {
    if (window.mozInnerScreenY === undefined) {
      enableDebug();
    } else { 
      alert("Debugging not supported on Firefox. It likes to eat up CPU.");
    }
  }

  var markers = [timeIn, timeOut];

  video.addEventListener("click", function(e) {
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
    if (video.currentTime >= markers[1]) {
      video.currentTime = markers[0];
    }
  };

 var worker = new Worker("looper/worker.js");
  worker.onmessage = function(e) {
   if (e.data == "tick") {
     checkMarkers();
   }
 };
 //worker.postMessage();


  video.play();
};
