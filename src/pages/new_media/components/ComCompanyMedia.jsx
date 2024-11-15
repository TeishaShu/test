import globalSettings from '@/fn/globalsettings';
import { PlusOutlined, DownloadOutlined, EditOutlined, CloseOutlined, UnorderedListOutlined, FileTextOutlined, ExclamationCircleFilled, } from '@ant-design/icons';
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
  Tooltip,
  Modal,
  notification,
  Form,
} from 'antd';
import { Link, connect } from 'umi';
import PageHint from '@/components/PageHint';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import ComCompanyMediaOpModal from '../components/ComCompanyMediaOpModal';

export const ComCompanyMedia = props => {
  const {
    loading,
    loadingSongMedia,
    dispatch,
    enterpriseList,
    companyMediaList: { changeId, list },
    pageId,
  } = props;
  const { confirm } = Modal;
  const [keyword, setKeyword] = useState('');
  const [precise, setPrecise] = useState(false);
  const pageSize = globalSettings.pageSize;
  const [pageCurrent, setPageCurrent] = useState(1);
  // for ComCompanyMediaOpModal
  const [cCMOpModalVisible, setCCMOpModalVisible] = useState(false);
  const [editCCMOpModalItem, setEditCCMOpModalItem] = useState(undefined);

  // api -----
  // getData
  const getData = (obj) => {

    let show_ui = {};
    // get sessionStorage
    const getSession = JSON.parse(sessionStorage.getItem('new_media_index'));

    // 合併更改 ui 資料
    if (obj === undefined && getSession !== null) {
      // 切換其他頁再回來：先使用 session 資料
      const session_ui = {
        ...getSession,
        precise: (getSession.precise === '0') ? false : true,
        pageCurrent: parseInt(getSession.page_current)
      }
      delete session_ui['page_current'];

      show_ui = { ...session_ui, ...obj };
    } else {
      // 一開始載入、當頁調整：預設
      const default_ui = {
        keyword: keyword,
        pageCurrent: pageCurrent,
        precise: precise,
      }

      show_ui = { ...default_ui, ...obj }
    }

    // 顯示 ui 畫面
    if (show_ui.pageCurrent) {
      setKeyword(show_ui.keyword);
      setPrecise(show_ui.precise);
      setPageCurrent(show_ui.pageCurrent);
    }

    // obj 轉資料格式
    let temp = {
      agent_eid: enterpriseList.agent_eid,
      keyword: (show_ui && show_ui.keyword != undefined) ? (show_ui.keyword ? show_ui.keyword : undefined) : (keyword != '' ? keyword : undefined),
      precise: (show_ui && show_ui.precise != undefined) ? commFn.convertBoolToNumStr(show_ui.precise) : commFn.convertBoolToNumStr(precise),
      page_size: pageSize.toString(),
      page_current: (show_ui && show_ui.pageCurrent) ? show_ui.pageCurrent.toString() : pageCurrent.toString(),
    }

    // set sessionStorage (存的是 => 送出的資料格式，不是 ui 格式)
    const tempToString = JSON.stringify(temp);
    sessionStorage.setItem('new_media_index', tempToString);

    // api
    dispatch({
      type: 'companyMediaList/fetchGetList',
      payload: temp,
    });
  }

  // for ComCompanyMediaOpModal - submit
  const handleCCMOpModalSubmit = (obj) => {
    const id = editCCMOpModalItem ? editCCMOpModalItem.id : undefined;

    dispatch({
      type: 'companyMediaList/fetchMultiUpdateData',
      payload: {
        ...obj,
        id,
        agent_eid: enterpriseList.agent_eid,
      },
      callback: res => {
        if (res == 'ok') {
          hideCCMOpModal();
          getData();
        }
      }
    });
  }

  // for ComCompanyMediaOpModal - remove
  const removeCCMOpModalData = (id) => {
    dispatch({
      type: 'companyMediaList/fetchRemoveData',
      payload: {
        id,
        agent_eid: enterpriseList.agent_eid,
      },
      callback: () => {
        let checkPage = commFn.checkNoPage(pageCurrent, list.total_items);

        setPageCurrent(checkPage);
        getData({
          pageCurrent: checkPage,
        });
      }
    });
  }

  // mount
  useEffect(() => {
    getData();
  }, [pageId]);

  // ui -----
  // alert (remove)
  const showCCMOpModalConfirm = (item) => {
    confirm({
      title: '',
      icon: '',
      content: '確定要刪除嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        removeCCMOpModalData(item.id);
      },
      onCancel() { },
    });
  }

  // ComCompanyMediaOpModal (add or edit) - show
  const showCCMOpModal = (item) => {
    setCCMOpModalVisible(true);
    if (item) {
      setEditCCMOpModalItem(Object.assign({}, item));
    } else {
      setEditCCMOpModalItem(undefined);
    }
  }

  // ComCompanyMediaOpModal (add or edit) - hide
  const hideCCMOpModal = () => {
    setCCMOpModalVisible(false);
  }

  // keyword
  const changeKeyword = (e) => {
    setKeyword(e.target.value);
  }

  // precise
  const changePrecise = (e) => {
    setPrecise(e.target.checked);
  }

  // search
  const onFinish = () => {
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
      title: '公司名稱',
      dataIndex: 'company_name',
      key: 'company_name',
    },
    {
      title: '新媒體長代號',
      dataIndex: 'code_long',
      key: 'code_long',
    },
    {
      title: '新媒體短代號',
      dataIndex: 'code_short',
      key: 'code_short',
    },
    // icon - 編輯
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (text, row, index) => {
        return (
          <EditOutlined
            className={styles.om_icon_style}
            onClick={() => { showCCMOpModal(row); }}
          />
        );
      }
    },
    // icon - 刪除
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (text, row, index) => {
        return (
          <CloseOutlined
            className={`${styles.om_icon_style} ${styles.om_color_red}`}
            onClick={() => { showCCMOpModalConfirm(row); }}
          />
        );
      }
    },
    {
      title: '歌曲數',
      dataIndex: 'song_num',
      key: 'song_num',
      className: styles.om_bd_l_dot
    },
    // icon - 下載
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (text, row, index) => {
        return (
          (row.song_num && row.song_num != '0')
            ? (
              <a
                href={`${window.FRONTEND_WEB}/song_media/download_song_media?company_media_id=${text}&agent_eid=${enterpriseList.agent_eid}`}
                target="_blank"
              >
                <Tooltip title="下載歌編">
                  <DownloadOutlined className={styles.om_icon_style} />
                </Tooltip>
              </a>
            )
            : (null)
        );
      }
    },
    // icon - 歌編清單
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (text, row, index) => {
        return (
          <Link to={`/new_media/${row.id}/song_media`}>
            <Tooltip title="歌編清單">
              <UnorderedListOutlined className={styles.om_icon_style} />
            </Tooltip>
          </Link>
        );
      }
    },
    // icon - 加入歌編
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (text, row, index) => {
        return (
          <Link to={`/new_media/${row.id}/import_song_media`}>
            <Tooltip title="貼入歌編">
              <FileTextOutlined className={styles.om_icon_style} />
            </Tooltip>
          </Link>
        );
      }
    },
  ];

  return (
    <Fragment>
      <Card bordered={false}>
        <Row>
          <Col xs={24} md={16}>
            <Form
              name="search"
              onFinish={onFinish}
              style={{ display: 'inline' }}
            >
              <label className={styles.om_sp_m_rb}>公司名稱/新媒體長代號/新媒體短代號</label>
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
                htmlType="submit"
              >
                查詢
              </Button>
              <Button
                className={styles.om_sp_m_rb}
                onClick={resetQuery}
              >
                重設
              </Button>
            </Form>
          </Col>
          <Col
            xs={24} md={8}
            style={{ textAlign: 'right' }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className={styles.om_sp_m_lb}
              onClick={() => { showCCMOpModal(); }}
            >
              新增新媒體
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
              total={list.total_items}
              onChange={changePage}
              showSizeChanger={false}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <PageHint
              totalItems={list.total_items}
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
              loading={loading || loadingSongMedia}
              columns={columns}
              dataSource={list.data_list}
              rowKey="id"
            />
          </Col>
        </Row>
      </Card>
      <ComCompanyMediaOpModal
        visible={cCMOpModalVisible}
        editItem={editCCMOpModalItem}
        onCancel={hideCCMOpModal}
        onSubmit={handleCCMOpModalSubmit}
        orgList={list.data_list}
      />
    </Fragment>
  );
}

export default connect(({ enterpriseList, companyMediaList, songMediaList, loading, loadingSongMedia }) => ({
  enterpriseList,
  companyMediaList,
  songMediaList,
  loading: loading.models.companyMediaList,
  loadingSongMedia: loading.models.songMediaList,
}))(ComCompanyMedia);