import React, { useState, useEffect, useRef } from 'react';
import {
  Form,
  Card,
  Row,
  Col,
  Input,
  InputNumber,
  Radio,
  Select,
  Button,
  Modal,
  Popover,
  Spin,
  DatePicker,
  notification,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import { CloseCircleOutlined, PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import moment from 'moment';
import styles from '@/style/style.less';
import valid from '@/fn/valid';
import errorStyles from '@/style/error_style.less';
import FormCompanyNameAPI from '@/components/FormCompanyNameAPI';
import FormArea from '@/components/FormArea';
import FooterToolbar from '@/components/FooterToolbar';
import FormUserCompany from './components/FormUserCompany';
import ComContent from './components/ComContent';

const { TextArea } = Input;

export const update = props => {
  const {
    dispatch,
    match,
    loadingMultiGetInfo,
    loadingAddMiscForm,
    loadingEditMiscForm,
    authorizedAreaList,
    authorizedCountryList,
    settlePhaseList,
    exchangeRateList,
    karaokeList,
    miscList: { multiChangeId, info, miscFormTmpContent, miscFormTmpSubmit },
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const dateFormat = 'YYYY-MM-DD';
  // const monthFormat = 'YYYY-MM';
  const [viewLoading, setViewLoading] = useState(false);
  // author_phase_id
  const [disabledAuthorPhaseBtns, setDisabledAuthorPhaseBtns] = useState(false);
  // song_phase_id
  const [disabledSongPhaseBtns, setDisabledSongPhaseBtns] = useState(false);
  // ui_sp_date
  const [disabledUiSpDate, setDisabledUiSpDate] = useState(false);
  // holder_company_id
  const [holderCompanyList, setHolderCompanyList] = useState([]);
  const [holderCompanyCodeLabel, setHolderCompanyCodeLabel] = useState('');
  // user_company_id
  const [userCompanyIdList, setUserCompanyIdList] = useState([]);
  // authorized_area
  const [initAuthorizedArea, setInitAuthorizedArea] = useState(true);
  const [initAuthorizedAreaList, setInitAuthorizedAreaList] = useState([]);
  const [AuthorizedAreaCountry2Disabled, setAuthorizedAreaCountry2Disabled] = useState(true);
  // sold_date
  const [soldDate, setSoldDate] = useState('');
  const [changeSoldDate, setChangeSoldDate] = useState(0);
  // ONLY FOR TEST
  const [isSubmit, setIsSubmit] = useState(0);
  const refTmpSubmitTimer = useRef(null);

  // api -----
  // getData
  const getData = (isId) => {
    dispatch({
      type: 'miscList/fetchMultiGetInfo',
      payload: {
        cm_id: (isId),
      },
    });
  }

  useEffect(() => {
    return () => {
      clearTimeout(refTmpSubmitTimer.current);
    }
  }, []);

  // mount
  useEffect(() => {
    clearTimeout(refTmpSubmitTimer.current);

    let initObj = {
      need_sign_back: '0',  // 合約回覆
      author_phase_id: '',  // 詞曲計算期別 (only for save)
      author_phase_date: '',  // 詞曲計算期別 (only for ui)
      song_phase_id: '',  // 錄音計算期別 (only for save)
      song_phase_date: '',  // 錄音計算期別 (only for ui)
      contract_code: '',  // 合約編號
      name: '',  // 產品標題
      our_contract_code: '',  // 我方紙本合約編號
      receivable_phase: '',  // 收款期別
      income_source: '1',  // 收入來源
      currency_id: '',  // 幣別
      exchange_rate: '',  // 匯率
      holder_company_id: '',  // 權利人
      holder_company_name: '',
      user_company_id: '',  // 使用者
      sold_date: '',  // 銷售日期
      issued_date: '',  // 簽約日期
      start_date: '',  // 合約開始
      end_date: '',  // 合約到期
      expiration_date: '',  // 合約終止
      contract_month: '',  // 合約年限
      ui_contract_year: '',  // 合約年限 (only for ui)
      ui_contract_month: '0',  // 合約年限 (only for ui)
      is_permanent: '0',  // 永久
      is_exclusive: '0',  // 專屬
      authorized_area_type: '2',  // 授權地區 > 類型 (1：無特定地區(只選國家)；2：只有特定地區(無國家)；3：地區包含特定國家；4：地區排除特定國家)
      authorized_area_id: '',
      authorized_country_id: [],
      authorized_area_type_radio: '0',  // only for ui
      authorized_area_id_input_countrys: [],  // only for ui
      authorized_area_type_select: '2',  // only for ui
      authorized_area_id_input2_countrys: [],  // only for ui
      note1: '',  // 備註1
      note2: '',  // 備註2
      note3: '',  // 備註3
      tax_rate: '',
      // content: [],  // 授權內容
    };

    // init object
    form.setFieldsValue({
      ...initObj
    });

    if (match.params.id) {
      setIsEdit(true);
      getData(match.params.id);
    } else {
      setIsEdit(false);
      getData();
    }
  }, [match.params.id]);

  // updateData
  useEffect(() => {
    let obj = Object.assign({}, info);

    if (match.params.id) {
      // 詞曲結算期別
      obj.author_phase_date = (info.author_phase) ? (info.author_phase) : '';

      // 錄音結算期別
      obj.song_phase_date = (info.song_phase) ? (info.song_phase) : '';

      // 銷售日期
      let tmpSoldDate = (typeof (info.sold_date) == 'string') ? (info.sold_date != '' ? moment(info.sold_date) : null) : info.sold_date;
      obj.sold_date = tmpSoldDate;
      setSoldDate(tmpSoldDate ? tmpSoldDate.format(dateFormat) : '');

      // 簽約日期
      obj.issued_date = (typeof (info.issued_date) == 'string') ? (info.issued_date != '' ? moment(info.issued_date) : null) : info.issued_date;

      // 權利人
      if (obj.holder_company_id) {
        setHolderCompanyList([{ id: obj.holder_company_id, name: obj.holder_company_name, company_code: '' }]);
        setHolderCompanyCodeLabel(obj.holder_company_code);
      } else {
        setHolderCompanyList([]);
        setHolderCompanyCodeLabel('');
      }

      // 合約年限
      let tmpYear = '';
      let tmpMon = 0;
      if (obj.contract_month && !isNaN(parseInt(obj.contract_month))) {
        tmpYear = parseInt(parseInt(obj.contract_month) / 12).toString();
        tmpMon = (parseInt(obj.contract_month) % 12).toString();
      }
      obj.ui_contract_year = tmpYear;
      obj.ui_contract_month = tmpMon.toString();

      // 合約開始
      obj.start_date = (typeof (info.start_date) == 'string') ? (info.start_date != '' ? moment(info.start_date) : null) : info.start_date;

      // 合約到期
      obj.end_date = (typeof (info.end_date) == 'string') ? (info.end_date != '' ? moment(info.end_date) : null) : info.end_date;

      // 合約終止
      obj.expiration_date = (typeof (info.expiration_date) == 'string') ? (info.expiration_date != '' ? moment(info.expiration_date) : null) : info.expiration_date;

      // 授權地區 -----
      let tempCountrysArr = [];

      // authorized_area_type
      obj.authorized_area_type = obj.authorized_area_type;
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

      // authorized_country_id
      if (obj.authorized_area_type && obj.authorized_area_type != '2' && obj.authorized_country_id && obj.authorized_country_id.length > 0) {
        for (let i = 0; i < obj.authorized_country_id.length; i++) {
          tempCountrysArr.push(obj.authorized_country_id[i].country_id);
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

      // set form data
      form.setFieldsValue({
        ...obj,
      });

      // onFieldsChange
      onFieldsChange();
    } else {

    }
  }, [multiChangeId]);

  // test
  const test = () => {
    let tmpNum = 0;

    for (let i = 0; i < miscFormTmpContent.length; i++) {
      if (!miscFormTmpSubmit[`content_${i}`]) {
        refTmpSubmitTimer.current = setTimeout(() => {
          form.submit();
        }, 3000);

        break;
      } else {
        tmpNum++;
      }
    }

    if (tmpNum == miscFormTmpContent.length) {
      dispatch({
        type: 'miscList/fetchCheckFormValid',
        payload: {},
        callback: (result) => {
          let redirect = `/misc/adv/${match.params.id}`;

          setViewLoading(false);

          if (result != '' && result != 'error' && !result.errValid) {
            if (!isEdit) {
              redirect = `/misc/adv/${result}`;
            }

            history.push(redirect);
          } else if (result && result.errValid) {
            notification.error({
              duration: 0,
              icon: <ExclamationCircleFilled style={{ color: '#F9B006' }} />,
              message: `授權內容錯誤`,
              description: (<div className={styles.om_notification_text} dangerouslySetInnerHTML={{ __html: result.errValid }}></div>)
            });
          }
        }
      });

      clearTimeout(refTmpSubmitTimer.current);
    }
  }
  useEffect(() => {
    if (isSubmit > 0) {
      test();
    }
  }, [isSubmit]);

  // save
  const onFinish = values => {
    setViewLoading(true);
    setError([]);

    let saveObj = Object.assign({}, values);

    if (isEdit) {
      saveObj.id = match.params.id;
    }

    // 詞曲結算期別
    if (!saveObj.author_phase_id) {
      saveObj.author_phase_id = null;
    }

    // 錄音結算期別
    if (!saveObj.song_phase_id) {
      saveObj.song_phase_id = null;
    }

    // 收款期別
    if (saveObj.receivable_phase) {
      saveObj.receivable_phase = saveObj.receivable_phase.toUpperCase();
    }

    // 銷售日期
    if (saveObj.sold_date && typeof (saveObj.sold_date) == 'object') {
      saveObj.sold_date = form.getFieldValue()['sold_date'].format(dateFormat);
    } else {
      saveObj.sold_date = null;
    }

    // 簽約日期
    if (saveObj.issued_date && typeof (saveObj.issued_date) == 'object') {
      saveObj.issued_date = form.getFieldValue()['issued_date'].format(dateFormat);
    } else {
      saveObj.issued_date = null;
    }

    // 合約開始
    if (saveObj.start_date && typeof (saveObj.start_date) == 'object') {
      saveObj.start_date = form.getFieldValue()['start_date'].format(dateFormat);
    } else {
      saveObj.start_date = null;
    }

    // 合約到期
    if (saveObj.end_date && typeof (saveObj.end_date) == 'object') {
      saveObj.end_date = form.getFieldValue()['end_date'].format(dateFormat);
    } else {
      saveObj.end_date = null;
    }

    // 合約終止
    if (saveObj.expiration_date && typeof (saveObj.expiration_date) == 'object') {
      saveObj.expiration_date = form.getFieldValue()['expiration_date'].format(dateFormat);
    } else {
      saveObj.expiration_date = null;
    }

    // 合約年限
    let hasContractMonthVal = false;
    let tmpContractMonth = 0;
    if (saveObj.ui_contract_year || saveObj.ui_contract_year === 0) {
      hasContractMonthVal = true;
      tmpContractMonth += (parseInt(saveObj.ui_contract_year) * 12);
    }
    if (saveObj.ui_contract_month && saveObj.ui_contract_month != '0') {
      hasContractMonthVal = true;
      tmpContractMonth += parseInt(saveObj.ui_contract_month);
    }
    saveObj.contract_month = (hasContractMonthVal) ? (tmpContractMonth) : (null);

    // 授權地區 -----
    if (saveObj.authorized_area_type_radio == '1') {
      saveObj.authorized_area_type = '1';
      saveObj.authorized_area_id = null;
    } else {
      saveObj.authorized_area_type = saveObj.authorized_area_type_select;
      saveObj.authorized_area_id = (saveObj.authorized_area_id) ? (saveObj.authorized_area_id) : null;
    }

    let OrgCountryList = info.authorized_country_id ? info.authorized_country_id.slice() : [];
    let tempCountryList = [];

    if (saveObj.authorized_area_type == '1') {
      tempCountryList = saveObj.authorized_area_id_input_countrys;
    } else if (saveObj.authorized_area_type != '2') {
      tempCountryList = saveObj.authorized_area_id_input2_countrys;
    }

    if (isEdit) {
      if (!saveObj.authorized_country_id) {
        saveObj.authorized_country_id = [];
      }

      for (let i = 0; i < tempCountryList.length; i++) {
        let findItem = false;
        for (let j = 0; j < OrgCountryList.length; j++) {
          if (tempCountryList[i] == OrgCountryList[j].country_id) {
            findItem = true;
            OrgCountryList.splice(j, 1);
            break;
          }
        }

        // new_countries
        if (!findItem) {
          saveObj.authorized_country_id.push({ country_id: tempCountryList[i] });
        }
      }

      // delete_id
      for (let k = 0; k < OrgCountryList.length; k++) {
        saveObj.authorized_country_id.push({ id: OrgCountryList[k].id, is_delete: 1 });
      }
    } else {
      saveObj.authorized_country_id = tempCountryList.slice();
    }

    // check no coutry convert type 3,4 to 2
    if (saveObj.authorized_area_type == '3' || saveObj.authorized_area_type == '4') {
      let checkHasCountry = saveObj.authorized_country_id.filter((cElem) => !cElem.is_delete || cElem.is_delete == '0');

      if (checkHasCountry.length == 0) {
        saveObj.authorized_area_type = '2';
      }
    }

    // 匯率
    saveObj.exchange_rate = (saveObj.exchange_rate) ? (saveObj.exchange_rate) : (null);

    // delete parameter
    delete saveObj.authorized_area_type_radio;
    delete saveObj.authorized_area_type_select;
    delete saveObj.authorized_area_id_input2_countrys;
    delete saveObj.authorized_area_id_input_countrys;
    delete saveObj.ui_contract_year;
    delete saveObj.ui_contract_month;

    // 授權內容 -----
    dispatch({
      type: 'miscList/setMiscFormTmpSubmit',
      payload: {
        key: 'info',
        value: saveObj,
      }
    });
    setIsSubmit((prev) => prev + 1);
  };

  // valid behavior -----
  // fieldLabels
  const fieldLabels = {
    contract_code: '合約編號',
    name: '產品標題',
    receivable_phase: '收款期別',
    holder_company_id: '權利人',
    user_company_id: '使用者',
    sold_date: '銷售日期',
    currency_id: '幣別',
    exchange_rate: '匯率',
    // content
    content_name: '產品名稱',
    content_use_type_id: '使用方式',
    content_use_type_id2: '使用方式',
    content_song_id: '歌曲名稱',
    content_distribution_format: '權利型態',
  };

  // valid
  const getErrorInfo = errors => {
    const errorCount = errors.filter(item => item.errors.length > 0).length;
    const cusFieldId = 'content';  // 'content'

    if (!errors || errorCount === 0) {
      return null;
    }

    const scrollToField = fieldKey => {
      let labelNode = document.querySelector(`label[for="${fieldKey}"]`);

      if (fieldKey.indexOf(cusFieldId) >= 0) {
        labelNode = document.getElementById(fieldKey);
      }

      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };

    const errorList = errors.map(err => {
      if (!err || err.errors.length === 0) {
        return null;
      }

      // for custom souvenir field
      let key = (err.name.length > 1) ? ('content_' + err.name[2]) : (err.name[0]);
      let renderFieldName = fieldLabels[key];
      let renderSelector = key;

      if (err.name.length > 1) {
        key = '';
        for (let i = 0; i < err.name.length; i++) {
          key += err.name[i];
        }
      }

      if (err.name.length > 1) {
        renderSelector = `${cusFieldId}_${err.name[1]}`;
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
        if (match.params.id) {
          history.push(`/misc/adv/${match.params.id}`);
        } else {
          history.push('/misc');
        }
      },
      onCancel() { },
    });
  }

  // addContent
  const addContent = (obj) => {
    dispatch({
      type: 'miscList/setMiscFormTmpContent',
      payload: obj,
    });
  }

  // onFieldsChange
  const onFieldsChange = (changedFields, allFields) => {
    let formVal = form.getFieldsValue();

    // 詞曲結算期別, 錄音結算期別
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
      setDisabledAuthorPhaseBtns(true);
    } else {
      setDisabledAuthorPhaseBtns(false);
    }
    if (
      formVal.record_phase_id
      && (settlePhaseList.enityRecord && settlePhaseList.enityRecord.current && settlePhaseList.enityRecord.current.phase && settlePhaseList.enityRecord.current.id && settlePhaseList.enityRecord.current.id != formVal.record_phase_id)
      && (settlePhaseList.enityRecord && settlePhaseList.enityRecord.next && settlePhaseList.enityRecord.next.phase && ((settlePhaseList.enityRecord.next.id && settlePhaseList.enityRecord.next.id != formVal.record_phase_id) || !settlePhaseList.enityRecord.next.id))
    ) {
      setDisabledSongPhaseBtns(true);
    } else {
      setDisabledSongPhaseBtns(false);
    }
  }

  return (
    <Spin
      tip="Loading..."
      spinning={loadingAddMiscForm || loadingEditMiscForm || viewLoading || loadingMultiGetInfo}
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
            (isEdit)
              ? ('編輯其他授權')
              : ('新增其他授權')
          }
        >
          <Card
            bordered={false}
          >
            <Row gutter={[64, 24]}>
              <Col xs={24}>
                <Form.Item
                  name="need_sign_back"
                  label="合約回覆"
                >
                  <Radio.Group options={[
                    { value: '1', label: '是' },
                    { value: '0', label: '否' },
                  ]} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col xs={24} lg={12}>
                <Row gutter={[8, 8]}>
                  <Col flex="auto">
                    <Form.Item
                      name="author_phase_date"
                      label="詞曲結算期別"
                    >
                      <Input
                        disabled={true}
                      />
                    </Form.Item>
                    <Form.Item
                      name="author_phase_id"
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
                        disabled={disabledAuthorPhaseBtns}
                        onClick={() => {
                          if (settlePhaseList.enityRight && settlePhaseList.enityRight.current && settlePhaseList.enityRight.current.phase && settlePhaseList.enityRight.current.id) {
                            form.setFieldsValue({
                              author_phase_date: settlePhaseList.enityRight.current.phase,
                              author_phase_id: settlePhaseList.enityRight.current.id,
                            });
                          }
                        }}>當期</Button>
                      <Button
                        className={styles.om_sp_m_rb}
                        disabled={disabledAuthorPhaseBtns}
                        onClick={() => {
                          if (settlePhaseList.enityRight && settlePhaseList.enityRight.next && settlePhaseList.enityRight.next.phase && settlePhaseList.enityRight.next.id) {
                            form.setFieldsValue({
                              author_phase_date: settlePhaseList.enityRight.next.phase,
                              author_phase_id: settlePhaseList.enityRight.next.id,
                            });
                          }
                        }}>下期</Button>
                      <Button
                        disabled={disabledAuthorPhaseBtns}
                        onClick={() => {
                          form.setFieldsValue({
                            author_phase_date: null,
                            author_phase_id: null,
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
                      name="song_phase_date"
                      label="錄音結算期別"
                    >
                      <Input
                        disabled={true}
                      />
                    </Form.Item>
                    <Form.Item
                      name="song_phase_id"
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
                        disabled={disabledSongPhaseBtns}
                        onClick={() => {
                          if (settlePhaseList.enityRecord && settlePhaseList.enityRecord.current && settlePhaseList.enityRecord.current.phase && settlePhaseList.enityRecord.current.id) {
                            form.setFieldsValue({
                              song_phase_date: settlePhaseList.enityRecord.current.phase,
                              song_phase_id: settlePhaseList.enityRecord.current.id,
                            });
                          }
                        }}>當期</Button>
                      <Button
                        className={styles.om_sp_m_rb}
                        disabled={disabledSongPhaseBtns}
                        onClick={() => {
                          if (settlePhaseList.enityRecord && settlePhaseList.enityRecord.next && settlePhaseList.enityRecord.next.phase && settlePhaseList.enityRecord.next.id) {
                            form.setFieldsValue({
                              song_phase_date: settlePhaseList.enityRecord.next.phase,
                              song_phase_id: settlePhaseList.enityRecord.next.id,
                            });
                          }
                        }}>下期</Button>
                      <Button
                        disabled={disabledSongPhaseBtns}
                        onClick={() => {
                          form.setFieldsValue({
                            song_phase_date: null,
                            song_phase_id: null,
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
                    { required: true, message: '此欄位為必填' },
                    {
                      validator(rule, values, callback) {
                        let result = true;

                        if (values) {
                          result = valid.checkNotChinese(values);
                        }

                        if (result != false) {
                          callback();
                        } else {
                          callback(valid.checkNotChinese_msg);
                        }
                      }
                    },
                  ]}
                >
                  <Input
                    disabled={(isEdit) ? (true) : (false)}
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
                    { required: true, message: '此欄位為必填' },
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
                  name="our_contract_code"
                  label="我方紙本合約編號"
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
                <Form.Item
                  name="receivable_phase"
                  label={fieldLabels.receivable_phase}
                  rules={[
                    {
                      validator(rule, values, callback) {
                        let receivablePhaseReg = /^[0-9]{4}[qQ]{1}[1-4]{1}$/;
                        let result = true;

                        if (values && !receivablePhaseReg.test(values)) {
                          result = false;
                        }

                        if (result != false) {
                          callback();
                        } else {
                          callback('輸入格式錯誤，如：2021Q1');
                        }
                      }
                    },
                  ]}
                >
                  <Input placeholder="2021Q1" />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="issued_date"
                  label="簽約日期"
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
                  name="income_source"
                  label="收入來源"
                  rules={[
                    { required: true, message: '此欄位為必填' },
                  ]}
                >
                  <Radio.Group options={karaokeList.optIncomeSource} />
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
                  isLabel={fieldLabels.holder_company_id}
                  isName="holder_company_id"
                  isSelectText="holder_company_name"
                  isList={holderCompanyList}
                  setIsList={setHolderCompanyList}
                  cpCodeLabel={holderCompanyCodeLabel}
                  setCpCodeLabel={setHolderCompanyCodeLabel}
                  rules={[
                    { required: true, message: '此欄位為必填' },
                  ]}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <FormUserCompany
                  form={form}
                  isName="user_company_id"
                  isLabel={fieldLabels.user_company_id}
                  isList={userCompanyIdList}
                  setIsList={setUserCompanyIdList}
                  isHiddenLabel={(isEdit) ? true : false}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Row
                  gutter={[8, 8]}
                  style={{ flexWrap: 'nowrap' }}
                >
                  <Col flex="auto">
                    <Form.Item
                      name="ui_contract_year"
                      label="合約年限"
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        precision={0}
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    flex="10px"
                    style={{ marginTop: '30px' }}
                  >
                    <Form.Item>
                      年
                    </Form.Item>
                  </Col>
                  <Col
                    flex="80px"
                    style={{ marginTop: '30px' }}
                  >
                    <Form.Item
                      name="ui_contract_month"
                    >
                      <Select
                        options={[
                          { value: '0', label: '-' },
                          { value: '1', label: '1 月' },
                          { value: '2', label: '2 月' },
                          { value: '3', label: '3 月' },
                          { value: '4', label: '4 月' },
                          { value: '5', label: '5 月' },
                          { value: '6', label: '6 月' },
                          { value: '7', label: '7 月' },
                          { value: '8', label: '8 月' },
                          { value: '9', label: '9 月' },
                          { value: '10', label: '10 月' },
                          { value: '11', label: '11 月' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="start_date"
                  label="合約開始"
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
                  name="end_date"
                  label="合約到期"
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
                  name="expiration_date"
                  label="合約終止"
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
                <Form.Item
                  name="is_permanent"
                  label="永久"
                >
                  <Radio.Group options={[
                    { value: '1', label: '是' },
                    { value: '0', label: '否' },
                  ]} />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="is_exclusive"
                  label="專屬"
                >
                  <Radio.Group options={[
                    { value: '1', label: '是' },
                    { value: '0', label: '否' },
                  ]} />
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
                    onChange={(val) => {
                      let tmpDate = '';

                      if (val) {
                        tmpDate = val.format(dateFormat);
                      }

                      if (tmpDate != soldDate) {
                        setChangeSoldDate((prev) => {
                          return prev + 1;
                        });
                      }

                      setSoldDate(tmpDate);
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
                <Form.Item
                  name="currency_id"
                  label={fieldLabels.currency_id}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Select
                    options={exchangeRateList.optCurrency}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="exchange_rate"
                  label={fieldLabels.exchange_rate}
                  rules={[
                    {
                      validator(rule, values, callback) {
                        let result = true;

                        if (values) {
                          result = valid.checkPostiveNumberAndZero(values);
                        }

                        if (result != false) {
                          callback();
                        } else {
                          callback(valid.checkPostiveNumberAndZero_msg);
                        }
                      }
                    },
                  ]}
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
                />
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="tax_rate"
                  label="稅率 (%)"
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
                lg={16}
              >
                <Form.Item
                  name="note1"
                  label="備註1"
                >
                  <TextArea
                    rows={4}
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
                  name="note2"
                  label="備註2"
                >
                  <TextArea
                    rows={4}
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
                  name="note3"
                  label="備註3"
                >
                  <TextArea
                    rows={4}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </PageHeaderWrapper >
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
      </Form >
      <Card
        bordered={false}
        className={`${styles.card} ${styles.titleNoBBd} ${styles.cardTopSpace}`}
        title="授權內容"
      >
        {
          (miscFormTmpContent) && (
            miscFormTmpContent.map((elem, idx) => (
              <ComContent
                key={idx}
                parentId={match.params.id}
                parentIdx={idx}
                soldDate={soldDate}
                changeSoldDate={changeSoldDate}
                setViewLoading={setViewLoading}
                isSubmit={isSubmit}
                addContent={addContent}
              />
            ))
          )
        }
      </Card>
      <Card
        className={styles.card}
        style={{ border: 'none' }}
      >
        <Row gutter={[64, 24]}>
          <Col xs={24}>
            <Button
              type="dashed"
              block
              onClick={() => {
                addContent({
                  ui_new: true,
                  name: '',
                  use_type_id: '',
                  type: '1',
                  song_id: '',
                  distribution_format: null,
                  contract_author_id: null,
                  contract_author_code: null,
                  contract_author_subcontract_id: null,
                  contract_author_subcontract_code: null,
                  flat_fee: null,
                  syn_fee: null,
                  mech_flat_fee: null,
                  mech_adv: null,
                  isrc_id: null,
                  isrc: '',
                  amount: null,
                  notes: null,
                  song_code: '',
                  song_name: ''
                });
              }}
            >
              <PlusOutlined />新增
            </Button>
          </Col>
        </Row>
      </Card>
    </Spin >
  );
};

export default connect(({ miscList, authorizedAreaList, authorizedCountryList, settlePhaseList, useTypeList, exchangeRateList, karaokeList, loading }) => ({
  miscList,
  authorizedAreaList,
  authorizedCountryList,
  settlePhaseList,
  useTypeList,
  exchangeRateList,
  karaokeList,
  loadingMultiGetInfo: loading.effects['miscList/fetchMultiGetInfo'],
  loadingAddMiscForm: loading.effects['miscList/fecthAddMiscForm'],
  loadingEditMiscForm: loading.effects['miscList/fecthEditMiscForm'],
}))(update);