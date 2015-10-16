define([
'views/BaseView',
'views/SignUpView',
'views/SignInView',
'text!templates/GuestTemplate.html', 
'text!templates/CardBoatDayGuestTemplate.html'
], function(BaseView, SignUpView, SignInView, GuestTemplate, CardBoatDayGuestTemplate){
	var GuestView = BaseView.extend({

		className: 'screen-guest',

		template: _.template(GuestTemplate),

		events: {
			"click button.sign-up" : "signUp",
			"click button.sign-in" : "signIn",
		},

		render: function() {

			BaseView.prototype.render.call(this);
			var self = this;

			var query = new Parse.Query(Parse.Object.extend('BoatDay'));
			query.greaterThanOrEqualTo("date", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
			query.ascending('date, departureTime');
			query.include('boat');
			query.find().then(function(boatdays) {
				var tpl = _.template(CardBoatDayGuestTemplate);
				self.boatdays = {};
				self.$el.find('.content .boatdays').html('');

				_.each(boatdays, function(boatday) {

					self.boatdays[boatday.id] = boatday;
					self.$el.find('.content .boatdays').append(tpl({
							id: boatday.id,
							name: boatday.get('name'), 
							date: boatday.get('date'), 
							availableSeats: boatday.get('availableSeats'), 
							location: boatday.get('locationText')
					}));

					var queryBoatPicture = boatday.get('boat').relation('boatPictures').query();
					queryBoatPicture.ascending('order');
					queryBoatPicture.first().then(function (fileholder) {

						if( fileholder ) {
							self.$el.find('.boatday-card.card-'+boatday.id+' .picture').html(fileholder.get('file').url());
						}
					});
				});
			});

			return this;
		},

		signUp: function(event) {
			
			event.preventDefault();
			this.modal(new SignUpView(), 'left');
			//this.modal(new SignUpView());

		},

		signIn: function(event) {
			
			event.preventDefault();
			this.modal(new SignInView(), 'left');
			//this.modal(new SignInView());
		}
	});
	return GuestView;
});