let AWS = require("aws-sdk");
const path = require("path");
AWS.config.loadFromPath(__dirname + "/../config/awsConfig.json") // 인증

let s3 = new AWS.S3();
let multer = require("multer");
let multerS3 = require('multer-s3');


let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "flood-master",
        key: function (req, file, cb) {
            let extension = path.extname(file.originalname)
            cb(null, Date.now().toString() + extension)
        },
        acl: 'public-read-write',
    })
});

module.exports = upload;
