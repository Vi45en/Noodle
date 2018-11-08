
# NOODLE

Doodle with Node.js and Watson Visual Recognition

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
1. Download the [doodle dataset](http://sketchy.eye.gatech.edu) for training the model.
1. Log in to [Watson Studio](https://datascience.ibm.com)
1. Create a new watson tools project for your machine learning model and assign the storage and Watson Visual Recognition service instance. 
1. Add the image assests to your project.
1. Create the classes for the assests you wish to train. 
1. Train the model. 

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Bedang Sen** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## References

* [Doodle Data Set](http://sketchy.eye.gatech.edu)
* IBM Watson Visual Recogntion Service
* P5.Js Library
* Anime.js Library
