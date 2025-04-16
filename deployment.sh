npm run build

aws s3 rm s3://lgat-frontend-app --recursive
aws s3 cp out/ s3://lgat-frontend-app --recursive --exclude "index.html" --cache-control "max-age=86400"
aws s3 cp out/index.html s3://lgat-frontend-app --cache-control "max-age=0, s-maxage=86400"
aws cloudfront create-invalidation --distribution-id EP4E1S47CW5UJ --paths "/*"