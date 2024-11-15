import React, { useState, useEffect, Fragment } from 'react';
import {
  Form,
  Card,
  Row,
  Col,
  Input,
  Checkbox,
  Radio,
  Select,
  Button,
  Modal,
  Popover,
  Spin,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const FormSongType = props => {
  const { form, fieldLabels, isSongTypeRadioId, setIsSongTypeRadioId, optSongType, } = props;
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
    marginTop: '2px',
    marginBottom: '25px',
  };

  // ui -----
  const changeSongTypeRadioId = (e) => {
    setIsSongTypeRadioId(e.target.value);
  }

  const changeSongTypeId = () => {
    form.setFieldsValue({ song_type_radio_id: '0' });
    setIsSongTypeRadioId('0');
  }

  const clickSongTypeCustom = () => {
    form.setFieldsValue({ song_type_radio_id: '1' });
    setIsSongTypeRadioId('1');
  }

  return (
    <Fragment>
      <Form.Item
        name="song_type_radio_id"
        label="型態"
        style={{ position: 'absolute' }}
      >
        <Radio.Group
          onChange={changeSongTypeRadioId}
        >
          <Radio value="0" style={radioStyle}></Radio>
          <Radio value="1" style={radioStyle}>自訂</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="song_type_id"
        style={{ marginLeft: '30px', marginTop: '30px' }}
      >
        <Select
          options={optSongType}
          onChange={changeSongTypeId}
        />
      </Form.Item>
      <Form.Item
        name="song_type_custom"
        label={fieldLabels.song_type_custom}
        className={styles.om_hide_label}
        rules={[
          { required: commFn.convertToBool(isSongTypeRadioId), message: '此欄位為必填' }
        ]}
        onClick={clickSongTypeCustom}
        style={{ marginLeft: '60px' }}
      >
        <Input />
      </Form.Item>
    </Fragment >
  );
}

export default FormSongType;

