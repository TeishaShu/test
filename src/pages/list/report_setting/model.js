import { getList, editData, getIncomeTaxOverList } from './service';
import { message, } from 'antd';

const Model = {
  namespace: 'reportSettingList',
  state: {
    // change -----
    changeId: 0,
    multiChangeId: 0,
    updateDataResult: '',
    // data -----
    // fetchGetList
    list: {},
    // fetchGetIncomeTaxOverList
    incomeTaxOverList: {},
  },
  effects: {
    // get -----
    *fetchGetList({ payload, callback }, { call, put, select }) {
      const response = yield call(getList, payload);

      yield put({
        type: 'getList',
        payload: response,
      });

      const getPara = yield select((state) => (state.reportSettingList.list));

      if (callback) {
        callback(getPara ? getPara : {});
      }
    },
    *fetchGetIncomeTaxOverList({ payload }, { call, put }) {
      const response = yield call(getIncomeTaxOverList, payload);

      yield put({
        type: 'getIncomeTaxOverList',
        payload: response,
      });
    },
    // update -----
    *fetchEditData({ payload, callback }, { call, put, select }) {
      const response = yield call(editData, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.reportSettingList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
  },
  reducers: {
    // get -----
    getList(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, list: action.payload.data };
    },
    getIncomeTaxOverList(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, incomeTaxOverList: action.payload.data };
    },
    // update -----
    updateData(state, action) {
      let updateDataResult = 'error';

      if (!action.payload.resError) {
        updateDataResult = 'ok';
        message.success('儲存成功！');
      }

      return { ...state, updateDataResult: updateDataResult };
    },
  },
};

export default Model;
