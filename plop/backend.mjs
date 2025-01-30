import { readFileSync, rm } from 'node:fs'
import ini from 'ini'
import { getConstant } from '../constants.mjs'

function backendFactory (plop) {
  const outputDir = './plop/output'

  plop.setActionType('deleteOutputAsync', function (answers, config, plop) {
    return new Promise((resolve, reject) => {
      rm(outputDir, { recursive: true, force: true }, (err) => {
        if (err) {
          reject(`Failed to delete directory: ${outputDir}. Error: ${err.message}`)
        } else {
          console.log(`Deleted output directory: ${outputDir}`)
          resolve('Directory deleted successfully')
        }
      })
    })
  })

  setPlopHelpers(plop)

  return {
    description: 'Generate a C# solution with options for sample config or custom input',
    prompts: [
      {
        type: 'list',
        name: 'configChoice',
        message: 'Do you want to use a sample config or input all values?',
        choices: ['Use sample config', 'Answer all questions']
      },
      // Conditional prompts for custom input if the user does not select the sample config
      {
        type: 'input',
        name: 'COMPANY_NAME',
        message: 'Company Name:',
        when: (answers) => answers.configChoice === 'Answer all questions'
      },
      {
        type: 'input',
        name: 'SOLUTION_NAME',
        message: 'Solution Name:',
        when: (answers) => answers.configChoice === 'Answer all questions'
      },
      {
        type: 'input',
        name: 'MICROSERVICE_NAME',
        message: 'Microservice Name:',
        when: (answers) => answers.configChoice === 'Answer all questions'
      },
      {
        type: 'input',
        name: 'SERVICE_NAME',
        message: 'Service Name:',
        when: (answers) => answers.configChoice === 'Answer all questions'
      },
      {
        type: 'input',
        name: 'SERVICE_FOLDER',
        message: 'Service Folder:',
        when: (answers) => answers.configChoice === 'Answer all questions'
      },
      {
        type: 'input',
        name: 'RESOURCE_LOCATION',
        message: 'Resource Location:',
        when: (answers) => answers.configChoice === 'Answer all questions'
      },
      {
        type: 'input',
        name: 'RESOURCE_NAME',
        message: 'Resource Name:',
        when: (answers) => answers.configChoice === 'Answer all questions'
      },
      {
        type: 'input',
        name: 'RESOURCE_NAME_P',
        message: 'Resource Name (Plural):',
        when: (answers) => answers.configChoice === 'Answer all questions'
      },
      {
        type: 'input',
        name: 'RESOURCE_SCHEMA_VERSION',
        message: 'Resource Schema Version:',
        when: (answers) => answers.configChoice === 'Answer all questions'
      },
      {
        type: 'input',
        name: 'TELEMETRY_SERVICE_NAME',
        message: 'Telemetry Service Name:',
        when: (answers) => answers.configChoice === 'Answer all questions'
      },
      {
        type: 'input',
        name: 'DB_SERVER',
        message: 'Integration Tests DB Server:',
        when: (answers) => answers.configChoice === 'Answer all questions'
      },
      {
        type: 'input',
        name: 'DB_PORT',
        message: 'Integration Tests DB Port:',
        when: (answers) => answers.configChoice === 'Answer all questions'
      },
      {
        type: 'input',
        name: 'DB_USER',
        message: 'Integration Tests DB User:',
        when: (answers) => answers.configChoice === 'Answer all questions'
      },
      {
        type: 'input',
        name: 'DB_PASSWORD',
        message: 'Integration Tests DB Password:',
        when: (answers) => answers.configChoice === 'Answer all questions'
      },
      {
        type: 'input',
        name: 'DB_DATABASE',
        message: 'Integration Tests DB Database:',
        when: (answers) => answers.configChoice === 'Answer all questions'
      }
    ],
    actions: function (answers) {
      let configData = {}

      if (answers.configChoice === 'Use sample config') {
        // Load the sample config from the sample-config.ini file
        const sampleConfig = ini.parse(readFileSync(getConstant('ALLCONFIGPATH'), 'utf-8'))
        configData = { ...sampleConfig }
      } else {
        // Use the answers from the prompts
        configData = {
          COMPANY_NAME: answers.COMPANY_NAME,
          SOLUTION_NAME: answers.SOLUTION_NAME,
          MICROSERVICE_NAME: answers.MICROSERVICE_NAME,
          SERVICE_NAME: answers.SERVICE_NAME,
          SERVICE_FOLDER: answers.SERVICE_FOLDER,
          RESOURCE_LOCATION: answers.RESOURCE_LOCATION,
          RESOURCE_NAME: answers.RESOURCE_NAME,
          RESOURCE_NAME_P: answers.RESOURCE_NAME_P,
          RESOURCE_SCHEMA_VERSION: answers.RESOURCE_SCHEMA_VERSION,
          TELEMETRY_SERVICE_NAME: answers.TELEMETRY_SERVICE_NAME,
          DB_SERVER: answers.DB_SERVER,
          DB_PORT: answers.DB_PORT,
          DB_USER: answers.DB_USER,
          DB_PASSWORD: answers.DB_PASSWORD,
          DB_DATABASE: answers.DB_DATABASE
        }
      }

      return [
        {
          type: 'deleteOutputAsync',
          speed: 'slow'
        },
        {
          type: 'addMany',
          destination: outputDir,
          base: './plop/templates',
          templateFiles: ['./plop/templates/**/*', './plop/templates/**/.*'],
          data: configData // Use the selected data for replacements
        }
      ]
    }
  }
}

function setPlopHelpers (plop) {
  plop.setHelper('UC', function (text) {
    if (!text) return text

    return text.toUpperCase()
  })

  plop.setHelper('LC', function (text) {
    if (!text) return text

    return text.toLowerCase()
  })

  plop.setHelper('CC', function (text) {
    if (!text) return text
    if (text.length <= 1) return text.toLowerCase()
    return text.charAt(0).toLowerCase() + text.slice(1)
  })
}

export default backendFactory
