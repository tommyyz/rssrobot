"use strict";

var fs			= require('fs')
,	db			= require('./db')
,	request		= require('request')
,	FP			= require('feedparser')
,	_			= require('lodash')
,	P 			= require('bluebird')
,	moment 		= require('moment')
,	ee 			= require('events').EventEmitter
,	extend		= require('./lang').extend
;

var opts_default = {
	'resourses': [
		"http://www.infoq.com/cn/feed"
	],
	'db': {
		'engine': 'mongodb',
		'configs': {
			'mongodb': {
				'db_addr': '127.0.0.1',
				'db_port': '27017',
				'db_name': 'rssrobot'
			},
			// 'mysql': {
			// 	'db_addr': '127.0.0.1',
			// 	'db_port': '3306',
			// 	'db_name': 'rssrobot',
			// 	'db_user': 'root',
			// 	'db_pass': 'root'
			// }
		}
	},
	fields : ['title', 'description', 'summary', 'date', 'link',
		'guid', 'author', 'comments', 'origlink', 'image', 'source', 'categories',
		'enclosures'
	],
};

exports = module.exports = (function() {
	var RssRobot = function(opts){
		ee.call(this);
		opts = _.create(opts_default, opts);
		this.initialize(opts);
	};
	extend(RssRobot, ee, {
		initialize: function(opts) {
			var self = this;
			this.opts = opts;
			this.db = new db(opts).getEngine();
			
			P.all(_.map(opts.resourses, function(url) {
				return self.request(url);
			}))
			.then(function(){
				self.emit('ready', self.getModel());
			});
		},
		request: function(url) {
			var self = this;
			var posts = [];
			return new P(function(resolve, reject){
				request(url)
				.on('error', reject)
				.pipe(new FP())
				.on('error', reject)
				.on('readable', function() {
					var stream = this
					,	meta = this.meta
					,	item;
					while (item = stream.read()) {
						posts = _.pick(item, self.opts.fields);
					}
				})
				.on('end', function(err) {
					if (err) {
						reject(err);
					}
					resolve(posts);
				});
				
			})
			.then(function(posts){
				return self.db.save(posts);
			})
			.catch(function(e){
				console.log(e);
			});
		},
		getModel: function() {
			return this.db;
		}
	});

	
	return RssRobot;
})();



