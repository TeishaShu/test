import globalSettings from '@/fn/globalsettings';
import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  Radio,
  Checkbox,
  Button,
  Pagination,
  Table,
  Tooltip,
  Form,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Link, connect } from 'umi';
import { PlusOutlined, FilePptOutlined, FileTextOutlined } from "@ant-design/icons";
import PageHint from '@/components/PageHint';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export const company = props => {
  const {
    loading,
    dispatch,
    companyList: { changeId, list },
  } = props;
  const [keyword, setKeyword] = useState('');
  const [precise, setPrecise] = useState(false);
  const [type, setType] = useState('0');
  const pageSize = globalSettings.pageSize;
  const [pageCurrent, setPageCurrent] = useState(1);
  const [colOrder, setColOrder] = useState('name');
  const [colSort, setColSort] = useState('asc');

  // api -----
  // getData
  const getData = (obj) => {
    let show_ui = {};
    // get sessionStorage
    const getSession = JSON.parse(sessionStorage.getItem('information_company_base'));

    // 合併更改 ui 資料
    if (obj === undefined && getSession !== null) {
      // 切換其他頁再回來：先使用 session 資料
      const session_ui = {
        ...getSession,
        precise: (getSession.precise === '0') ? false : true,
        type: (getSession.type === '') ? '0' : getSession.type,
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
        type: type,
        sort: colSort,
        order: colOrder
      }

      show_ui = { ...default_ui, ...obj }
    }

    // 顯示 ui 畫面
    if (show_ui.pageCurrent) {
      setKeyword(show_ui.keyword);
      setPrecise(show_ui.precise);
      setPageCurrent(show_ui.pageCurrent);
      setType(show_ui.type);
      setColOrder(show_ui.order);
      setColSort(show_ui.sort);
    }

    // obj 轉資料格式
    let temp = {
      search: '',
      keyword: (show_ui && show_ui.keyword != undefined) ? (show_ui.keyword ? show_ui.keyword : undefined) : (keyword != '' ? keyword : undefined),
      precise: (show_ui && show_ui.precise != undefined) ? commFn.convertBoolToNumStr(show_ui.precise) : commFn.convertBoolToNumStr(precise),
      type: (show_ui && show_ui.type) ? (show_ui.type === '0' ? '' : show_ui.type) : (type === '0' ? '' : type),
      page_size: pageSize.toString(),
      page_current: (show_ui && show_ui.pageCurrent) ? show_ui.pageCurrent.toString() : pageCurrent.toString(),
      order: (show_ui && show_ui.order && show_ui.sort) ? show_ui.order : colOrder,
      sort: (show_ui && show_ui.sort) ? commFn.convertOrderString(show_ui.sort) : commFn.convertOrderString(colSort),
    }

    // set sessionStorage (存的是 => 送出的資料格式，不是 ui 格式)
    const tempToString = JSON.stringify(temp);
    sessionStorage.setItem('information_company_base', tempToString);

    //api
    dispatch({
      type: 'companyList/fetchGetList',
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
      type: type,
      pageCurrent: 1,
    });
  }

  // resetQuery
  const resetQuery = () => {
    setKeyword('');
    setPrecise(false);
    setType('0');
    setPageCurrent(1);
    setColOrder('name');
    setColSort('asc');
    getData({
      keyword: '',
      precise: false,
      type: '0',
      pageCurrent: 1,
      order: 'name',
      sort: 'asc'
    });
  }

  // type
  const changeType = (e) => {
    setType(e.target.value);
    getData({
      type: e.target.value,
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
      title: '編號',
      dataIndex: 'tax_id_number',
      key: 'tax_id_number',
      sorter: true,
      defaultSortOrder: undefined,  // ascend, descend
      render: (text, row, index) => {
        let showText = row.company_code;

        if (row.is_internal === '1') {
          showText = row.tax_id_number;
        }

        return (<Link to={`/information/company/adv/${row.id}/info`}>{showText}</Link>);
      },
    },
    {
      title: '公司名稱',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      defaultSortOrder: undefined,
      render: (text, row, index) => {
        return (<Link to={`/information/company/adv/${row.id}/info`}>{text}</Link>);
      }
    },
    {
      title: '公司別名',
      dataIndex: 'nickname',
      key: 'nickname',
      sorter: true,
      defaultSortOrder: undefined,
      render: (text, row, index) => {
        let findCompanyName = false;
        let nicknameArr = [];

        if (text) {
          for (let i = 0; i < text.length; i++) {
            if (!findCompanyName && row.name == text[i].nickname) {
              findCompanyName == true;
              continue;
            } else {
              nicknameArr.push(text[i].nickname);
            }
          }

          return nicknameArr.join(', ');
        }

        return null;
      },
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (text, row, index) => {
        return (
          <Link to={`/information/company/adv/${row.id}/contract_author`}>
            <Tooltip title="藝人合約">
              <FilePptOutlined style={{ color: 'rgb(85, 85, 85)', fontSize: '20px' }} />
            </Tooltip>
          </Link>
        );
      },
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (text, row, index) => {
        return (
          <Link to={`/information/company/adv/${row.id}/contract_song`}>
            <Tooltip title="詞曲合約">
              <FileTextOutlined style={{ color: 'rgb(85, 85, 85)', fontSize: '20px' }} />
            </Tooltip>
          </Link>
        );
      },
    },
  ];

  // changeColumn
  const changeColumn = (pagination, filters, sorter, extra) => {
    let val_order = (sorter.columnKey === 'tax_id_number') ? 'code' : sorter.columnKey;  // change 'tax_id_number' or 'company_code' to 'code'
    let val_sort = (sorter.order != undefined) ? sorter.order : '';

    // reset order, sort
    if (val_sort == '') {
      val_order = 'name';
      val_sort = 'asc';
    }

    setColOrder(val_order);
    setColSort(val_sort);
    getData({ order: val_order, sort: val_sort });
  }

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <Form
          name="search"
          onFinish={onFinish}
          style={{ display: 'inline' }}
        >
          <Row>
            <Col xs={24} md={16}>
              <label className={styles.om_sp_m_rb}>統一編號/公司名稱</label>
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
            </Col>
            <Col
              xs={24} md={8}
              style={{ textAlign: 'right' }}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className={styles.om_sp_m_lb}
                href={`${REACT_APP_PUBLIC_PATH}/#/information/company/update`}
              >
                新增公司
            </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={12}>
              <RadioGroup
                className={styles.om_sp_m_rb}
                value={type}
                onChange={changeType}
              >
                <RadioButton value="0">全部</RadioButton>
                <RadioButton value="1">版權公司</RadioButton>
                <RadioButton value="2">唱片公司</RadioButton>
                <RadioButton value="3">新媒體公司</RadioButton>
                <RadioButton value="4">製作公司</RadioButton>
                <RadioButton value="5">其他</RadioButton>
              </RadioGroup>
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
        </Form>
        <Row>
          <Col xs={24}>
            <Table
              pagination={false}
              loading={loading}
              columns={columns}
              dataSource={list.data_list}
              rowKey="id"
              onChange={changeColumn}
            />
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ companyList, loading }) => ({
  companyList,
  loading: loading.models.companyList,
}))(company);