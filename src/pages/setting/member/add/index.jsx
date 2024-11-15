import React, { useState, Fragment, useEffect } from 'react';
import {
  Form,
  Spin,
  Select,
  Button,
  Input,
} from 'antd';
import { connect, history } from 'umi';

const { Option } = Select;

const AddEnterprise = props => {
  const {
    dispatch,
    loading,
    memberList: { role },
  } = props;

  const [form] = Form.useForm();

  const addMember = (payload) => {
    dispatch({
      type: 'memberList/fetchAddMember',
      payload,
      callback: res => {
        if (res) {
          history.push(`/authaccess/setting/member/add_finish/${res}`);
        }
      },
    });
  };

  const getRole = () => {
    dispatch({
      type: 'memberList/fetchGetRole',
    });
  };

  useEffect(() => {
    getRole();
  }, []);

  const onFinish = (values) => {
    if (values) {
      addMember({
        account: values.account,
        password: values.password,
        user_name: values.userName,
        phone: values.phone,
        email: values.email,
        role_id: values.role,
      });
    }
  };

  return (
    <Spin
      tip="Loading..."
      spinning={loading ?? false}
    >
      <h4>設定成員帳號</h4>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="userName"
          hasFeedback
          rules={[
            {
              required: true,
              message: '請輸入顯示名稱',
            },
          ]}
        >
          <Input placeholder="顯示名稱"/>
        </Form.Item>
        <Form.Item
          name="account"
          rules={[
            { required: true, message: '請輸入帳號' },
            {
              validator(rule, value, callback) {
                if (value) {
                  fetch(`${window.FRONTEND_WEB}/auth/user/check_account_repeat?account=${value}`).then(
                    res => res.json(),
                  ).then(jsonRes => {
                    if (jsonRes.data && jsonRes.data === true) {
                      callback('帳號重複');
                    } else {
                      callback();
                    }
                  }).catch(err => {
                    callback();
                  });
                } else {
                  callback();
                }
              },
            },
          ]}
          hasFeedback
        >
          <Input placeholder="帳號"/>
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: '請輸入密碼',
            },
            {
              pattern: '^(?=.*\\d)(?=.*[a-zA-Z]).{6,12}$',
              message: '密碼格式不正確',
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="密碼(至少6-12英數字，大小寫不同)" maxLength={12}/>
        </Form.Item>
        <Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '請輸入確認密碼!',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('密碼不一致'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="確認密碼" maxLength={12}/>
        </Form.Item>
        <Form.Item
          name="phone"
          hasFeedback
          rules={[
            { required: true, message: '請輸入聯絡電話' },
            { pattern: '^\\d{10}$', message: '電話格式不正確' },
          ]}
        >
          <Input placeholder="聯絡電話"/>
        </Form.Item>
        <Form.Item
          name="email"
          hasFeedback
          validateFirst
          rules={[
            { required: true, message: '請輸入電子信箱' },
            { type: 'email', message: '電子信箱格式不正確' },
            {
              validator(rule, value, callback) {
                if (value) {
                  fetch(`${window.FRONTEND_WEB}/auth/user/check_email_repeat`, {
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ platform_id: 2, email: value }),
                  }).then(
                    res => res.json(),
                  ).then(jsonRes => {
                    if (jsonRes.data && jsonRes.data === true) {
                      callback('電子信箱重複');
                    } else {
                      callback();
                    }
                  }).catch(err => {
                    callback();
                  });
                } else {
                  callback();
                }
              },
            },
          ]}
        >
          <Input placeholder="公司電子信箱"/>
        </Form.Item>
        <Form.Item
          name="role"
          initialValue=''
          rules={[
            {
              required: true,
              message: '選擇權限角色',
            },
          ]}
        >
          <Select>
            <Option key=''>-設定權限角色-</Option>
            {
              role.map(data=>{
                return <Option key={data.id}>{data.name}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Button type='primary'
                block
                onClick={() => form?.submit()}>確認送出</Button>
      </Form>
    </Spin>
  );
};

export default connect(({ memberList, loading }) => ({
  memberList,
  loading: loading.models.memberList,
}))(AddEnterprise);
