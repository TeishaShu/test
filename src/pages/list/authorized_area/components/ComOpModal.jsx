import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
} from 'antd';
import { connect } from 'umi';
import valid from '@/fn/valid';

export const ComOpModal = props => {
  const [form] = Form.useForm();
  const {
    loading,
    visible,
    editItem,
    onCancel,
    onSubmit,
    orgList
  } = props;
  const formLayout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 13,
    },
  };

  // api -----
  // hide to reset
  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [visible]);

  // edit to set data
  useEffect(() => {
    if (editItem) {
      form.setFieldsValue({
        ...editItem,
      });
    }
  }, [editItem]);

  // ui -----
  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = values => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  const modalForm = () => {
    return (
      <Form
        {...formLayout}
        form={form}
        onFinish={handleFinish}
      >
        <Form.Item
          name="area_code"
          label="代碼"
          validateFirst={true}
          rules={[
            {
              required: true,
              message: '此欄位為必填'
            },
            {
              validator(rule, values, callback) {
                let result = true;
                const cusReg = /^[a-zA-Z]{1,}$/;

                if (values && !cusReg.test(values)) {
                  result = false;
                }

                if (result) {
                  callback();
                } else {
                  callback('僅可輸入英文');
                }
              }
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="area_name"
          label="地區名稱"
          validateFirst={true}
          rules={[
            {
              required: true,
              message: '此欄位為必填'
            },
            {
              validator(rule, values, callback) {
                let result = true;
                const cusReg = /^[\+\u4E00-\u9FFF]{1,}$/;

                if (values && !cusReg.test(values)) {
                  result = false;
                }

                if (result) {
                  callback();
                } else {
                  callback('僅可輸入中文、符號 +');
                }
              }
            }
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    );
  }

  return (
    <Modal
      title={editItem ? "編輯授權地區" : "新增授權地區"}
      visible={visible}
      cancelText="取消"
      okText="送出"
      onOk={handleSubmit}
      onCancel={onCancel}
      forceRender={true}
      okButtonProps={{ disabled: loading }}
      cancelButtonProps={{ disabled: loading }}
      closable={!loading}
    >
      {modalForm()}
    </Modal>
  );
}

export default connect(({ loading }) => ({
  loading: loading.models.authorizedAreaList,
}))(ComOpModal);