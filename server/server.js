let express = require('express');
let path = require('path');
let fs = require('fs');
let myApp = express();

let request = require('request');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname + '/allData/users/'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var verifyStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname + '/allData/temp/'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var verifyUploader = multer({ storage: verifyStorage });


var upload = multer({ storage: storage })

let BodyParser = require('body-parser');
myApp.use(BodyParser.json());

let config = require('./config');
let jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');

let mongoose = require('mongoose');
let DemoUsers = require('.//db/models/users');
let Location = require('.//db/models/location');
let Visits = require('./db/models/visit');

mongoose.connect('mongodb://localhost:27017/DemoUsers', (err, connection) => {
    console.log(err || connection);
});

// myApp.get('/', function(req, res){
//     res.end('Main')
// });

myApp.post('/checksession', async function (req, res) {
    // console.log(req.body.token);
    var decoded = jwt_decode(req.body.token);
    console.log(decoded);
    if (decoded.id) {
        DemoUsers.findOne({ _id: decoded.id }, function (err, docs) {
            res.send(docs);
        });
    }

});

function arePointsNear(givenPoint, targetPoint, km) {
    console.log('Given point:',givenPoint)
    console.log('Target point:',targetPoint)
    console.log(km)
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * targetPoint.lat / 180.0) * ky;
    var dx = Math.abs(targetPoint.lng - givenPoint.lng) * kx;
    var dy = Math.abs(targetPoint.lat - givenPoint.lat) * ky;
    console.log(kx, dx, dy)
    console.log(Math.sqrt(dx * dx + dy * dy) + " areas ")
    return Math.sqrt(dx * dx + dy * dy) <= km;
}

myApp.post('/save-visit', async (req, res) => {

    try {

        let visitAssigned = new Visits(req.body);
        visitAssigned.verified = false;
        await visitAssigned.save();
        await visitAssigned.populate('location').execPopulate();

        res.json({ success: true, ...visitAssigned.toJSON() });

    } catch (e) {

        res.status(500).json({ success: false });

    }

});


myApp.post('/cancel-visit', async (req, res) => {

    try {

        await Visits.findByIdAndDelete(req.body.id);

        res.json({
            success: true
        })

    } catch (e) {

        res.status(500).json({
            message: e.message
        });

    }

})
myApp.post('/loadvisits', async (req, res) => {

    try {

        console.log("loading visits")
        let visits = await Visits.find({ user: req.body.id });

        await Promise.all(visits.map(async (visit) => {

            return visit.location = await Location.findById(visit.location);

        }));

        let user = await DemoUsers.findOne({ _id: req.body.id }).populate('location').exec();

        res.json({
            success: true,
            user: user,
            visits: visits
        });

    } catch (e) {

        res.status(500).send({ error: e.message });

    }

});

myApp.post('/showraps', async (req, res) => {

    try {

        let raps = await DemoUsers.find({ type: 'rap' });

        res.json({
            success: true,
            raps: raps
        });

    } catch (e) {

        res.status(500).send({ error: e.message });

    }


});


myApp.post('/ad-rap', upload.array('pics', 5), async function (req, res) {
    let allFiles = [];
    for (let file of req.files) {
        allFiles.push(file.originalname)
    }
    let user = new DemoUsers();

    user.name = req.body.name,
        user.email = req.body.email,
        user.cnic = req.body.CNIC,
        user.password = req.body.password,
        user.type = 'rap',
        user.pics = allFiles,
        user.locations = JSON.parse(req.body.locations);
    await user.save();
    res.json({
        success: true
    });
});


myApp.post('/load-rap/:id', async (req, res) => {

    try {

        let rap = await DemoUsers.findById(req.params.id)

        res.json({
            success: true,
            user: rap
        });


    } catch (e) {

        res.status(500).send(e);

    }

});

myApp.post('/verify', verifyUploader.single('fila'), async (req, res) => {
    console.log("meri location ***********************888");
    console.log(req.body);




    const onLocationVerified = (targetUser, targetLocation) => {

        const formData = {
            attachments: targetUser.pics.map((item) => {
                return fs.createReadStream(path.resolve(__dirname + '/alldata/users/' + item))

            }).concat(fs.createReadStream((req.file || { path: __dirname + '/alldata/temp/unknown.png' }).path))
        };

        request.post({ url: 'http://localhost:4000/verify', formData: formData }, async (err, httpResponse, body) => {

            console.log(err || body)

            if (!body || body && body.length > 20) {
                res.json({ success: false });
            } else if (body == 'true') {

                console.log("*******" + targetLocation._id);

                let visitApproved = await Visits.findOne({ location: targetLocation._id, verified: { $ne: true } });
                visitApproved.verified = true;
                await visitApproved.save();



                res.json({ success: true, name: targetUser.name, location: targetLocation.address });
            } else if (!body || body == 'false') {
                res.json({ success: false });

            } else if (err) {
                res.json({ success: false });

            }

        });

    };

    try {

        let targetUser = await DemoUsers.findById(req.body.userID);

        let userLocations = await Location.find({
            $or: targetUser.locations.map((location) => {
                return { _id: location };
            })
        });

        console.log(userLocations);

        console.log(req.body)

        let targetLocation = userLocations.find((location) => {

            return arePointsNear(location.position, {
                lat: req.body.latitude,
                lng: req.body.longitude
            }, 0.5);

        })

        if (targetLocation) {


            onLocationVerified(targetUser, targetLocation);
            console.log('location verified');

        } else {
            console.log('invalid location');
            res.status(500).send({ error: "Invalid location" });
        }

    } catch (e) {
        res.status(500).send({ error: e.message });

    }


});
myApp.post('/login', async function (req, res) {
    let user = await DemoUsers.findOne({ email: req.body.email, password: req.body.password })

    if (user) {
        let userToken = { id: user._id }
        jwt.sign(userToken, config.secret, {
            expiresIn: "6d"
        }, (err, token) => {
            res.json({
                token,
                success: true,
                msg: "User Found",
                _id: user._id,
                name: user.name,
                type: user.type,
                email: user.email,
                pics: user.pics
            })
        });
    } else {
        res.json({
            msg: 'User Not Found'
        })
    }
});

myApp.post('/update-rap', upload.array('pics', 5), async function (req, res) {
    let allFiles = [];
    for (let file of req.files) {
        allFiles.push(file.originalname)
    }
    if (allFiles.length != 0) {
        req.body.pics = allFiles;
    }
    req.body.locations = req.body.locations.split(',');
    req.body.locations[0] == '' && (req.body.locations.length = 0);

    await DemoUsers.findByIdAndUpdate(req.body._id, req.body);

   
    res.json({
        success: true
    });
});

myApp.post('/get-locations', async function (req, res) {

    try {

        let locations = await Location.find();
        res.json({
            locations: locations
        })

    } catch (e) {

        res.status(500).send(e);

    }

});

myApp.post('/add-location', async function (req, res) {
    console.log(req.body);
    let loc = new Location();
    loc.address = req.body.address,
        loc.position.lat = req.body.position.lat,
        loc.position.lng = req.body.position.lng,
        await loc.save();
    res.json({
        msg: "Arslan"
    });
});
myApp.use(express.static('./alldata/users'));
myApp.listen(5050, function () {
    console.log('Server in Working State')
})