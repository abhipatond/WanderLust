const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));  // For method override (PUT, DELETE)
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', ejsMate);


// const validateListing = (req,res,next)=>{
//         const { error } = listingSchema.validate(req.body);
//         if (error) {   
//             throw new ExpressError(400,error);
//         }
//         else{
//             next();
//         }

// }

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body, { abortEarly: false }); 
    if (error) {
        const msg = error.details.map(err => err.message).join(", ");
        throw new ExpressError(400, msg);
    }
    next();
};

app.get("/", (req, res) => {
    res.send("Working");
});

app.get("/listings", async (req, res) => {
    let allListing = await Listing.find({});
    const count = await Listing.countDocuments();
    // console.log(count);
    res.render("listings/index", { allListing, count });
});// No selection was provided, so I'll add a general improvement to the code
// by adding error handling to the routes

app.get("/", (req, res) => {
    try {
        res.send("Working");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/listings", async (req, res) => {
    try {
        let allListing = await Listing.find({});
        const count = await Listing.countDocuments();
        console.log(count);
        res.render("listings/index", { allListing, count });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


//Create new listing
app.get("/listings/new", (req, res) => {
    try {
        res.render("listings/new");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});



app.get("/listings/:id/edit", async (req, res) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        res.render("listings/edit", { listing });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.put("/listings/:id", async (req, res) => {
    try {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listings });
        res.redirect(`/listings/${id}/show`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


//Create Listing    
//Try Catch Implementation -- handling custom errors 
// app.post("/listings", async (req, res,next) => {
//     try {
//         let newListing = new Listing(req.body.listings);
//         await newListing.save();
//         res.redirect("/listings");
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Internal Server Error");
//         next(err);
//     }
// });



//WrapAsync Implementation --- Handling Custom Errors
//Create Route
app.post("/listings",validateListing, wrapAsync (async (req, res,next) => {
    
        let newListing = new Listing(req.body.listings);
        await newListing.save();
        res.redirect("/listings");
   
}));

//show Route
app.get("/listings/:id/show",wrapAsync( async (req, res) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        console.log(listing)
        res.render("listings/show", { listing: listing });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}));



//Delete Route
app.delete("/listings/:id",wrapAsync( async (req, res) => {
    try {
        let { id } = req.params;
        let deltedListing = await Listing.findByIdAndDelete(id);
        console.log(deltedListing);
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}));

app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

app.get("/listings/:id/edit", wrapAsync (async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
}));

// Corrected PUT route with proper redirect
app.put("/listings/:id", wrapAsync (async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listings });
    res.redirect(`/listings/${id}/show`);  // Redirecting to the correct 'show' route
}));

app.post("/listings", wrapAsync(async (req, res) => {
    let newListing = new Listing(req.body.listings);
    await newListing.save();
    res.redirect("/listings");
}));


//show route

app.get("/listings/:id/show",wrapAsync( async (req, res) => {
    let { id } = req.params;
        let listing = await Listing.findById(id);
        console.log(listing)
        res.render("listings/show", { listing: listing });
   
}));


//Delete Route

app.delete("/listings/:id", wrapAsync(async (req,res)=>{
    let { id } = req.params;
   let deltedListing =  await Listing.findByIdAndDelete(id);
   console.log(deltedListing);
   res.redirect("/listings");
}));


/* Connection to MongoDb*/

const MONGO_URI = "mongodb://localhost:27017/WanderLust";
main().then(() => {
    console.log("MongoDb Connected");
}).catch(() => {
    console.log("MongoDb Not Connected");
});

async function main() {
    try {
        await mongoose.connect(MONGO_URI);
    } catch (e) {
        console.log(e);
    }
}

/*connection End*/


app.all("*",(req,res,next)=>{
    // res.status(404).send("Page Not Found")
    next(new ExpressError(404,"Page not Found") );
})

/*
app.use((err,req,res,next)=>{

    let {statusCode=500 ,message="something went wrong"} = err;
    res.status(statusCode).send(message);
})*/

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message, statusCode });
});


const Port = 3000;

app.listen(Port, () => {
    console.log(`App listening on port ${Port}`);
});
