const greets = require('../server/protos/greet_pb');
const service = require('../server/protos/greet_grpc_pb');

const grpc = require('grpc');

const services = require('../../protos/dummy_grpc_pb');

function main() {
  console.log('hello from client');
  const client = new service.GreetServiceClient('localhost:50051', grpc.credentials.createInsecure())
}

main()
