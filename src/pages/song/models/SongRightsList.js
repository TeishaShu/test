import { message } from 'antd';
import { getbyAuthorList, getSongRights, checkSongRightsForm, addSongRightsForm, editSongRightsForm, removeSongRightsData, toHistorySongRightsData, expireContract, transferContract } from '../services/songRightsList';

const Model = {
  namespace: 'songRightsList',
  state: {
    // changeId, result
    changeId: 0,
    multiChangeId: 0,
    checkResult: '',
    updateDataResult: '',  // not clean result, use callback
    transferResult: '',
    // opt
    optSongRightsType: [
      { label: '詞', value: '1' },
      { label: '曲', value: '2' },
      { label: '改編詞', value: '3' },
      { label: '改編曲', value: '4' },
      { label: 'Rap詞', value: '5' },
      // { label: '自訂', value: '6' },  // UI 使用 radio 呈現
    ],
    // GetbyAuthorList
    byAuthorList: {
      total_items: 0,
      data_list: [],
    },
    // get song_rights
    song_rights: {
      song_rights_type_id: '',
      song_rights_type_custom: '',
      rights_ratio: '',
      author_code: '',
      name: '',
      rights_start: '',
      op_company_nickname_id: '',
      op_company_id: '',
      op_company_nickname: '',
      op_company_code: '', // only for ui
      op_author_id: '',
      op_author_name: '',
      op_author_code: '',
      author_pen_name_id: '',
      rights_end: '',
      sp_company_nickname_id: '',
      sp_company_id: '',
      sp_company_nickname: '',
      sp_company_code: '', // only for ui
      agency_area_type: '',
      agency_area_id: '',
      agency_country: [],
      contract_agency_end: '',
      settle_company_id: '',
      settle_company_name: '',
      settle_company_code: '', // only for ui
      settle_author_id: '',
      settle_author_name: '',
      settle_author_code: '',
      is_digital: '0',
      is_entity: '0',
      notes: '',
    },
  },
  effects: {
    // get -----
    // GetbyAuthorList
    *fetchGetbyAuthorList({ payload }, { call, put }) {
      const response = yield call(getbyAuthorList, payload);

      yield put({
        type: 'getbyAuthorList',
        payload: response,
      });
    },
    // get song_rights
    *fetchGetSongRights({ payload }, { call, put }) {
      const response = yield call(getSongRights, payload);

      yield put({
        type: 'getSongRights',
        payload: response,
      });
    },
    // check song_rights
    *fetchCheckSongRightsForm({ payload }, { call, put }) {
      const response = yield call(checkSongRightsForm, payload);

      yield put({
        type: 'checkSongRightsForm',
        payload: response,
      });
    },
    // update -----
    // add song_rights
    *fetchAddSongRightsForm({ payload }, { call, put }) {
      const response = yield call(addSongRightsForm, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });
    },
    // edit song_rights
    *fetchEditSongRightsForm({ payload }, { call, put }) {
      const response = yield call(editSongRightsForm, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });
    },
    // remove song_rights
    *fetchRemoveSongRightsData({ payload }, { call, put }) {
      const response = yield call(removeSongRightsData, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });
    },
    // to history song_rights
    *fetchToHistorySongRightsData({ payload }, { call, put }) {
      const response = yield call(toHistorySongRightsData, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });
    },
    // expireContract
    *fetchExpireContract({ payload, callback }, { call, put }) {
      const response = yield call(expireContract, payload);

      if (callback) {
        callback(response.data);
      }
    },
    // transferContract
    *fetchTransferContract({ payload, callback }, { call, put }) {
      const response = yield call(transferContract, payload);

      yield put.resolve({
        type: 'transferContract',
        payload: response,
      });

      if (callback) {
        callback(response);
      }
    },
    // multi -----
    // multi - get songRights (url: /song/rights/update, /song/rights/update/:id)
    *fetchMultiGetSongRights({ payload }, { call, put, all, select }) {
      // effects
      const [a, b, c, d] = yield all([
        yield put({ type: 'authorList/fetchGetAutoCompleteAuthorName', payload: { keyword: '' } }),
        yield put({ type: 'authorizedCountryList/fetchGetAuthorizedCountry', payload: { search: 'all' } }),
        yield put({ type: 'authorizedAreaList/fetchGetList', payload: { search: 'all' } }),
        ((payload.isEdit) ? (yield put({ type: 'fetchGetSongRights', payload: { id: payload.id, song_code: payload.song_code } })) : (null)),
      ]);

      // get song_code parameter
      const getPara = yield select((state) => ({ song_code: state.songRightsList.song_rights.song_code }));
      // song detail
      yield put.resolve({ type: 'songList/fetchGetInfo', payload: { song_code: ((payload.isEdit) ? getPara.song_code : payload.song_code) } });

      // get author_code parameter
      const getParaAuthorCode = yield select((state) => (state.songRightsList.song_rights.author_code));
      // author penname
      if (payload.isEdit && getParaAuthorCode) {
        yield put.resolve({ type: 'authorList/fetchGetAutoComplete', payload: { keyword: getParaAuthorCode } });
      }

      // get author_id parameter
      const getParaAuthorId = yield select((state) => (state.songRightsList.song_rights.author_id));
      // 
      if (payload.isEdit && getParaAuthorId) {
        yield put.resolve({ type: 'contractSongList/fetchGetAutoCompleteByAuthorId', payload: { author_id: getParaAuthorId } });
      }

      // reducers
      yield put.resolve({ type: 'multiGetSongRights' });
    },
    // multi - check, set songRights (url: /song/rights/update, /song/rights/update/:id)
    *fetchMultiUpdateSongRightsForm({ payload, callback }, { call, put, all, select }) {
      // check contract_song_id (contract_song.id)
      let checkContractId = '';
      yield put.resolve({ type: 'contractSongList/fetchGetAutoCompleteByAuthorId', payload: { author_id: payload.authorId } });
      const getPara = yield select((state) => (state.contractSongList.autoCompleteByAuthorId));
      if (getPara.length > 0) {
        for (let i = 0; i < getPara.length; i++) {
          if (payload.save.contract_song_code && getPara[i].contract_code.toLowerCase() == payload.save.contract_song_code.toLowerCase()) {
            checkContractId = getPara[i].id;
          }
        }
      }
      payload.save.contract_song_id = checkContractId;

      // check
      yield put.resolve({ type: 'fetchCheckSongRightsForm', payload: payload.check, });
      let checkResult = yield select((state) => state.songRightsList.checkResult);

      // save
      if (checkResult == 'ok') {
        if (payload.isEdit) {
          yield put.resolve({ type: 'fetchEditSongRightsForm', payload: payload.save });
        } else {
          yield put.resolve({ type: 'fetchAddSongRightsForm', payload: payload.save });
        }

        // updateDataResult
        const getPara = yield select((state) => ({ updateDataResult: state.songRightsList.updateDataResult }));

        if (getPara.updateDataResult == 'ok') {
          callback('ok');
        } else {
          callback('error');
        }
      }

      // reducers
      yield put.resolve({ type: 'multiupdateSongRightsForm' });
    },
    // multi - remove
    *fetchMultiRemoveSongRightsData({ payload, callback }, { call, put, all, select }) {
      yield put.resolve({ type: 'fetchRemoveSongRightsData', payload: payload });

      // updateDataResult
      const getPara = yield select((state) => ({ updateDataResult: state.songRightsList.updateDataResult }));

      if (getPara.updateDataResult == 'ok') {
        callback('ok');
      } else {
        callback('error');
      }
    },
    // multi - toHistory
    *fetchMultiToHistorySongRightsData({ payload, callback }, { call, put, all, select }) {
      yield put.resolve({ type: 'fetchToHistorySongRightsData', payload: payload });

      // updateDataResult
      const getPara = yield select((state) => ({ updateDataResult: state.songRightsList.updateDataResult }));

      if (getPara.updateDataResult == 'ok') {
        callback('ok');
      } else {
        callback('error');
      }
    },
    // multi - getSongRightTransfer
    *fetchMultiGetSongRightTransfer({ payload }, { call, put, all, select }) {
      const [a, b, c] = yield all([
        yield put({ type: 'fetchGetSongRights', payload: { id: payload.right_id, song_code: payload.song_code } }),
        yield put({ type: 'authorizedCountryList/fetchGetAuthorizedCountry', payload: { search: 'all' } }),
        yield put({ type: 'authorizedAreaList/fetchGetList', payload: { search: 'all' } }),
      ]);

      const getSongCode = yield select((state) => (state.songRightsList.song_rights.song_code));
      const getAuthorId = yield select((state) => (state.songRightsList.song_rights.author_id));

      const [d, e] = yield all([
        yield put.resolve({ type: 'songList/fetchGetInfo', payload: { song_code: getSongCode } }),
        yield put.resolve({ type: 'contractSongList/fetchGetAutoCompleteByAuthorId', payload: { author_id: getAuthorId } })
      ]);

      // reducers
      yield put.resolve({ type: 'multiGetSongRightTransfer' });
    },
  },
  reducers: {
    // get -----
    getbyAuthorList(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, byAuthorList: action.payload.data, removeDataResult: '', updateDataResult: '' };
    },
    // get song_rights
    getSongRights(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, song_rights: action.payload.data[0], removeDataResult: '', updateDataResult: '' };
    },
    // check songRights
    checkSongRightsForm(state, action) {
      let result = 'ok';

      if (action.payload.resError) {
        result = 'error';
      }

      return { ...state, checkResult: result };
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
    transferContract(state, action) {
      let transferResult = 'error';

      if (!action.payload.resError) {
        transferResult = 'ok';
        // message.success('儲存成功');
      }

      return { ...state, transferResult: transferResult };
    },
    // multi -----
    // multi - get songRights
    multiGetSongRights(state, action) {
      let multiChangeId = state.multiChangeId + 1;

      return { ...state, multiChangeId: multiChangeId, updateDataResult: '' };
    },
    // multi - update songRightsForm
    multiupdateSongRightsForm(state, action) {
      return { ...state, };
    },
    // multi - getSongRightTransfer
    multiGetSongRightTransfer(state, action) {
      let multiChangeId = state.multiChangeId + 1;

      return { ...state, multiChangeId: multiChangeId };
    }
  },
};

export default Model;