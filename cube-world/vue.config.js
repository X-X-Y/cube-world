module.exports = {
  devServer: {
    proxy: {
      '/socket.io': {
        // target: 'http://localhost:3000',
        target: 'http://cube.xxy.ink:3000',
        changeOrigin: true
      }
    },
    open: true
  }
}
