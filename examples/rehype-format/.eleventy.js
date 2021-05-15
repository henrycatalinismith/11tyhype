const format = require("rehype-format")
const { rehypePlugin } = require("../../")

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(rehypePlugin, {
    plugins: [
      [format],
    ],
    verbose: true,
  })
}
