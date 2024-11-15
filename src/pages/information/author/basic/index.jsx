import globalSettings from '@/fn/globalsettings';
import { UserOutlined, TeamOutlined, PlusOutlined, CloudOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  Radio,
  Checkbox,
  Button,
  Select,
  Pagination,
  Table,
  Tooltip,
  Form,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Link, connect } from 'umi';
import PageHint from '@/components/PageHint';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Option } = Select;

export const author = props => {
  const {
    loading,
    dispatch,
    authorList: { changeId, list },
  } = props;
  const [keyword, setKeyword] = useState('');
  const [precise, setPrecise] = useState(false);
  const [role, setRole] = useState('0');
  const [type, setType] = useState('0');
  const pageSize = globalSettings.pageSize;
  const [pageCurrent, setPageCurrent] = useState(1);
  const [colOrder, setColOrder] = useState('author_code');
  const [colSort, setColSort] = useState('asc');

  // api -----
  // getData
  const getData = (obj) => {
    let show_ui = {};
    // get sessionStorage
    const getSession = JSON.parse(sessionStorage.getItem('information_author_base'));

    // 合併更改 ui 資料
    if (obj === undefined && getSession !== null) {
      // 切換其他頁再回來：先使用 session 資料
      const session_ui = {
        ...getSession,
        precise: (getSession.precise === '0') ? false : true,
        pageCurrent: parseInt(getSession.page_current),
        type: (getSession.type === '') ? '0' : getSession.type,
        role: (getSession.role === '') ? '0' : getSession.role,
      }
      delete session_ui['page_current'];

      show_ui = { ...session_ui, ...obj };
    } else {
      // 一開始載入、當頁調整：預設
      const default_ui = {
        keyword: keyword,
        precise: precise,
        pageCurrent: pageCurrent,
        role: role,
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
      setRole(show_ui.role);
      setType(show_ui.type);
      setColOrder(show_ui.order);
      setColSort(show_ui.sort);
    }

    // obj 轉資料格式
    let temp = {
      search: '',
      keyword: (show_ui && show_ui.keyword != undefined) ? (show_ui.keyword ? show_ui.keyword : undefined) : (keyword != '' ? keyword : undefined),
      precise: (show_ui && show_ui.precise != undefined) ? commFn.convertBoolToNumStr(show_ui.precise) : commFn.convertBoolToNumStr(precise),
      role: (show_ui && show_ui.role) ? (show_ui.role === '0' ? '' : show_ui.role) : (role === '0' ? '' : role),
      type: (show_ui && show_ui.type) ? (show_ui.type === '0' ? '' : show_ui.type) : (type === '0' ? '' : type),
      page_size: pageSize.toString(),
      page_current: (show_ui && show_ui.pageCurrent) ? show_ui.pageCurrent.toString() : pageCurrent.toString(),
      order: (show_ui && show_ui.order && show_ui.sort) ? show_ui.order : colOrder,
      sort: (show_ui && show_ui.sort) ? commFn.convertOrderString(show_ui.sort) : commFn.convertOrderString(colSort),
    }

    // set sessionStorage (存的是 => 送出的資料格式，不是 ui 格式)
    const tempToString = JSON.stringify(temp);
    sessionStorage.setItem('information_author_base', tempToString);

    // api
    dispatch({
      type: 'authorList/fetchGetList',
      payload: temp,
    });

    // TODO
    /*
    if (isInit && commFn.convertSessionToObj('information_author')) {
      tmpObj = commFn.convertSessionToObj('information_author');
    }

    sessionStorage['information_author'] = JSON.stringify(tmpObj);
    */
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
      role: role,
      type: type,
      pageCurrent: 1,
    });
  }

  // resetQuery
  const resetQuery = () => {
    setKeyword('');
    setPrecise(false);
    setRole('0');
    setType('0');
    setPageCurrent(1);
    setColOrder('author_code');
    setColSort('asc')
    getData({
      keyword: '',
      precise: false,
      role: '0',
      type: '0',
      pageCurrent: 1,
      order: 'author_code',
      sort: 'asc'
    });
  }

  // role
  const changeRole = (e) => {
    setRole(e.target.value);
    getData({
      role: e.target.value,
      pageCurrent: 1,
    });
  }

  // type
  const changeType = (val) => {
    setType(val);
    getData({
      type: val,
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
      title: '藝人作者編號',
      dataIndex: 'author_code',
      key: 'author_code',
      sorter: true,
      defaultSortOrder: undefined,  // ascend, descend
      render: (text, row, index) => {
        return (<Link to={`/information/author/adv/${row.id}/info`}>{text}</Link>);
      },
    },
    {
      title: '',
      dataIndex: 'type',
      key: 'type',
      render: (text, row, index) => {
        if (text == '1') {
          return (<Tooltip title="個人"><UserOutlined className={styles.om_icon_style} /></Tooltip>);
        } else if (text == '2') {
          return (<Tooltip title="團體"><TeamOutlined className={styles.om_icon_style} /></Tooltip>);
        } else {
          return (<Tooltip title="其他"><CloudOutlined className={styles.om_icon_style} /></Tooltip>);
        }
      },
    },
    {
      title: '本名',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      defaultSortOrder: undefined,  // ascend, descend
    },
    {
      title: '筆名',
      dataIndex: 'pen_name',
      key: 'pen_name',
      sorter: true,
      defaultSortOrder: undefined,  // ascend, descend
      render: (text, row, index) => {
        let renderPenName = text.map((elem, idx) => elem.pen_name);

        return renderPenName.join(', ');
      },
    },
    {
      title: '藝名',
      dataIndex: 'stage_name',
      key: 'stage_name',
      sorter: true,
      defaultSortOrder: undefined,  // ascend, descend
      render: (text, row, index) => {
        let renderStageName = text.map((elem, idx) => elem.stage_name);

        return renderStageName.join(', ');
      },
    },
  ];

  // changeColumn
  const changeColumn = (pagination, filters, sorter, extra) => {
    let val_order = sorter.columnKey;
    let val_sort = (sorter.order != undefined) ? sorter.order : '';

    // reset order, sort
    if (val_sort == '') {
      val_order = 'author_code';
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
              <label className={styles.om_sp_m_rb}>編號/本名/筆名/藝名</label>
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
                href={`${REACT_APP_PUBLIC_PATH}/#/information/author/update`}
              >
                新增藝人作者
            </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={12}>
              <RadioGroup
                className={styles.om_list_radios}
                value={role}
                onChange={changeRole}
              >
                <RadioButton value="0">全部</RadioButton>
                <RadioButton value="1">藝人</RadioButton>
                <RadioButton value="2">作者</RadioButton>
              </RadioGroup>
              <Select
                style={{ width: 100 }}
                value={type}
                onChange={changeType}
              >
                <Option value="0">不限</Option>
                <Option value="1">個人</Option>
                <Option value="2">團體</Option>
                <Option value="3">其他</Option>
              </Select>
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
              onChange={changeColumn}
            />
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(({ authorList, loading }) => ({
  authorList,
  loading: loading.models.authorList,
}))(author);