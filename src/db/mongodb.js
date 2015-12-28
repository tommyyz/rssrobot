"use strict";

var exports = module.exports = {}
,   _ = require('lodash')
,	P = require('bluebird')
,   extend = require('../lang').extend
,	DbAbstract = require('./abstract')
,	mongoose = require('mongoose')
;


var DbMongo = module.exports = function(args) {
	DbAbstract.apply(this, arguments);
}
extend(DbMongo, DbAbstract, {
	initialize: function(args) {
		var db_config = args.db.configs[args.db.engine];
		var db = mongoose.createConnection('mongodb://' + db_config.db_addr + ':' + db_config.db_port + '/' + db_config.db_name);
		db.on('error', function(error) {
			console.log(error);
		});
		
		var schema_settings = {};
		_.map(args.fields, function(name) {
			schema_settings[name] = {type: String};
		});

		var mongooseSchema = new mongoose.Schema(schema_settings);
		this.model = db.model('mongoose', mongooseSchema);
	},
	
	save: function(arg) {
		var self = this;
		if (_.isArray(arg)) {
			return P.all(_.map(arg, function(post) {
				return self.saveOne(post);
			}));
		}
		else {
			return this.saveOne(arg);
		}
	},
	
	saveOne: function(post) {
		var self = this;
		return self.find({'title': post.title})
		.then(function(data){
			if (!_.isEmpty(data)) {
				return P.resolve();
			}
			return self.model.create(post);
		});
	},
	
	find: function(arg) {
		return this.model.find(arg);
	},
	
	findAll: function() {
		return this.model.find({});
	},
	
	remove: function(arg) {
		return this.model.remove(arg);
	},
	
	removeAll: function() {
		return this.model.remove({});
	},
});

