const mongoose = require('mongoose');
const connectDB = async () => {
   try{
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        dbName: 'royalnestproject'
    });
    consolwe.log(`MongoDB Connected: ${conn.connection.host}`);

   } catch (error) {
    console.error(`MONGO DB error: ${error.message}`);
    process.exit(1);
   }
};
module.exports = connectDB;