<template>
  <div id='app'>
    <h1>{{greeting}}</h1>
  </div>
</template>

<script>
export default {
  data () {
    return {
      greeting: 'Hello!!!'
    }
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
  min-height: 100vh;
}
</style>
