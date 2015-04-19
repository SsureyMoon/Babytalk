
/*var tessel = require('tessel');
var fs = require('fs');
var audio = require('audio-vs1053b').use(tessel.port['B']);


var audioFile = 'sounds/sample2.mp3';


audio.on('ready', function() {
  console.log("Audio module connected! Setting volume...");
  // Set the volume in decibels. Around .8 is good; 80% max volume or -25db
  audio.setVolume(.8, function(err) {
    if (err) {
      return console.log(err);
    }
    // Get the song
    console.log('Retrieving file...');
    var song = fs.readFileSync(audioFile);
    // Play the song
    console.log('Playing ' + audioFile + '...');
    audio.play(song, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Done playing', audioFile);
      }
    });
  });
});

audio.on('error', function(err) {
  console.log(err);
});

*/

var http = require('http');
var statusCode = 200;
var count = 1;
var isOk = true;
var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']);
var fs = require('fs');

/*var network = 'pubnub-g'; // put in your network name here
var pass = 'pubnub.com';


var security = 'wpa2'; // other options are 'wep', 'wpa', or 'unsecured'
var timeouts = 0;

connect();

function connect(){
  wifi.connect({
    security: security
    , ssid: network
    , password: pass
    , timeout: 20 // in seconds
  });
}

wifi.on('connect', function(data){
  // you're connected
  console.log("connect emitted", data);

});

wifi.on('disconnect', function(data){
  // wifi dropped, probably want to call connect() again
  console.log("disconnect emitted", data);
})

wifi.on('timeout', function(err){
  // tried to connect but couldn't, retry
  console.log("timeout emitted");
  timeouts++;
  if (timeouts > 2) {
    // reset the wifi chip if we've timed out too many times
    powerCycle();
  } else {
    // try to reconnect
    connect();
  }
});

wifi.on('error', function(err){
  // one of the following happened
  // 1. tried to disconnect while not connected
  // 2. tried to disconnect while in the middle of trying to connect
  // 3. tried to initialize a connection without first waiting for a timeout or a disconnect
  console.log("error emitted", err);
});

// reset the wifi chip progammatically
function powerCycle(){
  // when the wifi chip resets, it will automatically try to reconnect
  // to the last saved network
  wifi.reset(function(){
    timeouts = 0; // reset timeouts
    console.log("done power cycling");
    // give it some time to auto reconnect
    setTimeout(function(){
      if (!wifi.isConnected()) {
        // try to reconnect
        connect();
      }
      }, 20 *1000); // 20 second wait
  })
}


*/





function audioObj(){

  this.audioisReady = true
  this.song = ""
  this.audioFile=""

  this.audio = require('audio-vs1053b').use(tessel.port['B']);  


  

  this.play = function(sound, flag){
    if(this.audioisReady || flag){
      this.audioisReady = false
      this.audioFile = "sounds/"+sound
      this.song = fs.createReadStream(this.audioFile).pipe(this.audio.createPlayStream());
      console.log('Playing ' + this.audioFile + '...');
    }
    else{
      console.log("wating")
    }
  }
    
}



function actionObj(){
  this.xCounter = 0
  this.yCounter = 0
  this.zCounter = 0
  this.xBeep = ["beepx.mp3", "beepx1.mp3", "beepx2.mp3"]
  this.yBeep = ["beepy.mp3", "beepy1.mp3", "beepy2.mp3"]
  this.zBeep = ["beepz.mp3", "beepz1.mp3", "beepz2.mp3"]

  var inTimeThis = this;

  this.xInc = function(){
    playFun(this.xBeep[this.xCounter%3])
    this.xCounter += 1;
    
  }

  this.yInc = function(){
    playFun(this.yBeep[this.yCounter%3])
    this.yCounter += 1;
    
  }


  this.zInc = function(){
    playFun(this.zBeep[this.zCounter%3])
    this.zCounter += 1;
    
  }

  this.checkAction = function(){
    if(this.xCounter > 4){
      console.log("action X: ", this.xCounter);
      this.xCounter = 0
      playMilk();

    }
    else if(this.yCounter > 4){
      console.log("action Y: ", this.yCounter);
      this.yCounter = 0
      playSugar();
    }
    else if(this.zCounter > 4){
      console.log("action Z: ", this.zCounter);
      this.zCounter = 0
      playPoop();
    }
    else
      console.log("no action");
  }

  this.resetX = function(){
    inTimeThis.xCounter = 0
  }
  this.resetY = function(){
    inTimeThis.yCounter = 0
  }
  this.resetZ = function(){
    inTimeThis.zCounter = 0
  }

}


var action = new actionObj();
var audioAO = new audioObj();


audioAO.audio.on('error', function(err) {
    console.log(err);
  });
  
  audioAO.audio.on('ready', function() {
    audioAO.audio.setVolume(.8, function(err) {
      if (err) {
        return console.log(err);
      }
      // Get the song
      console.log('Ready for action');
      audioAO.audio.setOutput('headphones', function(err) {
        console.log("audio volume");
      });
    });
  });

  audioAO.audio.on('end', function(err) {
    audioAO.audioisReady = true
    return console.log("audio is ready")
  });


accel.availableOutputRates(5)

// Initialize the accelerometer.
accel.on('ready', function () {
  
    // Stream accelerometer data
  accel.on('data', function (xyz) {
    
    if(isX(xyz)){
      action.xInc();
      
      setTimeout(action.resetX, 3000);  
      action.checkAction();
    }

    if(isY(xyz)){
      action.yInc();
      
      setTimeout(action.resetY, 3000);  
       console.log(action.yCounter)
       action.checkAction();
    }

    if(isZ(xyz)){
      action.zInc();
      
      setTimeout(action.resetZ, 3000);  
      console.log(action.zCounter)
      action.checkAction();
    }
  
  });
  

});


function isX(xyz){
  return Math.abs(parseFloat(xyz[2].toFixed(2))) > 1.25
} 

function isY(xyz){
  return Math.abs(parseFloat(xyz[0].toFixed(2))) > 1.25
} 


function isZ(xyz){
  return Math.abs(parseFloat(xyz[1].toFixed(2))+0.99) > 1.25
}

function sednSMS(message){
  setImmediate(function start () {
    console.log('http request #' + (count++))

    http.get("http://justdoit.attojs.com/babytalk/babyaction.php?m=" + message, function (res) {
      console.log('# statusCode', res.statusCode)
    });
  })
}




function playFun(sound){
  return audioAO.play(sound, false)
}


function playMilk(){
  //justdoit.attojs.com/babytalk/babyaction.php?m=hug
  /*accel.enableDataInterrupts(false, function(err_den){
    if(err_den)
      console.log(err_den)
    else
      console.log("acc dis enabled")

    var audioFile = 'sounds/milk.mp3';
    audio.setOutput('headphones', function(err) {
      var song = fs.createReadStream(audioFile).pipe(audio.createPlayStream());

      console.log('Playing ' + audioFile + '...');

  

    audio.play(song, function(err) {

      accel.enableDataInterrupts(true, function(err_en){
        if(err_en)
          console.log(err_en)
        else
          console.log("acc enabled again")

      })

      if (err) {
        console.log(err);
      } else {
      console.log('Done playing', audioFile);
      }
    })
  })*/


  audioAO.play('milkplease3.mp3', true)
  console.log('Playing ' + "milkplease3" + '...');
  sednSMS("milk%20please")

}



function playPoop(){
  
  /*accel.enableDataInterrupts(false, function(err_den){
    if(err_den)
      console.log(err_den)

    var audioFile = 'sounds/poop.mp3';
    console.log("acc dis enabled")

    var song = fs.readFileSync(audioFile);

    console.log('Playing ' + audioFile + '...');

  

    audio.play(song, function(err) {

      accel.enableDataInterrupts(true, function(err_en){
        console.log("acc enabled again")
      })

      if (err) {
        console.log(err);
      } else {
      console.log('Done playing', audioFile);
      }
    })
  })*/

  audioAO.play('pooped3.mp3', true);

  console.log('Playing ' + "pooped" + '...');
  
  sednSMS("diaper%20please")
}

function playSugar(){
  
  /*accel.enableDataInterrupts(false, function(err_den){
    if(err_den)
      console.log(err_den)

    var audioFile = 'sounds/poop.mp3';
    console.log("acc dis enabled")

    var song = fs.readFileSync(audioFile);

    console.log('Playing ' + audioFile + '...');

  

    audio.play(song, function(err) {

      accel.enableDataInterrupts(true, function(err_en){
        console.log("acc enabled again")
      })

      if (err) {
        console.log(err);
      } else {
      console.log('Done playing', audioFile);
      }
    })
  })*/

  //var audioFile = 'sounds/sugar.mp3';
  
  audioAO.play("sugar.mp3", true)

  console.log('Playing ' + "sugar" + '...');
  
  sednSMS("pretty%20please%20with%20sugar%20on%20top")
}




