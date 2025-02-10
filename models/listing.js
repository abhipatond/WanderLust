  const mongoose = require("mongoose");

  const Schema = mongoose.Schema;

// Define the schema for a listing
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  image: {
    type: {
      filename: { type: String},
      url: { type: String},
    },
    default: {
      filename: "default-image.jpg",
      url: "https://images.unsplash.com/photo-1737069222401-afd3720775ae?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    set: (v) =>
      v === "" || !v.url
        ? {
            filename: "default-image.jpg",
            url: "https://images.unsplash.com/photo-1737069222401-afd3720775ae?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }
        : v,
  },
  price: Number,
  location: {
    type: String,
  },
  country: {
    type: String,
  },

  reviews:[
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],

});

// Create a model for the listing schema
const Listing = mongoose.model("Listing", listingSchema);

// Export the model for use in other files
module.exports = Listing;
