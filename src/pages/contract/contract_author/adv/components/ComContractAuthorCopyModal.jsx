import React, { useEffect, Fragment } from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
} from 'antd';
import valid from '@/fn/valid';

export const ComContractAuthorCopyModal = props => {
  const {
    visible,
    onCancel,
    onSubmit,
  } = props;

  const [form] = Form.useForm();

  // api -----
  // hide to reset
  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [visible]);

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
          <Col span={16}>
            <Form.Item
              name="new_contract_code"
              label="新合約編號"
              rules={[
                { required: true, message: '此欄位為必填' },
                {
                  validator(rule, values, callback) {
                    let result = valid.checkNotChinese(values);
                    if (result != false) {
                      callback();
                    } else {
                      callback(valid.checkNotChinese_msg);
                    }
                  }
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
    <Fragment>
      <Modal
        width={650}
        title="複製合約"
        visible={visible}
        cancelText="取消"
        okText="送出"
        onOk={handleSubmit}
        onCancel={onCancel}
      >
        {modalForm()}
      </Modal>
    </Fragment>
  );
};

export default ComContractAuthorCopyModal;
