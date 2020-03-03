import { render } from 'ejs'
import { readFileSync } from 'fs-extra'

export default function renderHtmlTemplate(
  templatePath,
  rollupHtmlPluginOptions
) {
  const ejsTemplate = readFileSync(templatePath).toString()
  const mainJsFile = rollupHtmlPluginOptions.files.js.find(el =>
    el.fileName.startsWith('main')
  )

  const workers = rollupHtmlPluginOptions.files.js.filter(el =>
    el.fileName.startsWith('worker')
  )

  const inlineFonts = []

  return render(ejsTemplate, {
    ...rollupHtmlPluginOptions,
    mainJsFile,
    workers,
    inlineFonts,
  })
}
