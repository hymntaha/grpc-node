const greets = require('../server/protos/greet_pb');
const service = require('../server/protos/greet_grpc_pb');

const calc = require('../server/protos/calculator_pb');
const calcService = require('../server/protos/calculator_grpc_pb');

const grpc = require('grpc');

function callSum(){
  const client = new calcService.CalculatorServiceClient('localhost:50051', grpc.credentials.createInsecure())
  var sumRequest = new calc.SumRequest()

  sumRequest.setFirstNumber(10)
  sumRequest.setSecondNumber(15)

  client.sum(sumRequest, (error, response)=>{
    if (!error) {
      console.log(sumRequest.getFirstNumber() + " + " + sumRequest.getSecondNumber() + " = " + response.getSumResult());
    } else {
      console.log(error);
    }
  })
}

function callGreetings(){
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


function main() {
  callGreetings()
  callSum()
}



main()
