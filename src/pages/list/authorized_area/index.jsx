import globalSettings from '@/fn/globalsettings';
import { PlusOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
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

export const authorized_area = props => {
  const {
    loading,
    dispatch,
    authorizedAreaList: { changeId, list },
    enterpriseList
  } = props;
  const { confirm } = Modal;
  const [pageCurrent, setPageCurrent] = useState(1);
  const pageSize = globalSettings.pageSize;
  // for Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(undefined);

  // api -----
  // getData
  const getData = (obj) => {
    dispatch({
      type: 'authorizedAreaList/fetchGetList',
      payload: {
        search: '',
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
      type: (id) ? 'authorizedAreaList/fetchEditData' : 'authorizedAreaList/fetchAddData',
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
      type: 'authorizedAreaList/fetchRemoveData',
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
  }, []);

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
      title: '代碼',
      dataIndex: 'area_code',
      key: 'area_code',
    },
    {
      title: '地區',
      dataIndex: 'area_name',
      key: 'area_name',
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
              className={styles.om_txt_align_r}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className={styles.om_sp_m_lb}
                onClick={() => { showModal(); }}
              >
                新增授權地區
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              <Pagination
                className={`${styles.om_sp_m_lb} ${styles.om_txt_align_r}`}
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
        orgList={list.data_list}
      />
    </Fragment>
  );
}

export default connect(({ authorizedAreaList, loading, enterpriseList }) => ({
  authorizedAreaList,
  enterpriseList,
  loading: loading.models.authorizedAreaList,
}))(authorized_area);