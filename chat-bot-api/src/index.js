import 'babel-polyfill'

import Koa from 'koa'
import koaBodyParser from 'koa-bodyparser'
import koaRouter from 'koa-router'
import request from 'request-promise'

const app = new Koa()
const router = koaRouter()
const bodyParser = koaBodyParser()

const creds = {
  url: 'duh',
  password: 'duh',
  username: 'duh'
}

router.post('/ask', async (ctx, next) => {
  const botResponse = await request({
    url: creds.url + '/v1/workspaces/duh/message?version=2016-09-20',
    method: 'POST',
    auth: { username: creds.username, password: creds.password },
    body: { input: { text: ctx.request.body.question } },
    json: true
  })

  ctx.response.body = { response: botResponse.output.text }
})

app
  .use(bodyParser)
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)

