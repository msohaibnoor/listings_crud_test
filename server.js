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


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();


const { MONGODB_CONN_STRING } = process.env;

//Middleware

app.use(cors());
app.use(express.json());

const HTTP_PORT = process.env.PORT || 8080; // assign a port

const ListingsDB = require("./modules/listingsDB.js");
const db = new ListingsDB();


/*---------------------------------------------------------------------------------------*/
//Start the server on specified port if connection to MONGODB Atlas Cluster is Successful
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
        console.log("MongoDB Connection String: ", process.env.MONGODB_CONN_STRING);
    });
}).catch((err)=>{
    console.log("DB Connection Failed");
});


// GET ROUTE /
app.get('/', (req, res) => {
    res.send("API Listening");
  });


// POST route /api/listings
app.post('/api/listings', async(req, res) =>{
   try{
    const listingData = req.body;

    const newListing = await db.addNewListing(listingData);

    res.status(201).json({
        message: "Add Listing Success",
        listing: newListing
    });

   } catch (error)
   {
        res.status(500).json({message: "Error: Unable to add listing", error: error.message})
   }
});

// GET route /api/listings
  app.get("/api/listings", (req,res) => {
    console.log("request for /api/listings");
    db.getAllListings(req.query.page, req.query.perPage)   
        .then((listings) => {
            res.status(200).json(listings);
        })
        .catch((err) => {
            res.status(400).json(err);
        });

});

// GET route /api/listings/(_id value)
app.get("/api/listings/:_id", async (req,res) =>{
    
    try {
        const listing = await db.getListingById(req.params._id); 
        if (listing) {
            res.status(200).json(listing); // Send the listing if found
        } else {
            res.status(404).json({ message: "Listing not found" }); // Send error if not found
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving listing", error: error.message });
    }

});

// PUT route /api/listings/(_id value)
app.put("/api/listings/:_id", async (req,res) => {
    try {
        const updatedData = req.body; // Get updated data from request body
        const listingId = req.params._id; // Get the ID from request parameters

        // Update the listing in the database
        const result = await db.updateListingById(updatedData, listingId);

        res.status(200).json({
            message: `Updated listing with Id: ${listingId}`,
            result: result
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating listing", error: error.message });
    }
});

// DELETE route /api/listings/(_id value)
app.delete("/api/listings/:_id", (req,res)=>{
    db.deleteListingById(req.params._id)
    .then(() => { res.status(201).json({message: `Deleted listing ${req.params._id}`}) })
    .catch((err) => { res.status(500).json({message: "Unable to Delete Listing"}) })
});

module.exports = app;