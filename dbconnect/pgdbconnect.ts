 


import  {Client} from 'pg';


const client:Client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'akramdb',
    password: '1234',
    port: 5432,
  })
 


const connect:any = async()=>{   
     try {  
        await client.connect();
               console.log("postgres database connected succesfully") 
      
   } catch(err:any) { 
       console.error(err) 
   } 
}
 
 connect()


export {client};