import React, { useState, useEffect, Fragment } from 'react';
import globalSettings from '@/fn/globalsettings';
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
  Select,
  Form,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusOutlined, DownloadOutlined, StarOutlined, TrademarkOutlined, CopyrightOutlined } from '@ant-design/icons';
import { Link, connect } from 'umi';
import PageHint from '@/components/PageHint';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { Option } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export const album = props => {
  const {
    loading,
    dispatch,
    albumList: { multiChangeId, optAlbumType, list },
    authorizedCountryList,
  } = props;
  const [keyword, setKeyword] = useState('');
  const [searchRange, setSearchRange] = useState('all');
  const [albumType, setAlbumType] = useState('0');
  const [publishCountry, setPublishCountry] = useState('');
  const { pageSize } = globalSettings;
  const [pageCurrent, setPageCurrent] = useState(1);
  const [precise, setPrecise] = useState(false);
  const [colOrder, setColOrder] = useState('release_date');
  const [colSort, setColSort] = useState('desc');
  // api -----
  // getData
  const getData = (obj) => {
    let show_ui = {};
    // get sessionStorage
    const getSession = JSON.parse(sessionStorage.getItem('album_base'));

    // 合併更改 ui 資料
    if (obj === undefined && getSession !== null) {
      // 切換其他頁再回來：先使用 session 資料
      const session_ui = {
        ...getSession,
        precise: (getSession.precise === '0') ? false : true,
        pageCurrent: parseInt(getSession.page_current),
        searchRange: (getSession.search_range === null) ? "all" : getSession.search_range,
        albumType: (getSession.album_type_id === null) ? "0" : getSession.album_type_id,
        publishCountry: (getSession.release_country === null) ? '' : getSession.release_country
      }
      delete session_ui['page_current'];
      delete session_ui['search_range'];
      delete session_ui['album_type_id'];
      delete session_ui['publish_country'];

      show_ui = { ...session_ui, ...obj };
    } else {
      // 一開始載入、當頁調整：預設
      const default_ui = {
        keyword: keyword,
        pageCurrent: pageCurrent,
        precise: precise,
        searchRange: searchRange,
        albumType: albumType,
        publishCountry: publishCountry,
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
      setSearchRange(show_ui.searchRange);
      setAlbumType(show_ui.albumType);
      setPublishCountry(show_ui.publishCountry);
      setColOrder(show_ui.order);
      setColSort(show_ui.sort);
    }

    // obj 轉資料格式
    let temp = {
      keyword: show_ui && show_ui.keyword !== undefined ? show_ui.keyword : keyword,
      precise: show_ui && show_ui.precise !== undefined ? commFn.convertBoolToNumStr(show_ui.precise) : commFn.convertBoolToNumStr(precise),
      search_range: (show_ui && show_ui.searchRange !== undefined)  // all (全部，傳 null), int (內部), ext (外部)
        ? (show_ui.searchRange != 'all' ? show_ui.searchRange : null)
        : (searchRange != 'all' ? searchRange : null),
      album_type_id: (show_ui && show_ui.albumType !== undefined)
        ? (show_ui.albumType != '' && show_ui.albumType != '0' ? show_ui.albumType : null)
        : (albumType != '' && albumType != '0' ? albumType : null),
      release_country: (show_ui && show_ui.publishCountry !== undefined)
        ? (show_ui.publishCountry != '' ? show_ui.publishCountry : null)
        : (publishCountry != '' ? publishCountry : null),
      page_size: pageSize.toString(),
      page_current: show_ui && show_ui.pageCurrent !== undefined ? show_ui.pageCurrent.toString() : pageCurrent.toString(),
      order: (show_ui && show_ui.order && show_ui.sort) ? show_ui.order : colOrder,
      sort: (show_ui && show_ui.sort) ? commFn.convertOrderString(show_ui.sort) : commFn.convertOrderString(colSort),
    }

    // set sessionStorage (存的是 => 送出的資料格式，不是 ui 格式)
    const tempToString = JSON.stringify(temp);
    sessionStorage.setItem('album_base', tempToString);

    // api
    dispatch({
      type: 'albumList/fetchMultiGetList',
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
    setPrecise(e.target.checked ? 1 : 0);
  }

  // search
  const onFinish = () => {
    setPageCurrent(1);
    getData({
      keyword,
      searchRange: searchRange,
      publishCountry: publishCountry,
      albumType: albumType,
      pageCurrent: 1,
    });
  }

  // resetQuery
  const resetQuery = () => {
    setKeyword('');
    setAlbumType('0');
    setPublishCountry('');
    setPrecise(false);
    setSearchRange('all')
    setPageCurrent(1);
    setColOrder('release_date');
    setColSort('desc')
    getData({
      search: '',
      keyword: '',
      searchRange: 'all',
      albumType: '0',
      publishCountry: '',
      pageCurrent: 1,
      precise: false,
      order: 'release_date',
      sort: 'desc'
    });
  }

  // searchRange
  const changeSearchRange = (e) => {
    setSearchRange(e.target.value);
    getData({
      searchRange: e.target.value,
      pageCurrent: 1,
    });
  }

  // albumType
  const changeAlbumType = (val) => {
    setAlbumType(val);
    getData({
      albumType: val,
      pageCurrent: 1,
    });
  }

  // publishCountry
  const changePublishCountry = (val) => {
    setPublishCountry(val);
    getData({
      publishCountry: val,
      pageCurrent: 1,
    });
  }

  // page
  const changePage = (page) => {
    const nowPage = parseInt(page, 10);
    setPageCurrent(nowPage);
    getData({ pageCurrent: nowPage });
  }

  // table
  const columns = [
    {
      title: '專輯編號',
      dataIndex: 'album_code',
      key: 'album_code',
      render: (text, row, index) => {
        return (<Link to={`/album/adv/${row.id}`}>{text}</Link>);
      }
    },
    {
      title: '',
      dataIndex: 'is_debut',
      key: 'is_debut',
      align: 'right',
      width: '52px',
      render: (text, row) => {
        return row.is_debut === '1' ? <StarOutlined className={styles.om_icon_style} /> : null;
      },
    },
    {
      title: '專輯名稱',
      dataIndex: 'album_name_zh',
      key: 'album_name_zh',
      render: (text, row) => {
        return (
          <Fragment>
            <span>{(text) ? (text) : ('')}</span>
            {
              (row.version)
                ? (
                  <Fragment>
                    &nbsp;/&nbsp;
                    <span className={styles.om_color_yellow}>{row.version}</span>
                  </Fragment>
                )
                : ('')
            }
          </Fragment>
        );
      }
    },
    {
      title: '演唱人',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '型態',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '發行地區',
      dataIndex: 'release_country',
      key: 'release_country',
    },
    {
      title: '發行公司',
      dataIndex: 'company_nickname',
      key: 'company_nickname',
    },
    {
      title: '發行日期',
      dataIndex: 'release_date',
      key: 'release_date',
      sorter: true,
      defaultSortOrder: undefined,  // ascend, descend
    },
    {
      title: '',  // 詞曲結算
      width: '50px',
      render: (text, row) => {
        return (row.is_righ_setting === '1')
          ? (<CopyrightOutlined className={styles.om_icon_style} style={{ color: '#a000cc' }} />)
          : (<CopyrightOutlined className={styles.om_icon_style} style={{ color: '#a0a0a0' }} />)
      }
    },
    {
      title: '',  // 錄音結算
      width: '50px',
      render: (text, row) => {
        return (row.is_re_setting === '1')
          ? (<TrademarkOutlined className={styles.om_icon_style} style={{ color: '#00adcc' }} />)
          : (<TrademarkOutlined className={styles.om_icon_style} style={{ color: '#a0a0a0' }} />)
      }
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: '50px',
      render: (text, row) => {
        return (
          <a
            href={`${window.FRONTEND_WEB}/album/label_copy?album_id=${text}`}
            target="_blank"
          >
            <Tooltip title="下載 Label Copy">
              <DownloadOutlined
                className={styles.om_icon_style}
                style={{ color: '#1890ff' }}
              />
            </Tooltip>
          </a>
        )
      },
    },
  ];

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
              <label className={styles.om_sp_m_rb}>專輯名稱/編號/發行公司/演唱人</label>
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
              href={`${REACT_APP_PUBLIC_PATH}/#/album/update`}
            >
              新增專輯
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={24} md={12}>
            <RadioGroup
              className={styles.om_list_radios}
              value={searchRange}
              onChange={changeSearchRange}
            >
              <RadioButton value="all">全部</RadioButton>
              <RadioButton value="int">我方</RadioButton>
              <RadioButton value="ext">外部專輯</RadioButton>
            </RadioGroup>
            {/* 型態 */}
            <Select
              style={{ width: 100 }}
              className={styles.om_list_radios}
              options={optAlbumType}
              value={albumType}
              onChange={changeAlbumType}
            />
            {/* 發行地區 */}
            <Select
              style={{ width: 150 }}
              value={publishCountry}
              onChange={changePublishCountry}
              showSearch={true}
              optionFilterProp="label"
              virtual={false}
            >
              {
                (authorizedCountryList.countryList)
                  ? (
                    authorizedCountryList.countryList.map((elem, idx) => {
                      if (idx == 0) {
                        return (
                          <Fragment key={`countryOpts_${idx}`}>
                            <Option key="-1" value="" label="不限">不限</Option>
                            <Option key={idx} value={elem.id} label={elem.country_name_zh}>{elem.country_name_zh}</Option>
                          </Fragment>
                        )
                      } else {
                        return <Option key={idx} value={elem.id} label={elem.country_name_zh}>{elem.country_name_zh}</Option>
                      }
                    })
                  )
                  : ([])
              }
            </Select>
          </Col>
          <Col xs={24} md={12}>
            <Pagination
              className={styles.om_sp_m_lb}
              style={{ textAlign: 'right' }}
              current={pageCurrent}
              pageSize={pageSize}
              total={(list && list.total_item) && list.total_item}
              onChange={changePage}
              showSizeChanger={false}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <PageHint
              totalItems={(list && list.total_item) && list.total_item}
              pageSize={pageSize}
              changeId={multiChangeId}
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
              dataSource={(list && list.data_list) && list.data_list}
              rowKey="id"
              onChange={changeColumn}
            />
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(({ albumList, authorizedCountryList, loading }) => ({
  albumList,
  authorizedCountryList,
  loading: loading.models.albumList,
}))(album);
