const { Logger } = require("eazy-logger")
const fs = require("fs")
const rehype = require("rehype")
const parse = require("rehype-parse")
const stringify = require("rehype-stringify")

const pkg = JSON.parse(fs.readFileSync(`${__dirname}/package.json`, "utf-8"))

module.exports = {
  initArguments: {},
  configFunction: function(eleventyConfig, options) {
    const logger = Logger({
      prefix: `[{blue:${pkg.name}}] `,
    })

    const processor = rehype()
    processor.use(parse)
    ;(options.plugins || []).forEach(plugin => {
      processor.use.apply(processor, plugin)
    })
    processor.use(stringify)

    eleventyConfig.addTransform(
      pkg.name,
      function(content, outputPath) {
        if (outputPath && outputPath.endsWith(".html")) {
          content = processor.processSync(content).toString()
          logger.info(`transformed {green:${outputPath}}`)
        }
        return content
      }
    )
  }
}

