const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const aws = require('aws-sdk');

const multer = require('multer');
const { response } = require('express');
// const upload = multer({ dest: 'uploads/' });
const upload = multer();

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/upload', upload.single('image'), function (req, res) {

    let file = req.file.buffer;

    // aws.config.update({
    //     accessKeyId: 'AKIATNWG6Q5JTLKOU3MA',
    //     secretAccessKey: '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',
    //     region: 'us-east-1'
    // });

    const config = new aws.Config({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    })

    let rekognition = new aws.Rekognition();

    const params = {
        Image: {
            // S3Object: {
            //     Bucket: bucket,
            //     Name: photo
            // }, Trabalhando com o S3
            Bytes: file
        },
        MaxLabels: 50,
        MinConfidence: 70
    }

    rekognition.detectLabels(params, function (err, data) {
        if (err) {
            console.log(err, err.stack); // if an error occurred
        } else {
            console.log(data)
            res.json(data);
        }
    });

});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});