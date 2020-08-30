const grpc = require('grpc');

const services = require('../../protos/dummy_grpc_pb');

function main() {
  console.log('hello from client');
  const client = new services.DummyServiceClient('localhost:50051', grpc.credentials.createInsecure())
}

main()