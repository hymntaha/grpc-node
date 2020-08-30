const greets = require('../server/protos/greet_pb');
const service = require('../server/protos/greet_grpc_pb');

const grpc = require('grpc');

function main() {
  console.log('hello from client');
  const client = new service.GreetServiceClient('localhost:50051', grpc.credentials.createInsecure())


  const request = new greets.GreetRequest();

  const greeting = new greets.Greeting();

  greeting.setFirstName("Jerry");
  greeting.setLastName("Tom");

  request.setGreeting(greeting);
  client.greet(request, (error, response) => {
    if (!error) {
      console.log("Greeting response: ", response.getResult());
    } else {
      console.log(error);
    }
  })
}



main()
