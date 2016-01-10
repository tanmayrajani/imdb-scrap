var nm = "nm1567113";	// Jessica Chastain, bitches! <3
var request = require("request"),
	cheerio = require("cheerio"),
	fs = require('fs'),
	path = require('path');

if(process.argv[2]) nm = process.argv[2].toString();  // Just in case, if you don't like Jessica.. you know
var mainUrl = "http://www.imdb.com/name/"+nm+"/mediaindex" ;
var number;
var celName="";

request(mainUrl, function (error, response, body) {
	if (!error) {
		var $ = cheerio.load(body),
		num = $('.desc').first().text(),
		celName = $('h3 a').first().text();
		number = num.substring(num.indexOf('of')+3,num.lastIndexOf(" "));
		var nextUrl = 'http://imdb.com' + $('.media_index_thumb_list a:nth-child(1)').attr('href');
		console.log(nextUrl);
		everyFuckingPhoto(nextUrl, celName, downloadingImage);
	} else {
		console.log("Mood nathi yaar: " + error);
	}
});

function everyFuckingPhoto (url, celName, callback) {
	if(number-- == 0) return;
	request(url, function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body),
			nextUrl = 'http://imdb.com' + $('#right a:nth-child(3)').attr('href'),
			imgUrl = $('.photo a img').attr('src');
			console.log(nextUrl);
			callback(imgUrl, celName, nextUrl);
		}
	})
}

function downloadingImage (imgUrl, celName, next) {
	request(imgUrl)
		.on('response',  function (res) {
			mkdirSync(path.join('media'));
  			mkdirSync(path.join('media',celName));
  			res.pipe(fs.createWriteStream('./media/'+celName+'/'+nm+'-'+number+'.jpg'));	
		})
		.on('error', function (err) {
			console.log(err);
		});

	everyFuckingPhoto(next, celName, downloadingImage);
}

function mkdirSync (path) {
	try {
		fs.mkdirSync(path);
	} catch(e) {
		if ( e.code != 'EEXIST' ) throw e;
	}
}