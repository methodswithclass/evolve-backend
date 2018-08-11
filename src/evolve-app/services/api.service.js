app.factory("api.service", ["utility", 'input.service', '$http', "$q", function (u, $input, $http, $q) {


    var shared = window.shared;
    var g = shared.utility_service;
    var events = shared.events_service;
    var react = shared.react_service;
    var send = shared.send_service;
    

	var getBest = function (callback) {

       
    	$http({
    		method:"POST",
    		url:"/evolve/best",
            data:{input:$input.getInput()}
    	})
    	.then(function (res) {

            if (typeof callback === "function")callback(res);

        }, function (err) {

            console.log("before throw Server error: 'getBest'", err)

            throw err;
        })
        .catch(function (err) {

            console.log("Server error: 'getBest'", err)

        })
        
    }


    var stepdata = function (callback) {

        // console.log("call setpdata");
      
    	$http({
    		method:"POST",
    		url:"/evolve/stepdata",
            data:{input:$input.getInput()}
    	})
    	.then(function (res) {

            // console.log("stepdata raw response", res);

            if (typeof callback === "function") callback(res);

        }, function (err) {

            // console.log("Server error: 'stepdata'", err)

            // return $q.reject(err);
            throw err;
        })
        .catch(function (err) {

            console.log("Server error: 'stepdata'", err)

        })

   	}


   	var isRunning = function  (callback) {


    	$http({
    		method:"POST",
    		url:"/evolve/running",
            data:{input:$input.getInput(true)}
    	})
    	.then(function (res) {

            if (typeof callback === "function") callback(res);

    	}, function (err) {

    		// console.log("Server error: 'isRunning'", err)

            // return $q.reject(err);
            throw err;
    	})
        .catch(function (err) {

            console.log("Server error: 'isRunning'", err)

        })

    }


    var setInput = function (resend, callback) {

       
        // console.log("setInput http call get input or resendInput");

    	$http({
    		method:"POST",
    		url:"/evolve/set",
    		data:{input:resend ? $input.resendInput() : $input.getInput()}
    	})
    	.then(function (res) {

            if (typeof callback === "function") callback(res);

        }, function (err) {

            // console.log("Server error: 'setInput'", err)

            // return $q.reject(err);
            throw err;
        })
        .catch(function (err) {

            console.log("Server error: 'setInput'", err)

        })

   	}


    var instantiate = function (callback) {


        $http({
            method:"GET",
            url:"/evolve/instantiate"
        })
        .then(function (res) {

            if (typeof callback === "function") callback(res);

        }, function (err) {

            // console.log("Server error: 'instantiate'", err)

            // return $q.reject(err);
            throw err;
        })
        .catch(function (err) {

            console.log("Server error: 'instantiate'", err)

        })


    }


   	var initialize = function (callback) {

    
        console.log("initialize http call get input");

        $http({
            method:"POST",
            url:"/evolve/initialize",
            data:{input:$input.getInput()}
        })
        .then(function (res) {

            if (typeof callback === "function") callback(res);

        }, function (err) {

            // console.log("Server error: 'initialize'", err)

            // return $q.reject(err);
            throw err;
        })
        .catch(function (err) {

            console.log("Server error: 'initialize'", err)

        })


    }


    var run = function (callback) {


        // console.log("run call input", $input.getInput(true));

    	$http({
    		method:"POST",
    		url:"/evolve/run", 
    		data:{input:$input.getInput(true)}
    	})
    	.then(function (res) {

            if (!res.data.success) {

            	initialize(function () {
            		
            		run(function  () {
            			if (typeof callback === "function") callback(res);
            		})
            	});
            }
            else {

            	 if (typeof callback === "function") callback(res);
            }

        }, function (err) {

            // console.log("Server error: 'run'", err)

            // return $q.reject(err);
            throw err;
        })
        .catch(function (err) {

            console.log("Server error: 'run'", err)

        })

    }

    var instruct = function (clear, callback) {

        $http({
            method:"POST",
            url:"/evolve/instruct",
            data:{input:$input.getInput(), clear:clear}
        })
        .then(function (res) {

            if (typeof callback === "function") callback(res);

        }, function (err) {

            // console.log("Server error: 'instruct'", err);

            // return $q.reject(err);
            throw err;
        })
        .catch(function (err) {

            console.log("Server error: 'instruct'", err);

        })

    }

    var refreshEnvironment = function (callback) {


        // console.log("refresh environment call get input");

        $http({
            method:"POST",
            url:"/trash/environment/refresh",
            data:{input:$input.getInput()}
        })
        .then(function (res) {

            console.log("refresh response", res.data);

            if (typeof callback === "function") callback(res);

        }, function (err) {

            // console.log("Server error: 'refresh environment'", err)

            // return $q.reject(err);
            throw err;
        })
        .catch(function (err) {

            console.log("Server error: 'refresh environment'", err)

        })

    }

    var resetEnvironment = function (callback) {

        $http({
            method:"POST",
            url:"/trash/environment/reset",
            data:{input:$input.getInput()}
        })
        .then(function (res) {

            if (typeof callback === "function") callback(res);

        }, function (err) {

            // console.log("Server error: 'reset environment'", err)

            // return $q.reject(err);
            throw err;
        })
        .catch(function (err) {

            console.log("Server error: 'reset environment'", err)

        })

    }


    var simulate = {


        trash:function ($input, callback) {

            $http({
                method:"POST",
                url:"/trash/simulate",
                data:$input
            })
            .then(function (res) {

                if (typeof callback === "function") callback(res);

            }, function (err) {

                // console.log("Server error: 'simulate'", err);

                // return $q.reject(err);
                throw err;
            })
            .catch(function (err) {

                console.log("Server error: 'simulate'", err)

            })

        

        },
        recognize:function (index, callback) {

            $http({
                method:"POST",
                url:"/recognize/simulate",
                data:{index:index, input:$input.getInput()}
            })
            .then(function (res) {

                if (typeof callback === "function") callback(res);

            }, function (err) {

                // console.log("Server error while running best individual", err);

                // return $q.reject(err);
                throw err;
            })
            .catch(function (err) {

                console.log("Server error while running best individual", err);

            })
        },
        digit:function (index, callback) {

            $http({
                method:"POST",
                url:"/recognize/digit",
                data:{index:index, input:$input.getInput()}
            })
            .then(function (res) {

                if (typeof callback === "function") callback(res);

            }, function (err) {

                // console.log("Server error while running best individual", err);

                // return $q.reject(err);
                throw err;
            })
            .catch(function (err) {

                console.log("Server error while running best individual", err);

            })

        }

    }


    var hardStop = function (callback) {


        console.log("hard stop call get input");

    	$http({
    		method:"POST",
    		url:"/evolve/hardStop",
    		data:{input:$input.getInput()}
    	})
    	.then(function (res) {

            if (typeof callback === "function") callback(res);

        }, function (err) {

            // console.log("Server error: 'hardStop'", err)

            // return $q.reject(err);
            throw err;
        })
        .catch(function (err) {

            console.log("Server error: 'hardStop'", err)

        })

    }

	return {
		getBest:getBest,
		stepdata:stepdata,
		isRunning:isRunning,
		instantiate:instantiate,
		initialize:initialize,
		setInput:setInput,
		run:run,
        instruct:instruct,
		refreshEnvironment:refreshEnvironment,
        resetEnvironment:resetEnvironment,
        simulate:simulate,
		hardStop:hardStop
	}

}]);