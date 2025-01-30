import fs from 'fs'

export class CommandProcessor {
  static process (config) {
    const { filePath, outputFilePath, patterns } = config
    // ... shared processing logic
    let content = fs.readFileSync(filePath, 'utf8')

    patterns.forEach(replace => {
      content = content
        .replace(replace.find, replace.replace)
    })
    fs.writeFileSync(outputFilePath, content, 'utf8')
    console.log(`Processed file saved to: ${outputFilePath}`)

    return patterns
  }
}
