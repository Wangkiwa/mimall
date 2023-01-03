<template>
  <div class="header">
    <div class="nav-topbar">
      <div class="container">
        <div class="topbar-menu">
          <a href="javascript:;">小米商城</a>
          <a href="javascript:;">MUI</a>
          <a href="javascript:;">云服务</a>
          <a href="javascript:;">协议规则</a>
        </div>
        <div class="topbar-user">
          <a href="javascript:;" v-if="username">{{ username }}</a>
          <a href="javascript:;" v-if="username" @click="logout">退出</a>
          <a href="javascript:;" v-if="!username" @click="goLogin">登录</a>
          <a href="/#/order/list" v-if="username">订单</a>
          <a href="javascript:;" class="my-cart" @click="goCart">
            <span class="icon-cart"></span>
            购物车 ({{ cartCount }})
          </a>
        </div>
      </div>
    </div>
    <div class="nav-header">
      <div class="container">
        <div class="header-logo">
          <a href="/#/index"></a>
        </div>
        <div class="header-menu">
          <div class="item-menu">
            <span>小米手机</span>
            <div class="children">
              <ul>
                <li
                  class="product"
                  v-for="(phone, index) in phoneList"
                  :key="index"
                >
                  <a href="" target="_blank">
                    <div class="pro-img">
                      <img :src="phone.mainImage" alt="" />
                    </div>
                    <div class="pro-name">{{ phone.name }}</div>
                    <div class="pro-price">{{ phone.price | currency }}</div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="item-menu">
            <span>RedMi红米</span>
          </div>
          <div class="item-menu">
            <span>电视</span>
            <div class="children">
              <ul>
                <li class="product">
                  <a href="" target="_blank">
                    <div class="pro-img">
                      <img src="../../public/imgs/nav-img/nav-3-1.jpg" alt="" />
                    </div>
                    <div class="pro-name">小米壁画电视 65英寸</div>
                    <div class="pro-price">6999元</div>
                  </a>
                </li>
                <li class="product">
                  <a href="" target="_blank">
                    <div class="pro-img">
                      <img src="../../public/imgs/nav-img/nav-3-2.jpg" alt="" />
                    </div>
                    <div class="pro-name">小米全面屏电视E55A</div>
                    <div class="pro-price">1999元</div>
                  </a>
                </li>
                <li class="product">
                  <a href="" target="_blank">
                    <div class="pro-img">
                      <img src="../../public/imgs/nav-img/nav-3-3.png" alt="" />
                    </div>
                    <div class="pro-name">小米电视4A 32英寸</div>
                    <div class="pro-price">699元</div>
                  </a>
                </li>
                <li class="product">
                  <a href="" target="_blank">
                    <div class="pro-img">
                      <img src="../../public/imgs/nav-img/nav-3-4.jpg" alt="" />
                    </div>
                    <div class="pro-name">小米电视4A 55英寸</div>
                    <div class="pro-price">1799元</div>
                  </a>
                </li>
                <li class="product">
                  <a href="" target="_blank">
                    <div class="pro-img">
                      <img src="../../public/imgs/nav-img/nav-3-5.jpg" alt="" />
                    </div>
                    <div class="pro-name">小米电视4A 65英寸</div>
                    <div class="pro-price">2699元</div>
                  </a>
                </li>
                <li class="product">
                  <a href="" target="_blank">
                    <div class="pro-img">
                      <img src="../../public/imgs/nav-img/nav-3-6.png" alt="" />
                    </div>
                    <div class="pro-name">查看全部</div>
                    <div class="pro-price">查看全部</div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="header-search">
          <input type="text" name="keyword" />
          <a href="javascript:;"></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex"
  export default {
    data() {
      return {
        phoneList: [],
      }
    },
    computed: {
      ...mapState(["username", "cartCount"]),
    },
    filters: {
      currency(val) {
        if (!val) return "0.00"
        return "￥" + val.toFixed(2) + "元"
      },
    },
    methods: {
      getProductList() {
        this.axios
          .get("/products", {
            params: {
              categoryId: "100012",
              pageSize: 6,
            },
          })
          .then(res => {
            console.log(res)
            this.phoneList = res.list
          })
      },
      goLogin() {
        this.$router.push("/login")
      },
      logout() {
        this.axios.post("/user/logout").then(res => {
          this.$message.success("退出成功")
          this.$cookie.set("userId", " ", { expires: "-1" }) //expires表示过期时间，这里是立即过期
          this.$store.dispatch("SAVEUSERNAME", "")
          this.$store.dispatch("SAVECARTCOUNT", "0")
        })
      },
      getCartCount() {
        this.axios.get("/carts/products/sum").then((res = 0) => {
          this.$store.dispatch("SAVECARTCOUNT", res)
        })
      },
      goCart() {
        this.$router.push("/cart")
      },
    },
    created() {
      this.getProductList()
      if (this.$route.params.from && this.$route.params.from === "login") {
        this.getCartCount()
      }
    },
  }
</script>

<style lang="scss">
  @import url("../assets/scss/base.scss");
  @import "../assets/scss/mixin.scss";
  @import "../assets/scss/config.scss";
  .header {
    .nav-topbar {
      height: 39px;
      line-height: 39px;
      background-color: #333;
      color: #b0b0b0;
      .container {
        display: flex;
        justify-content: space-between;
        a {
          display: inline-block;
          color: #b0b0b0;
          margin-right: 17px;
          &:hover {
            color: #fff;
          }
        }
        .my-cart {
          width: 110px;
          background-color: #ff6600;
          text-align: center;
          color: #fff;
          margin-right: 0px;
          .icon-cart {
            @include bgImg(
              16px,
              12px,
              "../../public/imgs/icon-cart-checked.png"
            );
            margin-right: 4px;
            vertical-align: text-top;
          }
        }
      }
    }
    .nav-header {
      .container {
        height: 112px;
        position: relative;
        @include flex();
        .header-logo {
          display: inline-block;
          width: 55px;
          height: 55px;
          background-color: #ff6600;
          a {
            display: inline-block;
            width: 110px;
            height: 55px;
            transition: all 0.2s;
            &::before {
              content: " ";
              @include bgImg(55px, 55px, "../../public/imgs/mi-logo.png", 55px);
            }
            &::after {
              content: " ";
              @include bgImg(55px, 55px, "../../public/imgs/mi-home.png", 55px);
            }
            &:hover {
              margin-left: -55px;
              transition: all 0.2s;
            }
          }
        }
        .header-menu {
          display: inline-block;
          width: 643px;
          padding-left: 209px;
          .item-menu {
            display: inline-block;
            color: #333;
            font-weight: bold;
            font-size: 16px;
            line-height: 112px;
            margin-right: 20px;
            cursor: pointer;
            span {
              cursor: pointer;
            }
            &:hover {
              color: $colorA;
              .children {
                height: 220px;
                opacity: 1;
              }
            }
            .children {
              position: absolute;
              top: 112px;
              left: 0;
              width: 1226px;
              height: 0;
              opacity: 0;
              transition: all 0.5s;
              overflow: hidden;
              border-top: 1px solid #e5e5e5;
              box-shadow: 0px 7px 6px 0px rgba(0, 0, 0, 0.11);
              background-color: #fff;
              z-index: 999;
              .product {
                float: left;
                width: 16.6%;
                height: 220px;
                font-size: 12px;
                line-height: 12px;
                text-align: center;
                position: relative;
                a {
                  display: inline-block;
                  width: 100%;
                }
                img {
                  width: auto;
                  height: 111px;
                  margin-top: 26px;
                }
                .pro-img {
                  height: 137px;
                }
                .pro-name {
                  font-weight: bold;
                  margin-top: 19px;
                  margin-bottom: 8px;
                  color: $colorB;
                }
                .pro-price {
                  color: $colorA;
                }
                &::before {
                  content: " ";
                  position: absolute;
                  top: 28px;
                  right: 0;
                  border-left: 1px solid #d7d7d7;
                  height: 100px;
                  width: 1px;
                }
                &::before {
                  display: none;
                }
              }
            }
          }
        }
        .header-search {
          width: 319px;
          border: 2px solid #e0e0e0;
          box-sizing: border-box;
          &:focus-within {
            border: 2px solid #ff6600;
          }
          input {
            border: none;
            box-sizing: border-box;
            border-right: 2px solid #e0e0e0;
            width: 264px;
            height: 50px;
            padding-left: 14px;
            &:focus {
              border-right: 2px solid #ff6600;
            }
          }
          a {
            @include bgImg(18px, 18px, "../../public/imgs/icon-search.png");
            margin-left: 17px;
          }
        }
      }
    }
  }
</style>
