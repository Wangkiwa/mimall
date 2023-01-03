<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    mounted() {
      if (this.$cookie.get("userId")) {
        this.getUser()
        this.getCartCount()
      }
    },
    methods: {
      // 用户信息
      getUser() {
        this.axios.get("/user").then((res = {}) => {
          this.$store.dispatch("SAVEUSERNAME", res.username)
        })
      },
      // 购物车商品数量
      getCartCount() {
        this.axios.get("/carts/products/sum").then((res = 0) => {
          this.$store.dispatch("SAVECARTCOUNT", res)
        })
      },
    },
  }
</script>

<style lang="scss">
  @import "./assets/scss/reset.scss";
</style>
