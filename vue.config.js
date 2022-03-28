module.exports = {
  "publicPath": "./",
  "devServer": {
    "proxy": {
      '/socket.io': {
        target: 'http://192.168.1.145:10190/socket.io',
        changeOrigin: false
      },
      "/server": {
        "target": "http://192.168.0.200/server",
        "changeOrigin": true,
        "pathRewrite": {
          "^/server": ""
        }
      },
      '/sse': {
        'target': 'http://192.168.0.200/sse',
        'changeOrigin': true,
        'pathRewrite': {
          '^/sse': '',
        },
      },
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}