/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	// Our overall **AppView** is the top-level piece of UI.
	app.AppView = Backbone.View.extend({
		// the App already present in the HTML.
		el: '.todoapp',
		statsTemplate: _.template($('#stats').html()),
		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'keypress .add-item': 'createOnEnter',
			'click .clear-completed': 'clearCompleted',
			'click .toggle-all': 'toggleAllComplete'
		},
		initialize: function () {
			this.$input = this.$('.add-item');
			this.$list = $('.todo-list');
			this.$stats = $('.footer');


			this.listenTo(app.todos, 'add', this.addOne);
			this.listenTo(app.todos, 'reset', this.addAll);
			this.listenTo(app.todos, 'change:completed', this.filterOne);
			this.listenTo(app.todos, 'filter', this.filterAll);
			this.listenTo(app.todos, 'all', _.debounce(this.render, 0));
		
			app.todos.fetch({reset: true});
		},
		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function () {
			var completed = app.todos.completed().length;
			console.log('todos', completed)
			var remaining = app.todos.remaining().length;

			if (app.todos.length) {
				// this.$main.show();
				// this.$footer.show();

				this.$stats.html(
					this.statsTemplate({
					completed: completed,
					remaining: remaining
				}));

				// this.$('.filters li a')
				// 	.removeClass('selected')
				// 	.filter('[href="#/' + (app.TodoFilter || '') + '"]')
				// 	.addClass('selected');
			} else {
				// this.$main.hide();
				// this.$footer.hide();
			}

			// this.allCheckbox.checked = !remaining;
		},
		// Generate the attributes for a new Todo item.
		newAttributes: function () {
			return {
				title: this.$input.val().trim(),
				order: app.todos.nextOrder(),
				completed: false
			};
		},
		createOnEnter: function (e) {
			
			if (e.which === ENTER_KEY && this.$input.val().trim()) {
				console.log('dd',this)
				app.todos.create(this.newAttributes());
				
				this.$input.val('');
			}
		},
		addOne: function (todo) {
			var view = new app.TodoView({ model: todo });
			this.$list.append(view.render().el);
		},
		// Clear all completed todo items, destroying their models.
		clearCompleted: function () {
			_.invoke(app.todos.completed(), 'destroy');
			return false;
		},
	});
})(jQuery);