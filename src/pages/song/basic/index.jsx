import globalSettings from '@/fn/globalsettings';
import { PlusOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  Checkbox,
  Button,
  Pagination,
  Table,
  Alert,
  Form,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Link, connect } from 'umi';
import PageHint from '@/components/PageHint';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

export const song = props => {
  const {
    loading,
    dispatch,
    songList: { changeId, list },
  } = props;
  const [keyword, setKeyword] = useState('');
  const [precise, setPrecise] = useState(false);
  const pageSize = globalSettings.pageSize;
  const [pageCurrent, setPageCurrent] = useState(1);
  const [orgISWC, setOrgISWC] = useState(false);

  // api -----
  // getData
  const getData = (obj) => {
    let show_ui = {};
    // get sessionStorage
    const getSession = JSON.parse(sessionStorage.getItem('song_base'));

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
      keyword: (show_ui && show_ui.keyword != undefined) ? (show_ui.keyword ? show_ui.keyword : undefined) : (keyword != '' ? keyword : undefined),
      precise: (show_ui && show_ui.precise != undefined) ? commFn.convertBoolToNumStr(show_ui.precise) : commFn.convertBoolToNumStr(precise),
      page_size: pageSize.toString(),
      page_current: (show_ui && show_ui.pageCurrent) ? show_ui.pageCurrent.toString() : pageCurrent.toString(),
    }

    // set sessionStorage (存的是 => 送出的資料格式，不是 ui 格式)
    const tempToString = JSON.stringify(temp);
    sessionStorage.setItem('song_base', tempToString);

    // api
    dispatch({
      type: 'songList/fetchGetList',
      payload: temp
    });
  }

  // mount
  useEffect(() => {
    getData();
  }, []);

  // ui -----
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

  // orgISWC
  const changeOrgISWC = (e) => {
    setOrgISWC(e.target.checked);
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
      title: '歌曲編號',
      dataIndex: 'song_code',
      key: 'song_code',
      width: '10%',
      render: (text, row, index) => {
        return (<Link to={`/song/adv/id/${row.id}`}>{text}</Link>);
      },
    },
    {
      title: '顯示歌名',
      dataIndex: 'song_name',
      key: 'song_name',
      width: '20%',
    },
    {
      title: '英文歌名',
      dataIndex: 'song_name_en',
      key: 'song_name_en',
      width: '20%',
    },
    {
      title: '我方權利',
      dataIndex: 'default_company_rights',
      key: 'default_company_rights',
      width: '20%',
      render: (text, row, index) => {
        return `${(row.default_company_rights && row.default_company_rights.rights_num) ? (row.default_company_rights.rights_num) : ('0')}`;
      },
    },
    {
      title: 'ISWC',
      dataIndex: 'iswc',
      key: 'iswc',
      render: (text, row, index) => {
        return commFn.strToISWC(text);
      }
    },
    {
      title: '原始 ISWC',
      dataIndex: 'iswc',
      key: 'iswc',
      className: (orgISWC) ? '' : 'hideColumn',
    },
  ];

  // expand table columns
  const expandColumns = [
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: '30%',
    },
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: '',
      dataIndex: 'rights_type',
      key: 'rights_type',
      width: '5%',
    },
    {
      title: '',
      dataIndex: 'rights_ratio',
      key: 'rights_ratio',
      width: '10%',
    },
    {
      title: '',
      dataIndex: 'contract_code',
      key: 'contract_code',
    },
  ];

  // expand table row (expandedRowRender)
  const expandedRowRender = (record, index) => {
    return (
      <Table
        className={styles.expandTable}
        columns={expandColumns}
        dataSource={record.rights_list}
        pagination={false}
        rowKey={(exRecord, exIndex) => `${exRecord.contract_song_code}_ex_${exIndex}`}
        summary={pageData => {
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell>
              </Table.Summary.Cell>
              <Table.Summary.Cell
                colSpan="4"
                style={{ paddingLeft: '16px' }}
              >
                <Alert message={
                  (record.default_company_rights && record.default_company_rights.rights_num > 0)
                    ? (`我方權利 ${(record.default_company_rights.rights_num) ? (record.default_company_rights.rights_num) : ('0')} 筆，共 ${(record.default_company_rights.total_ratio) ? (record.default_company_rights.total_ratio) : ('0%')}，詞：${record.default_company_rights.lyrics_ratio.entity}(實) / ${record.default_company_rights.lyrics_ratio.digital}(數)，曲：${record.default_company_rights.tune_ratio.entity}(實) / ${record.default_company_rights.tune_ratio.digital}(數)`)
                    : (`我方權利 0 筆`)
                } />
              </Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    );
  }

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <Row>
          <Col xs={24} md={16}>
            <Form
              name="search"
              onFinish={onFinish}
            >
              <label className={styles.om_sp_m_rb}>歌曲名稱/編號</label>
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
              href={`${REACT_APP_PUBLIC_PATH}/#/song/update`}
            >
              新增歌曲
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={24} md={12}>
            <Checkbox
              checked={orgISWC}
              onChange={changeOrgISWC}
            >
              顯示 ISWC (原始)
            </Checkbox>
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
              className={styles.mainTable}
              pagination={false}
              loading={loading}
              columns={columns}
              dataSource={list.data_list}
              rowKey="id"
              expandable={{
                expandIconColumnIndex: 2,
                expandedRowRender: expandedRowRender,
                expandIcon: ({ expanded, onExpand, record }) =>
                  record.rights_list.length > 0 ? (
                    expanded ? (
                      <MinusCircleOutlined
                        style={{ fontSize: '20px' }}
                        onClick={e => onExpand(record, e)}
                      />
                    ) : (
                      <PlusCircleOutlined
                        style={{ fontSize: '20px' }}
                        onClick={e => onExpand(record, e)}
                      />
                    )
                  ) : ''
              }}
            />
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  )
}

export default connect(({ songList, loading }) => ({
  songList,
  loading: loading.models.songList,
}))(song);