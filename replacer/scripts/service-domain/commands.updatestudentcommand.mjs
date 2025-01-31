import { CommandProcessor } from '../../utils/commandProcessor.mjs';

export const file = 'src/services/academic/Looplex.DotNet.Samples.Academic.Domain/Commands/UpdateStudentCommand.cs';
export const outputFile = '{{PROJECT_PATH}}/services/{{CC MODULE_NAME}}/{{PROJECT_NAMESPACE}}.{{MODULE_NAME}}.Domain/Commands/Update{{RESOURCE_TYPE_NAME}}Command.cs';
const replaces = [
  {
    original: 'Student',
    find: /Student/g,
    replace: '{{RESOURCE_TYPE_NAME}}'
  },
  {
    original: 'Looplex.DotNet.Samples.Academic',
    find: /Looplex.DotNet.Samples.Academic/g,
    replace: '{{PROJECT_NAMESPACE}}{{MODULE_NAME}}'
  }
]

export default (filePath, outputFilePath) => 
  CommandProcessor.process({
    filePath,
    outputFilePath,
    patterns: replaces
  });