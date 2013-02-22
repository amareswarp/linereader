var fs = require("fs"), util = require("util"), events = require("events"); DEFAULT_DELIMITER =","; 
fs.exists = fs.exists || require('path').exists;

function LineReader(fileName) {
      events.EventEmitter.call(this);
      this.file= fileName, this.currentBuf= '',this.streamEnd=false;
}

util.inherits(LineReader,  events.EventEmitter);

LineReader.prototype.readNext = function(callback) {
 callback = callback || function(){};
  if(!this.readStream) {
     if(!this.file) {
       callback("Error: File ["+this.file+"] does not exist!!"); 
       return;
     }
     fs.exists(this.file, function(exists) {
       if(!exists) {
         callback("Error: File ["+this.file+"] does not exist!!"); 
        } else {
         this.readStream = fs.createReadStream(this.file, {bufferSize:1, encoding: "utf8"});
         this.readStream.on("data", function(data) {this.currentBuf += data; if(data.indexOf('\n') != -1){this.readStream.emit('readLine');}}.bind(this)) 
         .on("readMore", function(){if(this.hasMoreLines()) {this.readStream.resume();}else {this.readStream.emit('readLine');} }.bind(this))
         .on("end", function() {this.streamEnd = true; this.readStream.emit('readLine');}.bind(this));
         this.readStream.pause();
         readLine.call(this, callback);
        }
     }.bind(this));
  } else {
    readLine.call(this, callback);  
  }
}

LineReader.prototype.hasMoreLines = function() {
 return this.streamEnd != true;
}

function readLine(callback) {
 var idx = this.currentBuf.indexOf('\n');
 if(idx != -1) {
   var returnNewLine = this.currentBuf.substring(0, idx);
   this.currentBuf = this.currentBuf.substring(idx+1, this.currentBuf.length); 
   callback(null, returnNewLine);
 } else {
       this.readStream.emit("readMore")
       this.readStream.once('readLine', function() {
            this.readStream.pause();
            readLine.call(this, callback);
        }.bind(this));      
    }
}

exports.LineReader = LineReader;
