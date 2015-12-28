"use strict";

var _ = require('lodash')
,	path = require('path')
;

var db = module.exports = function(args) {
	this.initialize(args);
};
db.prototype = {
	initialize: function(args) {
		this.engine_name = args.db.engine;
		this.engine_class = require('./db/' + this.engine_name);
		this.engine = new this['engine_class'](args);
	},
	getEngine: function() {
		return this.engine;
	}
}