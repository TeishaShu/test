import {
  getList,
  getInfo,
  deleteMember,
  freezeMember,
  updateMember,
  setAgent,
  addMember,
  getRole,
} from './service';


const Model = {
  namespace: 'memberList',
  state: {
    // change -----
    changeId: 0,
    multiChangeId: 0,
    removeDataResult: '',
    updateDataResult: '',
    // data -----
    // getLis
    list: {
      total_items: 0,
      data_list: [],
    },
    // edit, update
    info: {},
    role: [],
  },
  effects: {
    // get -----
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
    * fetchEditForm({ payload, callback }, { call }) {
      const response = yield call(updateMember, payload);

      callback(response ? response.data : undefined);
    },
    * fetchDeleteMember({ payload, callback }, { call }) {
      const response = yield call(deleteMember, payload);

      callback(response ? response.data : undefined);
    },
    * fetchFreezeMember({ payload, callback }, { call }) {
      const response = yield call(freezeMember, payload);

      callback(response ? response.data : undefined);
    },
    * fetchSetAgent({ payload, callback }, { call }) {
      const response = yield call(setAgent, payload);

      callback(response ? response.data : undefined);
    },
    * fetchAddMember({ payload, callback }, { call }) {
      const response = yield call(addMember, payload);

      callback(response ? response.data : undefined);
    },
    * fetchGetRole({ payload }, { call, put }) {
      const response = yield call(getRole, payload);

      yield put({
        type: 'getRole',
        payload: response,
      });
    },
  },
  reducers: {
    // get -----
    getList(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId, list: action.payload.data };
    },
    getInfo(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId, info: action.payload.data };
    },
    getRole(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId, role: action.payload.data };
    },
  },
};

export default Model;
