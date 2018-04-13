app.directive("evolvedata", ["utility", "states", function (u, states) {

	return {
		restrict:"E",
		scope:true,
		replace:true,
		template:"<div ng-include='getContentUrl()'></div>",
		link:function ($scope, element, attr) {
			

			$scope.getContentUrl = function () {

				return "assets/views/" + u.getInterface() + "/common/interface/evolvedata.html";
			}

				
			var shared = window.shared;
			var g = shared.utility_service;
			var send = shared.send_service;
			var react = shared.react_service;
			var events = shared.events_service;


   	 		self.name = u.stateName(states.current());


			$scope.evdata;
			$scope.stepdata;

			react.subscribe({
				name:"data" + self.name,
				callback:function (x) {

					$scope.evdata = x.evdata || $scope.evdata;
					$scope.stepdata = x.stepdata || $scope.stepdata;
				}
			})

		}

	}

}]);