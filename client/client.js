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

function callGreetManyTimes() {
  var client = new service.GreetServiceClient(
    'localhost:50051',
    grpc.credentials.createInsecure()
  );
  var request = new greets.GreetManyTimesRequest();

  var greeting = new greets.Greeting()
  greeting.setFirstName('Taha');
  greeting.setLastName('Dichone');

  request.setGreeting(greeting)
  var call = client.greetManyTimes(request, () => {});

  call.on('data', (response)=>{
    console.log('Client streaming response: ', response.getResult());
  })
  call.on('status',(status)=>{
    console.log(status)
  })
  call.on('error', (error)=>{
    console.error(error)
  })
    call.on('end',()=>{
      console.log('Streaming ended');
    })
}

function callLongGreeting() {
  var client = new calcService.GreetServiceClient(
    "localhost:50051",
    grpc.credentials.createInsecure()
  )
  var reqeust = new greet.LongGreetRequest();
  var call = client.longGreet(request, (error, response)=>{
    if (!error) {
      console.log('Server response: '. response.getResult())
    } else {
      console.log(error)
    }
  })

  let count = 0, intervalId = setInterval(function () {
    console.log('Sending message ' + count)
    var request = new greets.LongGreetRequest();
    var greeting = new greets.Greeting()
    greeting.setFirstName('Taha');
    greeting.setLastName('Uygun');

    request.setGreet(greeting);

    call.write(request)

    if (++count > 3) {
      clearInterval(intervalId);
      call.end()
    }
  }, 1000);
}

function callPrimeNumberDecomposition() {
  // var client = new calcService.CalculatorServiceClient(
  //   "localhost:50051",
  //   grpc.credentials.createInsecure()
  // )
  // var reqeust = new calc.PrimeNumberDecompositionRequest()
  // var number = 567890
  // reqeust.setNumber(number);
  //
  // var call = client.primeNumberDecomposition(request, () =>{
  //
  // })
  //
  // call.on('data', response=>{
  //   console.log('Prime Factors found: ', response.getPrimeFactor())
  // })
  //
  // call.on('error', error=>{
  //   console.log(error)
  //
  // })
  //
  // call.on('status', status=>{
  //   console.log(status)
  //
  // })
  // call.on('end', ()=>{
  //   console.log('Streaming Ended!')
  // })
}

function callComputeAverage() {
  var client = new calcService.CalculatorServiceClient(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  var request = new calc.ComputeAverageRequest();
  var call = client.computeAverage(request, (error, response) => {
    if (!error) {
      console.log(
        "Received a response from the server - Average: " +
        response.getAverage()
      );
    } else {
      console.error(error);
    }
  });

  var request = new calc.ComputeAverageRequest();
  // request.setNumber(1)

  for (var i = 0; i < 1000000; i++) {
    var request = new calc.ComputeAverageRequest();
    request.setNumber(i);
    call.write(request);
  }

  call.end();
  // var request = new calc.ComputeAverageRequest();
  // request.setNumber(1);
  //
  // var requestTwo = new calc.ComputeAverageRequest();
  // requestTwo.setNumber(2);
  //
  // var requestThree = new calc.ComputeAverageRequest();
  // requestThree.setNumber(3);
  //
  // var requestFour = new calc.ComputeAverageRequest();
  // requestFour.setNumber(4);

  call.write(request)
  call.write(requestTwo)
  call.write(requestThree)
  call.write(requestFour)

  call.end()
}
function main() {
  // callGreetManyTimes()
  // callGreetings()
  // callSum()
  callPrimeNumberDecomposition()
  callComputeAverage()
}



main()
