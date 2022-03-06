export default {
    title: {
        type: String,
        default: '',
    },
    body: {
        type: String,
        default: '',
    },
    closeButton: {
        type: String,
        default: null
    },
    primaryAction: {
        type: Object,
        default: null
    },
    closeAction: {
        type: [Object, String],
        default: null
    },
    force: {
        type: Boolean,
        default: false,
    },
    hideCloseTimesIcon: {
        type: Boolean,
        default: false
    },
    bgColor: {
        type: String,
        default: 'bg-white',
    },
    height: {
        type: String,
        default: null,
    },
    className: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        default: 'info',
    },
    maxWidth: {
        type: String,
        required: false,
        default: "sm:max-w-lg",
    },
}