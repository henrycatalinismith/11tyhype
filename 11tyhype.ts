import { Logger } from "eazy-logger"
import rehype from "rehype"
import unified from "unified/types/ts4.0/index"
import { name, version, homepage } from "./package.json"

interface EleventyConfig {
  addTransform: (
    name: string,
    fn: (content: string, path: string) => Promise<string>
  ) => void
}

interface Options {
  id?: string
  plugins?: unified.Plugin<[], rehype.RehypeOptions>[]
  verbose?: boolean
}

export const rehypePlugin = {
  initArguments: {},
  configFunction: function(
    eleventyConfig: EleventyConfig,
    options: Options,
  ) {
    const logger = Logger({
      prefix: `[{blue:${name}}@{blue:${version}}] `,
    })

    if (!options || !options.plugins) {
      logger.error("{red:error: no-plugins}")
      logger.error("{red:missing a list of rehype plugins to apply}")
      logger.error("{red:for more details, see:}")
      logger.error(`{red:${homepage}/#no-plugins}`)
      process.exit(-1)
    }

    for (const i in options.plugins) {
      if (typeof options.plugins[i][0] !== "function") {
        logger.error("{red:error: invalid-plugin}")
        logger.error(`{red:plugin #${i+1} is invalid}`)
        logger.error("{red:for more details, see:}")
        logger.error(`{red:${homepage}/#invalid-plugin}`)
        process.exit(-1)
      }
    }

    if (!options.id) {
      options.id = Math.ceil(Math.random() * 9999).toString()
    }

    if (!options.verbose) {
      logger.info = () => {}
    }

    const processor = rehype()
    options.plugins.forEach(plugin => {
      processor.use.apply(processor, plugin)
    })

    const transformName = `${name}:${options.id}`

    eleventyConfig.addTransform(
      transformName,
      async function(content: string, outputPath: string): Promise<string> {
        return new Promise((resolve) => {
          if (outputPath && outputPath.endsWith(".html")) {
            const start = process.hrtime()
            processor.process(content).then((vfile) => {
              content = vfile.toString()
              const end = process.hrtime(start)
              const time = Math.ceil(end[0] * 1e9 + end[1] / 1e6)
              logger.info([
                "transformed",
                `{green:${outputPath}}`,
                `[{magenta:${time}ms}]`,
                `[{magenta:${name}}]`,
              ].join(" "))
              resolve(content)
            })
          } else {
            resolve(content)
          }
        })
      }
    )
  }
}

