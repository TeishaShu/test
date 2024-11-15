import React, { useState, useEffect, Fragment } from 'react';
import {
  Spin,
  Card,
  Row,
  Col,
  Button,
  Modal,
  Divider,
  Form,
  Input,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Link, connect, history } from 'umi';
import styles from '@/style/style.less';
import errorStyles from '@/style/error_style.less';
import FooterToolbar from '@/components/FooterToolbar';
import valid from '@/fn/valid';

export const update = props => {
  const {
    loading,
    dispatch,
    authList: { changeId, initUserData },
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);

  // api -----
  // getData
  const getData = (obj) => {
    dispatch({
      type: 'authList/fetchGetInitUserData',
    });
  }

  // mount
  useEffect(() => {
    const initObj = {
      user_name: '',
      email: '',
      phone: '',
    };

    // init object
    form.setFieldsValue({
      ...initObj
    });

    getData();
  }, []);

  // updateData
  useEffect(() => {
    form.setFieldsValue({
      ...initUserData,
    });
  }, [changeId]);

  // save
  const onFinish = values => {
    setError([]);

    let saveObj = Object.assign({}, values);

    dispatch({
      type: 'authList/fetchEditForm',
      payload: saveObj,
      callback: (result) => {
        if (result != '' && result != 'error') {
          history.push('/account');
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
        history.push('/account');
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
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  return (
    <Spin
      tip="Loading..."
      spinning={loading}
    >
      <Form
        {...layout}
        form={form}
        layout="horizontal"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <PageHeaderWrapper
          title="修改個人資料"
        >
          <Card
            bordered={false}
          >
            <Row>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="user_name"
                  label="暱稱"
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="email"
                  label="電子信箱"
                  rules={[
                    { required: true, message: '此欄位為必填' },
                    {
                      validator(rule, values, callback) {
                        let result = valid.checkEmail(values);
                        if (result != false) {
                          callback();
                        } else {
                          callback(valid.checkEmail_msg);
                        }
                      }
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="phone"
                  label="連絡電話"
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Input />
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
            htmlType="submit"
          >送出</Button>
        </FooterToolbar>
      </Form>
    </Spin>
  );
}

export default connect(({ authList, loading }) => ({
  authList,
  loading: loading.models.authList,
}))(update);