<template>
  <div class="home justify-center">
    <svg width="300px" height="430" style="margin-top:100px">
      <image xlink:href="/img/maps/2018.png" width="300"></image>
    </svg>
    <h1>海峡两岸牵牵手</h1>
    <i
      class="material-icons"
      @click="$router.push('home')"
      style="cursor: pointer; font-size: 48px;"
      >expand_more</i
    >
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "welcome",
  components: {},
  methods: {}
};
</script>

<style scoped>
.home {
  align-content: center;
  text-align: center;
}
</style>
