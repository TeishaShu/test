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
import { PlusOutlined, CloseOutlined, CloseCircleOutlined } from "@ant-design/icons";
import styles from '@/style/style.less';
import errorStyles from '@/style/error_style.less';
import valid from '@/fn/valid';
import FooterToolbar from '@/components/FooterToolbar';
import commFn from '@/fn/comm';

const { Option } = Select;
const { TextArea } = Input;

export const update = props => {
  const {
    loading,
    dispatch,
    match,
    companyList: { changeId, optType, info },
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isInternal, setIsInternal] = useState('1');

  // api -----
  // saveData
  const onFinish = values => {
    setError([]);

    let saveObj = Object.assign({}, values);

    if (isEdit) {
      saveObj.id = match.params.id;
    }

    // tax_id_number
    if (isEdit || saveObj.is_internal === '0') {
      delete saveObj.tax_id_number;
    }
    delete saveObj.company_code;

    // nickname - change structure
    let resNickname = [];
    for (let i = 0; i < saveObj.nickname.length; i++) {
      let item = saveObj.nickname[i];
      if (!isEdit && item.nickname && i != 0) {
        resNickname.push(item.nickname);
      } else if (isEdit) {
        if (item.nickname) {
          resNickname.push(item);
        } else if (item.id && !item.nickname) {
          item.is_delete = '1';
          resNickname.push(item);
        }
      }
    }
    saveObj.nickname = resNickname;

    // contact - remove null item
    for (let i = 0; i < saveObj.contact.length; i++) {
      let item = saveObj.contact[i];

      if (!item.name && !item.job_title && !item.tel && !item.ext && !item.mobile && !item.email) {
        saveObj.contact.splice(i, 1);
        i--;
      }
    }

    dispatch({
      type: (isEdit) ? 'companyList/fetchEditForm' : 'companyList/fetchAddForm',
      payload: saveObj,
      callback: (result) => {
        let redirect = '/information/company';

        if (result != '' && result != 'error') {
          if (!isEdit) {
            redirect = `/information/company/adv/${result}/info`;
          } else {
            redirect = `/information/company/adv/${match.params.id}/info`;
          }

          history.push(redirect);
        }
      }
    });
  };

  // getData
  const getData = (pageId) => {
    dispatch({
      type: 'companyList/fetchGetInfo',
      payload: {
        id: pageId
      },
    });
  }

  // updateData (edit)
  useEffect(() => {
    if (isEdit) {
      let obj = Object.assign({}, info);

      // fix nickname old data
      let checkCompanyName = false;
      for (let i = 0; i < obj.nickname.length; i++) {
        if (obj.nickname[0].nickname === obj.name) {
          checkCompanyName = true;
          break;
        } else if (obj.nickname[i].nickname === obj.name) {
          let comId = obj.nickname[i].id;
          let comNickname = obj.nickname[i].nickname;

          obj.nickname.splice(i, 1);
          obj.nickname.unshift({ id: comId, nickname: comNickname });
          checkCompanyName = true;
          break;
        }
      }
      if (!checkCompanyName) {
        obj.nickname.unshift({ nickname: obj.name });
      }
      if (obj.nickname.length < 2) {
        obj.nickname.push({ nickname: '' });
      }

      form.setFieldsValue({
        ...obj,
      });
      setIsInternal(obj.is_internal);
    }
  }, [changeId]);

  // mount
  useEffect(() => {
    let initObj = {
      type: [],
      is_internal: isInternal,
      company_code: '',  // only for ui
      tax_id_number: '',
      name: '',
      name_zh: '',
      name_en: '',
      admin: '',
      is_agent: '0',
      nickname: [
        { nickname: '' },
        { nickname: '' }
      ],
      payment_rate: '',
      address_zh: '',
      address_en: '',
      zip: '',
      tel: '',
      fax: '',
      web: '',
      email: '',
      contact: [],
      notes: '',
    };

    // init object
    form.setFieldsValue({
      ...initObj
    });
    setIsInternal(initObj.is_internal);

    if (match.params.id) {
      setIsEdit(true);
      getData(match.params.id);
    } else {
      setIsEdit(false);
    }
  }, [match.params.id]);

  // valid -----
  // fieldLabels
  const fieldLabels = {
    type: '公司類別',
    tax_id_number: (<Fragment>編號<span className={styles.om_color_red}>(國內公司請填統一編號)</span></Fragment>),
    name: '公司名稱',
    payment_rate: '稅率',
    contact_table: {
      name: '姓名',
      email: 'Email',
    },
  };

  const getErrorInfo = errors => {
    const errorCount = errors.filter(item => item.errors.length > 0).length;
    // fix Form.List field
    const cusFields = ['name', 'email'];
    const cusFieldId = 'contact_table';

    if (!errors || errorCount === 0) {
      return null;
    }

    const scrollToField = fieldKey => {
      let labelNode = document.querySelector(`label[for="${fieldKey}"]`);

      if (fieldKey === cusFieldId) {
        labelNode = document.getElementById(cusFieldId);
      } else if (fieldKey == 'type') {
        labelNode = document.getElementById('type');
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
        history.push('/information/company');
      },
      onCancel() { },
    });
  }

  // changeIsInternal
  const changeIsInternal = (e) => {
    let isInternalVal = e.target.value;
    setIsInternal(isInternalVal);
  }

  // changeName
  const changeName = (e) => {
    let nicknameArr = form.getFieldValue().nickname.slice();
    nicknameArr[0]['nickname'] = e.target.value;
    form.setFieldsValue({ nickname: nicknameArr });
  }

  return (
    <Spin
      tip="Loading..."
      spinning={loading || (isEdit ? false : isEdit)}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <PageHeaderWrapper
          title={isEdit ? '編輯公司' : '新增公司'}
        >
          <Card
            bordered={false}
          >
            <Row>
              <Col
                xs={24}
                lg={16}
              >
                <Form.Item
                  name="type"
                  label={fieldLabels.type}
                  className={styles.om_hide_label}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Checkbox.Group
                    options={optType}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
                className={styles.om_txt_align_r}
              >
                <Form.Item
                  name="is_internal"
                >
                  <Radio.Group
                    className={styles.om_sp_m_rb}
                    disabled={(isEdit) ? true : false}
                    onChange={changeIsInternal}
                  >
                    <Radio value="1">國內</Radio>
                    <Radio value="0">海外</Radio>
                  </Radio.Group>
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
                  label={fieldLabels.tax_id_number}
                  name="tax_id_number"
                  style={(isInternal === '1') ? {} : { display: 'none' }}
                  rules={[
                    { required: (isInternal === '1') ? true : false, message: '此欄位為必填' }
                  ]}
                >
                  <Input
                    disabled={(isEdit) ? true : false}
                  />
                </Form.Item>
                <Form.Item
                  label="編號"
                  style={(isInternal === '0') ? {} : { display: 'none' }}
                >
                  <label
                    style={(!isEdit) ? {} : { display: 'none' }}
                  >(系統自動生成)</label>
                  <Form.Item
                    name="company_code"
                    noStyle
                  >
                    <Input
                      style={(isEdit) ? {} : { display: 'none' }}
                      disabled={(isEdit) ? true : false}
                    />
                  </Form.Item>
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label={fieldLabels.name}
                  name="name"
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Input onChange={changeName} />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="公司名稱(中)"
                  name="name_zh"
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
                  label="公司名稱(英)"
                  name="name_en"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="負責人"
                  name="admin"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="是否代理"
                  name="is_agent"
                >
                  <Radio.Group>
                    <Radio value="1">是</Radio>
                    <Radio value="0">否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
                className={styles.formList}
              >
                <Form.List name="nickname">
                  {(fields, { add, remove }) => {
                    let arr = form.getFieldValue().nickname;
                    let num = 0;

                    return (
                      <Fragment>
                        {fields.map((field, idx) => {
                          if (idx != 0 && (arr[idx] == undefined || arr[idx]['is_delete'] == undefined)) {
                            num++;
                          }

                          return (
                            <Row
                              gutter={[8, 8]}
                              key={`nickname_${field.fieldKey}`}
                              style={((arr[idx] == undefined || arr[idx]['is_delete'] == undefined) && idx != 0) ? {} : { display: 'none' }}
                            >
                              <Col flex="auto">
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'nickname']}
                                  fieldKey={[field.fieldKey, 'nickname']}
                                  label={(num === 1) ? '公司別名' : ''}
                                  key={`nickname_nickname_${field.fieldKey}`}
                                >
                                  <Input disabled={(idx === 0) ? true : false} />
                                </Form.Item>
                              </Col>
                              <Col flex="100px"
                                style={(num === 1) ? { marginTop: '30px' } : {}}
                              >
                                {
                                  (num === 1) ?
                                    (<Button
                                      block
                                      onClick={() => { add(); }}
                                    >
                                      新增別名
                                    </Button>) :
                                    (
                                      <Button
                                        type="link"
                                        block
                                        onClick={() => {
                                          if (arr[idx] === undefined || arr[idx]['id'] === undefined) {
                                            remove(field.name);
                                          } else {
                                            let arrDel = form.getFieldValue().nickname.slice();
                                            arrDel[idx]['is_delete'] = '1';
                                            form.setFieldsValue({ nickname: arrDel });
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
                  <Select>
                    <Option value="0">0%</Option>
                    <Option value="5">5%</Option>
                    <Option value="10">10%</Option>
                    <Option value="20">20%</Option>
                    <Option value="-10">-10%</Option>
                    <Option value="-20">-20%</Option>
                  </Select>
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
                  label="公司地址(中)"
                  name="address_zh"
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
                  label="公司地址(英)"
                  name="address_en"
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
                  label="郵遞區號"
                  name="zip"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  label="電話"
                  name="tel"
                >
                  <Input />
                </Form.Item>
              </Col>
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
            </Row>

            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={16}
              >
                <Form.Item
                  label="網站"
                  name="web"
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
                  rules={[
                    {
                      validator(rule, values, callback) {
                        let result = valid.checkEmail(values);
                        if (result != false) {
                          callback();
                        } else {
                          callback(valid.checkEmail_msg);
                        }
                      }
                    }
                  ]}
                  onBlur={(target) => {
                    commFn.trimInput(target, form);
                  }}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card
            bordered={false}
            className={styles.card}
          >
            <Row>
              <Col
                xs={24}
                className={styles.om_overflow_auto}
              >
                <Form.List name="contact">
                  {(fields, { add, remove }) => {
                    let arr = form.getFieldValue().contact;
                    let num = 0;

                    return (
                      <table
                        id="contact_table"
                        className={styles.formTable}
                      >
                        <thead>
                          <tr>
                            <th>&nbsp;</th>
                            <th>姓名</th>
                            <th>職稱</th>
                            <th>電話</th>
                            <th>分機</th>
                            <th>手機</th>
                            <th>Email</th>
                            <th>&nbsp;</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fields.map((field, idx) => {
                            if (arr[idx] == undefined || arr[idx]['is_delete'] == undefined) {
                              num++;
                            }

                            return (
                              <tr
                                key={`contact_${field.key}`}
                                style={(arr[idx] == undefined || arr[idx]['is_delete'] == undefined) ? {} : { display: 'none' }}
                              >
                                <td>
                                  <Form.Item>
                                    {`聯絡人${num}`}
                                  </Form.Item>
                                </td>
                                <td>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'name']}
                                    fieldKey={[field.fieldKey, 'name']}
                                    key={`contact_name_${field.fieldKey}`}
                                    initialValue=""
                                  >
                                    <Input />
                                  </Form.Item>
                                </td>
                                <td>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'job_title']}
                                    fieldKey={[field.fieldKey, 'job_title']}
                                    key={`contact_job_title_${field.fieldKey}`}
                                    initialValue=""
                                  >
                                    <Input />
                                  </Form.Item>
                                </td>

                                <td>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'tel']}
                                    fieldKey={[field.fieldKey, 'tel']}
                                    key={`contact_tel_${field.fieldKey}`}
                                    initialValue=""
                                  >
                                    <Input />
                                  </Form.Item>
                                </td>
                                <td>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'ext']}
                                    fieldKey={[field.fieldKey, 'ext']}
                                    key={`contact_ext_${field.fieldKey}`}
                                    initialValue=""
                                  >
                                    <Input />
                                  </Form.Item>
                                </td>
                                <td>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'mobile']}
                                    fieldKey={[field.fieldKey, 'mobile']}
                                    key={`contact_mobile_${field.fieldKey}`}
                                    initialValue=""
                                  >
                                    <Input />
                                  </Form.Item>
                                </td>
                                <td>
                                  <Form.Item
                                    {...field}
                                    name={[field.name, 'email']}
                                    fieldKey={[field.fieldKey, 'email']}
                                    rules={[
                                      {
                                        validator(rule, values, callback) {
                                          let result = valid.checkEmail(values);
                                          if (result != false) {
                                            callback();
                                          } else {
                                            callback(valid.checkEmail_msg);
                                          }
                                        }
                                      }
                                    ]}
                                    key={`contact_email_${field.fieldKey}`}
                                    initialValue=""
                                    onBlur={(target) => {
                                      commFn.trimInput(target, form, (trimVal) => {
                                        let trimArr = form.getFieldValue().contact.slice();

                                        trimArr[idx]['email'] = trimVal;
                                        form.setFieldsValue({ contact: trimArr });
                                      });
                                    }}
                                  >
                                    <Input />
                                  </Form.Item>
                                </td>
                                <td className={styles.om_td_icon_style}>
                                  <Form.Item>
                                    <Button
                                      type="link"
                                      onClick={() => {
                                        if (arr[idx] === undefined || arr[idx]['id'] === undefined) {
                                          remove(field.name);
                                        } else {
                                          let delArr = form.getFieldValue().contact.slice();
                                          delArr[idx]['is_delete'] = '1';
                                          form.setFieldsValue({ contact: delArr });
                                        }
                                      }}
                                    >
                                      <CloseOutlined
                                        className={`${styles.om_icon_btn_style} ${styles.om_color_red}`}
                                      />
                                    </Button>
                                  </Form.Item>
                                </td>
                              </tr>
                            );
                          })}
                          <tr
                            className={styles.lastTr}
                            style={(num >= 5) ? { display: 'none' } : {}}
                          >
                            <td colSpan="8">
                              <Button
                                type="dashed"
                                block
                                onClick={() => { add(); }}
                              >
                                <PlusOutlined />新增聯絡人
                                </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    );
                  }}
                </Form.List>
              </Col>
            </Row>
          </Card>

          <Card>
            <Row>
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
  );
}

export default connect(({ companyList, loading }) => ({
  companyList,
  loading: loading.models.companyList,
}))(update);