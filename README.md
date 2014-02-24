Download from s3 in parallel, with node.js

## Usage

```
export AWS_KEY=<key>
export AWS_SECRET=<secret>
node bin/s3get --bucket <bucket> --prefix <path/to/files>
```

Progress is printed to stderr,

```
found 4 objects in 'logs/production/access.log/2014/02/22'
retrieved object #2 - PROD/access.log/2014/02/22/access.i-13e5f250b
retrieved object #4 - PROD/access.log/2014/02/22/access.i-13e5f250d
retrieved object #3 - PROD/access.log/2014/02/22/access.i-13e5f250c
retrieved object #1 - PROD/access.log/2014/02/22/access.i-13e5f250a
done
```
