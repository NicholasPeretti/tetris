import { pathExistsSync, readFileSync, moveSync } from 'fs-extra'
import { join } from 'path'

export default function pwa({
  manifestPath = '',
  serviceWorkerFileName = 'sw',
}) {
  return {
    name: 'pwa-plugin',
    generateBundle(opt, bundle) {
      //  Emit manifest
      if (pathExistsSync(manifestPath)) {
        this.emitFile({
          type: 'asset',
          source: readFileSync(manifestPath),
          fileName: 'manifest.json',
        })
      }

      //  Remove hash from service worker filename
      if (serviceWorkerFileName) {
        const swFileName = Object.keys(bundle).find(name =>
          name.includes(serviceWorkerFileName)
        )

        if (!swFileName) {
          throw new Error(
            'No service worker found with the name ' + serviceWorkerFileName
          )
        }
        bundle[swFileName].fileName = 'sw.js'
      }
    },
  }
}
