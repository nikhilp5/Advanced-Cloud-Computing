const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("computeandstorage.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const aws = require("aws-sdk");
const fs = require("fs");

let protoDescriptor =
  grpc.loadPackageDefinition(packageDefinition).computeandstorage;

aws.config.update({
  accessKeyId: "accessKeyId",
  secretAccessKey: "secretAccessKey+MhF",
  sessionToken:"sessionToken",
  region: "region"
});
const bucketName = "csci-5409-a2-assignment";
const keyName = "file.txt";

function StoreData(call, callback) {
  const fileContent = call.request.data;
  const s3 = new aws.S3();
  const uploadParams = {
    Bucket: bucketName,
    Key: keyName,
    Body: fileContent,
  };
  s3.upload(uploadParams, (err, data) => {
    if (err) {
      console.error("Error uploading", err);
    } else {
      console.log("File uploaded");
      let location = data.Location;
      let response = {
        s3uri: `${location}`,
      };
      callback(null, response);
    }
  });
}

function AppendData(call, callback) {
  let response = {};
  const s3 = new aws.S3();
  const newFileContent = call.request.data;
  s3.getObject({ Bucket: bucketName, Key: keyName }, (err, data) => {
    if (err) {
      console.error("Error reading", err);
    } else {
      const existingContent = data.Body.toString();
      const updatedContent = existingContent + newFileContent;

      const uploadParams = {
        Bucket: bucketName,
        Key: keyName,
        Body: updatedContent,
      };
      s3.upload(uploadParams, (err, data) => {
        if (err) {
          console.error("Error uploading", err);
        } else {
          console.log("File uploaded");
        }
      });
    }
  });
  callback(null, response);
}

function DeleteFile(call, callback) {
  const s3 = new aws.S3();
  let response = {};
  const deleteParams = {
    Bucket: bucketName,
    Key: keyName,
  };
  s3.deleteObject(deleteParams, (err, data) => {
    if (err) {
      console.error("Error deleting", err);
    } else {
      console.log("File deleted");
    }
  });
  callback(null, response);
}

function main() {
  let server = new grpc.Server();
  server.addService(protoDescriptor.EC2Operations.service, {
    StoreData: StoreData,
    AppendData: AppendData,
    DeleteFile: DeleteFile,
  });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
    }
  );
}

main();
