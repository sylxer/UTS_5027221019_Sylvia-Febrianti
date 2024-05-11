const PROTO_PATH = "./proto/moles.proto";
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const MoleService = grpc.loadPackageDefinition(packageDefinition).MoleService;;

const client = new MoleService(
    "localhost:30043",
    grpc.credentials.createInsecure()
);

module.exports = client;