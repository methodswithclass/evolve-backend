app.factory("recognize.controller", ["recognize-sim", "utility", "events.service", "global.service", 'react.service', 'config.service', 'evolve.service', 'input.service', 'display.service', function (simulator, u, events, g, react, config, evolve, $input, display) {


	var pageBuilt;


	var setup = function (self, $scope) {

		pageBuilt = display.beenBuilt(self.name);
	}


	var createEnvironment = function (self, $scope) {


	}

	var finish  = function (self, $scope) {

		events.dispatch("imageFunctions");
	}

	var build = function (self, $scope) {

		processTypes = config.get("types.processTypes")

        $scope.programInput = config.get("global.recognize");

	}

	var enter = function (self, $scope) {


		console.log("enter controller", self.name);


        if (!pageBuilt) {

            $input.createInput(self.name);

        }
        else {

            $input.setName(self.name);

        }

        evolve.setup(self.name);

        $input.masterReset();

        $input.setInput({
            name:self.name,
            runs:1,
            pop:20,
            programInput:$scope.programInput
        });

        $scope.settings = $input.setSettings($scope, $input.getInput(false));

	}

	var refresh = function (self, $scope) {

        imageIndex = Math.floor(Math.random()*28000)

        react.push({
            name:"indexes",
            state:{
                index:imageIndex,
                sample:0
            }
        })

        simulator.reset();
        simulator.create();
    }

    var restart = function (self, $scope) {

    }

    var step = function (self, $scope) {

    }

    var play = function (self, $scope) {
        
        simulator.simulate(imageIndex);
    }

    var stop = function (self, $scope) {
		  
    }


	return {
		setup:setup,
		createEnvironment:createEnvironment,
		finish:finish,
		build:build,
		enter:enter,
		refresh:refresh,
		restart:restart,
		step:step,
		play:play,
		stop:stop
	}


}]);