let Auction = require('../models/auctions');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

var mongodbUri = 'mongodb://cwalsh:1Moonveen@ds145053.mlab.com:45053/auctionsdb';
mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [' + db.name + ']', err);
});

db.once('open', function() {
    console.log('Successfully Connected to [' + db.name + ']');
});

router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Auction.find(function(err, auctions){
        if(err)
            res.send(err);

        res.send(JSON.stringify(auctions, null, 5));
    });
}

router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Auction.find({"_id":req.params.id}, function(err, auction){
        if(err)
            res.send('AUCTION NOT FOUND!');
        else
            res.send(JSON.stringify(auction, null, 5));
    });
}

router.addAuction = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    var auction = new Auction();

    auction.state = req.body.state;
    auction.name = req.body.name;
    auction.dateDue = req.body.dateDue;

    auction.save(function(err) {
        if(err)
            res.json({message: 'Auction NOT Added!'});
        else
            res.json({message: 'Auction Added!'});
    });

}

router.incrementLikes = (req, res) => {
    Auction.findById(req.params.id, function(err, auction) {
        if(err)
            res.send('AUCTION NOT FOUND!');
        else {
            auction.likes += 1;
            auction.save(function(err) {
                if(err)
                    res.send('LIKE NOT INCREMENTED!')
                else
                    res.send(JSON.stringify(auction, null, 5));
            });
        }
    });
}

router.deleteAuction = (req, res) => {
    Auction.findByIdAndRemove(req.params.id, function(err) {
        if(err)
            res.send('AUCTION NOT FOUND!');
        else
            res.send('AUCTION DELETED!');
    });
}

router.addBid = (req, res) => {
    Auction.findById(req.params.id, function(err, auction) {
        if(err)
            res.send('AUCTION NOT FOUND!');
        else {
            auction.highestBid += 5;
            auction.bids += 1;
            auction.save(function(err) {
                if(err)
                    res.send('LIKE NOT INCREMENTED!')
                else
                    res.send(JSON.stringify(auction, null, 5));
            });
        }
    });
}

router.countDown = (req, res) => {
    Auction.findById(req.params.id, function(err, auction){
        //Found from w3schools.com

        //Set the date we're counting down to
        var countDownDate = new Date(auction.dateDue).getTime();

        //Get todays date and time
        var now = new Date().getTime();

        //Find the distance between now and countDownDate
        var distance = countDownDate - now;

        //Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        //Output result
        if(distance < 0)
            res.send('Auction Expired!');
        else
            res.send(days + ' days ' + hours + ' hours ' + minutes + ' minutes ' + seconds + ' seconds ');
    });
}

function getByValue(array, id) {
    var result = array.filter(function(obj){return obj.id == id;} );
    return result ? result[0] : null;
}

module.exports = router;