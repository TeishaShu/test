import { message } from 'antd';
import { getAutoComplete, getAutoCompleteAuthorName, getAutoCompleteStageName, getList, getInfo, removeData, addForm, editForm } from './service';

const Model = {
  namespace: 'authorList',
  state: {
    // change -----
    changeId: 0,
    multiChangeId: 0,
    removeDataResult: '',
    updateDataResult: '',
    // opt -----
    optRole: [
      { label: '藝人', value: '1' },
      { label: '作者', value: '2' },
    ],
    optType: [
      { label: '個人', value: '1' },
      { label: '團體', value: '2' },
      { label: '其他', value: '3' },
    ],
    optPaymentRate: [
      { label: '0%', value: '0' },
      { label: '5%', value: '5' },
      { label: '10%', value: '10' },
      { label: '20%', value: '20' },
      { label: '-10%', value: '-10' },
      { label: '-20%', value: '-20' },
    ],
    optInsurance: [
      { label: '是', value: '1' },
      { label: '否', value: '0' },
    ],
    // data -----
    // autoComplete
    autoComplete: [], // pen_name
    autoCompleteAuthorName: [],
    autoCompleteStageName: [],
    // getList
    list: {
      total_items: 0,
      data_list: [],
    },
    // edit, update
    info: {
      id: '',
      created_by: '',
      created_at: '',
      updated_at: '',
      type: '',
      role: [],
      author_code: '',
      name: '',
      stage_name: [],
      pen_name: [],
      members: [],
      nationality: '',
      id_number: '',
      payment_rate: '',
      overpay: '',
      account_company: '',
      insurance: '0',
      residence_add: '',
      mailing_add: '',
      mobile: '',
      home_phone: '',
      company_phone: '',
      fax: '',
      email: '',
      notes: '',
    },
  },
  effects: {
    // get
    *fetchGetAutoComplete({ payload }, { call, put }) {
      const response = yield call(getAutoComplete, payload);

      yield put({
        type: 'getAutoComplete',
        payload: response,
      });
    },
    *fetchGetAutoCompleteAuthorName({ payload }, { call, put }) {
      const response = yield call(getAutoCompleteAuthorName, payload);

      yield put({
        type: 'getAutoCompleteAuthorName',
        payload: response,
      });
    },
    *fetchGetAutoCompleteStageName({ payload }, { call, put }) {
      const response = yield call(getAutoCompleteAuthorName, payload);

      yield put({
        type: 'getAutoCompleteStageName',
        payload: response,
      });
    },
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(getList, payload);

      yield put({
        type: 'getList',
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
    // remove
    *fetchRemoveData({ payload, callback }, { call, put, select }) {
      const response = yield call(removeData, payload);

      yield put.resolve({
        type: 'removeData',
        payload: response,
      });

      const getPara = yield select((state) => (state.authorList.removeDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    // update
    *fetchAddForm({ payload, callback }, { call, put, select }) {
      const response = yield call(addForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.authorList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchEditForm({ payload, callback }, { call, put, select }) {
      const response = yield call(editForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.authorList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    // multi -----
    // multi - getInfo (url: /information/author/adv/:id/(info, isrc, contract_author, contract_song, compose_song))
    *fetchMultiGetInfo({ payload }, { call, put, all, select }) {
      // effects
      const [a, b, c] = yield all([
        yield put({ type: 'reportSettingList/fetchGetIncomeTaxOverList' }),
        yield put({ type: 'fetchGetInfo', payload: { id: payload.id } }),
        (payload.tab == 'info') ? (yield put({ type: 'authorizedCountryList/fetchGetAuthorizedCountry', payload: { search: 'all' } })) : (null)
      ]);

      // createdUserId, updatedUserId
      const getUserPara = yield select((state) => (state.authorList.info));

      // effects
      const [d, e] = yield all([
        (getUserPara.created_by)
          ? (yield put({ type: 'authList/fetchGetCreatedUser', payload: { user_id: getUserPara.created_by } }))
          : (yield put({ type: 'authList/getCreatedUser', payload: { data: {} } })),
        (getUserPara.updated_by)
          ? (yield put({ type: 'authList/fetchGetUpdatedUser', payload: { user_id: getUserPara.updated_by } }))
          : (yield put({ type: 'authList/getUpdatedUser', payload: { data: {} } })),
      ]);

      // reducers
      yield put.resolve({ type: 'multiGetInfo' });
    },
    // multi - get form info (url: /information/author/update, /information/author/update/:id)
    *fetchMultiGetFormInfo({ payload }, { call, put, all, select }) {
      // effects
      const [a, b, c] = yield all([
        yield put({ type: 'reportSettingList/fetchGetIncomeTaxOverList' }),
        yield put({ type: 'authorizedCountryList/fetchGetAuthorizedCountry', payload: { search: 'all' } }),
        (payload.id) ? (yield put({ type: 'fetchGetInfo', payload: { id: payload.id } })) : (null),
      ]);

      // reducers
      yield put.resolve({ type: 'multiGetFormInfo' });
    },
  },
  reducers: {
    // get -----
    getAutoComplete(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, autoComplete: action.payload.data };
    },
    getAutoCompleteAuthorName(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, autoCompleteAuthorName: action.payload.data };
    },
    getAutoCompleteStageName(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, autoCompleteStageName: action.payload.data };
    },
    getList(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, list: action.payload.data };
    },
    getInfo(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, info: action.payload.data };
    },
    // update -----
    removeData(state, action) {
      let removeDataResult = 'error';

      if (!action.payload.resError) {
        removeDataResult = 'ok';
        message.success('儲存成功');
      }

      return { ...state, removeDataResult: removeDataResult };
    },
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
    // multi - get info
    multiGetInfo(state, action) {
      let multiChangeId = state.multiChangeId + 1;

      return { ...state, multiChangeId: multiChangeId };
    },
    // multi - get form info
    multiGetFormInfo(state, action) {
      let multiChangeId = state.multiChangeId + 1;

      return { ...state, multiChangeId: multiChangeId };
    },
  },
};

export default Model;
