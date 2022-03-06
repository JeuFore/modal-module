import Vue from 'vue'
import ModalProps from '~/modules/modal-module/props';
import ModalComponent from '~/modules/modal-module/modal.vue';
import constants from '~/modules/modal-module/constants';

const globalProps = {}
const ModalDirectiveManager = {}

const globalClassNames = <%= serializeFunction(options.classNames) %>;

if (globalClassNames)
    Object.entries(globalClassNames).forEach(([key, value]) => {
        globalProps[constants.options.classNames[key]] = value
    })

const watch = {}
Object.keys(ModalProps).forEach(prop => {
    watch[prop] = function (n, p) {
        if (n !== p && this._internalModal)
            this._internalModal._props[prop] = n
    }
})

const Modal = Vue.extend({
    name: 'Modal',
    props: ModalProps,
    watch,
    mounted() {
        ModalDirectiveManager[this.$attrs.id] = {
            state: false,
            make: this.makeModal,
            close: () => { },
        }
    },
    beforeDestroy() {
        if (this._internalModal)
            this._internalModal.destroy()
    },
    data() {
        return {
            _internalModal: null
        }
    },
    methods: {
        makeModal() {
            const div = document.createElement('div')
            document.body.appendChild(div)

            const Modal = Vue.extend(ModalComponent);

            const propsData = {
                ...this._props,
                ...globalProps,
                id: this.$attrs.id,
            };

            this._internalModal = new Modal({
                methods: {
                    closeModal: this.closeModal,
                },
                props: ModalProps,
                propsData
            })

            this._internalModal.$slots = this.$slots;
            this._internalModal.$scopedSlots = this.$scopedSlots;

            this._internalModal.$mount(div);
            ModalDirectiveManager[this.$attrs.id].state = true;
            ModalDirectiveManager[this.$attrs.id].close = this._internalModal.destroy;
        },
        closeModal() {
            ModalDirectiveManager[this.$attrs.id].state = false;
            ModalDirectiveManager[this.$attrs.id].close = () => { };
            if (this._internalModal) {
                this._internalModal.$destroy()
                this._internalModal.$el.remove()
                this._internalModal = null
            }
        }
    },
    render(h) {
        return h()
    }
})

Vue.component('Modal', Modal);

const ModalDirectiveListener = ({ target }) => {
    const modal = ModalDirectiveManager[target.getAttribute('data-modal-id')]
    if (modal)
        modal.state ? modal.close() : modal.make()
}

Vue.directive('modal', {
    bind: (el, { modifiers }) => {
        const modalId = Object.keys(modifiers)[0];
        el.setAttribute('data-modal-id', modalId);
        el.addEventListener('click', ModalDirectiveListener)
    },
    unbind: (el) => {
        el.removeEventListener('click', ModalDirectiveListener)
    },
    update: (el, { modifiers }) => {
        const modalId = Object.keys(modifiers)[0];
        el.setAttribute('data-modal-id', modalId);
    }
})

Vue.prototype.$modal = {
    toggle(id) {
        const modal = ModalDirectiveManager[id]
        if (modal)
            modal.state ? modal.close() : modal.make()
    },
    show(id) {
        const modal = ModalDirectiveManager[id]
        if (modal)
            modal.make()
    },
    hide(id) {
        const modal = ModalDirectiveManager[id]
        if (modal)
            modal.close()
    }
}