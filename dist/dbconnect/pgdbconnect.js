"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const pg_1 = require("pg");
const client = new pg_1.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'akramdb',
    password: '1234',
    port: 5432,
});
exports.client = client;
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log("postgres database connected succesfully");
    }
    catch (err) {
        console.error(err);
    }
});
connect();
