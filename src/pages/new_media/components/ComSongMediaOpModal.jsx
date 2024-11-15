import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Select,
  Table
} from 'antd';
import { connect } from 'umi';
import styles from '@/style/style.less';

export const ComSongMediaOpModal = props => {
  const [form] = Form.useForm();
  const {
    loadingGetISRCListBySong,
    dispatch,
    enterpriseList,
    songList: { changeId, iSRCListBySong },
    // from parent
    visible,
    editItem,
    onCancel,
    onSubmit,
  } = props;
  const [isIsrc, setIsIsrc] = useState('');
  const [songCodeList, setSongCodeList] = useState([]);

  // api -----
  // edit to set data
  useEffect(() => {
    if (editItem) {
      form.setFieldsValue({
        ...editItem,
      });

      setIsIsrc(editItem.isrc);

      if (editItem.song_code) {
        dispatch({
          type: 'songList/fetchGetISRCListBySong',
          payload: {
            agent_eid: enterpriseList.agent_eid,
            song_code: editItem.song_code,
          }
        });
      } else {
        setSongCodeList([]);
      }
    }
  }, [editItem]);

  // hide to reset
  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [visible]);

  // update options
  useEffect(() => {
    if (editItem && editItem.song_code && iSRCListBySong) {
      let newIsrcList = iSRCListBySong.data_list.map((elem, idx, arr) => {
        return { label: elem.isrc, value: elem.isrc };
      });
      setSongCodeList(newIsrcList);
    }
  }, [changeId]);

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
  // modalForm
  const modalForm = () => {
    return (
      <Form
        form={form}
        onFinish={handleFinish}
      >
        <Row gutter={[8, 0]}>
          <Col span={12}>
            <Form.Item
              label="平台名稱"
              shouldUpdate
            >
              {() => {
                return (editItem && editItem.company_name) ? (editItem.company_name) : ('');
              }}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="平台歌名"
              shouldUpdate
            >
              {() => {
                return (editItem) ? (editItem.media_song_name) : ('');
              }}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col span={12}>
            <Form.Item
              name="isrc"
              label="ISRC調整"
            >
              <Select
                options={songCodeList}
                onChange={(value, option) => {
                  setIsIsrc(value);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="歌曲編號"
              shouldUpdate
            >
              {() => {
                return (editItem) ? (editItem.song_code) : ('');
              }}
            </Form.Item>
          </Col>
        </Row>
      </Form >
    );
  }

  // table
  const columns = [
    {
      title: '演唱人',
      dataIndex: 'singer',
      key: 'singer',
    },

    {
      title: '歌名',
      dataIndex: 'song_name',
      key: 'song_name',
    },
    {
      title: '型態',
      dataIndex: 'isrc_type',
      key: 'isrc_type',
    },
    {
      title: '版別',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '秒數',
      dataIndex: 'length',
      key: 'length',
    },
    {
      title: '母帶',
      dataIndex: 'tape_company',
      key: 'tape_company',
      render: (text, row, index) => {
        return (text) ? (text.join(', ')) : '';
      }
    },
  ];

  return (
    <Modal
      width={650}
      maskClosable={false}
      title="新媒體歌編修改"
      visible={visible}
      cancelText="取消"
      okText="送出"
      onOk={handleSubmit}
      onCancel={onCancel}
      forceRender={true}
      okButtonProps={{ disabled: loadingGetISRCListBySong }}
      cancelButtonProps={{ disabled: loadingGetISRCListBySong }}
      closable={!loadingGetISRCListBySong}
    >
      {modalForm()}
      <Table
        pagination={false}
        loading={loadingGetISRCListBySong}
        columns={columns}
        dataSource={iSRCListBySong.data_list}
        rowClassName={(record, index) => (record.isrc && record.isrc == isIsrc) ? (styles.om_show_table_row) : (styles.om_hide_table_row)}
        rowKey={(record) => (`isrcTable_${record.id}`)}
      />
    </Modal>
  );
}

export default connect(({ enterpriseList, songList, loading, loadingGetISRCListBySong }) => ({
  enterpriseList,
  songList,
  loadingGetISRCListBySong: loading.effects['songList/fetchGetISRCListBySong'],
}))(ComSongMediaOpModal);