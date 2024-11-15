import globalSettings from '@/fn/globalsettings';
import React, { useState, Fragment, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Table,
  Select,
  message,
  Modal, Pagination,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import { connect, history, Link } from 'umi';
import {
  PlusOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  ReloadOutlined,
} from '@ant-design/icons';
import PageHint from '@/components/PageHint';

const { confirm } = Modal;
const { Option } = Select;

const Index = props => {
  const {
    loading,
    dispatch,
    enterpriseAccountList: { changeId, list },
  } = props;

  const [keyword, setKeyword] = useState(undefined);
  const [precise, setPrecise] = useState(false);
  const { pageSize } = globalSettings;
  const [pageCurrent, setPageCurrent] = useState(1);
  const [type, setType] = useState('account');


  // api -----
  // getData
  const getData = (obj) => {
    dispatch({
      type: 'enterpriseAccountList/fetchGetList',
      payload: {
        keyword: (obj && obj.keyword !== undefined) ? obj.keyword : keyword,
        type,
        precise: (obj && obj.precise !== undefined) ? commFn.convertBoolToNumStr(obj.precise) : commFn.convertBoolToNumStr(precise),
        page_size: parseInt(pageSize, 10),
        page_current: (obj && obj.pageCurrent) ? parseInt(obj.pageCurrent, 10) : parseInt(pageCurrent, 10),
      },
    });
  };

  // page
  const changePage = (page) => {
    const nowPage = parseInt(page, 10);
    setPageCurrent(nowPage);
    getData({ pageCurrent: nowPage });
  };

  // mount
  useEffect(() => {
    getData();
  }, []);

  const accountFreezeAction = (data) => {
    confirm({
      title: '',
      icon: '',
      content: `確定要${data.is_frozen === '0' ? '凍結' : '解凍'}嗎?`,
      okText: '確定',
      cancelText: '取消',
      onOk() {
        const freezeType = data.is_frozen === '0' ? '1' : '0';
        dispatch({
          type: 'enterpriseAccountList/fetchFreezeAction',
          payload: {
            id: data.id,
            is_frozen: freezeType,
          },
          callback: res => {
            if (res && (res.data === '凍結 帳號成功' || res.data === '解凍 帳號成功')) {
              message.success(res.data);
            }
            getData();
          },
        });
      },
      onCancel() {
      },
    });
  };
  // table
  const columns = [
    {
      title: '帳號',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: '暱稱',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '所屬企業',
      dataIndex: 'enterprise_name',
      key: 'enterprise_name',
    },
    {
      // 啟用
      dataIndex: 'is_frozen',
      key: 'is_frozen',
      render: (text, row) => {
        return (
          <Select
            style={text === '0' ? { color: '#70DE5F' } : { color: '#A5A5A5' }}
            bordered={false}
            value={text}
            onChange={() => accountFreezeAction(row)}
          >
            <Option value="0"><CheckCircleFilled/> 啟用</Option>
            <Option value="1"><CloseCircleFilled/> 凍結</Option>
          </Select>
        );
      },
    },
    {
      // 詳情
      dataIndex: 'id',
      key: 'id',
      render: (text) => {
        return (<Link to={`/enterprise/account/adv/id/${text}`}>
          <span>詳情</span>
        </Link>);
      },
    },
  ];

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <Row>
          <Col xs={24} md={16}>
            <Select
              style={{ width: 180, marginRight: '10px' }}
              value={type}
              onChange={setType}
            >
              <Option value="account">帳號</Option>
              <Option value="email">Email</Option>
              <Option value="enterprise">企業名稱</Option>
            </Select>
            <Input
              className={styles.om_list_keyword}
              placeholder="請輸入"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
            <Button
              className={styles.om_sp_m_rb}
              type="primary"
              onClick={() => {
                setPageCurrent(1);
                getData({
                  keyword,
                  precise,
                  pageCurrent: 1,
                });
              }}
            >
              查詢
            </Button>
            <Button
              type="text"
              onClick={() => {
                setKeyword('');
                setPrecise(false);
                setPageCurrent(1);
                getData({
                  keyword: '',
                  precise: false,
                  pageCurrent: 1,
                });
              }}
              icon={<ReloadOutlined/>}
            />
          </Col>
          <Col
            xs={24} md={8}
            style={{ textAlign: 'right' }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined/>}
              className={styles.om_sp_m_lb}
              onClick={() => {
                history.push('/authaccess/enterprise/account/add');
              }}
            >
              建立企業帳號
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={24} md={24}>
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
              loading={loading}
              columns={columns}
              dataSource={list.data_list}
              rowKey="id"
            />
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ enterpriseAccountList, loading }) => ({
  enterpriseAccountList,
  loading: loading.models.enterpriseAccountList,
}))(Index);
