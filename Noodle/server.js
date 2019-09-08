/******************* server.js ********************
 * 
 *************************************************/

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

var visualRecognition = new VisualRecognitionV3({
  version: '2018-03-19',
  iam_apikey: 'aiMr7HDH417LDLzlNOqDE8hm-7W4cObl5r273MU6ibT2'
});

var wml_credentials = {
  "apikey": "YYYuSIIxyPmWULlobNXo-AIyD_0L5RtDJYw_82UBsGfn",
  "instance_id": "58111a5e-bde4-4348-9b50-fc005ce10f38"
};

var model_deployment_endpoint_url = "https://eu-gb.ml.cloud.ibm.com/v3/wml_instances/58111a5e-bde4-4348-9b50-fc005ce10f38/deployments/91e1efd4-c278-4787-ade4-b0ff0e61660d/online";

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
    '.js': 'text/javascript',
    '.css': 'text/css'
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
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  );
}

const WebSocket = require('ws');

const server1 = new WebSocket.Server({ server: server });

server1.on('connection', socket => {


  // socket.send('Hello world!');

 socket.addEventListener('message', event => {
  console.log(`Message from client: ${event.data}`)

    if (`${event.data}` === 'class') {
      visualRecognition.listClassifiers({
        verbose: true
      },
        function (err, response) {
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

  fs.writeFileSync(path.resolve(__dirname, 'doodle.PNG'), data, 'base64', function (err) {
    if (err) throw err;
  });

  console.log("File has been created ..." + __dirname + 'doodle.PNG')


  //sleep(1000);
  var images_file = fs.createReadStream(path.resolve(__dirname, 'doodle.PNG'));
  
  
  var classifier_ids = ["DefaultCustomModel_1017241942"];
var threshold = 0.6;

var params = {
	images_file: images_file,
	classifier_ids: classifier_ids,
	threshold: threshold
};


  visualRecognition.classify(params, function (err, response) {
    if (err) {
      console.log(err);

      //console.log(params);
    }
    else {
      //console.log(JSON.stringify(response, null, 2))
      //console.log(params);

      var JSON_obj = JSON.parse(JSON.stringify(response, null, 2));

      if (JSON_obj.images[0].classifiers[0].classes.length > 0) {
        console.log("Class: -->" + JSON_obj.images[0].classifiers[0].classes[0].class);
        Results = JSON_obj.images[0].classifiers[0].classes[0].class;
      }
      else {
        console.log("Was unable to identify the doodle. You lose! ");
        Results = "0";

      }

      console.log("sending data ...");
      socket.send(Results);
    }
    index++;
  });
  
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


  // processdata(model_deployment_endpoint_url, images_file).then(function (result) {
  //   console.log("Result:\n" + JSON.stringify(result, null, 3));
  //   socket.send('processresult', result);

  // }).catch(function (error) {
  //   console.log("Error:\n" + error);
  //   socket.send('processresult', { "error": error });

  // });

}


function processdata( endpoint_url, payload )
{
    return new Promise( function( resolve, reject )
    {
        if( "" == endpoint_url )
        {
            reject( "Endpoint URL not set in 'server.js'" );
        }
        else
        {
            getAuthToken( wml_credentials["apikey"] ).then( function( iam_token )
            {
                sendtodeployment( endpoint_url, iam_token, wml_credentials["instance_id"], payload ).then( function( result )
                {
                    resolve( result );

                } ).catch( function( processing_error )
                {
                    reject( "Send to deployment error: " + processing_error );

                } );

            } ).catch( function( token_error )
            {
                reject( "Generate token: " + token_error );

            } );
        }

    } );    

}


function getAuthToken( apikey )
{
    // Use the IBM Cloud REST API to get an access token
    //
    var IBM_Cloud_IAM_uid = "bx";
    var IBM_Cloud_IAM_pwd = "bx";

    return new Promise( function( resolve, reject )
    {
        var btoa = require( "btoa" );
        var options = { url     : "https://iam.bluemix.net/oidc/token",
                        headers : { "Content-Type"  : "application/x-www-form-urlencoded",
                                    "Authorization" : "Basic " + btoa( IBM_Cloud_IAM_uid + ":" + IBM_Cloud_IAM_pwd ) },
                        body    : "apikey=" + apikey + "&grant_type=urn:ibm:params:oauth:grant-type:apikey" };

        var request = require( 'request' );
        request.post( options, function( error, response, body )
        {
            if( error || ( 200 != response.statusCode ) )
            {
                console.log( "getAuthToken:\n" + JSON.parse( body )["errorCode"] + "\n" + JSON.parse( body )["errorMessage"] + "\n" + JSON.parse( body )["errorDetails"] )
                reject( "Status code: " + response.statusCode + "  Error: " + error );
            }
            else
            {
                try
                {
                    resolve( JSON.parse( body )["access_token"] );
                }
                catch( e )
                {
                    reject( 'JSON.parse failed.' );
                }
            }

        } );

    } );    

}


function sendtodeployment( endpoint_url, iam_token, instance_id, payload )
{
    // Use the IBM Watson Machine Learning REST API to send the payload to the deployment
    // https://watson-ml-api.mybluemix.net/
    //
    return new Promise( function( resolve, reject )
    {
        var options = { url     : endpoint_url,
                        headers : { "Content-type"   : "application/json",
                                    "Authorization"  : "Bearer " + iam_token,
                                    "ML-Instance-ID" : instance_id },
                        body    : JSON.stringify( payload ) };

        var request = require( 'request' );
        request.post( options, function( error, response, body )
        {
            if( error )
            {
                reject( error );
            }
            else
            {
                try
                {
                    resolve( JSON.parse( body ) );
                }
                catch( e )
                {
                    reject( 'JSON.parse failed.' );
                }
            }

        } );

    } );

}

module.exports = base64ToPNG;
