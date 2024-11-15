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
import { Link, connect, history } from 'umi';
import ComInfo from './components/ComInfo';
import valid from '@/fn/valid';
import commFn from '@/fn/comm';

const forgotPassword = props => {
  const {
    loading,
    dispatch,
    match,
    authList: { forgotPasswordResult, initUserData },
  } = props;
  const [form] = Form.useForm();
  const [viewLoading, setViewLoading] = useState(true);
  const [isFinish, setIsFinish] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    let initObj = {
      email: '',
      platform_id: '2',  // 1: 大平台, 2: 企業版
    };

    dispatch({
      type: 'authList/initAuthResult',
    });

    initObj.platform_id = commFn.checkPlatOrEntRole();

    // init object
    form.setFieldsValue({
      ...initObj
    });

    setViewLoading(false);
  }, [])

  // save
  const onFinish = values => {
    let saveObj = Object.assign({}, values);

    setUserEmail(saveObj.email);

    dispatch({
      type: 'authList/fetchForgotPassword',
      payload: saveObj,
      callback: (result) => {
        if (result && result == 'ok') {
          setIsFinish(true);
        }
      }
    });
  }

  return (
    <Spin
      tip="Loading..."
      spinning={loading || viewLoading}
    >
      {
        (!isFinish)
          ? (
            <Fragment>
              <h4>忘記密碼</h4>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
              >
                <Row style={{ display: (forgotPasswordResult && forgotPasswordResult != 'ok') ? 'flex' : 'none' }}>
                  <Col xs={24}>
                    <Form.Item
                      hidden={true}
                      name="platform_id"
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item>
                      <Alert
                        message={
                          (forgotPasswordResult && forgotPasswordResult != 'ok' && forgotPasswordResult != 'error')
                            ? (forgotPasswordResult)
                            : ('發送密碼錯誤')
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
                      name="email"
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
                      <Input placeholder="電子信箱" />
                    </Form.Item>

                  </Col>
                </Row>
                <Row>
                  <Col xs={24}>
                    <Button
                      type="primary"
                      block
                      htmlType="submit"
                    >
                      發送密碼
                      </Button>
                  </Col>
                </Row>
              </Form>
            </Fragment>
          )
          : (
            <ComInfo
              email={userEmail}
            />
          )
      }
    </Spin>
  );
}

export default connect(({ authList, loading }) => ({
  authList,
  loading: loading.models.authList,
}))(forgotPassword);