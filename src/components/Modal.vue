<template>
  <transition name="fade">
    <div class="modal" v-if="showModal">
      <div class="mask"></div>
      <div class="modal-dialog">
        <!-- 头部 -->
        <div class="modal-header">
          <span>{{ title }}</span>
          <a
            href="javascript:;"
            class="icon-close"
            @click="$emit('cancel')"
          ></a>
        </div>
        <!-- 内容 -->
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <!-- 底部  -->
        <div class="modal-footer">
          <a
            href="javascript:;"
            v-if="btnType == 1"
            class="btn"
            @click="$emit('submit')"
          >
            {{ sureText }}
          </a>
          <a
            href="javascript:;"
            v-if="btnType == 2"
            class="btn"
            @click="$emit('cancel')"
          >
            {{ cancelText }}
          </a>
          <div class="btn-group" v-if="btnType == 3">
            <a href="javascript:;" class="btn" @click="$emit('submit')">
              {{ sureText }}
            </a>
            <a
              href="javascript:;"
              class="btn btn-default"
              @click="$emit('cancel')"
            >
              {{ cancelText }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "mall-modal",
    props: {
      // 弹窗类型： 小small，中middle，大large，表单form
      modalType: {
        type: String,
        default: "form",
      },
      // 弹框标题
      title: String,
      // 按钮类型: 1.确定类型 2.取消类型 3.确定取消
      btnType: String,
      sureText: {
        type: String,
        default: "确定",
      },
      cancelText: {
        type: String,
        default: "取消",
      },
      showModal: Boolean,
    },
  }
</script>

<style lang="scss">
  @use "/src/assets/scss/modal.scss";
</style>
