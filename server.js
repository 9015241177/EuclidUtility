
let express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    crypto = require('crypto');

const fs = require('fs');   
const request = require('request');

const https = require('https');
    app.use(express.static(__dirname + '/public'));

    let fileExtension = require('file-extension');

    app.use(bodyParser.json());  

    let storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './input')
        },
        filename: function (req, file, cb) {
            crypto.pseudoRandomBytes(16, function (err, raw) {
                cb(null, file.originalname );
                });
        }
    });

    let upload = multer({storage: storage}).single('file');


    /** Method to handle the form submit  http://localhost:8080/api/upload*/
    app.post('/sendFile', function(req, res) {
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:401,err_desc:err});
                 return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:404,err_desc:"No file passed"});
                return;
            }
            var formData = {
                file: fs.createReadStream(__dirname + "/input/"+req.file.originalname),
            };
            request.post({url:'http://localhost:8080/api/upload', formData: formData}, function(err, httpResponse, body) {
                if (err) {
                return console.error('upload failed:', err);
                }
               
                var jsonObj = JSON.parse(body);
                var jsonContent = JSON.stringify(jsonObj);
                fs.writeFile("./public/json/scatter.json", jsonContent, 'utf8', function (err) {
                    if (err) {
                        console.log("An error occured while writing JSON Object to File.");
                        return console.log(err);
                    }
                    // console.log("JSON file has been saved.");
                });
            });   
            res.sendFile(__dirname + "/views/scatter-chart/scatter.html");
        })
       
    });
    
    app.get('/',function(req,res){
		res.sendFile(__dirname + "/index.html");
	});

    app.listen('3000', function(){
        console.log('Server running on port 3000');
    });