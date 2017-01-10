import 'babel-polyfill'

import Koa from 'koa'
import koaCors from 'kcors'
import koaBodyParser from 'koa-bodyparser'
import koaRouter from 'koa-router'
import request from 'request-promise'
import loadConfig from './config'

const app = new Koa()
const router = koaRouter()
const bodyParser = koaBodyParser()
const cors = koaCors()
const config = loadConfig()

router.post('/ask', async (ctx, next) => {
  const botResponse = await request({
    url: config.url + '/v1/workspaces/' + config.workspaceId + '/message?version=' + config.version,
    method: 'POST',
    auth: { username: config.username, password: config.password },
    body: { input: { text: ctx.request.body.question } },
    json: true
  })

  ctx.response.body = { answer: botResponse.output.text.join(' ') }
})

app
  .use(cors)
  .use(bodyParser)
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(config.port)
