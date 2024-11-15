import React, { useState, useEffect, Fragment } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
} from 'antd';
import { connect } from 'umi';
import valid from '@/fn/valid';
import styles from '@/style/style.less';

const { Option } = Select;

export const ComOpModal = props => {
  const [form] = Form.useForm();
  const [viewLoading, setViewLoading] = useState(false);
  const {
    visible,
    onCancel,
    onSubmit,
    enterpriseList: { listallList, agent_eid },
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
    } else if (visible) {
      // agent_eid
      form.setFieldsValue({ agent_eid: agent_eid });
    }
  }, [visible]);

  // ui -----
  const handleSubmit = () => {
    if (!form) return;
    setViewLoading(true);
    form.submit();
  };

  const handleFinish = values => {
    if (onSubmit) {
      // sessionStorage
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
          name="agent_eid"
          label="選擇企業"
          validateFirst={true}
        >
          <Select
            options={listallList.map((elem) => ({ label: elem.name, value: elem.id }))}
          />
        </Form.Item>
      </Form>
    );
  }

  return (
    <Modal
      title={
        <Fragment>
          切換結算企業
          <br />
          <span className={styles.om_color_gray} style={{ fontSize: '14px' }}>將以此企業版權資料進行結算</span>
          <br />
          <span className={styles.om_color_red} style={{ fontSize: '14px' }}>*正在編輯的資料會被清除</span>
        </Fragment>
      }
      visible={visible}
      cancelText="取消"
      okText="送出"
      onOk={handleSubmit}
      onCancel={onCancel}
      forceRender={true}
      okButtonProps={{ disabled: viewLoading }}
      cancelButtonProps={{ disabled: viewLoading }}
      closable={!viewLoading}
    >
      {modalForm()}
    </Modal>
  );
}

export default connect(({ enterpriseList }) => ({
  enterpriseList,
}))(ComOpModal);