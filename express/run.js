#!/usr/bin/env node
var app = require("./app")
require("../sonoff/index")

var server = app.listen(8000, function(){
    console.log("starting node js on port 8000")
})