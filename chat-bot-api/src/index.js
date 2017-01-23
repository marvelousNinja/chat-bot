import Koa from 'koa'
import koaCors from 'kcors'
import koaBodyParser from 'koa-bodyparser'
import koaRouter from 'koa-router'
import koaLogger from 'koa-logger'
import axios from 'axios'
import loadConfig from './config'

const app = new Koa()
const logger = koaLogger()
const router = koaRouter()
const bodyParser = koaBodyParser()
const cors = koaCors()
const config = loadConfig()

router.post('/ask', async (ctx, next) => {
  const botResponse = await axios({
    url: config.url + '/v1/workspaces/' + config.workspaceId + '/message?version=' + config.version,
    method: 'POST',
    auth: { username: config.username, password: config.password },
    data: { input: { text: ctx.request.body.question } }
  })

  ctx.response.body = { answer: botResponse.data.output.text.join(' ') }
})

app
  .use(logger)
  .use(cors)
  .use(bodyParser)
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(config.port, () => console.log(`Listening on port ${config.port}`))
