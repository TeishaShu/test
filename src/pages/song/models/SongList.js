import { message } from 'antd';
import { getAutoComplete, getList, getInfo, getISRCListBySong, removeData, addForm, editForm, getDetailRights, getSongMediaListBySong } from '../services/songList';

const Model = {
  namespace: 'songList',
  state: {
    // change -----
    changeId: 0,
    multiChangeId: 0,
    removeDataResult: '',
    updateDataResult: '',
    // opt -----
    optLanguage: [
      // { label: '-', value: '' },
      { label: '國語', value: '1' },
      { label: '台語', value: '2' },
      { label: '粵語', value: '3' },
      { label: '英語', value: '4' },
      { label: '客語', value: '5' },
      { label: '日語', value: '6' },
      { label: '純音樂', value: '7' },
      { label: '其他', value: '8' },
    ],
    optSongType: [
      { label: '音樂原創', value: '1' },
      { label: '文字', value: '2' },
      { label: '口白', value: '3' },
      { label: '演奏曲', value: '4' },
      // {label: '', value: '5'},  // UI 使用 radio 呈現
    ],
    optSongCategory: [
      { label: '無', value: '1' },
      { label: 'OT', value: '2' },
      { label: '組曲', value: '3' },
      { label: '節錄', value: '4' },
    ],
    // data -----
    // autoComplete
    autoComplete: [],
    // fetchGetList
    list: {
      total_items: 0,
      data_list: [],
    },
    // edit, update
    info: {
      id: '',
      song_code: '',
      song_name: '',
      song_name_original: '',
      song_name_zh: '',
      song_name_en: '',
      song_name_pingyin: '',
      iswc: '',
      song_language_id: '1',
      song_version: '',
      is_settle: '1',
      song_category_id: '',
      song_type_id: '',
      song_type_custom: '',
      origin_list: [],  // related_song
      used_list: [],
      notes: '',
    },
    // get detail_rights
    detail_rights: {
      bin_ratio_total: '',
      bin_ratio_lyrics: '',
      bin_ratio_tune: '',
      bin_rights_num: '',
      bin_lyrics_num: '',
      bin_tune_num: '',
      rights_ratio_total: '',
      rights_num: '',
      history_num: '',
      rights_list: [],
      history_list: [],
    },
    // getISRCListBySong
    iSRCListBySong: {
      total_items: 0,
      data_list: [],
    },
    // getSongMediaListBySong
    songMediaListBySong: [],
  },
  effects: {
    // get -----
    *fetchGetAutoComplete({ payload, callback }, { call, put, select }) {
      const response = yield call(getAutoComplete, payload);

      yield put({
        type: 'getAutoComplete',
        payload: response,
      });

      const getPara = yield select((state) => (state.songList.autoComplete));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      yield put({
        type: 'getList',
        payload: response,
      });
    },
    *fetchGetInfo({ payload }, { call, put }) {
      const response = yield call(getInfo, payload);
      yield put({
        type: 'getInfo',
        payload: response,
      });
    },
    *fetchGetISRCListBySong({ payload, callback }, { call, put, select }) {
      const response = yield call(getISRCListBySong, payload);
      yield put({
        type: 'getISRCListBySong',
        payload: response,
      });

      const getPara = yield select((state) => (state.songList.iSRCListBySong));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchGetSongMediaListBySong({ payload }, { call, put }) {
      const response = yield call(getSongMediaListBySong, payload);
      yield put({
        type: 'getSongMediaListBySong',
        payload: response,
      });
    },
    // update -----
    // remove
    *fetchRemoveData({ payload }, { call, put }) {
      const response = yield call(removeData, payload);
      yield put({
        type: 'removeData',
        payload: response,
      });
    },
    // update
    *fetchAddForm({ payload }, { call, put }) {
      const response = yield call(addForm, payload);
      yield put({
        type: 'updateData',
        payload: response,
      });
    },
    *fetchEditForm({ payload }, { call, put }) {
      const response = yield call(editForm, payload);
      yield put({
        type: 'updateData',
        payload: response,
      });
    },
    // get detail_rights
    *fetchGetDetailRights({ payload }, { call, put }) {
      const response = yield call(getDetailRights, payload);
      yield put({
        type: 'getDetailRights',
        payload: response,
      });
    },
    // multi -----
    // multi - get info (url: /song/adv/id/:id or /song/adv/song_code/:id) 
    *fetchMultiGetInfo({ payload }, { call, put, all, select }) {
      // fetchGetInfo
      yield put.resolve({ type: 'fetchGetInfo', payload: { id: payload.id, song_code: payload.song_code } });

      // get song_code parameter
      const getPara = yield select((state) => (state.songList.info));

      // other apis
      const [a, b, c] = yield all([
        yield put({ type: 'authorizedCountryList/fetchGetAuthorizedCountry', payload: { search: 'all' } }),
        yield put({ type: 'authorizedAreaList/fetchGetList', payload: { search: 'all' } }),
        yield put({ type: 'fetchGetDetailRights', payload: { song_code: getPara.song_code } }),
      ]);

      // reducers
      yield put.resolve({ type: 'multiGetInfo' });
    },
    // multi - get song (url: /song/update, /song/update/:id)
    *fetchMultiGetSong({ payload }, { call, put, all, select }) {
      // effects
      const [a, b] = yield all([
        yield put({ type: 'fetchGetAutoComplete' }),
        ((payload.id) ? (yield put({ type: 'fetchGetInfo', payload: { id: payload.id } })) : (null)),
      ]);

      // reducers
      yield put.resolve({ type: 'multiGetSong' });
    },
  },
  reducers: {
    // get -----
    getAutoComplete(state, action) {
      return { ...state, autoComplete: action.payload.data, removeDataResult: '', updateDataResult: '' };
    },
    getList(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, list: action.payload.data, removeDataResult: '', updateDataResult: '' };
    },
    getInfo(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, info: action.payload.data, removeDataResult: '', updateDataResult: '' };
    },
    getISRCListBySong(state, action) {
      let changeId = state.changeId + 1;
      let tmpISRCListBySong;

      if (!action.payload.resError && action.payload.data) {
        tmpISRCListBySong = action.payload.data
      } else {
        tmpISRCListBySong = {
          total_items: 0,
          data_list: [],
        };
      }

      return { ...state, changeId: changeId, iSRCListBySong: tmpISRCListBySong, removeDataResult: '', updateDataResult: '' };
    },
    // get detail_rights
    getDetailRights(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, detail_rights: action.payload.data, removeDataResult: '', updateDataResult: '' };
    },
    // getSongMediaListBySong
    getSongMediaListBySong(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, songMediaListBySong: action.payload.data, removeDataResult: '', updateDataResult: '' };
    },
    // update -----
    // remove
    removeData(state, action) {
      let removeDataResult = 'error';
      if (!action.payload.resError) {
        removeDataResult = 'ok';
        message.success('儲存成功');
      }

      return { ...state, removeDataResult: removeDataResult };
    },
    // update
    updateData(state, action) {
      let updateDataResult = 'error';

      if (!action.payload.resError) {
        if (action.payload.data && action.payload.data.id) {
          updateDataResult = action.payload.data.id;
        } else {
          updateDataResult = 'ok';
        }
        message.success('儲存成功');
      }

      return { ...state, updateDataResult: updateDataResult };
    },
    // multi -----
    // multi - get info
    multiGetInfo(state, action) {
      let multiChangeId = state.multiChangeId + 1;

      return { ...state, multiChangeId: multiChangeId, removeDataResult: '', updateDataResult: '' };
    },
    // multi - get song
    multiGetSong(state, action) {
      let multiChangeId = state.multiChangeId + 1;

      return { ...state, multiChangeId: multiChangeId, removeDataResult: '', updateDataResult: '' };
    },
  },
};

export default Model;