const grpc = require('grpc');
const greets = require('../server/protos/greet_pb');
const service = require('../server/protos/greet_grpc_pb');


/*
  Implements the greet RPC method.
 */
function greet(call, callback) {
  const greeting = new greets.GreetResponse()

  greeting.setResult(
    "Hello" + call.request.getGreeting().getFirstName()
  );

  callback(null, greeting)

}
function main() {
  var server = new grpc.Server();
  server.addService(service.GreetServiceService, {
    greet: greet
  });

  server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure())
  server.start();

  console.log('Server running on port 127.0.0.1:50051')
}

main()
