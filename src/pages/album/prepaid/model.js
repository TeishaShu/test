import { getExternalContractList, getInternalContractList, getDiscContent, editExternalContract, editInternalContract, removePrepaid } from './service';
import { message, } from 'antd';

const Model = {
  namespace: 'albumPrepaidList',
  state: {
    // change -----
    changeId: 0,
    multiChangeId: 0,
    removeDataResult: '',
    updateDataResult: '',
    // data -----
    externalContractList: {},
    internalContractList: {},
    // getDiscContent
    discContent: []
  },
  effects: {
    // get -----
    // getExternalContractList
    *fetchGetExternalContractList({ payload }, { call, put }) {
      const response = yield call(getExternalContractList, payload);

      yield put({
        type: 'getExternalContractList',
        payload: response,
      });
    },
    // getInternalContractList
    *fetchGetInternalContractList({ payload }, { call, put }) {
      const response = yield call(getInternalContractList, payload);

      yield put({
        type: 'getInternalContractList',
        payload: response,
      });
    },
    // getDiscContent
    *fetchGetDiscContent({ payload, callback }, { call, put, select }) {
      const response = yield call(getDiscContent, payload);

      yield put.resolve({
        type: 'getDiscContent',
        payload: response,
      });

      const getPara = yield select((state) => (state.albumPrepaidList.discContent));

      if (callback) {
        callback(getPara);
      }
    },
    // update -----
    // editExternalContract
    *fetchEditExternalContract({ payload, callback }, { call, put, all, select }) {
      const response = yield call(editExternalContract, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.albumPrepaidList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    // editInternalContract
    *fetchEditInternalContract({ payload, callback }, { call, put, all, select }) {
      const response = yield call(editInternalContract, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.albumPrepaidList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchRemovePrepaid({ payload, callback }, { call, put, all, select }) {
      const response = yield call(removePrepaid, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.albumPrepaidList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    // multi -----
    *fetchMultiGetContractList({ payload, callback }, { call, put, all, select }) {
      // effects
      const [a, b] = yield all([
        yield put({ type: 'fetchGetExternalContractList', payload: payload }),
        yield put({ type: 'fetchGetInternalContractList', payload: payload }),
      ]);

      // reducers
      yield put.resolve({ type: 'multiGetList' });

      const getPara = yield select((state) => (state.albumPrepaidList));

      if (callback) {
        callback(getPara.internalContractList, getPara.externalContractList);
      }
    },
  },
  reducers: {
    // get -----
    // getExternalContractList
    getExternalContractList(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId, externalContractList: (!action.payload.resError) ? (action.payload.data) : ({}) };
    },
    // getInternalContractList
    getInternalContractList(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId, internalContractList: (!action.payload.resError) ? (action.payload.data) : ({}) };
    },
    // getDiscContent
    getDiscContent(state, action) {
      let changeId = state.changeId + 1;
      let discContent = [];

      if (!action.payload.resError) {
        discContent = action.payload.data;
      }

      return { ...state, changeId: changeId, discContent: discContent };
    },
    // update -----
    updateData(state, action) {
      let updateDataResult = 'error';

      if (!action.payload.resError) {
        updateDataResult = 'ok';

        message.success('儲存成功');
      }

      return { ...state, updateDataResult: updateDataResult };
    },
    // multi -----
    multiGetList(state, action) {
      let multiChangeId = state.multiChangeId + 1;

      return { ...state, multiChangeId: multiChangeId };
    },
  },
};

export default Model;
