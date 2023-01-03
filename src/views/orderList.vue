<template>
  <div class="order-list">
    <NoData v-if="!loading && list.length === 0"></NoData>
    <div class="wrapper" v-else>
      <div class="container">
        <div class="order-box">
          <div class="order" v-for="(order, index) in list" :key="index">
            <div class="order-title">
              <div class="item-info fl">
                {{ order.createTime }}
                <span>|</span>
                {{ order.receiverName }}
                <span>|</span>
                订单号：{{ order.orderNo }}
                <span>|</span>
                {{ order.paymentTypeDesc }}
              </div>
              <div class="item-money fr">
                <span>应付金额：</span>
                <span class="money">{{ order.payment }}</span>
                <span>元</span>
              </div>
            </div>
            <div
              class="order-content clearfix"
              v-for="(item, index) in order.orderItemVoList"
              :key="index"
            >
              <div class="good-box fl">
                <div class="good-list">
                  <div class="good-img">
                    <img v-lazy="item.productImage" alt="" />
                  </div>
                  <div class="good-name">
                    <div class="p-name">{{ item.productName }}</div>
                    <div class="p-money">
                      {{ item.currentUnitPrice }} X {{ item.quantity }}元
                    </div>
                  </div>
                </div>
              </div>
              <div class="good-state fr" v-if="order.status == 20">
                <a href="javascript:;">{{ order.statusDesc }}</a>
              </div>
              <!-- 未付款 -->
              <div class="good-state fr" v-else>
                <a href="javascript:;" @click="goPay(order.orderNo)">
                  {{ order.statusDesc }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页器加载 -->
      <el-pagination
        v-if="!loading"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="handleChange"
      ></el-pagination>
      <!-- 滚动条滚动 -->
      <div
        class="scroll-more"
        v-infinite-scroll="scrollMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="410"
      >
        <img
          src="/imgs/loading-svg/loading-spinning-bubbles.svg"
          v-if="busyLoading"
        />
      </div>
    </div>
    <Loading v-if="loading"></Loading>
  </div>
</template>
<script>
  import Loading from "./loading.vue"
  import NoData from "./../components/NoData.vue"
  import infiniteScroll from "vue-infinite-scroll"
  export default {
    name: "order-list",
    data() {
      return {
        list: [],
        loading: true,
        pageSize: 10, //每页显示多少条数据
        total: 0, //总共条数
        pageNum: 1, //当前页数
        busy: true, // 是否触发滚动 true不触发  false 触发
        busyLoading: false,
      }
    },
    directives: { infiniteScroll },
    mounted() {
      this.getOrderList()
    },
    methods: {
      getOrderList() {
        this.axios
          .get("/orders", {
            params: {
              pageSize: this.pageSize, //设置订单展示两条数据
              pageNum: this.pageNum,
            },
          })
          .then(res => {
            this.loading = false
            this.busy = false
            this.list = res.list
            this.total = res.total
          })
      },
      goPay(orderNo) {
        this.$router.push({
          //3.query传参方式  可以把参数添加到地址栏
          path: "/order/pay",
          query: {
            orderNo,
          },
        })
      },
      handleChange(pageNum) {
        this.pageNum = pageNum
        this.getOrderList()
      },
      scrollMore() {
        this.busyLoading = true
        this.busy = true
        setTimeout(() => {
          this.axios
            .get("/orders", {
              params: {
                pageSize: this.pageSize, //设置订单展示两条数据
                pageNum: this.pageNum,
              },
            })
            .then(res => {
              this.list = this.list.concat(res.list)
              this.busyLoading = false
              if (res.hasNextPage) {
                this.busy = false
              } else {
                this.busy = true
              }
            })
        }, 1000)
      },
    },
    components: {
      Loading,
      NoData,
    },
  }
</script>
<style lang="scss">
  @import "./../assets/scss/config.scss";
  @import "./../assets/scss/mixin.scss";
  .order-list {
    .wrapper {
      background-color: $colorJ;
      padding-top: 33px;
      padding-bottom: 110px;
      .order-box {
        .order {
          @include border();
          background-color: $colorG;
          margin-bottom: 31px;
          &:last-child {
            margin-bottom: 0;
          }
          .order-title {
            @include height(74px);
            background-color: $colorK;
            padding: 0 43px;
            font-size: 16px;
            color: $colorC;
            .item-info {
              span {
                margin: 0 9px;
              }
            }
            .money {
              font-size: 26px;
              color: $colorB;
            }
          }
          .order-content {
            padding: 0 43px;
            .good-box {
              width: 88%;
              .good-list {
                display: flex;
                align-items: center;
                height: 145px;
                .good-img {
                  width: 112px;
                  img {
                    width: 100%;
                  }
                }
                .good-name {
                  font-size: 20px;
                  color: $colorB;
                }
              }
            }
            .good-state {
              @include height(145px);
              font-size: 20px;
              color: $colorA;
              a {
                color: $colorA;
              }
            }
          }
        }
        .pagination {
          text-align: right;
        }
        .el-pagination.is-background .el-pager li:not(.disabled).active {
          background-color: #ff6600;
        }
        .el-button--primary {
          background-color: #ff6600;
          border-color: #ff6600;
        }
        .load-more,
        .scroll-more {
          text-align: center;
        }
      }
      .el-pagination {
        text-align: right !important;
        margin: 5px 25px 0 0;
      }
      .scroll-more {
        text-align: center;
      }
    }
  }
</style>
