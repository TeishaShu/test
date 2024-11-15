import React, { useState, useEffect, Fragment } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Select,
  Modal,
  Table,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import styles from '@/style/style.less';
import ComUirouteModal from './components/ComUirouteModal';

const { Option } = Select;

export const update = props => {
  const {
    dispatch,
    loading,
    uirouteList: { changeId, list, optLayout },
  } = props;
  const { confirm } = Modal;
  const [form] = Form.useForm();
  // for ComUirouteModal
  const [cUrModalVisable, setCUrModalVisable] = useState(false);
  const [editCUrModalItem, setEditCUrModalItem] = useState(undefined);

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'uirouteList/fetchGetList',
    });
  };

  // mount
  useEffect(() => {
    getData();
  }, []);

  // removeData
  const removeData = (id) => {
    dispatch({
      type: 'uirouteList/fetchRemoveData',
      payload: {
        id,
      },
      callback: () => {
        getData();
      }
    });
  }

  // alert (remove)
  const showConfirm = (itemId) => {
    confirm({
      title: '',
      icon: '',
      content: '確定要刪除嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        removeData(itemId);
      },
      onCancel() { },
    });
  }

  // table
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '功能 ID',
      dataIndex: 'function_id',
      key: 'function_id',
      render: (text, row, index) => {
        return (
          (text)
            ? (`${text}-${(row.service_name) ? (row.service_name) : ('')}-${(row.function_name) ? (row.function_name) : ('')}`)
            : ('')
        );
      }
    },
    {
      title: 'Layout',
      dataIndex: 'layout',
      key: 'layout',
      render: (text, row, index) => {
        let tmpLayoutArr = optLayout.filter((elem) => elem.value == text);

        if (tmpLayoutArr.length > 0) {
          return tmpLayoutArr[0]['label'];
        }

        return text;
      }
    },
    {
      title: '選單階層',
      dataIndex: 'menu_level',
      key: 'menu_level',
    },
    {
      title: '路徑',
      dataIndex: 'path',
      key: 'path',
      render: (text, row, index) => {
        return {
          children: text,
          props: {
            style: { wordBreak: 'break-all' }
          }
        }
      }
    },
    {
      title: '名稱',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '組件',
      dataIndex: 'component',
      key: 'component',
      render: (text, row, index) => {
        return {
          children: text,
          props: {
            style: { wordBreak: 'break-all' }
          }
        }
      }
    },
    {
      title: '父層',
      dataIndex: 'parent_id',
      key: 'parent_id',
      render: (text, row, index) => {
        return (
          (text)
            ? (`${text}-${(row.parent_name) ? (row.parent_name) : ('')}`)
            : ('')
        );
      }
    },
    {
      title: '順序',
      dataIndex: 'setting_order',
      key: 'setting_order',
    },
    {
      title: '狀態',
      dataIndex: 'is_status',
      key: 'is_status',
      render: (text, row, index) => {
        return (text == '1')
          ? (<CheckOutlined className={`${styles.om_icon_style} ${styles.om_color_green2}`} />)
          : (<CloseOutlined className={`${styles.om_icon_style} ${styles.om_color_red}`} />)
      }
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: '180px',
      render: (text, row, index) => {
        return (
          <Fragment>
            <Button
              type="primary"
              className={styles.om_sp_m_lb}
              onClick={() => {
                showUrMOpModal(row);
              }}
            >
              編輯
            </Button>
            <Button
              type="primary"
              danger
              className={styles.om_sp_m_lb}
              onClick={() => {
                showConfirm(text);
              }}
            >
              刪除
            </Button>
          </Fragment>
        )
      }
    }
  ];

  // showUrMOpModal
  const showUrMOpModal = (item) => {
    setCUrModalVisable(true);

    if (item) {
      setEditCUrModalItem(Object.assign({}, item));
    } else {
      setEditCUrModalItem(undefined);
    }
  }

  // hideUrModal
  const hideUrModal = () => {
    setCUrModalVisable(false);
  }

  // handleUrModalSubmit (submit)
  const handleUrModalSubmit = (obj) => {
    const id = editCUrModalItem ? editCUrModalItem.id : undefined;
    let tmpObj = { ...obj };

    tmpObj.function_id = (obj.function_id) ? (obj.function_id) : null;
    tmpObj.name = (obj.name) ? (obj.name) : null;
    tmpObj.component = (obj.component) ? (obj.component) : null;
    tmpObj.parent_id = (obj.parent_id) ? (obj.parent_id) : null;
    tmpObj.notes = (obj.notes) ? (obj.notes) : null;
    tmpObj.is_status = (obj.is_status) ? '1' : '0';

    dispatch({
      type: (id)
        ? ('uirouteList/fetchUpdateData')
        : ('uirouteList/fetchAddData'),
      payload: {
        ...tmpObj,
        id,
      },
      callback: res => {
        if (res == 'ok') {
          hideUrModal();
          getData();
        }
      }
    });
  }

  return (
    <PageHeaderWrapper
      title="UI 路由"
    >
      <Card bordered={false}>
        <Row>
          <Col
            xs={24}
            style={{ textAlign: 'right' }}
          >
            {/* <Button
              className={styles.om_sp_m_lb}
              href={`${REACT_APP_PUBLIC_PATH}/#/core_management/ui_route/change_order`}
            >
              拖曳更改順序
            </Button> */}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className={styles.om_sp_m_lb}
              onClick={() => {
                showUrMOpModal();
              }}
            >
              新增路由
            </Button>
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
              dataSource={(list && list.all_route) ? (list.all_route) : ([])}
              rowKey="id"
            />
          </Col>
        </Row>
      </Card>
      <ComUirouteModal
        visible={cUrModalVisable}
        editItem={editCUrModalItem}
        onCancel={hideUrModal}
        onSubmit={handleUrModalSubmit}
      />
    </PageHeaderWrapper>
  );
}

export default connect(({ uirouteList, loading }) => ({
  uirouteList,
  loading: loading.models.uirouteList,
}))(update);