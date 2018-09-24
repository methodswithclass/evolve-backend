app.directive("plot", ['data', 'utility', 'display.service', function (data, u, display) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
		template:"<div class='absolute width height'><div class='absolute width80 height80 cutoff center'><div class='absolute width height' id='innerplot'></div></div></div>",		
		link:function ($scope, element, attr) {


			var shared = window.shared;
			var g = shared.utility_service;
			var send = shared.send_service;
			var react = shared.react_service;
			var events = shared.events_service;

			var pdata = data.get("feedback");
			var total = pdata.genome;
			var spread = pdata.spread;

			var pointSize = g.isMobile() ? 4 : 2;

			var $inner = $("#innerplot");

			var plot = [];
			var plotContainers = [];
			var zeros = [];

			var animations = {
				x:true,
				y:true
			}


			for (i in total) {
				zeros[i] = 0;
			}

			var normalize = function (y) {

				if (y === undefined) {
					return y;
				}

				$inner = $("#innerplot");

				var plotHeight = $inner.height();
				var dataHeight = spread.size;
				//var zero = dataHeight/2;
				var plotfactor = plotHeight/(dataHeight+1);

				var value = plotfactor*y;

				return value;
			}

			var getContainers = function () {

				var containers = [];

				plot.forEach(function (value, index) {

					containers.push(value.getContainer());
				})

				return containers;
			}


			var makeClass = function (y) {

				var style = document.createElement('style');
				style.type = 'text/css';
				var className = ".move-" + g.truncate(y, 0);
				style.innerHTML = className + " { transform: translate(0, y) }";
				document.getElementsByTagName('head')[0].appendChild(style);

				return className;
			}

			var point = function ($index) {

				var self = this;

				self.index = $index;

				self.coords = {x:$index*$inner.width()/total, y:0};

				// console.log("create point", self.coords);

				var container = document.createElement("div");
				$(container).addClass("absolute black-back");
				container.style.id = "point-" + self.index;
				container.style.width = pointSize + "px";
				container.style.height = pointSize + "px";
				container.style.borderRadius = pointSize/2 + "px";
				container.style.left = self.coords.x + "px";
				container.style.top = normalize(self.coords.y) + "px";
				
				$inner.append(container);

				var animate = {
					types:{
						animate:"animate",
						velocity:"velocity",
						anime:"anime"
					}
				}

				animate.type = animate.types.velocity;


				self.getContainer = function () {

					return container
				}

				self.stopAnimation = function () {

					$(container).stop(true, true);
				}

				// self.setCoordX = function (value, duration) {

				// 	// $inner = $("#innerplot");

				// 	self.coords.x = value !== "undefined" ? value : self.coords.x;

				// 	// $(container).css({left:self.coords.x});


				// 	// container.velocity({left:value + "px"}, {
				// 	// 	duration:duration
				// 	// })

				// 	anime({
				// 		targets: container,
				// 		translateX: {value:value, duration:duration}
				// 	})

				// 	// console.log("coord x", self.coords.x);

				// }


				// self.setCoordY = function ($value, duration) {

				// 	// var dna = options.dna;
				// 	// var duration = options.duration;

				// 	// self.coords.y = ((typeof dna !== "undefined") 
				// 	//                 ? (Array.isArray(dna) 
				// 	//                    ? (typeof dna[self.index] !== "undefined" 
				// 	//                       ? dna[self.index] 
				// 	//                       : self.coords.y) 
				// 	//                    : parseFloat(dna)) 
				// 	//                 : self.coords.y);
				// 	// // // console.log("newvalue", newValue, dna);
				// 	// var nextCoord = normalize(self.coords.y);

				// 	// var topProp = {top:nextCoord}
				// 	// var transProp = [
				// 	// 	{transform:"translateY(currentCoord)"},
				// 	// 	{transform:"translateY(nextCoord)"}
				// 	// ]

				// 	// var transProp2 = {"-webkit-transform":"translate(0,"+nextCoord+"px)"}


				// 	// $(container).animate(topProp, {
				// 	// 	duration:duration
				// 	// });


				// 	self.coords.y = typeof $value !== "undefined" ? $value : self.coords.y;

				// 	var value = normalize(self.coords.y);

				// 	// console.log("duration", duration);

				// 	// container.velocity({top:value + "px"}, {
				// 	// 	duration:duration
				// 	// })

				// 	$(container).stop(false, true).animate({top:value + "px"}, duration);


				// 	// anime({
				// 	// 	targets: container,
				// 	// 	translateY: {value:value, duration:duration}
				// 	// })
					

				// 	// console.log("coord y", self.coords.y);


				// }


				self.setCoordX = function (value, duration) {


					self.coords.x = value !== "undefined" ? value : self.coords.x;

					if (animate.type == animate.types.anmiate) {

						$(container).animate({left:value + "px"}, duration);
					}
					else if (animate.type == animate.types.velocity) {
					
						container.velocity({left:value + "px"}, {
							duration:duration
						})

					}
					else if (animate.type == animate.types.anime) {


						anime({
							targets: container,
							translateX: {value:value, duration:duration}
						})
					}

				}

				self.setCoordY = function ($value, duration) {


					var value = normalize($value);

					self.coords.y = (typeof value !== "undefined" ? value : self.coords.y);

					// console.log("y coord", self.coords.y);

					if (animate.type == animate.types.animate) {

						$(container).animate({top:value + "px"}, duration);
					}
					else if (animate.type == animate.types.velocity) {
					
						container.velocity({top:value + "px"}, {
							duration:duration
						})

					}
					else if (animate.type == animate.types.anime) {


						anime({
							targets: container,
							translateY: {value:value, duration:duration}
						})
					}

					

				}


				self.getYValue = function ($value) {

					self.coords.y = typeof $value !== "undefined" ? $value : self.coords.y;

					var value = normalize(self.coords.y);

					return value;
				}


				self.getXValue = function (value) {

					self.coords.x = value !== "undefined" ? value : self.coords.x;

					return self.coords.x;
				}

				

				self.destroy = function () {

					// console.log("destroy point", self.coords);

					$(container).remove();
					container = null;
				}

			}

			var destroyPlot = function () {

				console.log("destroy plot");

				for (var i in plot) {

					plot[i].destroy();
				}

				plot.length = 0;
				plot = [];
				plot = null;
			}

			var createPlot = function () {

				destroyPlot();

				plot = [];

				console.log("create plot");

				for (var i = 0; i < total; i++) {
					plot[i] = new point(i);
					// console.log("new point", plot[i].coords);
				}

				plotContainers = getContainers();
			}

			var animate1 = {
				x:function (duration) {


					var width = $("#innerplot").width();
					var value;


					plot.forEach(function ($value, $index) {

						value = $index*width/total;

						$value.setCoordX(value, duration);
					})
				},
				y:function (dna, duration) {

					var value;

					plot.forEach(function ($value, index) {

						value = Array.isArray(dna) ? dna[index] : (typeof dna !== "undefined" ? dna : $value.coords.y);

						$value.setCoordY(value, duration);
					})

				}
			}

			// var animate2 = {
			// 	x:function (duration) {
			// 		var width = $("#innerplot").width();
			// 		var value;

			// 		var transArray = []

			// 		plot.forEach(function ($value, $index) {

			// 			value = $index*width/total;

			// 			transArray[$index] = {value:$value.getXValue(value), duration:duration};

			// 		})

			// 		// console.log("plot ids", plotContainers, transArray);

			// 		anime({
			// 		  targets: plotContainers,
			// 		  translateX: transArray
			// 		})


					
			// 	},
			// 	y:function (dna, duration) {

			// 		var value;

			// 		var transArray = []

			// 		plot.forEach(function ($value, $index) {

			// 			value = Array.isArray(dna) ? dna[$index] : (typeof dna !== "undefined" ? dna : $value.coords.y);

			// 			transArray[$index] = {value:$value.getYValue(value), duration:duration};

			// 		})

			// 		// console.log("plot ids", plotContainers, transArray);

			// 		anime({
			// 		  targets: plotContainers,
			// 		  translateY: transArray
			// 		})

			// 	}
			// }


			var changeX = function (duration) {

				if (animations.x) {

					animate1.x(duration);

					// animate2.x(duration);
				}
			}

			var changeY = function (dna, duration) {

				if (animations.y) {

					animate1.y(dna, duration);

					// animate2.y(dna, duration);

				}
			}

			var changeplot = function (dna, duration) {

				
				changeY(dna, duration);

			}

			var stopPlot = function () {

				plot.forEach(function (value, $index) {

					value.stopAnimation();
				})

			}


			var resetPlot = function () {
				stopPlot();
				changeplot(0, 100);
			}


			react.push({
				name:"importplot",
				state:{
					changeplot:changeplot,
					changeX:changeX,
					createplot:createPlot,
					resetplot:resetPlot,
					stopPlot:stopPlot
				}
			});

			var setArenaSize = function  () {

				// console.log("resize");

				g.waitForElem({elems:"#arena"}, function (options) {


					// console.log("arena element exists")

					// changeX(200);

					var ed = u.correctForAspect({
						id:"plot",
						factor:g.isMobile() ? 0.5 : 0.35, 
						aspect:2, 
						width:$(window).width(), 
						height:$(window).height()
					})

					$("#arena").css({width:ed.width, height:ed.height});

				})

			}


			setArenaSize();

			$(window).resize(function () {

				setArenaSize();
				
				changeX(100);

				setTimeout(function () {
					changeY(undefined, 100);
				}, 200);

			})

			var refreshTimer = setInterval(function () {

				// console.log("refresh timer");

				if ($("#innerplot")[0]) {

					// console.log("plot exists")

					changeX(200)
					console.log("clear plot refreshtimerInterval")
					clearInterval(refreshTimer);
					refreshTimer = null;

				}


			}, 800)

		}

	}

}]);