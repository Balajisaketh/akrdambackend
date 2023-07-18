import express from 'express';
import {client} from './dbconnect/pgdbconnect'
import  cors from 'cors';
import { randomUUID } from 'crypto';
const app:any = express();
app.use(express.json());
app.use(cors())
const PORT:any =process.env.PORT || 5876;
app.post('/api/insertpatientsdata',(req:any, res:any) => {
    const fullname=req.body.fullname
    const age=req.body.age;
    const gender=req.body.gender
    const treattype=req.body.treattype
    const treatdate=req.body.treatdate
    const bookid=randomUUID()
    console.log(bookid,"i m bookingid: ")
    const qrydata={
      text:'INSERT INTO patients (fullname,age,gender,treatmenttype,treatmentdate,bookingid) values ($1,$2,$3,$4,$5,$6)  RETURNING *',
      values:[fullname,age,gender,treattype,treatdate,bookid]
    }
    client.query(qrydata).then((response:any)=>
            {
              console.log(response.rows,"i m responds");
              res.send({success:true,message:"insert successfully"})
              
            }).catch((err:any)=>
            {
              console.log(err.message,"i m error data")
              res.send({success:false,message:err.message})
            });
  
  })
  app.get("/api/getpatients", (req:any, res:any)=>{
     const textqry={
         text:'SELECT * from patients'
     }
     client.query(textqry).then((response:any)=>
     {
           console.log("i m res", response)
           res.send(response.rows)
     }).catch((err:any)=>{
        console.log("i m err", err)
        res.send({status:false,message:err});
     })
  })
app.post('/api/insertpays', (req:any, res:any)=>{
const price=req.body.price;
const dop=new Date();
const status=req.body.status;
const bookid=req.body.bookid;
  const qrydata={
      text:'INSERT INTO payment (price,dateofpayment,status,bookingid) values ($1,$2,$3,$4)  RETURNING *',
      values:[price,dop,status,bookid]
    }
    client.query(qrydata).then((response:any)=>
            {
              console.log(response.rows,"i m responds");
              res.send({success:true,message:"insert successfully done"})
              
            }).catch((err:any)=>
            {
              console.log(err.message,"i m error data")
              res.send({success:false,message:err.message})
            });
  

  })
  app.get("/api/getpays", (req:any, res:any)=>{
    const textqry={
        text:'SELECT * from payment'
    }
    client.query(textqry).then((response:any)=>
    {
          console.log("i m res", response)
          res.send(response.rows)
    }).catch((err:any)=>{
       console.log("i m err", err)
       res.send({status:false,message:err});
    })
 })

 app.post("/api/updatedateoftreatment", (req:any, res:any)=>{
  const qry = {
    text: 'SELECT * FROM patients where bookingid=$1',
    values: [req.body.bookingid]
};

client.query(qry).then((data) => {
    console.log(data.rows);
    const updateqtry = {
        text: 'UPDATE  patients SET treatmentdate=$1',
        values: [req.body.treatmentdate]
    };
    client.query(updateqtry).then((data) => {
        res.send({ status: true, message: "updated successfully" });
    }).catch((e) => {
        res.send({ sucess: false, messsage: e.message });
    });
}).catch((error) => {
    res.send({ sucess: false, messsage: error.message });
});
})
app.post("/api/updategender", (req:any, res:any)=>{
  const qry = {
    text: 'SELECT * FROM patients where bookingid=$1',
    values: [req.body.bookingid]
};

client.query(qry).then((data) => {
    console.log(data.rows);
    const updateqtry = {
        text: 'UPDATE  patients SET age=$1',
        values: [req.body.age]
    };
    client.query(updateqtry).then((data) => {
        res.send({ status: true, message: "updated successfully" });
    }).catch((e) => {
        res.send({ sucess: false, messsage: e.message });
    });
}).catch((error) => {
    res.send({ sucess: false, messsage: error.message });
});
})
app.post("/api/updatetreatment", (req:any, res:any)=>{
  const qry = {
    text: 'SELECT * FROM patients where bookingid=$1',
    values: [req.body.bookingid]
};

client.query(qry).then((data) => {
    console.log(data.rows);
    const updateqtry = {
        text: 'UPDATE  patients SET treatmenttype  =$1',
        values: [req.body.treattype]
    };
    client.query(updateqtry).then((data) => {
        res.send({ status: true, message: "updated successfully" });
    }).catch((e) => {
        res.send({ sucess: false, messsage: e.message });
    });
}).catch((error) => {
    res.send({ sucess: false, messsage: error.message });
});
})
app.delete('/api/deletepatient',(req:any,res:any)=>{
  const id=req.body.patientbookingid;
  const queryD = {
    text: `DELETE  FROM patients
      WHERE bookingid = $1 `,
    values: [id]
}
client.query(queryD).then((response)=>{
  console.log(response,
    'i m deletepatient')
    res.send({status:true,message:"deletion successful"})
}).catch((err)=>{
  console.log(err,"i m del err")
  res.send({status:false,message:err.message});
});
})
app.post('/api/updatepaystatus', (req:any, res:any)=>{
   const paystatus=req.body.status;
   const qry = {
    text: 'SELECT * FROM payments where paymentid=$1',
    values: [req.body.paymentid]
};

client.query(qry).then((data) => {
    console.log(data.rows);
    const updateqtry = {
        text: 'UPDATE  payments SET status=$1',
        values: [paystatus]
    };
    client.query(updateqtry).then((data) => {
        res.send({ status: true, message: "updated successfully" });
    }).catch((e) => {
      console.log("i m error in pay",e.message)
        res.send({ sucess: false, messsage: e.message });
    });
}).catch((error) => {
    res.send({ sucess: false, messsage: error.message });
});
});
app.post('/api/updateprice', (req:any, res:any)=>{
  const pay=req.body.price;
  const qry = {
   text: 'SELECT * FROM payments where paymentid=$1',
   values: [req.body.paymentid]
};

client.query(qry).then((data) => {
   console.log(data.rows);
   const updateqtry = {
       text: 'UPDATE  payments SET price=$1',
       values: [pay]
   };
   client.query(updateqtry).then((data) => {
       res.send({ status: true, message: "updated successfully" });
   }).catch((e) => {
     console.log("i m error in pay",e.message)
       res.send({ sucess: false, messsage: e.message });
   });
}).catch((error) => {
   res.send({ sucess: false, messsage: error.message });
});
});
app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});