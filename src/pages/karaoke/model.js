import { getList, getInfo, addOrCopyKaraokeForm, editKaraokeForm, removeData, getAvailableContractCode, updateSettlePhase } from './service';
import { message, } from 'antd';

const Model = {
  namespace: 'karaokeList',
  state: {
    // change -----
    changeId: 0,
    multiChangeId: 0,
    removeDataResult: '',
    updateDataResult: '',
    // opt -----
    optType: [
      { label: '營業用單曲', value: '1' },
      { label: 'MIDI', value: '2' },
    ],
    optDistributionFormat: [
      { label: '實體', value: '1' },
      { label: '數位', value: '2' },
    ],
    optIncomeSource: [
      { label: '國內', value: '1' },
      { label: '國外', value: '2' },
    ],
    // data -----
    // GetList
    list: {
      total_item: 0,
      list: [],
    },
    // GetInfo
    info: {},
    // availableContractCode
    availableContractCode: '',
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
    // getAvailableContractCode
    *fetchGetAvailableContractCode({ payload }, { call, put }) {
      const response = yield call(getAvailableContractCode, payload);

      yield put({
        type: 'getAvailableContractCode',
        payload: response,
      });
    },
    // update -----
    *fecthAddOrCopyKaraokeForm({ payload, callback }, { call, put, select }) {
      const response = yield call(addOrCopyKaraokeForm, payload);

      yield put.resolve({
        type: 'addOrCopyKaraokeForm',
        payload: response,
      });

      const getPara = yield select((state) => (state.karaokeList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fecthEditKaraokeForm({ payload, callback }, { call, put, select }) {
      const response = yield call(editKaraokeForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.karaokeList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchRemoveData({ payload, callback }, { call, put, select }) {
      const response = yield call(removeData, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.karaokeList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fecthUpdateSettlePhase({ payload, callback }, { call, put, select }) {
      const response = yield call(updateSettlePhase, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.karaokeList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    // multi -----
    *fetchMultiGetList({ payload }, { call, put, all, select }) {
      // effects
      const [a, b, c, d, e] = yield all([
        yield put({ type: 'fetchGetList', payload: payload }),
        yield put({ type: 'settlePhaseList/fetchGetInfo', payload: { type: '1', phase_type: 'current' } }),
        yield put({ type: 'settlePhaseList/fetchGetInfo', payload: { type: '1', phase_type: 'next' } }),
        yield put({ type: 'settlePhaseList/fetchGetInfo', payload: { type: '2', phase_type: 'current' } }),
        yield put({ type: 'settlePhaseList/fetchGetInfo', payload: { type: '2', phase_type: 'next' } }),
      ]);

      // reducers
      yield put.resolve({ type: 'multiUpdateData' });
    },
    *fetchMultiGetAdvInfo({ payload }, { call, put, all, select }) {
      // effects
      const [a, b, c] = yield all([
        yield put({ type: 'authorizedCountryList/fetchGetAuthorizedCountry', payload: { search: 'all' } }),
        yield put({ type: 'authorizedAreaList/fetchGetList', payload: { search: 'all' } }),
        yield put({ type: 'fetchGetInfo', payload: payload }),
      ]);

      // createdUserId, updatedUserId
      const getPara = yield select((state) => (state.karaokeList.info));

      // effects
      const [d, e, f] = yield all([
        (getPara.song_code)
          ? (yield put({ type: 'songList/fetchGetISRCListBySong', payload: { song_code: getPara.song_code } }))
          : (null),
        (getPara.created_by)
          ? (yield put({ type: 'authList/fetchGetCreatedUser', payload: { user_id: getPara.created_by } }))
          : (yield put({ type: 'authList/getCreatedUser', payload: { data: {} } })),
        (getPara.updated_by)
          ? (yield put({ type: 'authList/fetchGetUpdatedUser', payload: { user_id: getPara.updated_by } }))
          : (yield put({ type: 'authList/getUpdatedUser', payload: { data: {} } })),
      ]);

      // reducers
      yield put.resolve({ type: 'multiUpdateData' });
    },
    *fetchMultiGetInfo({ payload }, { call, put, all, select }) {
      // effects
      const [a, b, c, d, e, f, g] = yield all([
        yield put({ type: 'authorizedCountryList/fetchGetAuthorizedCountry', payload: { search: 'all' } }),
        yield put({ type: 'authorizedAreaList/fetchGetList', payload: { search: 'all' } }),
        (payload.id) ? yield put({ type: 'fetchGetInfo', payload: payload }) : null,
        yield put({ type: 'settlePhaseList/fetchGetInfo', payload: { type: '1', phase_type: 'current' } }),
        yield put({ type: 'settlePhaseList/fetchGetInfo', payload: { type: '1', phase_type: 'next' } }),
        yield put({ type: 'settlePhaseList/fetchGetInfo', payload: { type: '2', phase_type: 'current' } }),
        yield put({ type: 'settlePhaseList/fetchGetInfo', payload: { type: '2', phase_type: 'next' } }),
      ]);

      // contract_code
      const getPara = yield select((state) => (state.karaokeList.info));

      // TODO: effects
      const [h] = yield all([
        (payload.ui_updatetype == 2 && getPara.contract_code)
          ? (yield put({ type: 'fetchGetAvailableContractCode', payload: { contract_code: getPara.contract_code } }))
          : null,
      ]);

      // reducers
      yield put.resolve({ type: 'multiUpdateData' });
    },
  },
  reducers: {
    // get -----
    // getList
    getList(state, action) {
      let changeId = state.changeId + 1;

      if (action.payload.data && action.payload.data.list && action.payload.data.list.length > 0) {
        let tmpData = action.payload.data.list.map((elem) => ({ ...elem, ui_child: [{ id: `child_${elem.id}`, ui_parent_id: elem.id, right_phase_id: elem.right_phase_id, record_phase_id: elem.record_phase_id, is_ui_child: true }] }));

        action.payload.data.list = tmpData;
      }

      return { ...state, changeId: changeId, list: action.payload.data };
    },
    // getInfo
    getInfo(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, info: action.payload.data };
    },
    // getAvailableContractCode
    getAvailableContractCode(state, action) {
      let changeId = state.changeId + 1;
      let returnVal = '';

      if (!action.payload.resError && action.payload.data && action.payload.data.new_contract_code) {
        returnVal = action.payload.data.new_contract_code;
      }

      return { ...state, changeId: changeId, availableContractCode: returnVal };
    },
    // update -----
    addOrCopyKaraokeForm(state, action) {
      let updateDataResult = 'error';

      if (!action.payload.resError && action.payload.data) {
        updateDataResult = action.payload.data;
        message.success('儲存成功');
      }

      return { ...state, updateDataResult: updateDataResult };
    },
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
    multiUpdateData(state, action) {
      let multiChangeId = state.multiChangeId + 1;

      return { ...state, multiChangeId: multiChangeId };
    },
  },
};

export default Model;