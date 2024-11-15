import { getList, getListAutoList, toggleStatus, addData, editData, removeData, } from './service';
import { message, } from 'antd';

const Model = {
  namespace: 'isrcTypeList',
  state: {
    // change -----
    changeId: 0,
    updateDataResult: '',
    // data -----
    // getList
    list: {
      total_items: 0,
      data_list: [],
    },
    // getListAutoList
    listAutoList: [],
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
    // getListAutoList
    *fetchGetListAutoList({ payload }, { call, put }) {
      const response = yield call(getListAutoList, payload);

      yield put({
        type: 'getListAutoList',
        payload: response,
      });
    },
    // update -----
    *fetchToggleStatus({ payload, callback }, { call, put }) {
      const response = yield call(toggleStatus, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      if (callback) {
        callback();
      }
    },
    *fetchAddData({ payload, callback }, { call, put, select }) {
      const response = yield call(addData, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.isrcTypeList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchEditData({ payload, callback }, { call, put, select }) {
      const response = yield call(editData, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.isrcTypeList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchRemoveData({ payload, callback }, { call, put }) {
      const response = yield call(removeData, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      if (callback) {
        callback();
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
    getListAutoList(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, listAutoList: action.payload.data };
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