import { message } from 'antd';
import { getSongMediaList, editData, removeData, importSongMedia, downloadSongMedia } from '../services/songMediaList';

const Model = {
  namespace: 'songMediaList',
  state: {
    // change -----
    changeId: 0,
    multiChangeId: 0,
    updateDataResult: '',
    downloadDataResult: '',
    // data -----
    // getSongMediaList
    songMediaList: {
      total_items: 0,
      data_list: [],
    },
  },
  effects: {
    // get -----
    // getSongMediaList
    *fetchGetSongMediaList({ payload }, { call, put }) {
      const response = yield call(getSongMediaList, payload);

      yield put({
        type: 'getSongMediaList',
        payload: response,
      });
    },
    // update -----
    *fetchEditData({ payload, callback }, { call, put, select }) {
      const response = yield call(editData, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });

      if (callback) {
        callback();
      }
    },
    *fetchRemoveData({ payload, callback }, { call, put, select }) {
      const response = yield call(removeData, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });

      if (callback) {
        callback();
      }
    },
    *fetchImportSongMedia({ payload, callback }, { call, put, select }) {
      const response = yield call(importSongMedia, payload);

      yield put.resolve({
        type: 'importSongMedia',
        payload: response,
      });

      const getPara = yield select((state) => (state.songMediaList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchDownloadSongMedia({ payload }, { call, put }) {
      const response = yield call(downloadSongMedia, payload);

      yield put({
        type: 'downloadSongMedia',
        payload: response
      });
    },
    // multi -----
    *fetchMultiDownloadSongMedia({ payload, callback }, { call, put, all, select }) {
      yield put.resolve({ type: 'fetchDownloadSongMedia', payload: { company_media_id: payload.company_media_id } });

      const getPara = yield select((state) => ({ id: state.songMediaList.downloadDataResult }));

      yield put.resolve({ type: 'multiDownloadSongMedia' });

      if (callback) {
        if (getPara.id != 'error') {
          callback(getPara.id);
        } else {
          callback('error');
        }
      }
    },
  },
  reducers: {
    // get -----
    // getSongMediaList
    getSongMediaList(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, songMediaList: action.payload.data };
    },
    // update -----
    updateData(state, action) {
      if (!action.payload.resError) {
        message.success('儲存成功！');
      }

      return { ...state };
    },
    downloadSongMedia(state, action) {
      let downloadDataResult = 'error';

      if (!action.payload.resError) {
        downloadDataResult = action.payload.data;
      }

      return { ...state, downloadDataResult: downloadDataResult };
    },
    importSongMedia(state, action) {
      let updateDataResult = 'error';

      if (!action.payload.resError) {
        updateDataResult = 'ok';
        message.success('儲存成功！');
      }

      return { ...state, updateDataResult: updateDataResult };
    },
    // multi -----
    multiDownloadSongMedia(state, action) {
      let multiChangeId = state.multiChangeId + 1;

      return { ...state, multiChangeId: multiChangeId };
    }
  },
};
export default Model;