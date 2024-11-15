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
import FormSongNameAPI from '@/components/FormSongNameAPI';

export const ComSongMediaOpModal = props => {
  const [form] = Form.useForm();
  const {
    loadingGetISRCListBySong,
    loadingUpdateMediaSongMatch,
    dispatch,
    enterpriseList,
    songList: { changeId, iSRCListBySong },
    // from parent
    visible,
    editItem,
    onCancel,
    onSubmit,
    uiType,
  } = props;
  const [isIsrc, setIsIsrc] = useState('');
  const [isrcList, setIsrcList] = useState([]);
  const [saveItem, setSaveItem] = useState({});
  // song_code
  const [songCodeList, setSongCodeList] = useState([]);
  const [songCodeLabel, setSongCodeLabel] = useState('');

  // api -----
  // edit to set data
  useEffect(() => {
    if (editItem) {
      form.setFieldsValue({
        ...editItem,
      });

      setSaveItem({ ...editItem });
      setIsIsrc(editItem.isrc);

      if (editItem.song_code) {
        getIsrc(editItem.song_code);
      } else {
        setIsrcList([]);
      }
    }
  }, [editItem]);

  // getIsrc
  const getIsrc = (songCode) => {
    let tmpSongCode = '';

    if (!songCode) {
      setIsrcList([]);
      setIsIsrc('');
      form.setFieldsValue({ isrc: '' });
    } else {
      if (typeof (songCode) === 'string') {
        tmpSongCode = songCode;
      } else {
        tmpSongCode = songCode.value;
      }

      dispatch({
        type: 'songList/fetchGetISRCListBySong',
        payload: {
          song_code: tmpSongCode,
          agent_eid: enterpriseList.agent_eid,
        },
        callback: (result) => {
          let newIsrcList = (result.data_list) ? (result.data_list.map((elem, idx, arr) => {
            return { label: elem.isrc, value: elem.isrc };
          })) : ([]);

          setIsrcList(newIsrcList);
        }
      });
    }
  }

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
        is_album: '0',
        is_ours: '1',
        data_list: [
          { ...saveItem }
        ]
      };

      saveObj.data_list[0].isrc = values.isrc;
      saveObj.data_list[0].song_code = values.song_code;

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
            <FormSongNameAPI
              form={form}
              isLabel="歌曲"
              isName="song_code"
              isSelectText="song_name"
              isList={songCodeList}
              setIsList={setSongCodeList}
              codeLabel={songCodeLabel}
              setCodeLabel={setSongCodeLabel}
              changeFn={getIsrc}
              rules={[
                {
                  required: true,
                  message: '此欄位為必填'
                }
              ]}
            />
          </Col>
          <Col span={12}>
            <Form.Item
              name="isrc"
              label="ISRC"
              rules={[
                {
                  required: (uiType == 'righ') ? (false) : (true),
                  message: '此欄位為必填'
                }
              ]}
            >
              <Select
                options={isrcList}
                onChange={(value, option) => {
                  setIsIsrc(value);
                }}
              />
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
      okButtonProps={{ disabled: loadingGetISRCListBySong || loadingUpdateMediaSongMatch }}
      cancelButtonProps={{ disabled: loadingGetISRCListBySong || loadingUpdateMediaSongMatch }}
      closable={!loadingGetISRCListBySong || loadingUpdateMediaSongMatch}
    >
      {modalForm()}
      <Table
        pagination={false}
        loading={loadingGetISRCListBySong || loadingUpdateMediaSongMatch}
        columns={columns}
        dataSource={iSRCListBySong.data_list}
        rowClassName={(record, index) => (record.isrc && record.isrc == isIsrc) ? (styles.om_show_table_row) : (styles.om_hide_table_row)}
        rowKey={(record) => (`isrcTable_${record.id}`)}
      />
    </Modal>
  );
}

export default connect(({ enterpriseList, songList, loading }) => ({
  enterpriseList,
  songList,
  loadingGetISRCListBySong: loading.effects['songList/fetchGetISRCListBySong'],
  loadingUpdateMediaSongMatch: loading.effects['settleMediaList/fetchUpdateMediaSongMatch'],
}))(ComSongMediaOpModal);