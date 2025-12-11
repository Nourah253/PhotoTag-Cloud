# PhotoTag-Cloud



PhotoTag Cloud
A cloud-based website that allows users to upload images and automatically receive AI-generated tags using Amazon Rekognition. The system is fully serverless and built using AWS services.

Project Description
PhotoTag Cloud is a serverless image-processing system. A user uploads a photo → the system stores it in S3 → a Lambda function analyzes the image → Rekognition generates tags → the website displays the image with its labels.
This project demonstrates how cloud components can work together to build a complete workflow without any servers.

Features
* Upload images from a web page
* Store images in Amazon S3
* Automatically generate labels using AWS Rekognition
* Process uploads using AWS Lambda
* Store and retrieve tags using DynamoDB
* Simple, fast, and serverless architecture

Technologies Used
* Amazon S3 – website hosting + image storage
* AWS Lambda – backend logic
* Amazon Rekognition – AI image labeling
* Amazon DynamoDB – storing tags (optional)
* HTML, CSS, JavaScript – frontend files

System Architecture 
1. User opens the website (hosted on S3)
2. User uploads an image
3. Image is saved in the S3 images bucket
4. Lambda function runs automatically
5. Lambda sends image to Rekognition
6. Rekognition returns labels
7. Website displays the photo + its tags

Project Structure
index.html
style.css
app.js
README.md

/lambda
   GeneratePresignedURL.py
   GetImageLabels.py

How to Use the Project
1. Open the website hosted on the S3 Website Bucket
2. Click the Upload Image button
3. Select a photo from your device
4. Wait for the system to process it
5. View the image and its generated tags in the gallery

AWS Components Used
1. S3 Buckets
* phototag-cloud-nnm → website hosting
* phototag-cloud-nnm-images → image storage
2. Lambda Functions
* GeneratePresignedURL – creates upload URL
* GetImageLabels – calls Rekognition and returns tags
3. Other AWS Services
* Amazon Rekognition
* Amazon DynamoDB 

Challenges We Faced
* Issues uploading images from the website to S3
* CORS configuration problems
* Wrong or missing IAM permissions
* Debugging frontend → S3 interface
* Limited time for testing all components together

Testing Summary
* Tested S3 uploads → fixed the issue and now working
* Website loads correctly and runs JavaScript
* Lambda functions work when tested manually
* Rekognition returns correct labels
* DynamoDB insert/read operations work
* Full system works after fixing S3 upload problem

What We Learned
* How different AWS serverless components work together
* How to create and test Lambda functions
* How S3 permissions, CORS rules, and IAM roles affect the system
* How AWS Rekognition processes and labels images
* Debugging real cloud-based issues
* Designing scalable cloud architectures

Future Improvements
* Improve gallery UI
* Add pagination
* Allow multiple image uploads
* Add mobile support
* Use CloudWatch for better monitoring
* Use CloudFront for faster loading and HTTPS


Conclusion
PhotoTag Cloud successfully demonstrates how to build a serverless image-processing system using AWS. By integrating S3, Lambda, Rekognition, and DynamoDB, the project performs automatic photo uploading, processing, and tagging. After fixing the final S3 upload issue, the system works as intended and is ready for future enhancements.

Final website URL
http://phototag-cloud-nnm.s3-website.us-east-2.amazonaws.com/

