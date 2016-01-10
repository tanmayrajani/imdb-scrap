var nm = "nm1567113";	// Jessica Chastain, bitches! <3
var request = require("request"),
	cheerio = require("cheerio"),
	fs = require('fs'),
	sc = [],
	url = "http://www.imdb.com/name/"+nm+"/mediaindex?page=" ;
var number;

request(url, function (error, response, body) {
	if (!error) {
		var $ = cheerio.load(body),
		num = $('.desc').first().text();
		number = num.substring(num.indexOf('of')+3,num.lastIndexOf(0)+1);
		var nextUrl = 'http://imdb.com' + $('.media_index_thumb_list a:nth-child(1)').attr('href');
		console.log(nextUrl)
		console.log(number)

		everyFuckingPhoto(nextUrl);

	} else {
		console.log("Mood nathi yaar: " + error);
	}
});

function everyFuckingPhoto (url) {
	request(url, function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body),
			source = $('.photo a img').attr('src'),
			nextUrl = 'http://imdb.com' + $('#right a').first().attr('href'),
			imgUrl = $('.photo a img').attr('src');
			console.log(imgUrl);
			downloadingImage(imgUrl);
			// get the fucking image 
			if(number--) everyFuckingPhoto(nextUrl)
		}
		else{

		}
	})
}

function downloadingImage (imgUrl) {
	request(imgUrl)
			.on('response',  function (res) {
  				res.pipe(fs.createWriteStream('./media/jessica-'+number+'.jpg'));
			})
			.on('error', function (err) {
				console.log(err);
			});
}