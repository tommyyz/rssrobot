"use strict";

var _ = require('lodash')

/**
 * Abstract Renderer class
 * 
 * A renderer must have 3 main methods: save(), find(), remove()
 * 
 */
var DbAbstract = module.exports = function(args) {
	this.initialize(args);
};
DbAbstract.prototype = {
	initialize: function(args) {
		
	},
	
	save: function() {
		
	},
	
	find: function() {
		
	},
	
	remove: function() {
		
	}
	
};