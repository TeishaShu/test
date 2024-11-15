import {
  getAutoCompleteByAuthorId,
  getContractGroupList,
  addForm,
  getList,
  getInfo,
  editForm,
  postDeleteData,
  postExtendData,
  copyContract,
  deleteContractGroup,
  updateFile,
  deleteFile,
  getTransferData,
  getRightSong,
  postTransferContract,
  postExpireContract,
  getPrepaid,
  addPrepaidForm,
  editPrepaidForm,
  deletePrepaid,
} from './service';

const Model = {
  namespace: 'contractSongList',
  state: {
    // change -----
    changeId: 0,
    multiChangeId: 0,
    removeDataResult: '',
    updateDataResult: '',
    // data -----
    // getAutoCompleteByAuthorId
    autoCompleteByAuthorId: [],
    // getList
    list: {
      total_items: 0,
      data_list: [],
    },
    // edit, update
    info: {
      agency_renew: '',
      agency_year: '',
      authorized_area: [],
      authorized_area_id: '',
      authorized_area_name: '',
      authorized_area_type: '',
      commission: [],
      contract_agency_end: '',
      contract_code: '',
      contract_end_date: '',
      contract_expiry_date: '',
      contract_group: [],
      contract_group_name: '',
      contract_signing_date: '',
      contract_start_date: '',
      contract_termination_date: '',
      created_at: '',
      created_by: '',
      currency_id: '',
      currency_name: '',
      early_terminate_date: '',
      eid: '',
      file: [],
      id: '',
      is_early_terminate: '',
      is_effective: '',
      is_permanent: '',
      is_transfer: '',
      notes: '',
      op: {
        id: '',
        company_code: '',
        name: '',
        nickname: '',
      },
      party_a_company: {
        id: '',
        company_code: '',
        name: '',
        tax_id_number: '',
        nickname: '',
      },
      party_b_company: {
        id: '',
        company_code: '',
        name: '',
        tax_id_number: '',
        nickname: '',
      },
      party_b_object: [
        {
          party_b_object_id: '',
          author_id: '',
          author_code: '',
          name: '',
          is_delete: ''
        }
      ],
      prepaid: [],
      renewal_period: '',
      sp: {
        id: '',
        company_code: '',
        name: '',
        nickname: '',
      },
      transfer_group: '',
      transfrom_id: '',
      transfer_history: '',
      updated_at: '',
      updated_by: '',
    },
    optInsurance: [
      { label: '是', value: '1' },
      { label: '否', value: '0' },
    ],
    optInsurance2: [
      { label: '無', value: '0' },
      { label: '有', value: '1' },
    ],
    optype: [
      { label: '選擇自訂範圍', value: '0' },
    ],
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
    rightSongs: {},
    contractGroupList: [],
    transferList: [],
    // getPrepaid
    prepaid: {
      total_items: '0',
      data_list: []
    },
    // prepaidForm -----
    // prepaidFormTmpSong
    prepaidFormTmpSong: [],
  },
  effects: {
    // getAutoCompleteByAuthorId
    *fetchGetAutoCompleteByAuthorId({ payload, callback }, { call, put, select }) {
      const response = yield call(getAutoCompleteByAuthorId, payload);

      yield put.resolve({
        type: 'getAutoCompleteByAuthorId',
        payload: response,
      });

      const getPara = yield select((state) => (state.contractSongList.autoCompleteByAuthorId));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchContractGroupList({ payload }, { call, put }) {
      const response = yield call(getContractGroupList, payload);
      yield put({
        type: 'getContractGroupList',
        payload: response,
      });
    },
    // update
    *fetchAddForm({ payload, callback }, { call, put }) {
      const response = yield call(addForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      callback(response);
    },
    // get -----
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
    *fetchEditForm({ payload, callback }, { call, put }) {
      const response = yield call(editForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      callback(response);
    },
    *deleteContract({ payload, callback }, { call }) {
      const response = yield call(postDeleteData, payload);
      callback(response);
    },
    *renewContract({ payload, callback }, { call }) {
      const response = yield call(postExtendData, payload);
      callback(response);
    },
    *fetchMultiGetAutocomplete({ payload }, { put, all }) {
      if (payload) {
        yield all([
          yield put({ type: 'authorizedCountryList/fetchGetAuthorizedCountry', payload: payload.country }),
          yield put({ type: 'authorizedAreaList/fetchGetList', payload: payload.area }),
        ]);
      }
      yield all([
        yield put({ type: 'authorizedCountryList/fetchGetAuthorizedCountry', payload: { search: 'all' } }),
        yield put({ type: 'authorizedAreaList/fetchGetList', payload: { search: 'all' } }),
      ]);

      yield put.resolve({ type: 'multiGetInfo' });
    },
    *contractCopy({ payload, callback }, { call }) {
      const response = yield call(copyContract, payload);
      callback(response);
    },
    *delContractGroup({ payload, callback }, { call }) {
      const response = yield call(deleteContractGroup, payload);
      callback(response);
    },
    *updateFile({ payload, callback }, { call }) {
      const response = yield call(updateFile, payload);
      callback(response);
    },
    *fetchDeleteFile({ payload, callback }, { call }) {
      const response = yield call(deleteFile, payload);
      callback(response);
    },
    *fetchRightSong({ payload }, { call, put }) {
      const response = yield call(getRightSong, payload);
      yield put({
        type: 'getRightSong',
        payload: response,
      });
    },
    *fetchGetTransferData({ payload }, { call, put }) {
      const response = yield call(getTransferData, payload);

      yield put({
        type: 'getTransfer',
        payload: response,
      });
    },
    *fetchTransferContract({ payload, callback }, { call }) {
      const response = yield call(postTransferContract, payload);
      callback(response);
    },
    *fetchExpireContract({ payload, callback }, { call }) {
      const response = yield call(postExpireContract, payload);
      callback(response);
    },
    // prepaid
    *fetchGetPrepaid({ payload, callback }, { call, put, select }) {
      const response = yield call(getPrepaid, payload);

      yield put({
        type: 'getPrepaid',
        payload: response,
      });

      const getPara = yield select((state) => (state.contractAuthorList.prepaid));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchAddPrepaidForm({ payload, callback }, { call, put, select }) {
      const response = yield call(addPrepaidForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.contractSongList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchEditPrepaidForm({ payload, callback }, { call, put, select }) {
      const response = yield call(editPrepaidForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.contractSongList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchDeletePrepaid({ payload, callback }, { call, put, select }) {
      const response = yield call(deletePrepaid, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.contractSongList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchMultiGetPrepaidInfo({ payload }, { call, put, all, select }) {
      // effects
      const [a, b] = yield all([
        yield put({ type: 'fetchGetInfo', payload: { id: payload.contract_song_id } }),
        ((payload.isEdit) ? yield put({ type: 'fetchGetPrepaid', payload: { contract_song_id: payload.contract_song_id } }) : (null)),
      ]);

      // reducers
      yield put.resolve({ type: 'multiGetPrepaidInfo' });
    },
  },
  reducers: {
    // get -----
    // getAutoCompleteByAuthorId
    getAutoCompleteByAuthorId(state, action) {
      let changeId = state.changeId + 1;
      let result = action.payload.data;

      if (action.payload.resError) {
        result = [];
      }

      return { ...state, changeId, autoCompleteByAuthorId: result };
    },
    getContractGroupList(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId, contractGroupList: action.payload.data };
    },
    updateData(state, action) {
      let updateDataResult = 'error';

      if (!action.payload.resError) {
        if (action.payload.data && action.payload.data.id) {
          updateDataResult = action.payload.data.id;
        } else {
          updateDataResult = 'ok';
        }
      }

      return { ...state, updateDataResult };
    },
    getList(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId, list: action.payload.data };
    },
    getInfo(state, action) {
      let changeId = state.changeId + 1;
      if (action.payload.data && action.payload.data.commission) {
        for (let i = 0; i < action.payload.data.commission.length; i += 1) {
          action.payload.data.commission[i].percentage.sort(
            (a) => (parseInt(a.authorized_country_id, 10) === 0) ? -1 : 0,
          ).sort(
            (a) => (parseInt(a.authorized_country_id, 10) === 229) ? -1 : 0,
          );
        }
      }
      return {
        ...state,
        changeId,
        info: action.payload.data,
      };
    },
    getTransfer(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId, transferList: action.payload.data };
    },
    getRightSong(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId, rightSongs: action.payload.data };
    },
    getPrepaid(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId, prepaid: action.payload.data, };
    },
    multiGetInfo(state) {
      const multiChangeId = state.multiChangeId + 1;

      return { ...state, multiChangeId, removeDataResult: '', updateDataResult: '' };
    },
    // multi - getPrepaidInfo
    multiGetPrepaidInfo(state, action) {
      let multiChangeId = state.multiChangeId + 1;

      return { ...state, multiChangeId: multiChangeId, removeDataResult: '', updateDataResult: '' };
    },
    // prepaidFormTmpSong -----
    setPrepaidFormTmpSong(state, action) {
      let tmpState = { ...state };

      if (action.payload) {
        tmpState.prepaidFormTmpSong.push({ ...action.payload });
      } else {
        tmpState.prepaidFormTmpSong = [];
      }

      return tmpState;
    },
  },
};

export default Model;
