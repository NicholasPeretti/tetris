/**
 * Emits all the assets in the specified folder
 */
import { statSync, readdirSync, readFileSync } from 'fs-extra'
import { join, basename } from 'path'

export default function assets(assetFolderPath) {
  return {
    name: 'static-assets-plugin',
    generateBundle() {
      if (assetFolderPath) {
        emitAsset(this.emitFile, assetFolderPath)
      }
    },
  }
}

function emitAsset(emitAssetRollupFn, asset) {
  const assetStat = statSync(asset)

  if (assetStat.isDirectory()) {
    readdirSync(asset).forEach(childAsset =>
      emitAsset(emitAssetRollupFn, join(asset, childAsset))
    )
  } else {
    const assetName = basename(asset)
    emitAssetRollupFn({
      type: 'asset',
      source: readFileSync(asset),
      fileName: 'assets/' + assetName,
      name: assetName,
    })
  }
}
