<template>
  <div>
  <nav>
    <router-link class="link" to="/"><Button class="btn" label="Обо мне" /></router-link>
    <router-link class="link" to="/task"><Button label="Функциональная задача" /></router-link>
  </nav>
  <main>
    <router-view/>
  </main>
</div>
</template>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
.link {
  margin: 0 5px;
  text-decoration: none
}
</style>
