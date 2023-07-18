"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pgdbconnect_1 = require("./dbconnect/pgdbconnect");
const cors_1 = __importDefault(require("cors"));
const crypto_1 = require("crypto");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = process.env.PORT || 5876;
app.post('/api/insertpatientsdata', (req, res) => {
    const fullname = req.body.fullname;
    const age = req.body.age;
    const gender = req.body.gender;
    const treattype = req.body.treattype;
    const treatdate = req.body.treatdate;
    const bookid = (0, crypto_1.randomUUID)();
    console.log(bookid, "i m bookingid: ");
    const qrydata = {
        text: 'INSERT INTO patients (fullname,age,gender,treatmenttype,treatmentdate,bookingid) values ($1,$2,$3,$4,$5,$6)  RETURNING *',
        values: [fullname, age, gender, treattype, treatdate, bookid]
    };
    pgdbconnect_1.client.query(qrydata).then((response) => {
        console.log(response.rows, "i m responds");
        res.send({ success: true, message: "insert successfully" });
    }).catch((err) => {
        console.log(err.message, "i m error data");
        res.send({ success: false, message: err.message });
    });
});
app.get("/api/getpatients", (req, res) => {
    const textqry = {
        text: 'SELECT * from patients'
    };
    pgdbconnect_1.client.query(textqry).then((response) => {
        console.log("i m res", response);
        res.send(response.rows);
    }).catch((err) => {
        console.log("i m err", err);
        res.send({ status: false, message: err });
    });
});
app.post('/api/insertpays', (req, res) => {
    const price = req.body.price;
    const dop = new Date();
    const status = req.body.status;
    const bookid = req.body.bookid;
    const qrydata = {
        text: 'INSERT INTO payment (price,dateofpayment,status,bookingid) values ($1,$2,$3,$4)  RETURNING *',
        values: [price, dop, status, bookid]
    };
    pgdbconnect_1.client.query(qrydata).then((response) => {
        console.log(response.rows, "i m responds");
        res.send({ success: true, message: "insert successfully done" });
    }).catch((err) => {
        console.log(err.message, "i m error data");
        res.send({ success: false, message: err.message });
    });
});
app.get("/api/getpays", (req, res) => {
    const textqry = {
        text: 'SELECT * from payment'
    };
    pgdbconnect_1.client.query(textqry).then((response) => {
        console.log("i m res", response);
        res.send(response.rows);
    }).catch((err) => {
        console.log("i m err", err);
        res.send({ status: false, message: err });
    });
});
app.post("/api/updatedateoftreatment", (req, res) => {
    const qry = {
        text: 'SELECT * FROM patients where bookingid=$1',
        values: [req.body.bookingid]
    };
    pgdbconnect_1.client.query(qry).then((data) => {
        console.log(data.rows);
        const updateqtry = {
            text: 'UPDATE  patients SET treatmentdate=$1',
            values: [req.body.treatmentdate]
        };
        pgdbconnect_1.client.query(updateqtry).then((data) => {
            res.send({ status: true, message: "updated successfully" });
        }).catch((e) => {
            res.send({ sucess: false, messsage: e.message });
        });
    }).catch((error) => {
        res.send({ sucess: false, messsage: error.message });
    });
});
app.post("/api/updategender", (req, res) => {
    const qry = {
        text: 'SELECT * FROM patients where bookingid=$1',
        values: [req.body.bookingid]
    };
    pgdbconnect_1.client.query(qry).then((data) => {
        console.log(data.rows);
        const updateqtry = {
            text: 'UPDATE  patients SET age=$1',
            values: [req.body.age]
        };
        pgdbconnect_1.client.query(updateqtry).then((data) => {
            res.send({ status: true, message: "updated successfully" });
        }).catch((e) => {
            res.send({ sucess: false, messsage: e.message });
        });
    }).catch((error) => {
        res.send({ sucess: false, messsage: error.message });
    });
});
app.post("/api/updatetreatment", (req, res) => {
    const qry = {
        text: 'SELECT * FROM patients where bookingid=$1',
        values: [req.body.bookingid]
    };
    pgdbconnect_1.client.query(qry).then((data) => {
        console.log(data.rows);
        const updateqtry = {
            text: 'UPDATE  patients SET treatmenttype  =$1',
            values: [req.body.treattype]
        };
        pgdbconnect_1.client.query(updateqtry).then((data) => {
            res.send({ status: true, message: "updated successfully" });
        }).catch((e) => {
            res.send({ sucess: false, messsage: e.message });
        });
    }).catch((error) => {
        res.send({ sucess: false, messsage: error.message });
    });
});
app.delete('/api/deletepatient', (req, res) => {
    const id = req.body.patientbookingid;
    const queryD = {
        text: `DELETE  FROM patients
      WHERE bookingid = $1 `,
        values: [id]
    };
    pgdbconnect_1.client.query(queryD).then((response) => {
        console.log(response, 'i m deletepatient');
        res.send({ status: true, message: "deletion successful" });
    }).catch((err) => {
        console.log(err, "i m del err");
        res.send({ status: false, message: err.message });
    });
});
app.post('/api/updatepaystatus', (req, res) => {
    const paystatus = req.body.status;
    const qry = {
        text: 'SELECT * FROM payments where paymentid=$1',
        values: [req.body.paymentid]
    };
    pgdbconnect_1.client.query(qry).then((data) => {
        console.log(data.rows);
        const updateqtry = {
            text: 'UPDATE  payments SET status=$1',
            values: [paystatus]
        };
        pgdbconnect_1.client.query(updateqtry).then((data) => {
            res.send({ status: true, message: "updated successfully" });
        }).catch((e) => {
            console.log("i m error in pay", e.message);
            res.send({ sucess: false, messsage: e.message });
        });
    }).catch((error) => {
        res.send({ sucess: false, messsage: error.message });
    });
});
app.post('/api/updateprice', (req, res) => {
    const pay = req.body.price;
    const qry = {
        text: 'SELECT * FROM payments where paymentid=$1',
        values: [req.body.paymentid]
    };
    pgdbconnect_1.client.query(qry).then((data) => {
        console.log(data.rows);
        const updateqtry = {
            text: 'UPDATE  payments SET price=$1',
            values: [pay]
        };
        pgdbconnect_1.client.query(updateqtry).then((data) => {
            res.send({ status: true, message: "updated successfully" });
        }).catch((e) => {
            console.log("i m error in pay", e.message);
            res.send({ sucess: false, messsage: e.message });
        });
    }).catch((error) => {
        res.send({ sucess: false, messsage: error.message });
    });
});
app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`);
});
