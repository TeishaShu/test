import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
} from 'antd';
import { connect } from 'umi';

export const ComOpModal = props => {
  const [form] = Form.useForm();
  const {
    loading,
    visible,
    editItem,
    onCancel,
    onSubmit
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
          name="type"
          label="型態名稱"
          validateFirst={true}
          rules={[
            {
              required: true,
              message: '此欄位為必填'
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
      title={editItem ? "編輯ISRC型態" : "新增ISRC型態"}
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
  loading: loading.models.isrcTypeList,
}))(ComOpModal);