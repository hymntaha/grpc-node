/*
* Plugin exec is:
*  protoc -I=. ./protos/calculator.proto --js_out=import_style=commonjs,binary:./server --grpc_out=./server --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin`
*
* */
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

// Prime Factor
function primeNumberDecomposition(call, callback) {
  var number = call.request.getNumber();
  var divisor = 2;
  console.log('Recevied number', number);
  while (number > 1) {
    if (number % divisor === 0) {
      var primeNumberDecompositionResponse = new calc.PrimeNumberDecompositionResponse();

      primeNumberDecompositionResponse.setPrimeFactor(divisor);
      number = number / divisor;

      call.write(primeNumberDecompositionResponse)
    } else {
      divisor++;
      console.log('Divisor has increased to ', divisor);
    }
  }
  call.end();
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


function longGreet(call, callback) {
  call.on('data', request=>{
    var fullName = request.getGreet().getFirstName() + ' ' + request.getGreet().getLastName()

    console.log('Hello ' + fullName);
  })

  call.on('error', error=>{
    console.error(error)
  })

  call.on('end', () =>{
    var response = new greets.LongGreetResponse()
    response.setResult('Long Greet Client Streaming....');
    callback(null, response)
  })
}

function computeAverage(call, callback){
  var sum = 0;
  var count = 0;

  call.on('data', request=>{
    sum += request.getNumber();
    console.log('Got number: ', request.getNumber())
    count++
  })
  call.on('error', error=>{
    console.log(error);
  })
  call.on('end', ()=>{
    // compute the actual average
    var average = sum/count;
    var response = new calc.ComputeAverageResponse();
    response.setAverage(average);

    callback(null, response);

  })
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
server.addService(service.GreetServiceClient, {sum: sum, primeNumberDecomposition: primeNumberDecomposition, longGreet:longGreet, computeAverage:computeAverage})
  server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure())
  server.start();

  console.log('Server running on port 127.0.0.1:50051')
}

main()
