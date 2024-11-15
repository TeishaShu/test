import { message } from 'antd';
import { getList, getSouvenirType, getInfo, addSouvenirForm, editSouvenirForm } from './service';

const Model = {
  namespace: 'souvenirList',
  state: {
    // change -----
    changeId: 0,
    multiChangeId: 0,
    updateDataResult: '',
    // opt -----
    optType: [
      { label: '明星商品', value: '1' },
      { label: '書籍', value: '2' },
      { label: '電子書', value: '3' },
    ],
    // data -----
    // getList
    list: {
      total_item: 0,
      data_list: [],
    },
    info: {
      souvenir: {
        id: '',
        souvenir_code: '',
        souvenir_name: '',
        souvenir_type_id: '',
        souvenir_price: '',
        souvenir_launch_day: '',
      },
      souvenir_split_ratio: {
        data: [],
      },
    },
  },
  effects: {
    // get -----
    // getList
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(getList, payload);

      yield put({
        type: 'getList',
        payload: response,
      });
    },
    *fetchGetSouvenirType({ payload }, { call, put }) {
      const response = yield call(getSouvenirType, payload);

      yield put({
        type: 'getSouvenirType',
        payload: response,
      });
    },
    *fetchGetInfo({ payload }, { call, put }) {
      const response = yield call(getInfo, payload);

      yield put({
        type: 'getInfo',
        payload: response,
      });
    },
    // update -----
    *fetchAddSouvenirForm({ payload, callback }, { call, put, select }) {
      const response = yield call(addSouvenirForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.souvenirList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchEditSouvenirForm({ payload, callback }, { call, put, select }) {
      const response = yield call(editSouvenirForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.souvenirList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
  },
  reducers: {
    // getList
    getList(state, action) {
      let changeId = state.changeId + 1;
      let tmpData = {
        total_item: 0,
        data_list: [],
      };

      if (action.payload.data && action.payload.data.data_list) {
        tmpData.total_item = action.payload.data.total_item;

        for (let i = 0; i < action.payload.data.data_list.length; i++) {
          let item = action.payload.data.data_list[i];

          if (item.souvenir_split_ratio.length > 0) {
            for (let j = 0; j < item.souvenir_split_ratio.length; j++) {
              let splitItem = item.souvenir_split_ratio[j];

              if (j == 0) {
                tmpData.data_list.push({ ...item, ui_idx: i, uiParent: true, contract_code: splitItem.contract_code, author_code: splitItem.author_code, stage_name: splitItem.stage_name });
              } else {
                tmpData.data_list.push({ ...splitItem, ui_idx: `${i}_${j}` });
              }
            }
          } else {
            tmpData.data_list.push({ ...item, ui_idx: i, uiParent: true });
          }
        }
      }

      return { ...state, changeId: changeId, list: tmpData };
    },
    getSouvenirType(state, action) {
      let changeId = state.changeId + 1;
      let newOpt = [];

      if (!action.payload.resError && action.payload.data.souvenir_type) {
        newOpt = action.payload.data.souvenir_type.map((elem, idx, arr) => {
          return { label: elem.name, value: elem.id };
        });
      }

      return { ...state, changeId: changeId, optType: newOpt };
    },
    getInfo(state, action) {
      let changeId = state.changeId + 1;
      let newInfo = {};

      if (!action.payload.resError) {
        newInfo = action.payload.data;
      }

      return { ...state, changeId: changeId, info: newInfo };
    },
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