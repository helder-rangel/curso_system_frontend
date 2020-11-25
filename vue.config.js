module.exports = {
    publicPath: process.env.VUE_APP_MODE === 'production' ? process.env.VUE_APP_BASE_ROUTE : '/',
    configureWebpack: {
        mode: process.env.VUE_APP_MODE === 'production' ? 'production' : 'development'
    },
    "transpileDependencies": [
        "vuetify"
    ],
    css: {
        extract: { ignoreOrder: true },

    }
}
