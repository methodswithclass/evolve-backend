app.directive("evolving", ['utility', 'input.service', 'evolve.service', "states", function (u, $input, evolve, states) {

	return {
		restrict:"E",
		scope:{
			run:"=",
			break:"="
		},
		replace:true,
		template:"<div ng-include='getContentUrl()'></div>",			
		link:function ($scope, element, attr) {

			var self = this;


			var shared = window.shared;
			var g = shared.utility_service;
			var react = shared.react_service;



   	 		self.name = u.stateName(states.current());

			
			$scope.getContentUrl = function () {

				return "assets/views/" + u.getInterface() + "/" + (g.isMobile() ? "mobile" : "desktop") + "/interface/evolving.html";
			}


			var fitnessTruncateValue = 2;


			$scope.evdata = {};
			$scope.stepdata = {};
			$scope.input = {};
			$scope.fitnessRounded;

			react.subscribe({
				name:"data" + self.name,
				callback:function (x) {

					$scope.evdata = x.evdata || $scope.evdata;
					$scope.stepdata = x.stepdata || $scope.stepdata;
					$scope.input = x.input || $scope.input;
					// console.log("stepdata", $scope.stepdata);

					// console.log("evdata", $scope.evdata.best.fitness, "truncate", g.truncate($scope.evdata.best.fitness, 0));

					$scope.evdata.best = $scope.evdata.best ? $scope.evdata.best : {};
					$scope.evdata.best.fitness = $scope.evdata.best.fitness ? $scope.evdata.best.fitness : 0;

		            $scope.fitnessRounded = g.truncate($scope.evdata.best.fitness, fitnessTruncateValue);

		            // console.log("fitnessRounded", $scope.fitnessRounded);

				}
			})

		}
	}

}]);