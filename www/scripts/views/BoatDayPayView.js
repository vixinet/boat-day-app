define([
'views/BaseView',
'text!templates/BoatDayPayTemplate.html',
], function(BaseView, BoatDayPayTemplate){
	var BoatDayPayView = BaseView.extend({

		className: 'screen-boatday-pay',

		template: _.template(BoatDayPayTemplate),

		events: {
			'click .btn-pay': 'pay',
			'click .stars .rating': 'rate',
			'click .btn-minus': 'decreasePrice',
			'click .btn-plus': 'increaseProce',
			'blur [name="review"]': 'censorField',
		},

		rating: null,
		price: null,
		priceBase: null,

		mediaPlus: null,
		mediaMinus: null,

		initialize: function(data) {

			var guestPart = this.getGuestRate(this.model.get('boatday').get('captain').get('host').get('type'));
			this.price = ( this.getGuestPrice(this.model.get('boatday').get('price'), guestPart) + Parse.Config.current().get("TRUST_AND_SAFETY_FEE") ) * this.model.get('seats');
			this.priceBase = this.price;
			this.mediaMinus = new Media("resources/sfx/minus-button.wav");
			this.mediaPlus = new Media("resources/sfx/plus-button.wav");

		},

		decreasePrice: function() {
			this.mediaMinus.play();
			this.changePrice(-1);
		},

		increaseProce: function() {
			this.mediaPlus.play();
			this.changePrice(1);
		},

		changePrice: function(delta) {
			
			var min = this.model.get('boatday').get('captain').get('host').get('type') == 'business'
				? this.priceBase
				: this.model.get('seats') * Parse.Config.current().get("TRUST_AND_SAFETY_FEE");

			this.price = Math.max(this.price + delta, min);
			this.$el.find('.total').text(this.price);
		},

		pay: function(event) {

			var self = this;
			var review = this._in('review').val();

			if( self.loading('.btn-pay') ) {
				console.log('abort');
				return ;
			}
			self.cleanForm();

			if( !this.rating ) {
				self._error('Oops... You forgot to rate the BoatDay.');
				self.loading();
				return;
			}

			if( !self.model.get('contribution') ) {

				if( self.price < self.priceBase && review == '') {
					self.fieldError('review', '');
					self._error('Oops... You lower the expected contribution, please leave a review to explain why.');
					self.loading();
					return;
				}

				self.model.set('contribution', self.price);
			}

			self.model.save({
				ratingGuest: parseInt(self.rating),
				reviewGuest: review,
			}).then(function() {
				var profile = self.model.get('boatday').get('captain');
				var rating = typeof profile.get('rating') != typeof undefined && profile.get('rating') ? profile.get('rating') : 0;
				var ratingAmount = profile.get('ratingAmount');

				self.model.get('boatday').get('captain').save({
					rating : ( rating * ratingAmount  + parseInt(self.rating) ) / (ratingAmount + 1),
					ratingAmount: ratingAmount + 1
				}).then(function() {
					Parse.history.loadUrl(Parse.history.fragment);
				}, function(error) {
					console.log(error);
				});
			}, function(error) {
				console.log(error)
			});

		},

		rate: function(event) {
			var e = $(event.currentTarget);
			this.$el.find('.stars .rating').attr('src', 'resources/star.png');
			e.attr('src', 'resources/star-full.png');
			e.prevAll().attr('src', 'resources/star-full.png');
			this.rating = e.attr('data-rating');
		},
		
	});
	return BoatDayPayView;
});