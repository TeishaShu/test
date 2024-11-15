import { getList, getInfo, getSplitInfo, addIsrcForm, editIsrcForm, removeIsrcData, editIsrcSplitForm, resetSplit, getSongMedia, getIsrcByAuthor } from './service';
import { message, } from 'antd';

const Model = {
  namespace: 'isrcList',
  state: {
    // change -----
    changeId: 0,
    multiChangeId: 0,
    removeDataResult: '',
    updateDataResult: '',
    // opt -----
    optDataType: [
      { label: 'Vocal', value: '1' },
      { label: 'Video', value: '2' },
    ],
    // data -----
    // GetList
    list: {
      total_items: 0,
      data_list: [],
    },
    // GetInfo
    info: {
      isrc: '',
      song_id: '',
      song_name: '',
      song_code: '',
      version: '',
      belong_isrc: '',
      belong_isrc_show: '',
      isrc_type_id: '',
      isrc_type: '',
      singer: '',
      tape: [
        {
          id: '',
          company_id: '',
          company_nickname_id: '',
          company_code: '',
          company_nickname: '',
        },
      ],
      data_type: '',
      arranger: '',
      producer: '',
      director: '',
      length: '',
      release_date: null,
      belong_album_id: '',
      is_settle: '',
      release_area_type: '2',
      release_area_id: '',
      release_area_name: '',
      release_country: [],
      notes: '',
    },
    // getSplitInfo
    splitInfo: [],
    // getSongMedia
    songMedia: {},
    // getIsrcByAuthor
    isrcByAuthor: {
      total_items: 0,
      data_list: []
    },
  },
  effects: {
    // get -----
    // GetList
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(getList, payload);

      yield put({
        type: 'getList',
        payload: response,
      });
    },
    // GetInfo
    *fetchGetInfo({ payload }, { call, put }) {
      const response = yield call(getInfo, payload);

      yield put({
        type: 'getInfo',
        payload: response,
      });
    },
    // GetSplitInfo
    *fetchGetSplitInfo({ payload }, { call, put }) {
      const response = yield call(getSplitInfo, payload);

      yield put({
        type: 'getSplitInfo',
        payload: response,
      });
    },
    // getSongMedia
    *fetchGetSongMedia({ payload }, { call, put }) {
      const response = yield call(getSongMedia, payload);

      yield put({
        type: 'getSongMedia',
        payload: response,
      });
    },
    // getIsrcByAuthor
    *fetchGetIsrcByAuthor({ payload }, { call, put }) {
      const response = yield call(getIsrcByAuthor, payload);

      yield put({
        type: 'getIsrcByAuthor',
        payload: response,
      });
    },
    // update -----
    *fetchAddIsrcForm({ payload, callback }, { call, put, select }) {
      const response = yield call(addIsrcForm, payload);

      yield put.resolve({
        type: 'updateDataForAddIsrcForm',
        payload: response,
      });

      const getPara = yield select((state) => (state.isrcList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchEditIsrcForm({ payload, callback }, { call, put, select }) {
      const response = yield call(editIsrcForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.isrcList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchRemoveIsrcData({ payload, callback }, { call, put, select }) {
      const response = yield call(removeIsrcData, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.isrcList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchEditIsrcSplitForm({ payload, callback }, { call, put, select }) {
      const response = yield call(editIsrcSplitForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.isrcList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchResetSplit({ payload, callback }, { call, put, select }) {
      const response = yield call(resetSplit, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.isrcList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    // multi -----
    // MultiGetISRCInfo
    *fetchMultiGetISRCInfo({ payload, callback }, { call, put, all, select }) {
      const [a, b, c, d, e] = yield all([
        yield put({ type: 'authorizedCountryList/fetchGetAuthorizedCountry', payload: { search: 'all' } }),
        yield put({ type: 'authorizedAreaList/fetchGetList', payload: { search: 'all' } }),
        yield put({ type: 'isrcTypeList/fetchGetListAutoList' }),
        (payload.id) ? (yield put({ type: 'fetchGetInfo', payload: { id: payload.id } })) : (null),
        (payload.keyword) ? (yield put({ type: 'songList/fetchGetAutoComplete', payload: { keyword: payload.keyword } })) : (null),
      ]);

      const getIsrcPara = yield select((state) => (state.isrcList.info));

      const [f, g] = yield all([
        // yield put.resolve({ type: 'albumList/fetchGetBelongAlbumInfo', payload: { search_type: 'isrc', keyword: getIsrcPara.isrc } }),
        (getIsrcPara.created_by)
          ? (yield put({ type: 'authList/fetchGetCreatedUser', payload: { user_id: getIsrcPara.created_by } }))
          : (yield put({ type: 'authList/getCreatedUser', payload: { data: {} } })),
        (getIsrcPara.updated_by)
          ? (yield put({ type: 'authList/fetchGetUpdatedUser', payload: { user_id: getIsrcPara.updated_by } }))
          : (yield put({ type: 'authList/getUpdatedUser', payload: { data: {} } })),
      ]);

      // reducers
      yield put.resolve({ type: 'multiGetISRCInfo' });

      const getSongAutoComplete = yield select((state) => (state.songList.autoComplete));

      if (payload.keyword && callback) {
        callback(getSongAutoComplete);
      }
    },
  },
  reducers: {
    // get -----
    // getList
    getList(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, list: action.payload.data };
    },
    // getInfo
    getInfo(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, info: action.payload.data };
    },
    // getSplitInfo
    getSplitInfo(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, splitInfo: action.payload.data };
    },
    // getSongMedia
    getSongMedia(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, songMedia: action.payload.data };
    },
    // getIsrcByAuthor
    getIsrcByAuthor(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, isrcByAuthor: action.payload.data };
    },
    // update -----
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
    updateDataForAddIsrcForm(state, action) {
      let updateDataResult = 'error';

      if (!action.payload.resError && action.payload.data) {
        updateDataResult = action.payload.data;
        message.success('儲存成功');
      }

      return { ...state, updateDataResult: updateDataResult };
    },
    // multi -----
    // multiGetISRCInfo
    multiGetISRCInfo(state, action) {
      let multiChangeId = state.multiChangeId + 1;

      return { ...state, multiChangeId: multiChangeId };
    },
  },
};

export default Model;