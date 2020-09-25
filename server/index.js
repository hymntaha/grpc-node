const grpc = require('grpc');
const greets = require('../server/protos/greet_pb');
const service = require('../server/protos/greet_grpc_pb');

const calc = require('../server/protos/calculator_pb');
const calcService = require('../server/protos/calculator_grpc_pb');

function sum(call, callback) {
  var sumResponse = new calc.SumResponse()

  sumResponse.setSumResult(call.request.getFirstNumber() + call.request.getSecondNumber())
  callback(null, sumResponse)
}

function greetManyTimes(call, callback) {
  var firstName = call.request.getGreeting().getFirstName();

  let count = 0, intervalID = setInterval(function () {


  var greetManyTimesResponse = new greets.GreetManyTimesResponse()
  greetManyTimesResponse.setResult(firstName);

  // setup streaming
  call.write(greetManyTimesResponse);
    if (++count > 9) {
      clearInterval(intervalID);
      call.end();
    }
},1000)
}
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
  // server.addService(service.GreetServiceService, {
  //   greet: greet
  // });
  //
  // server.addService(calcService.CalculatorServiceService, {
  //   sum: sum
  // });
server.addService(service.GreetServiceClient, {greet:greet,greetManyTimes: greetManyTimes})
  server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure())
  server.start();

  console.log('Server running on port 127.0.0.1:50051')
}

main()
