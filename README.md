# Passport-Imgur

[Passport](http://passportjs.org/) strategy for authenticating with [Imgur](https://imgur.com/)
using the OAuth 2.0 API.

This module lets you authenticate using Imgur in your Node.js applications.
By plugging into Passport, Imgur authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-imgur

## Usage

#### Configure Strategy

The Imgur authentication strategy authenticates users using a Imgur account
and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying a client ID, client secret, and callback URL.

    passport.use(new ImgurStrategy({
        clientID: IMGUR_CLIENT_ID,
        clientSecret: IMGUR_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/imgur/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ imgurId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Profile details

The Imgur authentication strategy provides the following user data fields:

| Key | Format | Description          |
| ------------- | --------- | ----------- |
| id | 	Integer |	The account id for the username requested. |
| url | 	String |	The account username, will be the same as requested in the URL |
| bio | 	String |	A basic description the user has filled out |
| reputation | 	Float |	The reputation for the account, in it's numerical format. |
| created | 	Integer |	The epoch time of account creation |
| pro_expiration | 	Integer or Boolean |	False if not a pro user, their expiration date if they are. |
| email | 	string |	The users email address |
| high_quality | 	boolean |	The users ability to upload higher quality images, there will be less compression |
| public_images | 	boolean |	Automatically allow all images to be publicly accessible |
| album_privacy | 	string |	Set the album privacy to this privacy setting on creation |
| pro_expiration | 	integer | or boolean	False if not a pro user, their expiration date if they are. |
| accepted_gallery_terms | 	boolean |	True if the user has accepted the terms of uploading to the Imgur gallery. |
| active_emails | 	Array | of Strings	The email addresses that have been activated to allow uploading |
| messaging_enabled | 	boolean |	If the user is accepting incoming messages or not |
| blocked_users | 	Array | of objects	An array of users that have been blocked from messaging, the object is blocked_id and blocked_url. |
| show_mature | 	boolean |	True if the user has opted to have mature images displayed in gallery list endpoints. |

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'imgur'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/imgur',
      passport.authenticate('imgur'));

    app.get('/auth/imgur/callback', 
      passport.authenticate('imgur', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Credits

  - [Vitalii Rakovtsii](http://github.com/mindfreakthemon)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2013 Vitalii Rakovtsii <[http://middle-of-nowhere.name/](http://middle-of-nowhere.name/)>
