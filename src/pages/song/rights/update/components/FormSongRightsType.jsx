import React, { Fragment } from 'react';
import {
  Form,
  Input,
  Radio,
  Select,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const FormSongRightsType = props => {
  const { form, fieldLabels, isSongRightsTypeRadioId, setIsSongRightsTypeRadioId, optSongRightsType, songRightsTypeId, } = props;
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
    marginTop: '2px',
    marginBottom: '25px',
  };
  // ui -----
  const changeSongRightsTypeRadioId = (e) => {
    setIsSongRightsTypeRadioId(e.target.value);
  }

  const changeSongRightsTypeId = () => {
    form.setFieldsValue({ song_rights_type_radio_id: '0' });
    setIsSongRightsTypeRadioId('0');
  }

  const clickSongRightsTypeCustom = () => {
    form.setFieldsValue({ song_rights_type_radio_id: '1' });
    setIsSongRightsTypeRadioId('1');
  }

  return (
    <Fragment>
      <Form.Item
        name="song_rights_type_radio_id"
        label="權利"
        className={styles.addRequiredStar}
        style={{ position: 'absolute' }}
      >
        <Radio.Group
          onChange={changeSongRightsTypeRadioId}
        >
          <Radio value="0" style={radioStyle} disabled={(songRightsTypeId === "詞曲")}></Radio>
          <Radio value="1" style={radioStyle} disabled={(songRightsTypeId === "詞曲")}>自訂</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="song_rights_type_id"
        label={fieldLabels.song_rights_type_id}
        className={styles.om_hide_label}
        style={{ marginLeft: '30px', marginTop: '30px' }}
        rules={[
          { required: !commFn.convertToBool(isSongRightsTypeRadioId), message: '選擇此選項則為必填' }
        ]}
      >
        <Select
          options={optSongRightsType}
          onChange={changeSongRightsTypeId}
          disabled={(songRightsTypeId === "詞曲")}
        />
      </Form.Item>
      <Form.Item
        name="song_rights_type_custom"
        label={fieldLabels.song_rights_type_custom}
        className={styles.om_hide_label}
        rules={[
          {
            required: commFn.convertToBool(isSongRightsTypeRadioId), message: '選擇此選項則為必填'
          }
        ]}
        onClick={clickSongRightsTypeCustom}
        style={{ marginLeft: '60px' }}
      >
        <Input disabled={(songRightsTypeId === "詞曲")} />
      </Form.Item>
    </Fragment >
  );
}

export default FormSongRightsType;

