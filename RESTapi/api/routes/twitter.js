const express = require('express');
const router = express.Router();
const Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});

router.get('/followers', (req, res, next) => {
  client.get('users/show', req.query, function(error, user, response) {
    if (!error) {
      res.status(200).json({
        followers: user.followers_count
      })
    }
  });
})

router.get('/tweets', (req, res, next) => {
  client.get('users/show', req.query, function(error, user, response) {
    if (!error) {
      res.status(200).json({
        tweets: user.statuses_count
      })
    }
  })
})

module.exports = router;