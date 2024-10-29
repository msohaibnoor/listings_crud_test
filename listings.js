const ListingsDB = require("./modules/listingsDB");
const db = new ListingsDB();

module.exports = async (req, res) => {
  await db.initialize(process.env.MONGODB_CONN_STRING);
  const { page = 1, perPage = 10, name = "" } = req.query;

  try {
    const listings = await db.getAllListings(page, perPage, name);
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
