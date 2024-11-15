import { getAutoComplete, getList, getInfo, getContent, addAlbumForm, editAlbumForm, editSongSeqForm, importIsrc, copyDisc, setSongSetting, editPrepaidForm, getRelatedAlbum, getSongSplit, getRecordSplit, editRecordSplitForm, removeAlbum, calculateRecord, getBelongAlbumInfo, removeDisc, removePrepaid, calculateSong } from './service';
import { message, } from 'antd';

const Model = {
  namespace: 'albumList',
  state: {
    // change -----
    changeId: 0,
    multiChangeId: 0,
    removeDataResult: '',
    updateDataResult: '',
    // opt -----
    optType: [
      { label: '外部專輯', value: 'is_external' },
      { label: '首發專輯', value: 'is_debut' },
    ],
    optAlbumType: [
      { label: '不限', value: '0' },
      { label: '專輯', value: '1' },
      { label: 'EP', value: '2' },
      { label: '精選', value: '3' },
      { label: '合輯', value: '4' },
      { label: '原聲帶', value: '5' },
      { label: 'LIVE', value: '6' },
      { label: '電影', value: '8' },
      { label: '影片', value: '9' },
      { label: '數位專輯', value: '10' },
      { label: '數位單曲', value: '11' },
    ],
    optDiscType: [
      { label: 'CD', value: '1' },
      { label: 'BD', value: '2' },
      { label: 'DVD', value: '3' },
      { label: 'LP', value: '4' },
      { label: 'MC', value: '5' },
      { label: 'MOD', value: '6' },
      { label: 'Power CD', value: '7' },
      { label: 'USB', value: '8' },
      { label: 'VCD', value: '9' },
      { label: '影片', value: '10' },
      { label: '數位專輯', value: '11' },
      { label: '數位單曲', value: '12' },
    ],
    // data -----
    // getAutoComplete
    autoComplete: [],
    // GetList
    list: {
      total_items: 0,
      data_list: [],
    },
    // GetInfo
    info: {},
    // GetContent
    content: {},
    // getRelatedAlbum
    relatedAlbum: [],
    // getSongSplit
    songSplit: {
      album_righ_split_ratio: [],
      count: '0',
      total_ratio: '0%',
      righ_count: '0',
      righ_right_count: '0'
    },
    // getRecordSplit
    recordSplit: [],
    // getBelongAlbumInfo
    belongAlbumInfo: [],
  },
  effects: {
    // get -----
    // getAutoComplete
    *fetchGetAutoComplete({ payload }, { call, put }) {
      const response = yield call(getAutoComplete, payload);

      yield put({
        type: 'getAutoComplete',
        payload: response,
      });
    },
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
    *fetchGetContent({ payload, callback }, { call, put, select }) {
      const response = yield call(getContent, payload);

      yield put({
        type: 'getContent',
        payload: response,
      });

      const getPara = yield select((state) => (state.albumList.content));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchGetRelatedAlbum({ payload, callback }, { call, put, select }) {
      const response = yield call(getRelatedAlbum, payload);

      yield put.resolve({
        type: 'getRelatedAlbum',
        payload: response,
      });
    },
    *fetchGetSongSplit({ payload, callback }, { call, put, select }) {
      const response = yield call(getSongSplit, payload);

      yield put.resolve({
        type: 'getSongSplit',
        payload: response,
      });

      const getPara = yield select((state) => (state.albumList.songSplit));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchGetRecordSplit({ payload, callback }, { call, put, select }) {
      const response = yield call(getRecordSplit, payload);

      yield put.resolve({
        type: 'getRecordSplit',
        payload: response,
      });

      const getPara = yield select((state) => (state.albumList.recordSplit));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchGetBelongAlbumInfo({ payload }, { call, put }) {
      const response = yield call(getBelongAlbumInfo, payload);

      yield put({
        type: 'getBelongAlbumInfo',
        payload: response,
      });
    },
    // update -----
    *fetchAddAlbumForm({ payload, callback }, { call, put, select }) {
      const response = yield call(addAlbumForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.albumList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchEditAlbumForm({ payload, callback }, { call, put, select }) {
      const response = yield call(editAlbumForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.albumList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchEditSongSeqForm({ payload, callback }, { call, put, select }) {
      const response = yield call(editSongSeqForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.albumList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchImportIsrc({ payload, callback }, { call, put, select }) {
      const response = yield call(importIsrc, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.albumList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchCopyDisc({ payload, callback }, { call, put, select }) {
      const response = yield call(copyDisc, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.albumList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchSetSongSetting({ payload, callback }, { call, put, select }) {
      const response = yield call(setSongSetting, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.albumList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchEditPrepaidForm({ payload, callback }, { call, put, select }) {
      const response = yield call(editPrepaidForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.albumList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchEditRecordSplitForm({ payload, callback }, { call, put, select }) {
      const response = yield call(editRecordSplitForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.albumList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchRemoveAlbum({ payload, callback }, { call, put, select }) {
      const response = yield call(removeAlbum, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.albumList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchCalculateReaord({ payload, callback }, { call, put, select }) {
      const response = yield call(calculateRecord, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.albumList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchCalculateSong({ payload, callback }, { call, put, select }) {
      const response = yield call(calculateSong, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.albumList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchRemoveDisc({ payload, callback }, { call, put, select }) {
      const response = yield call(removeDisc, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.albumList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchRemovePrepaid({ payload, callback }, { call, put, select }) {
      const response = yield call(removePrepaid, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.albumList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    // multi -----
    *fetchMultiGetList({ payload }, { call, put, all, select }) {
      // effects
      const [a, b] = yield all([
        yield put({ type: 'authorizedCountryList/fetchGetAuthorizedCountry', payload: { search: 'all' } }),
        yield put({ type: 'fetchGetList', payload: payload }),
      ]);
      // reducers
      yield put.resolve({ type: 'multiGetList' });
    },
    *fetchMultiGetAdvInfo({ payload }, { call, put, all, select }) {
      // effects
      const [a, b] = yield all([
        yield put({ type: 'authorizedCountryList/fetchGetAuthorizedCountry', payload: { search: 'all' } }),
        (payload.album_id) ? yield put({ type: 'fetchGetInfo', payload: payload }) : null,
      ]);

      // createdUserId, updatedUserId
      const getUserPara = yield select((state) => (state.albumList.info));

      // effects
      const [c, d] = yield all([
        (getUserPara.created_by)
          ? (yield put({ type: 'authList/fetchGetCreatedUser', payload: { user_id: getUserPara.created_by } }))
          : (yield put({ type: 'authList/getCreatedUser', payload: { data: {} } })),
        (getUserPara.updated_by)
          ? (yield put({ type: 'authList/fetchGetUpdatedUser', payload: { user_id: getUserPara.updated_by } }))
          : (yield put({ type: 'authList/getUpdatedUser', payload: { data: {} } })),
      ]);

      // reducers
      yield put.resolve({ type: 'multiGetInfo' });
    },
    *fetchMultiGetInfo({ payload }, { call, put, all, select }) {
      // effects
      const [a, b, c] = yield all([
        yield put({ type: 'authorizedCountryList/fetchGetAuthorizedCountry', payload: { search: 'all' } }),
        yield put({ type: 'authorizedAreaList/fetchGetList', payload: { search: 'all' } }),
        (payload.album_id) ? yield put({ type: 'fetchGetInfo', payload: payload }) : null,
      ]);

      // reducers
      yield put.resolve({ type: 'multiGetInfo' });
    },
    *fetchMultiGetSongSeq({ payload, callback }, { call, put, all, select }) {
      // effects
      const [a, b] = yield all([
        yield put({ type: 'fetchGetInfo', payload: { album_id: payload.album_id } }),
        yield put({ type: 'fetchGetContent', payload: { album_id: payload.album_id } }),
      ]);

      // reducers
      yield put.resolve({ type: 'multiGetSongSeq' });

      const getPara = yield select((state) => ({
        info: state.albumList.info,
        content: state.albumList.content,
      }));

      if (callback) {
        callback(getPara);
      }
    },
  },
  reducers: {
    // get -----
    // getAutoComplete
    getAutoComplete(state, action) {
      let changeId = state.changeId + 1;
      let tmpData = [];

      if (!action.payload.resError && action.payload.data) {
        tmpData = action.payload.data;
      }

      return { ...state, changeId: changeId, autoComplete: tmpData };
    },
    // GetList
    getList(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId, list: action.payload.data };
    },
    // GetInfo
    getInfo(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, info: action.payload.data };
    },
    // getContent
    getContent(state, action) {
      let changeId = state.changeId + 1;
      let tmpData = {};

      // song_right_id 不可重複, song_right_effective == '0' 移除
      if (action.payload.data && action.payload.data.disc) {
        tmpData = { ...action.payload.data };

        for (let i = 0; i < tmpData.disc.length; i++) {
          for (let j = 0; j < tmpData.disc[i].content.length; j++) {
            let checkArr = [];
            let splitArr = [];

            for (let l = 0; l < tmpData.disc[i].content[j].righ_split.length; l++) {
              let splitItem = tmpData.disc[i].content[j].righ_split[l];

              if (checkArr.filter((fElem) => (fElem.song_right_id == splitItem.song_right_id && fElem.song_rights_type_id == splitItem.song_rights_type_id)).length == 0 && splitItem.song_right_effective == '1') {
                checkArr.push({ song_right_id: splitItem.song_right_id, song_rights_type_id: splitItem.song_rights_type_id });
                splitArr.push({ ...splitItem });
              }
            }

            tmpData.disc[i].content[j].righ_split = splitArr;
          }
        }
      }

      return { ...state, changeId: changeId, content: tmpData };
    },
    // getRelatedAlbum
    getRelatedAlbum(state, action) {
      let changeId = state.changeId + 1;
      let relatedAlbum = {};

      if (!action.payload.resError) {
        relatedAlbum = (action.payload.data && action.payload.data.data) ? (action.payload.data.data) : ([]);
      }

      return { ...state, changeId: changeId, relatedAlbum: relatedAlbum };
    },
    // getSongSplit
    getSongSplit(state, action) {
      let changeId = state.changeId + 1;
      let songSplit = {};

      if (!action.payload.resError) {
        songSplit = action.payload.data;
      }

      return { ...state, changeId: changeId, songSplit: songSplit };
    },
    // getRecordSplit
    getRecordSplit(state, action) {
      let changeId = state.changeId + 1;
      let recordSplit = [];

      if (!action.payload.resError) {
        recordSplit = (action.payload.data && action.payload.data.data) ? (action.payload.data.data.map((elem, idx) => ({ ...elem, ui_id: idx }))) : ([]);
      }

      return { ...state, changeId: changeId, recordSplit: recordSplit };
    },
    // getBelongAlbumInfo
    getBelongAlbumInfo(state, action) {
      let changeId = state.changeId + 1;
      let belongAlbumInfo = [];

      if (!action.payload.resError) {
        belongAlbumInfo = (action.payload.data && action.payload.data.data) ? (action.payload.data.data) : ([]);
      }

      return { ...state, changeId: changeId, belongAlbumInfo: belongAlbumInfo };
    },
    // update -----
    updateData(state, action) {
      let updateDataResult = 'error';

      if (!action.payload.resError) {
        if (action.payload.data && action.payload.data.album_id) {
          updateDataResult = action.payload.data.album_id;
        } else {
          updateDataResult = 'ok';
        }

        message.success('儲存成功');
      }

      return { ...state, updateDataResult: updateDataResult };
    },
    // multi -----
    multiGetList(state, action) {
      let multiChangeId = state.multiChangeId + 1;

      return { ...state, multiChangeId: multiChangeId };
    },
    multiGetInfo(state, action) {
      let multiChangeId = state.multiChangeId + 1;

      return { ...state, multiChangeId: multiChangeId };
    },
    multiGetSongSeq(state, action) {
      let multiChangeId = state.multiChangeId + 1;

      return { ...state, multiChangeId: multiChangeId };
    },
  },
};

export default Model;
