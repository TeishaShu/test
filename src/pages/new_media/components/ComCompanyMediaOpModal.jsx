import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
} from 'antd';
import { connect } from 'umi';

export const ComCompanyMdeiaOpModal = props => {
  const [form] = Form.useForm();
  const {
    loading,
    visible,
    editItem,
    onCancel,
    onSubmit,
  } = props;

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

  // valid -----
  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = values => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  // ui -----
  const modalForm = () => {
    return (
      <Form
        form={form}
        onFinish={handleFinish}
      >
        <Row gutter={[8, 0]}>
          <Col span={12}>
            <Form.Item
              name="company_name"
              label="公司名稱"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="code_long"
              label="新媒體長代號"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col span={12}>
            <Form.Item
              name="code_short"
              label="新媒體短代號"
              validateFirst={true}
              rules={[
                {
                  required: true,
                  message: '此欄位為必填'
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  return (
    <Modal
      width={650}
      title={editItem ? "編輯新媒體" : "新增新媒體"}
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

export default connect(({ companyMediaList, loading }) => ({
  companyMediaList,
  loading: loading.models.companyMediaList,
}))(ComCompanyMdeiaOpModal);