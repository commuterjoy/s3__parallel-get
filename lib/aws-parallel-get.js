
var AWS = require('aws-sdk')
    moment = require('moment')
    async = require('async'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter;

var S3Get = function (opts) {

    AWS.config.update({
        accessKeyId: opts.key,
        secretAccessKey: opts.secret
    });

    var s3 = new AWS.S3()
      , bucket = opts.bucket
      , prefix = opts.prefix
      , self = this;

    this.go = function () {
        var batches = 0;
        recurseListObjects(null, batches, function(err, batches){
          if(err) console.error('error' + err);

          console.warn(util.format('started #%s batches', batches));
        });
    }

    function recurseListObjects(marker, batches, callback) {
      s3.listObjects({
        Bucket: bucket,
        Prefix: prefix,
        Marker: marker
      }, function (err, response) {

        if (err) console.error('error ' + err);
        batches++;

        if(response.IsTruncated === false){
          callback(err, batches);
        }
        else{
          var marker = response.Contents[response.MaxKeys - 1].Key;
          recurseListObjects(marker, batches, callback);
        }

        var i = 0;
        var tasks = response.Contents.map(function (object) {
          i++;
          return (function (key, bucket, i) {
            s3.getObject({
              Bucket: bucket,
              Key: key
            }, function (err, data) {
              if (err) console.error('error ' + err);
              console.warn(util.format('retrieved object #%s - %s in batch #%s', i, key, batches));
            }).on('httpData', function(chunk, response) {
              self.emit('data', chunk.toString());
            })
          })(object.Key, bucket, i);
        })

        console.warn(util.format("found %s objects in '%s/%s' in batch #%s", tasks.length, bucket, prefix, batches));

        async.parallel(tasks, function (err, result) {
          console.warn('batch complete');
        });
      })
    }
}

util.inherits(S3Get, EventEmitter);

exports.s3get = S3Get
