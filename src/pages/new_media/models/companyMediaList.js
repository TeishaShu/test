import { message } from 'antd';
import { getList, addData, editData, removeData, checkCompanyCodeExists, } from '../services/companyMediaList';

const Model = {
  namespace: 'companyMediaList',
  state: {
    // change -----
    changeId: 0,
    checkResult: '',
    // data -----
    // getList
    list: {
      total_items: 0,
      data_list: [],
    },
  },
  effects: {
    // get -----
    // getList
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(getList, payload);

      yield put({
        type: 'getList',
        payload: response,
      });
    },
    // update -----
    *fetchAddData({ payload }, { call, put }) {
      const response = yield call(addData, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });
    },
    *fetchEditData({ payload }, { call, put }) {
      const response = yield call(editData, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });
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
    // checkCompanyCodeExists
    *fetchCheckCompanyCodeExists({ payload }, { call, put }) {
      const response = yield call(checkCompanyCodeExists, payload);

      yield put({
        type: 'checkCompanyCodeExists',
        payload: response,
      });
    },
    // multi -----
    *fetchMultiUpdateData({ payload, callback }, { call, put, all, select }) {
      // checkCompanyCodeExists
      yield put.resolve({ type: 'fetchCheckCompanyCodeExists', payload: payload });

      const getPara = yield select((state) => ({ checkResult: state.companyMediaList.checkResult }));

      // if check ok, add/edit data
      if (getPara.checkResult == 'ok') {
        if (payload.id) {
          yield put.resolve({ type: 'fetchEditData', payload: payload });
        } else {
          yield put.resolve({ type: 'fetchAddData', payload: payload });
        }
        callback('ok');
      } else {
        callback('error');
      }

      // reducers
      yield put.resolve({ type: 'multiUpdateData' });
    },
  },
  reducers: {
    // get -----
    // getList
    getList(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, list: action.payload.data, };
    },
    // update -----
    updateData(state, action) {
      if (!action.payload.resError) {
        message.success('儲存成功！');
      }

      return { ...state };
    },
    // checkCompanyCodeExists
    checkCompanyCodeExists(state, action) {
      let checkResult = 'error';

      if (!action.payload.resError) {
        checkResult = 'ok';
      }

      return { ...state, checkResult: checkResult };
    },
    // multi -----
    multiUpdateData(state, action) {
      return { ...state };
    },
  },
};
export default Model;
