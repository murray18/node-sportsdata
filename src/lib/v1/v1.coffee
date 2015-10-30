SportApi = require '../sport-api'

class V1 extends SportApi
  version: 1

  getWeeklySchedule: (params, callback) ->
    [params, callback] = this.getYearSeasonWeekParams(params, callback)
    this.getResource '/%(year)s/%(season)s/%(week)s/schedule.xml', params, callback

  getExtendedBoxscore: (params, callback) ->
    home = params.home
    away = params.away
    _this = this
    [params, callback] = this.getYearSeasonWeekParams(params, callback)
    this.getResource '/%(year)s/%(season)s/%(week)s/%(away)s/%(home)s/extended-boxscore.xml', params, (err, response) ->
      if err is 'GET returned HTTP 404'
        params.home = away
        params.away = home
        _this.getResource '/%(year)s/%(season)s/%(week)s/%(away)s/%(home)s/extended-boxscore.xml', params, callback
      else
        callback(null, response)


  getPlayByPlay: (params, callback) ->
    [params, callback] = this.getYearSeasonWeekParams(params, callback)
    this.getResource '/%(year)s/%(season)s/%(week)s/%(away)s/%(home)s/pbp.xml', params, callback

  getYearSeasonWeekParams: (params, callback) ->
    if typeof params is 'function'
      callback = params
      params = {}
    if not params
      params = {}
    if not params.year
      params.year = new Date().getFullYear()
    if not params.season
      params.season = 'REG'
    if not params.week
      params.week = 1

    [params, callback]

module.exports = V1
