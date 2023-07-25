"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pgdbconnect_1 = require("./dbconnect/pgdbconnect");
const cors_1 = __importDefault(require("cors"));
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
    const qrydata = {
        text: 'INSERT INTO patients (fullname,age,gender,treatmenttype,treatmentdate) values ($1,$2,$3,$4,$5)  RETURNING *',
        values: [fullname, age, gender, treattype, treatdate]
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
        text: 'SELECT  p.fullname,p.bookingid, p.age, p.treatmenttype,p.treatmentdate,p.paymentstatus,p.gender,a.street_address,a.city,a.state,a.postal_code,a.country,m.ownmedicaldecision,m.pah,m.myastheniagravis,m.heartfailure,m.hemophilia,m.fluidonbodyparts FROM patients p JOIN address a ON p.bookingid = a.address_id LEFT JOIN medicalcondition m ON p.bookingid = m.medicalid;'
        //  text:'SELECT patients.fullname,age,patients.gender,patients.treatmenttype,patients.treatmentdate,medicalcondition.ownmedicaldecision,medicalcondition.pah,medicalcondition.heartfailure,medicalcondition.fluidonbodyparts,medicalcondition.hemophilia,address.street_address,address.city,address.state,address.country,address.postal_code FROM patients FULL JOIN medicalcondition ON patients.bookingid = medicalcondition.medicalid FULL JOIN address ON patients.bookingid = address.address_id;'     
    };
    pgdbconnect_1.client.query(textqry).then((response) => {
        console.log(response.rows.city, response.rows.state, response.rows.postal_code, "address");
        console.log("i m res", response);
        res.send(response.rows);
    }).catch((err) => {
        console.log("i m err", err);
        res.send({ status: false, message: err });
    });
});
app.post('/api/insertaddress', (req, res) => {
    const city = req.body.city;
    const country = req.body.country;
    const street_address = req.body.street_address;
    const postal_code = req.body.postal_code;
    const state = req.body.state;
    const qrydata = {
        text: 'INSERT INTO address (city,street_address,state,postal_code,country) values ($1,$2,$3,$4,$5)  RETURNING *',
        values: [city, state, street_address, postal_code, country]
    };
    pgdbconnect_1.client.query(qrydata).then((response) => {
        console.log(response.rows, "i m responds");
        res.send({ success: true, message: "insert successfully" });
    }).catch((err) => {
        console.log(err.message, "i m error data");
        res.send({ success: false, message: err.message });
    });
});
app.post('/api/medicalstatus', (req, res) => {
    console.log(req.body, "i m in");
    const hemophilia = req.body.hemophilia;
    const pah = req.body.pah;
    const fluidonbody = req.body.fluidonbodyparts;
    const heartfailure = req.body.heartfailure;
    const gravis = req.body.gravis;
    const medicalknowldge = req.body.knowledge;
    const qrydata = {
        text: 'INSERT INTO medicalcondition (ownmedicaldecision,pah,heartfailure,hemophilia,fluidonbodyparts,myastheniagravis) values ($1,$2,$3,$4,$5,$6)  RETURNING *',
        values: [heartfailure, hemophilia, fluidonbody, gravis, medicalknowldge, pah]
    };
    pgdbconnect_1.client.query(qrydata).then((response) => {
        console.log(response.rows, "i m responds");
        res.send({ success: true, message: "insert successfully" });
    }).catch((err) => {
        console.log(err.message, "i m error data");
        res.send({ success: false, message: err.message });
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
