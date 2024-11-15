import { message } from 'antd';
import { getNameAutoComplete, getAutoComplete, getList, getInfo, removeData, addData, editData, editReplaceSettlement, } from './service';
import { history } from 'umi';
const Model = {
  namespace: 'companyList',
  state: {
    // change -----
    changeId: 0,
    multiChangeId: 0,
    removeDataResult: '',
    updateDataResult: '',
    updateDataReplaceSettlement: '',
    // opt -----
    optType: [
      { label: '版權公司', value: '1' },
      { label: '唱片公司', value: '2' },
      { label: '新媒體公司', value: '3' },
      { label: '製作公司', value: '4' },
      { label: '其他', value: '5' },
    ],
    // data -----
    // getNameAutoComplete (name)
    nameAutoComplete: [],
    // getAutoComplete (nickname)
    autoComplete: [],
    // getList
    list: {
      total_items: 0,
      data_list: [],
    },
    // getInfo
    info: {
      id: '',
      created_by: '',
      created_at: '',
      updated_at: '',
      type: [],
      is_internal: '',
      company_code: '',
      tax_id_number: '',
      name: '',
      name_zh: '',
      name_en: '',
      admin: '',
      is_agent: '0',
      nickname: [],
      payment_rate: '0',
      address_zh: '',
      address_en: '',
      zip: '',
      tel: '',
      fax: '',
      web: '',
      email: '',
      contact: [],
      notes: '',
      replace_settle: [],
    },
    ui_replace_settle_right: [],
    ui_replace_settle_record: [],
    ui_author_code_record: [],
    ui_author_code_right: [],
    ui_options_author: [],
  },
  effects: {
    // get -----
    // getNameAutoComplete
    *fetchGetNameAutoComplete({ payload }, { call, put }) {
      const response = yield call(getNameAutoComplete, payload);

      yield put({
        type: 'getNameAutoComplete',
        payload: response,
      });
    },
    // getAutoComplete
    *fetchGetAutoComplete({ payload }, { call, put }) {
      const response = yield call(getAutoComplete, payload);

      yield put({
        type: 'getAutoComplete',
        payload: response,
      });
    },
    // getList
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(getList, payload);

      yield put({
        type: 'getList',
        payload: response,
      });
    },
    // getInfo
    *fetchGetInfo({ payload }, { call, put }) {
      const response = yield call(getInfo, payload);
      yield put({
        type: 'getInfo',
        payload: response,
      });
    },
    // update -----
    *fetchRemoveData({ payload, callback }, { call, put, select }) {
      const response = yield call(removeData, payload);

      yield put.resolve({
        type: 'removeData',
        payload: response,
      });

      const getPara = yield select((state) => (state.companyList.removeDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchAddForm({ payload, callback }, { call, put, select }) {
      const response = yield call(addData, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.companyList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchEditForm({ payload, callback }, { call, put, select }) {
      const response = yield call(editData, payload);

      yield put({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.companyList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchEditReplaceSettlement({ payload, callback }, { call, put, select }) {
      const response = yield call(editReplaceSettlement, payload);

      yield put({
        type: 'updateReplaceSettlement',
        payload: {
          response: response,
          match: payload.id,
          status: payload.status
        },
      });
    },
    // multi -----
    // multi - getInfo
    *fetchMultiGetInfo({ payload }, { call, put, all, select }) {
      // effects
      const [a] = yield all([
        yield put({ type: 'fetchGetInfo', payload: { id: payload.id } }),
      ]);

      // createdUserId, updatedUserId
      const getUserPara = yield select((state) => (state.companyList.info));

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
  },
  reducers: {
    // get -----
    // getNameAutoComplete
    getNameAutoComplete(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, nameAutoComplete: action.payload.data };
    },
    // getAutoComplete
    getAutoComplete(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, autoComplete: action.payload.data };
    },
    // getList
    getList(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, list: action.payload.data };
    },
    // getInfo
    getInfo(state, action) {
      let changeId = state.changeId + 1;
      const originAry = { ...action.payload.data };

      if ((originAry && originAry.replace_settle) && (originAry.id !== "")) {
        const right = [];
        const record = [];

        originAry.replace_settle.forEach(element => {
          // no_commission 轉換成 boolean
          const status = !!Number(element.no_commission);
          element.no_commission = status;

          // 分類
          if (element.type === '1') {
            right.push(element)
          } else if (element.type === '2') {
            record.push(element)
          }
        });

        return { ...state, changeId: changeId, info: { ...originAry, ui_replace_settle_right: right, ui_replace_settle_record: record }, };
      }
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
    updateReplaceSettlement(state, action) {
      let updateDataReplaceSettlement = 'error';
      const id = action.payload.match;
      const status = action.payload.status;

      if (action.payload.response && action.payload.response.data) {
        updateDataReplaceSettlement = action.payload.response.data;
        if (status === 'edit') {
          message.success(action.payload.response.data)
        } else if (status === 'delete') {
          message.success('刪除成功')
        }
        history.push(`/information/company/adv/${id}/info`);
      }

      return { ...state, updateDataReplaceSettlement: updateDataReplaceSettlement };
    },
    // multi -----
    // multi - get info
    multiGetInfo(state, action) {
      let multiChangeId = state.multiChangeId + 1;

      return { ...state, multiChangeId: multiChangeId };
    },
  },
};

export default Model;