var nm = "nm1567113",	// Jessica Chastain! <3
	request = require("request"),
	cheerio = require("cheerio"),
	fs = require('fs'),
	path = require('path');

if(process.argv[2]) nm = process.argv[2].toString();  // Just in case, you don't like Jessica.. you know :D
var mainUrl = "http://www.imdb.com/name/"+nm+"/mediaindex" ,
	number,
	celName="";

request(mainUrl, function (error, response, body) {
	if (!error) {
		var $ = cheerio.load(body),
		num = $('.desc').first().text(),  
		celName = $('h3 a').first().text();  // Getting Celebrity Name For folder-name
		number = num.substring(num.indexOf('of')+3,num.lastIndexOf(" "));  // Trying to get number of Photos 
		var nextUrl = 'http://imdb.com' + $('.media_index_thumb_list a:nth-child(1)').attr('href');
		console.log(nextUrl);
		getEveryPhoto(nextUrl, celName, downloadingImage);
	} 
	else {
		console.log("Error requesting main URL: " + error);
	}
});

function getEveryPhoto (url, celName, callback) {
	if(number-- == 0) return;
	request(url, function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body),
			nextUrl = 'http://imdb.com' + $('#right a:nth-child(3)').attr('href'),
			imgUrl = $('.photo a img').attr('src');
			console.log(nextUrl);
			callback(imgUrl, celName, nextUrl);
		}
		else{
			console.log("Error requesting URL 1: " + error);
		}
	})
}

function downloadingImage (imgUrl, celName, next) {
	
	var data;
	mkdirSync(path.join('media'));
	mkdirSync(path.join('media',celName));

	try {
		data = fs.readFileSync('./media/'+celName+'/'+nm+'-'+number+'.jpg');
		console.log('skipping..')
		getEveryPhoto(next, celName, downloadingImage);
	} catch (e) {
		request(imgUrl)
			.on('response',  function (res) {
				var stream = fs.createWriteStream('./media/'+celName+'/'+nm+'-'+number+'.jpg');
				stream.on('close',function () {
					getEveryPhoto(next, celName, downloadingImage);	
				})
				res.pipe(stream);
			})
			.on('error', function (err) {
				console.log(err);
			});
	}	
}

function mkdirSync (path) {
	try {
		fs.mkdirSync(path);
	} catch(e) {
		if ( e.code != 'EEXIST' ) throw e;
	}
}