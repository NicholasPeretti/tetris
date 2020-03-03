import { spawn } from 'child_process'
import { relative, join } from 'path'
import { promises as fsp } from 'fs'

import * as ts from 'typescript'

const extRe = /\.tsx?$/

function loadConfig(mainPath) {
  const fileName = ts.findConfigFile(mainPath, ts.sys.fileExists)
  if (!fileName) throw Error('tsconfig not found')
  const text = ts.sys.readFile(fileName)
  const loadedConfig = ts.parseConfigFileTextToJson(fileName, text).config
  const parsedTsConfig = ts.parseJsonConfigFileContent(
    loadedConfig,
    ts.sys,
    process.cwd(),
    undefined,
    fileName
  )
  return parsedTsConfig
}

export default function simpleTS(mainPath, { noBuild, watch } = {}) {
  const config = loadConfig(mainPath)
  const args = ['-b', mainPath]

  let done = Promise.resolve()

  if (!noBuild) {
    done = new Promise(resolve => {
      const proc = spawn('tsc', args, {
        stdio: 'inherit',
      })

      proc.on('exit', code => {
        if (code !== 0) {
          throw Error('TypeScript build failed')
        }
        resolve()
      })
    })
  }

  if (!noBuild && watch) {
    done.then(() => {
      spawn('tsc', [...args, '--watch', '--preserveWatchOutput'], {
        stdio: 'inherit',
      })
    })
  }

  return {
    name: 'rollup-typescript',
    buildStart: () => done,
    resolveId(id, importer) {
      // If there isn't an importer, it's an entry point, so we don't need to resolve it relative
      // to something.
      if (!importer) return null

      const tsResolve = ts.resolveModuleName(
        id,
        importer,
        config.options,
        ts.sys
      )

      if (
        // It didn't find anything
        !tsResolve.resolvedModule ||
        // Or if it's linking to a definition file, it's something in node_modules,
        // or something local like css.d.ts
        tsResolve.resolvedModule.extension === '.d.ts'
      ) {
        return null
      }
      return tsResolve.resolvedModule.resolvedFileName
    },
    load(id) {
      if (!extRe.test(id)) return null

      // Look for the JS equivalent in the tmp folder
      const newId = join(
        config.options.outDir,
        relative(process.cwd(), id)
      ).replace(extRe, '.js')

      return fsp.readFile(newId, { encoding: 'utf8' })
    },
  }
}
