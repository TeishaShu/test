import { getList, addData, updateData, removeData } from '../services/authorizedAreaList';
import { message, } from 'antd';

const Model = {
  namespace: 'authorizedAreaList',
  state: {
    // change -----
    changeId: 0,
    updateDataResult: '',
    // opt -----
    optAgencyAreaType: [
      // { label: '', value: '1' },　　// 無特定地區(只選國家)，UI 另外顯示，不在 selectbox 上
      { label: '無', value: '2' },  // 只有特定地區(無國家)
      { label: '包含', value: '3' },  // 地區包含特定國家
      { label: '除了', value: '4' },  // 地區排除特定國家
    ],
    // data -----
    // GetList
    list: {
      total_items: 0,
      data_list: [],
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
    // update -----
    *fetchAddData({ payload, callback }, { call, put, select }) {
      const response = yield call(addData, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.authorizedAreaList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchEditData({ payload, callback }, { call, put, select }) {
      const response = yield call(updateData, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.authorizedAreaList.updateDataResult));

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
    // GetList
    getList(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, list: action.payload.data };
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