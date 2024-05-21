const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  },  devServer: {
    proxy: {
      '/api': {
        target: 'https://mlmachinedev-dnkjo.eastus.inference.ml.azure.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '/score' },
      },
    },
  },
})
