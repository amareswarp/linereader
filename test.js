var LineReader = require("./linereader").LineReader;
var reader = new LineReader(process.argv[2]);
var i=1;
(function readNext() {
 reader.readNext(function(err, data){
  console.log(data +" "+i++);
  if(reader.hasMoreLines()) {
    readNext();
   }
 });
})();
