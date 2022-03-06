const path = require('path')

module.exports = function (moduleOptions) {
    const options = Object.assign({}, this.options.modal, moduleOptions)

    this.addPlugin({
        src: path.resolve(__dirname, './src/modal-manager.js'),
        fileName: 'modal.js',
        options
    })
}