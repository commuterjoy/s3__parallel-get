
var AWS = require('aws-sdk')
    moment = require('moment')
    async = require('async'),
    util = require('util');

exports.go = function (opts) { 

    AWS.config.update({ 
        accessKeyId: opts.key,
        secretAccessKey: opts.secret
    });

    var s3 = new AWS.S3()
      , bucket = opts.bucket
      , prefix = opts.prefix;

    s3.listObjects({
            Bucket: bucket,
            Prefix: prefix
        }, function (err, response) {

            if (err) console.error('error ' + err);
           
            var i = 0;
            var tasks = response.Contents.map(function (object) {
                i++;
                return (function (key, bucket, i) {
                    s3.getObject({
                        Bucket: bucket,
                        Key: key
                    }, function (err, data) {
                        if (err) console.error('error ' + err);
                        console.warn(util.format('retrieved object #%s - %s', i, key));
                    }).on('httpData', function(chunk) {
                        console.log(chunk.toString()); 
                    })
                })(object.Key, bucket, i);
            })
            
            console.warn(util.format("found %s objects in '%s/%s'", tasks.length, bucket, prefix));

            async.parallel(tasks, function (err, result) {
                console.warn('all done');
            });

    })

}
