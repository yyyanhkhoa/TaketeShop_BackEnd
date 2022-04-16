var mysql = require('mysql')
  , async = require('async')

var PRODUCTION_DB = 'app_prod_database'
  , TEST_DB = 'app_test_database'

exports.MODE_TEST = 'mode_test'
exports.MODE_PRODUCTION = 'mode_production'

var state = {
  pool: null,
  mode: null,
}

exports.connect = function(mode, done) {
  if (mode === exports.MODE_PRODUCTION) {
    state.pool = mysql.createPoolCluster()

    state.pool.add('WRITE', {
      host: '192.168.0.5',
      user: 'your_user',
      password: 'some_secret',
      database: PRODUCTION_DB
    })

    state.pool.add('READ1', {
      host: '192.168.0.6',
      user: 'your_user',
      password: 'some_secret',
      database: PRODUCTION_DB
    })

    state.pool.add('READ2', {
      host: '192.168.0.7',
      user: 'your_user',
      password: 'some_secret',
      database: PRODUCTION_DB
    })
  } else {
    state.pool = mysql.createPool({
      host: 'localhost',
      user: 'your_user',
      password: 'some_secret',
      database: TEST_DB
    })
  }

  state.mode = mode
  done()
}

exports.READ = 'read'
exports.WRITE = 'write'

exports.get = function(type, done) {
  var pool = state.pool
  if (!pool) return done(new Error('Missing database connection.'))

  if (type === exports.WRITE) {
    state.pool.getConnection('WRITE', function (err, connection) {
      if (err) return done(err)
      done(null, connection)
    })
  } else {
    state.pool.getConnection('READ*', function (err, connection) {
      if (err) return done(err)
      done(null, connection)
    })
  }
}