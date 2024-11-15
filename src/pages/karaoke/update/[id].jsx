import React, { useState, useEffect, Fragment } from 'react';
import {
  Form,
  Card,
  Row,
  Col,
  Input,
  InputNumber,
  Checkbox,
  Radio,
  Select,
  Button,
  Modal,
  Popover,
  Spin,
  DatePicker,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import { CloseCircleOutlined } from "@ant-design/icons";
import moment from 'moment';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import valid from '@/fn/valid';
import errorStyles from '@/style/error_style.less';
import FormCompanyNameAPI from '@/components/FormCompanyNameAPI';
import FormAlbumNameAPI from '@/components/FormAlbumNameAPI';
import FormSongNameAPI from '@/components/FormSongNameAPI';
import FormArea from '@/components/FormArea';
import FooterToolbar from '@/components/FooterToolbar';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

export const update = props => {
  const {
    dispatch,
    match,
    loadingMultiGetInfo,
    loadingEditKaraokeForm,
    loadingAddOrCopyKaraokeForm,
    authorizedAreaList,
    authorizedCountryList,
    settlePhaseList,
    karaokeList: { multiChangeId, optType, optDistributionFormat, optIncomeSource, info, availableContractCode },
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);
  const [updateType, setUpdateType] = useState(0);  // 0: add, 1: edit, 2: copy
  const dateFormat = 'YYYY-MM-DD';
  // const monthFormat = 'YYYY-MM';
  const [viewLoading, setViewLoading] = useState(false);
  // right_phase_id
  const [disabledRightPhaseBtns, setDisabledRightPhaseBtns] = useState(false);
  // record_phase_id
  const [disabledRecordPhaseBtns, setDisabledRecordPhaseBtns] = useState(false);
  // user_company_id
  const [userCompanyList, setUserCompanyList] = useState([]);
  const [userCompanyCodeLabel, setUserCompanyCodeLabel] = useState('');
  // release_company_id
  const [releaseCompanyList, setReleaseCompanyList] = useState([]);
  const [releaseCompanyCodeLabel, setReleaseCompanyCodeLabel] = useState('');
  // holder_company_id
  const [holderCompanyList, setHolderCompanyList] = useState([]);
  const [holderCompanyCodeLabel, setHolderCompanyCodeLabel] = useState('');
  // ui_sp_date
  const [disabledUiSpDate, setDisabledUiSpDate] = useState(false);
  // album_id
  const [albumIdList, setAlbumIdList] = useState([]);
  // song_code
  const [songRightInfo, setSongRightInfo] = useState([]);
  const [songList, setSongList] = useState([]);
  const [songCode, setSongCode] = useState('');
  // isrc_id
  const [optIsrcId, setOptIsrcId] = useState([]);
  const [isrcInfo, setIsrcInfo] = useState({});
  // authorized_area
  const [initAuthorizedArea, setInitAuthorizedArea] = useState(true);
  const [initAuthorizedAreaList, setInitAuthorizedAreaList] = useState([]);
  const [AuthorizedAreaCountry2Disabled, setAuthorizedAreaCountry2Disabled] = useState(true);

  // api -----
  // getData
  const getData = (isId, updateType) => {
    dispatch({
      type: 'karaokeList/fetchMultiGetInfo',
      payload: {
        id: (isId),
        ui_updatetype: updateType,
      },
    });
  }

  // mount
  useEffect(() => {
    let initObj = {
      type: '1',  // 類型
      right_phase_id: '',  // only for save
      right_phase_date: '',  // only for ui
      record_phase_id: '',  // only for save
      record_phase_date: '',  // only for ui
      contract_code: '',  // 產品編號
      name: '',  // 產品名稱
      receivable_phase: '',  // 收款期別
      user_company_id: '',  // 使用者
      user_company_name: '',
      user_company_code: '',
      release_company_id: '',  // 發行商
      release_company_name: '',
      release_company_code: '',
      holder_company_id: '',  // 權利人
      holder_company_name: '',
      holder_company_code: '',
      release_date: '',  // 發行日期
      ui_sp_date: '',  // only for ui, 專屬期限
      start_date: '',  // 專屬期限 (開始)
      end_date: '',  // 專屬期限 (結束)
      sold_date: '',  // 銷售日期
      authorized_area_type: '2',  // 授權地區 > 類型 (1：無特定地區(只選國家)；2：只有特定地區(無國家)；3：地區包含特定國家；4：地區排除特定國家)
      authorized_area_id: '',
      authorized_country: [],
      authorized_area_type_radio: '0',  // only for ui
      authorized_area_id_input_countrys: [],  // only for ui
      authorized_area_type_select: '2',  // only for ui
      authorized_area_id_input2_countrys: [],  // only for ui
      wave: '',  // 波數
      income_source: '1',  // 收入來源
      album_id: '',  // 專輯名稱
      album_code: '',  // only for ui, 專輯編號
      album_name_zh: '',

      song_code: '',  // only for ui, 歌曲編號
      song_name: '',  // only for ui, 歌曲名稱
      distribution_format: '',  // 1: 實體, 2: 數位
      isrc_id: '',
      song_id: '',  // no ui

      auth_fee: '',  // 授權費
      syn_fee: '',
      mech_adv: '',
      flat_fee: '',
      exclude_op: false,

      price: '', // 售價
      cost: 0,  // 製作成本
      fee: 10,  // 手續費(%)
      tax_rate: 5,  // 稅(%)
      singer_pay: '',  // 計算金額

      notes: '',  // 備註
    };

    // init object
    form.setFieldsValue({
      ...initObj
    });

    switch (match.path) {
      case '/karaoke/update/:id':
        setUpdateType(1);
        getData(match.params.id, 1);
        break;
      case '/karaoke/update/copy/:id':
        setUpdateType(2);
        getData(match.params.id, 2);
        break;
      default:
        setUpdateType(0);
        getData();
        break;
    }
  }, [match.params.id]);

  // updateData
  useEffect(() => {
    let tmpUpdateType = 0;  // 0: add, 1: edit, 2: copy
    let obj = Object.assign({}, info);

    switch (match.path) {
      case '/karaoke/update/:id':
        tmpUpdateType = 1;
        break;
      case '/karaoke/update/copy/:id':
        tmpUpdateType = 2;
        break;
    }

    if (tmpUpdateType != 0) {
      setViewLoading(true);

      // 產品編號
      if (tmpUpdateType == 2) {
        obj.contract_code = availableContractCode;
      }

      // 詞曲結算期別
      if (tmpUpdateType == 1) {
        if (obj.right_phase_start_date && obj.right_phase_end_date) {
          obj.right_phase_date = obj.right_phase_start_date.split('-').join('/') + '-' + obj.right_phase_end_date.split('-').join('/');
        } else {
          obj.right_phase_date = '';
        }
      } else {
        obj.right_phase_date = '';
        obj.right_phase_id = '';
      }

      // 錄音結算期別
      if (tmpUpdateType == 1) {
        if (obj.record_phase_start_date && obj.record_phase_end_date) {
          obj.record_phase_date = obj.record_phase_start_date.split('-').join('/') + '-' + obj.record_phase_end_date.split('-').join('/');
        } else {
          obj.record_phase_date = '';
        }
      } else {
        obj.record_phase_date = '';
        obj.record_phase_id = '';
      }

      // 收款期別
      if (tmpUpdateType == 2) {
        obj.receivable_phase = '';
      }

      // 使用者
      setUserCompanyList([{
        id: (obj.user_company_id) ? (obj.user_company_id) : '',
        company_code: (obj.user_company_code) ? (obj.user_company_code) : '',
        name: (obj.user_company_name) ? (obj.user_company_name) : '',
      }]);
      setUserCompanyCodeLabel((obj.user_company_code) ? (obj.user_company_code) : '');

      // 發行商
      setReleaseCompanyList([{
        id: (obj.release_company_id) ? (obj.release_company_id) : '',
        company_code: (obj.release_company_code) ? (obj.release_company_code) : '',
        name: (obj.release_company_name) ? (obj.release_company_name) : '',
      }]);
      setReleaseCompanyCodeLabel((obj.release_company_code) ? (obj.release_company_code) : '');

      // 權利人
      setHolderCompanyList([{
        id: (obj.holder_company_id) ? (obj.holder_company_id) : '',
        company_code: (obj.holder_company_code) ? (obj.holder_company_code) : '',
        name: (obj.holder_company_name) ? (obj.holder_company_name) : '',
      }]);
      setHolderCompanyCodeLabel((obj.holder_company_code) ? (obj.holder_company_code) : '');

      // 發行日期
      obj.release_date = (typeof (info.release_date) == 'string') ? (info.release_date != '' ? moment(info.release_date) : null) : info.release_date;

      // 專屬期限
      const addMonthDate = (date, addNum) => {
        let tmpYear = (typeof (date) == 'string' && date != '') ? (date.split('-')[0]) : ('');
        let tmpMonth = (typeof (date) == 'string' && date != '') ? (date.split('-')[1]) : ('');

        if (tmpYear && tmpMonth) {
          tmpMonth = parseInt(tmpMonth) + addNum;

          if (tmpMonth > 12) {
            tmpYear = (parseInt(tmpYear) + parseInt(tmpMonth / 12)).toString();
            tmpMonth = (tmpMonth % 12 == 0) ? 1 : (tmpMonth % 12);
          }

          if (tmpMonth < 10) {
            tmpMonth = '0' + tmpMonth.toString();
          } else {
            tmpMonth = tmpMonth.toString();
          }

          return moment(tmpYear + '-' + tmpMonth + '-01');
        }

        return null;
      }

      if (tmpUpdateType == 1) {
        obj.ui_sp_date = [
          (typeof (info.start_date) == 'string') ? (info.start_date != '' ? moment(info.start_date) : null) : info.start_date,
          (typeof (info.end_date) == 'string') ? (info.end_date != '' ? moment(info.end_date) : null) : info.end_date,
        ];
      } else {
        obj.ui_sp_date = [
          addMonthDate(info.end_date, 1),
          addMonthDate(info.end_date, 6)
        ];
      }

      // 銷售日期
      if (tmpUpdateType == 1) {
        obj.sold_date = (typeof (info.sold_date) == 'string') ? (info.sold_date != '' ? moment(info.sold_date) : null) : info.sold_date;
      } else {
        obj.sold_date = null;
      }

      // 授權地區 -----
      let tempCountrysArr = [];

      // authorized_area_type
      obj.authorized_area_type = obj.authorized_area_type
      if (obj.authorized_area_type == '1') {
        obj.authorized_area_type_radio = '1';
        obj.authorized_area_type_select = '2';
      } else {
        obj.authorized_area_type_radio = '0';
        obj.authorized_area_type_select = (obj.authorized_area_type) ? obj.authorized_area_type : '2';
      }
      setAuthorizedAreaCountry2Disabled(obj.authorized_area_type_select == '2' ? true : false);

      // for authorized_area_id init option (only for ui)
      setInitAuthorizedArea(true);
      if (obj.authorized_area_id && obj.area_name) {
        setInitAuthorizedAreaList([{ id: obj.authorized_area_id, area_name: obj.area_name }]);
      } else {
        setInitAuthorizedAreaList([]);
      }

      // authorized_country
      if (obj.authorized_area_type && obj.authorized_area_type != '2' && obj.authorized_country && obj.authorized_country.length > 0) {
        for (let i = 0; i < obj.authorized_country.length; i++) {
          tempCountrysArr.push(obj.authorized_country[i].country_id);
        }
        if (obj.authorized_area_type == '1') {
          obj.authorized_area_id_input_countrys = tempCountrysArr;
          obj.authorized_area_id_input2_countrys = [];
        } else {
          obj.authorized_area_id_input_countrys = [];
          obj.authorized_area_id_input2_countrys = tempCountrysArr;
        }
      } else {
        obj.authorized_area_id_input_countrys = [];
        obj.authorized_area_id_input2_countrys = [];
      }

      // 專輯名稱
      setAlbumIdList([{
        id: (obj.album_id) ? (obj.album_id) : '',
        album_name_zh: (obj.album_name_zh) ? (obj.album_name_zh) : '',
        album_code: (obj.album_code) ? (obj.album_code) : ''
      }]);

      // song_code
      if (obj.song_id) {
        setSongList([{ id: obj.song_id, song_code: obj.song_code, song_name: obj.song_name }]);
        setSongCode(obj.song_code);
      } else {
        setSongList([]);
        setSongCode('');
      }

      // 支付金額不結算 OP 公司作者
      obj.exclude_op = commFn.convertToBool(obj.exclude_op);

      // set form data
      form.setFieldsValue({
        ...obj,
      });

      // onFieldsChange
      onFieldsChange();

      // ISRC 選項, 詞曲作者摘要, 表演者摘要
      let prGetIsrcData = getIsrcData(form.getFieldsValue().song_code);
      let prGetSongRightInfo = getSongRightData(
        (form.getFieldsValue().sold_date && typeof (form.getFieldsValue().sold_date) == 'object') ? (form.getFieldsValue().sold_date.format(dateFormat)) : null,
        form.getFieldsValue().song_code,
        form.getFieldsValue().distribution_format
      );
      // promise all
      Promise.all([prGetIsrcData, prGetSongRightInfo]).then(results => {
        setOptIsrcId(results[0]);
        setSongRightInfo(results[1]);

        // find isrc info
        if (results[0] && form.getFieldsValue().isrc_id) {
          for (let i = 0; i < results[0].length; i++) {
            let isrcItem = results[0][i];
            if (isrcItem.id == form.getFieldsValue().isrc_id) {
              setIsrcInfo({
                singer: (isrcItem.singer) ? (isrcItem.singer) : (''),
                version: (isrcItem.version) ? (isrcItem.version) : (''),
                tape_company: (isrcItem.tape_company) ? (isrcItem.tape_company.join(', ')) : ('')
              });

              break;
            }
          }
        }

        setViewLoading(false);
      });
    }
  }, [multiChangeId]);

  // save
  const onFinish = values => {
    setError([]);

    let saveObj = Object.assign({}, values);

    // id
    if (updateType == 1) {
      saveObj.id = match.params.id;
    }

    // parent_id
    if (updateType == 2) {
      saveObj.parent_id = match.params.id;
    } else {
      saveObj.parent_id = null;
    }

    // 收款期別
    if (form.getFieldValue()['receivable_phase']) {
      saveObj.receivable_phase = form.getFieldValue()['receivable_phase'].toUpperCase();
    }

    // 發行日期
    if (saveObj.release_date && typeof (saveObj.release_date) == 'object') {
      saveObj.release_date = form.getFieldValue()['release_date'].format(dateFormat);
    } else {
      saveObj.release_date = null;
    }

    // 專屬期限 (開始), 專屬期限 (結束)
    if (saveObj.ui_sp_date && saveObj.ui_sp_date[0] && saveObj.ui_sp_date[1]) {
      if (typeof (saveObj.ui_sp_date[0]) == 'object') {
        // saveObj.start_date = saveObj.ui_sp_date[0].format(monthFormat) + '-01';
        saveObj.start_date = saveObj.ui_sp_date[0].format(dateFormat)
      }

      if (typeof (saveObj.ui_sp_date[1]) == 'object') {
        // let tmpEndDate = saveObj.ui_sp_date[1].format(monthFormat);
        // saveObj.end_date = tmpEndDate + '-' + commFn.getMonthLastDay(tmpEndDate);
        saveObj.end_date = saveObj.ui_sp_date[1].format(dateFormat);
      }
    } else {
      saveObj.start_date = null;
      saveObj.end_date = null;
    }

    // 銷售日期
    if (saveObj.sold_date && typeof (saveObj.sold_date) == 'object') {
      saveObj.sold_date = form.getFieldValue()['sold_date'].format(dateFormat);
    } else {
      saveObj.sold_date = null;
    }

    // 授權地區 -----
    // convert 'authorized_area_type_radio', 'authorized_area_id_input_countrys', 'authorized_area_type_select', 'authorized_area_id_input2_countrys' to 'authorized_area_type', 'authorized_area_id', 'authorized_country_id'
    if (saveObj.authorized_area_type_radio == '1') {
      saveObj.authorized_area_type = '1';
      saveObj.authorized_area_id = '';
    } else {
      saveObj.authorized_area_type = saveObj.authorized_area_type_select;
    }

    // convert 'authorized_area_id_input_countrys', 'authorized_area_id_input2_countrys' >> saveObj.authorized_country_id...
    let OrgCountryList = info.authorized_country ? info.authorized_country.slice() : [];
    let tempCountryList = [];

    if (saveObj.authorized_area_type == '1') {
      tempCountryList = saveObj.authorized_area_id_input_countrys;
    } else if (saveObj.authorized_area_type != '2') {
      tempCountryList = saveObj.authorized_area_id_input2_countrys;
    }

    if (updateType == 1) {
      for (let i = 0; i < OrgCountryList.length; i++) {
        OrgCountryList[i].is_delete = '1';
      }

      if (saveObj.authorized_area_type != '2') {
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

      saveObj.authorized_country_id = OrgCountryList;
    } else {
      saveObj.authorized_country_id = tempCountryList.map((elem) => ({ country_id: elem }));
    }

    // check no coutry convert type 3,4 to 2
    // TODO
    if (saveObj.authorized_area_type == '3' || saveObj.authorized_area_type == '4') {
      let checkHasCountry = saveObj.authorized_country_id.filter((cElem) => !cElem.is_delete || cElem.is_delete == '0');

      if (checkHasCountry.length == 0) {
        saveObj.authorized_area_type = '2';
      }
    }

    // album_id
    if (!saveObj.album_id) {
      saveObj.album_id = null;
    }

    // 支付金額不結算 OP 公司作者
    saveObj.exclude_op = (saveObj.exclude_op) ? ('1') : ('0');

    // delete
    delete saveObj.authorized_area_type_radio;
    delete saveObj.authorized_area_type_select;
    delete saveObj.agency_area_id_input_countrys;
    delete saveObj.authorized_area_id_input2_countrys;
    delete saveObj.right_phase_date;
    delete saveObj.record_phase_date;
    delete saveObj.album_code;
    delete saveObj.ui_sp_date;

    // dispatch
    dispatch({
      type: (updateType != 1) ? 'karaokeList/fecthAddOrCopyKaraokeForm' : 'karaokeList/fecthEditKaraokeForm',
      payload: saveObj,
      callback: res => {
        if (res && res != 'error') {
          if (updateType != 1) {
            history.push(`/karaoke/adv/${res}`);
          } else {
            history.push(`/karaoke/adv/${match.params.id}`);
          }
        }
      }
    });
  };

  // getSongRightData
  const getSongRightData = (sold_date, song_code, type) => {
    return new Promise((resolve, reject) => {
      if (!sold_date || !song_code || !type) {
        resolve([]);
      } else {
        fetch(`${window.FRONTEND_WEB}/contract_karaoke/get_song_rights`, {
          method: 'post',
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          },
          body: JSON.stringify({
            sold_date: sold_date,
            song_code: song_code,
            type: type,
          })
        }).then(res => res.json())
          .then(jsonData => {
            let returnInfo = [];

            if (jsonData && jsonData.data && jsonData.data.length > 0) {
              returnInfo = jsonData.data.filter((elem) => elem.default_settle_company == '1').map((elem) => ({ ...elem }));
            }

            resolve(returnInfo);
          }).catch(err => {
            resolve([]);
          });
      }
    });
  }

  // getIsrcData
  const getIsrcData = (song_code) => {
    return new Promise((resolve, reject) => {
      fetch(`${window.FRONTEND_WEB}/song/detail_isrc?song_code=${song_code}`)
        .then(res => res.json())
        .then(jsonData => {
          if (jsonData && jsonData.data && jsonData.data.data_list) {
            let returnArr = jsonData.data.data_list.filter((fElem) => fElem.isrc_type == 'MV+卡拉ok').map((elem) => ({
              ...elem, value: elem.id, label: elem.isrc
            }));

            resolve(returnArr);
          } else {
            resolve([]);
          }
        }).catch(err => {
          resolve([]);
        });
    });
  }


  // valid behavior -----
  // fieldLabels
  const fieldLabels = {
    contract_code: '產品編號',
    name: '產品名稱',
    user_company_id: '使用者',
    release_company_id: '發行商',
    holder_company_id: '權利人',
    release_date: '發行日期',
    sold_date: '銷售日期',
    album_id: '專輯名稱',
    song_code: '歌曲名稱',
    distribution_format: '權利型態',
    isrc_id: 'ISRC',
    auth_fee: '授權費',
    syn_fee: 'Syn Fee',
    mech_adv: 'Mech Adv',
    flat_fee: 'Flat Fee',
    price: '售價',
    cost: '製作成本',
    fee: '手續費',
    tax_rate: '稅',
    singer_pay: '計算金額',
  };

  // valid
  const getErrorInfo = errors => {
    const errorCount = errors.filter(item => item.errors.length > 0).length;
    // fix Form.List field
    const cusFields = [];  // 'author_stage_name_id', 'numerator', 'denominator'
    const cusFieldId = '';  // 'split_table'

    if (!errors || errorCount === 0) {
      return null;
    }

    const scrollToField = fieldKey => {
      let labelNode = document.querySelector(`label[for="${fieldKey}"]`);

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
  // confirm
  const showConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要取消修改嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        if (updateType != 0) {
          history.push(`/karaoke/adv/${match.params.id}`);
        } else {
          history.push('/karaoke');
        }
      },
      onCancel() { },
    });
  }

  // changeIsrcId
  const changeIsrcId = (value, option) => {
    if (value) {
      setIsrcInfo({
        singer: (option.singer) ? (option.singer) : (''),
        version: (option.version) ? (option.version) : (''),
        tape_company: (option.tape_company) ? (option.tape_company.join(', ')) : ('')
      });
    } else {
      setIsrcInfo({});
      form.setFieldsValue({
        isrc_id: '',
      });
    }
  }

  // changeSongCode
  const changeSongCode = (value, option) => {
    if (value) {
      let prGetIsrcData = getIsrcData(value);
      let prGetSongRightInfo = getSongRightData(
        (form.getFieldsValue().sold_date && typeof (form.getFieldsValue().sold_date) == 'object') ? (form.getFieldsValue().sold_date.format(dateFormat)) : null,
        value,
        form.getFieldsValue().distribution_format
      );

      setViewLoading(true);

      if (option) {
        form.setFieldsValue({
          song_id: option.songid,
          song_name: option.label,
        });
      }

      // promise all
      Promise.all([prGetIsrcData, prGetSongRightInfo]).then(results => {
        if (form.getFieldsValue().isrc_id && results[0].filter((elem) => elem.id == form.getFieldsValue().isrc_id).length == 0) {
          changeIsrcId('');
        }
        setOptIsrcId(results[0]);

        setSongRightInfo(results[1]);
        setViewLoading(false);
      });

    } else {
      // clear song value
      form.setFieldsValue({
        song_id: '',
        song_name: '',
      });

      // clear isrc_id option
      setOptIsrcId([]);
      changeIsrcId('');

      // clear songRightInfo
      setSongRightInfo([]);
    }
  }

  const convertAndChangeSongCode = (option) => {
    if (option) {
      changeSongCode(option.text, option);
    } else {
      changeSongCode();
    }
  }

  // calFees
  const calFees = (fieldName) => {
    let tmpAuthFee = (!isNaN(parseInt(form.getFieldsValue().auth_fee))) ? (parseInt(form.getFieldsValue().auth_fee)) : 0;
    let tmpSynFee = (!isNaN(parseInt(form.getFieldsValue().syn_fee))) ? (parseInt(form.getFieldsValue().syn_fee)) : 0;
    let tmpMechAdvFee = (!isNaN(parseInt(form.getFieldsValue().mech_adv))) ? (parseInt(form.getFieldsValue().mech_adv)) : 0;
    let tmpExcludeOp = (!isNaN(parseInt(form.getFieldsValue().flat_fee))) ? (parseInt(form.getFieldsValue().flat_fee)) : 0;

    let tmpPrice = (!isNaN(parseInt(form.getFieldsValue().price))) ? (parseInt(form.getFieldsValue().price)) : 0;
    let tmpCost = (!isNaN(parseInt(form.getFieldsValue().cost))) ? (parseInt(form.getFieldsValue().cost)) : 0;
    let tmpFee = (!isNaN(parseInt(form.getFieldsValue().fee))) ? (parseInt(form.getFieldsValue().fee)) : 0;
    let tmpTaxRate = (!isNaN(parseInt(form.getFieldsValue().tax_rate))) ? (parseInt(form.getFieldsValue().tax_rate)) : 0;
    let tmpSingerPay = 0;

    if (fieldName == 'auth_fee') {
      tmpSynFee = Math.floor(tmpAuthFee * 5 * 1000) / 10000;
      tmpMechAdvFee = Math.floor(tmpAuthFee * 25 * 1000) / 100000;
      tmpExcludeOp = Math.floor(tmpAuthFee * 25 * 1000) / 100000;
    }

    // 計算金額: 未稅價
    if (tmpTaxRate > 0) {
      tmpSingerPay = commFn.calDiv(tmpPrice, (commFn.calDiv(100 + tmpTaxRate, 100)));
    }

    // 計算金額: * 扣除手續費
    tmpSingerPay = commFn.calMulti(tmpSingerPay, (commFn.calDiv((100 - tmpFee), 100)));

    // 計算金額: - 製作成本 - Syn fee - Mech Adv. - Flat fee
    tmpSingerPay = commFn.calSub(tmpSingerPay, tmpCost);
    tmpSingerPay = commFn.calSub(tmpSingerPay, tmpSynFee);
    tmpSingerPay = commFn.calSub(tmpSingerPay, tmpMechAdvFee);
    tmpSingerPay = commFn.calSub(tmpSingerPay, tmpExcludeOp);

    // 計算金額: 四捨五入
    tmpSingerPay = parseFloat(tmpSingerPay).toFixed(0);

    if (fieldName == 'auth_fee') {
      form.setFieldsValue({
        syn_fee: tmpSynFee,
        mech_adv: tmpMechAdvFee,
        flat_fee: tmpExcludeOp,
        singer_pay: tmpSingerPay,
      });
    } else {
      form.setFieldsValue({
        singer_pay: tmpSingerPay,
      });
    }
  }

  const onFieldsChange = () => {
    let formVal = form.getFieldsValue();

    if (formVal.type == '2') {
      setDisabledUiSpDate(true);
    } else {
      setDisabledUiSpDate(false);
    }

    if (
      formVal.right_phase_id
      && (settlePhaseList.enityRight && settlePhaseList.enityRight.current && settlePhaseList.enityRight.current.phase && settlePhaseList.enityRight.current.id && settlePhaseList.enityRight.current.id != formVal.right_phase_id)
      && (settlePhaseList.enityRight && settlePhaseList.enityRight.next && settlePhaseList.enityRight.next.phase && ((settlePhaseList.enityRight.next.id && settlePhaseList.enityRight.next.id != formVal.right_phase_id) || !settlePhaseList.enityRight.next.id))
    ) {
      setDisabledRightPhaseBtns(true);
    } else {
      setDisabledRightPhaseBtns(false);
    }

    if (
      formVal.record_phase_id
      && (settlePhaseList.enityRecord && settlePhaseList.enityRecord.current && settlePhaseList.enityRecord.current.phase && settlePhaseList.enityRecord.current.id && settlePhaseList.enityRecord.current.id != formVal.record_phase_id)
      && (settlePhaseList.enityRecord && settlePhaseList.enityRecord.next && settlePhaseList.enityRecord.next.phase && ((settlePhaseList.enityRecord.next.id && settlePhaseList.enityRecord.next.id != formVal.record_phase_id) || !settlePhaseList.enityRecord.next.id))
    ) {
      setDisabledRecordPhaseBtns(true);
    } else {
      setDisabledRecordPhaseBtns(false);
    }
  }

  return (
    <Spin
      tip="Loading..."
      spinning={viewLoading || loadingEditKaraokeForm || loadingAddOrCopyKaraokeForm || loadingMultiGetInfo}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onFieldsChange={onFieldsChange}
      >
        <PageHeaderWrapper
          title={
            (updateType == 0)
              ? ('新增卡拉 OK')
              : (
                (updateType == 1)
                  ? ('編輯卡拉 OK')
                  : ('續約卡拉 OK')
              )
          }
        >
          <Card
            bordered={false}
          >
            <Row gutter={[64, 24]}>
              <Col xs={24}>
                <Form.Item
                  name="type"
                >
                  <Radio.Group options={optType} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col xs={24} lg={12}>
                <Row gutter={[8, 8]}>
                  <Col flex="auto">
                    <Form.Item
                      name="right_phase_date"
                      label="詞曲結算期別"
                    >
                      <Input
                        disabled={true}
                      />
                    </Form.Item>
                    <Form.Item
                      name="right_phase_id"
                      style={{ display: 'none' }}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col
                    flex="180px"
                    style={{ marginTop: '30px' }}
                  >
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Button
                        className={styles.om_sp_m_rb}
                        disabled={disabledRightPhaseBtns}
                        onClick={() => {
                          if (settlePhaseList.enityRight && settlePhaseList.enityRight.current && settlePhaseList.enityRight.current.phase && settlePhaseList.enityRight.current.id) {
                            form.setFieldsValue({
                              right_phase_date: settlePhaseList.enityRight.current.phase,
                              right_phase_id: settlePhaseList.enityRight.current.id,
                            });
                          }
                        }}>當期</Button>
                      <Button
                        className={styles.om_sp_m_rb}
                        disabled={disabledRightPhaseBtns}
                        onClick={() => {
                          if (settlePhaseList.enityRight && settlePhaseList.enityRight.next && settlePhaseList.enityRight.next.phase && settlePhaseList.enityRight.next.id) {
                            form.setFieldsValue({
                              right_phase_date: settlePhaseList.enityRight.next.phase,
                              right_phase_id: settlePhaseList.enityRight.next.id,
                            });
                          }
                        }}>下期</Button>
                      <Button
                        disabled={disabledRightPhaseBtns}
                        onClick={() => {
                          form.setFieldsValue({
                            right_phase_date: null,
                            right_phase_id: null,
                          });
                        }}>清除</Button>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} lg={12}>
                <Row gutter={[8, 8]}>
                  <Col flex="auto">
                    <Form.Item
                      name="record_phase_date"
                      label="錄音結算期別"
                    >
                      <Input
                        disabled={true}
                      />
                    </Form.Item>
                    <Form.Item
                      name="record_phase_id"
                      style={{ display: 'none' }}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col
                    flex="180px"
                    style={{ marginTop: '30px' }}
                  >
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Button
                        className={styles.om_sp_m_rb}
                        disabled={disabledRecordPhaseBtns}
                        onClick={() => {
                          if (settlePhaseList.enityRecord && settlePhaseList.enityRecord.current && settlePhaseList.enityRecord.current.phase && settlePhaseList.enityRecord.current.id) {
                            form.setFieldsValue({
                              record_phase_date: settlePhaseList.enityRecord.current.phase,
                              record_phase_id: settlePhaseList.enityRecord.current.id,
                            });
                          }
                        }}>當期</Button>
                      <Button
                        className={styles.om_sp_m_rb}
                        disabled={disabledRecordPhaseBtns}
                        onClick={() => {
                          if (settlePhaseList.enityRecord && settlePhaseList.enityRecord.next && settlePhaseList.enityRecord.next.phase && settlePhaseList.enityRecord.next.id) {
                            form.setFieldsValue({
                              record_phase_date: settlePhaseList.enityRecord.next.phase,
                              record_phase_id: settlePhaseList.enityRecord.next.id,
                            });
                          }
                        }}>下期</Button>
                      <Button
                        disabled={disabledRecordPhaseBtns}
                        onClick={() => {
                          form.setFieldsValue({
                            record_phase_date: null,
                            record_phase_id: null,
                          });
                        }}>清除</Button>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
          <Card
            bordered={false}
            className={styles.card}
            title="基本資料"
          >
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="contract_code"
                  label={fieldLabels.contract_code}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Input
                    disabled={(updateType == 2) ? (true) : (false)}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="name"
                  label={fieldLabels.name}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Input
                    disabled={(updateType == 2) ? (true) : (false)}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="receivable_phase"
                  label="收款期別"
                  rules={[
                    {
                      validator(rule, values, callback) {
                        const valReg = /^[0-9]{4}[qQ]{1}[1-4]{1}$/;

                        if (values && !valReg.test(values)) {
                          callback('輸入格式錯誤，如：2021Q1');
                        } else {
                          callback();
                        }
                      }
                    }
                  ]}
                >
                  <Input placeholder="2021Q1" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <FormCompanyNameAPI
                  form={form}
                  isLabel={fieldLabels.user_company_id}
                  isName="user_company_id"
                  isSelectText="user_company_name"
                  isList={userCompanyList}
                  setIsList={setUserCompanyList}
                  cpCodeLabel={userCompanyCodeLabel}
                  setCpCodeLabel={setUserCompanyCodeLabel}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                  isDisabled={(updateType == 2) ? (true) : (false)}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <FormCompanyNameAPI
                  form={form}
                  isLabel={fieldLabels.release_company_id}
                  isName="release_company_id"
                  isSelectText="release_company_name"
                  isList={releaseCompanyList}
                  setIsList={setReleaseCompanyList}
                  cpCodeLabel={releaseCompanyCodeLabel}
                  setCpCodeLabel={setReleaseCompanyCodeLabel}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                  isDisabled={(updateType == 2) ? (true) : (false)}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <FormCompanyNameAPI
                  form={form}
                  isLabel={fieldLabels.holder_company_id}
                  isName="holder_company_id"
                  isSelectText="holder_company_name"
                  isList={holderCompanyList}
                  setIsList={setHolderCompanyList}
                  cpCodeLabel={holderCompanyCodeLabel}
                  setCpCodeLabel={setHolderCompanyCodeLabel}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                  isDisabled={(updateType == 2) ? (true) : (false)}
                />
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="release_date"
                  label={fieldLabels.release_date}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    disabled={(updateType == 2) ? (true) : (false)}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="ui_sp_date"
                  label="專屬期限"
                >
                  <RangePicker
                    format={dateFormat}
                    allowClear={true}
                    style={{ width: '100%' }}
                    disabled={disabledUiSpDate}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="sold_date"
                  label={fieldLabels.sold_date}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    onChange={() => {
                      changeSongCode(form.getFieldsValue().song_code);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <FormArea
                  form={form}
                  isLabel="授權地區"
                  isNameAreaRadioTypeRadio="authorized_area_type_radio"
                  isNameAreaIdInputCountrys="authorized_area_id_input_countrys"
                  isNameAreaId="authorized_area_id"
                  isNameAreaTypeSelect="authorized_area_type_select"
                  isNameAreaIdInput2Countrys="authorized_area_id_input2_countrys"
                  isInit={initAuthorizedArea}
                  setIsInit={setInitAuthorizedArea}
                  initAuthorizedAreaList={initAuthorizedAreaList}
                  authorizedAreaList={authorizedAreaList}
                  authorizedCountryList={authorizedCountryList}
                  isDisabledInput2Countrys={AuthorizedAreaCountry2Disabled}
                  setIsDisabledInput2Countrys={setAuthorizedAreaCountry2Disabled}
                  isRequired={true}
                  isAllDisabled={(updateType == 2) ? (true) : (false)}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="wave"
                  label="波數"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="income_source"
                  label="收入來源"
                >
                  <Radio.Group options={optIncomeSource} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card
            bordered={false}
            className={styles.card}
            title="授權內容"
          >
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <FormAlbumNameAPI
                  form={form}
                  isLabel={fieldLabels.album_id}
                  isName="album_id"
                  isSelectText="album_name_zh"
                  isList={albumIdList}
                  setIsList={setAlbumIdList}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="album_code"
                  label="專輯編號"
                >
                  <Input disabled={true} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <FormSongNameAPI
                  form={form}
                  isLabel={fieldLabels.song_code}
                  isName="song_code"
                  isSelectText="song_name"
                  isList={songList}
                  setIsList={setSongList}
                  codeLabel={songCode}
                  setCodeLabel={setSongCode}
                  changeFn={convertAndChangeSongCode}
                  rules={[
                    {
                      required: true,
                      message: '此欄位為必填'
                    }
                  ]}
                  hideCode={true}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="歌曲編號"
                >
                  <Input
                    disabled={true}
                    value={songCode}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="distribution_format"
                  label={fieldLabels.distribution_format}
                  style={{ marginTop: '30px' }}
                  rules={[
                    {
                      required: true,
                      message: '此欄位為必填'
                    }
                  ]}
                >
                  <Radio.Group
                    options={optDistributionFormat}
                    onChange={() => {
                      changeSongCode(form.getFieldsValue().song_code);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                className={styles.om_overflow_auto}
              >
                <table
                  className={styles.formTable}
                >
                  <thead>
                    <tr>
                      <th style={{ width: '50%' }}>詞曲作者摘要</th>
                      <th>授權費</th>
                      <th>Syn Fee</th>
                      <th>Mech Adv</th>
                      <th>Flat Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ paddingTop: '0' }}>
                        <table style={{ width: '100%' }}>
                          <tbody>
                            {(songRightInfo)
                              ? (songRightInfo.map((elem, idx) => (
                                <tr key={`trSongRight_${idx}`}>
                                  <td className={styles.om_bd_none}><p>{(elem.author_pen_name) ? (elem.author_pen_name) : ''}</p></td>
                                  <td className={styles.om_bd_none}><p>{(elem.song_right_type) ? (elem.song_right_type) : ''}</p></td>
                                  <td className={styles.om_bd_none}><p>{(elem.song_right_ratio) ? (`${elem.song_right_ratio}%`) : ''}</p></td>
                                </tr>
                              )))
                              : null
                            }
                          </tbody>
                        </table>
                      </td>
                      <td>
                        <Form.Item
                          name="auth_fee"
                          label={fieldLabels.auth_fee}
                          className={styles.om_hide_label}
                          rules={[
                            {
                              validator(rule, values, callback) {
                                if (!valid.checkPostiveIntAndZero(values)) {
                                  callback(valid.checkPostiveIntAndZero_msg);
                                } else {
                                  callback();
                                }
                              }
                            }
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            onChange={() => {
                              calFees('auth_fee');
                            }}
                          />
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item
                          name="syn_fee"
                          label={fieldLabels.syn_fee}
                          className={styles.om_hide_label}
                          rules={[
                            {
                              validator(rule, values, callback) {
                                if (!valid.checkPostiveIntAndZero(values)) {
                                  callback(valid.checkPostiveIntAndZero_msg);
                                } else {
                                  callback();
                                }
                              }
                            }
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            onChange={() => {
                              calFees();
                            }}
                          />
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item
                          name="mech_adv"
                          label={fieldLabels.mech_adv}
                          className={styles.om_hide_label}
                          rules={[
                            {
                              validator(rule, values, callback) {
                                if (!valid.checkPostiveIntAndZero(values)) {
                                  callback(valid.checkPostiveIntAndZero_msg);
                                } else {
                                  callback();
                                }
                              }
                            }
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            onChange={() => {
                              calFees();
                            }}
                          />
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item
                          name="flat_fee"
                          label={fieldLabels.flat_fee}
                          className={styles.om_hide_label}
                          rules={[
                            {
                              validator(rule, values, callback) {
                                if (!valid.checkPostiveIntAndZero(values)) {
                                  callback(valid.checkPostiveIntAndZero_msg);
                                } else {
                                  callback();
                                }
                              }
                            }
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            onChange={() => {
                              calFees();
                            }}
                          />
                        </Form.Item>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
              >
                <Form.Item
                  name="exclude_op"
                  style={{ textAlign: 'right' }}
                  valuePropName="checked"
                >
                  <Checkbox>支付金額不結算 OP 公司作者</Checkbox>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="isrc_id"
                  label={fieldLabels.isrc_id}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Select
                    options={optIsrcId}
                    onChange={changeIsrcId}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
                style={{ display: 'none' }}
              >
                <Form.Item
                  name="song_id"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                className={styles.om_overflow_auto}
              >
                <table
                  className={styles.formTable}
                  style={{ marginBottom: '24px' }}
                >
                  <thead>
                    <tr>
                      <th style={{ width: '40%' }}>表演者摘要</th>
                      <th>售價</th>
                      <th>製作成本</th>
                      <th>手續費</th>
                      <th>&nbsp;</th>
                      <th>稅</th>
                      <th>&nbsp;</th>
                      <th>計算金額</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <table>
                          <tbody>
                            <tr>
                              <td style={{ paddingTop: '0' }}>
                                <p>表演者：{(isrcInfo && isrcInfo.singer) ? (isrcInfo.singer) : ('')}</p>
                                <p>版本：{(isrcInfo && isrcInfo.version) ? (isrcInfo.version) : ('')}</p>
                                <p>母帶：{(isrcInfo && isrcInfo.tape_company) ? (isrcInfo.tape_company) : ('')}</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                      <td>
                        <Form.Item
                          name="price"
                          label={fieldLabels.price}
                          className={styles.om_hide_label}
                          rules={[
                            {
                              validator(rule, values, callback) {
                                if (!valid.checkPostiveIntAndZero(values)) {
                                  callback(valid.checkPostiveIntAndZero_msg);
                                } else {
                                  callback();
                                }
                              }
                            }
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            onChange={() => {
                              calFees();
                            }}
                          />
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item
                          name="cost"
                          label={fieldLabels.cost}
                          className={styles.om_hide_label}
                          rules={[
                            {
                              validator(rule, values, callback) {
                                if (!valid.checkPostiveIntAndZero(values)) {
                                  callback(valid.checkPostiveIntAndZero_msg);
                                } else {
                                  callback();
                                }
                              }
                            }
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            onChange={() => {
                              calFees();
                            }}
                          />
                        </Form.Item>
                      </td>
                      <td>
                        <Form.Item
                          name="fee"
                          label={fieldLabels.fee}
                          className={styles.om_hide_label}
                          rules={[
                            {
                              validator(rule, values, callback) {
                                if (!valid.checkPostiveIntAndZero(values)) {
                                  callback(valid.checkPostiveIntAndZero_msg);
                                } else {
                                  callback();
                                }
                              }
                            }
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            onChange={() => {
                              calFees();
                            }}
                          />
                        </Form.Item>
                      </td>
                      <td style={{ paddingLeft: '0' }}>
                        <p style={{ margin: '5px 0 0 0' }}>%</p>
                      </td>
                      <td>
                        <Form.Item
                          name="tax_rate"
                          label={fieldLabels.tax_rate}
                          className={styles.om_hide_label}
                          rules={[
                            {
                              validator(rule, values, callback) {
                                if (!valid.checkPostiveIntAndZero(values)) {
                                  callback(valid.checkPostiveIntAndZero_msg);
                                } else {
                                  callback();
                                }
                              }
                            }
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            onChange={() => {
                              calFees();
                            }}
                          />
                        </Form.Item>
                      </td>
                      <td style={{ paddingLeft: '0' }}>
                        <p style={{ margin: '5px 0 0 0' }}>%</p>
                      </td>
                      <td>
                        <Form.Item
                          name="singer_pay"
                          label={fieldLabels.singer_pay}
                          className={styles.om_hide_label}
                          rules={[
                            {
                              validator(rule, values, callback) {
                                if (!valid.checkPostiveIntAndZero(values)) {
                                  callback(valid.checkPostiveIntAndZero_msg);
                                } else {
                                  callback();
                                }
                              }
                            }
                          ]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={16}
              >
                <Form.Item
                  name="notes"
                  label="備註"
                >
                  <TextArea
                    rows={4}
                  />
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
};

export default connect(({ karaokeList, authorizedAreaList, authorizedCountryList, settlePhaseList, loading }) => ({
  karaokeList,
  authorizedAreaList,
  authorizedCountryList,
  settlePhaseList,
  loadingMultiGetInfo: loading.effects['karaokeList/fetchMultiGetInfo'],
  loadingAddOrCopyKaraokeForm: loading.effects['karaokeList/fecthAddOrCopyKaraokeForm'],
  loadingEditKaraokeForm: loading.effects['karaokeList/fecthEditKaraokeForm'],
}))(update);