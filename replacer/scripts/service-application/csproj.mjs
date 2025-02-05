import { CommandProcessor } from '../../utils/commandProcessor.mjs'

const replaces = [
  {
    original: 'src',
    find: /PROJECTPATH___/g,
    replace: '{{PROJECT_PATH}}'// just to add project path to config
  },
  {
    original: 'Looplex.DotNet.Samples',
    find: /Looplex.DotNet.Samples/g,
    replace: '\\{{PROJECT_NAMESPACE}}'
  },
  {
    original: 'Academic',
    find: /Academic/g,
    replace: '{{MODULE_NAME}}'
  },
  {
    original: 'Academic',
    find: /academic/g,
    replace: '{{CC MODULE_NAME}}'
  }

]

export const file = 'src/services/academic/Looplex.DotNet.Samples.Academic.Application/Looplex.DotNet.Samples.Academic.Application.csproj'
export const outputFile = '{{PROJECT_PATH}}/services/{{CC MODULE_NAME}}/{{PROJECT_NAMESPACE}}.{{MODULE_NAME}}.Application/{{PROJECT_NAMESPACE}}.{{MODULE_NAME}}.Application.csproj'

export default (filePath, outputFilePath) =>
  CommandProcessor.process({
    filePath,
    outputFilePath,
    patterns: replaces
  })
