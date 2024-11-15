import React, { useState, useEffect } from 'react';
import {
  Form,
  Card,
  Row,
  Col,
  InputNumber,
  Input,
  Select,
  Button,
  Modal,
  Popover,
  Spin,
  DatePicker,
  Checkbox,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import { CloseCircleOutlined } from "@ant-design/icons";
import moment from 'moment';
import styles from '@/style/style.less';
import errorStyles from '@/style/error_style.less';
import ComInfo from '../components/ComInfo';
import FormContractCode from './components/FormContractCode';
import FormSongRightsType from './components/FormSongRightsType';
import FormArea from '@/components/FormArea';
import FormAuthorName from './components/FormAuthorName';
import FormAuthorPenName from './components/FormAuthorPenName';
import FormCompanyNicknameAPI from '@/components/FormCompanyNicknameAPI';
import FooterToolbar from '@/components/FooterToolbar';
import FormCompanyNickNameAuthorName from '@/components/FormCompanyNickNameAuthorName';

const { Option } = Select;
const { TextArea } = Input;

export const update = props => {
  const {
    loadingMultiGetSongRights,
    loadingMultiUpdateSongRightsForm,
    loadingMultiRemoveSongRightsData,
    loadingMultiToHistorySongRightsData,
    dispatch,
    authorList,
    authorizedAreaList,
    authorizedCountryList,
    contractSongList,
    songList,
    songRightsList: { multiChangeId, optSongRightsType, song_rights },
    match,
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [viewLoading, setViewLoading] = useState(true);
  const dateFormat = 'YYYY-MM-DD';
  const [isSongRightsTypeRadioId, setIsSongRightsTypeRadioId] = useState('0');
  const [authorId, setAuthorId] = useState('');
  const [authorCodeLabel, setAuthorCodeLabel] = useState('');
  const [authorCodeList, setAuthorCodeList] = useState([]);
  // for author_pen_name_id
  const [authorCodeChange, setAuthorCodeChange] = useState(false);
  const [defaultAuthorPenNameList, setDefaultAuthorPenNameList] = useState([]);
  const [authorPenNameList, setAuthorPenNameList] = useState([]);
  // for contract_song_code
  const [contractSongCodeList, setContractSongCodeList] = useState([]);
  // for op
  const [opUiSelectVal, setOpUiSelectVal] = useState('1');
  const [opCompanyList, setOpCompanyList] = useState([]);
  const [opCompanyCodeLabel, setOpCompanyCodeLabel] = useState('');
  const [opAuthorList, setOpAuthorList] = useState([]);
  const [opAuthorCodeLabel, setOpAuthorCodeLabel] = useState('');
  // for sp
  const [spCompanyCodeLabel, setSpCompanyCodeLabel] = useState('');
  const [spCompanyList, setSpCompanyList] = useState([]);
  // for settle
  const [settleUiSelectVal, setSettleUiSelectVal] = useState('1');
  const [settleCompanyList, setSettleCompanyList] = useState([]);
  const [settleCompanyCodeLabel, setSettleCompanyCodeLabel] = useState('');
  const [settleAuthorList, setSettleAuthorList] = useState([]);
  const [settleAuthorCodeLabel, setSettleAuthorCodeLabel] = useState('');
  // for area
  const [initAgencyArea, setInitAgencyArea] = useState(true);
  const [initAgencyAreaList, setInitAgencyAreaList] = useState([]);
  const [agencyAreaCountry2Disabled, setAgencyAreaCountry2Disabled] = useState(false);
  // for song_rights_type_id
  const [songRightsTypeId, setSongRightsTypeId] = useState('');

  // api -----
  // getData
  const getData = (edit) => {
    dispatch({
      type: 'songRightsList/fetchMultiGetSongRights',
      payload: {
        isEdit: edit,
        id: (edit ? match.params.id : undefined),
        song_code: match.params.song_code,
      }
    });
  }

  // mount
  useEffect(() => {
    let initObj = {
      song_rights_type_id: '',
      song_rights_type_radio_id: '0', // only for ui
      song_rights_type_custom: '',
      rights_ratio: '',
      author_code: '',
      name: '',
      rights_start: null,
      op_company_nickname_id: '',
      op_company_id: '',
      op_company_nickname: '',
      op_company_code: '',  // only for ui
      op_author_id: '',
      op_author_name: '',
      op_author_code: '',
      author_pen_name_id: '',
      rights_end: null,
      sp_company_nickname_id: '',
      sp_company_id: '',
      sp_company_nickname: '',
      sp_company_code: '',  // only for ui
      agency_area_type: '2',
      agency_area_id: '',
      agency_country: [],
      agency_area_type_radio: '0',  // only for ui
      agency_area_id_input_countrys: [],  // only for ui
      agency_area_type_select: '2',  // only for ui
      agency_area_id_input2_countrys: [],  // only for ui
      agency_end: null,
      settle_company_id: '',
      settle_company_name: '',
      settle_company_code: '',  // only for ui
      settle_author_id: '',
      settle_author_name: '',
      settle_author_code: '',
      is_digital: '0',
      is_entity: '0',
      ui_type: [], // only for ui
      notes: '',  // TODO: 等待後端拔除在同步拔除
    };

    if (match.path.toString().indexOf('/song/rights/update/id/:id/song_code/:song_code') >= 0) {
      setIsEdit(true);
      getData(true);
    } else {
      setIsEdit(false);
      getData(false);
      form.setFieldsValue({
        ...initObj
      });
    }
  }, [match.params.id]);
  // updateAuthorPenNameList
  const updateAuthorPenNameList = (list, checkPenNameVal) => {
    let tmpList = [];
    let hasOpt = false;
    let penNameVal = form.getFieldValue()['author_pen_name_id'];
    let penNameNewVal = '';

    // update option
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        tmpList.push({ value: list[i].id, label: list[i].pen_name });
      }
    }

    // check value
    if (checkPenNameVal) {
      for (let j = 0; j < tmpList.length; j++) {
        if (tmpList[j].value == penNameVal) {
          hasOpt = true;
        }
      }

      if (!hasOpt) {
        if (tmpList.length == 1) {
          penNameNewVal = tmpList[0].value;
        } else if (tmpList.length >= 2) {
          penNameNewVal = tmpList[1].value;
        }
        form.setFieldsValue({ author_pen_name_id: penNameNewVal });
      }
    }

    setAuthorPenNameList(tmpList);
  }

  // updateData
  useEffect(() => {
    let obj = Object.assign({}, song_rights);
    let tempCountrysArr = [];

    setViewLoading(true);

    if (match.params.id) {
      // is_entity, is_digital (convert to ui_type)
      obj.ui_type = [];
      if (obj.is_entity == '1') {
        obj.ui_type.push('is_entity');
      }
      if (obj.is_digital == '1') {
        obj.ui_type.push('is_digital');
      }

      // song_rights_type_id, song_rights_type_radio_id
      if (obj.song_rights_type_id != '6') {
        obj.song_rights_type_radio_id = '0';
      } else {
        obj.song_rights_type_id = '1';
        obj.song_rights_type_radio_id = '1';
      }

      if (obj.song_rights_type_id === "99") { obj.song_rights_type_id = "詞曲" }
      setSongRightsTypeId(obj.song_rights_type_id);

      // authorCodeList
      if (obj.author_code) {
        setAuthorCodeList([{ name: obj.name, author_code: obj.author_code }]);
      } else {
        setAuthorCodeList([]);
      }

      // authorPenNameList
      if (obj.author_code) {
        updateAuthorPenNameList(authorList.autoComplete);
      } else {
        updateAuthorPenNameList([]);
      }
      setAuthorCodeChange(false);
      if (obj.author_pen_name_id) {
        setDefaultAuthorPenNameList([{ value: obj.author_pen_name_id, label: obj.pen_name }]);
      } else {
        setDefaultAuthorPenNameList([]);
      }

      // author_code, author_pen_name_id - for label
      if (obj.author_code) {
        setAuthorCodeLabel(obj.author_code);
      } else {
        setAuthorCodeLabel('');
      }

      // authorId, contractSongCodeList
      if (obj.author_id) {
        setAuthorId(obj.author_id);
        setContractSongCodeList(contractSongList.autoCompleteByAuthorId);
      } else {
        setAuthorId('');
        setContractSongCodeList([]);
      }

      // rights_start, rights_end, agency_end (convert to time format object)
      obj.rights_start = (typeof (obj.rights_start) == 'string') ? (obj.rights_start != '' ? moment(obj.rights_start) : null) : obj.rights_start;
      obj.rights_end = (typeof (obj.rights_end) == 'string') ? (obj.rights_end != '' ? moment(obj.rights_end) : null) : obj.rights_end;
      obj.agency_end = (typeof (obj.agency_end) == 'string') ? (obj.agency_end != '' ? moment(obj.agency_end) : null) : obj.agency_end;

      // op - opCompanyList, op_company_code
      if (obj.op_company_nickname_id) {
        setOpUiSelectVal('1');
        // company
        setOpCompanyList([{ id: obj.op_company_nickname_id, company_id: obj.op_company_id, nickname: obj.op_company_nickname, company_code: (obj.op_company_code ? obj.op_company_code : '') }]);
        setOpCompanyCodeLabel((obj.op_company_code) ? (obj.op_company_code) : '');
        // author
        obj.op_author_id = '';
        setOpAuthorList([]);
        setOpAuthorCodeLabel('');
      } else if (obj.op_author_id) {
        setOpUiSelectVal('2');
        // company
        setOpCompanyList([]);
        setOpCompanyCodeLabel('');
        // author
        setOpAuthorList([{ id: obj.op_author_id, name: obj.op_author_name, author_code: (obj.op_author_code ? obj.op_author_code : '') }]);
        setOpAuthorCodeLabel((obj.op_author_code) ? (obj.op_author_code) : '');
      } else {
        setOpUiSelectVal('1');
        // company
        setOpCompanyList([]);
        setOpCompanyCodeLabel('');
        // author
        setOpAuthorList([]);
        setOpAuthorCodeLabel('');
      }

      // spCompanyList, sp_company_code
      if (obj.sp_company_nickname_id) {
        setSpCompanyList([{ id: obj.sp_company_nickname_id, company_id: obj.sp_company_id, nickname: obj.sp_company_nickname, company_code: (obj.sp_company_code ? obj.sp_company_code : '') }]);
      } else {
        setSpCompanyList([]);
      }
      setSpCompanyCodeLabel((obj.sp_company_code) ? (obj.sp_company_code) : '');

      // settle - settleCompanyList, settle_company_code
      if (obj.settle_company_id) {
        setSettleUiSelectVal('1');
        // company
        setSettleCompanyList([{ id: obj.settle_company_id, name: obj.settle_company_name, company_code: (obj.settle_company_code ? obj.settle_company_code : '') }]);
        setSettleCompanyCodeLabel((obj.settle_company_code) ? (obj.settle_company_code) : '');
        // author
        obj.settle_author_id = '';
        setSettleAuthorList([]);
        setSettleAuthorCodeLabel('');
      } else if (obj.settle_author_id) {
        setSettleUiSelectVal('2');
        // company
        setSettleCompanyList([]);
        setSettleCompanyCodeLabel('');
        // author
        setSettleAuthorList([{ id: obj.settle_author_id, name: obj.settle_author_name, author_code: (obj.settle_author_code ? obj.settle_author_code : '') }]);
        setSettleAuthorCodeLabel((obj.settle_author_code) ? (obj.settle_author_code) : '');
      } else {
        setSettleUiSelectVal('1');
        // company
        setSettleCompanyList([]);
        setSettleCompanyCodeLabel('');
        // author
        setSettleAuthorList([]);
        setSettleAuthorCodeLabel('');
      }

      // agency_area_type
      if (obj.agency_area_type == '1') {
        obj.agency_area_type_radio = '1';
        obj.agency_area_type_select = '2';
      } else {
        obj.agency_area_type_radio = '0';
        obj.agency_area_type_select = (obj.agency_area_type) ? obj.agency_area_type : '2';
      }
      setAgencyAreaCountry2Disabled(obj.agency_area_type_select == '2' ? true : false);

      // for agency_area_id init option (only for ui)
      setInitAgencyArea(true);
      if (obj.agency_area_id && obj.area_name) {
        setInitAgencyAreaList([{ id: obj.agency_area_id, area_name: obj.area_name }]);
      } else {
        setInitAgencyAreaList([]);
      }

      // agency_country
      if (obj.agency_area_type && obj.agency_area_type != '2' && obj.agency_country && obj.agency_country.length > 0) {
        for (let i = 0; i < obj.agency_country.length; i++) {
          tempCountrysArr.push(obj.agency_country[i].country_id);
        }
        if (obj.agency_area_type == '1') {
          obj.agency_area_id_input_countrys = tempCountrysArr;
          obj.agency_area_id_input2_countrys = [];
        } else {
          obj.agency_area_id_input_countrys = [];
          obj.agency_area_id_input2_countrys = tempCountrysArr;
        }
      } else {
        obj.agency_area_id_input_countrys = [];
        obj.agency_area_id_input2_countrys = [];
      }

      form.setFieldsValue({
        ...obj,
      });
    } else {
      setInitAgencyArea(true);
      setAgencyAreaCountry2Disabled(form.getFieldValue()['agency_area_type_select'] == '2' ? true : false);
    }

    setViewLoading(false);
  }, [multiChangeId]);

  // save
  const onFinish = values => {
    setError([]);

    let saveObj = Object.assign({}, values);
    let checkObj = {};

    // convert ui_type to 'is_entity', 'is_digital'
    saveObj.is_entity = '0';
    saveObj.is_digital = '0';
    for (let i = 0; i < saveObj.ui_type.length; i++) {
      if (saveObj.ui_type[i] == 'is_entity') {
        saveObj.is_entity = '1';
      }
      if (saveObj.ui_type[i] == 'is_digital') {
        saveObj.is_digital = '1';
      }
    }
    delete saveObj.ui_type;

    // add song_code
    saveObj.song_code = songList.info.song_code;

    // id
    if (isEdit) {
      saveObj.id = song_rights.id;
    }

    // 詞曲轉換成 99
    if (saveObj.song_rights_type_id === "詞曲") {
      saveObj.song_rights_type_id = "99";
    }

    // contract_song_code
    saveObj.contract_song_code = saveObj.contract_song_code.toUpperCase();

    // convert song_rights_type_radio_id to 'song_rights_type_id', 'song_rights_type_custom'
    if (saveObj.song_rights_type_radio_id == '0') {
      saveObj.song_rights_type_custom = '';
    } else {
      saveObj.song_rights_type_id = '6';
    }
    delete saveObj.song_rights_type_radio_id;

    // saveObj.rights_start
    if (saveObj.rights_start && typeof (saveObj.rights_start) == 'object') {
      saveObj.rights_start = form.getFieldValue()['rights_start'].format(dateFormat);
    } else {
      saveObj.rights_start = '';
    }

    // saveObj.rights_end  
    if (saveObj.rights_end && typeof (saveObj.rights_end) == 'object') {
      saveObj.rights_end = form.getFieldValue()['rights_end'].format(dateFormat);
    } else {
      saveObj.rights_end = '';
    }

    // saveObj.agency_end
    if (saveObj.agency_end && typeof (saveObj.agency_end) == 'object') {
      saveObj.agency_end = form.getFieldValue()['agency_end'].format(dateFormat);
    } else {
      saveObj.agency_end = '';
    }

    // op
    if (opUiSelectVal == '1') {
      saveObj.op_author_id = '';
    } else {
      saveObj.op_company_id = '';
      saveObj.op_company_nickname_id = '';
    }

    // settle
    if (settleUiSelectVal == '1') {
      saveObj.settle_author_id = '';
    } else {
      saveObj.settle_company_id = '';
    }

    // convert 'agency_area_type_radio', 'agency_area_id_input_countrys', 'agency_area_type_select', 'agency_area_id_input2_countrys' to 'agency_area_type', 'agency_area_id', 'agency_country'
    if (saveObj.agency_area_type_radio == '1') {
      saveObj.agency_area_type = '1';
      saveObj.agency_area_id = '';
    } else {
      saveObj.agency_area_type = saveObj.agency_area_type_select;
    }
    delete saveObj.agency_area_type_radio;

    // convert 'agency_area_id_input_countrys', 'agency_area_id_input2_countrys' >> saveObj.agency_country...
    let OrgCountryList = song_rights.agency_country ? song_rights.agency_country.slice() : [];
    let tempCountryList = [];

    if (saveObj.agency_area_type == '1') {
      tempCountryList = saveObj.agency_area_id_input_countrys;
    } else if (saveObj.agency_area_type != '2') {
      tempCountryList = saveObj.agency_area_id_input2_countrys;
    }

    if (isEdit) {
      for (let i = 0; i < OrgCountryList.length; i++) {
        OrgCountryList[i].is_delete = '1';
      }

      if (saveObj.agency_area_type != '2') {
        for (let i = 0; i < tempCountryList.length; i++) {
          let findItem = false;
          for (let j = 0; j < OrgCountryList.length; j++) {
            if (tempCountryList[i] == OrgCountryList[j].country_id) {
              delete OrgCountryList[j].is_delete;
              findItem = true;
              break;
            }
          }
          if (!findItem) {
            OrgCountryList.push({ country_id: tempCountryList[i] });
          }
        }
      }

      saveObj.agency_country = OrgCountryList;
    } else {
      saveObj.agency_country = tempCountryList;
    }
    delete saveObj.agency_area_type_select;
    delete saveObj.agency_area_id_input_countrys;
    delete saveObj.agency_area_id_input2_countrys;

    // check no coutry convert type 3,4 to 2
    if (saveObj.agency_area_type == '3' || saveObj.agency_area_type == '4') {
      let checkHasCountry = saveObj.agency_country.filter((cElem) => !cElem.is_delete || cElem.is_delete == '0');

      if (checkHasCountry.length == 0) {
        saveObj.agency_area_type = '2';
      }
    }

    // obj - null to string...
    for (let key in saveObj) {
      if (saveObj[key] == null) {
        saveObj[key] = '';
      }
    }

    // checkObj
    checkObj = {
      id: saveObj.id,
      song_code: saveObj.song_code,
      contract_song_code: saveObj.contract_song_code,
      author_code: saveObj.author_code,
      rights_ratio: saveObj.rights_ratio,
      song_rights_type_id: saveObj.song_rights_type_id,
    };

    dispatch({
      type: 'songRightsList/fetchMultiUpdateSongRightsForm',
      payload: {
        isEdit: isEdit,
        authorId: authorId,
        check: checkObj,
        save: saveObj,
      },
      callback: res => {
        let redirect = '/song';

        if (res && res != 'error') {
          redirect = `/song/adv/song_code/${songList.info.song_code}`;
          history.push(redirect);
        }
      }
    });
  }

  // confirm
  const showConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要取消修改嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        history.push(`/song/adv/song_code/${songList.info.song_code}`);
      },
      onCancel() { },
    });
  }

  // removeData
  const showRemoveConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要刪除嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        removeData();
      },
      onCancel() { },
    });
  }
  const removeData = () => {
    dispatch({
      type: 'songRightsList/fetchMultiRemoveSongRightsData',
      payload: {
        id: match.params.id,
        song_code: match.params.song_code,
      },
      callback: res => {
        if (res && res != 'error') {
          history.push(`/song/adv/song_code/${songList.info.song_code}`);
        }
      }
    });
  }

  // toHistoryData
  const showToHistoryConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要設為歷史合約嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        toHistoryData();
      },
      onCancel() { },
    });
  }
  const toHistoryData = () => {
    dispatch({
      type: 'songRightsList/fetchMultiToHistorySongRightsData',
      payload: {
        id: match.params.id,
        song_code: match.params.song_code,
      },
      callback: res => {
        if (res && res != 'error') {
          history.push(`/song/adv/song_code/${songList.info.song_code}`);
        }
      }
    });
  }

  // convertToContractContent
  const convertToContractContent = (obj) => {
    if (!obj) {
      return;
    }

    // op_nickname_id
    if (obj.op_nickname_id) {
      setOpUiSelectVal('1');
      setOpCompanyList([{ id: obj.op_nickname_id, company_id: obj.op_company_id, nickname: obj.op_company_nickname, company_code: (obj.op_company_code ? obj.op_company_code : '') }]);
      setOpCompanyCodeLabel(obj.op_company_code ? obj.op_company_code : '');
      form.setFieldsValue({ op_company_nickname_id: obj.op_nickname_id });
      form.setFieldsValue({ op_company_id: obj.op_company_id });
      setOpAuthorList([]);
      setOpAuthorCodeLabel('');
      form.setFieldsValue({ op_author_id: '' });
    } else if (obj.op_nickname_id) {
      setOpUiSelectVal('2');
      setOpAuthorList([{ id: obj.op_nickname_id, name: obj.op_author_name, author_code: (obj.op_author_code ? obj.op_author_code : '') }]);;
      setOpAuthorCodeLabel((obj.op_author_code) ? (obj.op_author_code) : '');
      form.setFieldsValue({ op_author_id: '' });
      setOpCompanyList([]);
      setOpCompanyCodeLabel('');
      form.setFieldsValue({ op_company_nickname_id: '' });
      form.setFieldsValue({ op_company_id: '' });
    } else {
      setOpUiSelectVal('1');
      setOpCompanyList([]);
      setOpCompanyCodeLabel('');
      form.setFieldsValue({ op_company_nickname_id: '' });
      form.setFieldsValue({ op_company_id: '' });
      setOpAuthorList([]);
      setOpAuthorCodeLabel('');
      form.setFieldsValue({ op_author_id: '' });
    }

    // sp_nickname_id
    if (obj.sp_nickname_id) {
      setSpCompanyList([{ id: obj.sp_nickname_id, company_id: obj.sp_company_id, nickname: obj.sp_company_nickname, company_code: (obj.sp_company_code ? obj.sp_company_code : '') }]);
      setSpCompanyCodeLabel(obj.sp_company_code ? obj.sp_company_code : '');
      form.setFieldsValue({ sp_company_nickname_id: obj.sp_nickname_id });
      form.setFieldsValue({ sp_company_id: obj.sp_company_id });
    } else {
      setSpCompanyList([]);
      setSpCompanyCodeLabel('');
      form.setFieldsValue({ sp_company_nickname_id: '' });
      form.setFieldsValue({ sp_company_id: '' });
    }

    // settle_company_id
    if (obj.sp_company_id) {
      setSettleUiSelectVal('1');
      setSettleCompanyList([{ id: obj.sp_company_id, name: obj.sp_company_name, company_code: (obj.sp_company_code ? obj.sp_company_code : '') }]);
      setSettleCompanyCodeLabel(obj.sp_company_code ? obj.sp_company_code : '');
      form.setFieldsValue({ settle_company_id: obj.sp_company_id });
      setSettleAuthorList([]);
      setSettleAuthorCodeLabel('');
      form.setFieldsValue({ settle_author_id: '' });
    } else if (obj.op_company_id) {
      setSettleUiSelectVal('1');
      setSettleCompanyList([{ id: obj.op_company_id, name: obj.op_company_name, company_code: (obj.op_company_code ? obj.op_company_code : '') }]);
      setSettleCompanyCodeLabel(obj.op_company_code ? obj.op_company_code : '');
      form.setFieldsValue({ settle_company_id: obj.op_company_id });
      setSettleAuthorList([]);
      setSettleAuthorCodeLabel('');
      form.setFieldsValue({ settle_author_id: '' });
    } else if (obj.op_nickname_id) {
      setSettleUiSelectVal('2');
      setSettleAuthorList([{ id: obj.op_nickname_id, name: obj.op_author_name, author_code: (obj.op_author_code ? obj.op_author_code : '') }]);;
      setSettleAuthorCodeLabel((obj.op_author_code) ? (obj.op_author_code) : '');
      form.setFieldsValue({ settle_author_id: obj.op_nickname_id });
      setSettleCompanyList([]);
      setSettleCompanyCodeLabel('');
      form.setFieldsValue({ op_company_id: '' });
    } else {
      setSettleUiSelectVal('1');
      setSettleAuthorList([]);
      setSettleAuthorCodeLabel('');
      form.setFieldsValue({ settle_author_id: '' });
      setSettleCompanyList([]);
      setSettleCompanyCodeLabel('');
      form.setFieldsValue({ op_company_id: '' });
    }

    // rights_start
    let rights_start = (typeof (obj.contract_start_date) == 'string' && obj.contract_start_date != '') ? (moment(obj.contract_start_date)) : null;
    form.setFieldsValue({ rights_start: rights_start });

    // rights_end
    let rights_end = (typeof (obj.contract_end_date) == 'string' && obj.contract_end_date != '') ? (moment(obj.contract_end_date)) : null;
    form.setFieldsValue({ rights_end: rights_end });

    // agency_end
    let agency_end = (typeof (obj.early_terminate_date) == 'string' && obj.early_terminate_date != '')
      ? (moment(obj.early_terminate_date))
      : (
        (typeof (obj.contract_agency_end) == 'string' && obj.contract_agency_end != '')
          ? (moment(obj.contract_agency_end))
          : (null)
      );
    form.setFieldsValue({ agency_end: agency_end });

    // authorized_area_type
    if (obj.authorized_area_type == '1') {
      form.setFieldsValue({ agency_area_type: obj.authorized_area_type });
      form.setFieldsValue({ agency_area_type_radio: '1' });
      form.setFieldsValue({ agency_area_type_select: '2' });
    } else {
      form.setFieldsValue({ agency_area_type: (obj && obj.authorized_area_type) ? (obj.authorized_area_type) : '' });
      form.setFieldsValue({ agency_area_type_radio: '0' });
      form.setFieldsValue({ agency_area_type_select: (obj.authorized_area_type) ? obj.authorized_area_type : '2' });
    }

    // for agency_area_id init option (only for ui)
    setInitAgencyArea(true);
    if (obj.authorized_area_id && obj.area_name) {
      form.setFieldsValue({ agency_area_id: obj.authorized_area_id });
      setInitAgencyAreaList([{ id: obj.authorized_area_id, area_name: obj.area_name }]);
    } else {
      form.setFieldsValue({ agency_area_id: '' });
      setInitAgencyAreaList([]);
    }

    // agency_country (obj.agency_country  >>  obj.country_ids)
    let newAgencyCountry = [];
    if (obj.authorized_area_type && obj.authorized_area_type != '2' && obj.country_ids && obj.country_ids.length > 0) {
      newAgencyCountry = obj.country_ids.slice();
      if (obj.authorized_area_type == '1') {
        form.setFieldsValue({ agency_area_id_input_countrys: newAgencyCountry });
        form.setFieldsValue({ agency_area_id_input2_countrys: [] });
      } else {
        form.setFieldsValue({ agency_area_id_input_countrys: [] });
        form.setFieldsValue({ agency_area_id_input2_countrys: newAgencyCountry });
      }

    } else {
      form.setFieldsValue({ agency_area_id_input_countrys: [] });
      form.setFieldsValue({ agency_area_id_input2_countrys: [] });
    }
    setAgencyAreaCountry2Disabled(form.getFieldValue()['agency_area_type_select'] == '2' ? true : false);
  }

  // updateContractList
  const updateContractList = (authorId) => {
    if (authorId) {
      dispatch({
        type: 'contractSongList/fetchGetAutoCompleteByAuthorId',
        payload: {
          author_id: authorId,
        },
        callback: res => {
          let contractCodeVal = form.getFieldValue()['contract_song_code'];

          for (let i = 0; i < res.length; i++) {
            if (res[i].contract_code == contractCodeVal) {
              convertToContractContent(res[i]);
            }
          }

          setAuthorId(authorId);
          setContractSongCodeList(res);
        }
      });
    } else {
      setAuthorId('');
      setContractSongCodeList([]);
    }
  }

  // valid behavior -----
  // fieldLabels
  const fieldLabels = {
    contract_song_code: '合約編號',
    song_rights_type_id: '權利',
    song_rights_type_custom: '權利 - 自訂',
    rights_ratio: `Ctrl%${(song_rights.lyrics_ratio && isEdit) ? (`（L:${song_rights.lyrics_ratio}）`) : ''}`,
    author_code: '作者本名',
    author_pen_name_id: '作者筆名',
  };

  // valid
  const getErrorInfo = errors => {
    const errorCount = errors.filter(item => item.errors.length > 0).length;
    // fix Form.List field
    const cusFields = [];
    const cusFieldId = '';

    if (!errors || errorCount === 0) {
      return null;
    }

    const scrollToField = fieldKey => {
      let labelNode = document.querySelector(`label[for="${fieldKey}"]`);

      // fix 'song_rights_type_id', 'song_rights_type_custom'
      if (fieldKey == 'song_rights_type_id' || fieldKey == 'song_rights_type_custom') {
        fieldKey = 'song_rights_type_radio_id';
        labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      }

      if (fieldKey === cusFieldId) {
        labelNode = document.getElementById(cusFieldId);
      }

      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };

    const errorList = errors.map(err => {
      if (!err || err.errors.length === 0) {
        return null;
      }

      let key = err.name[0];
      let renderFieldName = fieldLabels[key];
      let renderSelector = key;

      if (err.name.length > 1) {
        key = '';
        for (let i = 0; i < err.name.length; i++) {
          key += err.name[i];
        }
      }

      if (!renderFieldName) {
        for (let i = 0; i < cusFields.length; i++) {
          if (key.indexOf(cusFields[i]) >= 0) {
            renderFieldName = fieldLabels[cusFieldId][cusFields[i]];
            break;
          }
        }

        renderSelector = cusFieldId;
      }

      return (
        <li key={key} className={errorStyles.errorListItem} onClick={() => scrollToField(renderSelector)}>
          <CloseCircleOutlined className={errorStyles.errorIcon} />
          <div className={errorStyles.errorMessage}>{err.errors[0]}</div>
          <div className={errorStyles.errorField}>{renderFieldName}</div>
        </li>
      );
    });
    return (
      <span className={errorStyles.errorIcon}>
        <Popover
          title="表單驗證訊息"
          content={errorList}
          overlayClassName={errorStyles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode;
            }

            return trigger;
          }}
        >
          <CloseCircleOutlined />
        </Popover>
        {errorCount}
      </span>
    );
  };
  const onFinishFailed = errorInfo => {
    setError(errorInfo.errorFields);
  };

  // ui -----
  // PageHeaderWrapper(extra) - buttonsList
  const buttonsList = (
    <div>
      <Button onClick={showRemoveConfirm}>刪除</Button>
      <Button className={styles.om_sp_m_lb} onClick={showToHistoryConfirm}>設為歷史合約</Button>
    </div>
  );

  return (
    <Spin
      tip="Loading..."
      spinning={loadingMultiGetSongRights || loadingMultiUpdateSongRightsForm || loadingMultiRemoveSongRightsData || loadingMultiToHistorySongRightsData || viewLoading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <PageHeaderWrapper
          title={isEdit ? '歌曲權利 - 編輯' : '歌曲權利 - 新增'}
          extra={isEdit ? buttonsList : ''}
        >
          <ComInfo />
          <Card
            bordered={false}
            className={`${styles.card} ${styles.cardTopSpace}`}
            title="權利/合約"
          >
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="ui_type"
                  label="適用型態"
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Checkbox.Group
                    options={[{ label: '實體', value: 'is_entity' }, { label: '數位', value: 'is_digital' }]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <FormAuthorName
                  form={form}
                  isLabel={fieldLabels.author_code}
                  isName="author_code"
                  isSelectText="name"
                  isList={authorCodeList}
                  setIsList={setAuthorCodeList}
                  authorCodeLabel={authorCodeLabel}
                  setAuthorCodeLabel={setAuthorCodeLabel}
                  setChangeStatus={setAuthorCodeChange}
                  updateAuthorPenNameList={updateAuthorPenNameList}
                  updateContractList={updateContractList}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <FormSongRightsType
                  form={form}
                  fieldLabels={fieldLabels}
                  isSongRightsTypeRadioId={isSongRightsTypeRadioId}
                  setIsSongRightsTypeRadioId={setIsSongRightsTypeRadioId}
                  optSongRightsType={optSongRightsType}
                  songRightsTypeId={songRightsTypeId}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="rights_ratio"
                  label={fieldLabels.rights_ratio}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    disabled={(songRightsTypeId === "詞曲") && (song_rights.lyrics_ratio && isEdit)} // 當 (type=99)+(有L)+(編輯的頁面)
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <FormAuthorPenName
                  form={form}
                  isLabel={fieldLabels.author_pen_name_id}
                  isName="author_pen_name_id"
                  authorCodeChange={authorCodeChange}
                  setAuthorCodeChange={setAuthorCodeChange}
                  isDefaultList={defaultAuthorPenNameList}
                  isList={authorPenNameList}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="rights_start"
                  label="權利起始日"
                  initialValue={null}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <FormCompanyNickNameAuthorName
                  form={form}
                  isLabel="OP"
                  isUiSelectVal={opUiSelectVal}
                  isSetUiSelectVal={setOpUiSelectVal}
                  isCpName="op_company_nickname_id"
                  isCpSelectText="op_company_nickname"
                  isCpList={opCompanyList}
                  setIsCpList={setOpCompanyList}
                  cpCodeLabel={opCompanyCodeLabel}
                  setCpCodeLabel={setOpCompanyCodeLabel}
                  isCompanyIdName="op_company_id"
                  isAtName="op_author_id"
                  isAtSelectText="op_author_name"
                  isAtList={opAuthorList}
                  setIsAtList={setOpAuthorList}
                  atCodeLabel={opAuthorCodeLabel}
                  setAtCodeLabel={setOpAuthorCodeLabel}
                  customAuthorOptLabel="個人"
                />
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <FormContractCode
                  form={form}
                  isLabel={fieldLabels.contract_song_code}
                  isName="contract_song_code"
                  isDisabled={(authorId) ? false : true}
                  isList={contractSongCodeList}
                  convertToContractContent={convertToContractContent}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="rights_end"
                  label="權利到期日"
                  initialValue={null}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <FormCompanyNicknameAPI
                  form={form}
                  isLabel="SP"
                  isName="sp_company_nickname_id"
                  isSelectText="sp_company_nickname"
                  isList={spCompanyList}
                  setIsList={setSpCompanyList}
                  cpCodeLabel={spCompanyCodeLabel}
                  setCpCodeLabel={setSpCompanyCodeLabel}
                  isCompanyIdName="sp_company_id"
                />
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <FormArea
                  form={form}
                  isLabel="代理地區"
                  isNameAreaRadioTypeRadio="agency_area_type_radio"
                  isNameAreaIdInputCountrys="agency_area_id_input_countrys"
                  isNameAreaId="agency_area_id"
                  isNameAreaTypeSelect="agency_area_type_select"
                  isNameAreaIdInput2Countrys="agency_area_id_input2_countrys"
                  isInit={initAgencyArea}
                  setIsInit={setInitAgencyArea}
                  initAuthorizedAreaList={initAgencyAreaList}
                  authorizedAreaList={authorizedAreaList}
                  authorizedCountryList={authorizedCountryList}
                  isDisabledInput2Countrys={agencyAreaCountry2Disabled}
                  setIsDisabledInput2Countrys={setAgencyAreaCountry2Disabled}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="agency_end"
                  label="代理到期日"
                  initialValue={null}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <FormCompanyNickNameAuthorName
                  form={form}
                  isLabel="結算對象"
                  changeToCompanyName={true}
                  isUiSelectVal={settleUiSelectVal}
                  isSetUiSelectVal={setSettleUiSelectVal}
                  isCpName="settle_company_id"
                  isCpSelectText="settle_company_name"
                  isCpList={settleCompanyList}
                  setIsCpList={setSettleCompanyList}
                  cpCodeLabel={settleCompanyCodeLabel}
                  setCpCodeLabel={setSettleCompanyCodeLabel}
                  isAtName="settle_author_id"
                  isAtSelectText="settle_author_name"
                  isAtList={settleAuthorList}
                  setIsAtList={setSettleAuthorList}
                  atCodeLabel={settleAuthorCodeLabel}
                  setAtCodeLabel={setSettleAuthorCodeLabel}
                  customAuthorOptLabel="個人"
                />
              </Col>
            </Row>
            {/* TODO: 等待後端拔除在同步拔除 */}
            <Row gutter={[64, 24]} style={{ display: 'none' }}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="notes"
                  label="備註"
                >
                  <TextArea />
                </Form.Item>
              </Col>
            </Row>
          </Card>

        </PageHeaderWrapper>
        <FooterToolbar>
          {getErrorInfo(error)}
          <Button
            onClick={showConfirm}
          >取消</Button>
          <Button
            type="primary"
            className={styles.submitBtnWidth}
            onClick={() => form?.submit()}
          >送出</Button>
        </FooterToolbar>
      </Form>
    </Spin >
  );
}

export default connect(({ authorList, authorizedAreaList, authorizedCountryList, contractSongList, songList, songRightsList, loading }) => ({
  authorList,
  authorizedAreaList,
  authorizedCountryList,
  contractSongList,
  songList,
  songRightsList,
  loadingMultiGetSongRights: loading.effects['songRightsList/fetchMultiGetSongRights'],
  loadingMultiUpdateSongRightsForm: loading.effects['songRightsList/fetchMultiUpdateSongRightsForm'],
  loadingMultiRemoveSongRightsData: loading.effects['songRightsList/fetchMultiRemoveSongRightsData'],
  loadingMultiToHistorySongRightsData: loading.effects['songRightsList/fetchMultiToHistorySongRightsData'],
}))(update);