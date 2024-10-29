// /api/listings/[id].js
const ListingsDB = require("../../modules/listingsDB.js");
const db = new ListingsDB();
db.initialize(process.env.MONGODB_CONN_STRING);

module.exports = async (req, res) => {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const listing = await db.getListingById(id);
      if (listing) {
        res.status(200).json(listing);
      } else {
        res.status(404).json({ message: "Listing not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving listing", error: error.message });
    }
  } else if (req.method === "PUT") {
    try {
      const updatedListing = await db.updateListingById(req.body, id);
      res
        .status(200)
        .json({
          message: `Listing updated successfully`,
          result: updatedListing,
        });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating listing", error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      await db.deleteListingById(id);
      res.status(200).json({ message: `Listing deleted successfully` });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting listing", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
