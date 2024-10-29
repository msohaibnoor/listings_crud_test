// /api/listings/index.js
const ListingsDB = require("../../modules/listingsDB.js");
const db = new ListingsDB();
db.initialize(process.env.MONGODB_CONN_STRING);
// db.initialize(process.env.MONGODB_CONN_STRING)
//   .then(() => {
//     console.log("Database connection successful.");

//     // Start the server only after the database connection is established
//     app.listen(HTTP_PORT, () => {
//       console.log(`Server is running on port ${HTTP_PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("Failed to connect to the database:", err);
//     process.exit(1); // Exit the app if the database connection fails
  // });

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
