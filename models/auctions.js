let mongoose = require('mongoose');

let AuctionSchema = new mongoose.Schema({
    state: String,
    name: String,
    highestBid: {type: Number, default: 0},
    dateDue: String,
    likes: {type: Number, default: 0},
    bids: {type: Number, default: 0}
    },
    {collection: 'auctionsdb'});

module.exports = mongoose.model('Auction', AuctionSchema);


