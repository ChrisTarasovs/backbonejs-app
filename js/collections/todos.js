/*global Backbone */
var app = app || {};

(function () {
	'use strict';
	// The collection of todos is backed by *localStorage* instead of a remote
	// server.
	var Todos = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: app.Todo,
		
		// Save all of the todo items under this example's namespace.
		localStorage: new Backbone.LocalStorage('todos-backbone'),
		
		// Filter down the list of all todo items that are finished.
		completed: function () {
			console.log('thiss',this)
			return this.where({completed: true});
		},
		remaining: function () {
			console.log('thiss',this)
			return this.where({completed: false});
		},
		// We keep the Todos in sequential order, despite being saved by unordered
		// GUID in the database. This generates the next order number for new items.
		nextOrder: function () {
			return this.length ? this.last().get('order') + 1 : 1;
		},

		// Todos are sorted by their original insertion order.
		comparator: 'order'
	});

	// Create our global collection of **Todos**.
	app.todos = new Todos();
})();