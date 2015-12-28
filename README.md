# rssrobot
Fetch rss feed and save to db

## Example
  ```js
var RssRobot = require('../src/rssrobot');

var opts = {
	'resourses': [
		"http://cn.reuters.feedsportal.com/CNAnalysesNews",
		"http://news.163.com/special/00011K6L/rss_newstop.xml",
		"http://www.infoq.com/cn/feed",
	],
	'db': {
		'engine': 'mongodb',
		'configs': {
			'mongodb': {
				'db_addr': '127.0.0.1',
				'db_port': '27017',
				'db_name': 'rssrobot'
			}
		}
	},
	'fields': ['title', 'description', 'summary', 'date', 'author'],
	
	
};
var myRobot = new RssRobot(opts);
myRobot.on('ready', function(model) {
	model.findAll()
	.then(function(data) {
		console.log(data);
	});
	
});
  ```
