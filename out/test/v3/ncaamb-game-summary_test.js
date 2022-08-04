(function() {
  'use strict';
  var NCAAMB, nock, should;

  should = require('should');

  nock = require('nock');

  NCAAMB = require('../../lib/v3/ncaamb.js');

  describe('V3 NCAAMB', function() {
    var badNcaamb, ncaamb;
    ncaamb = new NCAAMB('api-key', 't');
    badNcaamb = new NCAAMB('bad-key', 't');
    return describe('#getGameSummary()', function() {
      var scope;
      scope = void 0;
      before(function() {
        return scope = nock('http://api.sportsdatallc.org').get('/ncaamb-t3/games/2b999b4b-c01f-4aa6-9576-f2e195c6b421/summary.xml?api_key=bad-key').replyWithFile(403, __dirname + '/replies/api-key-error.txt').get('/ncaamb-t3/games/bad-event-id/summary.xml?api_key=api-key').reply(404, '').get('/ncaamb-t3/games/2b999b4b-c01f-4aa6-9576-f2e195c6b421/summary.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/ncaamb-game-summary-200.txt').get('/ncaamb-t3/games/2b999b4b-c01f-4aa6-9576-f2e195c6b421/summary.xml?api_key=api-key').replyWithFile(200, __dirname + '/replies/ncaamb-game-summary-200.txt');
      });
      it('should be a function', function() {
        return ncaamb.getGameSummary.should.be.a('function');
      });
      it('should should throw error without gameId', function() {
        return (function() {
          return ncaamb.getGameSummary();
        }).should.throwError(/required/);
      });
      it('should pass error and no result with bad api key', function(done) {
        return badNcaamb.getGameSummary('2b999b4b-c01f-4aa6-9576-f2e195c6b421', function(err, result) {
          err.should.match(/HTTP 403/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass error and no result with bad gameId', function(done) {
        return ncaamb.getGameSummary('bad-event-id', function(err, result) {
          err.should.match(/HTTP 404/);
          should.not.exist(result);
          return done();
        });
      });
      it('should pass no error and teams as result on 200', function(done) {
        return ncaamb.getGameSummary('2b999b4b-c01f-4aa6-9576-f2e195c6b421', function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.game.should.be.a('object');
          result.game.title.should.match(/2013 National Championship/);
          result.game.team.should.be.an.instanceOf(Array);
          result.game.team[0].scoring.should.be.a('object');
          result.game.team[0].statistics.should.be.a('object');
          return done();
        });
      });
      it('should support object literal as param', function(done) {
        var params;
        params = {
          gameId: '2b999b4b-c01f-4aa6-9576-f2e195c6b421'
        };
        return ncaamb.getGameSummary(params, function(err, result) {
          should.not.exist(err);
          result.should.be.a('object');
          result.game.should.be.a('object');
          result.game.title.should.match(/2013 National Championship/);
          result.game.team.should.be.an.instanceOf(Array);
          result.game.team[0].scoring.should.be.a('object');
          result.game.team[0].statistics.should.be.a('object');
          return done();
        });
      });
      return after(function() {
        return scope.done();
      });
    });
  });

}).call(this);
