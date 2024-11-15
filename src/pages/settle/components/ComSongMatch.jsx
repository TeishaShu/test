import React, { useState, useEffect, Fragment } from 'react';
import {
  Button,
  Modal,
  Spin,
  Card,
  Row,
  Col,
  Table,
  Tooltip,
  message,
  Result,
} from 'antd';
import { SwapOutlined, LoginOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import InfoBanner from '@/components/InfoBanner';
import ComDescription from './ComDescription';
import ComSongMediaOpModal from './ComSongMediaOpModal';
import ComAlbumOpModal from './ComAlbumOpModal';

export const ComSongMatch = props => {
  const {
    loading,
    dispatch,
    enterpriseList,
    settlePhaseList,
    settleMediaList: { mediaSongMatchList },
    uiType,
    currentStep,
    setCurrentStep,
  } = props;
  const { confirm } = Modal;
  // checkbox
  const [selectedRows, setSelectRows] = useState([]);
  const [selectedRowsArray, setSelectedRowsArray] = useState([]);
  // for ComSongMediaOpModal (調整歌曲)
  const [cSMOpModalVisible, setCSMOpModalVisible] = useState(false);
  const [editCSMOpModalItem, setEditCSMOpModalItem] = useState(undefined);
  // for ComAlbumOpModal (認整張專輯)
  const [cAOpModalVisible, setCAMOpModalVisible] = useState(false);
  const [editAMOpModalItem, setEditAMOpModalItem] = useState(undefined);
  const [editAlbumList, setEditAlbumList] = useState([]);

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'settleMediaList/fetchGetMdieaSongMatchList',
      payload: {
        agent_eid: enterpriseList.agent_eid,
        file_list_id: (currentStep.list.detail)
          ? ([currentStep.list.file_list_id, ...currentStep.list.detail.map((elem) => (elem.settle_file_id))])
          : (currentStep.list.file_list_id),
        company_media_id: currentStep.list.company_media_id,
      },
      callback: (result) => {
        if (result && result.data_list && result.data_list.length == 0) {
          message.success('比對歌曲完成');

          if (uiType == 'righ') {
            setCurrentStep({ step: 0, list: {} });
          } else {
            setCurrentStep((prev) => ({ ...prev, step: prev.step.replace(/[0-9]/g, '') + '0' }));
          }
        }
      }
    });
  }

  const matchSong = (data, isAlbum, isAllCheck) => {
    let tmpIsOUrs = (data[0]['ui_is_ours']) ? '1' : '0';
    let tmpList = mediaSongMatchList.data_list;

    if (isAllCheck) {
      tmpIsOUrs = '1';
      tmpList = tmpList.filter((elem) => elem.ui_is_ours && data.includes(elem.id));
    }

    dispatch({
      type: 'settleMediaList/fetchUpdateMediaSongMatch',
      payload: {
        agent_eid: enterpriseList.agent_eid,
        file_list_id: (currentStep.list.detail)
          ? ([currentStep.list.file_list_id, ...currentStep.list.detail.map((elem) => (elem.settle_file_id))])
          : (currentStep.list.file_list_id),
        company_media_id: currentStep.list.company_media_id,
        is_album: (isAlbum) ? '1' : '0',
        is_ours: tmpIsOUrs,
        data_list: (isAllCheck) ? (tmpList) : (data),
      },
      callback: (result) => {
        if (result != 'error') {
          getData();
        }
      }
    });
  }

  // mount, update id
  useEffect(() => {
    getData();
  }, []);

  // ComSongMediaOpModal -----
  // submit
  const handleCSMOpModalSubmit = (obj) => {
    let tmpObj = {
      ...obj,
      agent_eid: enterpriseList.agent_eid,
      file_list_id: (currentStep.list.detail)
        ? ([currentStep.list.file_list_id, ...currentStep.list.detail.map((elem) => (elem.settle_file_id))])
        : (currentStep.list.file_list_id),
      company_media_id: currentStep.list.company_media_id,
    };

    dispatch({
      type: 'settleMediaList/fetchUpdateMediaSongMatch',
      payload: tmpObj,
      callback: (result) => {
        if (result != 'error') {
          hideCSMOpModal();
          getData();
        }
      }
    });
  }

  //  hide
  const hideCSMOpModal = () => {
    setCSMOpModalVisible(false);
  }

  // edit
  const showCSMOpModal = (item) => {
    setCSMOpModalVisible(true);
    setEditCSMOpModalItem(Object.assign({}, item));
  }

  // ComAlbumOpModal -----
  // markAsAlbum
  const markAsAlbum = (row) => {
    dispatch({
      type: 'settleMediaList/fetchMarkAsAlbum',
      payload: {
        id: row.id,
        song_media_id: row.song_media_id,
        agent_eid: enterpriseList.agent_eid,
        file_list_id: (currentStep.list.detail)
          ? ([currentStep.list.file_list_id, ...currentStep.list.detail.map((elem) => (elem.settle_file_id))])
          : (currentStep.list.file_list_id),
        company_media_id: currentStep.list.company_media_id,
      },
      callback: (result) => {
        if (result && result.data_list && result.data_list.length > 0) {
          setEditAlbumList([...result.data_list]);
          showCAOpModal(row);
        } else if (result && result != 'error') {
          message.success('儲存成功');
          getData();
        }
      }
    });
  }

  // submit
  const handleCAOpModalSubmit = (obj) => {
    let tmpObj = {
      ...obj,
      agent_eid: enterpriseList.agent_eid,
      file_list_id: (currentStep.list.detail)
        ? (currentStep.list.detail.map((elem) => (elem.settle_file_id)))
        : (currentStep.list.file_list_id),
      company_media_id: currentStep.list.company_media_id,
    };

    dispatch({
      type: 'settleMediaList/fetchUpdateMediaSongMatch',
      payload: tmpObj,
      callback: (result) => {
        if (result != 'error') {
          hideCAOpModal();
          getData();
        }
      }
    });
  }

  //  hide
  const hideCAOpModal = () => {
    setCAMOpModalVisible(false);
  }

  // edit
  const showCAOpModal = (item) => {
    setCAMOpModalVisible(true);
    setEditAMOpModalItem(Object.assign({}, item));
  }

  // ui -----
  // confirm
  const showConfirm = (content, callback, parmeter) => {
    confirm({
      title: '',
      icon: '',
      content: content,
      okText: '確定',
      cancelText: '取消',
      onOk() {
        callback(parmeter);
      },
      onCancel() { },
    });
  }

  // PageHeaderWrapper(extra) - buttonsList
  const buttonsList = (
    <div>
      <Button onClick={() => {
        if (uiType == 'righ') {
          setCurrentStep({ step: 0, list: {} });
        } else {
          setCurrentStep((prev) => ({ ...prev, step: prev.step.replace(/[0-9]/g, '') + '0' }));
        }
      }}>{(uiType == 'righ') ? '詞曲' : '錄音'}新媒體清單</Button>
      <Button
        type="primary"
        className={styles.om_sp_m_lb}
        onClick={() => {
          history.push('/new_media');
        }}
      > 歌編清單</Button>
    </div>
  );

  // checkbox
  const onSelectChange = (selectedRowKeys, selectedRows) => {
    let tmpSelect = selectedRows.filter((elem) => elem.ui_is_ours).map((mElem) => mElem.id);

    setSelectRows([...tmpSelect]);
    setSelectedRowsArray([...selectedRowKeys]);
  }

  // table
  const columns = [
    {
      title: '平台編號',
      dataIndex: 'ui_media_song_code',
      key: 'ui_media_song_code',
    },
    {
      title: '平台歌名',
      dataIndex: 'ui_media_song_name',
      key: 'ui_media_song_name',
    },
    {
      title: '演唱者',
      dataIndex: 'singer',
      key: 'singer',
    },
    {
      title: 'ISRC',
      dataIndex: 'isrc',
      key: 'isrc',
    },
    {
      title: '',
      dataIndex: 'ui_is_ours',
      key: 'ui_is_ours',
      render: (text, row, index) => {
        return (
          (text)
            ? (
              <CheckOutlined
                style={{ fontSize: '16px', color: '#60CB28' }}
                onClick={() => {
                  showConfirm(`平台編號${row.media_song_code}歌曲確定與系統為相同歌曲？`, matchSong, [row]);
                }}
              />
            )
            : (
              <CloseOutlined
                style={{ fontSize: '16px', color: '#E75757' }}
                onClick={() => {
                  showConfirm(`平台編號${row.media_song_code}歌曲確定不計算？`, matchSong, [row]);
                }}
              />
            )
        );
      }
    },
    {
      title: '歌編',
      dataIndex: 'song_code',
      key: 'song_code',
      render: (text, row, index) => {
        return (
          (text)
            ? (text)
            : (
              <span className={styles.om_color_red}>非我方/不計算</span>
            )
        );
      }
    },
    {
      title: '系統歌名',
      dataIndex: 'ui_song_name',
      key: 'ui_song_name',
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (text, row, index) => {
        return (
          (row.ui_is_ours || !row.ui_has_ours)
            ? (
              <Tooltip title="調整對應歌曲">
                <SwapOutlined
                  className={`${styles.om_icon_style} ${styles.om_color_green2}`}
                  onClick={() => {
                    showCSMOpModal(row);
                  }}
                />
              </Tooltip>
            )
            : (null)
        );
      }
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (text, row, index) => {
        return (
          ((row.ui_is_ours || !row.ui_has_ours) && text && row.media_isrc)
            ? (
              <Tooltip title="認作整張專輯">
                <LoginOutlined
                  className={`${styles.om_icon_style} ${styles.om_color_link_blue}`}
                  onClick={() => {
                    markAsAlbum(row);
                  }}
                />
              </Tooltip>
            )
            : (null)
        );
      }
    },
  ];

  return (
    <Spin
      tip="Loading..."
      spinning={loading}
    >
      <PageHeaderWrapper
        className={styles.pageHeaderWrapper}
        title={`${(uiType == 'righ') ? '詞曲' : '錄音'}新媒體 - ${(currentStep.list && currentStep.list.company_media) && currentStep.list.company_media}`}
        extra={buttonsList}
        content={
          <ComDescription
            data={currentStep.list}
            phaseList={
              (uiType == 'righ')
                ? (settlePhaseList.newMediaRight.current)
                : (settlePhaseList.newMediaRecord.current)
            }
          />
        }
        extraContent={
          <InfoBanner
            first={true}
            desc="待確認歌曲"
            title1={
              (mediaSongMatchList && mediaSongMatchList.total_items)
                ? (mediaSongMatchList.total_items)
                : ('0')
            }
          />
        }
      >
        <Card bordered={false}>
          {
            (mediaSongMatchList && mediaSongMatchList.data_list)
              ? (
                <Fragment>
                  <Row>
                    <Col xs={24}>
                      <Button
                        className={styles.om_sp_m_rb}
                        onClick={() => {
                          if (selectedRows.length == 0) {
                            commFn.errHandler('請先選取歌曲');
                          } else {
                            matchSong([...selectedRows], false, true);
                          }
                        }}
                      >大量認歌</Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={24}>
                      <Table
                        className={styles.mainTable}
                        pagination={false}
                        loading={false}
                        columns={columns}
                        dataSource={mediaSongMatchList.data_list}
                        rowKey="ui_id"
                        rowSelection={{
                          selectedRowKeys: selectedRowsArray,
                          type: 'checkbox',
                          onChange: onSelectChange,
                          renderCell: (checked, record, index, originNode) => {
                            return (record.ui_is_ours) ? (originNode) : (null);
                          }
                        }}
                      />
                    </Col>
                  </Row>
                </Fragment>
              )
              : (
                <Result
                  status="warning"
                  title="查無資料"
                />
              )
          }
        </Card>
      </PageHeaderWrapper>
      <ComSongMediaOpModal
        visible={cSMOpModalVisible}
        editItem={editCSMOpModalItem}
        onCancel={hideCSMOpModal}
        onSubmit={handleCSMOpModalSubmit}
        uiType={uiType}
      />
      <ComAlbumOpModal
        visible={cAOpModalVisible}
        editItem={editAMOpModalItem}
        editAlbumList={editAlbumList}
        onCancel={hideCAOpModal}
        onSubmit={handleCAOpModalSubmit}
      />
    </Spin>
  );
}

export default connect(({ enterpriseList, settlePhaseList, settleMediaList, loading }) => ({
  enterpriseList,
  settlePhaseList,
  settleMediaList,
  loading: loading.models.settleMediaList,
}))(ComSongMatch);