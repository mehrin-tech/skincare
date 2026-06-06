import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);

    process.exit(1);
  }
};

 export default connectDB;
// // import mongoose from "mongoose";

// // const connectDB = async () => {
// //   try {
// //     console.log("URI loaded:", !!process.env.MONGO_URI);

// //     const conn = await mongoose.connect(process.env.MONGO_URI, {
// //       serverSelectionTimeoutMS: 5000,
// //     });

// //     console.log("Mongo Connected:", conn.connection.host);
// //   } catch (err) {
// //     console.log("FULL ERROR ↓");
// //     console.log(err);
// //   }
// // };

// // export default connectDB;
// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     console.log("URI exists:", !!process.env.MONGO_URI);

//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       serverSelectionTimeoutMS: 30000
//     });

//     console.log("MongoDB Connected");
//     console.log(conn.connection.host);

//   } catch (error) {
//     console.log("ERROR NAME:", error.name);
//     console.log("ERROR MESSAGE:", error.message);

//     if (error.reason?.servers) {
//       for (const [key, value] of error.reason.servers) {
//         console.log("SERVER:", key);
//         console.log(value);
//       }
//     }

//     process.exit(1);
//   }
// };

// export default connectDB;