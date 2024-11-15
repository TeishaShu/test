import React, { useEffect, useState, Fragment } from 'react';
import {
  Spin,
  Form,
  Row,
  Col,
  Alert,
  Input,
  Button,
} from 'antd';
import { connect, history } from 'umi';
import valid from '@/fn/valid';
import commFn from '@/fn/comm';

const forgotPassword = props => {
  const {
    loading,
    dispatch,
    match,
    authList: { changePasswordResult, initUserData },
  } = props;
  const [form] = Form.useForm();
  const [viewLoading, setViewLoading] = useState(true);

  useEffect(() => {
    let initObj = {
      old_password: '',
      new_password: '',
      uicheck_new_password: '',  // only for ui
    };

    dispatch({
      type: 'authList/initAuthResult',
    });

    // init object
    form.setFieldsValue({
      ...initObj
    });

    setViewLoading(false);
  }, [])

  // save
  const onFinish = values => {
    let saveObj = Object.assign({}, values);

    delete saveObj.uicheck_new_password;

    dispatch({
      type: 'authList/fetchChangePassword',
      payload: saveObj,
      callback: (result) => {
        if (result && result == 'ok') {
          history.push('/account');
        }
      }
    });
  }

  return (
    <Spin
      tip="Loading..."
      spinning={loading || viewLoading}
    >
      <h4>修改密碼</h4>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Row style={{ display: (changePasswordResult && changePasswordResult != 'ok') ? 'flex' : 'none' }}>
          <Col xs={24}>
            <Form.Item>
              <Alert
                message={
                  (changePasswordResult && changePasswordResult != 'ok' && changePasswordResult != 'error')
                    ? (changePasswordResult)
                    : ('修改密碼錯誤')
                }
                type="error"
                showIcon
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <Form.Item
              name="old_password"
              rules={[
                { required: true, message: '此欄位為必填' },
                {
                  validator(rule, values, callback) {
                    let result = valid.checkAuthPassword(values);
                    if (result != false) {
                      callback();
                    } else {
                      callback(valid.checkAuthPassword_msg);
                    }
                  }
                },
              ]}
            >
              <Input.Password
                placeholder="目前密碼"
                visibilityToggle={false}
              />
            </Form.Item>

          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <Form.Item
              name="new_password"
              rules={[
                { required: true, message: '此欄位為必填' },
                {
                  validator(rule, values, callback) {
                    let result = valid.checkAuthPassword(values);
                    if (result != false) {
                      callback();
                    } else {
                      callback(valid.checkAuthPassword_msg);
                    }
                  }
                },
              ]}
            >
              <Input.Password
                placeholder="新密碼"
                visibilityToggle={false}
              />
            </Form.Item>

          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <Form.Item
              name="uicheck_new_password"
              validateFirst={true}
              rules={[
                { required: true, message: '此欄位為必填' },
                {
                  validator(rule, values, callback) {
                    let result = valid.checkAuthPassword(values);
                    if (result != false) {
                      callback();
                    } else {
                      callback(valid.checkAuthPassword_msg);
                    }
                  }
                },
                {
                  validator(rule, values, callback) {
                    let newPasswordVal = form.getFieldValue()['new_password'];

                    if (values == newPasswordVal) {
                      callback();
                    } else {
                      callback('新密碼與確認新密碼不相同');
                    }
                  }
                },
              ]}
            >
              <Input.Password
                placeholder="確認新密碼"
                visibilityToggle={false}
              />
            </Form.Item>

          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col xs={16}>
            <Button
              type="primary"
              block
              htmlType="submit"
            >
              確認修改
            </Button>
          </Col>
          <Col xs={8}>
            <Button
              block
              onClick={() => { history.push('/account'); }}
            >
              取消
            </Button>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
}

export default connect(({ authList, loading }) => ({
  authList,
  loading: loading.models.authList,
}))(forgotPassword);