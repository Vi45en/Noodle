/******************* server.js ********************
 * 
 *************************************************/

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

var visualRecognition = new VisualRecognitionV3({
  version: '2018-03-19', 
  iam_apikey: '0o2QcHHy16qsiSch0M3ylgSjbsEiT3PiDA3qJeWmlUFR'
});

var fs = require('fs');
const sharp = require('sharp');
var index = 0;

// HTTP Portion
var http = require('http');
var url = require('url');
var path = require('path');
var Results = "";

var server = http.createServer(handleRequest);
server.listen(8080);

console.log('Server started on port 8080');

function handleRequest(req, res) {
  // What did we request?
  var pathname = req.url;

  // If blank let's ask for index.html
  if (pathname == '/') {
    pathname = '/index.html';
  }

  var ext = path.extname(pathname);

  // Map extension to file type
  var typeExt = {
    '.html': 'text/html',
    '.js':   'text/javascript',
    '.css':  'text/css'
  };

  // What is it?  Default to plain text
  var contentType = typeExt[ext] || 'text/plain';

  // User file system module
  fs.readFile(__dirname + pathname,
    // Callback function for reading
    function (err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200,{ 'Content-Type': contentType });
      res.end(data);
    }
  );
}

const WebSocket = require('ws');

const server1 = new WebSocket.Server({ server:server });

server1.on('connection', socket => {


 // socket.send('Hello world!');

 socket.addEventListener('message', event => {
  //console.log(`Message from client: ${event.data}`)

  if (`${event.data}`==='class')
  {
    visualRecognition.listClassifiers({
    verbose: true
    },
    function(err, response) {
      if (err) {
        console.log(err);
      } else {
        console.log(response);
        socket.send(JSON.stringify(response, null, 2));

      }
    });
  }
  else
    base64ToPNG(`${event.data}`, socket);

});

});

// socket.addEventListener('message', event => {
//   console.log(`Message from client: ${event.data}`)
// });

function base64ToPNG(data, socket) {

  data = data.replace(/^data:image\/png;base64,/, '');

  fs.writeFileSync(path.resolve(__dirname, 'doodle.PNG'), data, 'base64', function(err) {
    if (err) throw err;
  });


  //sleep(1000);
var images_file= fs.createReadStream(path.resolve(__dirname, 'doodle.PNG'));



// // Starting preprocessing on the image before seding it to the model for scoring.
// // create an off-screen canvas
// var canvas = document.createElement('canvas'),
// ctx = canvas.getContext('2d');

// // set its dimension to target size
// canvas.width = 32;
// canvas.height = 32;

// // draw source image into the off-screen canvas:
// ctx.drawImage(images_file, 0, 0, 32, 32);

// // encode image to data-uri with base64 version of compressed image
// data = canvas.toDataURL();

// data = data.replace(/^data:image\/png;base64,/, '');

//   fs.writeFileSync(path.resolve(__dirname, 'modified_doodle.PNG'), data, 'base64', function(err) {
//     if (err) throw err;
//   });


//   //sleep(1000);
// var modified_images_file= fs.createReadStream(path.resolve(__dirname, 'modified_doodle.PNG'));

//****************** */

var owners = ["me"];
var threshold = 0.8;

var params = {
  images_file: images_file,
  owners: owners,
  threshold: threshold
};

visualRecognition.classify(params, function(err, response) {
  if (err)
  {
  	console.log(err);

	//console.log(params);
  }
  else
  {
    //console.log(JSON.stringify(response, null, 2))
    //console.log(params);

    var JSON_obj = JSON.parse(JSON.stringify(response, null, 2));

    if (JSON_obj.images[0].classifiers[0].classes.length > 0)
    {
	    console.log("Class: -->" + JSON_obj.images[0].classifiers[0].classes[0].class);
	    Results = JSON_obj.images[0].classifiers[0].classes[0].class;
    }
    else
	{
		console.log("Was unable to identify the doodle. You lose! ");
		Results = "0";

	}

	console.log("sending data ...");
	socket.send(Results);
}
index++;
});

}


module.exports = base64ToPNG;
