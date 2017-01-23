import Ajv from 'ajv'
import dotenv from 'dotenv'

export default function () {
  dotenv.load()

  const schema = {
    type: 'object',
    properties: {
      port: { type: 'string' },
      workspaceId: { type: 'string' },
      version: { type: 'string' },
      url: { type: 'string', format: 'uri' },
      password: { type: 'string' },
      username: { type: 'string' }
    },
    required: 'port workspaceId version url password username'.split(' ')
  }

  const config = {
    port: process.env.PORT,
    workspaceId: process.env.WORKSPACE_ID,
    version: process.env.VERSION,
    url: process.env.BOT_API_URL,
    password: process.env.API_PASSWORD,
    username: process.env.API_USERNAME
  }

  const validator = new Ajv({ allErrors: true })

  if (validator.validate(schema, config)) {
    return config
  }

  throw new Error(validator.errorsText())
}
