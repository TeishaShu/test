import { getListAll } from '@/services/enterprise';

const Model = {
  namespace: 'enterpriseList',
  state: {
    // change -----
    changeId: 0,
    // data -----
    listallList: [],
    agent_eid: '',
  },
  effects: {
    // get -----
    // getListAll
    *fetchGetListAll({ payload, callback }, { call, put, select }) {
      const response = yield call(getListAll, payload);

      yield put({
        type: 'getListAll',
        payload: response,
      });

      const getPara = yield select((state) => (state.enterpriseList.listallList));

      if (callback) {
        callback(getPara);
      }
    },
  },
  reducers: {
    // get -----
    // getListAll
    getListAll(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, listallList: action.payload.data.data_list };
    },
    // change -----
    changeAgentEid(state, { payload }) {
      return { ...state, agent_eid: payload.agent_eid }
    },
  },
};

export default Model;