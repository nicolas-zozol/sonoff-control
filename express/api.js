var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();


const object ={
    data:{test:"yop"},
    date: new Date().toString()
}

/* GET users listing. */
router.get('/', function (req, res) {

    res.setHeader('content-type', 'text/plain');

    const p = "plop.log"
    fs.readFile(p, 'utf8', function (err,data) {
        if (err) {
            res.status(404);
            res.send(err)
        }
        res.status(404);

        const lines = data.split('\n').reverse().join('\n')

        res.send(lines)
    });



});

router.post('/', function (req, res) {
    const data = req.body;
    if (!data) {
        res.status(406);
        res.send({message: "no valid 'name' key provided "});
        return;
    }
    object.data=data;
    object.date=new Date().toString()
    object.headers = req.headers;
    res.status(201);
    res.json("created");
});


module.exports = router;