import globalSettings from '@/fn/globalsettings';
import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Table,
  Checkbox, Pagination,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import { connect, history, Link } from 'umi';
import {
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import PageHint from '@/components/PageHint';

const Index = props => {
  const {
    loading,
    dispatch,
    enterpriseInfoList: { changeId, list },
  } = props;

  const [keyword, setKeyword] = useState(undefined);
  const [precise, setPrecise] = useState(false);
  const { pageSize } = globalSettings;
  const [pageCurrent, setPageCurrent] = useState(1);


  // api -----
  // getData
  const getData = (obj) => {
    dispatch({
      type: 'enterpriseInfoList/fetchGetList',
      payload: {
        keyword: (obj && obj.keyword !== undefined) ? obj.keyword : keyword,
        precise: (obj && obj.precise !== undefined) ? commFn.convertBoolToNumStr(obj.precise) : commFn.convertBoolToNumStr(precise),
        page_size: parseInt(pageSize, 10),
        page_current: (obj && obj.pageCurrent) ? parseInt(obj.pageCurrent, 10) : parseInt(pageCurrent, 10),
      },
    });
  };

  // mount
  useEffect(() => {
    getData();
  }, []);

  // table
  const columns = [
    {
      title: '統一編號',
      dataIndex: 'tax_id_number',
      key: 'tax_id_number',
      render: (text, row) => {
        return (<Link to={`/enterprise/info/adv/id/${row.id}`}>
          <span key={row.id}>{text}</span>
        </Link>);
      },
    },
    {
      title: '企業名稱',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '企業名稱(英)',
      dataIndex: 'name_en',
      key: 'name_en',
    },
  ];

  // page
  const changePage = (page) => {
    const nowPage = parseInt(page, 10);
    setPageCurrent(nowPage);
    getData({ pageCurrent: nowPage });
  };

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <Row>
          <Col xs={24} md={16}>
            <span style={{ marginRight: '12px' }}>統一編號/企業名稱</span>
            <Input
              className={styles.om_list_keyword}
              placeholder="請輸入"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
            <Checkbox
              className={styles.om_list_precise}
              checked={precise}
              onChange={e => setPrecise(e.target.checked)}
            >
              精準查詢
            </Checkbox>
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
                history.push('/enterprise/info/update');
              }}
            >
              新增企業
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
              rowKey="id"
              dataSource={list.data_list}
            />
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ enterpriseInfoList, loading }) => ({
  enterpriseInfoList,
  loading: loading.models.enterpriseInfoList,
}))(Index);
