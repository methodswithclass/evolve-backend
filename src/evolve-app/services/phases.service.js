
app.factory("phases.service", [function () {


	var s = window.shared;
	var g = s.utility_service;
	var send = s.send_service;
	var react = s.react_service;
	var events = s.events_service;


	var self = this;

	var n = "";
	var p = {};
	var $phases = [];

	var $running = false;

	var running = function (toggle) {

		$running = toggle;
	}

	var isRunning = function () {

		return $running;
	}

	var runPhase = function ($i) {

		running(true);

		$phases = p[n];
		$phases[$i].phase($phases[$i]);

		// only if there is no complete on button click event does the cycle continue unimpeeded
		if (!$phases[$i].complete && $i < $phases.length-1) {
			runPhase($i + 1);
		}

	}


	var run = function (name) {

		n = name;
		running(true);
		runPhase(0);
	}


	var addNext = function (j, button) {
		
		g.waitForElem({elems:button}, function (options) {

			// console.log("register phase click event for button", options.elems);

			$(options.elems).click(function () {

				if ($phases[j].complete) $phases[j].complete($phases[j]);

				// if (j + 1 < $phases.length-1) $phases[j+1].phase($phases[j+1]);
			})

		});

	}


	var loadPhases = function (options) {

		// console.log("inside load phases", options);

		n = options.name || "none";

		p[n] = [];

		$phases = p[n];

		for (var j in options.phases) {

			$phases[j] = options.phases[j];

			var button = $phases[j].meta ? $phases[j].meta.button : null;

			addNext(j, button);

		}

		if (options.run) run(n);
	}



	return {
		loadPhases:loadPhases,
		run:run,
		running:running,
		isRunning:isRunning
	}


}]);