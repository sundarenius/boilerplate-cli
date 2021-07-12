import { execSync } from 'child_process';
import { ProjectTypes } from '@/types/types';
import type {
  CompleteData,
  Path,
  FrontendFrameworks,
} from '@/types/frontend-types';
import {
  UserFeedbackOptions,
  Languages,
  CompleteDataKeys,
  FileType,
  Testing,
  AppTypes,
} from '@/types/frontend-types';
import { arrIncludes, equalStrings } from '@/utils/helpers';
import {
  getPackageJson,
  getMain,
  getApp,
  getGitIgnore,
} from '@/templates/frontend/get-template';
import { createProjectStructure } from './create-project';

const getCmpntExt = (isTs:boolean, framework:any) => {
  switch (framework) {
    case ProjectTypes.REACT:
    default:
      return isTs ? '.tsx' : '.jsx';
    case ProjectTypes.VUE:
      return '.vue';
  }
};

const getFrameWorkSpecificFilesFoldersNames = (data: Partial<CompleteData>) => {
  const ts = equalStrings(data[UserFeedbackOptions.LANGUAGE] as string, Languages.TYPESCRIPT);
  const ext = ts ? '.ts' : '.js';
  const cmpntExt = getCmpntExt(ts, data[CompleteDataKeys.FRAMEWORK]);
  switch (data[CompleteDataKeys.FRAMEWORK]!.toLowerCase()) {
    case (ProjectTypes.REACT!.toLocaleLowerCase()):
    default:
      return {
        storeType: 'redux',
        routerFile: `Routes${cmpntExt}`,
        cmpntExt,
        ext,
      };
    case (ProjectTypes.VUE!.toLocaleLowerCase()):
      return {
        storeType: 'vuex',
        routerFile: `router${ext}`,
        cmpntExt,
        ext,
      };
  }
};

type GetFolderAndFilesStructure = (data: Partial<CompleteData>) => Path[]
const getFolderAndFilesStructure: GetFolderAndFilesStructure = (data) => {
  const router = Boolean(data[UserFeedbackOptions.ROUTING])
    || data[UserFeedbackOptions.APP_TYPE] === AppTypes.SSR;
  const stateManagement = Boolean(data[UserFeedbackOptions.STATE_MANAGEMENT]);

  const {
    cmpntExt,
    ext,
    storeType,
    routerFile,
  } = getFrameWorkSpecificFilesFoldersNames(data);

  const mainExt = equalStrings(data[CompleteDataKeys.FRAMEWORK] as string, ProjectTypes.REACT)
    ? cmpntExt
    : ext;

  /*
   * @returns {object} folder and files paths.
   * Root files like .gitignore, package.json etc.. will be generated by shell script later.
   * Files/folders should follow exact order in the tree object. from parent -> child.
   * Add available components conditionally here (loop).
   */

  const paths: Path[] = [
    {
      path: 'public', // Should contain build templates
      type: FileType.FOLDER,
      if: true,
    },
    {
      path: '.gitignore',
      type: FileType.FILE,
      if: true,
      template: getGitIgnore(),
    },
    {
      path: 'package.json',
      type: FileType.FILE,
      if: true,
      template: getPackageJson(data[CompleteDataKeys.FRAMEWORK] as FrontendFrameworks, data),
    },
    {
      path: 'src',
      type: FileType.FOLDER,
      if: true,
    },
    {
      path: `src/main${mainExt}`,
      type: FileType.FILE,
      if: true,
      template: getMain(data[CompleteDataKeys.FRAMEWORK] as FrontendFrameworks, data),
    },
    {
      path: `src/App${cmpntExt}`,
      type: FileType.FILE,
      if: true,
      template: getApp(data[CompleteDataKeys.FRAMEWORK] as FrontendFrameworks, data),
    },
    {
      path: `src/unit-config${ext}`,
      type: FileType.FILE,
      if: arrIncludes(
        UserFeedbackOptions.TESTING,
        data,
        Testing.UNIT,
      ),
    },
    {
      path: 'src/docker',
      type: FileType.FOLDER,
      if: true,
    },
    {
      path: 'src/components',
      type: FileType.FOLDER,
      if: true,
    },
    {
      path: `src/components/Menu${ext}`,
      type: FileType.FILE,
      if: true,
    },
    {
      path: `src/components/Footer${ext}`,
      type: FileType.FILE,
      if: true,
    },
    {
      path: `src/components/Sidebar${ext}`,
      type: FileType.FILE,
      if: true,
    },
    {
      path: 'src/pages',
      type: FileType.FOLDER,
      if: router,
    },
    {
      path: 'src/router',
      type: FileType.FOLDER,
      if: router,
    },
    {
      path: `src/router/${routerFile}`,
      type: FileType.FILE,
      if: router,
    },
    {
      path: `src/${storeType}`,
      type: FileType.FOLDER,
      if: stateManagement,
    },
    {
      path: `src/${storeType}/store${ext}`,
      type: FileType.FILE,
      if: stateManagement,
    },
    {
      path: 'src/styles',
      type: FileType.FOLDER,
      if: true,
    },
    {
      path: 'src/types',
      type: FileType.FOLDER,
      if: true,
    },
    {
      path: `src/types/globals${ext}`,
      type: FileType.FILE,
      if: true,
    },
    {
      path: 'src/utils',
      type: FileType.FOLDER,
      if: true,
    },
    {
      path: `src/utils/helpers${ext}`,
      type: FileType.FILE,
      if: true,
    },
    {
      path: 'src/e2e',
      type: FileType.FOLDER,
      if: arrIncludes(
        UserFeedbackOptions.TESTING,
        data,
        Testing.E2E,
      ),
    },
  ];

  // process.env.FOLDER_PREFIX = 'boilerplate'; // Delete this later
  // // eslint-disable-next-line no-param-reassign
  // paths.forEach((val: any) => { val.path = `${process.env.FOLDER_PREFIX}/${val.path}`; });
  // // add boilerplate prefix to paths, delete this when done

  return paths;
};

type AddReactDepsPars = (arg: string) => void;
type AddReactDeps = (
  addDeps:AddReactDepsPars,
  addDevDeps:AddReactDepsPars,
  data: Partial<CompleteData>,
) => void
const addReactDeps: AddReactDeps = (addDeps, addDevDeps, data) => {
  const ts = equalStrings(data[UserFeedbackOptions.LANGUAGE] as string, Languages.TYPESCRIPT);
  const stateManagement = data[UserFeedbackOptions.STATE_MANAGEMENT];
  const unit = arrIncludes(UserFeedbackOptions.TESTING, data, Testing.UNIT);
  // const e2e = arrIncludes(UserFeedbackOptions.TESTING, data, Testing.E2E);
  const routing = data[UserFeedbackOptions.ROUTING];
  if (ts) {
    addDevDeps('typescript');
    addDevDeps('@types/node');
    addDevDeps('@types/react');
  }
  if (unit) {
    if (ts) addDevDeps('@types/jest');
    addDevDeps('@testing-library/react');
    addDevDeps('@testing-library/jest-dom');
    addDevDeps('@testing-library/user-event');
  }
  if (stateManagement) {
    if (ts) addDevDeps('@types/react-redux');
    addDeps('react-redux');
    addDeps('@reduxjs/toolkit');
  }
  if (routing) {
    if (ts) addDevDeps('@types/react-dom');
    addDeps('react-dom');
  }
};

const reactShell = (data: Partial<CompleteData>) => {
  const dependecies:string[] = ['react', 'react-scripts'];
  const devDependecies:string[] = [];

  // console.log(execSync('ls -la').toString());
  addReactDeps(
    (arg: string) => dependecies.push(arg),
    (arg: string) => devDependecies.push(arg),
    data,
  );
  console.log('Building react project ...');
  console.log((execSync(`yarn add ${dependecies.join(' ')}`).toString()));
  console.log(execSync(`yarn add -D ${devDependecies.join(' ')}`).toString());
};

const vueShell = (data: Partial<CompleteData>) => {
  console.log('Building vue project ...');
  // console.log(execSync('ls -la').toString());
};

const shellScripts = (data: Partial<CompleteData>) => {
  console.log(JSON.stringify(data, null, 4));
  switch (data[CompleteDataKeys.FRAMEWORK]!.toLowerCase()) {
    case ProjectTypes.REACT.toLowerCase():
      reactShell(data);
      break;
    case ProjectTypes.VUE.toLowerCase():
      vueShell(data);
      break;
    default:
      console.log('Error: found no matching framework');
  }
};

export const createFrontendProject = async (data: Partial<CompleteData>) => {
  const folderFilesStructure = getFolderAndFilesStructure(data);
  await createProjectStructure(folderFilesStructure); // This is all done async
  console.log('all files and folders created!');
  console.log('Will start some shell scripts now ... ');
  shellScripts(data);
};
