import { ProjectTypes } from '@/types/types';
import type {
  CompleteData,
} from '@/types/frontend-types';
import {
  UserFeedbackOptions,
  Languages,
  CompleteDataKeys,
} from '@/types/frontend-types';

const getCmpntExt = (isTs:boolean, framework:any) => {
  switch (framework) {
    case ProjectTypes.REACT:
    default:
      return isTs ? '.tsx' : '.jsx';
    case ProjectTypes.VUE:
      return '.vue';
  }
};

const folderAndFilesStructure = (data: Partial<CompleteData>) => {
  const ts = data[UserFeedbackOptions.LANGUAGE] === Languages.TYPESCRIPT;
  const cmpntExt = getCmpntExt(ts, data[CompleteDataKeys.FRAMEWORK]);
  const storeType = data[CompleteDataKeys.FRAMEWORK] === ProjectTypes.REACT ? 'redux' : 'vuex';
  const ext = ts ? '.ts' : '.js';

  /*
   * @returns {object} folder and files paths.
   * Root files like .gitignore, package.json etc.. will be generated by shell script later.
   * Files/folders should follow exact order in the tree object. from parent -> child.
   */

  return {
    src: 'src',
    index: `src/index${ext}`,
    app: `src/App${cmpntExt}`,
    unitConfig: `src/unit-config${ext}`,
    components: 'src/components',
    pages: 'src/pages',
    state: `src/${storeType}`,
    store: `src/${storeType}/store${ext}`,
    styles: 'src/styles',
    types: 'src/types',
    typesGlobals: `src/types/globals${ext}`,
    utils: 'src/utils',
    helpers: `src/utils/helpers${ext}`,
    e2e: 'src/e2e',
  };
};

export const initFrontEndTemplate = (data: Partial<CompleteData>) => {
  console.log('initFrontEndTemplate');
  console.log(JSON.stringify(data, null, 4));
  folderAndFilesStructure(data);
};