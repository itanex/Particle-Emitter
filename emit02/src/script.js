function startButton(obj) {
  myTimer.timer();
  emitter.emit('emitter');
  obj.style.display = 'none';
  //document.getElementById('generate').style.display = 'block';
}

var myTimer = {
  elm: document.getElementById('myClock'),
  elapse: 0,
  TOMgr: null,
  timer: function() {
    this.elapse++;
    var remainder = 0;

    h = Math.floor(this.elapse / 3600);
    m = Math.floor((this.elapse - (h * 3600)) / 60);
    s = (this.elapse - (h * 3600)) - (m * 60);

    this.elm.innerHTML = h + ':' + ((m < 10) ? '0' + m : m) + ':' + ((s < 10) ? '0' + s : s) + '';
    this.TOMgr = setTimeout('myTimer.timer()', 1000);
  }

}
/*
var boundery =
{
    top     : 50,
    left    : 50,
    right   : 450,
    bottom  : 450
}
*/
var pSource = function() {
  var myStage = document.getElementById('stage');
  var fps = 30;
  var spnCount = 0;
  var curID = 0;
  var x = 200 + parseInt(myStage.style.marginLeft);
  var y = 400 + parseInt(myStage.style.marginTop);

  this.emitRate = 30;
  this.liveLimit = 60;

  this.timeRate = Math.floor(1000 / fps);
  this.speedAdj = fps / 1000;
  this.tmEvent = null;

  this.particles = new Array();

  this.emit = function(objName) {
    this.spawn();
    this.tmEvent = setTimeout(objName + '.emit(\'' + objName + '\')', Math.floor(1000 / this.emitRate));
  };

  var updSpnCnt = function(val) {
    spnCount = spnCount + val;
    document.getElementById('particleCnt').innerHTML = spnCount;
  };

  this.spawn = function() {
    if (spnCount < this.liveLimit) {
      this.particles.push(new particle(curID, x, y));
      this.particles[curID].renderPrtcl(myStage);
      moveParticle(curID);

      curID++;
      updSpnCnt(1);
      document.getElementById('created').innerHTML = curID;
    }
  };
  this.kill = function(id) {
    myStage.removeChild(this.particles[id].elm);
    clearTimeout(this.particles[id].moveTmr);
    this.particles[id] = null;
    updSpnCnt(-1);

    this.spawn();
  };
}

var particle = function(id, x, y) {
  //private members
  var minS = 8;
  var maxS = 8;
  var color = myRand(0, 255 * 255 * 255);
  var clrFade = Math.floor(myRand(255, 4098));
  var width = 4;
  var height = 4;
  var id = id;

  var boundery = {
    top: 50,
    left: 50,
    right: 450,
    bottom: 450
  }

  //public members
  this.elm = null;
  this.moveTmr = null;

  this.tRes = 5;
  this.x = x - Math.floor(width / 2);
  this.y = y - Math.floor(width / 2);

  this.xspeed = myRand(minS, maxS);
  this.yspeed = myRand(minS, maxS);


  //private methods
  var calcResist = function() {
    var weight = 0.5;
    var friction = 0.1;
    var gravity = friction / weight;
    var accl = 0.1;

    return Math.floor((gravity * -1) + accl);
  };

  this.deltaY = function() {
    this.y = this.y - this.yspeed + calcResist();
  };

  this.deltaX = function() {
    this.xspeed = (this.xspeed + calcResist()) * -1;
    this.x = this.x + Math.floor(this.xspeed * Math.random());
  };


  this.checkOutOfBounds = function(spawner) {
    if (this.y - this.yspeed >= boundery.top &&
      this.y - this.yspeed <= boundery.bottom &&
      this.x - this.xspeed >= boundery.left &&
      this.x - this.xspeed <= boundery.right) {
      this.deltaY();
      this.deltaX();

      this.updtElmClr();
      this.moveElm();
      this.moveTmr = setTimeout('moveParticle(' + id + ')', spawner.timeRate);
    } else {
      spawner.kill(id);
    }
  }

  //public methods
  this.updtElmClr = function() {
    if (color - clrFade > 0) {
      color = color - clrFade;

      var strColor = Number(color).toString(16);

      while (strColor.length < 6) {
        strColor = '0' + strColor;
      }
      strColor = '#' + strColor;

      //document.getElementById('partColor').innerHTML = strColor;

      this.elm.style.backgroundColor = strColor;
    }
  };

  this.renderPrtcl = function(myStage) {
    var newElm = document.createElement('img');
    newElm.id = 'pt' + id;
    //newElm.src = 'spacer.gif';
    newElm.width = width + 'px';
    newElm.height = height + 'px';

    newElm.style.position = 'absolute';
    newElm.style.border = '0px';
    newElm.style.left = this.x;
    newElm.style.top = this.y;
    newElm.style.width = width + 'px';
    newElm.style.height = height + 'px';

    myStage.appendChild(newElm);
    this.elm = document.getElementById(newElm.id);

    newElm.style.backgroundColor = this.updtElmClr();
  };

  this.moveElm = function() {
    this.elm.style.top = this.y;
    this.elm.style.left = this.x;

    //document.getElementById('partX').innerHTML = this.x;
    //document.getElementById('partY').innerHTML = this.y;
  };
}

function moveParticle(id) {
  emitter.particles[id].checkOutOfBounds(emitter);
}

function myRand(x, y) {
  var low = (x > y) ? y : x;
  var high = (low != y) ? y : x;

  return Math.floor(Math.abs(Math.random() * (Math.abs(high) - Math.abs(low)) + low));
}

var emitter = new pSource();
/*

myPart = new particle();
myPart.renderPrtcl();

emitter.spawn();

*/
