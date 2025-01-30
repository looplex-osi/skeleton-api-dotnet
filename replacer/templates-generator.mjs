import path from 'path'
import fs from 'fs'
import os from 'os'
import readline from 'readline'
import { pathToFileURL } from 'url'
import { getConstant } from '../constants.mjs'

// Setup output directory
const plopDir = path.resolve('plop')
const outputDir = path.resolve(plopDir, 'templates')

const inputDir = process.argv[2] || path.resolve(os.homedir() + '/projects/looplex/sample-api-dotnet/')

// Ensure the input directory exists
if (!fs.existsSync(inputDir)) {
  console.error(`Input directory not found: ${inputDir}`)
  process.exit(1)
}

// Ensure the output directory exists
if (!fs.existsSync(plopDir)) {
  console.error(`Output directory not found: ${plopDir}`)
  process.exit(1)
}

if (!fs.existsSync(outputDir)) { // creates the template folder
  fs.mkdirSync(outputDir)
}

// Prompt the user to confirm clearing the output directory
console.log(`Output directory: ${outputDir}`)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function promptUser (question) {
  return new Promise((resolve) => rl.question(question, resolve))
}

async function main () {
  const answer = (await promptUser('Do you want to remove? (default n/N): ')).trim().toLowerCase()
  rl.close()

  if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
    console.log('Operation canceled. Exiting script.')
    process.exit(1)
  }

  fs.readdirSync(outputDir).forEach((file) => {
    const filePath = path.join(outputDir, file)
    if (fs.lstatSync(filePath).isDirectory()) {
      fs.rmSync(filePath, { recursive: true })
    } else {
      fs.unlinkSync(filePath)
    }
  })

  console.log('Output directory cleared.')

  const scriptsPath = 'replacer/scripts'
  fs.writeFileSync(getConstant('ALLCONFIGPATH'), '', { flag: 'w' })
  // fs.writeFileSync(ALLCONFIGPATH, '', { flag: 'w' })

  fs.readdirSync(scriptsPath).forEach((dir) => {
    if (fs.lstatSync(path.resolve(scriptsPath, dir)).isDirectory()) {
      const configFile = path.resolve(outputDir, `${dir}.config.ini`)
      fs.writeFileSync(configFile, '', { flag: 'w' })

      const sampleConfigFile = path.resolve(outputDir, `${dir}.config.sample.ini`)
      fs.writeFileSync(sampleConfigFile, '', { flag: 'w' })

      fs.readdirSync(path.resolve(scriptsPath, dir)).forEach(async (file) => {
        let scriptPath = path.resolve(scriptsPath, dir, file)
        scriptPath = pathToFileURL(scriptPath)
        const replacer = await import(scriptPath) // Dynamically import the script
        const filePath = path.resolve(inputDir, replacer.file)
        const outputFilePath = path.resolve(outputDir, replacer.outputFile)
        const dirPath = path.dirname(outputFilePath)
        fs.mkdirSync(dirPath, { recursive: true })
        const replaces = replacer.default(filePath, outputFilePath)

        appendToConfig(getConstant('ALLCONFIGPATH'), replaces, getConfigSampleAppendLine)
        appendToConfig(configFile, replaces, getConfigAppendLine)
        appendToConfig(sampleConfigFile, replaces, getConfigSampleAppendLine)
      })
    }
  })
}

const configSets = {}
function appendToConfig (configFilePath, replaces, appendLineFunc) {
  if (!configSets[configFilePath]) { configSets[configFilePath] = new Set() }
  const set = configSets[configFilePath]
  replaces.forEach(replace => {
    if (!replace.replace) { return }

    if (removeBeforeAndAfterMustaches(replace) && leaveOnlyConfig(replace) && !set.has(replace.replace)) {
      set.add(replace.replace)
      const appendLine = appendLineFunc(replace)
      fs.appendFileSync(configFilePath, appendLine, 'utf8')
      console.log(`Appended ${replace.replace} key to file: ${configFilePath}`)
    } else {
      console.log(`${replace.replace} key already exists in file: ${configFilePath}`)
    }
  })
}
// also removes mustaches
function removeBeforeAndAfterMustaches (replace) {
  if (!replace?.replace) return false
  const startIndex = replace.replace.indexOf('{{')
  const finalIndex = replace.replace.indexOf('}}')
  if (startIndex >= 0 && finalIndex >= startIndex) {
    replace.replace = replace.replace.substring(startIndex + 2, finalIndex)
    return true
  }
  return false
}
// config is the last word splited by spaces
function leaveOnlyConfig (replace) {
  if (!replace?.replace) return false

  const splited = replace.replace.split(' ')
  replace.replace = splited[splited.length - 1]

  return true
}
function getConfigAppendLine (replace) {
  return `${replace.replace}=${replace.replace}\n`
}

function getConfigSampleAppendLine (replace) {
  return `${replace.replace}=${replace.original}\n`
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
