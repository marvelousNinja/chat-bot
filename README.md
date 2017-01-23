# Chat Bot Application

Application provides a simple UI to chat with a Food Critic - a bot created with Watson Conversation service.
This exercise covers the following Bluemix topics: buildpacks, routes, configuration and logs.

## Prerequisites
* Git
* Node.js 4.x or higher with NPM 3.x or higher
* Bluemix account

## First steps
* Clone the repo `git clone https://github.com/marvelousNinja/chat-bot.git`
* Repository contains completed application at `master` branch and the starting point at `starting-point` branch. Checkout the starting point with `git checkout starting-point`

## Building the UI
* Using the command line, navigate to the `chat-bot-ui` directory and install dependencies with `npm install`
* Open the `chat-bot-ui` directory in your favourite code editor
* Run the development server with `npm run dev`. That should automatically launch the default web browser
* Observe the contents of `./src` directory. Make some changes to HTML in `./src/App.vue`. Observe how the page in the browser window updates accordingly
* Pause for the discussion on build artifacts. Create a build artifact for deployment with `npm run build`. Observe the contents of `./dist` directory
* Create a `./manifest.yml` file:
```
applications:
- name: chat-bot-ui
  memory: 64M
  buildpack: https://github.com/cloudfoundry/staticfile-buildpack.git
  path: ./dist
  host: chat-bot-ui-<<YOUR-NAME>>
```
* Finally, deploy the application using the command line: `cf push`
* Pause for the discussion on routes. Observe the command line output for a URL of the deployed app. Open it and validate that it's working. Check both HTTP and HTTPS access
* Pause for the discussion on buildpacks. Observe the contents of `./manifest.yml` and take a look at documentation at http://docs.cloudfoundry.org/buildpacks/staticfile/index.html
* Let's create actual chat UI. Create `./src/components/Message.vue` with the following contents:
```
<template>
  <div class='Message' :class='modifiers'>
    <div class='Message__Author'>
      {{ message.author }}
    </div>
    <div class='Message__Text'>
      {{ message.text }}
    </div>
    <div class='Message__Timestamp'>
      {{ message.timestamp }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['message'],
  data () {
    return {
      modifiers: {
        'Message--Mine': this.message.author === 'me',
        'Message--Error': this.message.author === 'error'
      }
    }
  }
}
</script>

<style scoped>
.Message {
  display: flex;
  flex-direction: column;
  align-self: flex-start;
}

.Message--Mine {
  align-self: flex-end;
}

.Message--Mine .Message__Author {
  align-self: flex-end;
}

.Message--Mine .Message__Timestamp {
  align-self: flex-start;
}

.Message--Mine .Message__Text {
  background-color: #7518a0;
}

.Message--Error .Message__Text {
  background-color: #b7263c;
}

.Message__Author {
  font-weight: 700;
  padding: 5px;
  color: #FFFFFF;
}

.Message__Text {
  color: #FFFFFF;
  background-color: #306696;
  border-radius: 10px;
  padding: 10px 15px;
}

.Message__Timestamp {
  color: grey;
  font-size: 0.5em;
  padding: 4px;
  align-self: flex-end;
}
</style>
```
* Now, let's create `./src/components/MessageForm.vue`:
```
<template>
  <form class='MessageForm' v-on:submit.prevent='onSubmit'>
    <input v-model='text'  class='MessageForm__Text' placeholder='Type a message...'>
    <button class='MessageForm__Send'>&#10003;</button>
  </form>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      text: ''
    }
  },
  methods: {
    onSubmit () {
      if (this.text.length === 0) {
        return
      }

      this.$emit('messageSent', {
        author: 'me',
        text: this.text,
        timestamp: new Date().toLocaleString()
      })

      axios.post(process.env.API_URL + '/ask', { question: this.text }).then((resp) => {
        this.$emit('messageSent', {
          author: 'bot',
          text: resp.data.answer,
          timestamp: new Date().toLocaleString()
        })
      }).catch(err => {
        const message = err.response ? `${err.response.status} ${err.response.data}` : err.message
        this.$emit('messageSent', {
          author: 'error',
          text: message,
          timestamp: new Date().toLocaleString()
        })
      })

      this.text = ''
    }
  }
}
</script>

<style scoped>
.MessageForm {
  align-self: flex-end;
  padding: 10px;
}

.MessageForm__Text {
  border-radius: 10px;
  height: 1.5em;
  border: 1px solid black;
  padding: 5px 10px;
  font-size: 1em;
}

.MessageForm__Text:focus {
  outline: none;
}

.MessageForm__Text::-webkit-input-placeholder {
  font-weight: 100;
}

.MessageForm__Send {
  outline: none;
  border: 0px;
  color: #FFFFFF;
  background-color: #7518a0;
  font-size: 1.5em;
  border-radius: 10px;
  padding: 5px 10px;
}

.MessageForm__Send:active {
  background-color: #306696;
}
</style>
```
* Finally, replace the contents of `./src/App.vue` to use the components we've just created:
```
<template>
  <div id='app'>
    <div class='MessageList'>
      <Message v-for='message in messages' :message='message'/>
      <MessageForm @messageSent='onMessageSent'/>
    </div>
  </div>
</template>

<script>
import Message from './components/Message'
import MessageForm from './components/MessageForm'

export default {
  components: { Message, MessageForm },
  data () {
    return {
      messages: [{
        author: 'bot',
        text: 'Let us discuss something!',
        timestamp: new Date().toLocaleString()
      }]
    }
  },
  methods: {
    onMessageSent (message) {
      this.messages.push(message)
    }
  },
  updated () {
    this.$el.querySelector('form').scrollIntoView()
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Lato:100,300,700');

* {
  margin: 0px;
  padding: 0px;
}

#app {
  font-family: 'Lato', sans-serif;
  font-weight: 300;
  background-color: #1E1E1E;
  min-height: 100vh;
}

.MessageList {
  width: 450px;
  display: flex;
  flex-direction: column;
  background-color: #252526;
  padding: 10px;
  margin: 0px auto;
  min-height: 100vh;
}
</style>
```
* Check the UI in the browser. You should be able to send messages, but since we don't have API yet, they will result in `Network Error`. It is time to implement API microservice

## Building the API
* Using the command line, navigate to the `chat-bot-api` directory and install dependencies with `npm install`
* Open the `chat-bot-api` directory in your favourite code editor
* We need to collect application configuration and put it into `./.env` file.
* Open the browser. Navigate to Bluemix Catalog and create Conversation service: https://console.ng.bluemix.net/catalog/services/conversation/
* Open the *Service Credentials* tab and click on *View Credentials*. Copy the contents and fill `BOT_API_URL`, `API_USERNAME`, `API_PASSWORD` variabiles in `./.env` file.
* Back in the browser, open the *Manage* tab and click *Launch tool*. Press on *Import a Workspace* icon and choose `./workspace.json`
* Navigate back to the list of workspaces and and click on *Details* icon and choose *View Details*. Copy the Workspace ID into `WORKSPACE_ID` variable in `./.env` file.
* Run the development server with `npm run dev`
* Pause for the discussion on configuration. Observe the contents of `./src/config.js`.
* Pause for the discussion on build artifacts. Create a build artifact for deployment with `npm run build`. Observe the contents of `./dist` directory
* Create a `./manifest.yml` file:
```
applications:
- name: chat-bot-api
  memory: 128M
  buildpack: https://github.com/cloudfoundry/nodejs-buildpack
  host: chat-bot-api-<<YOUR-NAME>>
```
* Finally, deploy the application using the command line: `cf push`. Observe the command line output for a URL of the deployed app
* Pause for the discussion on logs. Print the logs of the application with `cf logs --recent chat-bot-api`
* Open a `chat-bot-ui` in your code editor and modify `./config/prod.env.js` with the URL of the deployed API
* Rebuild and redeploy the `chat-bot-ui` with `npm run build` and `cf push`
* Open the URL of deployed `chat-bot-ui` and try to have a conversation with your bot

## Exploring the Conversation service
* Navigate to https://console.ng.bluemix.net/dashboard/services/ and open Conversation service instance
* Open *Manage* tab and click *Launch tool*
* Pause for the discussion on Conversation service. Have fun with creating new foods and kinds of responses

## Additional exercises
* Current implementation doesn't support branching dialogs since it doesn't track the state of the conversation. Consult the documentation and build more complex bot: https://www.ibm.com/watson/developercloud/conversation/api/v1/
