<template>
  <div class="order-pay">
    <div class="wrapper">
      <div class="container">
        <div class="order-wrap">
          <div class="item-order">
            <div class="icon-succ"></div>
            <div class="order-info">
              <h2>订单提交成功！去付款咯～</h2>
              <p>
                请在
                <span>30分</span>
                内完成支付, 超时后将取消订单
              </p>
              <p>收货信息： {{ addresInfo }}</p>
            </div>
            <div class="order-total">
              <p>
                应付总额：
                <span>{{ payment }}</span>
                元
              </p>
              <p>
                订单详情
                <em
                  class="icon-down"
                  :class="{ up: showDetail }"
                  @click="showDetail = !showDetail"
                ></em>
              </p>
            </div>
          </div>
          <div class="item-detail" v-if="showDetail">
            <div class="item">
              <div class="detail-title">订单号：</div>
              <div class="detail-info theme-color">{{ orderId }}</div>
            </div>
            <div class="item">
              <div class="detail-title">收货信息：</div>
              <div class="detail-info">
                {{ addresInfo }}
              </div>
            </div>
            <div class="item good">
              <div class="detail-title">商品名称：</div>
              <div class="detail-info">
                <ul>
                  <li v-for="(item, index) in orderDetail" :key="index">
                    <img v-lazy="item.productImage" />
                    {{ item.productName }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="item">
              <div class="detail-title">发票信息：</div>
              <div class="detail-info">电子发票 个人</div>
            </div>
          </div>
        </div>
        <div class="item-pay">
          <h3>选择以下支付方式付款</h3>
          <div class="pay-way">
            <p>支付平台</p>
            <div
              class="pay pay-ali"
              :class="{ checked: payType == 1 }"
              @click="paySubmit(1)"
            ></div>
            <div
              class="pay pay-wechat"
              :class="{ checked: payType == 2 }"
              @click="paySubmit(2)"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <ScanPayCode
      v-if="showPay"
      :payImg="payImg"
      @close="closeWeixinPay"
    ></ScanPayCode>
    <Modal
      title="支付确认"
      btnType="3"
      :showModal="showPayModal"
      sureText="查看订单"
      cancelText="未支付"
      @cancel="showPayModal = false"
      @submit="goOrderList"
    >
      <template #body>
        <p>您确认是否完成支付?</p>
      </template>
    </Modal>
  </div>
</template>
<script>
  import OrderHeader from "./../components/OrderHeader"
  import QRCode from "qrcode"
  import ScanPayCode from "./../components/ScanPayCode"
  import Modal from "./../components/Modal.vue"
  export default {
    name: "order-pay",
    data() {
      return {
        orderId: this.$route.query.orderNo,
        showDetail: false, //是否显示订单详情
        showPay: false, //是否显示微信支付弹框
        showPayModal: false, //查询支付
        addresInfo: "", //收货人地址
        orderDetail: "", //包含商品列表的订单详情
        payment: 0, //订单总金额
        payType: "", //支付类型
        payImg: "", //二维码图片
        T: "",
      }
    },
    components: {
      OrderHeader,
      ScanPayCode,
      Modal,
    },
    mounted() {
      this.getOrderDateil()
    },
    methods: {
      // 关闭微信弹框
      closePayModal() {
        this.showPay = false
        this.showPayModal = true
        clearInterval(this.T)
      },
      getOrderDateil() {
        this.axios.get(`/orders/${this.orderId}`).then(res => {
          let item = res.shippingVo //购物车地址实体
          this.addresInfo = `${item.receiverName}     ${item.receiverMobile}
                             ${item.receiverProvince} ${item.receiverCity} 
                             ${item.receiverDistrict} ${item.receiverAddress}`
          this.orderDetail = res.orderItemVoList
          this.payment = res.payment
        })
      },
      paySubmit(payType) {
        this.payType = payType
        if (payType == 1) {
          // 支付宝支付
          window.open("/#/order/alipay?orderId=" + this.orderId, "_blank")
        } else {
          this.axios
            .post("/pay", {
              orderId: this.orderId,
              orderName: "Vue高仿小米商城",
              amount: 0.01, //元
              payType: 2, //1支付宝，2微信
            })
            .then(res => {
              QRCode.toDataURL(res.content)
                .then(url => {
                  this.payImg = url
                  this.showPay = true
                  this.loopOrderState()
                })
                .catch(err => {
                  console.error(err)
                })
            })
        }
      },
      closeWeixinPay() {
        this.showPay = false
        this.showPayModal = true
        clearInterval(this.T)
      },
      //轮巡当前订单支付状态
      loopOrderState() {
        this.T = setInterval(() => {
          this.axios.get(`/orders/${this.orderId}`).then(res => {
            console.log(res)
            if (res.status == 20) {
              clearInterval(this.T) //消除计时器
              this.goOrderList()
            }
          })
        }, 1200)
      },
      goOrderList() {
        this.$router.push("/order/list")
      },
    },
  }
</script>
<style lang="scss" scoped>
  .order-pay {
    .wrapper {
      background-color: #f5f5f5;
      padding-top: 30px;
      padding-bottom: 61px;
      .order-wrap {
        padding: 62px 50px;
        background-color: #fff;
        font-size: 14px;
        margin-bottom: 30px;
        height: 100% !important;
        line-height: 18px !important;
        margin-top: 0px !important;
        .item-order {
          display: flex;
          align-items: center;
          .icon-succ {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: url("/public/imgs/icon-gou.png") #80c58a no-repeat
              center;
            background-size: 60px;
            margin-right: 40px;
          }

          .order-info {
            margin-right: 248px;

            h2 {
              font-size: 24px;
              color: #333333;
              margin-bottom: 20px;
            }

            p {
              color: #666666;

              span {
                color: #ff6700;
              }
            }
          }

          .order-total {
            & > p:first-child {
              margin-bottom: 30px;
            }

            span {
              font-size: 28px;
              color: #ff6700;
            }

            .icon-down {
              display: inline-block;
              width: 14px;
              height: 10px;
              background: url("/public/imgs/icon-down.png") no-repeat center;
              background-size: contain;
              margin-left: 9px;
              transition: all 0.5s;
              cursor: pointer;

              &.up {
                transform: rotate(180deg);
              }
            }

            .icon-up {
              transform: rotate(180deg);
            }
          }
        }

        .item-detail {
          border-top: 1px solid #d7d7d7;
          padding-top: 47px;
          padding-left: 130px;
          font-size: 14px;
          margin-top: 45px;

          .item {
            margin-bottom: 19px;

            .detail-title {
              float: left;
              width: 100px;
            }

            .detail-info {
              display: inline-block;

              img {
                width: 30px;
                vertical-align: middle;
              }
            }
          }
        }
      }

      .item-pay {
        padding: 26px 50px 72px;
        background-color: #ffffff;
        color: #333333;

        h3 {
          font-size: 20px;
          font-weight: 200;
          color: #333333;
          padding-bottom: 24px;
          border-bottom: 1px solid #d7d7d7;
          margin-bottom: 26px;
        }

        .pay-way {
          font-size: 18px;

          .pay {
            display: inline-block;
            width: 188px;
            height: 64px;
            border: 1px solid #d7d7d7;
            cursor: pointer;

            &:last-child {
              margin-left: 20px;
            }

            &.checked {
              border: 1px solid #ff6700;
            }
          }

          .pay-ali {
            background: url("/public/imgs/pay/icon-ali.png") no-repeat center;
            background-size: 103px 38px;
            margin-top: 19px;
          }

          .pay-wechat {
            background: url("/public/imgs/pay/icon-wechat.png") no-repeat center;
            background-size: 103px 38px;
          }
        }
      }
    }
  }
</style>
