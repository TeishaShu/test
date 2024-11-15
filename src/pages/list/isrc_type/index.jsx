import globalSettings from '@/fn/globalsettings';
import { PlusOutlined, EditOutlined, CloseOutlined, CheckOutlined, } from '@ant-design/icons';
import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Switch,
  Button,
  Pagination,
  Table,
  Modal,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';
import PageHint from '@/components/PageHint';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import ComOpModal from './components/ComOpModal';

export const isrc_type = props => {
  const {
    loading,
    dispatch,
    isrcTypeList: { changeId, list },
    enterpriseList,
  } = props;
  const { confirm } = Modal;
  const [pageCurrent, setPageCurrent] = useState(1);
  const pageSize = globalSettings.pageSize;
  const [statusList, setStatusList] = useState([]);
  // for Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(undefined);

  // api -----
  // getData
  const getData = (obj) => {
    dispatch({
      type: 'isrcTypeList/fetchGetList',
      payload: {
        page_current: (obj && obj.pageCurrent) ? obj.pageCurrent : pageCurrent,
        page_size: pageSize,
        agent_eid: enterpriseList.agent_eid,
      },
    });
  }

  // handleSubmit (add or edit)
  const handleSubmit = (obj) => {
    const id = editItem ? editItem.id : undefined;

    dispatch({
      type: (id) ? 'isrcTypeList/fetchEditData' : 'isrcTypeList/fetchAddData',
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
      type: 'isrcTypeList/fetchRemoveData',
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
      type: 'isrcTypeList/fetchToggleStatus',
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

  // page
  const changePage = (page) => {
    let nowPage = parseInt(page);

    setPageCurrent(nowPage);
    getData({ pageCurrent: nowPage });
  }

  // table
  const columns = [
    {
      title: '型態名稱',
      dataIndex: 'type',
      key: 'type',
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
            <Col
              xs={24}
              style={{ textAlign: 'right' }}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className={styles.om_sp_m_lb}
                onClick={() => {
                  showModal();
                }}
              >
                新增ISRC型態
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

export default connect(({ isrcTypeList, loading, enterpriseList }) => ({
  isrcTypeList,
  enterpriseList,
  loading: loading.models.isrcTypeList,
}))(isrc_type);