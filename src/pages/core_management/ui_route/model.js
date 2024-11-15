import { getInitMenu, getList, addData, updateData, removeData } from './service';
import { message, } from 'antd';

const Model = {
  namespace: 'uirouteList',
  state: {
    // change -----
    changeId: 0,
    updateDataResult: '',
    // opt -----
    optLayout: [
      { value: '1', label: 'AuthLayout' },
      { value: '2', label: 'AuthAccessLayout' },
      { value: '3', label: 'BasicLayout' },
    ],
    optMenuStyle: [
      { label: '下拉樣式', value: '1' },
      { label: '點選樣式', value: '2' },
      { label: '隱藏樣式', value: '3' },
    ],
    // data -----
    // getInitMenu
    initMenu: {
      menu: [],
      selected_list: [],
      permission_list: [],
    },
    // getList
    list: {
      all_route: [],
      all_function: [],
    },
  },
  effects: {
    // get -----
    // getInitMenu
    *fetchGetInitMenu({ payload, callback }, { call, put, select }) {
      const response = yield call(getInitMenu, payload);

      yield put.resolve({
        type: 'getInitMenu',
        payload: response,
      });

      if (callback) {
        callback();
      }
    },
    // GetList
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(getList, payload);

      yield put({
        type: 'getList',
        payload: response,
      });
    },
    // update -----
    // addData
    *fetchAddData({ payload, callback }, { call, put, select }) {
      const response = yield call(addData, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.uirouteList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    // updateData
    *fetchUpdateData({ payload, callback }, { call, put, select }) {
      const response = yield call(updateData, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.uirouteList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    // remove
    *fetchRemoveData({ payload, callback }, { call, put, select }) {
      const response = yield call(removeData, payload);

      yield put.resolve({
        type: 'removeData',
        payload: response,
      });

      const getPara = yield select((state) => (state.uirouteList.removeDataResult));

      if (callback) {
        callback(getPara);
      }
    },
  },
  reducers: {
    // get -----
    // initMenu
    getInitMenu(state, action) {
      let tmpInitMenu = {
        menu: [],
        selected_list: [],
        permission_list: [],
      };

      if (!action.payload.resError && action.payload.data) {
        tmpInitMenu = action.payload.data;
      }

      return { ...state, initMenu: tmpInitMenu };
    },
    // getList
    getList(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, list: action.payload.data, updateDataResult: '' };
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
  },
};

export default Model;