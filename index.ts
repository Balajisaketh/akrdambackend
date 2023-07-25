import express from 'express';
import {client} from './dbconnect/pgdbconnect'
import  cors from 'cors';
import { randomUUID } from 'crypto';
const app:any = express();
app.use(express.json());
app.use(cors())
const PORT:any =process.env.PORT || 5876;


/*----------------insert booking-----------------------------------------*/ 



app.post('/api/insert/booking',(req:any, res:any) => {
  const data:any= req.body;
   
  console.log(data);
  const bookinguid:String=randomUUID()
  const  fullname:String =data.fullname;
  const dateofbirth:String = data.dateofbirth;
  const  mobilenumber:String= data.mobilenumber;
  const email:String = data.email;
  const wtrvtreatment:String = data.wtrvtreatment;
  const wchtreatment:String = data.wchtreatment;
  const dynamicdata:object = data.dynamicdata;
  const dateoftreatment:String = data.dateoftreatment;
  const time:String = data.time;
  const addressfrtmt:String = data.addressfrtmt;
  const street:String = data.street;
  const state:String = data.state;
  const zipcode:Number = data.zipcode;

  
  const qrydata={
    text:'INSERT INTO bookings (bookinguid,fullname,dateofbirth,mobilenumber,email,wtrvtreatment,wchtreatment,dynamicdata,dateoftreatment,time,addressfrtmt,street,state,zipcode) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)  RETURNING *',
    values:[bookinguid,fullname,dateofbirth,mobilenumber,email,wtrvtreatment,wchtreatment,dynamicdata,dateoftreatment,time,addressfrtmt,street,state,zipcode]
  }
  client.query(qrydata).then((response:any)=>
          {
            console.log({success:true,message:"booking inserted successfully"});
            res.send({success:true,message:"booking inserted successfully"})
            
          }).catch((err:any)=>
          {
            console.log({success:false,message:err.message})
            res.send({success:false,message:err.message})
          });

})


/*---------------insert contact details-------------------------------------------------------------*/


app.post('/api/insert/contact',(req:any, res:any) => {
  const data:any= req.body;
   
   
  const contactuid:String=randomUUID();
  const fullname:String = data.fullname;
  const email:String = data.email;
  const phonenumber:String = data.phonenumber;
  const message:String = data.message;
  
  const qrydata={
    text:'INSERT INTO contacts (contactuid,fullname,email,phonenumber,message) values ($1,$2,$3,$4,$5)  RETURNING *',
    values:[contactuid,fullname,email,phonenumber,message]
  }
  client.query(qrydata).then((response:any)=>
          {
            console.log({success:true,message:"contact inserted successfully"});
            res.send({success:true,message:"contact inserted successfully"})
            
          }).catch((err:any)=>
          {
            console.log({success:false,message:err.message})
            res.send({success:false,message:err.message})
          });

})





/*---------------insert contact details-------------------------------------------------------------*/


app.post('/api/insert/newsletter',(req:any, res:any) => {
  const data:any= req.body;
   
   
  const newsletteruid:String=randomUUID();
  const fullname:String = data.fullname;
  const email:String = data.email;
  const phonenumber:String = data.phonenumber;
  const state:String = data.message;
  
  const qrydata={
    text:'INSERT INTO newsletters (newsletteruid,fullname,email,phonenumber,state) values ($1,$2,$3,$4,$5)  RETURNING *',
    values:[newsletteruid,fullname,email,phonenumber,state]
  }
  client.query(qrydata).then((response:any)=>
          {
            console.log({success:true,message:"contact inserted successfully"});
            res.send({success:true,message:"contact inserted successfully"})
            
          }).catch((err:any)=>
          {
            console.log({success:false,message:err.message})
            res.send({success:false,message:err.message})
          });

})





/*----------------------------------------------------------------------------*/ 

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
