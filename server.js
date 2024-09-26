/********************************************************************************
*  WEB422 – Assignment 1
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Arik Hassan | Student ID: 150 398 204 | Date: 2024/09/13
*
*  Published URL: https://web-422-assignment1-pi.vercel.app/
*
********************************************************************************/


const express = require('express'); // "require" the Express module
const cors = require('cors'); // "require" the cors package

require('dotenv').config(); // require dotenv package

//const { MONGODB_CONN_STRING } = process.env;

const app = express(); // obtain the "app" object

//declare cors (Cross origin resource sharing)
app.use(cors());
// enable parsing of JSON route requests
app.use(express.json());

const ListingsDB = require("./modules/listingsDB.js");
const db = new ListingsDB();


const HTTP_PORT = process.env.PORT || 8080; // assign a port


// GET ROUTE /
app.get('/', (req, res) => {
    res.send('API Listening');
  });

// POST route /api/listings
app.post('/api/listings', async(req, res) =>{
   try{
    const listingData = req.body;

    const newListing = await db.addNewListing(listingData);

    res.status(201).json({
        message: "Added Listing Successfully",
        listing: newListing
    });

   } catch (error)
   {
        res.status(500).json({message: "Error: Unable to add listing", error: error.message})
   }
});

// GET route /api/listings
app.get("/api/listings", async (req,res)=>{
    res.status(201).json({ message: "Get listing by page, perPage and string" });
  });

// GET route /api/listings/(_id value)
app.get("/api/listings/:_id", (req,res) =>{
    res.send({message: `get listing with Id: ${req.params._id}`});
});

// PUT route /api/listings/(_id value)
app.put("/api/listings/:_id", (req,res) => {
    res.send({message: `update listing with Id: ${req.params._id}`});
});

// DELETE route /api/listings/(_id value)
app.delete("/api/listings/:_id", (req,res)=>{
    db.deleteListingById(req.params._id)
    .then(() => { res.status(201).json({message: `Deleted listing ${req.params._id}`}) })
    .catch((err) => { res.status(500).json({error: err}) })
});


/*---------------------------------------------------------------------------------------*/
//Start the server on specified port if connection to MONGODB Atlas Cluster is Successful
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});

module.exports = app;

