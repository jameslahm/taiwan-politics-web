<template>
  <div id="app">
    <div id="nav"></div>
    <div class="container-fluid">
      <transition name="slide-down" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<style>
/** TODO: The color should be configured in a global file, but I don't know how to deal with scss */
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: azure;
  background-color: rgb(21, 24, 30);
  position: absolute;
  height: 100%;
  width: 100%;
  scrollbar-color: dark;
}

.slide-up-enter,
.slide-down-leave-to {
  transform: translateY(10%);
  opacity: 0;
}
.slide-down-enter,
.slide-up-leave-to {
  transform: translateY(-10%);
  opacity: 0;
}
.slide-up-enter-active,
.slide-down-enter-active {
  transition: transform 1s ease;
}
.slide-up-leave-active,
.slide-down-leave-active {
  transition: all 1s ease;
}
</style>
