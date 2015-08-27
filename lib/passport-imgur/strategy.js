/**
 * Module dependencies.
 */
var util = require('util'),
	OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
	InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Imgur API authentication strategy authenticates requests by delegating to
 * Imgur API using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Imgur API application's App ID
 *   - `clientSecret`  your Imgur API application's App Secret
 *   - `callbackURL`   URL to which Imgur API will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new ImgurStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret',
 *         callbackURL: 'https://www.example.net/auth/imgur/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
	options = options || {};
	options.authorizationURL = options.authorizationURL || 'https://api.imgur.com/oauth2/authorize';
	options.tokenURL = options.tokenURL || 'https://api.imgur.com/oauth2/token';

	OAuth2Strategy.call(this, options, verify);
	this.name = 'imgur';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Imgur.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `imgur`
 *   - `id`               The account id for the username requested.
 *   - `url`              The account username, will be the same as requested in the URL
 *	 - `bio`		      A basic description the user has filled out
 *	 - `reputation`		  The reputation for the account, in it's numerical format.
 *	 - `created`		  The epoch time of account creation
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
	this._oauth2.useAuthorizationHeaderforGET(true);
	this._oauth2.get('https://api.imgur.com/3/account/me/', accessToken, function (err, body, res) {
		if (err) {
			return done(new InternalOAuthError('failed to fetch user profiles', err));
		}

		try {
			var json = JSON.parse(body);
		} catch (e) {
			done(e);
		}

		var profile = { provider: 'imgur' };

		profile.id = json.data.id;
		profile.url = json.data.url;
		profile.bio = json.data.bio;
		profile.reputation = json.data.reputation;
		profile.pro_expiration = json.data.pro_expiration;
		profile.created = json.data.created;

		this._oauth2.get('https://api.imgur.com/3/account/me/settings', accessToken, function (err, body, res) {
			try {
				var json = JSON.parse(body);
			} catch (e) {
				done(e);
			}

			profile.email = json.data.email;
			profile.high_quality = json.data.high_quality;
			profile.public_images = json.data.public_images;
			profile.album_privacy = json.data.album_privacy;
			profile.pro_expiration = json.data.pro_expiration;
			profile.accepted_gallery_terms = json.data.accepted_gallery_terms;
			profile.active_emails = json.data.active_emails;
			profile.messaging_enabled = json.data.messaging_enabled;
			profile.blocked_users = json.data.blocked_users;
			profile.show_mature = json.data.show_mature;

			done(null, profile);
		});
	}.bind(this));
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;