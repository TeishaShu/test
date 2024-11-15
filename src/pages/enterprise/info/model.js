import {
  getList,
  getInfo,
  addEnterprise,
  editEnterprise,
  deleteEnterprise,
} from './service';

const Model = {
  namespace: 'enterpriseInfoList',
  state: {
    // change -----
    changeId: 0,
    multiChangeId: 0,
    removeDataResult: '',
    updateDataResult: '',
    // data -----
    // getList
    list: {
      total_items: 0,
      data_list: [],
    },
    // edit, update
    info: {},
  },
  effects: {
    * fetchGetList({ payload }, { call, put }) {
      const response = yield call(getList, payload);

      yield put({
        type: 'getList',
        payload: response,
      });
    },
    * fetchGetInfo({ payload }, { call, put }) {
      const response = yield call(getInfo, payload);

      yield put({
        type: 'getInfo',
        payload: response,
      });
    },
    * fetchAddForm({ payload, callback }, { call }) {
      const response = yield call(addEnterprise, payload);

      callback(response);
    },
    * fetchEditForm({ payload, callback }, { call }) {
      const response = yield call(editEnterprise, payload);

      callback(response);
    },
    * fetchDeleteForm({ payload, callback }, { call }) {
      const response = yield call(deleteEnterprise, payload);

      callback(response);
    },
  },
  reducers: {
    getList(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId, list: action.payload.data };
    },
    getInfo(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId, info: action.payload.data };
    },
  },
};

export default Model;
