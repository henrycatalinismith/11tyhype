const minifyWhitespace = require("rehype-minify-whitespace")
const { rehypePlugin } = require("../../")

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(rehypePlugin, {
    plugins: [
      [minifyWhitespace],
    ],
    verbose: true,
  })
}
