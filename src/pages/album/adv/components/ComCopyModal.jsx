import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
} from 'antd';
import { connect } from 'umi';
import FormAlbumNameAPI from '@/components/FormAlbumNameAPI';
import commFn from '@/fn/comm';

const { Option } = Select;

export const ComCopyModal = props => {
  const [form] = Form.useForm();
  const {
    loading,
    visible,
    onCancel,
    onSubmit,
    useTypeList: { optSubject },
  } = props;
  const formLayout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 17,
    },
  };
  // album_id
  const [albumIdList, setAlbumIdList] = useState([]);
  // disc_id
  const [discIdOption, setDiscIdOption] = useState([]);

  // api -----
  // hide to reset
  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
      form.setFieldsValue({
        album_id: '',
        album_name_zh: '',
        album_code: '',
        disc_id: '',
      });
      setAlbumIdList([]);
      setDiscIdOption([]);
    }
  }, [visible]);

  // getDiscData
  const getDiscData = albumId => {
    if (albumId) {
      fetch(`${window.FRONTEND_WEB}/album/copy?album_id=${albumId}`).then(
        res => res.json()
      ).then(opts => {
        if (opts.data && opts.data.data && opts.data.data.length > 0) {
          form.setFieldsValue({ disc_id: opts.data.data[0].disc_id });
          setDiscIdOption(opts.data.data.map((elem, idx) => ({ ...elem, value: elem.disc_id, label: `Disc${(idx + 1).toString()} (${elem.count}首)` })));
        } else {
          form.setFieldsValue({ disc_id: '' });
          setDiscIdOption([]);
        }
      }).catch(err => {
        form.setFieldsValue({ disc_id: '' });
        setDiscIdOption([]);
      });
    } else {
      form.setFieldsValue({ disc_id: '' });
      setDiscIdOption([]);
    }
  }

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
        <Row gutter={[24, 0]}>
          <Col
            xs={24}
            lg={12}
          >
            <FormAlbumNameAPI
              form={form}
              isLabel="專輯名稱"
              isName="album_id"
              isSelectText="album_name_zh"
              isList={albumIdList}
              setIsList={setAlbumIdList}
              changeFn={getDiscData}
              isRules={[
                { required: true, message: '此欄位為必填' }
              ]}
            />
          </Col>
          <Col
            xs={24}
            lg={12}
          >
            <Form.Item
              name="album_code"
              style={{ display: 'none' }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="專輯編號"
              shouldUpdate
            >
              {() => {
                return form.getFieldsValue().album_code;
              }}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col
            xs={24}
            lg={12}
          >
            <Form.Item
              name="disc_id"
              label="曲序組合"
              validateFirst={true}
              rules={[
                { required: true, message: '此欄位為必填' }
              ]}
            >
              <Select
                options={discIdOption}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }

  return (
    <Modal
      width={950}
      title="複製專輯曲序"
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

export default connect(({ useTypeList, loading }) => ({
  useTypeList,
  loading: loading.models.useTypeList,
}))(ComCopyModal);