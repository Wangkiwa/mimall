<template>
  <div>
    <OrderHeader :title="title">
      <template #tip>
        <span>{{ tip }}</span>
      </template>
    </OrderHeader>
    <router-view></router-view>
    <ServiceBar></ServiceBar>
    <NavFooter></NavFooter>
  </div>
</template>

<script>
  import OrderHeader from "../components/OrderHeader.vue"
  import NavFooter from "../components/NavFooter.vue"
  import ServiceBar from "../components/ServiceBar.vue"
  export default {
    components: {
      OrderHeader,
      NavFooter,
      ServiceBar,
    },
    data() {
      return {
        title: "",
        tip: "",
      }
    },
    watch: {
      "$route.path": {
        handler: function (path, oldVal) {
          if (path == "/order/confirm") {
            this.title = "订单确认"
            this.tip = "请认真填写收获地址"
          } else if (path == "/order/list") {
            this.title = "订单列表"
            this.tip = "请谨防钓鱼链接或诈骗电话"
          } else if (path == "/order/pay") {
            this.title = "订单列表"
            this.tip = "请谨防钓鱼链接或诈骗电话"
          } else {
            this.title = "订单列表"
            this.tip = "请谨防钓鱼链接或诈骗电话"
          }
        },
        immediate: true,
        deep: true,
      },
    },
  }
</script>

<style lang="scss" scoped></style>
