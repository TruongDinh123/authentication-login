("use strict");

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const {
  db: { host, name, port },
} = require("../config/config.mongdb");
const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 80,
      })
      .then((_) => {
        console.log(`Connect mongodb success`);
      })
      .catch((err) => {
        console.log(`Connect mongodb fail`, err);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
