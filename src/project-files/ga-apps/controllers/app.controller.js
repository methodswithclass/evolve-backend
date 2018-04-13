app.controller("app.controller", ['$scope', 'simulators', 'controllers', 'states', 'utility', "display.service", 'api.service', 'input.service', 'config.service', 'evolve.service', 'loading.service', function ($scope, simulators, controllers, states, u, display, api, $input, config, evolve, loading) {

    var self = this;



    var shared = window.shared;
    var g = shared.utility_service;
    var send = shared.send_service;
    var react = shared.react_service;
    var events = shared.events_service;



    self.name = u.stateName(states.current());
    $scope.name = self.name;
    self.sdata;

    $scope.settings;
    $scope.grids;
    $scope.programInput;


    $scope.evdata;
    $scope.stepdata;
    $scope.input;


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


    react.subscribe({
        name:"data" + self.name,
        callback:function (x) {

            $scope.evdata = x.evdata || $scope.evdata;
            $scope.stepdata = x.stepdata || $scope.stepdata;
            $scope.input = x.input || $scope.input;
        }
    })


    var processTypes;
    var displayParams = display.getParams();

    console.log("name is", self.name);

    var simulator = simulators.get(self.name);
    var controller = controllers.get(self.name);

    var pageBuilt = display.beenBuilt(self.name);


    // console.log("\n\n\ncontroller", self.name, "built", pageBuilt, "\n\n\n")


    controller.setup(self, $scope);


    var next = function (options) {


        setTimeout(function () {

            if (typeof options.complete === "function") options.complete() 
        }, options.duration)
    }





    /* 
    #_______________________________________
    #
    #
    #   Phase data array
    #
    #
    #_________________________________________
    */




    var phases = [
    {
        message:"processing", 
        delay:300,
        duration:600,
        phase:function (options) {

            console.log("processing phase");

            enter();

            display.elementsToggle(self.name, "hide");

            next(options);

        }
    },
    {
        message:"initializing evolutionary algoirthm", 
        delay:300,
        duration:600,
        phase:function (options) {

            console.log("initialize algorithm phase");
            
            if (!pageBuilt) {
               
                api.instantiate(function (res) {

                    console.log("Instantiate session", res);

                    $scope.session = res.data.session;

                    console.log("instantiate complete");

                    $input.setInput({
                        session:$scope.session
                    })
                    
                    api.initialize(function () {

                        api.setInput(false, function (res) {

                            next(options);

                        });

                    })
                    
                })

            }
            else {

                $scope.resetgen();


                next(options);
            }

        }
    },
    {
        message:"loading environment", 
        delay:300,
        duration:displayParams.fade, 
        phase:function (options) {

            console.log("load environment phase");

            
            controller.createEnvironment(self, $scope);


            next(options);

        }
    },
    {
        message:"loading display", 
        delay:300,
        duration:displayParams.fade,
        phase:function (options) {

            console.log("load display phase");

            display.load(self.name);

            next(options);
        }
    },
    {
        message:"getting things ready", 
        delay:300,
        duration:displayParams.fade, 
        phase:function (options) {

            console.log("getting things ready phase, finish loading");


            evolve.running(false, $scope);

            u.toggle("hide", "loading", {fade:displayParams.fade, delay:displayParams.delay});

            display.elementsToggle(self.name, "show");

            controller.finish(self, $scope);

            display.isBuilt(self.name);
            
            
            next(options);
            
        }
    }
    ]


    var load = function () {

        console.log("load page");

        g.waitForElem({elems:"#loadingtoggle"}, function (options) {

            console.log("load controller", self.name);

            loading.init($scope, phases);

            u.toggle("show", "loading", {
                fade:displayParams.fade,
                complete:function () {

                    
                    loading.runPhase(0);
                }
            });
        })
    }



    /*__________________________________________________________________________*/




    /* 
    #_______________________________________
    #
    #
    #   Settings kind support functions
    #
    #
    #_________________________________________
    */


    var kindStatus = {
        opened:"z-80",
        closed:"z-60"
    }

    var kinds = [
    {
        id:0,
        value:"basic",
        status:true
    },
    {
        id:1,
        value:"advanced",
        status:false
    }
    ]

    var tabParams = {
        opened:{
            top:0,
            opacity:0,
            zIndex:20,
            class:kindStatus.opened
        },
        closed:{
            top:"20px",
            opacity:0.7,
            zIndex:10,
            class:kindStatus.closed
        }
    }

    var toggleKind = kinds[0];

    var toggleKindType = function (kindValue) {

        // console.log("toggle kind type", kindValue);

        toggleKind = kinds.find(function (p) {

            return p.value == kindValue;
        });


        // console.log("toggle kinid", toggleKind);

        kinds = kinds.map(function (value, index) {

            if (value.value == toggleKind.value) {

                // sets toggle kind status to true (indicates that kindValue tab has been selected opened)

                value.status = true;
            }
            else {

                // indicates all other tabs closed

                value.status = false;
            }

            return value;

        })

        // console.log("kinds", kinds, toggleKind);



        return toggleKind;
    }

    var getTabParam = function (kind, param) {

        return kind.status ? tabParams.opened[param] : tabParams.closed[param];
    }

    var tabElem = function (kind) {
        
        return {
            main:$("#" + kind.value + "-tab"),
            cover:$("#settings-" + kind.value + "-cover"),
            settings:$("#settings-" + kind.value)
        }
    }

    var toggleTab = function (kind) {


        tabElem(kind).main.css({
            top:getTabParam(kind, "top"),
            zIndex:getTabParam(kind, "zIndex")
        });

        tabElem(kind).cover.css({
            // top:getTabParam(kind, "top"), 
            opacity:getTabParam(kind, "opacity")
        });

        tabElem(kind).settings
        .removeClass(kind.status ? tabParams.closed.class : tabParams.opened.class)
        .addClass(getTabParam(kind, "class"));

    }



    /*_____________________________________________________________________________*/




   /* 
    #_______________________________________
    #
    #
    #   Settings open/close toggle support functions
    #
    #
    #_________________________________________
    */



    var controls = [
    {
        name:"open",
        input:$("#opensettings"),
        tool:$("#opentool")
    }
    ]

    var inputs = [
    {
        input:$("#gensinput")
    },
    {
        input:$("#runsinput")
    },
    {
        input:$("#goalinput")
    },
    {
        input:$("#popinput")
    },
    {
        input:$("#refreshbtn")
    }
    ]

    $stage = $("#stage");


    var setHover = function (i) {

        controls[i].input.hover(function () {
            controls[i].tool.animate({opacity:1}, 100);
        },
        function () {
            controls[i].tool.animate({opacity:0}, 100);
        });
    }

    for (i in controls) {
        setHover(i);
    }

    var isFocus = function () {

        for (i in inputs) {
            if (inputs[i].input.is(":focus")) {
                return true;
            }
        }

        return false;
    }

    var settingsWidth = 800;
    var width = 0.6;
    var toggleOpened = true;
    var openStatus = {opened:false, right:{opened:-20, closed:(-1)*settingsWidth}};
            


    var animateToggle = function (open_up) {

        controls[0].tool.animate({opacity:0}, 200);
        $("#settingstoggle").animate({
            
            right:
            
            (
             (!open_up || openStatus.opened) 
             ? openStatus.right.closed

             : (
                (open_up || openStatus.closed) 
                ? openStatus.right.opened 
                : openStatus.right.closed
                )
             )

        }, 
        {
            
            duration:300, 
            complete:function () {
                openStatus.opened = !openStatus.opened;
            }

        });

    }


    self.animateRefresh = function (complete) {

        toggleOpened = false;
        $("#refreshfeedback").css({opacity:1});
        $("#refreshfeedback").animate(
        {
            top:0, 
            opacity:0
        }, 
        {
            duration:1000, 
            complete:function () { 
                $("#refreshfeedback").css({top:g.isMobile() ? 60 : 20});
                if (complete) complete();
                toggleOpened = true;
            }
        }
        )
    }



    /*_______________________________________________________________________________*/





    /* 
    #_______________________________________
    #
    #
    #   Settings functions
    #
    #
    #_________________________________________
    */





    self.open = function () {

        console.log("open settings ", openStatus.opened);

        if (!isFocus() && toggleOpened) {
            animateToggle(true);
        }
    }


    self.changeKind = function (kindValue) {

        console.log("change settings kind", kindValue);

        kinds.map(function (value, index) {

            toggleKindType(kindValue)

            toggleTab(value);

        });

    }


    self.changeInput = function () {

        console.log("change input");

        $scope.settings = $input.changeInput($scope)

    }


    /*________________________________________________________________________________*/





    // textSettings();

    /* 
    #_______________________________________
    #
    #
    #   Control functions
    #
    #
    #_________________________________________
    */


    
    self.refresh = function () {

        controller.refresh(self, $scope)
    }

    self.restart = function () {

        
        controller.restart(self, $scope);
    }

    self.step = function () {

        controller.step(self, $scope);
    }

    self.play = function () {
        
        controller.play(self, $scope);
    }

    self.stop = function () {

        controller.stop(self, $scope);
    }

    self.run = function () {

        controller.run(self, $scope);
    }


    self.breakRun = function () {

        controller.breakRun(self, $scope);
    }



    /*________________________________________________________________________________*/






    /* 
    #_______________________________________
    #
    #
    #   Controller build and load functions
    #
    #
    #_________________________________________
    */


    var build = function () {

        controller.build(self, $scope);
    }



    var enter = function () {

        setTimeout(function () {

            $("#main-back").click(function () {

                animateToggle(false);
            });

        }, 500)

        controller.enter(self, $scope);

    }



    build();

    load();



    /*___________________________________________________________________________________*/








}]);