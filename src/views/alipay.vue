<template>
  <div class="ali-pay">
    <loadingVue v-if="loading"></loadingVue>
    <div class="form" v-html="content"></div>
  </div>
</template>

<script>
  import loadingVue from "../views/loading"
  export default {
    data() {
      return {
        orderId: this.$route.query.orderId,
        content: "",
        loading: true,
      }
    },
    mounted() {
      this.paySubmit()
    },
    components: {
      loadingVue,
    },
    methods: {
      paySubmit() {
        this.axios
          .post("/pay", {
            orderId: this.orderId,
            orderName: "Vue高仿小米商城",
            amount: 0.01, //元
            payType: 1, //1支付宝，2微信
          })
          .then(res => {
            this.content = res.content //这里拿到支付宝给回来的源码
            this.$nextTick(() => {
              document.forms[0].submit()
            })
          })
      },
    },
  }
</script>

<style></style>
