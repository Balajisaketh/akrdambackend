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
    
    
    const qrydata={
      text:'INSERT INTO patients (fullname,age,gender,treatmenttype,treatmentdate) values ($1,$2,$3,$4,$5)  RETURNING *',
      values:[fullname,age,gender,treattype,treatdate]
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
      text:'SELECT  p.fullname,p.bookingid, p.age, p.treatmenttype,p.treatmentdate,p.paymentstatus,p.gender,a.street_address,a.city,a.state,a.postal_code,a.country,m.ownmedicaldecision,m.pah,m.myastheniagravis,m.heartfailure,m.hemophilia,m.fluidonbodyparts FROM patients p JOIN address a ON p.bookingid = a.address_id LEFT JOIN medicalcondition m ON p.bookingid = m.medicalid;'
        
        //  text:'SELECT patients.fullname,age,patients.gender,patients.treatmenttype,patients.treatmentdate,medicalcondition.ownmedicaldecision,medicalcondition.pah,medicalcondition.heartfailure,medicalcondition.fluidonbodyparts,medicalcondition.hemophilia,address.street_address,address.city,address.state,address.country,address.postal_code FROM patients FULL JOIN medicalcondition ON patients.bookingid = medicalcondition.medicalid FULL JOIN address ON patients.bookingid = address.address_id;'     
        }
  
     client.query(textqry).then((response:any)=>
     {
      console.log(response.rows.city,response.rows.state,response.rows.postal_code,"address")
           console.log("i m res", response)
        
           res.send(response.rows)
     }).catch((err:any)=>{
        console.log("i m err", err)
        res.send({status:false,message:err});
     })
  })
  app.post('/api/insertaddress',(req:any, res:any)=>{
const city=req.body.city
const  country=req.body.country
const street_address=req.body.street_address
const postal_code=req.body.postal_code
const state=req.body.state
    const qrydata={
      text:'INSERT INTO address (city,street_address,state,postal_code,country) values ($1,$2,$3,$4,$5)  RETURNING *',
      values:[city,state,street_address,postal_code,country]
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
  app.post('/api/medicalstatus',(req:any, res:any)=>{
    console.log(req.body,"i m in");
    const hemophilia = req.body.hemophilia;
    const pah=req.body.pah
    const fluidonbody=req.body.fluidonbodyparts
    const heartfailure=req.body.heartfailure
    const gravis=req.body.gravis
    const medicalknowldge=req.body.knowledge
            const qrydata={
          text:'INSERT INTO medicalcondition (ownmedicaldecision,pah,heartfailure,hemophilia,fluidonbodyparts,myastheniagravis) values ($1,$2,$3,$4,$5,$6)  RETURNING *',
          values:[heartfailure,hemophilia,fluidonbody,gravis,medicalknowldge,pah]
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
