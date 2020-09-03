const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const grpc = require('grpc');


// grpc service definition for greet
const greetProtoPath = path.join(__dirname, '..', 'protos', 'greet.proto');
const greetProtoDefinition = protoLoader.loadSync(greetProtoPath,{
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

const greetPackageDefinition = grpc.loadPackageDefinition(greetProtoDefinition).greet;

function main() {
  const server = new grpc.Server();
  server.addService(greetPackageDefinition.GreetService.service, {
    greet: greet
  })

  server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure());
  server.start()
  console.log('Server is running')
}

main ()
