<p align="center">
  <img
    alt="11tyhype"
    src="https://github.com/hendotcat/11tyhype/raw/trunk/11tyhype.svg"
    height="64"
  />
</p>

<p align="center">
  <strong>
    Eleventy rehype plugin
  </strong>
</p>

<p align="center">
  <img
    src="https://github.com/hendotcat/11tyhype/actions/workflows/publish.yml/badge.svg"
    alt="Build status"
  />
</p>

11tyhype is a [rehype] plugin for [Eleventy][11ty].
It hooks up rehype as an HTML transform so you can add rehype plugins to your
Eleventy site with less boilerplate.

## Installation

```
yarn add -D @hendotcat/11tyhype rehype
```

## Usage

This example uses [`rehype-minify-whitespace`][rehype-minify-whitespace] to
strip out all the whitespace from the HTML of an Eleventy site.

```javascript
const { rehypePlugin } = require("@hendotcat/11tyhype")
const minifyWhitespace = require("rehype-minify-whitespace")

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(rehypePlugin, {
    plugins: [
      [minifyWhitespace],
    ]
  })
}
```

## Options

### `plugins`

The `plugins` array is a list of rehype plugins to use.
Each element of the array is an array of parameters that will be passed to
[rehype's `use()` function][use].

1. The first array element should be the plugin function. In the example above
   that's `minifyWhitespace`.
2. The second array element is optional. It's for passing options to plugins.

Here's an example with some options.
It's using [`rehype-urls`][rehype-urls], and the second parameter tells the
plugin to prefix every URL it finds with `https://example.org/`.

```
const { rehypePlugin } = require("@hendotcat/11tyhype")
const urls = require("rehype-urls")

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(rehypePlugin, {
    plugins: [
      [urls, url => {
        return `https://example.org/${url.href}`
      }],
    ]
  })
}
```

### `id`

If you have a lot of transforms in your Eleventy build then naming them can be
helpful for debugging build problems. So you can optionally pass an `id` string to
11tyhype and it'll use this value as the name for the transform.

### `verbose`

Pass `verbose: true` to the plugin and it'll output a whole bunch of
information about what it's doing. This is mostly useful for debugging. Please
enable this this option if you're reporting a bug in 11tyhype.

## Error Codes

11tyhype will try to help you set it up properly. If you make a mistake,
it'll try to help you understand. For some mistakes that it can recognize,
it'll print a link in the build output pointing at one of these error codes to
help you troubleshoot.

### `no-plugins`

This error code is generated when you add the plugin to Eleventy without giving
it any rehype plugins to apply.

Double check your code against the example at the top of this readme. The
second argument you pass to `eleventyConfig.addPlugin` should be an object with
a property called `plugins`.

### `invalid-plugin`

This error code is generated when you add the plugin to Eleventy with a mistake
in the list of `plugins`. The error message will tell you which plugin in your
list has the mistake: e.g. if it says `plugin #1 is invalid` then the very first
plugin in your list is the one that's wrong.

Read the [instructions for the `plugins` option](#plugins) and check that the
plugin specified by the error message has a rehype plugin function as its first
array element.

## Contributing

* [Tips][Contributing]
* [Code of Conduct]

## License

[MIT]

[11ty]: https://www.11ty.dev
[rehype]: https://github.com/rehypejs/rehype
[rehype-minify-whitespace]: https://github.com/rehypejs/rehype-minify/tree/main/packages/rehype-minify-whitespace
[rehype-urls]: https://github.com/brechtcs/rehype-urls
[use]: https://github.com/unifiedjs/unified#processoruseplugin-options
[Contributing]: https://github.com/hendotcat/11tyhype/blob/trunk/contributing.md
[Code of Conduct]: https://github.com/hendotcat/11tyhype/blob/trunk/code_of_conduct.md
[MIT]: https://github.com/hendotcat/11tyhype/blob/trunk/license
