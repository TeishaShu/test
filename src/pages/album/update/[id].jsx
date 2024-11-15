import React, { useState, useEffect } from 'react';
import {
  Form,
  Card,
  Row,
  Col,
  Input,
  Radio,
  Checkbox,
  Select,
  Button,
  Modal,
  Popover,
  Spin,
  DatePicker,
  InputNumber,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import { CloseCircleOutlined } from "@ant-design/icons";
import moment from 'moment';
import styles from '@/style/style.less';
import errorStyles from '@/style/error_style.less';
import FormAlbumCodeAPI from './components/FormAlbumCodeAPI';
import FormExtCode from './components/FormExtCode';
import FormAuthorStageNameAndOther from './components/FormAuthorStageNameAndOther';
import FormArea from '@/components/FormArea';
import FormCompanyNicknameAPI from '@/components/FormCompanyNicknameAPI';
import FormCountry from '@/components/FormCountry';
import FooterToolbar from '@/components/FooterToolbar';
import commFn from '@/fn/comm';

const { Option } = Select;
const { TextArea } = Input;

export const update = props => {
  const {
    loadingGetInfo,
    loadingEditAlbumForm,
    loadingAddAlbumForm,
    dispatch,
    match,
    authorizedAreaList,
    authorizedCountryList,
    contractSongList,
    albumList: { changeId, optType, optAlbumType, info },
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);
  const [updateType, setUpdateType] = useState(0);  // 0: add, 1: edit, 2: copy
  const dateFormat = 'YYYY-MM-DD';
  const [originalCodeList, setOriginalCodeList] = useState([]);
  const [extCodeList, setExtCodeList] = useState([]);
  const [authorList, setAuthorList] = useState([]);
  // original_code
  const [orginalCodeDisabled, setOriginalCodeDisabled] = useState(false);
  // release_company_id
  const [releaseCompanyList, setReleaseCompanyList] = useState([]);
  const [releaseCompanyCodeLabel, setReleaseCompanyCodeLabel] = useState('');
  // user_nickname_id
  const [userCompanyList, setUserCompanyList] = useState([]);
  const [userCompanyCodeLabel, setUserCompanyCodeLabel] = useState('');
  // authorize_area
  const [initAuthorizedArea, setInitAuthorizedArea] = useState(true);
  const [initAuthorizedAreaList, setInitAuthorizedAreaList] = useState([]);
  const [authorizedAreaCountry2Disabled, setAuthorizedAreaCountry2Disabled] = useState(true);

  // api -----
  // getData
  const getData = (pageId) => {
    dispatch({
      type: 'albumList/fetchMultiGetInfo',
      payload: {
        album_id: (pageId) ? (pageId) : undefined
      },
    });
  }

  // mount
  useEffect(() => {
    switch (match.path) {
      case '/album/update/:id':
        setUpdateType(1);
        break;
      case '/album/update/copy/:id':
        setUpdateType(2);
        break;
      default:
        setUpdateType(0);
        break;
    }

    const initObj = {
      is_external: '0',  // 外部專輯 > 0, 1
      is_debut: '0',  // 首發專輯 > 0, 1
      ui_type: [],  // only for ui (is_external, is_debut)
      album_code: '',  // 專輯編號
      album_name_zh: '',  // 專輯名稱
      album_name_en: '',  // 名稱 (英)
      original_code: '',  // 原始編號 (為哪張專輯的改版)
      original_album_id: '',
      upc: '',  // UPC/ENA
      project_code: '',  // Project Code
      ext_code: [''],  // Ext Code
      release_date: '',  // 發行日期
      author: '',  // 演唱人
      ui_author_id: '', // only for ui
      release_company_id: '',  // 發行者 > company_id
      release_nickname_id: '',  // 發行者 > company_nickname_id
      release_nickname: '',  // 發行者 > company_nickname
      release_company_code: '',  // 發行者 > company code
      user_company_id: '',  // 使用者 > user_company_id
      user_nickname_id: '',  // 使用者 > user_company_nickname_id
      user_nickname: '',  // 使用者 > user_company_nickname
      user_company_code: '',  // 使用者 > user_company_code
      release_year: '',  // 發行年限
      release_expiry_date: '',  // 發行到期日
      song_count: '',  // 曲數
      release_country_id: '',  // 發行地區 > id
      release_country: '',
      authorize_area_type: '',  // 授權地區 > 類型 (1：無特定地區(只選國家)；2：只有特定地區(無國家)；3：地區包含特定國家；4：地區排除特定國家)
      authorize_area_id: '',  // 授權地區 > 範圍 id
      authorize_area: '',  // 授權地區 > 範圍名稱
      authorized_country_id: [],  // 授權地區 > 特定地區
      authorized_area_type_radio: '0',
      authorized_area_id_input_countrys: [],
      authorized_area_type_select: '2',
      authorized_area_id_input2_countrys: [],
      currency_id: '1',  // 幣別 (預設'新台幣')
      version: '',  // 版別
      type_id: '',  // 專輯型態
      note: '',  // 備註
    };

    // init object
    form.setFieldsValue({
      ...initObj
    });

    if (match.params.id) {
      getData(match.params.id);
    } else {
      getData();
    }
  }, [match.params.id]);

  // updateData
  useEffect(() => {
    let obj = Object.assign({}, info);

    if (match.params.id) {
      // is_external, is_debut
      let tmpUiType = [];
      if (obj.is_external == '1') {
        tmpUiType.push('is_external')
      }
      if (obj.is_debut == '1') {
        tmpUiType.push('is_debut');
      }
      obj.ui_type = tmpUiType;

      // original_code, album_code
      if (match.path == '/album/update/copy/:id') {
        obj.original_code = info.album_code;
        setOriginalCodeDisabled(true);
        obj.album_code = '';
      } else {
        setOriginalCodeDisabled(false);
      }

      // Ext Code
      if (obj.ext_code && obj.ext_code.length > 0) {
        obj.ext_code = obj.ext_code.slice();
      } else {
        obj.ext_code = [''];
      }

      // release_date
      obj.release_date = (typeof (obj.release_date) == 'string') ? (obj.release_date != '' ? moment(obj.release_date) : null) : obj.release_date;

      // release_nickname_id   
      if (obj.release_nickname_id) {
        setReleaseCompanyList([{ id: obj.release_nickname_id, company_id: obj.release_company_id, nickname: obj.release_nickname, company_code: (obj.release_company_code ? obj.release_company_code : '') }]);
      } else {
        setReleaseCompanyList([]);
      }
      setReleaseCompanyCodeLabel((obj.release_company_code) ? (obj.release_company_code) : '');

      // user_nickname_id
      if (obj.user_nickname_id && obj.user_nickname_id != '0') {
        setUserCompanyList([{ id: obj.user_nickname_id, company_id: obj.user_company_id, nickname: obj.user_nickname, company_code: (obj.user_company_code ? obj.user_company_code : '') }]);
      } else {
        obj.user_nickname_id = '';
        obj.user_company_id = '';
        setUserCompanyList([]);
      }
      setUserCompanyCodeLabel((obj.user_company_code) ? (obj.user_company_code) : '');

      // release_year
      if (obj.release_year == '0') {
        obj.release_year = '';
      }

      // authorize_area_id
      if (obj.authorize_area_id == '0') {
        obj.authorize_area_id = '';
      }

      // authorize_area_type
      if (obj.authorize_area_type == '1') {
        obj.authorized_area_type_radio = '1';
        obj.authorized_area_type_select = '2';
      } else {
        obj.authorized_area_type_radio = '0';
        obj.authorized_area_type_select = (obj.authorize_area_type) ? obj.authorize_area_type : '2';
      }
      setAuthorizedAreaCountry2Disabled(obj.authorized_area_type_select == '2' ? true : false);

      // for authorize_area_id init option (only for ui)
      setInitAuthorizedArea(true);
      if (obj.authorize_area_id && obj.authorize_area) {
        setInitAuthorizedAreaList([{ id: obj.authorize_area_id, area_name: obj.authorize_area }]);
      } else {
        setInitAuthorizedAreaList([]);
      }

      // authorized_country_id
      let tempCountrysArr = [];
      if (obj.authorize_area_type && obj.authorize_area_type != '2' && obj.authorized_country_id && obj.authorized_country_id.length > 0) {
        for (let i = 0; i < obj.authorized_country_id.length; i++) {
          tempCountrysArr.push(obj.authorized_country_id[i].country_id);
        }
        if (obj.authorize_area_type == '1') {
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

      // release_expiry_date
      obj.release_expiry_date = (typeof (obj.release_expiry_date) == 'string') ? (obj.release_expiry_date != '' ? moment(obj.release_expiry_date) : null) : obj.release_expiry_date;

      // set data
      form.setFieldsValue({
        ...obj,
      });
    }
  }, [changeId]);

  // save
  const onFinish = values => {
    setError([]);
    const saveObj = Object.assign({}, values);

    // album_id
    if (updateType == 1) {
      saveObj.id = match.params.id;
    } else if (updateType == 2) {
      saveObj.original_album_id = match.params.id;
    }

    // is_external, is_debut
    saveObj.is_external = '0';
    saveObj.is_debut = '0';
    for (let i = 0; i < saveObj.ui_type.length; i++) {
      if (saveObj.ui_type[i] == 'is_external') {
        saveObj.is_external = '1';
      }

      if (saveObj.ui_type[i] == 'is_debut') {
        saveObj.is_debut = '1';
      }
    }
    delete saveObj.ui_type;

    // Ext Code
    let tmpExtCode = [];
    for (let i = 0; i < saveObj.ext_code.length; i++) {
      if (saveObj.ext_code[i] && saveObj.ext_code[i] != '') {
        tmpExtCode.push(saveObj.ext_code[i]);
      }
    }
    saveObj.ext_code = tmpExtCode;

    // release_date
    if (saveObj.release_date && typeof (saveObj.release_date) == 'object') {
      saveObj.release_date = form.getFieldValue()['release_date'].format(dateFormat);
    } else {
      saveObj.release_date = null;
    }

    // authorize_area -----
    // convert 'authorized_area_type_radio', 'authorized_area_id_input_countrys', 'authorized_area_type_select', 'authorized_area_id_input2_countrys' to 'authorize_area_type', 'authorize_area_id', 'authorized_country_id'
    if (saveObj.authorized_area_type_radio == '1') {
      saveObj.authorize_area_type = '1';
      saveObj.authorize_area_id = '';
    } else {
      saveObj.authorize_area_type = saveObj.authorized_area_type_select;
    }
    delete saveObj.authorized_area_type_radio;

    // convert 'authorized_area_id_input_countrys', 'authorized_area_id_input2_countrys' >> saveObj.authorized_country_id...
    let OrgCountryList = values.authorized_country_id ? values.authorized_country_id.slice() : [];
    let tempCountryList = [];

    if (saveObj.authorize_area_type == '1') {
      tempCountryList = saveObj.authorized_area_id_input_countrys;
    } else if (saveObj.authorize_area_type != '2') {
      tempCountryList = saveObj.authorized_area_id_input2_countrys;
    }

    if (updateType == 1) {
      for (let i = 0; i < OrgCountryList.length; i++) {
        OrgCountryList[i].is_delete = '1';
      }

      if (saveObj.authorize_area_type != '2') {
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

      saveObj.authorize_country_id = OrgCountryList.map((oElem) => oElem.country_id);
    } else {
      saveObj.authorize_country_id = tempCountryList.slice();
    }

    delete saveObj.authorized_country_id;
    delete saveObj.authorized_area_id_input_countrys;
    delete saveObj.authorized_area_id_input2_countrys;

    // release_expiry_date
    if (saveObj.release_expiry_date && typeof (saveObj.release_expiry_date) == 'object') {
      saveObj.release_expiry_date = form.getFieldValue()['release_expiry_date'].format(dateFormat);
    } else {
      saveObj.release_expiry_date = null;
    }

    dispatch({
      type: (updateType == 1) ? 'albumList/fetchEditAlbumForm' : 'albumList/fetchAddAlbumForm',
      payload: saveObj,
      callback: res => {
        let redirect = '';

        if (res && res != 'error') {
          if (updateType == 1) {
            redirect = `/album/adv/${match.params.id}`;
          } else {
            redirect = `/album/adv/${res}`;
          }

          history.push(redirect);
        }
      }
    });
  }

  // showConfirm
  const showConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要取消修改嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        let redirect = '';

        if (updateType != 0) {
          redirect = `/album/adv/${match.params.id}`;
        } else {
          redirect = `/album`;
        }

        history.push(redirect);
      },
      onCancel() { },
    });
  }

  // valid behavior -----
  // fieldLabels
  const fieldLabels = {
    album_code: '專輯編號',
    album_name_zh: '專輯名稱',
    release_date: '發行日期',
    author: '演唱人',
    song_count: '曲數',
    release_country_id: '發行地區',
    type_id: '專輯型態',
  };

  // valid
  const getErrorInfo = errors => {
    const errorCount = errors.filter(item => item.errors.length > 0).length;
    // fix Form.List field
    const cusFields = [];  // ['contract_author_types']
    const cusFieldId = '';  // 'contract_author_types'

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
    // console.log('Failed:', errorInfo);
    setError(errorInfo.errorFields);
  };

  return (
    <Spin
      tip="Loading..."
      spinning={
        (updateType == 0)
          ? (loadingAddAlbumForm || loadingGetInfo)
          : (
            (updateType == 1)
              ? (loadingEditAlbumForm || loadingGetInfo)
              : (loadingAddAlbumForm || loadingGetInfo)
          )
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      // onFieldsChange={onFieldsChange}
      >
        <PageHeaderWrapper
          title={
            (updateType == 1)
              ? ('編輯專輯')
              : ('新增專輯')
          }
        >
          <Card
            bordered={false}
          >
            <Row>
              <Col>
                <Form.Item
                  name="ui_type"
                  label="類型"
                  className={styles.om_hide_label}
                >
                  <Checkbox.Group
                    options={optType}
                  />
                </Form.Item>
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
                  name="album_code"
                  label={fieldLabels.album_code}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Input
                    disabled={(updateType == 1) ? (true) : (false)}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="album_name_zh"
                  label={fieldLabels.album_name_zh}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="album_name_en"
                  label="名稱(英)"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <FormAlbumCodeAPI
                  form={form}
                  isLabel="原始編號(為哪張專輯的改版)"
                  isName="original_code"
                  isList={originalCodeList}
                  setIsList={setOriginalCodeList}
                  isDisabled={orginalCodeDisabled}
                  meAlbumCode={(updateType == 1 && info && info.album_code) ? (info.album_code) : ''}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="upc"
                  label="UPC/ENA"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="project_code"
                  label="Project Code"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                {/* 
                <Form.Item
                  name="ext_code"
                  label="Ext Code"
                >
                  <Input />
                </Form.Item>
                */}
                <FormExtCode
                  form={form}
                  extCodeList={extCodeList}
                  setExtCodeList={setExtCodeList}
                />
              </Col>
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
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <FormAuthorStageNameAndOther
                  form={form}
                  isName="author"
                  isLabel={fieldLabels.author}
                  isList={authorList}
                  setIsList={setAuthorList}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <FormCompanyNicknameAPI
                  form={form}
                  isLabel="發行者"
                  isName="release_nickname_id"
                  isSelectText="release_company_name"
                  isList={releaseCompanyList}
                  setIsList={setReleaseCompanyList}
                  cpCodeLabel={releaseCompanyCodeLabel}
                  setCpCodeLabel={setReleaseCompanyCodeLabel}
                  isCompanyIdName="release_company_id"
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <FormCompanyNicknameAPI
                  form={form}
                  isLabel="使用者"
                  isName="user_nickname_id"
                  isSelectText="user_nickname"
                  isList={userCompanyList}
                  setIsList={setUserCompanyList}
                  cpCodeLabel={userCompanyCodeLabel}
                  setCpCodeLabel={setUserCompanyCodeLabel}
                  isCompanyIdName="user_company_id"
                />
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="release_year"
                  label="發行年限"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="release_expiry_date"
                  label="發行到期日"
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
                <Form.Item
                  name="song_count"
                  label={fieldLabels.song_count}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card
            bordered={false}
            className={styles.card}
          >
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <FormCountry
                  isLabel={fieldLabels.release_country_id}
                  isName="release_country_id"
                  isRules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                  isList={
                    (authorizedCountryList.countryList)
                      ? (authorizedCountryList.countryList)
                      : []}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <FormArea
                  form={form}
                  isLabel="授權地區"
                  isNameAreaRadioTypeRadio="authorized_area_type_radio"
                  isNameAreaIdInputCountrys="authorized_area_id_input_countrys"
                  isNameAreaId="authorize_area_id"
                  isNameAreaTypeSelect="authorized_area_type_select"
                  isNameAreaIdInput2Countrys="authorized_area_id_input2_countrys"
                  isInit={initAuthorizedArea}
                  setIsInit={setInitAuthorizedArea}
                  initAuthorizedAreaList={
                    (updateType != 0)
                      ? (initAuthorizedAreaList)
                      : ([])
                  }
                  authorizedAreaList={authorizedAreaList}
                  authorizedCountryList={authorizedCountryList}
                  isDisabledInput2Countrys={authorizedAreaCountry2Disabled}
                  setIsDisabledInput2Countrys={setAuthorizedAreaCountry2Disabled}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="currency_id"
                  label="幣別"
                >
                  <Select
                    options={contractSongList.optCurrency}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="version"
                  label="版別"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="type_id"
                  label={fieldLabels.type_id}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Select
                    options={optAlbumType.filter((elem) => elem.value != '0')}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={16}
              >
                <Form.Item
                  name="note"
                  label="備註"
                >
                  <TextArea rows={4} />
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
            onClick={() => {
              form?.submit();
            }}
          >送出</Button>
        </FooterToolbar>
      </Form>
    </Spin>
  );
}

export default connect(({ authorizedAreaList, authorizedCountryList, contractSongList, albumList, loading }) => ({
  authorizedAreaList,
  authorizedCountryList,
  contractSongList,
  albumList,
  loadingGetInfo: loading.effects['albumList/fetchMultiGetInfo'],
  loadingEditAlbumForm: loading.effects['albumList/fetchEditAlbumForm'],
  loadingAddAlbumForm: loading.effects['albumList/fetchAddAlbumForm'],
}))(update);