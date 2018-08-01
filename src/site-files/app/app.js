

// var react2 = new reactCustom();
"use strict";

var page = {
	home:"home",
	trash:"trash",
	feedback:"feedback"
}

var goto;

var loadSpeeds = [
{
    name:"normal"
},
{
    name:"fast"
}
]


var demoLoad = {
	normal:loadSpeeds[0].name,
	fast:loadSpeeds[1].name
}


var makeMobile = function () {

	var mobile = false;

	// mobile = true;

	return mobile;
}

var setInterface = function (inter) {

	// runtimeProvider.initInterface("interface" + inter);

	var shared = window.shared;
	var react = shared.react_service;


	react.push({
		name:"interface",
		state:"interface" + inter
	})

}


var setLoadSpeed = function (display, speed) {


	var shared = window.shared;
	var react = shared.react_service;

	var params = display.getParams();
	var currentParams;

    var found = loadSpeeds.find((p) => {
        return p.name == speed;
    })

    if (found) {
        currentParams = params[speed];
    }
    else {
        console.log("load speed not found default to normal");
        currentParams = params[loadSpeeds[0].name];
    }


    var allParams = {};

    allParams[loadSpeeds[0].name] = params[loadSpeeds[0].name];
    allParams[loadSpeeds[1].name] = params[loadSpeeds[1].name]


    // console.log("push displayParams");

    react.push({
        name:"displayParams",
        state:{
        	params:currentParams,
        	loadSpeeds:loadSpeeds,
        	allParams:allParams
        }
    })

}






var appConfiguration = function (mobile) {

	
	var shared = window.shared;
	var react = shared.react_service;
	var g = shared.utility_service;


	setInterface(1);
	// setInterface(2);



	if (mobile) {
		g.forceMobile();
	}


}





var appSetup = function (display, force) {


	console.log("app setup");


	setSpeed = function (name) {


		var found = loadSpeeds.find((p) => {

			return p.name == name;
		})

		if (found) {
			setLoadSpeed(display, name);
		}
		else {
			setLoadSpeed(display, loadSpeeds[0].name);
		}
	}


	if (force) {
		setSpeed(force);
	}
	else {
		setSpeed(demoLoad.normal);
		// setSpeed(demoLoad.fast);
	}


}





var app = angular.module("app", ['stateModule', 'parallaxModule'])

.config(['$locationProvider', 'runtime.stateProvider', function ($locationProvider, runtimeProvider) {

	

	appConfiguration(makeMobile());


	$locationProvider.html5Mode(true);

	var states = runtimeProvider.states;

	for (var i = 0; i < states.length; i++) {
	  runtimeProvider.addState(states[i]);
	}


}])

.run(['states', "config.service", "display.service", function (states, config, display) {

	// config service is loaded as a dependency and loads data into application automatically
	// don't remove this dependency 

	var configPromise = new Promise((resolve, reject) => {

		resolve([]);

	})

	try {
		
		configPromise = config.get([
		                            "config.debug",
			                    	"config.landingPage", 
			                    	"config.loadSpeed"
			                    ]);

	}
	catch (e) {
		console.log("Error in landing page switch:", e.message);
		states.go("home");
	}


	configPromise.then((data) => {

		var debug = data[0];
		var landingPage 
		var loadSpeed;


		if (debug.active) {

			landingPage = debug.landingPage
			loadSpeed = debug.loadSpeed;
		}
		else {
			landingPage = data[1];
			loadSpeed = data[2];
		}

		switch (landingPage) {

			case page.home:
			states.go("home");
			break;

			case page.trash:
			states.go("trash#demo");
			break;

			case page.feedback:
			states.go("feedback#demo");
			break;

			default:
			states.go("home");
			break;

		}


		appSetup(display, loadSpeed);
	})


}]);





getAngularModules(app);