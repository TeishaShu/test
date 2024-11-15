import { getList, getInfo, addMiscForm, editMiscForm, removeData, updateSettlePhase, getSettleView, } from './service';
import { message } from 'antd';
import commFn from '@/fn/comm';

const Model = {
  namespace: 'miscList',
  state: {
    // change -----
    changeId: 0,
    multiChangeId: 0,
    removeDataResult: '',
    updateDataResult: '',
    // opt -----
    optType: [
      { value: '1', label: '歌曲' },
      { value: '2', label: 'pack' },
    ],
    optDistributionFormat: [
      { value: '1', label: '實體' },
      { value: '2', label: '數位' },
    ],
    // data -----
    // getList
    list: {
      total_cnt: 0,
      data_list: [],
    },
    // getInfo
    info: {},
    // settleView
    settleView: {},
    // getLyricsStatistics
    lyricsStatistics: {
      total_cnt: 0,
      total_before_tax: 0,
      total_actually_paid: 0,
      total_diff: 0,
      data_list: []
    },
    // getRecordStatistics
    recordStatistics: {
      total_cnt: 0,
      total_before_tax: 0,
      total_actually_paid: 0,
      total_diff: 0,
      data_list: []
    },
    // miscFormTmpContent
    miscFormTmpContent: [],
    miscFormTmpSubmit: {},
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
    // GetInfo
    *fetchGetInfo({ payload, callback }, { call, put, select }) {
      const response = yield call(getInfo, payload);

      yield put({
        type: 'getInfo',
        payload: response,
      });

      const getPara = yield select((state) => (state.miscList.info));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchGetSettleView({ payload, callback }, { call, put, select }) {
      const response = yield call(getSettleView, payload);

      yield put({
        type: 'getSettleView',
        payload: response,
      });
    },
    *fetchGetLyricsStatistics({ payload, callback }, { call, put, select }) {
      const response = yield call(getLyricsStatistics, payload);

      yield put({
        type: 'getLyricsStatistics',
        payload: response,
      });
    },
    *fetchGetRecordStatistics({ payload, callback }, { call, put, select }) {
      const response = yield call(getRecordStatistics, payload);

      yield put({
        type: 'getRecordStatistics',
        payload: response,
      });
    },
    // update -----
    *fecthAddMiscForm({ payload, callback }, { call, put, select }) {
      const response = yield call(addMiscForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.miscList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fecthEditMiscForm({ payload, callback }, { call, put, select }) {
      const response = yield call(editMiscForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.miscList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchRemoveData({ payload, callback }, { call, put, select }) {
      const response = yield call(removeData, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.miscList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fecthUpdateSettlePhase({ payload, callback }, { call, put, select }) {
      const response = yield call(updateSettlePhase, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.miscList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    // multi -----
    *fetchMultiGetInfo({ payload }, { call, put, all, select }) {
      // effects
      const [a, b, c, d, e, f, g, h] = yield all([
        yield put({ type: 'authorizedCountryList/fetchGetAuthorizedCountry', payload: { search: 'all' } }),
        yield put({ type: 'authorizedAreaList/fetchGetList', payload: { search: 'all' } }),
        (payload.cm_id) ? yield put({ type: 'fetchGetInfo', payload: payload }) : null,
        yield put({ type: 'settlePhaseList/fetchGetInfo', payload: { type: '1', phase_type: 'current' } }),
        yield put({ type: 'settlePhaseList/fetchGetInfo', payload: { type: '1', phase_type: 'next' } }),
        yield put({ type: 'settlePhaseList/fetchGetInfo', payload: { type: '2', phase_type: 'current' } }),
        yield put({ type: 'settlePhaseList/fetchGetInfo', payload: { type: '2', phase_type: 'next' } }),
        yield put({ type: 'useTypeList/fetchGetAllList' }),
      ]);

      // createdUserId, updatedUserId
      const getUserPara = yield select((state) => (state.miscList.info));

      // effects
      const [i, j, k, l] = yield all([
        (getUserPara.created_by)
          ? (yield put({ type: 'authList/fetchGetCreatedUser', payload: { user_id: getUserPara.created_by } }))
          : (yield put({ type: 'authList/getCreatedUser', payload: { data: {} } })),
        (getUserPara.updated_by)
          ? (yield put({ type: 'authList/fetchGetUpdatedUser', payload: { user_id: getUserPara.updated_by } }))
          : (yield put({ type: 'authList/getUpdatedUser', payload: { data: {} } })),
        (!payload.cm_id) ? yield put({ type: 'setMiscFormTmpContent', payload: null }) : null,
        yield put({ type: 'setMiscFormTmpSubmit', payload: null }),
      ]);

      // reducers
      yield put.resolve({ type: 'multiUpdateData' });
    },
    // only for form -----
    *fetchCheckFormValid({ payload, callback }, { call, put, select }) {
      const getTmpeContent = yield select((state) => (state.miscList.miscFormTmpContent));
      const getFormPara = yield select((state) => (state.miscList.miscFormTmpSubmit));
      let tmpObj = { ...getFormPara.info, content: [] };
      let errList = [];
      let fetchData;
      let result = 'error';

      for (let i = 0; i < getTmpeContent.length; i++) {
        let contentItem = getFormPara[`content_${i}`];

        if (contentItem['ui_ok']) {
          if (contentItem.ui_sold_date_hint) {
            errList.push(`${i + 1} 號授權內容 - 銷售日期更動，請按重新整理更新資料<br/>`);
          }
        } else {
          contentItem.forEach((elem, idx) => {
            if (!elem.is_delete || elem.is_delete == '0') {
              if (elem.ui_sold_date_hint) {
                errList.push(`${i + 1} 號授權內容 - 銷售日期更動，請按重新整理更新資料<br/>`);
              }
              if (!elem.name) {
                errList.push(`${i + 1} 號授權內容 - 產品名稱為必填<br/>`);
              }
              if (!elem.use_type_id) {
                errList.push(`${i + 1} 號授權內容 - 使用方式為必填<br/>`);
              }
              if (elem.type == '1' && !elem.song_id) {
                errList.push(`${i + 1} 號授權內容 - 歌曲名稱為必填<br/>`);
              }
              if (elem.type == '1' && !elem.distribution_format) {
                errList.push(`${i + 1} 號授權內容 - 權利型態為必填<br/>`);
              }
            }

            if (elem.is_new == '1' && elem.is_delete == '1') {
              // console.log('del');
            } else {
              tmpObj.content.push({ ...elem });
            }
          });
        }
      }

      if (errList.length > 0) {
        result = { errValid: errList.join('') };
      } else {
        // 新增, 編輯
        fetchData = yield put.resolve({ type: (tmpObj.id) ? ('fecthEditMiscForm') : ('fecthAddMiscForm'), payload: tmpObj });

        result = yield select((state) => (state.miscList.updateDataResult));
      }

      if (callback) {
        callback(result);
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
    // getInfo
    getInfo(state, action) {
      let changeId = state.changeId + 1;
      let returnInfo = {};

      if (action.payload.data && action.payload.data.data_list) {
        returnInfo = action.payload.data.data_list;
      }

      return { ...state, changeId: changeId, info: returnInfo, miscFormTmpContent: (returnInfo.content) ? (returnInfo.content) : [] };
    },
    // getSettleView
    getSettleView(state, action) {
      const data = action.payload.data;
      let changeId = state.changeId + 1;
      let newInfo = {}
      let temp = {
        other_type: "",
        total: 0,
        product_code: ""
      };

      // 防呆
      if (data && data.data_list) {
        // 版稅收入，同類的在最後一起統計
        data.data_list.data.forEach((item, index, ary) => {
          const nowPrice = Number(item.num);
          if ((temp.other_type === item.other_type) && (temp.product_code === item.product_code)) { // 相同 other_type 和 商品編號
            temp.total += nowPrice;
            item.total = temp.total;
            data.data_list.data[index - 1].total = 0;
          } else {
            temp.other_type = item.other_type;
            temp.product_code = item.product_code;
            temp.total = nowPrice;
            item.total = nowPrice;
          }
        })

        // 增加 ui_id
        newInfo = { ...data.data_list, data: data.data_list.data.map((el, idx) => ({ ...el, ui_id: idx })) }
      }

      return { ...state, changeId: changeId, settleView: newInfo }
    },
    getLyricsStatistics(state, action) {
      let changeId = state.changeId + 1;
      let tmpLyrics = {};

      if (action.payload.data && action.payload.data) {
        tmpLyrics = action.payload.data;
      }

      return { ...state, changeId: changeId, lyricsStatistics: tmpLyrics };
    },
    getRecordStatistics(state, action) {
      let changeId = state.changeId + 1;
      let tmpRecord = {};

      if (action.payload.data && action.payload.data) {
        tmpRecord = action.payload.data;
      }

      return { ...state, changeId: changeId, recordStatistics: tmpRecord };
    },
    // update -----
    updateData(state, action) {
      let updateDataResult = 'error';

      if (!action.payload.resError) {
        if (action.payload.data && action.payload.data.contract_misc_id) {
          updateDataResult = action.payload.data.contract_misc_id;
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
    // only for form -----
    setMiscFormTmpContent(state, action) {
      let tmpState = { ...state };

      if (action.payload) {
        tmpState.miscFormTmpContent.push({ ...action.payload });
      } else {
        tmpState.miscFormTmpContent = [];
      }

      return tmpState;
    },
    setMiscFormTmpSubmit(state, action) {
      let tmpState = { ...state };

      if (action.payload) {
        if (action.payload.key == 'info') {
          tmpState.miscFormTmpSubmit = {};
        }
        tmpState.miscFormTmpSubmit[action.payload.key] = action.payload.value;
      } else {
        tmpState.miscFormTmpSubmit = {};
      }

      return tmpState;
    },
  },
};

export default Model;