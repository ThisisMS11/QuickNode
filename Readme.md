There are 3 services which need to be made for the hosting platform : 
```mermaid
graph LR
A(Hosting Website) --> B(Upload Service) 
A --> C(Deployment Service)
A --> D(Request Handling Service)
```

## Upload Service
In upload service,we upload the files of our project to a remote **object store** like the one which **s3** provides. The process begins with cloning files from remote git url to our system and then using aws-sdk to upload those files to s3. After this process we push **id** into **redis queue** which acts as an unique identifier to access files from s3 . Inserting **id** into the queue also sends a signal to the deployment servers to take the charge.
```mermaid
graph LR
B(Upload Service) --> |1. github repo |C(Github) -->|2. Cloning repo|B
B --> |A unique identifier for the uploaded files| F(id)
F --> |5. push| G(Redis Queue)
B --> |3. uploading files to s3 |D(S3)
D --> |4. files are stored in object store| E(Object store)
```

## what are Object stores ? 
Object stores are cloud-based storage solutions for managing data as objects, each containing data and metadata. They offer scalability, durability, and accessibility via APIs, making them ideal for storing various types of unstructured data, including code files, images, and documents. Popular examples include Amazon S3, Google Cloud Storage, and Microsoft Azure Blob Storage.

## Deployment Service
The process begins with downloading the original files from the s3 store and then building project for optimization . Once built, upload the build files back to s3.
```mermaid
graph LR
A(queue) --> |1. receive id from queue|B(Deployment Service) --> |2. Fetch Original files from s3 using id|C(s3) -->|3. files|B
B -->|4. building project| D(Build folder) -->|6.done|B
D --> |5. upload build folder back to s3| E(s3)
B--> |7.Providing URL| G(user)
```

## Request Handler Service
This service acts as an interface for the user to request access to the deployed project. The requester hits the URL in the browser, which then collects the build files from S3 and renders them to display the content.
```mermaid
graph LR
A(Requester) -->|url|B(Browser) --> |requesting for files| C(S3) 
C --> |built files|B
B --> |render|A
```