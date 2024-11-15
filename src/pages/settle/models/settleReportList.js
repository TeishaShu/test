import { getReportList, getReportOpts, getCalculationPreview, cleanAll } from '../service/settleReportList';
import { message, } from 'antd';

const Model = {
  namespace: 'settleReportList',
  state: {
    // change -----
    changeId: 0,
    multiChangeId: 0,
    updateDataResult: '',
    // opt -----
    optSettleType: [
      { value: 'tw', label: '台灣專輯' },
      { value: 'ext', label: '外部專輯' },
      { value: 'os', label: '海外專輯' },
      { value: 'exception', label: '例外專輯' },
      { value: 'misc', label: '其他授權' },
      { value: 'new_media', label: '新媒體' },
      { value: 'suv', label: '明星商品' },
    ],
    optSettleCountry: [
      { value: '', label: '不限' },
      { value: 'WW', label: '全世界' },
      { value: 'CN', label: '中國' },
      { value: 'SG', label: '新加坡' },
      { value: 'MY', label: '馬來西亞' },
      { value: 'TW', label: '台灣' },
      { value: 'CA', label: '加拿大' },
      { value: 'US', label: '美國' },
      { value: 'JP', label: '日本' },
    ],
    // data -----
    reportList: {},
    reportOpts: {},
    calculationPreview: {
      total_items: 0,
      data: [],
    }
  },
  effects: {
    // get -----
    *fetchGetReportList({ payload }, { call, put }) {
      const response = yield call(getReportList, payload);

      yield put({
        type: 'getReportList',
        payload: response,
      });
    },
    *fetchGetReportOpts({ payload }, { call, put }) {
      const response = yield call(getReportOpts, payload);

      yield put({
        type: 'getReportOpts',
        payload: response,
      });
    },
    *fetchGetCalculationPreview({ payload }, { call, put }) {
      const response = yield call(getCalculationPreview, payload);

      yield put({
        type: 'getCalculationPreview',
        payload: response,
      });
    },
    // update -----
    *fetchCleanAll({ payload, callback }, { call, put, all, select }) {
      const response = yield call(cleanAll, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.settleReportList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    // multi -----
    *fetchMultiGetReportOpts({ payload }, { call, put, all, select }) {
      let tmpList = [];
      // effects
      yield put.resolve({
        type: 'settlePhaseList/fetchGetPhaseList',
        payload: {
          agent_eid: payload.agent_eid,
          type: (payload.ui_settle_phase_type) ? (payload.ui_settle_phase_type) : ('')
        }
      });

      const getPhaseList = yield select((state) => (state.settlePhaseList.phaseList));

      if (getPhaseList.length > 0) {
        tmpList = getPhaseList.filter((elem) => (elem.id == payload.ui_page_id));

        if (tmpList.length > 0) {
          payload.settle_phase_start = tmpList[0].phase_start;
          payload.settle_phase_end = tmpList[0].phase_end;
        }
      }

      yield put.resolve({ type: 'fetchGetReportOpts', payload: payload });

      // reducers
      yield put.resolve({ type: 'multiUpdateData' });
    },
    *fetchMultiGetCalculationPreview({ payload }, { call, put, all, select }) {
      let tmpList = [];

      // effects
      yield put.resolve({ type: 'settlePhaseList/fetchGetPhaseList', payload: { agent_eid: payload.agent_eid, type: (payload.ui_settle_phase_type) ? (payload.ui_settle_phase_type) : ('') } });

      const getPhaseList = yield select((state) => (state.settlePhaseList.phaseList));

      if (getPhaseList.length > 0) {
        tmpList = getPhaseList.filter((elem) => (elem.id == payload.ui_page_id));

        if (tmpList.length > 0) {
          payload.settle_phase_start = tmpList[0].phase_start;
          payload.settle_phase_end = tmpList[0].phase_end;
        }
      }

      yield put.resolve({ type: 'fetchGetCalculationPreview', payload: payload });

      // reducers
      yield put.resolve({ type: 'multiUpdateData' });
    },
  },
  reducers: {
    getReportList(state, action) {
      let changeId = state.changeId + 1;
      let tmpList = {};

      if (!action.payload.resError && action.payload.data) {
        tmpList = action.payload.data;
      }

      return { ...state, changeId: changeId, reportList: tmpList };
    },
    getReportOpts(state, action) {
      let changeId = state.changeId + 1;
      let tmpReportOpts = {};

      if (!action.payload.resError && action.payload.data) {
        tmpReportOpts = action.payload.data;
      }

      return { ...state, changeId: changeId, reportOpts: tmpReportOpts };
    },
    getCalculationPreview(state, action) {
      let changeId = state.changeId + 1;
      let tmpObj = {};

      if (!action.payload.resError && action.payload.data) {
        tmpObj = action.payload.data;
      }

      return { ...state, changeId: changeId, calculationPreview: tmpObj };
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
