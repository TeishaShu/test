import globalSettings from '@/fn/globalsettings';
import { PlusOutlined, EditOutlined, CloseOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  Checkbox,
  Button,
  Pagination,
  Table,
  Modal,
  Tooltip,
} from 'antd';
import { connect } from 'umi';
import PageHint from '@/components/PageHint';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import ComSongMediaOpModal from '../components/ComSongMediaOpModal';

export const ComSongMedia = props => {
  const {
    loading,
    dispatch,
    enterpriseList,
    songMediaList: { changeId, songMediaList },
    pageId,
    setPageTitle,
  } = props;
  const { confirm } = Modal;
  const [keyword, setKeyword] = useState('');
  const [precise, setPrecise] = useState(false);
  const pageSize = globalSettings.pageSize;
  const [pageCurrent, setPageCurrent] = useState(1);
  // for ComSongMediaOpModal
  const [cSMOpModalVisible, setCSMOpModalVisible] = useState(false);
  const [editCSMOpModalItem, setEditCSMOpModalItem] = useState(undefined);

  // api -----
  // getData
  const getData = (obj) => {
    dispatch({
      type: 'songMediaList/fetchGetSongMediaList',
      payload: {
        agent_eid: enterpriseList.agent_eid,
        company_media_id: pageId,
        keyword: (obj && obj.keyword != undefined) ? (obj.keyword ? obj.keyword : undefined) : (keyword != '' ? keyword : undefined),
        precise: (obj && obj.precise != undefined) ? commFn.convertBoolToNumStr(obj.precise) : commFn.convertBoolToNumStr(precise),
        page_size: pageSize.toString(),
        page_current: (obj && obj.pageCurrent) ? obj.pageCurrent.toString() : pageCurrent.toString(),
      },
    });
  }

  // for ComSongMediaOpModal - submit
  const handleCSMOpModalSubmit = (obj) => {
    const id = editCSMOpModalItem ? editCSMOpModalItem.id : undefined;

    hideCSMOpModal();
    dispatch({
      type: 'songMediaList/fetchEditData',
      payload: {
        ...obj,
        id,
        agent_eid: enterpriseList.agent_eid,
      },
      callback: () => {
        getData();
      }
    });
  }

  // for ComSongMediaOpModal - remove
  const removeCSMOpModalData = (id) => {
    dispatch({
      type: 'songMediaList/fetchRemoveData',
      payload: {
        id,
        agent_eid: enterpriseList.agent_eid,
      },
      callback: () => {
        let checkPage = commFn.checkNoPage(pageCurrent, songMediaList.total_items);

        setPageCurrent(checkPage);
        getData({
          pageCurrent: checkPage,
        });
      }
    });
  }

  // mount (if pageId change)
  useEffect(() => {
    setPageCurrent(1);
    getData({
      pageCurrent: 1,
    });
  }, [pageId]);

  // updateData
  useEffect(() => {
    setPageTitle(`${songMediaList.company_name}-音樂歌編`);
  }, [changeId]);

  // ui -----
  // for ComSongMediaOpModal - edit
  const showCSMOpModal = (item) => {
    setCSMOpModalVisible(true);
    setEditCSMOpModalItem(Object.assign({}, item));
  }

  // for ComSongMediaOpModal - hide
  const hideCSMOpModal = () => {
    setCSMOpModalVisible(false);
  }

  // alert (remove)
  const showCSMOpModalConfirm = (item) => {
    confirm({
      title: '',
      icon: '',
      content: '確定要刪除嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        removeCSMOpModalData(item.id);
      },
      onCancel() { },
    });
  }

  // keyword
  const changeKeyword = (e) => {
    setKeyword(e.target.value);
  }

  // precise
  const changePrecise = (e) => {
    setPrecise(e.target.checked);
  }

  // clickQuery
  const clickQuery = () => {
    setPageCurrent(1);
    getData({
      keyword: keyword,
      precise: precise,
      pageCurrent: 1,
    });
  }

  // resetQuery
  const resetQuery = () => {
    setKeyword('');
    setPrecise(false);
    setPageCurrent(1);
    getData({
      keyword: '',
      precise: false,
      pageCurrent: 1,
    });
  }

  // page
  const changePage = (page) => {
    let nowPage = parseInt(page);
    setPageCurrent(nowPage);
    getData({ pageCurrent: nowPage });
  }

  // table columns
  const columns = [
    {
      title: '平台歌編',
      dataIndex: 'media_song_code',
      key: 'media_song_code',
    },
    {
      title: '平台歌名',
      dataIndex: 'media_song_name',
      key: 'media_song_name',
    },
    {
      title: '歌曲編號',
      dataIndex: 'song_code',
      key: 'song_code',
      className: styles.om_bd_l_dot,
      render: (text) => {
        return (text) ? (text) : ('-');
      }
    },
    {
      title: 'ISRC',
      dataIndex: 'isrc',
      key: 'isrc',
      render: (text, row, index) => {
        return (text) ? (commFn.strToISRC(text)) : ('-');
      }
    },
    {
      title: '',
      dataIndex: 'is_ours',
      key: 'is_ours',
      width: '55px',
      render: (text, row, index) => {
        if (row.is_ours == '0') {
          return (<Tooltip title="非我方"><ExclamationCircleOutlined className={`${styles.om_icon_style} ${styles.om_color_yellow}`} /></Tooltip>);
        } else if (row.is_album == '1') {
          return (<Tooltip title="認整張專輯"><CheckCircleOutlined className={`${styles.om_icon_style} ${styles.om_color_green}`} /></Tooltip>);
        }

        return '';
      }
    },
    {
      title: '專輯編號',
      dataIndex: 'album_code',
      key: 'album_code',
      render: (text, row, index) => {
        let tmpAlbumText = '';
        if (row.album_code) {
          tmpAlbumText += row.album_code;
        }

        if (row.album_release_country_name) {
          tmpAlbumText += `(${row.album_release_country_name})`;
        }

        return (tmpAlbumText) ? (tmpAlbumText) : ('-');
      }
    },

    {
      title: '演唱人',
      dataIndex: 'singer',
      key: 'singer',
      render: (text) => {
        return (text) ? (text) : ('-');
      }
    },
    {
      title: '母帶',
      dataIndex: 'tape_company',
      key: 'tape_company',
      render: (text, row, index) => {
        let renHtml = [];

        if (text) {
          for (let i = 0; i < text.length; i++) {
            if (i == text.length - 1) {
              renHtml.push(<span key={`tape_${index}_${i}`}>{text[i]}</span>);
            } else {
              renHtml.push(<span key={`tape_${index}_${i}`}>{text[i]}< br /></span>);
            }
          }
        }

        return (renHtml.length > 0) ? (renHtml) : ('-');
      }
    },
    // icon - 編輯
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      className: styles.om_bd_l_dot,
      render: (text, row, index) => {
        if (row.is_ours == '0' || row.is_album == '1') {
          return null;
        } else {
          return (
            <EditOutlined
              className={styles.om_icon_style}
              onClick={() => {
                if (row.id) {
                  showCSMOpModal(row);
                }
              }}
            />
          );
        }
      }
    },
    // icon - 刪除
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (text, row, index) => {
        return (
          < CloseOutlined
            className={`${styles.om_icon_style} ${styles.om_color_red}`}
            onClick={() => { showCSMOpModalConfirm(row); }}
          />
        );
      }
    },
  ];

  return (
    <Fragment>
      <Card bordered={false}>
        <Row>
          <Col xs={24} md={16}>
            <label className={styles.om_sp_m_rb}>歌曲名稱/編號/ISRC</label>
            <Input
              className={styles.om_list_keyword}
              placeholder="請輸入"
              value={keyword}
              onChange={changeKeyword}

            />
            <Checkbox
              className={styles.om_list_precise}
              checked={precise}
              onChange={changePrecise}
            >
              精準查詢
            </Checkbox>
            <Button
              className={styles.om_sp_m_rb}
              type="primary"
              onClick={clickQuery}
            >
              查詢
            </Button>
            <Button
              className={styles.om_sp_m_rb}
              onClick={resetQuery}
            >
              重設
            </Button>
          </Col>
          <Col
            xs={24} md={8}
            style={{ textAlign: 'right' }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className={styles.om_sp_m_lb}
              href={`${REACT_APP_PUBLIC_PATH}/#/new_media/${pageId}/import_song_media`}
            >
              貼入歌編
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={24} md={12}>
            &nbsp;
          </Col>
          <Col xs={24} md={12}>
            <Pagination
              className={styles.om_sp_m_lb}
              style={{ textAlign: 'right' }}
              current={pageCurrent}
              pageSize={pageSize}
              total={songMediaList.total_items}
              onChange={changePage}
              showSizeChanger={false}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <PageHint
              totalItems={songMediaList.total_items}
              pageSize={pageSize}
              changeId={changeId}
            />
          </Col>
        </Row>
        <Row>
          <Col
            xs={24}
            className={styles.om_overflow_auto}
          >
            <Table
              pagination={false}
              loading={loading}
              columns={columns}
              dataSource={songMediaList.data_list}
              rowKey="id"
            />
          </Col>
        </Row>
      </Card>
      <ComSongMediaOpModal
        visible={cSMOpModalVisible}
        editItem={editCSMOpModalItem}
        onCancel={hideCSMOpModal}
        onSubmit={handleCSMOpModalSubmit}
        orgList={songMediaList.data_list}
      />
    </Fragment>
  );
}

export default connect(({ enterpriseList, songMediaList, loading }) => ({
  enterpriseList,
  songMediaList,
  loading: loading.models.songMediaList,
}))(ComSongMedia);