<template>
  <div>
    <OrderHeader title="我的购物车">
      <template v-slot:tip>
        <span>温馨提示：产品是否购买成功，以最终下单为准哦，请尽快结算</span>
      </template>
    </OrderHeader>
    <div class="wrapper">
      <div class="container">
        <div class="cart-box">
          <ul class="cart-item-head">
            <li class="col-1">
              <span
                class="checkbox"
                :class="{ checked: allChecked }"
                @click="toggleAll"
              ></span>
              全选
            </li>
            <li class="col-3">商品名称</li>
            <li class="col-1">单价</li>
            <li class="col-2">数量</li>
            <li class="col-1">小计</li>
            <li class="col-1">操作</li>
          </ul>
          <ul class="cart-item-list">
            <li class="cart-item" v-for="(item, index) in list" :key="index">
              <div class="item-check">
                <span
                  class="checkbox"
                  :class="{ checked: item.productSelected }"
                  @click="updataCart(item)"
                ></span>
              </div>
              <div class="item-name">
                <img v-lazy="item.productMainImage" alt="" />
                <span>{{ item.productName + "," + item.productSubtitle }}</span>
              </div>
              <div class="item-price">{{ item.productPrice }}</div>
              <div class="item-num">
                <div class="num-box">
                  <a href="javascript:;" @click="updataCart(item, '-')">-</a>
                  <span>{{ item.quantity }}</span>
                  <a href="javascript:;" @click="updataCart(item, '+')">+</a>
                </div>
              </div>
              <div class="item-total">{{ item.productTotalPrice }}</div>
              <div class="item-del" @click="delProduct(item)"></div>
            </li>
          </ul>
        </div>
        <div class="order-wrap clearfix">
          <div class="cart-tip fl">
            <a href="/">继续购物</a>
            共
            <span>{{ list.length }}</span>
            件商品，已选择
            <span>{{ checkedNum }}</span>
            件
          </div>
          <div class="total fr">
            合计：
            <span>{{ cartTotalPrice }}</span>
            元
            <a href="javascript:;" class="btn" @click="order">去结算</a>
          </div>
        </div>
      </div>
    </div>
    <NavFooter></NavFooter>
    <Modal
      modalType="small"
      title="提示"
      btnType="3"
      :showModal="showModal"
      @submit="confirmDelProduct"
      @cancel="showModal = false"
    >
      <template #body>您确定要删除该商品吗？</template>
    </Modal>
  </div>
</template>

<script>
  import OrderHeader from "../components/OrderHeader.vue"
  import NavFooter from "../components/NavFooter.vue"
  import Modal from "../components/Modal.vue"
  export default {
    data() {
      return {
        list: [], //商品列表
        allChecked: false, //是否全选
        cartTotalPrice: 0, //商品总金额
        checkedNum: 0, //选中商品数量
        showModal: false, // 显示模态框
        pId: 0,
      }
    },
    methods: {
      getCarts() {
        this.axios.get("/carts").then(res => {
          this.list = res.cartProductVoList || []
          this.cartTotalPrice = res.cartTotalPrice
          this.allChecked = res.selectedAll
          this.checkedNum = res.cartProductVoList.filter(
            item => item.productSelected
          ).length
        })
      },
      updataCart(item, type) {
        let id = item.productId
        let quantity = item.quantity
        let selected = item.productSelected
        if (type == "-") {
          if (quantity <= 1) {
            return this.$message.warning("商品至少为一件")
          }
          // 减少
          --quantity
        } else if (type == "+") {
          // 增加
          if (quantity >= item.productStock) {
            return this.$message.warning("商品购买数量不能超过库存数量!")
          }
          ++quantity
        } else {
          selected = !item.productSelected
        }
        this.axios
          .put(`/carts/${id}`, {
            quantity,
            selected,
          })
          .then(res => {
            this.getCarts()
          })
      },
      toggleAll() {
        let url = this.allChecked ? "/carts/unSelectAll" : "/carts/selectAll"
        this.axios.put(url).then(res => {
          this.getCarts()
        })
      },
      confirmDelProduct() {
        this.axios.delete(`/carts/${this.pId}`).then(res => {
          this.getCarts()
          this.showModal = false
        })
      },
      delProduct(item) {
        this.pId = item.productId
        this.showModal = true
      },
      order() {
        console.log("aa")
        if (this.list.every(item => !item.productSelected)) {
          this.$message.warning("请选择要结算的商品！")
        } else {
          this.$router.push("/order/confirm")
        }
      },
    },

    mounted() {
      this.getCarts()
    },
    components: {
      OrderHeader,
      NavFooter,
      Modal,
    },
  }
</script>

<style lang="scss">
  @import "../assets/scss/button.scss";
  .wrapper {
    background-color: #f5f5f5;
    padding-top: 30px;
    padding-bottom: 114px;
    .cart-box {
      background-color: #fff;
      font-size: 14px;
      color: #999999;
      text-align: center;
      .checkbox {
        display: inline-block;
        width: 22px;
        height: 22px;
        border: 1px solid #e5e5e5;
        vertical-align: middle;
        margin-right: 17px;
        cursor: pointer;
        &.checked {
          background: url("/public/imgs/icon-gou.png") #ff6600 no-repeat center;
          background-size: 16px 12px;
          border: none;
        }
      }
      .cart-item-head {
        display: flex;
        height: 79px;
        line-height: 79px;
        .col-1 {
          flex: 1;
        }
        .col-2 {
          flex: 2;
        }
        .col-3 {
          flex: 3;
        }
      }
      .cart-item-list {
        .cart-item {
          display: flex;
          align-items: center;
          height: 125px;
          border-top: 1px solid #e5e5e5;
          font-size: 16px;
          .item-check {
            flex: 1;
          }
          .item-name {
            flex: 3;
            font-size: 18px;
            color: #333333;
            display: flex;
            align-items: center;
            img {
              width: 80px;
              vertical-align: middle;
            }
            span {
              margin-left: 30px;
            }
          }
          .item-price {
            flex: 1;
            color: #333333;
          }
          .item-num {
            flex: 2;
            .num-box {
              display: inline-block;
              width: 150px;
              height: 40px;
              line-height: 40px;
              border: 1px solid #e5e5e5;
              font-size: 14px;
              a {
                display: inline-block;
                width: 50px;
                color: #333333;
              }
              span {
                display: inline-block;
                width: 50px;
                color: #333333;
              }
            }
          }
          .item-total {
            flex: 1;
            color: #ff6600;
          }
          .item-del {
            flex: 1;
            width: 14px;
            height: 12px;
            background: url("../../public/imgs/icon-close.png") no-repeat center;
            background-size: contain;
            cursor: pointer;
          }
        }
      }
    }
    .order-wrap {
      font-size: 14px;
      color: #666666;
      margin-top: 20px;
      height: 50px;
      line-height: 50px;
      .cart-tip {
        margin-left: 29px;
        a {
          color: #666666;
          margin-right: 37px;
        }
        span {
          color: #ff6600;
          margin: 0 5px;
        }
      }
      .total {
        font-size: 14px;
        color: #ff6600;
        span {
          font-size: 24px;
        }
        a {
          width: 202px;
          height: 50px;
          line-height: 50px;
          font-size: 18px;
          margin-left: 37px;
        }
      }
    }
  }
</style>
