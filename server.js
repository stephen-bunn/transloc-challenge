const throng = require("throng")

throng(
  {
    workers: process.env.WEB_CONCURRENCY || 1,
    lifetime: Infinity,
  },
  start
)

function start() {
  const express = require("express")
  const serveStatic = require("serve-static")
  const history = require("connect-history-api-fallback")

  const app = express()
  app
    .enable("trust proxy")
    .use(history())
    .use(serveStatic(`${__dirname}/dist`))
    .listen(process.env.PORT || 8080, onListen)

  function onListen() {
    const ip = require("ip")
    console.log(`serving at http://${ip.address()}:${process.env.PORT || 8080}`)
  }
}
