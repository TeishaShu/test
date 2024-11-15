import React, { useState, useEffect, Fragment } from 'react';
import {
  Form,
  Card,
  Row,
  Col,
  Input,
  Checkbox,
  Radio,
  Select,
  Button,
  Modal,
  Popover,
  Spin,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import { CloseCircleOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import errorStyles from '@/style/error_style.less';
import FormCompanyNicknameAPI from '@/components/FormCompanyNicknameAPI';
import FooterToolbar from '@/components/FooterToolbar';
import FormCountry from '@/components/FormCountry';
import FormAuthorStageName from './components/FormAuthorStageName';

const { Option } = Select;
const { TextArea } = Input;

export const update = props => {
  const {
    loadingMultiGetFormInfo,
    loadingAddForm,
    loadingEditForm,
    dispatch,
    match,
    authorList: { multiChangeId, optType, optRole, optPaymentRate, optInsurance, info },
    authorizedCountryList,
    reportSettingList,
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [viewLoading, setViewLoading] = useState(true);
  // for name
  let checkNameTimer;
  const [isCheckNameExist, setIsCheckNameExist] = useState(false);
  // for members
  const [membersList, setMembersList] = useState([]);
  const [membersLabel, setMembersLabel] = useState([]);
  // for overpay
  const [overpayList, setOverpayList] = useState([]);
  // for accountCompany
  const [accountCompanyList, setAccountCompanyList] = useState([]);
  const [accountCompanyCodeLabel, setAccountCompanyCodeLabel] = useState('');
  // ui show, hide
  const [showMembers, setShowMembers] = useState(false);

  // api -----
  // getData
  const getData = (pageId) => {
    dispatch({
      type: 'authorList/fetchMultiGetFormInfo',
      payload: {
        id: pageId
      }
    });
  };

  // mount
  useEffect(() => {
    let initObj = {
      type: '',
      role: ['1'],
      author_code: '',
      name: '',
      stage_name: [{ stage_name: '' }],
      pen_name: [{ pen_name: '' }],
      members: [{ member_author_stage_name_id: '' }],
      nationality: '',
      id_number: '',
      payment_rate: '',
      overpay: '',
      account_company: '',  // only for save
      account_company_id: '',
      account_company_code: '',
      account_company_name: '',
      insurance: '0',
      residence_add: '',
      mailing_add: '',
      mobile: '',
      home_phone: '',
      company_phone: '',
      fax: '',
      email: '',
      notes: '',
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
  const updateData = () => {
    let getForm = form.getFieldValue();
    let formType = getForm.type;
    let formOverpay = getForm.overpay;
    let formAccountCompanyId = getForm.account_company_id;
    let formAccountCompanyName = getForm.account_company_name;
    let formAccountCompanyCode = getForm.account_company_code;
    let formMembers = getForm.members;
    let tempMembersList = [];
    let tempMembersLabel = [];
    let formPenName = getForm.pen_name;
    let formStageName = getForm.stage_name;
    let tmpOverpayList = [];

    setViewLoading(true);

    // showMembers
    if (formType == '2') {
      setShowMembers(true);
    } else {
      setShowMembers(false);
    }

    // overpay
    if (!formOverpay) {
      form.setFieldsValue({ overpay: '' });
    }
    tmpOverpayList = commFn.convertOverpayOpt(reportSettingList.incomeTaxOverList);
    setOverpayList(tmpOverpayList);

    // accountCompanyLabel
    if (formAccountCompanyId) {
      form.setFieldsValue({ account_company: formAccountCompanyId });
      setAccountCompanyList([{ id: formAccountCompanyId, nickname: formAccountCompanyName }]);
      setAccountCompanyCodeLabel(formAccountCompanyCode);
    } else {
      form.setFieldsValue({ account_company: formAccountCompanyCode });
      setAccountCompanyList([]);
      setAccountCompanyCodeLabel('');
    }

    // membersLists, membersLabel
    if (formMembers && formMembers.length > 0) {
      for (let i = 0; i < formMembers.length; i++) {
        if (formMembers[i].id) {
          tempMembersList.push([{
            id: formMembers[i].member_author_stage_name_id,
            author_id: formMembers[i].member_author_id,
            stage_name: formMembers[i].stage_name,
            author_code: formMembers[i].member_author_code
          }]);
          tempMembersLabel.push((formMembers[i].member_author_code) ? (formMembers[i].member_author_code) : '');
        } else {
          tempMembersList.push([]);
        }
      }
    } else {
      form.setFieldsValue({ members: [{ member_author_stage_name_id: '' }] });
    }
    setMembersList(tempMembersList);
    setMembersLabel(tempMembersLabel);


    // pen_name init
    if (formPenName && formPenName.length == 0) {
      form.setFieldsValue({ pen_name: [{ pen_name: '' }] });
    }

    // stage_name init
    if (formStageName && formStageName.length == 0) {
      form.setFieldsValue({ stage_name: [{ stage_name: '' }] });
    }

    setViewLoading(false);
  }

  // updateData - trigger
  useEffect(() => {
    if (isEdit) {
      let obj = Object.assign({}, info);

      form.setFieldsValue({
        ...obj,
      });
    }
    updateData();
  }, [multiChangeId]);

  // save
  const onFinish = values => {
    setError([]);

    let saveObj = Object.assign({}, values);

    // id
    if (isEdit) {
      saveObj.id = match.params.id;
    }

    // author_code
    delete saveObj.author_code;

    // pen_name
    let penNameDelNum = 0;
    let resPenName = [];
    for (let i = 0; i < saveObj.pen_name.length; i++) {
      let item = saveObj.pen_name[i];

      if (!isEdit) {
        if (saveObj.pen_name.length == 1 && item.pen_name == '') {
          resPenName.push(saveObj.name);
        } else if (item.pen_name) {
          resPenName.push(item.pen_name);
        }
      } else {
        if (item.pen_name) {
          resPenName.push(item);
        } else if (item.id && !item.pen_name) {
          item.is_delete = '1';
          resPenName.push(item);
        }

        // fix - if no pen_name
        if (item.is_delete) {
          penNameDelNum++;
        }
        if (i == saveObj.pen_name.length - 1 && penNameDelNum == saveObj.pen_name.length) {
          resPenName.push({ pen_name: saveObj.name });
        }
      }
    }
    saveObj.pen_name = resPenName;

    // members
    let resMembers = [];
    for (let i = 0; i < saveObj.members.length; i++) {
      let item = saveObj.members[i];

      delete item.stage_name;
      delete item.author_code;

      if (saveObj.type == '2') {
        if (item.member_author_stage_name_id) {
          resMembers.push(item);
        } else if (isEdit && item.id && !item.member_author_stage_name_id) {
          item.is_delete = '1';
          resMembers.push(item);
        }
      } else if (isEdit) {
        if (saveObj.id) {
          item.is_delete = '1';
          resMembers.push(item);
        }
      }
    }
    saveObj.members = resMembers;

    // overpay
    if (!saveObj.overpay) {
      saveObj.overpay = null;
    }

    // nationality
    if (!saveObj.nationality) {
      saveObj.nationality = null;
    }

    // id_number
    if (!saveObj.id_number) {
      saveObj.id_number = null;
    }

    // stage_name
    let resStageName = [];
    for (let i = 0; i < saveObj.stage_name.length; i++) {
      let item = saveObj.stage_name[i];
      if (!isEdit) {
        if (item.stage_name) {
          resStageName.push(item.stage_name);
        }
      } else {
        if (item.stage_name) {
          resStageName.push(item);
        } else if (item.id && !item.stage_name) {
          item.is_delete = '1';
          resStageName.push(item);
        }
      }
    }
    saveObj.stage_name = resStageName;

    // account_company
    if (!saveObj.account_company) {
      saveObj.account_company = null;
    }

    dispatch({
      type: (isEdit) ? 'authorList/fetchEditForm' : 'authorList/fetchAddForm',
      payload: saveObj,
      callback: (result) => {
        let redirect = '/information/author';

        if (result != '' && result != 'error') {
          if (!isEdit) {
            redirect = `/information/author/adv/${result}/info`;
          } else {
            redirect = `/information/author/adv/${match.params.id}/info`;
          }

          history.push(redirect);
        }
      }
    });
  };

  // confirm
  const showConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要取消修改嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        if (isEdit) {
          history.push(`/information/author/adv/${match.params.id}/info`);
        } else {
          history.push('/information/author');
        }
      },
      onCancel() { },
    });
  }

  // valid behavior -----
  // fieldLabels
  const fieldLabels = {
    role: '角色類別',
    type: '角色類型',
    name: '姓名',
    payment_rate: '稅率',
  };

  // valid
  const getErrorInfo = errors => {
    const errorCount = errors.filter(item => item.errors.length > 0).length;
    // fix Form.List field
    const cusFields = ['role', 'type'];
    const cusFieldId = 'role';

    if (!errors || errorCount === 0) {
      return null;
    }

    const scrollToField = fieldKey => {
      let labelNode = document.querySelector(`label[for="${fieldKey}"]`);

      if (cusFields.includes(fieldKey)) {
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
  // changeType
  const changeType = (val) => {
    if (val == '2') {
      setShowMembers(true);
    } else {
      setShowMembers(false);
    }
  }

  // checkNameExist
  const checkNameExist = (e) => {
    let val = e.target.value;
    let chkNameApi = '';

    clearTimeout(checkNameTimer);
    checkNameTimer = setTimeout(() => {
      if (val != '') {
        if (isEdit) {
          chkNameApi = `${window.FRONTEND_WEB}/author/name_exist?id=${match.params.id}&name=${val}`;
        } else {
          chkNameApi = `${window.FRONTEND_WEB}/author/name_exist?name=${val}`;
        }

        fetch(chkNameApi).then(
          res => res.json()
        ).then(jsonRes => {
          if (commFn.convertToBool(jsonRes.data)) {
            setIsCheckNameExist(true);
          } else {
            setIsCheckNameExist(false);
          }
        }).catch(err => {
          setIsCheckNameExist(false);
        });
      } else {
        setIsCheckNameExist(false);
      }
    }, 200);
  }

  return (
    <Spin
      tip="Loading..."
      spinning={isEdit ? (loadingEditForm || loadingMultiGetFormInfo || viewLoading) : (loadingAddForm || loadingMultiGetFormInfo || viewLoading)}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <PageHeaderWrapper
          title={isEdit ? '編輯藝人作者' : '新增藝人作者'}
        >
          <Card
            bordered={false}
          >
            <Row>
              <Col>
                <Form.Item
                  name="role"
                  label={fieldLabels.role}
                  className={styles.om_hide_label}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Checkbox.Group
                    options={optRole}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name="type"
                  label={fieldLabels.type}
                  className={styles.om_hide_label}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Select
                    style={{ width: 120 }}
                    onChange={changeType}
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
                style={{ display: (isEdit) ? 'block' : 'none' }}
              >
                <Form.Item
                  label="編號"
                  name="author_code"
                >
                  <Input
                    disabled={true}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label={fieldLabels.name}
                  name="name"
                  extra={
                    (isCheckNameExist)
                      ? (<span style={{ color: '#F9B006' }}><ExclamationCircleFilled />&nbsp;&nbsp;已建立過相同姓名資料！</span>)
                      : ('')
                  }
                  rules={[
                    { required: true, message: '此欄位為必填' },
                  ]}
                >
                  <Input
                    onChange={checkNameExist}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <FormCountry
                  isLabel="稅籍"
                  isName="nationality"
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
                <Form.Item
                  label="身分證字號/護照號碼"
                  name="id_number"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
                className={styles.formList}
              >
                <Form.List name="pen_name">
                  {(fields, { add, remove }) => {
                    let arr = form.getFieldValue().pen_name;
                    let num = 0;

                    return (
                      <Fragment>
                        {fields.map((field, idx) => {
                          if (arr[idx] == undefined || arr[idx]['is_delete'] == undefined) {
                            num++;
                          }

                          return (
                            <Row
                              gutter={[8, 8]}
                              key={`pen_name_${field.fieldKey}`}
                              style={(arr[idx] == undefined || arr[idx]['is_delete'] == undefined) ? {} : { display: 'none' }}
                            >
                              <Col flex="auto">
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'pen_name']}
                                  fieldKey={[field.fieldKey, 'pen_name']}
                                  label={(num === 1) ? '筆名' : ''}
                                  key={`pen_name_pen_name_${field.fieldKey}`}
                                >
                                  <Input />
                                </Form.Item>
                              </Col>
                              <Col flex="100px"
                                style={(num === 1) ? { marginTop: '30px' } : {}}
                              >
                                {
                                  (num === 1) ?
                                    (<Button block onClick={() => { add(); }}>新增筆名</Button>) :
                                    (
                                      <Button
                                        type="link"
                                        block
                                        onClick={() => {
                                          if (arr[idx] === undefined || arr[idx]['id'] === undefined) {
                                            remove(field.name);
                                          } else {
                                            let delArr = form.getFieldValue().pen_name.slice();
                                            delArr[idx]['is_delete'] = '1';
                                            form.setFieldsValue({ pen_name: delArr });
                                          }
                                        }}
                                      >
                                        移除
                                      </Button>
                                    )
                                }
                              </Col>
                            </Row>
                          );
                        })}
                      </Fragment>
                    );
                  }}
                </Form.List>
              </Col>
              <Col
                xs={24}
                lg={8}
                className={styles.formList}
                style={{ display: (showMembers) ? 'block' : 'none' }}
              >
                <FormAuthorStageName
                  form={form}
                  membersList={membersList}
                  setMembersList={setMembersList}
                  membersLabel={membersLabel}
                  setMembersLabel={setMembersLabel}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
                className={styles.formList}
              >
                <Form.List name="stage_name">
                  {(fields, { add, remove }) => {
                    let arr = form.getFieldValue().stage_name;
                    let num = 0;

                    return (
                      <Fragment>
                        {fields.map((field, idx) => {
                          if (arr[idx] == undefined || arr[idx]['is_delete'] == undefined) {
                            num++;
                          }

                          return (
                            <Row
                              gutter={[8, 8]}
                              key={`stage_name_${field.fieldKey}`}
                              style={(arr[idx] == undefined || arr[idx]['is_delete'] == undefined) ? {} : { display: 'none' }}
                            >
                              <Col flex="auto">
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'stage_name']}
                                  fieldKey={[field.fieldKey, 'stage_name']}
                                  label={(num === 1) ? '藝名' : ''}
                                  key={`stage_name_stage_name_${field.fieldKey}`}
                                >
                                  <Input />
                                </Form.Item>
                              </Col>
                              <Col flex="100px"
                                style={(num === 1) ? { marginTop: '30px' } : {}}
                              >
                                {
                                  (num === 1) ?
                                    (<Button block onClick={() => { add(); }}>新增藝名</Button>) :
                                    (
                                      <Button
                                        type="link"
                                        block
                                        onClick={() => {
                                          if (arr[idx] === undefined || arr[idx]['id'] === undefined) {
                                            remove(field.name);
                                          } else {
                                            let delArr = form.getFieldValue().stage_name.slice();
                                            delArr[idx]['is_delete'] = '1';
                                            form.setFieldsValue({ stage_name: delArr });
                                          }
                                        }}
                                      >
                                        移除
                                      </Button>
                                    )
                                }
                              </Col>
                            </Row>
                          );
                        })}
                      </Fragment>
                    );
                  }}
                </Form.List>
              </Col>
            </Row>
          </Card>
          <Card
            bordered={false}
            className={styles.card}
            title="結算資料"
          >
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label={fieldLabels.payment_rate}
                  name="payment_rate"
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Select
                    options={optPaymentRate}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="超出金額"
                  name="overpay"
                >
                  <Select
                    options={overpayList}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <FormCompanyNicknameAPI
                  form={form}
                  isLabel="結算公司"
                  isName="account_company"
                  isSelectText="account_company_name"
                  isList={accountCompanyList}
                  setIsList={setAccountCompanyList}
                  cpCodeLabel={accountCompanyCodeLabel}
                  setCpCodeLabel={setAccountCompanyCodeLabel}
                />
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="是否有二代健保"
                  name="insurance"
                >
                  <Radio.Group
                    options={optInsurance}
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
                  label="戶籍地址"
                  name="residence_add"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={16}
              >
                <Form.Item
                  label="通訊地址"
                  name="mailing_add"
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
                  label="手機號碼"
                  name="mobile"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="家用電話"
                  name="home_phone"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="公司電話"
                  name="company_phone"
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
                  label="傳真"
                  name="fax"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="Email"
                  name="email"
                  onBlur={(target) => {
                    commFn.trimInput(target, form);
                  }}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={16}
              >
                <Form.Item
                  label="備註"
                  name="notes"
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
            onClick={() => form?.submit()}
          >送出</Button>
        </FooterToolbar>
      </Form>
    </Spin>
  )
}

export default connect(({ authorList, authorizedCountryList, reportSettingList, loading }) => ({
  authorList,
  authorizedCountryList,
  reportSettingList,
  loadingMultiGetFormInfo: loading.effects['authorList/fetchMultiGetFormInfo'],
  loadingAddForm: loading.effects['authorList/fetchAddForm'],
  loadingEditForm: loading.effects['authorList/fetchEditForm'],
}))(update);