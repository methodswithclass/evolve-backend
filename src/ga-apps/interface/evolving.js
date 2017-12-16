app.directive("evolving", ['global.service', 'utility', 'events.service', 'react.service', 'simulators', "$http", 'display.service', function (g, u, events, react, simulators, $http, display) {

	return {
		restrict:"E",
		scope:false,
		replace:true,
        templateUrl:"assets/views/" + (g.isMobile() ? "mobile" : "desktop") + "/ga-apps/interface/evolving.html",		
		link:function ($scope, element, attr) {

			var self = this;


			console.log("\n############\ncreate evolveing directive\n\n");

			
			var simulator = simulators.get($scope.name);
    		var update = false;
		    var ev = false;
    		$scope.input = {};

    		self.manual;

    		var crossoverMethods = {
    			default:"multi-parent",
    			multiParent:"multi-parent",
    			multiOffspring:"multi-offspring"
    		}

    		


    		/*#########  default initial settings ############*/
    		var $$InitialSettings$$ = {
	    		gens:500,
	    		runs:20,
	    		goal:"max",
	    		pop:100,
	    		crossover:{
	    			methodTypes:{
	    				multiOffspring:crossoverMethods.multiOffspring, 
	    				multiParent:crossoverMethods.multiParent
	    			},
	    			method:crossoverMethods.multiParent,
	    			parents:2,
	    			pool:0.1,
	    			splicemin:2,
	    			splicemax:12,
	    			mutate:0.02
	    		},
	    		programInput:null
	    	}
	    	/*################################################*/


	    	$scope.evdata;
	    	$scope.stepdata;

	    	var initData = function () {


	    		$scope.evdata = {
			        index:0,
			        best:{},
			        worst:{}
			    }

			    $scope.stepdata = {
			    	gen:0,
			    	org:0,
			    	run:0,
			    	step:0
			    };

			}

			initData();

			$("#breakfeedback").hide();

			var setEvdata = function (x) {
	           	
	           	// console.log("set evdata", x);

	           	$scope.evdata = x;

	           	react.push({
	           		name:"ev." + $scope.name,
	           		state:$scope.evdata
	           	});
	        }
	        

		    $scope.evolving = function (_evolve) {
		        ev = _evolve;
		        if (_evolve) $scope.running(_evolve);
		    }
		    
		    $scope.running = function (_run) {
		        update = _run;
		        if (!_run) $scope.evolving(_run);
		    }


		    $scope.setInputValues = function (input) {

		    	$("#gensinput").val(input.gens);
		        $("#runsinput").val(input.runs);
		        $("#goalinput").val(input.goal);
		        $("#popinput").val(input.pop);

		        $("#methodinput").val(input.crossover.method);
		        $("#parentsinput").val(input.crossover.parents);
		        // $("#poolinput").val(input.crossover.pool ? input.crossover.pool*100 + "%" : "%");
		        $("#poolinput").val(input.crossover.pool);
		        $("#splicemininput").val(input.crossover.splicemin);
		        $("#splicemaxinput").val(input.crossover.splicemax);
		        // $("#mutateinput").val(input.crossover.mutate ? input.crossover.mutate*100 + "%" : "%");
		        $("#mutateinput").val(input.crossover.mutate);
		    }

		    $scope.setSettings = function (input) {

		    	 $scope.settings = {
		        	gens:input.gens,
		        	runs:input.runs,
		        	goal:input.goal,
		        	pop:input.pop,
		        	crossover:{
		        		method:input.crossover.method,
		        		parents:input.crossover.parents,
		        		// pool:(input.crossover.pool ? input.crossover.pool*100 + "%" : "%"),
		        		pool:input.crossover.pool,
		        		splicemin:input.crossover.splicemin,
		        		splicemax:input.crossover.splicemax,
		        		// mutate:(input.crossover.mutate ? input.crossover.mutate*100 + "%" : "%")
		        		mutate:input.crossover.mutate
		        	}
		        }

		    }

		    $scope.resetInput = function (options) {



		    	react.push({
	    			name:"evolve.vars",
	    			state:{
	    				crossoverMethods:crossoverMethods
	    			}
	    		})


		    	var setInput = options ? options.setInput : undefined;

		    	if (setInput) {

		    		console.log("set input", setInput, self.manual);


			    	self.manual = {
			    		gens:parseInt(setInput.gens || (self.manual ? self.manual.gens : "")),
			    		runs:parseInt(setInput.runs || (self.manual ? self.manual.runs : "")),
			    		goal:setInput.goal || (self.manual ? self.manual.goal : "max"),
			    		pop:parseInt(setInput.pop || (self.manual ? self.manual.pop : "")),
			    		crossover:{
			    			methodTypes:{
			    				multiOffspring:crossoverMethods.multiOffspring, 
			    				multiParent:crossoverMethods.multiParent
			    			},
			    			method:setInput.crossover 
					    			? (setInput.crossover.method || 
					    			   (self.manual ? self.manual.crossover.method : crossoverMethods.default)) 
					    			: (self.manual ? self.manual.crossover.method : crossoverMethods.default),
			    			parents:parseInt(setInput.crossover 
					    			? (setInput.crossover.parents || 
					    			   (self.manual ? self.manual.crossover.parents : "")) 
					    			: (self.manual ? self.manual.crossover.parents : "")),
			    			pool:parseFloat(setInput.crossover 
					    			? (setInput.crossover.pool || 
					    			   (self.manual ? self.manual.crossover.pool : "")) 
					    			: (self.manual ? self.manual.crossover.pool : "")),
			    			splicemin:parseInt(setInput.crossover 
					    			? (setInput.crossover.splicemin || 
					    			   (self.manual ? self.manual.crossover.splicemin : "")) 
					    			: (self.manual ? self.manual.crossover.splicemin : "")),
			    			splicemax:parseInt(setInput.crossover 
					    			? (setInput.crossover.splicemax || 
					    			   (self.manual ? self.manual.crossover.splicemax : "")) 
					    			: (self.manual ? self.manual.crossover.splicemax : "")),
			    			mutate:parseFloat(setInput.crossover 
					    			? (setInput.crossover.mutate || 
					    			   (self.manual ? self.manual.crossover.mutate : "")) 
					    			: (self.manual ? self.manual.crossover.mutate : "")),
			    		},
			    		programInput:setInput.programInput || (self.manual ? self.manual.programInput : {}) 
			    	}


			    	// for (var i in setInput) {

			    	// 	if (Object.keys(setinput[i]).length > 0) {

			    	// 		for (var j in setInput[i]) {

			    	// 			self.manual[i][j] = setInput[i][j] || self.manual[i][j];
			    	// 		}
			    	// 	}

			    	// 	self.manual[i] = setInput[i] || self.manual[i];
			    	// }

			    	// self.manual = {
			    	// 	gens:setInput.gens,
			    	// 	runs:setInput.runs,
			    	// 	goal:setInput.goal,
			    	// 	pop:setInput.pop,
			    	// 	crossover:{
			    	// 		methodTypes:{
			    	// 			multiOffspring:crossoverMethods.multiOffspring, 
			    	// 			multiParent:crossoverMethods.multiParent
			    	// 		},
			    	// 		method:setInput.crossover 
					   //  			? setInput.crossover.method,
			    	// 		parents:setInput.crossover 
					   //  			? setInput.crossover.parents
			    	// 		pool:setInput.crossover 
					   //  			? setInput.crossover.pool
			    	// 		splicemin:setInput.crossover 
					   //  			? setInput.crossover.splicemin
			    	// 		splicemax:setInput.crossover 
					   //  			? setInput.crossover.splicemax
			    	// 		mutate:setInput.crossover 
					   //  			? setInput.crossover.mutate
			    	// 	},
			    	// 	programInput:setInput.programInput
			    	// }

		    	}
		    	else {

		    		console.log("reset to default");

			    	self.manual = {
			    		gens:parseInt($$InitialSettings$$.gens || self.manual.gens),
			    		runs:parseInt($$InitialSettings$$.runs || self.manual.runs),
			    		goal:$$InitialSettings$$.goal || self.manual.goal,
			    		pop:parseInt($$InitialSettings$$.pop || self.manual.pop),
			    		crossover:{
			    			methodTypes:{
			    				multiOffspring:crossoverMethods.multiOffspring, 
			    				multiParent:crossoverMethods.multiParent
			    			},
			    			method:$$InitialSettings$$.crossover.method || self.manual.crossover.method,
			    			parents:parseInt($$InitialSettings$$.crossover.parents || self.manual.crossover.parents),
			    			pool:parseFloat($$InitialSettings$$.crossover.pool || self.manual.crossover.pool),
			    			splicemin:parseInt($$InitialSettings$$.crossover.splicemin || self.manual.crossover.splicemin),
			    			splicemax:parseInt($$InitialSettings$$.crossover.splicemax || self.manual.crossover.splicemax),
			    			mutate:parseFloat($$InitialSettings$$.crossover.mutate || self.manual.crossover.mutate)
			    		},
			    		programInput:(self.manual ? self.manual.programInput : $$InitialSettings$$.programInput) || $$InitialSettings$$.programInput
			    	}
		    	}

		    	console.log("reset input self.manual", self.manual);

		        
		    	$scope.setInputValues(self.manual);
		       

		       	$scope.setSettings(self.manual);


		        console.log("reset input, settings", $scope.settings);

		    }

		    var getValue = function (string) {

		    	return parseFloat(string.substr(0, string.length-1)/100)
		    }


		    $scope.getInput = function ($x) {

		    	if ($x) self.manual = $x;

		    	// console.log("get input self.manual", self.manual);

		    	// self.manual = checkSettingsForUpdates();

		        $scope.input = {
		            name:$scope.name,
		            gens:parseInt((self.manual ? self.manual.gens : undefined) || $("#gensinput").val()),
		            runs:parseInt((self.manual ? self.manual.runs : undefined) || $("#runsinput").val()),
		            goal:(self.manual ? self.manual.goal : undefined) || $("#goalinput").val(),
		            pop:parseInt((self.manual ? self.manual.pop : undefined) || $("#popinput").val()),
		            crossover:{
		            	methodTypes:{
		    				multiOffspring:crossoverMethods.multiOffspring, 
		    				multiParent:crossoverMethods.multiParent
		    			},
		    			method:(self.manual 
		        	             ? (self.manual.crossover 
		        	                ? self.manual.crossover.method : undefined) 
		        	             : undefined) || $("#methodinput").val(),
		            	parents:parseInt((self.manual 
		            	             ? (self.manual.crossover 
		            	                ? self.manual.crossover.parents : undefined) 
		            	             : undefined) || $("#parentsinput").val()),
		        		pool:parseFloat((self.manual 
		            	             ? (self.manual.crossover 
		            	                ? self.manual.crossover.pool : undefined) 
		            	             : undefined) || getValue($("#poolinput").val())),
		        		splicemin:parseInt((self.manual 
		            	             ? (self.manual.crossover 
		            	                ? self.manual.crossover.splicemin : undefined) 
		            	             : undefined) || $("#splicemininput").val()),
		        		splicemax:parseInt((self.manual 
		            	             ? (self.manual.crossover 
		            	                ? self.manual.crossover.splicemax : undefined) 
		            	             : undefined) || $("#splicemaxinput").val()),
		        		mutate:parseFloat((self.manual 
		            	             ? (self.manual.crossover 
		            	                ? self.manual.crossover.mutate : undefined) 
		            	             : undefined) || getValue($("#mutateinput").val()))
		            },
		            programInput:self.manual ? self.manual.programInput : $$InitialSettings$$.programInput,
		            evdelay:0,
		            newenv:true,
		            session:$scope.session
		        }

		        return $scope.input;
		    }

		    $scope.resendInput = function () {

		    	// $scope.input.gen = $scope.stepdata.gen;

		    	return $scope.input;
		    }


		    react.subscribe({
		    	name:"resetInput",
		    	callback:function(x) {

    				$scope.resetInput({
    					setInput:x
    				});

		    		$scope.getInput();
		    	}
		    })

			var stepprogress = function () {

				var input = $scope.getInput();

		        var genT = $scope.input.gens;
		        var orgT = $scope.input.pop;
		        var runT = $scope.input.runs;
		        var stepT = input.programInput.totalSteps;

		        var gen = $scope.stepdata.gen - 1;
		        var org = $scope.stepdata.org - 1;
		        var step = $scope.stepdata.step || 0;
		        var run = $scope.stepdata.run - 1;

		        // console.log("percent", gen, org, step, run);

		        var stepP = (step + run*stepT + org*(runT*stepT) + gen*(orgT*runT*stepT))/(stepT*runT*orgT*genT);
		        var runP = (run + org*runT)/runT;
		        var orgP = (org + gen*orgT)/orgT;
		        //var genP = gen/genT;

		        var percent = stepP;

		        if (percent >= 1) {
		            percent = 1;
		        }

		        $("#rundata").css({width:percent*100 + "%"});
		    }

		    setInterval(function () {

		        if (update) {
		            if (ev) {
		                stepprogress();
		            }
		            $scope.$apply();
		        }

		    }, 30);


		    var getBest = function (complete) {


		    	$http({
		    		method:"GET",
		    		url:"/evolve/best/" + $scope.session
		    	})
		    	.then(function (res) {

	                setEvdata(res.data.ext);

	                if (complete) complete();

	            }, function (err) {

	                console.log("Server error while getting best individual", err);

	            })


		    }

		    var completeEvolve = function (simulate) {

		    	console.log("complete evolve");
		    	console.log("evolving", update);

		    	$scope.running(false);

		    	getBest(function () {

		    		u.toggle("hide", "evolve", {
			        	fade:600, 
			        	delay:2000,
			        	complete:function () {

			        		$scope.running(false);
				        	$("#breakfeedback").hide();

				        	u.toggle("show", "hud", {fade:600});

					        u.toggle("enable", "refresh", {fade:600});
					        u.toggle("enable", "play", {fade:600});
					        if ($scope.name == "trash") u.toggle("enable", "restart", {fade:600});
					        if ($scope.name == "trash") u.toggle("enable", "step", {fade:600});
				        	

					        u.toggle("show", "run", {fade:600});
					        u.toggle("show", "settings", {fade:600});


				        	simulator.setup($scope.session, function () {

					    		simulator.refresh($scope.session); 
					    	});

					    	setTimeout(function () {
					            $("#evolvedata").animate({color:"#000"}, 600);
					        }, 300);

					    }
					});

		    	});


		    }

		    
		    var isRunning = function  () {

		    	$http({
		    		method:"GET",
		    		url:"/evolve/running/" + $scope.session
		    	})
		    	.then(function (res) {

		    		$scope.running(res.data.running);

        			setTimeout(function () {
                	
	                	if (update) {
	                		isRunning();
	                	}
	                	else {
				    		completeEvolve();
				    	}

	                }, 500)

            	}, function (err) {

            		console.log("Server error while checking for evolve complete")

            	})

		    }

		    var setStepdata = function () {


		    	$http({
		    		method:"GET",
		    		url:"/evolve/stepdata/" + $scope.name + "/" + $scope.session
		    	})
		    	.then(function (res) {

		    		// console.log("get stepdata", res.data.stepdata);

		    		var stepdata = res.data.stepdata ? res.data.stepdata : $scope.stepdata;

		    		// console.log("stepdata", res.data.stepdata, stepdata);

	                $scope.stepdata = {
	                	gen:stepdata.gen,
	                	org:stepdata.org,
	                	run:stepdata.run,
	                	step:stepdata.step
	                }

	                if ($scope.stepdata.gen != $scope.evdata.index) {
	                	getBest();
	                }

	                setTimeout(function () {

	                	if (update) setStepdata();
	                }, 0);

	            }, function (err) {

	                console.log("Server error while getting stepdata", err);

	            })

		   	}

		   	var initializeAlgorithmBackend = function (complete) {


		        $http({
		            method:"POST",
		            url:"/evolve/initialize",
		            data:{input:$scope.getInput()}
		        })
		        .then(function (res) {

		            console.log("Initialize algorithm", res.data.success);



		            if (complete) complete();

		        }, function (err) {

		            console.log("Server error while initializing algorithm", err.message);

		        })

		    }

		    var setEvolveBackend = function (resend, complete) {

		    	$http({
		    		method:"POST",
		    		url:"/evolve/set",
		    		data:{input:resend ? $scope.resendInput() : $scope.getInput()}
		    	})
		    	.then(function (res) {

	                console.log("Set input", res);

	                if (complete) complete();

	            }, function (err) {

	                console.log("Server error while running algorithm", err);

	            })
		   	}

		    var runEvolveBackend = function (complete) {


		    	$http({
		    		method:"POST",
		    		url:"/evolve/run", 
		    		data:{input:$scope.getInput()}
		    	})
		    	.then(function (res) {

	                console.log("Run algorithm", res);

	                if (!res.data.success) {

	                	initializeAlgorithmBackend(function () {

	                		runEvolveBackend(function  () {

	                			if (complete) complete();

	                		})

	                	});


	                }
	                else {

	                	 if (complete) complete();
	                }

	               

	            }, function (err) {

	                console.log("Server error while running algorithm", err);

	            })
		    }


		    var restartEvolveBackend = function (complete) {


	    		$http({
		    		method:"POST",
		    		url:"/evolve/restart", 
		    		data:{input:$scope.getInput(), current:$scope.stepdata.gen}
		    	})
		    	.then(function (res) {

	                console.log("Restart algorithm", res);

	                if (complete) complete();

	            }, function (err) {

	                console.log("Server error while running algorithm", err);

	            })

		    	
		    }


		    var breakEvolveBackend = function (complete) {

		    	$http({
		    		method:"POST",
		    		url:"/evolve/hardStop",
		    		data:{name:$scope.name, input:$scope.getInput()}
		    	})
		    	.then(function (res) {

	                console.log("Hard stop algorithm", res);

	                if (complete) complete();

	            }, function (err) {

	                console.log("Server error while running algorithm", err);

	            })
		    }

		    var runEvolveComplete = function () {

				isRunning();

				setStepdata();

				simulator.reset($scope.session);
				simulator.refresh($scope.session);
		    }


		    events.on("evolve.complete", function () {
		        completeEvolve();
		    });

		    $scope.resetgen = function () {

		        console.log("reset gen");
		        // $scope.running(false);
		        
		        $scope.resetInput();
		        
		        $scope.animateRefresh(function () {

		            // setEvolveBackend();

		            initializeAlgorithmBackend(function () {

		            	initData();
		            	
		            });

		        });
		    }


		    $scope.run = function () {

		        // simulator.refresh();
		        $scope.evolving(true);

		        display.forceEvolveHeight();


		        u.toggle("hide", "settings", {fade:300});
		        u.toggle("hide", "run", {fade:300});
		        u.toggle("disable", "refresh", {fade:300});
		        u.toggle("disable", "restart", {fade:300});
		        u.toggle("disable", "step", {fade:300});
		        u.toggle("disable", "play", {fade:300});
		        u.toggle("disable", "stop", {fade:300});
		        

		        // u.toggle("hide", "hud", {fade:300});
		        u.toggle("show", "evolve", {
		            fade:600,
		            delay:600,
		            complete:function () {


            			runEvolveBackend(function () {

            				runEvolveComplete();
            			});
		                
		            }
		        });

		        setTimeout(function () {
		            // console.log("animate");
		            $("#evolvepage").animate({color:"#fff"}, 600);
		            $("#evolvepage").addClass("white-t");
		        }, 300);
		    }


		    $scope.stepevolve = function () {

		        $scope.getInput();
		        simulator.reset($scope.session);
		        $scope.evolving(true);
		        events.dispatch("step");
		    }

		    $scope.breakRun = function () {

		        $scope.running(false);
		        $("#breakfeedback").show();

		        $scope.resetInput({
		        	setInput:{
		        		gens:$scope.stepdata.gen
		        	}
		    	});

		        // $("#gensinput").val($scope..gens);

		        breakEvolveBackend(function () {

		        	completeEvolve();

		        });
		    }


		}
	}

}]);