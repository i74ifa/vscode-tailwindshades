const Values = require('values.js')
const vscode = require('vscode')

/**
 * @param {number} steps
 * @param {string} color
 */
function generatePalette(steps, color) {
  const generator = new Values()
  if (!generator.setColor(color)) {
    return null
  }
  const opacityModifierSyntax = vscode.workspace.getConfiguration('tailwindshades').get('opacityModifierSyntax')

  const palette = generator
    .all(steps)
    .filter(({ weight }) => weight !== 100)
    .reduce(
      (ac, c, index) => ({
        ...ac,
        [(index + 1) * 100]: opacityModifierSyntax ? `${c.rgb[0]}, ${c.rgb[1]}, ${c.rgb[2]}` : c.hexString(),
      }),
      {},
    )

  return palette
}

/**
 * @param {string} colorName
 * @param {object} palette
 * @param {number} tabSize
 */
function getPaletteString(colorName, palette, tabSize) {
  return `${colorName}: ${JSON.stringify(palette, null, tabSize).replace(
    /"([^"]+)":/g,
    '$1:',
  )},`
}

/**
 * @param {string} colorName
 * @param {object} palette
 * @param {number} tabSize
 */
function getPaletteStringCSSVars(colorName, palette, tabSize) {
  const paletteString = Object.entries(palette)
    .map(([key, value], index) => {
      return `${
        index === 0 ? '' : ' '.repeat(tabSize)
      }--${colorName}-${key}: ${value};`
    })
    .join('\n')

  return paletteString
}

/**
 * @param {*} editor TextEditor
 */
function getSelection(editor) {
  const selectionAcitve = editor.selection.active
  const selectionAnchor = editor.selection.anchor
  const selection = editor.selection.isReversed
    ? selectionAcitve
    : selectionAnchor

  return selection
}

module.exports = {
  getSelection,
  generatePalette,
  getPaletteString,
  getPaletteStringCSSVars,
}
