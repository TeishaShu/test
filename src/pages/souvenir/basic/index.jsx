import globalSettings from '@/fn/globalsettings';
import { PlusOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import React, { useState, useEffect, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Row,
  Col,
  Card,
  Input,
  Checkbox,
  Button,
  Pagination,
  Table,
  Form,
} from 'antd';
import { Link, connect, history } from 'umi';
import PageHint from '@/components/PageHint';
import ComUpload from './components/ComUpload';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

export const souvenir = props => {
  const {
    loading,
    dispatch,
    souvenirList: { changeId, list },
  } = props;
  const [keyword, setKeyword] = useState('');
  const [precise, setPrecise] = useState(false);
  const pageSize = globalSettings.pageSize;
  const [pageCurrent, setPageCurrent] = useState(1);
  const [viewLoading, setViewLoading] = useState(false);
  const [colOrder, setColOrder] = useState(null);
  const [colSort, setColSort] = useState(null);

  // api -----
  // getData
  const getData = (obj) => {
    let show_ui = {};
    // get sessionStorage
    const getSession = JSON.parse(sessionStorage.getItem('souvenir_base'));

    // 合併更改 ui 資料
    if (obj === undefined && getSession !== null) {
      // 切換其他頁再回來：先使用 session 資料
      const session_ui = {
        ...getSession,
        precise: (getSession.precise === '0') ? false : true,
        pageCurrent: parseInt(getSession.page_current),
      }
      delete session_ui['page_current'];

      show_ui = { ...session_ui, ...obj };
    } else {
      // 一開始載入、當頁調整：預設
      const default_ui = {
        keyword: keyword,
        pageCurrent: pageCurrent,
        precise: precise,
        sort: colSort,
      }

      show_ui = { ...default_ui, ...obj }
    }

    // 顯示 ui 畫面
    if (show_ui.pageCurrent) {
      setKeyword(show_ui.keyword);
      setPrecise(show_ui.precise);
      setPageCurrent(show_ui.pageCurrent);
      setColOrder(show_ui.order);
      setColSort(show_ui.sort);
    }

    // obj 轉資料格式
    let temp = {
      keyword: (show_ui && show_ui.keyword != undefined) ? (show_ui.keyword ? show_ui.keyword : undefined) : (keyword != '' ? keyword : undefined),
      precise: (show_ui && show_ui.precise != undefined) ? commFn.convertBoolToNumStr(show_ui.precise) : commFn.convertBoolToNumStr(precise),
      page_size: pageSize.toString(),
      page_current: (show_ui && show_ui.pageCurrent) ? show_ui.pageCurrent.toString() : pageCurrent.toString(),
      order_column: (show_ui && show_ui.hasOwnProperty('order') && show_ui.hasOwnProperty('sort')) ? show_ui.order : colOrder,
      order: (show_ui && show_ui.hasOwnProperty('sort')) ? ((show_ui.sort) ? (commFn.convertOrderString(show_ui.sort)) : (null)) : ((colSort) ? (commFn.convertOrderString(colSort)) : (null)),
    }

    // set sessionStorage (存的是 => 送出的資料格式，不是 ui 格式)
    const tempToString = JSON.stringify(temp);
    sessionStorage.setItem('souvenir_base', tempToString);

    dispatch({
      type: 'souvenirList/fetchGetList',
      payload: temp,
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
    setColOrder(null);
    setColSort(null);
    getData({
      keyword: '',
      precise: false,
      pageCurrent: 1,
      order: null,
      sort: null
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
      title: '編號',
      dataIndex: 'souvenir_code',
      key: 'souvenir_code',
    },
    {
      title: '名稱',
      dataIndex: 'souvenir_name',
    },
    {
      title: '型態',
      dataIndex: 'souvenir_type_name',
      key: 'souvenir_type_name',
    },
    {
      title: '售價(台幣)',
      dataIndex: 'souvenir_price',
      key: 'souvenir_price',
    },
    {
      title: '首發日',
      dataIndex: 'souvenir_launch_day',
      key: 'souvenir_launch_day',
      sorter: true,
      defaultSortOrder: undefined,  // ascend, descend
    },
    {
      title: '藝人編號',
      dataIndex: 'author_code',
      key: 'author_code',
      className: styles.om_bd_l_dot,
      render: (text, row, index) => {
        return (
          (text)
            ? (text)
            : (
              <Fragment>
                <ExclamationCircleFilled
                  className={styles.om_icon_style}
                  style={{ color: '#FFA859', position: 'relative', top: '3px' }}
                />&nbsp;
                <span className={styles.om_color_red}>尚未建檔</span>
              </Fragment>
            )
        );
      }
    },
    {
      title: '藝名',
      dataIndex: 'stage_name',
      key: 'stage_name',
    },
    {
      title: '藝人發行合約',
      dataIndex: 'contract_code',
      key: 'contract_code',
    },
    // icon - 編輯
    {
      title: '',
      dataIndex: 'id',
      key: 'id',

      render: (text, row, index) => {
        return (row.uiParent)
          ? (
            <EditOutlined
              className={styles.om_icon_style}
              onClick={() => {
                history.push(`/souvenir/update/${text}`);
              }}
            />
          )
          : ('');
      }
    },
  ];

  // changeColumn
  const changeColumn = (pagination, filters, sorter, extra) => {
    let val_order = sorter.columnKey;
    let val_sort = (sorter.order != undefined) ? sorter.order : '';

    // reset order, sort
    if (val_sort == '') {
      val_order = null;
      val_sort = null;
    }

    setColOrder(val_order);
    setColSort(val_sort);
    getData({ order: val_order, sort: val_sort });
  }

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <Row>
          <Col xs={24} md={16}>
            <Form
              name="search"
              onFinish={onFinish}
              style={{ display: 'inline' }}
            >
              <label className={styles.om_sp_m_rb}>編號/名稱</label>
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
            <a
              href={`${REACT_APP_PUBLIC_PATH}/明星商品匯入說明及範例.xlsx`}
              className={styles.om_sp_m_lb}
              style={{ marginLeft: '18px' }}
            >
              下載範本
            </a>
            <ComUpload
              setPageCurrent={setPageCurrent}
              getData={getData}
              setViewLoading={setViewLoading}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className={styles.om_sp_m_lb}
              style={{ marginLeft: '18px' }}
              href={`${REACT_APP_PUBLIC_PATH}/#/souvenir/update`}
            >
              新增明星商品
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
              total={list.total_item}
              onChange={changePage}
              showSizeChanger={false}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <PageHint
              totalItems={list.total_item}
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
              loading={loading || viewLoading}
              columns={columns}
              dataSource={list.data_list}
              rowKey="ui_idx"
              onChange={changeColumn}
            />
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(({ souvenirList, loading }) => ({
  souvenirList,
  loading: loading.models.souvenirList,
}))(souvenir);