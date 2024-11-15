import React, { useEffect, useState } from 'react';
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
import Cookies from 'js-cookie';
import valid from '@/fn/valid';
import commFn from '@/fn/comm';

const login = props => {
  const {
    loading,
    dispatch,
    match,
    authList: { loginResult, initUserData },
  } = props;
  const [form] = Form.useForm();
  const [viewLoading, setViewLoading] = useState(true);

  useEffect(() => {
    let initObj = {
      account: '',
      password: '',
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

    // delete sessionStorage
    sessionStorage.removeItem('song_base');
    sessionStorage.removeItem('contract_song_basic');
    sessionStorage.removeItem('contract_author_base');
    sessionStorage.removeItem('isrc_base');
    sessionStorage.removeItem('album_base');
    sessionStorage.removeItem('souvenir_base');
    sessionStorage.removeItem('misc_base');
    sessionStorage.removeItem('karaoke_base');
    sessionStorage.removeItem('information_author_base');
    sessionStorage.removeItem('information_company_base');
    sessionStorage.removeItem('new_media_index');
    sessionStorage.removeItem('list_use_type_index');
    sessionStorage.removeItem('settle_right_newmedia_index');
    sessionStorage.removeItem('settle_record_newmedia_index');
    sessionStorage.removeItem('settle_record_newmedia_apple');
  }, [])

  // save
  const onFinish = values => {
    let saveObj = Object.assign({}, values);

    dispatch({
      type: 'authList/fetchLogin',
      payload: saveObj,
      callback: (result) => {
        if (result && result == 'ok') {
          Cookies.set('uiAccess', 'true', { expires: 7 });
          history.push('/');
        }
      }
    });
  }

  return (
    <Spin
      tip="Loading..."
      spinning={loading || viewLoading}
    >
      <h4>會員登入</h4>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Row style={{ display: (loginResult && loginResult != 'ok') ? 'flex' : 'none' }}>
          <Col xs={24}>
            <Form.Item>
              <Alert
                message={(loginResult && loginResult != 'ok' && loginResult != 'error') ? loginResult : '會員登入錯誤'}
                type="error"
                showIcon
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <Form.Item
              hidden={true}
              name="platform_id"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="account"
              rules={[
                { required: true, message: '此欄位為必填' },
                {
                  validator(rule, values, callback) {
                    let result = valid.checkAuthAccount(values);
                    if (result != false) {
                      callback();
                    } else {
                      callback(valid.checkAuthAccount_msg);
                    }
                  }
                },
              ]}
            >
              <Input placeholder="帳號" />
            </Form.Item>

          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <Form.Item
              name="password"
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
                placeholder="密碼"
                visibilityToggle={false}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <Form.Item style={{ textAlign: 'right' }}>
              <Link to="/auth/forgot_password">忘記密碼</Link>
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
              登入
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
}))(login);