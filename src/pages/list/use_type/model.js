import { getList, getAllList, toggleStatus, addData, editData, removeData, } from './service';
import { message, } from 'antd';

const Model = {
  namespace: 'useTypeList',
  state: {
    // change -----
    changeId: 0,
    updateDataResult: '',
    // opt -----
    optSubject: [
      { label: '新媒體', value: '1', },
      { label: '版稅支出', value: '2', },
    ],
    // data -----
    // getList
    list: {
      total_items: 0,
      data_list: [],
    },
    // getAllList
    allList: [],
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
    // getAllList
    *fetchGetAllList({ payload }, { call, put }) {
      const response = yield call(getAllList, payload);

      yield put({
        type: 'getAllList',
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

      const getPara = yield select((state) => (state.useTypeList.updateDataResult));

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

      const getPara = yield select((state) => (state.useTypeList.updateDataResult));

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
    // getAllList
    getAllList(state, action) {
      let changeId = state.changeId + 1;
      let returnData = (action.payload.data) ? (action.payload.data) : [];

      return { ...state, changeId: changeId, allList: returnData };
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