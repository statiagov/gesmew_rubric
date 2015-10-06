module.exports = {
  entry: './app/components/Main.js',
  output: {
    filename: 'public/rubric.js'
  },
  module: {
    loaders:[
      {
        test: /\.jsx?$/,
        exclude:/(node_modules|bower_components)/,
        loader:'babel',
        query: {stage:0}
      }
    ]
  }
}
