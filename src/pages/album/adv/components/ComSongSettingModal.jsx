import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Checkbox,
} from 'antd';
import { connect } from 'umi';
import commFn from '@/fn/comm';
import styles from '@/style/style.less';

const { Option } = Select;

export const ComCopyModal = props => {
  const [form] = Form.useForm();
  const {
    loading,
    visible,
    editItem,
    onCancel,
    onSubmit,
  } = props;
  const formLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 13,
    },
  };
  // isrc
  const [isrcList, setIsrcList] = useState([]);
  const [isSongCalcDisabled, setIsSongCalcDisabled] = useState(false);
  const [isRecordCalcDisabled, setIsRecordCalcDisabled] = useState(false);

  // api -----
  // hide to reset
  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
      setIsrcList([]);
    }
  }, [visible]);

  // getIsrcList
  const getIsrcList = (song_code, init) => {
    if (song_code) {
      fetch(`${window.FRONTEND_WEB}/song/detail_isrc?song_code=${song_code}`).then(
        res => res.json()
      ).then(opts => {
        if (opts.data && opts.data.data_list && opts.data.data_list.length > 0) {
          if (!init) {
            form.setFieldsValue({ isrc: opts.data.data_list[0].isrc });
          }
          setIsrcList(opts.data.data_list.map((elem) => ({ ...elem, value: elem.isrc, label: elem.isrc })));
        } else {
          if (!init) {
            form.setFieldsValue({ isrc: '' });
          }
          setIsrcList([]);
        }
      }).catch(err => {
        if (!init) {
          form.setFieldsValue({ isrc: '' });
        }
        setIsrcList([]);
      });
    } else {
      if (!init) {
        form.setFieldsValue({ isrc: '' });
      }
      setIsrcList([]);
    }
  }

  // edit to set data
  useEffect(() => {
    if (editItem) {
      form.setFieldsValue({
        ...editItem,
      });

      // changeUI
      changeUI('is_song_right_calc', form.getFieldsValue()['is_song_right_calc']);
      changeUI('is_record_right_calc', form.getFieldsValue()['is_record_right_calc']);

      getIsrcList(editItem.song_code, true);
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

  const changeUI = (name, val) => {
    // 當詞曲結算勾選，則鎖住詞曲曲數計算並勾選
    if (name == 'is_song_right_calc') {
      if (val) {
        setIsSongCalcDisabled(true);
        form.setFieldsValue({ is_song_calc: true });
      } else {
        setIsSongCalcDisabled(false);
      }
    }

    // 當錄音結算勾選，則鎖住錄音曲數計算並勾選
    if (name == 'is_record_right_calc') {
      if (val) {
        setIsRecordCalcDisabled(true);
        form.setFieldsValue({ is_record_calc: true });
      } else {
        setIsRecordCalcDisabled(false);
      }
    }
  }

  const modalForm = () => {
    return (
      <Form
        {...formLayout}
        form={form}
        onFinish={handleFinish}
      >
        <Row
          gutter={[24, 0]}
          style={{ display: 'none' }}
        >
          <Col
            xs={24}
            lg={12}
          >
            <Form.Item
              name="disc_content_id"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col
            xs={24}
            lg={12}
          >
            <Form.Item
              label="專輯編號"
              shouldUpdate
            >
              {() => {
                return (editItem) ? (editItem.album_code) : ('');
              }}
            </Form.Item>
          </Col>
          <Col
            xs={24}
            lg={12}
          >
            <Form.Item
              label="專輯名稱"
              shouldUpdate
            >
              {() => {
                return (editItem) ? (editItem.album_name_zh) : ('');
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
              label="歌曲名稱"
              shouldUpdate
            >
              {() => {
                return (editItem) ? (editItem.song_name) : ('');
              }}
            </Form.Item>
          </Col>
          <Col
            xs={24}
            lg={12}
          >
            <Form.Item
              name="song_name_ext"
              label="歌名變化"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col
            xs={24}
            lg={12}
          >
            <Form.Item
              name="isrc"
              label="ISRC"
            >
              <Select
                options={isrcList}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col
            xs={24}
            className={styles.om_overflow_auto}
          >
            <table className={styles.formTable}>
              <thead>
                <tr>
                  <th className={styles.om_txt_align_c}>首發</th>
                  <th
                    className={styles.om_txt_align_c}
                    style={{ display: (editItem && editItem.ui_info_type_id && (editItem.ui_info_type_id == '10' || editItem.ui_info_type_id == '11')) ? ('none') : ('table-cell') }}
                  >
                    詞曲曲數計算
                  </th>
                  <th
                    className={styles.om_txt_align_c}
                    style={{ display: (editItem && editItem.ui_info_type_id && (editItem.ui_info_type_id == '10' || editItem.ui_info_type_id == '11')) ? ('none') : ('table-cell') }}
                  >
                    詞曲結算
                  </th>
                  <th
                    className={styles.om_txt_align_c}
                    style={{ display: (editItem && editItem.ui_info_type_id && (editItem.ui_info_type_id == '10' || editItem.ui_info_type_id == '11')) ? ('none') : ('table-cell') }}
                  >
                    錄音曲數計算
                  </th>
                  <th
                    className={styles.om_txt_align_c}
                    style={{ display: (editItem && editItem.ui_info_type_id && (editItem.ui_info_type_id == '10' || editItem.ui_info_type_id == '11')) ? ('none') : ('table-cell') }}
                  >
                    錄音結算
                  </th>
                  <th className={styles.om_txt_align_c}>新媒體詞曲曲數</th>
                  <th className={styles.om_txt_align_c}>新媒體錄音曲數</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.om_txt_align_c}>
                    <Form.Item
                      name="is_debut"
                      className={styles.om_dis_inlinebl}
                      valuePropName="checked"
                    >
                      <Checkbox />
                    </Form.Item>
                  </td>
                  <td
                    className={styles.om_txt_align_c}
                    style={{ display: (editItem && editItem.ui_info_type_id && (editItem.ui_info_type_id == '10' || editItem.ui_info_type_id == '11')) ? ('none') : ('table-cell') }}
                  >
                    <Form.Item
                      name="is_song_calc"
                      className={styles.om_dis_inlinebl}
                      valuePropName="checked"
                    >
                      <Checkbox
                        disabled={isSongCalcDisabled}
                      />
                    </Form.Item>
                  </td>
                  <td
                    className={styles.om_txt_align_c}
                    style={{ display: (editItem && editItem.ui_info_type_id && (editItem.ui_info_type_id == '10' || editItem.ui_info_type_id == '11')) ? ('none') : ('table-cell') }}
                  >
                    <Form.Item
                      name="is_song_right_calc"
                      className={styles.om_dis_inlinebl}
                      valuePropName="checked"
                    >
                      <Checkbox
                        onChange={(e) => {
                          changeUI('is_song_right_calc', e.target.checked);
                        }}
                      />
                    </Form.Item>
                  </td>
                  <td
                    className={styles.om_txt_align_c}
                    style={{ display: (editItem && editItem.ui_info_type_id && (editItem.ui_info_type_id == '10' || editItem.ui_info_type_id == '11')) ? ('none') : ('table-cell') }}
                  >
                    <Form.Item
                      name="is_record_calc"
                      className={styles.om_dis_inlinebl}
                      valuePropName="checked"
                    >
                      <Checkbox
                        disabled={isRecordCalcDisabled}
                      />
                    </Form.Item>
                  </td>
                  <td
                    className={styles.om_txt_align_c}
                    style={{ display: (editItem && editItem.ui_info_type_id && (editItem.ui_info_type_id == '10' || editItem.ui_info_type_id == '11')) ? ('none') : ('table-cell') }}
                  >
                    <Form.Item
                      name="is_record_right_calc"
                      className={styles.om_dis_inlinebl}
                      valuePropName="checked"
                    >
                      <Checkbox
                        onChange={(e) => {
                          changeUI('is_record_right_calc', e.target.checked);
                        }}
                      />
                    </Form.Item>
                  </td>
                  <td className={styles.om_txt_align_c}>
                    <Form.Item
                      name="is_nm_song_calc"
                      className={styles.om_dis_inlinebl}
                      valuePropName="checked"
                    >
                      <Checkbox />
                    </Form.Item>
                  </td>
                  <td className={styles.om_txt_align_c}>
                    <Form.Item
                      name="is_nm_record_calc"
                      className={styles.om_dis_inlinebl}
                      valuePropName="checked"
                    >
                      <Checkbox />
                    </Form.Item>
                  </td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
      </Form >
    );
  }

  return (
    <Modal
      width={850}
      title="歌曲設定"
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

export default connect(({ albumList, loading }) => ({
  albumList,
  loading: loading.models.albumList,
}))(ComCopyModal);