import { getInfo, getPhaseList } from '../service/settlePhase';

const Model = {
  namespace: 'settlePhaseList',
  state: {
    // change -----
    changeId: 0,
    // data -----
    enityRight: {  // 1:實體-詞曲
      current: {},  // 當期
      last: {},  // 上期
      next: {},  // 下期
      hold: {},  // 上上期-保留量用
    },
    enityRecord: {  // 2:實體-錄音
      current: {},  // 當期
      last: {},  // 上期
      next: {},  // 下期
      hold: {},  // 上上期-保留量用
    },
    newMediaRight: {  // 3:新媒體-詞曲
      current: {},  // 當期
      last: {},  // 上期
      next: {},  // 下期
      hold: {},  // 上上期-保留量用
    },
    newMediaRecord: {  // 4:新媒體-錄音
      current: {},  // 當期
      last: {},  // 上期
      next: {},  // 下期
      hold: {},  // 上上期-保留量用
    },
    souvenir: {  // 5:明星商品
      current: {},  // 當期
      last: {},  // 上期
      next: {},  // 下期
      hold: {},  // 上上期-保留量用
    },
    phaseList: [],
  },
  effects: {
    // get -----
    *fetchGetInfo({ payload }, { call, put }) {
      const response = yield call(getInfo, payload);

      yield put({
        type: 'getInfo',
        payload: response,
        req: payload,
      });
    },
    *fetchGetPhaseList({ payload, callback }, { call, put, select }) {
      const response = yield call(getPhaseList, payload);
      yield put({
        type: 'getPhaseList',
        payload: response,
      });

      const getPara = yield select((state) => (state.settlePhaseList.phaseList));

      if (callback) {
        callback(getPara);
      }
    },
  },
  reducers: {
    getInfo(state, action) {
      let changeId = state.changeId + 1;
      let returnObj;
      let type = '';
      let phaseType = '';

      if (!action.payload.resError && action.payload && action.req && action.req.phase_type && action.payload.data && action.payload.data.type) {
        switch (action.payload.data.type) {
          case '1':
            type = 'enityRight';
            break;
          case '2':
            type = 'enityRecord';
            break;
          case '3':
            type = 'newMediaRight';
            break;
          case '4':
            type = 'newMediaRecord';
            break;
          case '5':
            type = 'souvenir';
            break;
        }

        phaseType = action.req.phase_type;
      }

      returnObj = { ...state, changeId, };
      if (type && phaseType) {
        returnObj[type][phaseType] = action.payload.data;

      }

      return returnObj;
    },
    getPhaseList(state, action) {
      let changeId = state.changeId + 1;
      let tmpPhaseList = [];

      if (!action.payload.resError && action.payload.data) {
        tmpPhaseList = action.payload.data;
      }

      return { ...state, changeId: changeId, phaseList: tmpPhaseList, };
    },
  },
};

export default Model;
