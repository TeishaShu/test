import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Switch,
  Select,
} from 'antd';
import { connect } from 'umi';
import valid from '@/fn/valid';

export const ComUirouteModal = props => {
  const [form] = Form.useForm();
  const {
    loading,
    visible,
    editItem,
    onCancel,
    onSubmit,
    uirouteList: { list, optLayout }
  } = props;
  const formLayout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 15,
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
        parent_id: (editItem.parent_id) ? (editItem.parent_id) : '',
        is_status: (editItem.is_status == '1') ? (true) : (false)
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
        {...formLayout}
        form={form}
        onFinish={handleFinish}
      >
        <Row
          gutter={[8, 0]}
          style={{ display: (editItem) ? 'flex' : 'none' }}
        >
          <Col span={24}>
            <Form.Item
              name="id"
              label="ID"
            >
              <Input
                disabled={true}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item
              name="function_id"
              label="功能 ID"
              initialValue=""
            >
              <Select
                options={
                  (list && list.all_function)
                    ? ([
                      { value: '', label: '無' },
                      ...list.all_function.map((elem) => ({ value: elem.id, label: `${elem.id}-${elem.service_name}-${elem.name}` }))
                    ])
                    : ([{ value: '', label: '無' },])
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item
              name="layout"
              label="Layout"
              initialValue="3"
            >
              <Select
                options={optLayout}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item
              name="menu_level"
              label="選單階層"
              validateFirst={true}
              rules={[
                {
                  required: true,
                  message: '此欄位為必填'
                },
              ]}
              initialValue="1"
            >
              <Select
                options={[
                  { value: '1', lable: '1' },
                  { value: '2', lable: '2' },
                  { value: '3', lable: '3' }
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item
              name="path"
              label="路徑"
              validateFirst={true}
              rules={[
                {
                  required: true,
                  message: '此欄位為必填'
                },
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
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="名稱"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item
              name="component"
              label="組件"
              validateFirst={true}
              rules={[
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
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item
              name="parent_id"
              label="父層"
              initialValue=""
            >
              <Select
                options={
                  (list && list.all_route)
                    ? (
                      [
                        { value: '', label: '無' },
                        ...list.all_route
                          .filter((elem) => elem.layout == '3' && elem.name && !elem.component)
                          .filter((elem) => elem.id != (editItem ? editItem.id : null))
                          .map((mElem) => ({ value: mElem.id, label: `${mElem.id}-${mElem.name}` }))
                      ]
                    )
                    : ([{ value: '', label: '無' }])
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item
              name="setting_order"
              label="順序"
              validateFirst={true}
              rules={[
                {
                  required: true,
                  message: '此欄位為必填'
                },
                {
                  validator(rule, values, callback) {
                    let result = valid.checkPostiveInt(values);
                    if (result != false) {
                      callback();
                    } else {
                      callback(valid.checkPostiveInt_msg);
                    }
                  }
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item
              name="notes"
              label="備註"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item
              name="is_status"
              label="狀態"
              valuePropName="checked"
              validateFirst={true}
              rules={[
                {
                  required: true,
                  message: '此欄位為必填'
                },
              ]}
              initialValue={false}
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  return (
    <Modal
      width={700}
      title={editItem ? "編輯 UI 路由" : "新增 UI 路由"}
      visible={visible}
      cancelText="取消"
      okText="送出"
      onOk={handleSubmit}
      onCancel={onCancel}
      forceRender={true}
      okButtonProps={{ disabled: loading }}
      cancelButtonProps={{ disabled: loading }}
      closable={!loading}
      maskClosable={false}
    >
      {modalForm()}
    </Modal>
  );
}

export default connect(({ uirouteList, loading }) => ({
  uirouteList,
  loading: loading.models.uirouteList,
}))(ComUirouteModal);