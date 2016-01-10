var nm = "nm1567113";	// Jessica Chastain, bitches! <3
var request = require("request"),
	cheerio = require("cheerio"),
	fs = require('fs'),
	path = require('path'),
	sc = [];
if(process.argv[2]) nm = process.argv[2].toString();
var url1 = "http://www.imdb.com/name/"+nm+"/mediaindex" ;
var number;

request(url1, function (error, response, body) {
	if (!error) {
		var $ = cheerio.load(body),
		num = $('.desc').first().text();
		number = num.substring(num.indexOf('of')+3,num.lastIndexOf(0)+1);
		var nextUrl1 = 'http://imdb.com' + $('.media_index_thumb_list a:nth-child(1)').attr('href');
		console.log(nextUrl1)
		everyFuckingPhoto(nextUrl1, downloadingImage);
	} else {
		console.log("Mood nathi yaar: " + error);
	}
});

function everyFuckingPhoto (url2, callback) {
	if(number-- == 0) return;
	request(url2, function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body),
			nextUrl2 = 'http://imdb.com' + $('#right a:nth-child(3)').attr('href'),
			imgUrl1 = $('.photo a img').attr('src');
			console.log(nextUrl2);
			callback(imgUrl1, nextUrl2);
		}
	})
}

function downloadingImage (imgUrl2, next) {
	request(imgUrl2)
		.on('response',  function (res) {
			mkdirSync(path.join('media'));
  			mkdirSync(path.join('media',nm));
  			res.pipe(fs.createWriteStream('./media/'+nm+'/'+nm+'-'+number+'.jpg'));	
		})
		.on('error', function (err) {
			console.log(err);
		});
	everyFuckingPhoto(next, downloadingImage);
}

function mkdirSync (path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
}