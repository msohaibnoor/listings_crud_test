// const mongoose = require("mongoose");
// const listingSchema = require("./listingSchema");

// module.exports = class ListingsDB {
//   constructor() {
//     // We don't have a `Listing` object until initialize() is complete
//     this.Listing = null;
//   }

//   // Pass the connection string to `initialize()`
//   initialize(connectionString) {
//     return new Promise((resolve, reject) => {
//       const db = mongoose.createConnection(connectionString);

//       db.once('error', (err) => {
//         console.error("Connection error:", err); // ADDED BY ME
//         reject(err);
//       });
//       db.once('open', () => {
//         console.log("Database connection opened successfully.");
//         this.Listing = db.model("listingsAndReviews", listingSchema);
//         resolve();
//       });
//     });
//   }

//   async addNewListing(data) {
//     const newListing = new this.Listing(data);
//     await newListing.save();
//     return newListing;
//   }

//   getAllListings(page, perPage, name) {
//     let findBy = name ? { "name": { "$regex": name, "$options": "i" } } : {}

//     if (+page && +perPage) {
//       return this.Listing.find(findBy, {reviews: 0}).sort({ number_of_reviews: -1 }).skip((page - 1) * +perPage).limit(+perPage).exec();
//     }

//     return Promise.reject(new Error('page and perPage query parameters must be valid numbers'));
//   }

//   getListingById(id) {
//     return this.Listing.findOne({ _id: id }).exec();
//   }

//   updateListingById(data, id) {
//     return this.Listing.updateOne({ _id: id }, { $set: data }).exec();
//   }

//   deleteListingById(id) {
//     return this.Listing.deleteOne({ _id: id }).exec();
//   }
// }

const mongoose = require("mongoose");
const listingSchema = require("./listingSchema");

let isConnected = false; // Track the database connection status

module.exports = class ListingsDB {
  constructor() {
    this.Listing = null;
  }

  async initialize(connectionString) {
    if (!isConnected) {
      await mongoose.connect(connectionString);
      this.Listing = mongoose.model("listingsAndReviews", listingSchema);
      isConnected = true;
    }
  }

  async addNewListing(data) {
    if (!isConnected) {
      await mongoose.connect(process.env.MONGODB_CONN_STRING);
      this.Listing = mongoose.model("listingsAndReviews", listingSchema);
      isConnected = true;
    }
    const newListing = new this.Listing(data);
    await newListing.save();
    return newListing;
  }

  async getAllListings(page, perPage, name) {
    if (!isConnected) {
      await mongoose.connect(process.env.MONGODB_CONN_STRING);
      this.Listing = mongoose.model("listingsAndReviews", listingSchema);
      isConnected = true;
    }
    let findBy = name ? { name: { $regex: name, $options: "i" } } : {};
    if (+page && +perPage) {
      return this.Listing.find(findBy, { reviews: 0 })
        .sort({ number_of_reviews: -1 })
        .skip((page - 1) * +perPage)
        .limit(+perPage)
        .exec();
    }
    throw new Error("Invalid pagination parameters");
  }

  async getListingById(id) {
    return this.Listing.findOne({ _id: id }).exec();
  }

  async updateListingById(data, id) {
    return this.Listing.updateOne({ _id: id }, { $set: data }).exec();
  }

  async deleteListingById(id) {
    return this.Listing.deleteOne({ _id: id }).exec();
  }
};
