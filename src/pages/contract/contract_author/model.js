import { message } from 'antd';
import { getList, getInfo, contractRenewal, addSubcontract, deleteSubcontract, addContractAuthorForm, editContractAuthorForm, exitContractGroup, removeContract, copyContract, getSpecifiedAlbum, editSpecifiedAlbumForm, getSpecifiedSong, editSpecifiedSongForm, getPrepaid, addPrepaidForm, editPrepaidForm, deletePrepaid } from './service';

const Model = {
  namespace: 'contractAuthorList',
  state: {
    // change -----
    changeId: 0,
    multiChangeId: 0,
    removeDataResult: '',
    updateDataResult: '',
    // opt -----
    optType: [
      { label: '經紀', value: '1' },
      { label: '歌手', value: '2' },
      { label: '單歌', value: '3' },
      { label: '代理發行', value: '4' },
      { label: '代理經銷', value: '5' },
    ],
    // data -----
    // getList
    list: {
      total_items: 0,
      data_list: [],
      ui_group_list: [],  // only for ui
    },
    // getInfo
    info: {
      basic_info: {
        id: '',
        contract_code: '',
        party_b_company: '',
        party_b_object_company: '',
        party_b_object_author: '',
        contract_start_date: '',
        contract_end_date: '',
        contract_expiry_date: '',
        renewal_period: '',
        next_contract: '',
        party_a_company: '',
        contract_group_name: '',
        contract_signing_date: '',
        contract_termination_date: '',
        rights_end_date: '',
        rights_termination_date: '',
        is_permanent: '',
        is_buyout: '',
        published_album_quantity: '',
        authorized_area_type: '',
        authorized_area_id: '',
        currency_id: '',
        notes: '',
        eid: '',
        created_by: '',
        created_at: '',
        updated_by: '',
        updated_at: '',
        file_name: '',
      },
      contract_author_types: [],
      authorized_countries: [],
      media_owners: [],
      split_information: [],
    },
    // getSpecifiedAlbum
    specifiedAlbum: {
      total_items: '0',
      data_list: []
    },
    // getSpecifiedSong
    specifiedSong: {
      total_items: '0',
      data_list: []
    },
    // getPrepaid
    prepaid: {
      total_items: '0',
      data_list: []
    }
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
    *fetchGetInfo({ payload }, { call, put }) {
      const response = yield call(getInfo, payload);

      yield put({
        type: 'getInfo',
        payload: response,
      });
    },
    *fetchGetSpecifiedAlbum({ payload, callback }, { call, put, select }) {
      const response = yield call(getSpecifiedAlbum, payload);

      yield put({
        type: 'getSpecifiedAlbum',
        payload: response,
      });

      const getPara = yield select((state) => (state.contractAuthorList.specifiedAlbum));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchGetSpecifiedSong({ payload, callback }, { call, put, select }) {
      const response = yield call(getSpecifiedSong, payload);

      yield put({
        type: 'getSpecifiedSong',
        payload: response,
      });

      const getPara = yield select((state) => (state.contractAuthorList.specifiedSong));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchGetSpecifiedSongAndIsrcType({ payload, callback }, { call, put, all, select }) {
      const [a, b] = yield all([
        yield put({ type: 'fetchGetSpecifiedSong', payload: payload }),
        yield put({ type: 'isrcTypeList/fetchGetListAutoList' }),
      ]);

      const getPara = yield select((state) => (state.contractAuthorList.specifiedSong));

      if (callback) {
        callback(getPara);
      }
    },
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
    // update -----
    *fetchContractRenewal({ payload, callback }, { call, put, select }) {
      const response = yield call(contractRenewal, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.contractAuthorList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchAddSubcontract({ payload, callback }, { call, put, select }) {
      const response = yield call(addSubcontract, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.contractAuthorList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchDeleteSubcontract({ payload, callback }, { call, put, select }) {
      const response = yield call(deleteSubcontract, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.contractAuthorList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchAddContractAuthorForm({ payload, callback }, { call, put, select }) {
      const response = yield call(addContractAuthorForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.contractAuthorList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchEditContractAuthorForm({ payload, callback }, { call, put, select }) {
      const response = yield call(editContractAuthorForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.contractAuthorList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchExitContractGroup({ payload, callback }, { call, put, select }) {
      const response = yield call(exitContractGroup, payload);

      yield put.resolve({
        type: 'exitContractGroup',
        payload: response,
      });

      const getPara = yield select((state) => (state.contractAuthorList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchRemoveContract({ payload, callback }, { call, put, select }) {
      const response = yield call(removeContract, payload);

      yield put.resolve({
        type: 'removeContract',
        payload: response,
      });

      const getPara = yield select((state) => (state.contractAuthorList.removeDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchCopyContract({ payload, callback }, { call, put, select }) {
      const response = yield call(copyContract, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.contractAuthorList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchEditSpecifiedAlbumForm({ payload, callback }, { call, put, select }) {
      const response = yield call(editSpecifiedAlbumForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.contractAuthorList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    *fetchEditSpecifiedSongForm({ payload, callback }, { call, put, select }) {
      const response = yield call(editSpecifiedSongForm, payload);

      yield put.resolve({
        type: 'updateData',
        payload: response,
      });

      const getPara = yield select((state) => (state.contractAuthorList.updateDataResult));

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

      const getPara = yield select((state) => (state.contractAuthorList.updateDataResult));

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

      const getPara = yield select((state) => (state.contractAuthorList.updateDataResult));

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

      const getPara = yield select((state) => (state.contractAuthorList.updateDataResult));

      if (callback) {
        callback(getPara);
      }
    },
    // multi -----
    *fetchMultiGetPrepaidInfo({ payload }, { call, put, all, select }) {
      // effects
      const [a, b] = yield all([
        yield put({ type: 'fetchGetInfo', payload: { contract_author_id: payload.contract_author_id } }),
        ((payload.isEdit) ? yield put({ type: 'fetchGetPrepaid', payload: { contract_author_id: payload.contract_author_id } }) : (null)),
      ]);

      // reducers
      yield put.resolve({ type: 'multiGetPrepaidInfo' });
    },
    *fetchMultiGetContractAuthorInfo({ payload }, { call, put, all, select }) {
      // effects
      const [a, b, c] = yield all([
        yield put({ type: 'authorizedCountryList/fetchGetAuthorizedCountry', payload: { search: 'all' } }),
        yield put({ type: 'authorizedAreaList/fetchGetList', payload: { search: 'all' } }),
        ((payload.isEdit) ? (yield put({ type: 'fetchGetInfo', payload })) : (null)),
      ]);

      // reducers
      yield put.resolve({ type: 'multiGetContractAuthorInfo' });
    },
  },
  reducers: {
    // get -----
    getList(state, action) {
      let changeId = state.changeId + 1;
      let convertData = {};

      if (!action.payload.resError) {
        convertData = action.payload.data;
        convertData.ui_group_list = [];

        for (let i = 0; i < convertData.data_list.length; i++) {
          let item = convertData.data_list[i];

          if (item.contract_group_name && !convertData.ui_group_list.includes(item.contract_group_name)) {
            convertData.ui_group_list.push(item.contract_group_name);
          }

          for (let j = 0; j < convertData.data_list[i].subcontracts.length; j++) {
            convertData.data_list[i].subcontracts[j].contract_group_name = item.contract_group_name;
            convertData.data_list[i].subcontracts[j].party_b_company = item.party_b_company;
            convertData.data_list[i].subcontracts[j].contract_start_date = item.contract_start_date;
            convertData.data_list[i].subcontracts[j].contract_end_date = item.contract_end_date;
            convertData.data_list[i].subcontracts[j].contract_expiry_date = item.contract_expiry_date;
            // for checkIsContractTermination
            convertData.data_list[i].subcontracts[j].is_permanent = item.is_permanent;
            convertData.data_list[i].subcontracts[j].contract_termination_date = item.contract_termination_date;
            convertData.data_list[i].subcontracts[j].contract_expiry_date = item.contract_expiry_date;
          }
        }
      }

      return { ...state, changeId, list: convertData, updateDataResult: '' };
    },
    getInfo(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId, info: action.payload.data, };
    },
    getSpecifiedAlbum(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId, specifiedAlbum: action.payload.data, };
    },
    getSpecifiedSong(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId, specifiedSong: action.payload.data, };
    },
    getPrepaid(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId, prepaid: action.payload.data, };
    },
    // update -----
    updateData(state, action) {
      let updateDataResult = 'error';

      if (!action.payload.resError) {
        if (action.payload.data && action.payload.data.id) {
          updateDataResult = action.payload.data.id;
        } else if (action.payload.data && action.payload.data.contract_author_id) {
          updateDataResult = action.payload.data.contract_author_id;
        } else {
          updateDataResult = 'ok';
        }

        message.success('儲存成功');
      }

      return { ...state, updateDataResult: updateDataResult };
    },
    exitContractGroup(state, action) {
      let updateDataResult = 'error';

      if (!action.payload.resError) {
        updateDataResult = 'ok';

        message.success('退出成功');
      }

      return { ...state, updateDataResult: updateDataResult };
    },
    removeContract(state, action) {
      let removeDataResult = 'error';

      if (!action.payload.resError) {
        removeDataResult = 'ok';

        message.success('刪除成功');
      }

      return { ...state, removeDataResult: removeDataResult };
    },
    // multi - get info
    multiGetContractAuthorInfo(state, action) {
      let multiChangeId = state.multiChangeId + 1;

      return { ...state, multiChangeId: multiChangeId, removeDataResult: '', updateDataResult: '' };
    },
    // multi - getPrepaidInfo
    multiGetPrepaidInfo(state, action) {
      let multiChangeId = state.multiChangeId + 1;

      return { ...state, multiChangeId: multiChangeId, removeDataResult: '', updateDataResult: '' };
    },
  },
};

export default Model;
