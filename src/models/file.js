import { downloadFile } from '@/services/file';

const Model = {
  namespace: 'fileList',
  state: {
  },
  effects: {
    *fetchDownloadFile({ payload }, { call, put }) {
      const response = yield call(downloadFile, payload);

      yield put({
        type: 'downloadFile',
        payload: response
      });
    },
  },
  reducers: {
    downloadFile(state, action) {
      return { ...state };
    },
  },
};

export default Model;