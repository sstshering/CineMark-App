const path = require('path')

module.exports = {
    mode: 'development', 
    entry: {
        navbar: './src/navbar.js',
        index: './src/index.js',
        auth:  './src/auth.js',
        mngr_index: './src/mngr_index.js',
        seats: './src/seats.js',
        checkout: './src/checkout.js',
        viewProfile: './src/viewProfile.js',
        checkBalance: './src/checkBalance.js',
        promos: './src/promos.js',
        banner: './src/banner.js', 
        revenue: './src/revenue.js',
        checkout_vP: './src/checkout_vp.js',
        checkoutgc: './src/checkoutGC.js',
        menu: './src/menu.js',
        checkoutfd: './src/checkoutFD.js'
        
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    watch: true 
}   