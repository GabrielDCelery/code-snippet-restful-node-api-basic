var express = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var Bear = require('./bear') ;

mongoose.connect('mongodb://localhost/beardb');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

var router = express.Router();


router.use(function (req, res, next){
	console.log('Router middleware...');
	next();
})

router.route('/bears')

	.post(function (req, res){
		var bear = new Bear({name: req.body.name});
		bear.save(function (err){
			if(err){
				res.send(err)
			} else {
				res.json({message: 'Bear ceated!'});
			}

		})
	})

	.get(function (req, res){
		Bear.find(function (err, bears){
			if(err){
				res.send(err);
			} else {
				res.json(bears);
			}
		})
	})

router.route('/bears/:bear_id')

	.get(function (req, res){
		Bear.findById(req.params.bear_id, function (err, bear){
			res.json(bear);
		})
	})

	.put(function (req, res){
		Bear.findById(req.params.bear_id, function (err, bear){
			if(err){
				res.send(err);
			} else {
				bear.name = req.body.name;
				bear.save(function (err){
					if(err){
						res.send(err);
					} else {
						res.json({message: 'Bear updated!'})
					}
				})
			}
		})
	})

	.delete(function (req, res){
		Bear.remove({
			_id: req.params.bear_id
		}, function (err, bear){
			if(err){
				res.send(err);
			} else {
				res.json({message: 'Bear deleted!'})
			}
		})
	})




app.use('/api', router);


app.listen(port);
