
# Noodle

Doodle with Node.js and Watson Visual Recognition.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

1. Sign up for an [IBM Cloud account](https://console.bluemix.net/registration/).
1. Download the [IBM Cloud CLI](https://console.bluemix.net/docs/cli/index.html#overview).
1. Create an instance of the Visual Recognition service and get your credentials:
    - Go to the [Visual Recognition](https://console.bluemix.net/catalog/services/visual-recognition) page in the IBM Cloud Catalog.
    - Log in to your IBM Cloud account.
    - Click **Create**.
    - Click **Show** to view the service credentials.
    - Copy the `apikey` value.
1. Download and setup [Node.js](https://nodejs.org/en/download/).
1. Download the [doodle dataset](http://sketchy.eye.gatech.edu) for training the model.
1. Log in to [Watson Studio](https://datascience.ibm.com).
1. Create a new watson studio project for your machine learning model and assign the storage and Watson Visual Recognition service instance. 
1. Add the image assests to your project.
1. Create the classes for the assests you wish to train. 
1. Train the model. 

## Configuring the application


1. Open the server.js file and change the api key for the visual recognition service. 

```
iam_apikey: 'API-KEY'
```

## Running locally

1. Install the dependencies.

    ```
    npm install
    ```

1. Run the application.

    ```
    npm start
    ```

1. View the application in a browser at `localhost:8080`

## Deploying to IBM Cloud as a Cloud Foundry Application

1. Login to IBM Cloud with the [IBM Cloud CLI](https://console.bluemix.net/docs/cli/index.html#overview).

    ```
    ibmcloud login
    ```

1. Target a Cloud Foundry organization and space.

    ```
    ibmcloud target --cf
    ```

1. Edit the *manifest.yml* file. Change the **name** field to something unique.  
  For example, `- name: my-app-name`.
  
1. Change the websocket link in sketch.js to https://my-app-name.mybluemix.net
  
1. Deploy the application.

    ```
    ibmcloud app push
    ```

1. View the application online at the app URL.  
For example: https://my-app-name.mybluemix.net

## Built With

* [IBM Watson Visual Recogntion Service](https://console.bluemix.net/catalog/services/visual-recognition) - The Visual Recogniton Service used. 
* [P5.Js Library](https://p5js.org) - A Sketching library with a full set of drawing functionality. 
* [Anime.js Library](http://animejs.com) - A Javascript library for animations. 

## Demo

http://noodle.mybluemix.net

## References

* [Doodle Data Set](http://sketchy.eye.gatech.edu)
* [Doodle Animation for Splashscreen](https://codepen.io/ainalem/pen/dKjgBx)
