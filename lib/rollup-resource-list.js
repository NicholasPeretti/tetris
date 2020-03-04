const resourceListMarker = '___REPLACE_THIS_WITH_RESOURCE_LIST_LATER'

export default function resourceList() {
  return {
    name: 'resource-list',
    resolveId(id) {
      if (id !== 'resource-list:') {
        return null
      }
      return id
    },
    load(id) {
      if (id !== 'resource-list:') {
        return null
      }
      return `export default ${resourceListMarker};`
    },
    generateBundle(_outputOptions, bundle) {
      const resourceListJSON = JSON.stringify(
        Object.keys(bundle).map(key => bundle[key].fileName)
      )

      for (const item of Object.values(bundle)) {
        if (!item.code) {
          continue
        }
        item.code = item.code.replace(resourceListMarker, resourceListJSON)
      }
    },
  }
}
