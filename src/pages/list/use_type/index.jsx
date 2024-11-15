import globalSettings from '@/fn/globalsettings';
import { PlusOutlined, EditOutlined, CloseOutlined, CheckOutlined, } from '@ant-design/icons';
import React, { useState, useEffect, Fragment } from 'react';
import {
  Input,
  Row,
  Col,
  Card,
  Switch,
  Button,
  Pagination,
  Table,
  Modal,
  Form,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';
import PageHint from '@/components/PageHint';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import ComOpModal from './components/ComOpModal';

export const use_type = props => {
  const {
    loading,
    dispatch,
    useTypeList: { changeId, optSubject, list },
    enterpriseList
  } = props;
  const { confirm } = Modal;
  const [keyword, setKeyword] = useState('');
  const pageSize = globalSettings.pageSize;
  const [pageCurrent, setPageCurrent] = useState(1);
  const [statusList, setStatusList] = useState([]);
  // for Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(undefined);

  // api -----
  // getData
  const getData = (obj) => {
    let show_ui = {};
    // get sessionStorage
    const getSession = JSON.parse(sessionStorage.getItem('list_use_type_index'));

    // 合併更改 ui 資料
    if (obj === undefined && getSession !== null) {
      // 切換其他頁再回來：先使用 session 資料
      const session_ui = {
        ...getSession,
        pageCurrent: parseInt(getSession.page_current)
      }
      delete session_ui['page_current'];

      show_ui = { ...session_ui, ...obj };
    } else {
      // 一開始載入、當頁調整：預設
      const default_ui = {
        keyword: keyword,
        pageCurrent: pageCurrent,
      }

      show_ui = { ...default_ui, ...obj }
    }

    // 顯示 ui 畫面
    if (show_ui.pageCurrent) {
      setKeyword(show_ui.keyword);
      setPageCurrent(show_ui.pageCurrent);
    }

    // obj 轉資料格式
    let temp = {
      keyword: (show_ui && show_ui.keyword != undefined) ? (show_ui.keyword ? show_ui.keyword : undefined) : (keyword != '' ? keyword : undefined),
      page_current: (show_ui && show_ui.pageCurrent) ? show_ui.pageCurrent : pageCurrent,
      page_size: pageSize,
      agent_eid: enterpriseList.agent_eid,
    }

    // set sessionStorage (存的是 => 送出的資料格式，不是 ui 格式)
    const tempToString = JSON.stringify(temp);
    sessionStorage.setItem('list_use_type_index', tempToString);

    // api
    dispatch({
      type: 'useTypeList/fetchGetList',
      payload: temp,
    });
  }

  // handleSubmit (add or edit)
  const handleSubmit = (obj) => {
    const id = editItem ? editItem.id : undefined;

    dispatch({
      type: (id) ? 'useTypeList/fetchEditData' : 'useTypeList/fetchAddData',
      payload: {
        ...obj,
        id,
        agent_eid: enterpriseList.agent_eid,
      },
      callback: res => {
        if (res == 'ok') {
          hideModal();
          getData();
        }
      }
    });
  }

  // removeData
  const removeData = (id) => {
    dispatch({
      type: 'useTypeList/fetchRemoveData',
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

  // changeStatus
  const changeStatus = (itemId, index, checked) => {
    let tmpStatusList = statusList.slice();

    tmpStatusList[index] = checked;
    setStatusList(tmpStatusList);

    dispatch({
      type: 'useTypeList/fetchToggleStatus',
      payload: {
        id: itemId,
        status: commFn.convertBoolToNumStr(checked),
        agent_eid: enterpriseList.agent_eid,
      },
      callback: () => {
        getData();
      }
    });
  }

  // mount
  useEffect(() => {
    getData();
  }, []);

  // updateData
  useEffect(() => {
    let tmpStatusList = [];

    for (let i = 0; i < list.data_list.length; i++) {
      if (list.data_list[i].status == '1') {
        tmpStatusList.push(true);
      } else {
        tmpStatusList.push(false);
      }
    }
    setStatusList(tmpStatusList);
  }, [changeId]);

  // ui -----
  // modal (add or edit) - show
  const showModal = (item) => {
    setModalVisible(true);
    if (item) {
      setEditItem(Object.assign({}, item));
    } else {
      setEditItem(undefined);
    }
  }

  // modal (add or edit) - hide
  const hideModal = () => {
    setModalVisible(false);
  }

  // alert (remove)
  const showConfirm = (item) => {
    confirm({
      title: '',
      icon: '',
      content: '確定要刪除嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        removeData(item.id);
      },
      onCancel() { },
    });
  }

  // keyword
  const changeKeyword = (e) => {
    setKeyword(e.target.value);
  }

  // search
  const onFinish = () => {
    setPageCurrent(1);
    getData({
      keyword: keyword,
      pageCurrent: 1,
    });
  }

  // resetQuery
  const resetQuery = () => {
    setKeyword('');
    setPageCurrent(1);
    getData({
      keyword: '',
      pageCurrent: 1,
    });
  }

  // page
  const changePage = (page) => {
    let nowPage = parseInt(page);

    setPageCurrent(nowPage);
    getData({ pageCurrent: nowPage });
  }

  // table
  const columns = [
    {
      title: '名稱',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '科目',
      dataIndex: 'subject_id',
      key: 'subject_id',
      render: (text, row, index) => {
        let outText = '';

        for (let i = 0; i < optSubject.length; i++) {
          if (text == optSubject[i].value) {
            outText = optSubject[i].label;
            break;
          }
        }

        return outText;
      },
    },
    {
      title: '開放選項',
      dataIndex: 'status',
      key: 'status',
      render: (text, row, index) => {
        return (
          <Switch
            checked={(statusList[index]) ? true : false}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            onChange={(checked) => {
              changeStatus(row.id, index, checked);
            }}
          />
        );
      },
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (text, row, index) => {
        return (
          <EditOutlined
            className={styles.om_icon_style}
            onClick={() => {
              showModal(row);
            }}
          />
        );
      },
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (text, row, index) => {
        return (
          <CloseOutlined
            className={`${styles.om_icon_style} ${styles.om_color_red}`}
            onClick={() => {
              showConfirm(row);
            }}
          />
        );
      },
    },
  ];

  return (
    <Fragment>
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Row>
            <Col xs={24} md={16}>
              <Form
                name="search"
                onFinish={onFinish}
                style={{ display: 'inline' }}
              >
                <label className={styles.om_sp_m_rb}>使用型態名稱</label>
                <Input
                  className={styles.om_list_keyword}
                  placeholder="請輸入"
                  value={keyword}
                  onChange={changeKeyword}
                />
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
                onClick={() => { showModal(); }}
              >
                新增使用型態
            </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <Pagination
                className={styles.om_sp_m_lb}
                style={{ textAlign: 'right' }}
                current={pageCurrent}
                pageSize={pageSize}
                total={list.total_items}
                onChange={changePage}
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
                loading={loading}
                columns={columns}
                dataSource={list.data_list}
                rowKey="id"
              />
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
      <ComOpModal
        visible={modalVisible}
        editItem={editItem}
        onCancel={hideModal}
        onSubmit={handleSubmit}
      />
    </Fragment>
  );
}

export default connect(({ useTypeList, loading, enterpriseList }) => ({
  useTypeList,
  enterpriseList,
  loading: loading.models.useTypeList,
}))(use_type);