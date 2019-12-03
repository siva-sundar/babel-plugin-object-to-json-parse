import { ObjectExpression } from '@babel/types'
import { NodePath } from '@babel/traverse'
import { converter } from '../utils'

interface PluginState {
  opts: {
    minJSONStringSize: number
  }
}

const DEFAULT_THRESHOLD = 1024

/* eslint-disable no-redeclare */
export function ObjectExpression(
  path: NodePath<ObjectExpression>,
  state: PluginState
) {
  try {
    const obj = converter(path.node)
    const json = JSON.stringify(obj)

    // it simply isn't worth it to convert into the AST objects that are too small.
    // so, this plugin only convert large objects by default.
    const { minJSONStringSize } = state.opts
    const threshold =
      minJSONStringSize !== undefined ? minJSONStringSize : DEFAULT_THRESHOLD
    if (json.length < threshold) {
      return
    }
    path.replaceWithSourceString(`JSON.parse('${json}')`)
  } catch (e) {
    // disable error message
    // const { loc } = path.parent
    // const line = loc && loc.start.line
    // console.error(
    //   `At ${line} line (start) : The object wasn't converted (${e.message})`
    // )
  }
}
