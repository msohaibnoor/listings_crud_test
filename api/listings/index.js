// /api/listings/index.js
const ListingsDB = require("../../modules/listingsDB.js");
const db = new ListingsDB();
db.initialize(process.env.MONGODB_CONN_STRING);

module.exports = async (req, res) => {
  if (req.method === "GET") {
    const { page, perPage, name } = req.query;
    try {
      const listings = await db.getAllListings(page, perPage, name);
      res.status(200).json(listings);
    } catch (err) {
      res
        .status(400)
        .json({ message: "Error fetching listings", error: err.message });
    }
  } else if (req.method === "POST") {
    try {
      const newListing = await db.addNewListing(req.body);
      res
        .status(201)
        .json({ message: "Listing added successfully", listing: newListing });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error adding listing", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
