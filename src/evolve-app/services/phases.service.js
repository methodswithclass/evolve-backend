
app.factory("phases.service", [function () {




	var $phases = [];


	var runPhase = function ($i) {

		$phases[$i].phase();

		if (!$phases[$i].next && $i < $phases.length-1) {
			runPhase($i + 1);
		}
	}


	var run = function () {

		runPhase(0);
	}



	var loadPhases = function (_phases, $run) {

		$phases = [];


		for (var j in _phases) {

			$phases[j] = _phases[j];

			if($phases[j].meta && $phases[j].meta.button) {

	 			$phases[j].button.addEventListener("click", function () {

					if ($phases[j].next) $phases[j].next();
				})
 			}
		}

		if ($run) run();
	}



	return {
		loadPhases:loadPhases,
		run:run
	}


}]);