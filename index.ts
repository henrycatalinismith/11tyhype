import { Logger } from "eazy-logger"
import fs from "fs"
import rehype from "rehype"
import parse from "rehype-parse"
import stringify from "rehype-stringify"
import unified from "unified/types/ts4.0/index"

interface EleventyConfig {
  addTransform: (
    name: string,
    fn: (content: string, path: string) => string
  ) => void
}

interface Options {
  plugins?: unified.Plugin<[], rehype.RehypeOptions>[]
}

const pkg = JSON.parse(fs.readFileSync(`${__dirname}/package.json`, "utf-8"))

export const rehypePlugin = {
  initArguments: {},
  configFunction: function(eleventyConfig: EleventyConfig, options) {
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
      function(content: string, outputPath: string): string {
        if (outputPath && outputPath.endsWith(".html")) {
          content = processor.processSync(content).toString()
          logger.info(`transformed {green:${outputPath}}`)
        }
        return content
      }
    )
  }
}

