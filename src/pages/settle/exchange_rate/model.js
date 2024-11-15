import { getList, getAppleList, addExchangeRate, patchExchangeRate, getAppleNotImportList, getLatestMonth, } from './service';
import { message, } from 'antd';

const Model = {
  namespace: 'exchangeRateList',
  state: {
    // change -----
    changeId: 0,
    multiChangeId: 0,
    removeDataResult: '',
    updateDataResult: '',
    // data -----
    // getLis
    list: [],
    appleNotImportList: "",
    // edit, update
    info: {},
    role: [],
    optCurrency: [
      { label: '台幣 / TWD', value: '1' },
      { label: '澳幣 / AUD', value: '10' },
      { label: '人民幣 / CNY', value: '2' },
      { label: '歐元 / EUR', value: '11' },
      { label: '港幣 / HKD', value: '3' },
      { label: '印尼幣 / IDR', value: '9' },
      { label: '日圓 / JPY', value: '6' },
      { label: '韓元 / KRW', value: '8' },
      { label: '馬來幣 / MYR', value: '7' },
      { label: '新加坡幣 / SGD', value: '5' },
      { label: '英鎊 / GBP', value: '12' },
      { label: '美金 / USD', value: '4' },
    ],
    // latest_month
    latest_month: "",
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
    *fetchGetAppleList({ payload }, { call, put }) {
      const response = yield call(getAppleList, payload);

      yield put({
        type: 'getList',
        payload: response,
      });
    },
    *fetchGetAppleNotImportList({ payload }, { call, put }) {
      const response = yield call(getAppleNotImportList, payload);

      yield put({
        type: 'getAppleNotImportList',
        payload: response,
      });
    },
    *fetchGetLatestMonth({ payload, callback }, { call, put, select }) {
      const response = yield call(getLatestMonth, payload);

      yield put({
        type: 'getLatestMonth',
        payload: response,
      });

      const getPara = yield select((state) => (state.exchangeRateList.latest_month));
      if (callback) {
        callback(getPara);
      }
    },
    *fetchAddExchangeRate({ payload, callback }, { call, put, all, select }) {
      const response = yield call(addExchangeRate, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.exchangeRateList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchPatchExchangeRate({ payload, callback }, { call, put, all, select }) {
      const response = yield call(patchExchangeRate, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.exchangeRateList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
  },
  reducers: {
    // get -----
    getList(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, list: action.payload.data };
    },
    getAppleNotImportList(state, action) {
      let changeId = state.changeId + 1;
      let not_import_list = [];
      let newList = [];

      if (action.payload.data && action.payload.data.not_import_list) {
        // ary，yyyyMM
        not_import_list = action.payload.data.not_import_list;

        // ary，改格式=> yyyy_MM
        newList = not_import_list.map(item => {
          const splitItem = item.split('');
          splitItem.splice(4, 0, "_")
          return splitItem.join('')
        })

      }
      return { ...state, changeId: changeId, appleNotImportList: newList };
    },
    getLatestMonth(state, action) {
      let updateData = 'error';
      let changeId = state.changeId + 1;

      if (!action.payload.resError) {
        updateData = action.payload.data;
      }

      return { ...state, changeId: changeId, latest_month: updateData };
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
