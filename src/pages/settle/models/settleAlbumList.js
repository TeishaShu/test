import { getList, getPrepaidList, getAlbumPreview, updateAlbumPreview, deleteFiles, importInfo, calAlbum, getCalcList, importSouvInfo, calMisc, getSettleSouvenirList, getSettleRightState, rightApplyAlbumPrepaid, rightApplyReplaceSettlement, rightUnapplyAlbumPrepaid, rightUnapplyReplaceSettlement, getSettleRecoState, recoApplyReplaceSettlement, recoUnapplyReplaceSettlement, getAlbumPrepaid } from '../service/settleAlbumList';
import { message, } from 'antd';

const Model = {
  namespace: 'settleAlbumList',
  state: {
    // change -----
    changeId: 0,
    settleRightChangeId: 0,
    settleRecoChangeId: 0,
    multiChangeId: 0,
    updateDataResult: '',
    albumPrepaidChangeId: 0,
    // data -----
    // getList
    list: {},
    // getPrepaidList
    prepaidList: {},
    // getAlbumPreview
    albumPreview: {},
    // getCalc
    calcList: {},
    // get settle_souvenir list
    getSettleSouvenirList: {},
    // right
    settleRightState: [],
    ui_settleRightState: {
      state: 0,
      created_at: ''
    },
    // reco
    settleRecoState: [],
    ui_settleRecoState: {
      state: 0,
      created_at: ''
    },
    // getAlbumPrepaid
    getAlbumPrepaid: [],
  },
  effects: {
    // get -----
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(getList, payload);
      yield put({
        type: 'getList',
        payload: response,
      });
    },
    *fetchGetPrepaidList({ payload }, { call, put }) {
      const response = yield call(getPrepaidList, payload);
      yield put({
        type: 'getPrepaidList',
        payload: response,
      });
    },
    *fetchGetAlbumPreview({ payload }, { call, put }) {
      const response = yield call(getAlbumPreview, payload);
      yield put({
        type: 'getAlbumPreview',
        payload: response,
      });
    },
    *fetchGetCalcList({ payload }, { call, put }) {
      const response = yield call(getCalcList, payload);
      yield put({
        type: 'getCalcList',
        payload: response,
      });
    },
    *fetchGetSettleSouvenir({ payload }, { call, put, all, select }) {
      const response = yield call(getSettleSouvenirList, payload);
      yield put({
        type: 'getSettleSouvenirList',
        payload: response,
      })
    },
    *fetchGetSettleRightState({ payload }, { call, put }) {
      const response = yield call(getSettleRightState, payload);
      yield put({
        type: 'getSettleRightState',
        payload: response,
      })
    },
    *fetchGetSettleRecoState({ payload }, { call, put }) {
      const response = yield call(getSettleRecoState, payload);
      yield put({
        type: 'getSettleRecoState',
        payload: response,
      })
    },

    // update -----
    *fetchImportInfo({ payload, callback }, { call, put, all, select }) {
      const response = yield call(importInfo, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.settleAlbumList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchImportSouvInfo({ payload, callback }, { call, put, all, select }) {
      const response = yield call(importSouvInfo, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.settleAlbumList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchDeleteFiles({ payload, callback }, { call, put, all, select }) {
      const response = yield call(deleteFiles, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.settleAlbumList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchUpdateAlbumPreview({ payload, callback }, { call, put, all, select }) {
      const response = yield call(updateAlbumPreview, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.settleAlbumList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchCalAlbum({ payload, callback }, { call, put, all, select }) {
      const response = yield call(calAlbum, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.settleAlbumList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchCalMisc({ payload, callback }, { call, put, all, select }) {
      const response = yield call(calMisc, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.settleAlbumList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    // right
    *fetchRightApplyAlbumPrepaid({ payload }, { call, put, all, select }) {
      const response = yield call(rightApplyAlbumPrepaid, payload);
      yield put({
        type: 'rightApplyAlbumPrepaid',
        payload: response,
      });
    },
    *fetchRightApplyReplaceSettlement({ payload }, { call, put, all, select }) {
      const response = yield call(rightApplyReplaceSettlement, payload);
      yield put({
        type: 'rightApplyReplaceSettlement',
        payload: response,
      });
    },
    *fetchRightUnapplyAlbumPrepaid({ payload }, { call, put, all, select }) {
      const response = yield call(rightUnapplyAlbumPrepaid, payload);
      yield put({
        type: 'rightUnapplyAlbumPrepaid',
        payload: response,
      });
    },
    *fetchRightUnapplyReplaceSettlement({ payload }, { call, put, all, select }) {
      const response = yield call(rightUnapplyReplaceSettlement, payload);
      yield put({
        type: 'rightUnapplyReplaceSettlement',
        payload: response,
      });
    },
    // reco
    *fetchRecoApplyReplaceSettlement({ payload }, { call, put, all, select }) {
      const response = yield call(recoApplyReplaceSettlement, payload);
      yield put({
        type: 'recoApplyReplaceSettlement',
        payload: response,
      });
    },
    *fetchRecoUnapplyReplaceSettlement({ payload }, { call, put, all, select }) {
      const response = yield call(recoUnapplyReplaceSettlement, payload);
      yield put({
        type: 'recoUnapplyReplaceSettlement',
        payload: response,
      });
    },
    *fetchGetAlbumPrepaid({ payload }, { call, put, all, select }) {
      const response = yield call(getAlbumPrepaid, payload);
      yield put({
        type: 'getAlbumPrepaid',
        payload: response,
      });
    },
    // multi -----
    *fetchGetRightPhaseLists({ payload, callback }, { call, put, all, select }) {
      // effects
      const [a, b] = yield all([
        yield put({ type: 'settlePhaseList/fetchGetPhaseList', payload: payload }),
        // new media
        yield put({ type: 'settlePhaseList/fetchGetInfo', payload: { ...payload, type: '3', phase_type: 'current' } }),
      ]);

      // reducers
      yield put.resolve({ type: 'multiUpdateData' });

      const getPara = yield select((state) => (state.settlePhaseList.phaseList));
      const getParaNewMedia = yield select((state) => (state.settlePhaseList.newMediaRight));

      if (callback) {
        callback(getPara, getParaNewMedia);
      }
    },
    *fetchGetRecordPhaseLists({ payload, callback }, { call, put, all, select }) {
      // effects
      const [a, b] = yield all([
        yield put({ type: 'settlePhaseList/fetchGetPhaseList', payload: payload }),
        // new media
        yield put({ type: 'settlePhaseList/fetchGetInfo', payload: { ...payload, type: '4', phase_type: 'current' } }),
        // souvenir phase
        yield put({ type: 'settlePhaseList/fetchGetInfo', payload: { ...payload, type: '5', phase_type: 'current' } }),
      ]);

      // reducers
      yield put.resolve({ type: 'multiUpdateData' });

      const getPara = yield select((state) => (state.settlePhaseList.phaseList));
      const getParaSouv = yield select((state) => (state.settlePhaseList.souvenir));
      const getParaNewMedia = yield select((state) => (state.settlePhaseList.newMediaRecord));

      if (callback) {
        callback(getPara, getParaSouv, getParaNewMedia);
      }
    },
    *fetchMultiGetAlbumPreview({ payload }, { call, put, all, select }) {

      // effects
      const [a, b] = yield all([
        yield put({ type: 'fetchGetAlbumPreview', payload: payload }),
        yield put({ type: 'settlePhaseList/fetchGetPhaseList', payload: { agent_eid: payload.agent_eid, type: (payload.ui_settle_phase_type) ? (payload.ui_settle_phase_type) : ('') } }),
      ]);

      // reducers
      yield put.resolve({ type: 'multiUpdateData' });
    },
    *fetchGetTwoSettleSouvenirApi({ payload }, { call, put, all, select }) {
      const [a, b] = yield all([
        yield put({ type: 'settleMediaList/fetchGetPhaseList', payload: payload.fetchGetPhaseList }), // 結算期別
        yield put({ type: 'fetchGetSettleSouvenir', payload: payload.fetchGetSettleSouvenir }), // table
      ]);
    },
    *fetchMultiGetCalcList({ payload }, { call, put, all, select }) {
      // effects
      const [a, b] = yield all([
        yield put({ type: 'fetchGetCalcList', payload: payload }),
        yield put({ type: 'settlePhaseList/fetchGetPhaseList', payload: { agent_eid: payload.agent_eid, type: (payload.settle_type == 'righ') ? ('1') : ('2') } }),
      ]);

      // reducers
      yield put.resolve({ type: 'multiUpdateData' });
    },
  },
  reducers: {
    // get -----
    getList(state, action) {
      let changeId = state.changeId + 1;
      let tmpList = {};

      if (!action.payload.resError && action.payload.data) {
        tmpList = action.payload.data;
      }

      return { ...state, changeId: changeId, list: tmpList };
    },
    getPrepaidList(state, action) {
      let changeId = state.changeId + 1;
      let tmpList = {};

      if (!action.payload.resError && action.payload.data) {
        tmpList = action.payload.data;
      }

      return { ...state, changeId: changeId, prepaidList: tmpList };
    },
    getAlbumPreview(state, action) {
      let changeId = state.changeId + 1;
      let tmpPreview = {};

      if (!action.payload.resError && action.payload.data) {
        tmpPreview = action.payload.data;
      }

      return { ...state, changeId: changeId, albumPreview: tmpPreview };
    },
    getCalcList(state, action) {
      let changeId = state.changeId + 1;
      let tmpCalc = {};

      if (!action.payload.resError && action.payload.data) {
        tmpCalc = action.payload.data;
      }

      return { ...state, changeId: changeId, calcList: tmpCalc };
    },
    getSettleSouvenirList(state, action) {
      let changeId = state.changeId + 1;
      let tmpData = {};

      if (action.payload.data && action.payload.data.data_list) {
        tmpData = action.payload.data;

        // sort
        tmpData.data_list.sort((a, b) => {
          return a.settle_souvenir_sales_data_id - b.settle_souvenir_sales_data_id
        })

        // 一樣資料濾料
        // console.log('z', tmpData)
        // tmpData.forEach((item, index) => {

        // })

        // ui hide
        let hadCode = ""
        tmpData.data_list.forEach(item => {
          if (hadCode === item.souvenir_code) {
            item.ui_show = false;
          } else {
            item.ui_show = true;
            hadCode = item.souvenir_code
          }
        });

        tmpData.data_list.map((item, index) => {
          return item.ui_id = index;
        })
      }

      return { ...state, changeId: changeId, souvenirList: tmpData };
    },
    getSettleRightState(state, action) {
      let changeId = state.changeId + 1;
      let copyAry = [...action.payload.data];
      let maxState = Math.max(...copyAry.map(p => p.state));
      let maxObj = [...copyAry].filter(item => parseInt(item.state) === maxState);
      let tempAry = [];

      if (action.payload.data.length === 0) {
        maxObj[0] = {
          state: 0,
          created_at: ''
        }
        tempAry = {
          state: 0,
          created_at: ''
        }
      } else {
        maxObj[0].state = maxState;
        tempAry = copyAry.map(p => {
          return { ...p, state: parseInt(p.state) }
        })
      }

      return { ...state, changeId: changeId, settleRightState: tempAry, ui_settleRightState: maxObj[0] };
    },
    getSettleRecoState(state, action) {
      let changeId = state.changeId + 1;
      let copyAry = [...action.payload.data];
      let maxState = Math.max(...copyAry.map(p => p.state));
      let maxObj = [...copyAry].filter(item => parseInt(item.state) === maxState);
      let tempAry = [];
      if (action.payload.data.length === 0) {
        maxObj[0] = {
          state: 0,
          created_at: ''
        }
        tempAry = {
          state: 0,
          created_at: ''
        }
      } else {
        maxObj[0].state = maxState;
        tempAry = copyAry.map(p => {
          return { ...p, state: parseInt(p.state) }
        })
      }
      return { ...state, changeId: changeId, settleRecoState: tempAry, ui_settleRecoState: maxObj[0] };
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
    // right
    rightApplyAlbumPrepaid(state, action) {
      let settleRightChangeId = state.settleRightChangeId + 1;
      return { ...state, settleRightChangeId: settleRightChangeId };
    },
    rightApplyReplaceSettlement(state, action) {
      let settleRightChangeId = state.settleRightChangeId + 1;
      return { ...state, settleRightChangeId: settleRightChangeId };
    },
    rightUnapplyAlbumPrepaid(state, action) {
      let settleRightChangeId = state.settleRightChangeId + 1;
      return { ...state, settleRightChangeId: settleRightChangeId };
    },
    rightUnapplyReplaceSettlement(state, action) {
      let settleRightChangeId = state.settleRightChangeId + 1;
      return { ...state, settleRightChangeId: settleRightChangeId };
    },
    // reco
    recoApplyReplaceSettlement(state, action) {
      let settleRecoChangeId = state.settleRecoChangeId + 1;
      return { ...state, settleRecoChangeId: settleRecoChangeId };
    },
    recoUnapplyReplaceSettlement(state, action) {
      let settleRecoChangeId = state.settleRecoChangeId + 1;
      return { ...state, settleRecoChangeId: settleRecoChangeId };
    },
    getAlbumPrepaid(state, action) {
      let albumPrepaidChangeId = state.albumPrepaidChangeId + 1;
      const temAry = Object.assign([], action.payload.data);
      temAry.data.forEach((el, idx) => {
        el.ui_key = idx
      })
      return { ...state, albumPrepaidChangeId: albumPrepaidChangeId, getAlbumPrepaid: temAry };
    },
    // multi -----
    multiUpdateData(state, action) {
      let multiChangeId = state.multiChangeId + 1;

      return { ...state, multiChangeId: multiChangeId };
    },
  },
};

export default Model;