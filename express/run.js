#!/usr/bin/env node
var app = require("./app")
require("../sonoff/index")

var server = app.listen(3000, function(){
    console.log("starting node js on port 3000")
})