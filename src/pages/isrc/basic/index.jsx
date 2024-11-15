import React, { useState, useEffect } from 'react';
import globalSettings from '@/fn/globalsettings';
import { PlusOutlined, AudioOutlined, DesktopOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
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

export const isrc = props => {
  const {
    loading,
    dispatch,
    isrcList: { changeId, list },
  } = props;
  const [searchType, setSearchType] = useState('isrc');
  const [keyword, setKeyword] = useState('');
  const [precise, setPrecise] = useState(false);
  const [dataType, setDataType] = useState('0');
  const pageSize = globalSettings.pageSize;
  const [pageCurrent, setPageCurrent] = useState(1);
  const [colOrder, setColOrder] = useState('release_date');
  const [colSort, setColSort] = useState('desc');
  const [orgISRC, setOrgISRC] = useState(false);

  // api -----
  // getData
  const getData = (obj) => {
    let show_ui = {};
    // get sessionStorage
    const getSession = JSON.parse(sessionStorage.getItem('isrc_base'));

    // 合併更改 ui 資料
    if (obj === undefined && getSession !== null) {
      // 切換其他頁再回來：先使用 session 資料
      const session_ui = {
        ...getSession,
        precise: (getSession.precise === '0') ? false : true,
        dataType: (getSession.data_type === null) ? '0' : getSession.data_type,
        pageCurrent: parseInt(getSession.page_current)
      }
      delete session_ui['page_current'];
      delete session_ui['data_type'];

      show_ui = { ...session_ui, ...obj };
    } else {
      // 一開始載入、當頁調整：預設
      const default_ui = {
        dataType: dataType,
        keyword: keyword,
        pageCurrent: pageCurrent,
        precise: precise,
        search_type: searchType,
        sort: colSort,
        order: colOrder
      }

      show_ui = { ...default_ui, ...obj }
    }

    // 顯示 ui 畫面
    if (show_ui.pageCurrent) {
      setSearchType(show_ui.search_type)
      setKeyword(show_ui.keyword);
      setPrecise(show_ui.precise);
      setDataType(show_ui.dataType);
      setPageCurrent(show_ui.pageCurrent);
      setColOrder(show_ui.order);
      setColSort(show_ui.sort);
    }

    // obj 轉資料格式
    let temp = {
      search_type: searchType,
      keyword: (show_ui && show_ui.keyword != undefined) ? (show_ui.keyword ? show_ui.keyword : undefined) : (keyword != '' ? keyword : undefined),
      precise: (show_ui && show_ui.precise != undefined) ? commFn.convertBoolToNumStr(show_ui.precise) : commFn.convertBoolToNumStr(precise),
      data_type: (show_ui && show_ui.dataType) ? (show_ui.dataType === '0' ? null : show_ui.dataType) : (dataType === '0' ? null : dataType),
      page_size: pageSize.toString(),
      page_current: (show_ui && show_ui.pageCurrent) ? show_ui.pageCurrent.toString() : pageCurrent.toString(),
      order: (show_ui && show_ui.order && show_ui.sort) ? show_ui.order : colOrder,
      sort: (show_ui && show_ui.sort) ? commFn.convertOrderString(show_ui.sort) : commFn.convertOrderString(colSort),
    };

    // set sessionStorage (存的是 => 送出的資料格式，不是 ui 格式)
    const tempToString = JSON.stringify(temp);
    sessionStorage.setItem('isrc_base', tempToString);

    // api
    dispatch({
      type: 'isrcList/fetchGetList',
      payload: temp,
    });
  }

  // mount
  useEffect(() => {
    getData();
  }, []);

  // ui -----
  // searchType
  const changeSearchType = (value) => {
    setSearchType(value);
  }

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
      dataType: dataType,
      pageCurrent: 1,
    });
  }

  // resetQuery
  const resetQuery = () => {
    setSearchType('isrc')
    setKeyword('');
    setPrecise(false);
    setDataType('0');
    setPageCurrent(1);
    setColOrder('release_date');
    setColSort('desc');
    getData({
      search_type: 'isrc',
      keyword: '',
      precise: false,
      dataType: '0',
      pageCurrent: 1,
      order: 'release_date',
      sort: 'desc'
    });
  }

  // orgISRC
  const changeOrgISRC = (e) => {
    setOrgISRC(e.target.checked);
  }

  // role
  const changeDataType = (e) => {
    setDataType(e.target.value);
    getData({
      dataType: e.target.value,
      pageCurrent: 1,
    });
  }

  // page
  const changePage = (page) => {
    let nowPage = parseInt(page);
    setPageCurrent(nowPage);
    getData({ pageCurrent: nowPage });
  }

  // changeColumn
  const changeColumn = (pagination, filters, sorter, extra) => {
    let val_order = sorter.columnKey;
    let val_sort = (sorter.order != undefined) ? sorter.order : '';

    // reset order, sort
    if (val_sort == '') {
      val_order = 'release_date';
      val_sort = 'desc';
    }

    setColOrder(val_order);
    setColSort(val_sort);
    getData({ order: val_order, sort: val_sort });
  }

  // table
  const columns = [
    {
      title: 'I.S.R.C',
      dataIndex: 'isrc',
      key: 'isrc',
      render: (text, row, index) => {
        let renderText = commFn.strToISRC(text);

        return (<Link to={`/isrc/adv/${row.id}`}>{renderText}</Link>);
      },
    },
    {
      title: '原始 ISRC',
      dataIndex: 'isrc',
      key: 'isrc',
      className: (orgISRC) ? '' : 'hideColumn',
    },
    {
      title: '',
      dataIndex: 'data_type',
      key: 'data_type',
      render: (text, row, index) => {
        if (text == '1') {
          return (<Tooltip title="Vocal"><AudioOutlined className={styles.om_icon_style} /></Tooltip>);
        } else {
          return (<Tooltip title="Video"><DesktopOutlined className={styles.om_icon_style} /></Tooltip>);
        }
      },
    },
    {
      title: '歌名',
      dataIndex: 'song_name',
      key: 'song_name',
    },
    {
      title: '歌曲編號',
      dataIndex: 'song_code',
      key: 'song_code',
      render: (text, row, index) => {
        return (<Link to={`/song/adv/song_code/${row.song_code}`} target="_blank">{text}</Link>);
      },
    },
    {
      title: '演唱人',
      dataIndex: 'singer',
      key: 'singer',
    },
    {
      title: '出版型態',
      dataIndex: 'isrc_type',
      key: 'isrc_type',
    },
    {
      title: '出版日期',
      dataIndex: 'release_date',
      key: 'release_date',
      sorter: true,
      defaultSortOrder: undefined,  // ascend, descend
    },
    {
      title: '錄音版別',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '母帶權利',
      dataIndex: 'tape',
      key: 'tape',
      render: (text, row, index) => {
        let renHtml = [];

        if (text) {
          for (let i = 0; i < text.length; i++) {
            if (i == text.length - 1) {
              renHtml.push(<span key={`tape_${index}_${i}`}>{text[i]}</span>);
            } else {
              renHtml.push(<span key={`tape_${index}_${i}`}>{text[i]}< br /></span>);
            }
          }
        }

        return renHtml;
      }
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (text, row, index) => {
        return (
          (row.split_num && parseInt(row.split_num) > 0)
            ? (<Tooltip title="有分拆"><CheckCircleOutlined className={`${styles.om_icon_style} ${styles.om_color_green}`} /></Tooltip>)
            : (<Tooltip title="無分拆"><CloseCircleOutlined className={`${styles.om_icon_style} ${styles.om_color_red}`} /></Tooltip>)
        );
      },
    },
  ];

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
              <Select
                className={styles.om_list_radios}
                style={{ width: 150 }}
                value={searchType}
                onChange={changeSearchType}
              >
                <Option value="isrc">ISRC</Option>
                <Option value="song_name">歌曲名稱</Option>
                <Option value="singer">演唱人</Option>
                <Option value="tape">母帶權利</Option>
                <Option value="album">專輯</Option>
              </Select>
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
              href={`${REACT_APP_PUBLIC_PATH}/#/isrc/update`}
            >
              新增 ISRC
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={24} md={12}>
            <RadioGroup
              className={styles.om_list_radios}
              value={dataType}
              onChange={changeDataType}
            >
              <RadioButton value="0">全部</RadioButton>
              <RadioButton value="1">Vocal</RadioButton>
              <RadioButton value="2">Video</RadioButton>
            </RadioGroup>
            <Checkbox
              checked={orgISRC}
              onChange={changeOrgISRC}
            >
              顯示 ISRC (原始)
            </Checkbox>
          </Col>
          <Col xs={24} md={12}>
            <Pagination
              className={styles.om_sp_m_lb}
              style={{ textAlign: 'right' }}
              current={pageCurrent}
              pageSize={pageSize}
              total={(list && list.total_items) && list.total_items}
              onChange={changePage}
              showSizeChanger={false}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <PageHint
              totalItems={(list && list.total_items) && list.total_items}
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
              dataSource={(list && list.total_items) && list.data_list}
              rowKey="id"
              onChange={changeColumn}
            />
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(({ isrcList, loading }) => ({
  isrcList,
  loading: loading.models.isrcList,
}))(isrc);