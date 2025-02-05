import mongoose from 'mongoose'; 
import { DEV_DB_URL, NODE_ENV, PROD_DB_URL } from './serverConfig.js';


export default async function connectDB() {
    try {
         if(NODE_ENV === 'development'){
            await mongoose.connect(DEV_DB_URL);

         }
         else{
            await mongoose.connect(PROD_DB_URL);
         }
        console.log(`Connected to the database from ${NODE_ENV} environment`);
    } catch (error) {
        console.log('Error connecting to the database');
        console.log(error);
    }
}
