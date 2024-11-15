import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Table,
  Input,
  Select,
} from 'antd';
import { connect } from 'umi';
import FormAlbumNameAPI from '@/components/FormAlbumNameAPI';

export const ComAlbumOpModal = props => {
  const [form] = Form.useForm();
  const {
    loadingUpdateMediaSongMatch,
    dispatch,
    albumList,
    // from parent
    visible,
    editItem,
    editAlbumList,
    onCancel,
    onSubmit,
  } = props;
  const [saveItem, setSaveItem] = useState({});
  // album_id
  const [albumIdList, setAlbumIdList] = useState([]);
  const [albumInfo, setAlbumInfo] = useState([]);

  // api -----
  // edit to set data
  useEffect(() => {
    if (editItem) {
      form.setFieldsValue({
        ...editItem,
      });

      setSaveItem({ ...editItem });
      setAlbumIdList([]);
      setAlbumInfo([]);
    }
  }, [editItem]);

  // hide to reset
  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [visible]);

  // valid -----
  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = values => {
    if (onSubmit) {
      let saveObj = {
        agent_eid: '',
        company_media_id: '',
        file_list_id: '',
        is_album: '1',
        is_ours: '1',
        data_list: [
          { ...saveItem }
        ]
      };

      saveObj.data_list[0].album_id = values.album_id;
      saveObj.data_list[0].album_code = values.album_code;

      onSubmit(saveObj);
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
              label="平台歌編"
              shouldUpdate
            >
              {() => {
                return (editItem && editItem.media_song_code) ? (editItem.media_song_code) : ('');
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
              label="專輯名稱"
              name="album_id"
            >
              <Select
                options={editAlbumList.map((elem) => ({ ...elem, value: elem.album_id, label: elem.album_name }))}
                onChange={(value, option) => {
                  setAlbumInfo((option) ? [option] : [])
                  form.setFieldsValue({ album_code: (option && option.album_code) ? (option.album_code) : ('') });
                }}
              />
            </Form.Item>
          </Col>
          <Col
            span={12}
            style={{ display: 'none' }}
          >
            <Form.Item
              name="album_code"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="專輯編號"
              shouldUpdate
            >
              {() => {
                return (albumInfo && albumInfo[0] && albumInfo[0].album_code) ? (albumInfo[0].album_code) : ('');
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
      dataIndex: 'album_singer',
      key: 'album_singer',
    },
    {
      title: '型態',
      dataIndex: 'album_type',
      key: 'album_type',
    },
    {
      title: '發行地區',
      dataIndex: 'album_release_country_name',
      key: 'album_release_country_name',
    },
    {
      title: '發行公司',
      dataIndex: 'release_company_name',
      key: 'release_company_name',
    },
    {
      title: '曲數',
      dataIndex: 'album_song_num',
      key: 'album_song_num',
    },
  ];

  return (
    <Modal
      width={850}
      maskClosable={false}
      title="辨識為整張專輯"
      visible={visible}
      cancelText="取消"
      okText="送出"
      onOk={handleSubmit}
      onCancel={onCancel}
      forceRender={true}
      okButtonProps={{ disabled: loadingUpdateMediaSongMatch }}
      cancelButtonProps={{ disabled: loadingUpdateMediaSongMatch }}
      closable={!loadingUpdateMediaSongMatch}
    >
      {modalForm()}
      <Table
        pagination={false}
        loading={loadingUpdateMediaSongMatch}
        columns={columns}
        dataSource={(albumInfo) ? (albumInfo) : []}
        rowKey="id"
      />
    </Modal>
  );
}

export default connect(({ albumList, songList, loading }) => ({
  albumList,
  songList,
  loadingUpdateMediaSongMatch: loading.effects['settleMediaList/fetchUpdateMediaSongMatch'],
}))(ComAlbumOpModal);