import { getAuthorizedCountry } from '../services/authorizedCountryList';

const Model = {
  namespace: 'authorizedCountryList',
  state: {
    // change -----
    changeId: 0,
    // data -----
    // GetAuthorizedCountry
    countryList: [],
  },
  effects: {
    // get -----
    // GetAuthorizedCountry
    *fetchGetAuthorizedCountry({ payload }, { call, put }) {
      const response = yield call(getAuthorizedCountry, payload);

      yield put({
        type: 'getAuthorizedCountry',
        payload: response,
      });
    },
  },
  reducers: {
    // get -----
    // GetAuthorizedCountry
    getAuthorizedCountry(state, action) {
      let changeId = state.changeId + 1;

      return { ...state, changeId: changeId, countryList: action.payload.data.data_list };
    },
  },
};

export default Model;