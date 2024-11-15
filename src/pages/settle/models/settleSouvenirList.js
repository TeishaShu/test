import { getTempReport, getAuthorOpt, deleteImportedSalesData, calculation } from '../service/settleSouvenirList';
import { message, } from 'antd';

const Model = {
  namespace: 'settleSouvenirList',
  state: {
    // change -----
    changeId: 0,
    multiChangeId: 0,
    updateDataResult: '',
    // data -----
    // getTempReport
    tempReport: {
      summary: {},
      data_list: [],
    },
    // getAuthorOpt
    authOpt: [],
  },
  effects: {
    // get -----
    *fetchGetAuthorOpt({ payload }, { call, put }) {
      const response = yield call(getAuthorOpt, payload);
      yield put({
        type: 'getAuthorOpt',
        payload: response,
      });
    },
    *fetchGetTempReport({ payload }, { call, put }) {
      const response = yield call(getTempReport, payload);
      yield put({
        type: 'getTempReport',
        payload: response,
      });
    },
    // update -----
    *fetchDeleteImportedSalesData({ payload, callback }, { call, put, all, select }) {
      const response = yield call(deleteImportedSalesData, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.settleSouvenirList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchCalculation({ payload, callback }, { call, put, all, select }) {
      const response = yield call(calculation, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.settleSouvenirList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    // multi -----
    *fetchMultiGetAuthorOpt({ payload }, { call, put, all, select }) {
      let tmpList = [];

      // effects
      yield put.resolve({
        type: 'settlePhaseList/fetchGetPhaseList',
        payload: {
          agent_eid: payload.agent_eid,
          type: '5'
        }
      });

      const getPhaseList = yield select((state) => (state.settlePhaseList.phaseList));

      if (getPhaseList.length > 0) {
        tmpList = getPhaseList.filter((elem) => (elem.id == payload.ui_page_souv_id));

        if (tmpList.length > 0) {
          payload.settle_phase_start = tmpList[0].phase_start;
          payload.settle_phase_end = tmpList[0].phase_end;
        }
      }

      yield put.resolve({ type: 'fetchGetAuthorOpt', payload: payload });

      // reducers
      yield put.resolve({ type: 'multiUpdateData' });
    },
    *fetchMultiGetTempReport({ payload }, { call, put, all, select }) {
      let tmpList = [];

      // effects
      yield put.resolve({ type: 'settlePhaseList/fetchGetPhaseList', payload: { agent_eid: payload.agent_eid, type: '5' } });

      const getPhaseList = yield select((state) => (state.settlePhaseList.phaseList));

      if (getPhaseList.length > 0) {
        tmpList = getPhaseList.filter((elem) => (elem.id == payload.ui_page_souv_id));

        if (tmpList.length > 0) {
          payload.settle_phase_start = tmpList[0].phase_start;
          payload.settle_phase_end = tmpList[0].phase_end;
        }
      }

      yield put.resolve({ type: 'fetchGetTempReport', payload: payload });

      // reducers
      yield put.resolve({ type: 'multiUpdateData' });
    },
  },
  reducers: {
    // get -----
    getAuthorOpt(state, action) {
      let changeId = state.changeId + 1;
      let tmpOpt = [];

      if (!action.payload.resError && action.payload.data) {
        tmpOpt = action.payload.data;
      }

      return { ...state, changeId: changeId, authOpt: tmpOpt };
    },
    getTempReport(state, action) {
      let changeId = state.changeId + 1;
      let tempReport = {};

      if (!action.payload.resError && action.payload.data) {
        tempReport = action.payload.data;
      }

      return { ...state, changeId: changeId, tempReport: tempReport };
    },
    // update -----
    updateData(state, action) {
      let updateDataResult = 'error';

      if (!action.payload.resError) {
        if (action.payload.data && action.payload.data.id) {
          updateDataResult = action.payload.data.id;
        } else {
          updateDataResult = 'ok';
        }

        message.success('儲存成功');
      }

      return { ...state, updateDataResult: updateDataResult };
    },
    // multi -----
    multiUpdateData(state, action) {
      let multiChangeId = state.multiChangeId + 1;

      return { ...state, multiChangeId: multiChangeId };
    },
  },
};

export default Model;