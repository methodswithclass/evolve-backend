app.factory("feedback.walkthrough", ["utility", "phases.service", "control.service", function (u, phases, controlsService) {

	var s = window.shared;
	var g = s.utility_service;
	var send = s.send_service;
	var react = s.react_service;
	var events = s.events_service;


	var self = this;

	self.name = "feedback";
	self.full = self.name + "walkthrough";

	var grayout = true;

	var toggleControl = function (control, toggle) {

		if (toggle) {
			u.toggle("enable", control);
			$("#" +control + "inner").addClass("scaling-lg");
			// $("#" + control + "toggle").addClass("z-100");
		}
		else {
			// u.toggle("disable", control);
			$("#"+ control + "inner").removeClass("scaling scaling-sm scaling-mm scaling-lg");
		}
	}

	var stopScaling = function () {

		controlsService.controlsArray.forEach(function (value, index) {

			toggleControl(value.name, false);
		})
	}

	var toggleGrayout = function (force) {

		if (force !== undefined) grayout = force;
		
		if (grayout) {

			$("#walkthrough-grayout").animate({opacity:0.7}, 300);
			grayout = true;
		}
		else {
			$("#walkthrough-grayout").animate({opacity:0}, 300);
			grayout = false;
		}
	}

	var scrollTo = function (elem, options) {

		g.waitForElem({elems:["#main-back", elem]}, function ($options) {
				
			// console.log("scroll next button", $options.elems);
			$($options.elems[0]).scrollTo($options.elems[1])

		});
	}


	var moveElement = function (options) {

		g.waitForElem({elems:[options.top, options.element]}, function ($options) {

			var $ref = $($options.elems[0]);
			var $elem = $($options.elems[1]);

			console.log("moveElement", $options);

			// if ($options.elems[1] == "#phase3-containertoggle") console.log($ref[0]);

			$elem.css({top:$ref.offset().top + options.buffer + "px"});
		})

	}


	var evolveEnd = function (button) {

		console.log("evolve end", phases.isRunning(self.full));

		if (phases.isRunning(self.full)) {

			// u.toggle("hide", "phase1-container", {delay:200, fade:400});
			
			setTimeout(function () {

				toggleControl("refresh", true);
			}, 600);
		}
	}

	var evolveStart = function () {

		if (phases.isRunning(self.full)) {
			u.toggle("show", "phase1-container", {delay:200, fade:300});
			u.toggle("hide", "complete-button", {delay:400, fade:400});
		}
	}

	var phase_data = [
	{
		index:0,
		meta:{
			description:"Walklthrough welcome",
			button:"#walkthroughwelcometoggle"
		},
		phase:function (options) {

			if (phases.isRunning(self.full)) {  
				console.log(self.full, options.index, "phase");
				$("#arena").hide();
				toggleGrayout(true);
				u.toggle("show", "walkthroughwelcome");
				u.toggle("hide", "walkthroughbutton");
				u.toggle("show", "walkthrough", {delay:300, fade:600});
			}

		},
		complete:function (options) {

			if (phases.isRunning(self.full)) {
				console.log("pushed next button");

				
				$("#arena").show();
				u.toggle("hide", "walkthroughwelcome");
				toggleControl("play", true);
			}
			
		}
	},
	{
		index:1,
		meta:{
			description:"repeat with a new trash config",
			button:"#playtoggle"
		},
		phase:function (options) {


			console.log(self.full, options.index, "phase");

		},
		complete:function (options) {
			

			evolveStart();
		}
	},
	{
		index:2,
		meta:{
			description:"Simulate results of 100 generations",
			button:"#phase1-ok-button"
		},
		phase:function (options) {


			console.log(self.full, options.index, "phase");

		},
		complete:function (options) {

			if (phases.isRunning(self.full)) {

				u.toggle("hide", "phase1-container", {delay:200, fade:300});
			}
		}
	},
	{
		index:3,
		meta:{
			description:"Go to Refresh",
			button:"#refreshtoggle"
		},
		phase:function (options) {

			console.log(self.full, options.index, "phase");

		},
		complete:function (options) {

			if (phases.isRunning(self.full)) {				
				
				setTimeout(function () {
					toggleControl("play", true);
				}, 600);
				u.toggle("hide", "phase1-container", {delay:200, fade:400})
				u.toggle("show", "complete-button", {delay:400, fdae:400});

			}
		}
	},
	{
		index:4,
		meta:{
			description:"you have completed the wallkthrough",
			button:"#complete-buttontoggle"
		},
		phase:function (options) {


			console.log(self.full, options.index, "phase");

		},
		complete:function (options) {

			if (phases.isRunning(self.full)) {
				toggleGrayout(false);
				u.toggle("hide", "complete-button", {fade:400});
				stopScaling();
				u.toggle("show", "walkthroughbutton", {delay:200, fade:300});
				phases.running(self.full, false);
			}
		}
	}
	]


	var indicateRefreshButton = function () {

		moveElement({element:"#complete-buttontoggle", top:"#main-inner", buffer:(g.isMobile() ? 2000 : 1700)});
		moveElement({element:"#phase3-containertoggle", top:"#main-inner", buffer:(g.isMobile() ? 1800 : 1400)});
	}


	var loadPhases = function () {

		// console.log("load phases \n\n\n\n\n")

		phases.loadPhases({name:self.full, phases:phase_data, run:false});
	}

	var run = function () {

		phases.run(self.full);
	}


	loadPhases();


	events.on("evolve.feedback.start", function () {

		evolveStart();
	});

	events.on("evolve.feedback.end", function () {

		evolveEnd();
	})


	return {
		run:run
	}

}]);