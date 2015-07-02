define([
'parse'
], function(Parse){
	var BaseView = Parse.View.extend({

		subViews: [],

		__GLOBAL_CAMERA_TAKE_PICTURE__: {
			quality: 50,
			destinationType: Camera.DestinationType.DATA_URL,
			saveToPhotoAlbum: false,
			cameraDirection: Camera.Direction.FRONT,
			correctOrientation: true
		},

		__GLOBAL_CAMERA_OPEN_GALLERY__: {
			quality: 50,
			destinationType: Camera.DestinationType.DATA_URL, // base 64
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			mediaType: Camera.MediaType.PICTURE,
			saveToPhotoAlbum: false,
			correctOrientation: true
		},

		statusbar: true,
		
		drawer: true,

		afterRenderInsertedToDom: function() { },
		
		getBoatDayTitle: function(id) {
			switch(id) {
				case 'leisure' : return 'Leisure'; break;
				case 'sports'  : return 'Water Sports'; break;
				case 'sailing' : return 'Sailing'; break;
				case 'fishing' : return 'Fishing'; break;
			}
		},
		
		modal: function(view) {

			var self = this;
			var $el = view.render().$el;

			// self.subViews.push(view);

			$el.insertAfter(this.$el);
			
			$el.on('click', '.close-me', function() {
				
				$(document).trigger('enableDrawer');
				$el.removeClass('active');

				setTimeout(function() { 
					
					// self.subViews.splice(self.subViews.indexOf(view), 1);
					view.teardown();

				}, 1000);

			});
			
			setTimeout(function() { 
				$el.addClass('active');
			}, 100);

		},

		close: function() {
			this.$el.find('.close-me').click();
		},

		getGuestPrice: function(price) {
			return Math.ceil(price / (1 - Parse.Config.current().get("PRICE_GUEST_PART")));
		},

		render: function( init ) {
			
			var data = {
				self: this
			};
			
			if( this.templateData ) {
				_.extend(data, this.templateData);
			}
			
			if( this.model ) {
				_.extend(data, this.model._toFullJSON());
			}
			
			if(this.collection) {
				_.extend(data, { collection: this.collection.toJSON() });
			} 
			
			this.$el.html(this.template(data));
			
			$(document).trigger( this.drawer ? 'enableDrawer' : 'disableDrawer');
			
			if( this.statusbar ) {
				StatusBar.show();
			} else {
				StatusBar.hide();
			}
			
			console.log("### Render (" + this.className + ") ###");
			
			return this;
		},

		cleanForm: function() {

			this.$el.find('.field-flag-error').removeClass('field-flag-error');

		},

		fieldError: function(field, message) {

			if(this._input(field).length > 0) {
				this._input(field).addClass('field-flag-error');
			} else {
				this.$el.find('.'+field).addClass('field-flag-error');
			}

		},

		dateParseToDisplayDate: function (date) {
			
			return this.dayToEnDay(new Date(date.iso ? date.iso : date).getDay()) + ' ' + new Date(date.iso ? date.iso : date).toLocaleDateString();

		},

		dayToEnDay: function(n) {
			switch(n) {
				case 0 : return 'Mon'; break;
				case 1 : return 'Tue'; break;
				case 2 : return 'Wed'; break;
				case 3 : return 'Thur'; break;
				case 4 : return 'Fri'; break;
				case 5 : return 'Sat'; break;
				case 6 : return 'Sun'; break;
			}
		},

		departureTimeToDisplayTime: function(time) {

			var h = parseInt(time);
			var mm = (time-h) * 60;
			var dd = 'AM';

			if( h >= 12 ) {
				dd = 'PM';
				h -= 12;
			}

			return (h==0?12:h)+':'+(mm==0?'00':+(mm < 10 ? '0'+mm : mm))+' '+dd;
			
		},
		
		teardown: function() {

			console.log("** teardown **");
			console.log(this.subViews);

			if( this.model ) {
				this.model.off(null, null, this);
			}

			// _.each(this.subViews, function(view) {

				// Bug making a while !?!
				// view.teardown();

			// });

			this.remove();

		},

		loading: function( btn ) {
			
			if( btn ) {
	
				if( typeof btn === 'string' ) {
					btn = this.$el.find(btn);
				}

				btn.addClass('loading');	

			} else {

				this.$el.find('.loading').removeClass('loading');

			}
			
		},

		isLoading: function( btn ) {

			if( typeof btn === 'string' ) {
				btn = this.$el.find(btn);
			}

			return btn.hasClass('loading')
		},

		_input: function(name) {
			return this.$el.find('[name="'+name+'"]');
		},

		_in : function(name) { return this._input(name) },

		_error: function(message) {
			$(document).trigger('globalError', message);
		},

		_info: function(message) {
			$(document).trigger('globalInfo', message);
		}

	});
	return BaseView;
});