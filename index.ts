import { Logger } from "eazy-logger"
import fs from "fs"
import rehype from "rehype"
import unified from "unified/types/ts4.0/index"
import { name, version } from "./package.json"

interface EleventyConfig {
  addTransform: (
    name: string,
    fn: (content: string, path: string) => string
  ) => void
}

interface Options {
  plugins?: unified.Plugin<[], rehype.RehypeOptions>[]
}

export const rehypePlugin = {
  initArguments: {},
  configFunction: function(eleventyConfig: EleventyConfig, options) {
    const logger = Logger({
      prefix: `[{blue:${name}}@{blue:${version}}] `,
    })

    const processor = rehype()
    ;(options.plugins || []).forEach(plugin => {
      processor.use.apply(processor, plugin)
    })

    eleventyConfig.addTransform(
      name,
      function(content: string, outputPath: string): string {
        if (outputPath && outputPath.endsWith(".html")) {

          const start = process.hrtime()
          content = processor.processSync(content).toString()
          const end = process.hrtime(start)
          const time = Math.ceil(end[0] * 1e9 + end[1] / 1e6)

          logger.info(`transformed {green:${outputPath}} [{magenta:${time}ms}]`)
        }
        return content
      }
    )
  }
}

