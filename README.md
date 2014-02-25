[s3cmd](http://s3tools.org/s3cmd) is great, but too slow for downloading lots of files from s3. Instead, **s3__parallel-get** lets you download many files concurrently, meaning you get your files quicker.

Downloading 150MB of log files split over 150 files, **s3cmd** took around 100 seconds, whereas **s3-parallel-get** took just under 25 seconds.

## Installation

Just a standard npm install,

```
npm install -g s3-parallel-get
```

## Usage

```
export AWS_KEY=<key>
export AWS_SECRET=<secret>
node bin/s3get --bucket <bucket> --prefix <path/to/files>
```

**s3__parallel-get** was built for fetching log files, so output is sent to `stdout` for piping in to other commands.

Progress is printed to stderr,

```
found 4 objects in 'logs/production/access.log/2014/02/22'
retrieved object #2 - PROD/access.log/2014/02/22/access.i-13e5f250-b
retrieved object #4 - PROD/access.log/2014/02/22/access.i-13e5f250-d
retrieved object #3 - PROD/access.log/2014/02/22/access.i-13e5f250-c
retrieved object #1 - PROD/access.log/2014/02/22/access.i-13e5f250-a
done
```

## Programmatic

```
var s3get = require('../lib/aws-parallel-get').s3get

// Set some options
var opts = {
    bucket: program.bucket,
    prefix: program.prefix,
    key: program.key,
    secret: program.secret
});

var s3 = new s3get(opts)

// write a handler for the s3 stream
s3.on('data', function (data) {
    process.stdout.write("*" + data)
})  

// kick it off
s3.go();
```
