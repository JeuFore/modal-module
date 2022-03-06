<template>
  <div
    class="fixed z-40 inset-0 overflow-y-auto"
    :class="[globalModalClass]"
    :id="`modal-${id}`"
    ref="modal"
  >
    <transition
      enter-active-class="ease-out duration-300"
      enter-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200"
      leave-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="active"
        class="fixed inset-0 transition-opacity"
        :id="`modal-backdrop-${id}`"
        @click="force ? () => {} : destroy()"
      >
        <div class="absolute inset-0 bg-black opacity-75">
          <div class="fixed top-0 right-0 p-3">
            <div
              v-if="!force"
              class="p-3 cursor-pointer rounded-full transition ease-in-out duration-150 hover:bg-gray"
            >
              <IconTimes class="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:items-center sm:pb-4">
      <transition
        enter-active-class="ease-out duration-300"
        enter-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-active-class="ease-in duration-200"
        leave-class="opacity-100 translate-y-0 sm:scale-100"
        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div
          v-if="active"
          class="inline-block align-bottom rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full sm:p-6"
          :class="[className, maxWidth, bgColor]"
          :style="`max-height: calc(100vh - 5rem); height: ${height}`"
          role="dialog"
        >
          <slot>
            <div class="sm:flex sm:items-start">
              <div
                :class="typeColors[type]"
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
              >
                <IconCheck
                  v-if="type === 'success'"
                  class="h-5 w-5"
                  primary="text-green-600"
                  secondary="text-green-500"
                />
                <IconInfo
                  v-if="type === 'info'"
                  class="h-5 w-5"
                  primary="text-blue-600"
                  secondary="text-blue-500"
                />
                <IconBang
                  v-if="type === 'danger'"
                  class="h-5 w-5"
                  primary="text-red-600"
                  secondary="text-red-500"
                />
                <IconBang
                  v-if="type === 'warning'"
                  class="h-5 w-5"
                  primary="text-yellow-600"
                  secondary="text-yellow-500"
                />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <slot name="header">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-300">
                    {{ title }}
                  </h3>
                </slot>
                <div class="mt-2">
                  <slot name="body">
                    <p class="text-sm leading-5">
                      {{ body }}
                    </p>
                  </slot>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 ">
              <slot name="footer">
                <div class="sm:flex sm:flex-row-reverse">
                  <push-button
                    v-if="primaryAction"
                    ref="primaryAction"
                    class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto justify-center"
                    :theme="primaryAction.theme"
                    @click.native="primaryAction.handler ? primaryAction.handler() : () => {}"
                  >
                    {{ primaryAction.label }}
                  </push-button>
                  <push-button
                    v-if="closeAction"
                    ref="closeAction"
                    class="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto justify-center"
                    :theme="closeAction.theme || 'white'"
                    @click.native="destroy()"
                  >
                    {{ closeAction.label || closeAction }}
                  </push-button>
                </div>
              </slot>
            </div>
          </slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import IconTimes from "./IconTimes.vue";
import { IconCheck, IconInfo, IconBang } from "tv-icon";
import { PushButton } from "tv-button";

export default {
  name: "Modal",
  components: {
    IconTimes,
    IconCheck,
    IconInfo,
    IconBang,
    PushButton,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
    globalHeaderClass: {
      type: String,
      default: "",
    },
    globalBodyClass: {
      type: String,
      default: "",
    },
    globalFooterClass: {
      type: String,
      default: "",
    },
    globalModalClass: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      active: false,
      typeColors: {
        success: "bg-green-100 dark:bg-green-900",
        info: "bg-blue-100 dark:bg-blue-900",
        danger: "bg-red-100 dark:bg-red-900",
        warning: "bg-yellow-100 dark:bg-yellow-900",
      },
      escCloseFunction: ({ key }) => {
        if (key === "Escape" && !this.force) this.destroy();
      },
    };
  },
  beforeCreate() {
    document.body.style.overflow = "hidden";
  },
  mounted() {
    this.active = true;
    document.body.addEventListener("keydown", this.escCloseFunction);
    setTimeout(() => {
      if (this.$refs["primaryAction"]) this.$refs["primaryAction"].$el.focus();
    }, 200);
  },
  beforeDestroy() {
    document.body.removeEventListener("keydown", this.escCloseFunction);
    document.body.style.overflow = "";
  },
  methods: {
    destroy() {
      this.active = false;
      if (this.closeAction?.handler) this.closeAction.handler();
      setTimeout(() => {
        this.closeModal();
      }, 200);
    },
  },
};
</script>