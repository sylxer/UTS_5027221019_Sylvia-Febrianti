const PROTO_PATH = "./proto/moles.proto";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const molesProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

// Connect to MongoDB using Mongoose
mongoose.connect("mongodb://0.0.0.0:27017/herodb")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
    });

// Define mongoose schema and model
const moleSchema = new mongoose.Schema({
    id: String,
    hero: String,
    release: Number,
    role: String,
    lane: String,
    image: String
});
const Mole = mongoose.model("Mole", moleSchema);

server.addService(molesProto.MoleService.service, {
    getAll: async (_, callback) => {
        try {
            const getAllMoles = await Mole.find();
            callback(null, { moles: getAllMoles });
        } catch (error) {
            console.error("Error fetching moles:", error);
            callback({
                code: grpc.status.INTERNAL,
                details: "Internal server error"
            });
        }
    },

    get: async (call, callback) => {
        try {
            const mole = await Mole.findOne({ id: call.request.id });
            if (mole) {
                callback(null, mole);
            } else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Mole not found"
                });
            }
        } catch (error) {
            console.error("Error fetching mole:", error);
            callback({
                code: grpc.status.INTERNAL,
                details: "Internal server error"
            });
        }
    },

    insert: async (call, callback) => {
        try {
            const moleData = call.request;
            const mole = new Mole({
                id: uuidv4(),
                hero: moleData.hero,
                release: moleData.release,
                role: moleData.role,
                lane: moleData.lane,
                image: moleData.image
            });
            const savedMole = await mole.save();
            callback(null, savedMole);
        } catch (error) {
            console.error("Error inserting mole:", error);
            callback({
                code: grpc.status.INTERNAL,
                details: "Internal server error"
            });
        }
    },

    update: async (call, callback) => {
        try {
            const updatedMole = await Mole.findOneAndUpdate({ id: call.request.id }, call.request, { new: true });
            if (updatedMole) {
                callback(null, updatedMole);
            } else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Mole not found"
                });
            }
        } catch (error) {
            console.error("Error updating mole:", error);
            callback({
                code: grpc.status.INTERNAL,
                details: "Internal server error"
            });
        }
    },

    remove: async (call, callback) => {
        try {
            const deletedMole = await Mole.findOneAndDelete({ id: call.request.id });
            if (deletedMole) {
                callback(null, {});
            } else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Mole not found"
                });
            }
        } catch (error) {
            console.error("Error removing mole:", error);
            callback({
                code: grpc.status.INTERNAL,
                details: "Internal server error"
            });
        }
    }
});

server.bindAsync("localhost:30043", grpc.ServerCredentials.createInsecure(), () => {
    console.log("Server running at http://localhost:30043");
});
