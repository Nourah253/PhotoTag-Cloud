# PhotoTag-Cloud
PhotoTag Cloud
A simple website that lets you upload photos and get AI labels using AWS Rekognition.
This project uses only serverless services: S3, Lambda Function URLs, and Rekognition.

What the website does
* Shows a simple webpage hosted on S3
* Lets you upload an image
* The image is uploaded to an S3 bucket using a presigned URL
* Another Lambda function sends the image to AWS Rekognition
* Rekognition returns labels (tags) for the image
* The image appears in a gallery on the site with its tags

How it works (simple overview)
1. The user opens the webpage
2. The webpage sends a request to a Lambda function to get a presigned upload URL
3. The user’s browser uploads the image to the images S3 bucket
4. The webpage sends the image key to another Lambda function
5. That Lambda calls Rekognition DetectLabels
6. Rekognition returns the tags
7. The webpage shows the image + tags

Project files
index.html style.css app.js README.md
Lambda code: GeneratePresignedURL.py GetImageLabels.py

STEP 1 — Create the S3 buckets
Website bucket
Name: phototag-cloud-nnm
* Turn off “Block all public access”
* Turn on “Static website hosting”
* Upload: index.html, style.css, app.js
Images bucket
Name: phototag-cloud-nnm-images
* Public access should stay ON
* Do NOT turn on static hosting
* Must allow the public to READ images

STEP 2 — Bucket policies
Website bucket policy
Allows public read of website files:
{ "Version": "2012-10-17", "Statement": [ { "Sid": "PublicReadWebsiteFiles", "Effect": "Allow", "Principal": "", "Action": "s3:GetObject", "Resource": "arn:aws:s3:::phototag-cloud-nnm/" } ] }
Images bucket policy
Allows public view and listing of images:
{ "Version": "2012-10-17", "Statement": [ { "Sid": "PublicReadImages", "Effect": "Allow", "Principal": "", "Action": "s3:GetObject", "Resource": "arn:aws:s3:::phototag-cloud-nnm-images/" }, { "Sid": "AllowListBucket", "Effect": "Allow", "Principal": "*", "Action": "s3:ListBucket", "Resource": "arn:aws:s3:::phototag-cloud-nnm-images" } ] }

STEP 3 — Images bucket CORS
[ { "AllowedHeaders": [""], "AllowedMethods": ["GET", "PUT", "POST"], "AllowedOrigins": [""], "ExposeHeaders": ["ETag"] } ]
Website bucket does not need CORS.

STEP 4 — Lambda: GeneratePresignedURL
This Lambda creates a presigned URL for uploading images.
IAM permissions needed
{ "Version": "2012-10-17", "Statement": [ { "Effect": "Allow", "Action": ["s3:PutObject", "s3:PutObjectAcl"], "Resource": "arn:aws:s3:::phototag-cloud-nnm-images/*" } ] }
Function URL settings
* Auth: NONE
* CORS:
    * Origin: *
    * Methods: POST, OPTIONS
    * Headers: Content-Type

STEP 5 — Lambda: GetImageLabels
This Lambda calls AWS Rekognition to get tags for the image.
IAM permissions needed
Allow Rekognition:
{ "Effect": "Allow", "Action": "rekognition:DetectLabels", "Resource": "*" }
Allow S3 read:
{ "Effect": "Allow", "Action": "s3:GetObject", "Resource": "arn:aws:s3:::phototag-cloud-nnm-images/*" }
Function URL settings
* Auth: NONE
* CORS enabled

STEP 6 — Update app.js
In your app.js, add your Lambda URLs:
const PRESIGN_ENDPOINT = "YOUR_PRESIGN_LAMBDA_URL"; const TAGS_AI_ENDPOINT = "YOUR_REKOG_LAMBDA_URL"; const IMAGE_BUCKET = "phototag-cloud-nnm-images";
Upload this updated app.js to the website bucket.

STEP 7 — Test everything
Open your site:
http://phototag-cloud-nnm.s3-website-us-east-2.amazonaws.com
Use browser DevTools → Network tab.
You should see:
OPTIONS → 200 POST (Presigned URL) → 200 PUT (Upload to S3) → 200 POST (Rekognition) → 200 GET (Image) → 200
If all are 200, the site works.

Final Website URL
http://phototag-cloud-nnm.s3-website-us-east-2.amazonaws.com

Tools Used
* AWS S3
* AWS Lambda
* AWS Rekognition
* HTML
* CSS
* JavaScript

Future ideas
* Add login system
* Use CloudFront with HTTPS
* Save labels in DynamoDB
* Show more info from Rekognition

Author
Ma — PhotoTag Cloud (2025)
