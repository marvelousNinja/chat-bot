<template>
  <div id='app'>
    <div class='MessageList'>
      <div v-for='message in messages' class='Message' :class='modifiers(message)'>
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
      <form class='MessageForm' v-on:submit.prevent='onSubmit'>
        <input v-model='text'  class='MessageForm__Text' placeholder='Type a message...'>
        <button class='MessageForm__Send'>&#10003;</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      text: '',
      messages: [{
        author: 'me',
        text: 'Hello, Bot! Any news on that taxi?',
        timestamp: new Date().toLocaleString()
      }, {
        author: 'bot',
        text: 'Sorry. I do not seem to remember any taxi... Could you repeat the question?',
        timestamp: new Date().toLocaleString()
      }]
    }
  },
  methods: {
    modifiers (message) {
      return { 'Message--Mine': message.author === 'me' }
    },
    onSubmit () {
      if (this.text.length === 0) {
        return
      }

      this.messages.push({
        author: 'me',
        text: this.text,
        timestamp: new Date().toLocaleString()
      })

      this.text = ''
    }
  },
  updated () {
    this.$el.querySelector('form').scrollIntoView()
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i');

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

.Message__Author {
  font-weight: 600;
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
