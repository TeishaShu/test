import React, { useState, useEffect, Fragment } from 'react';
import globalSettings from '@/fn/globalsettings';
import { CopyrightOutlined, TrademarkOutlined, DownloadOutlined, UploadOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
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
  DatePicker,
  Modal,
  Form,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import { Link, connect } from 'umi';
import moment from 'moment';
import PageHint from '@/components/PageHint';
import ComUpload from './components/ComUpload';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { Option } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

export const karaoke = props => {
  const {
    loading,
    dispatch,
    settlePhaseList,
    karaokeList: { multiChangeId, list },
  } = props;
  const [viewLoading, setViewLoading] = useState(false);
  const { confirm } = Modal;
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('contract_code');
  // 發行日期區間
  const [realReleaseDate, setRealReleaseDate] = useState(null);
  const [releaseDateStart, setReleaseDateStart] = useState(null);
  const [releaseDateEnd, setReleaseDateEnd] = useState(null);
  // 專屬期限區間
  const [realDate, setRealDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // page
  const { pageSize } = globalSettings;
  const [pageCurrent, setPageCurrent] = useState(1);
  const [precise, setPrecise] = useState(false);
  const dateFormat = 'YYYY-MM';
  // order
  const [colOrder, setColOrder] = useState('release_date');
  const [colSort, setColSort] = useState('desc');
  // isHistoryColor
  const isHistoryColor = { style: { backgroundColor: '#DBDBDB' } };

  // api -----
  // getData
  const getData = (obj) => {
    let show_ui = {};
    // get sessionStorage
    const getSession = JSON.parse(sessionStorage.getItem('karaoke_base'));

    // 合併更改 ui 資料
    if (obj === undefined && getSession !== null) {
      // 切換其他頁再回來：先使用 session 資料
      const session_ui = {
        ...getSession,
        precise: (getSession.precise === "0") ? false : true,
        pageCurrent: parseInt(getSession.page_current),
        order: getSession.order_by,
        releaseDateStart: getSession.release_date_start,
        releaseDateEnd: getSession.release_date_end,
        startDate: getSession.start_date,
        endDate: getSession.end_date,
      }
      delete session_ui['page_current'];
      delete session_ui['order_by'];
      delete session_ui['release_date_start'];
      delete session_ui['release_date_end'];
      delete session_ui['start_date'];
      delete session_ui['end_date'];

      show_ui = { ...session_ui, ...obj };
    } else {
      // 一開始載入、當頁調整：預設
      const default_ui = {
        keyword: keyword,
        pageCurrent: pageCurrent,
        precise: precise,
        sort: colSort,
        order: colOrder,
        type: type,
        realReleaseDate: realReleaseDate,
        releaseDateStart: releaseDateStart,
        releaseDateEnd: releaseDateEnd,
        realDate: realDate,
        startDate: startDate,
        endDate: endDate,
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
      setType(show_ui.type);
      setRealReleaseDate((!show_ui.releaseDateStart && !show_ui.releaseDateEnd) ? null : ([moment(show_ui.releaseDateStart, dateFormat), moment(show_ui.releaseDateEnd, dateFormat)]));
      setReleaseDateStart(show_ui.releaseDateStart);
      setReleaseDateEnd(show_ui.releaseDateEnd);
      setRealDate((!show_ui.startDate && !show_ui.endDate) ? null : ([moment(show_ui.startDate, dateFormat), moment(show_ui.endDate, dateFormat)]));
      setStartDate(show_ui.startDate);
      setEndDate(show_ui.endDate);
    }

    // obj 轉資料格式
    let temp = {
      keyword: show_ui && show_ui.keyword !== undefined ? show_ui.keyword : keyword,
      precise: (show_ui && show_ui.precise != undefined) ? commFn.convertBoolToNumStr(show_ui.precise) : commFn.convertBoolToNumStr(precise),
      type: (show_ui && show_ui.type) ? show_ui.type : type,

      release_date_start: show_ui && show_ui.hasOwnProperty('releaseDateStart') ? show_ui.releaseDateStart : releaseDateStart,
      release_date_end: show_ui && show_ui.hasOwnProperty('releaseDateEnd') ? show_ui.releaseDateEnd : releaseDateEnd,
      start_date: show_ui && show_ui.hasOwnProperty('startDate') ? show_ui.startDate : startDate,
      end_date: show_ui && show_ui.hasOwnProperty('endDate') ? show_ui.endDate : endDate,

      page_size: pageSize.toString(),
      page_current: show_ui && show_ui.pageCurrent !== undefined ? show_ui.pageCurrent.toString() : pageCurrent.toString(),

      order_by: (show_ui && show_ui.order && show_ui.sort) ? show_ui.order : colOrder,
      sort: (show_ui && show_ui.sort) ? commFn.convertOrderString(show_ui.sort) : commFn.convertOrderString(colSort),
    }
    // set sessionStorage (存的是 => 送出的資料格式，不是 ui 格式)
    const tempToString = JSON.stringify(temp);
    sessionStorage.setItem('karaoke_base', tempToString);

    // api
    dispatch({
      type: 'karaokeList/fetchMultiGetList',
      payload: temp,
    });
  }

  // mount
  useEffect(() => {
    getData();
  }, []);

  // updateSettlePhase
  const updateSettlePhase = (updateObj) => {
    dispatch({
      type: 'karaokeList/fecthUpdateSettlePhase',
      payload: updateObj,
      callback: res => {
        getData();
      }
    });
  }

  // ui -----
  // showUpdateSettlePhaseConfirm
  const showUpdateSettlePhaseConfirm = (contract_karaoke_id, period, type) => {
    let showText = '確定將';

    if (type == 1) {
      showText += '詞曲計算期別';
    } else {
      showText += '錄音計算期別';
    }

    switch (period) {
      case 1:
        showText += '更新為當期期別？';
        break;
      case 2:
        showText += '更新為下期期別？';
        break;
      default:
        showText += '清除？';
        break;
    }

    confirm({
      title: '',
      icon: '',
      content: showText,
      okText: '確定',
      cancelText: '取消',
      onOk() {
        updateSettlePhase({
          contract_karaoke_id: contract_karaoke_id,
          period: period,
          type: type
        });
      },
      onCancel() { },
    });
  }

  // type
  const changeType = (value) => {
    setType(value);
  }

  // keyword
  const changeKeyword = (e) => {
    setKeyword(e.target.value);
  }

  // releaseDate
  const changeReleaseDate = (date) => {
    let tmpReleaseDateStart = null;
    let tmpReleaseDateEnd = null;

    if (date) {
      tmpReleaseDateStart = date[0].format(dateFormat) + '-01';
      tmpReleaseDateEnd = date[1].format(dateFormat) + '-' + commFn.getMonthLastDay(date[1].format(dateFormat));
    }

    setRealReleaseDate(date);
    setReleaseDateStart(tmpReleaseDateStart);
    setReleaseDateEnd(tmpReleaseDateEnd);
    setPageCurrent(1);
    getData({
      pageCurrent: 1,
      releaseDateStart: tmpReleaseDateStart,
      releaseDateEnd: tmpReleaseDateEnd,
    });
  }

  // date
  const changeDate = (date) => {
    let tmpStartDate = null;
    let tmpEndDate = null;

    if (date) {
      tmpStartDate = date[0].format(dateFormat) + '-01';
      tmpEndDate = date[1].format(dateFormat) + '-' + commFn.getMonthLastDay(date[1].format(dateFormat));
    }

    setRealDate(date);
    setStartDate(tmpStartDate);
    setEndDate(tmpEndDate);
    setPageCurrent(1);
    getData({
      pageCurrent: 1,
      startDate: tmpStartDate,
      endDate: tmpEndDate,
    });
  }

  // precise
  const changePrecise = (e) => {
    setPrecise(e.target.checked);
  }

  // search
  const onFinish = () => {
    setPageCurrent(1);
    getData({
      keyword,
      type: type,
      pageCurrent: 1,
    });
  }

  // resetQuery
  const resetQuery = () => {
    setKeyword('');
    setType('contract_code');
    setPrecise(false);
    setRealReleaseDate(null);
    setReleaseDateStart(null);
    setReleaseDateEnd(null);
    setRealDate(null);
    setStartDate(null);
    setEndDate(null);
    setPageCurrent(1);
    setColOrder('release_date');
    setColSort('desc');

    getData({
      search: '',
      keyword: '',
      precise: false,
      type: 'contract_code',
      releaseDateStart: null,
      releaseDateEnd: null,
      startDate: null,
      endDate: null,
      pageCurrent: 1,
      order: 'release_date',
      sort: 'desc'
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
      title: '編號',
      dataIndex: 'contract_code',
      key: 'contract_code',
      render: (text, row, index) => {
        return (<Link to={`/karaoke/adv/${row.id}`}>{text}</Link>);
      }
    },
    {
      title: '波',
      dataIndex: 'wave',
      key: 'wave',
    },
    {
      title: '產品名稱',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '使用者',
      dataIndex: 'user_company_name',
      key: 'user_company_name',
    },
    {
      title: '發行商',
      dataIndex: 'release_company_name',
      key: 'release_company_name',
    },
    {
      title: '發行日期',
      dataIndex: 'release_date',
      key: 'release_date',
      sorter: true,
      defaultSortOrder: undefined,  // ascend, descend
    },
    {
      title: '專屬期限起始日',
      dataIndex: 'start_date',
      key: 'start_date',
      sorter: true,
      defaultSortOrder: undefined,  // ascend, descend
    },
    {
      title: '專屬期限到期日',
      dataIndex: 'end_date',
      key: 'end_date',
      sorter: true,
      defaultSortOrder: undefined,  // ascend, descend
      render: (text, row, index) => {
        let hasDays = (text) ? ((new Date(text) - new Date()) / 1000 / 60 / 60 / 24) : 0;
        let textStyle = null;

        if (hasDays < 0) {
          textStyle = { style: { color: '#E75757' } };
        } else if (hasDays < 60) {
          textStyle = { style: { color: 'rgb(249, 176, 6)' } };
        }

        return ({
          children: text,
          props: textStyle
        });
      }
    },
    {
      title: '收款期別',
      dataIndex: 'receivable_phase',
      key: 'receivable_phase',
      sorter: true,
      defaultSortOrder: undefined,  // ascend, descend
    },
    {
      title: '售價',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: '25px',
      render: (text, row, index) => {
        return '';
      }
    },
    {
      title: '詞曲計算期別',
      dataIndex: 'right_phase_id',
      key: 'right_phase_id',
      width: '250px',
      render: (text, row, index) => {
        let isHistoryPhase = false;
        const returnObj = {
          children: null,
          props: null
        };
        let auth_fee = (row.auth_fee) ? parseFloat(row.auth_fee) : 0;

        if (
          text
          && (settlePhaseList.enityRight && settlePhaseList.enityRight.current && settlePhaseList.enityRight.current.phase && settlePhaseList.enityRight.current.id && settlePhaseList.enityRight.current.id != text)
          && (settlePhaseList.enityRight && settlePhaseList.enityRight.next && settlePhaseList.enityRight.next.phase && ((settlePhaseList.enityRight.next.id && settlePhaseList.enityRight.next.id != text) || !settlePhaseList.enityRight.next.id))
        ) {
          isHistoryPhase = true;
          returnObj.props = isHistoryColor;
        }

        if (row.is_ui_child) {
          returnObj.children = (
            <Fragment>
              <Button
                className={styles.om_sp_m_rb}
                onClick={() => {
                  showUpdateSettlePhaseConfirm(row.ui_parent_id, 1, 1);
                }}
                disabled={isHistoryPhase}
              >當期</Button>
              <Button
                className={styles.om_sp_m_rb}
                onClick={() => {
                  showUpdateSettlePhaseConfirm(row.ui_parent_id, 2, 1);
                }}
                disabled={isHistoryPhase}
              >下期</Button>
              <Button
                className={styles.om_sp_m_rb}
                onClick={() => {
                  showUpdateSettlePhaseConfirm(row.ui_parent_id, null, 1);
                }}
                disabled={isHistoryPhase}
              >清除</Button>
            </Fragment>
          );
        } else {
          returnObj.children = (
            <div style={{ display: 'table', verticalAlign: 'top' }}>
              <div style={{ display: 'table-cell', minWidth: '110px' }}>
                <span style={{ paddingRight: '30px' }}>
                  {
                    (row.right_phase_start_date && row.right_phase_end_date)
                      ? (
                        <Fragment>
                          {row.right_phase_start_date.split('-').join('/')}-<br />{row.right_phase_end_date.split('-').join('/')}
                        </Fragment>
                      )
                      : ('')
                  }
                </span>
              </div>
              <div style={{ display: 'table-cell' }}>
                <span>{auth_fee}</span>
              </div>
            </div>
          );
        }

        return returnObj;
      }
    },
    {
      title: '錄音計算期別',
      dataIndex: 'record_phase_id',
      key: 'record_phase_id',
      width: '250px',
      render: (text, row, index) => {
        let isHistoryPhase = false;
        const returnObj = {
          children: null,
          props: null
        };

        if (
          text
          && (settlePhaseList.enityRecord && settlePhaseList.enityRecord.current && settlePhaseList.enityRecord.current.phase && settlePhaseList.enityRecord.current.id && settlePhaseList.enityRecord.current.id != text)
          && (settlePhaseList.enityRecord && settlePhaseList.enityRecord.next && settlePhaseList.enityRecord.next.phase && ((settlePhaseList.enityRecord.next.id && settlePhaseList.enityRecord.next.id != text) || !settlePhaseList.enityRecord.next.id))
        ) {
          isHistoryPhase = true;
          returnObj.props = isHistoryColor;
        }

        if (row.is_ui_child) {
          returnObj.children = (
            <Fragment>
              <Button
                className={styles.om_sp_m_rb}
                onClick={() => {
                  showUpdateSettlePhaseConfirm(row.ui_parent_id, 1, 2);
                }}
                disabled={isHistoryPhase}
              >當期</Button>
              <Button
                className={styles.om_sp_m_rb}
                onClick={() => {
                  showUpdateSettlePhaseConfirm(row.ui_parent_id, 2, 2);
                }}
                disabled={isHistoryPhase}
              >下期</Button>
              <Button
                className={styles.om_sp_m_rb}
                onClick={() => {
                  showUpdateSettlePhaseConfirm(row.ui_parent_id, null, 2);
                }}
                disabled={isHistoryPhase}
              >清除</Button>
            </Fragment>
          );
        } else {
          returnObj.children = (
            <div style={{ display: 'table', verticalAlign: 'top' }}>
              <div style={{ display: 'table-cell', minWidth: '110px' }}>
                <span style={{ paddingRight: '30px' }}>
                  {
                    (row.record_phase_start_date && row.record_phase_end_date)
                      ? (
                        <Fragment>
                          {row.record_phase_start_date.split('-').join('/')}-<br />{row.record_phase_end_date.split('-').join('/')}
                        </Fragment>
                      )
                      : ('')
                  }
                </span>
              </div>
              <div style={{ display: 'table-cell' }}>
                <span>{(row.singer_pay) ? (row.singer_pay) : '0'}</span>
              </div>
            </div>
          );
        }

        return returnObj;
      }
    },
  ];

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
              <Select
                className={styles.om_list_radios}
                style={{ width: 150 }}
                value={type}
                onChange={changeType}
              >
                <Option value="contract_code">編號</Option>
                <Option value="name">產品名稱</Option>
                <Option value="song_name">歌曲名稱</Option>

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
            </Col>
            <Col
              xs={24} md={8}
              style={{ textAlign: 'right' }}
            >
              <a
                href={`${window.FRONTEND_WEB}/contract_karaoke/export_right_phase?period=1`}
                target="_blank"
              >
                <Tooltip title="匯出當期詞曲">
                  <CopyrightOutlined
                    className={`${styles.om_icon_style} ${styles.om_sp_m_lb}`}
                    style={{ color: '#a000cc' }}
                  />
                </Tooltip>
              </a>
              <a
                href={`${window.FRONTEND_WEB}/contract_karaoke/export_right_phase?period=2`}
                target="_blank"
              >
                <Tooltip title="匯出下期詞曲">
                  <CopyrightOutlined
                    className={`${styles.om_icon_style} ${styles.om_sp_m_lb}`}
                    style={{ color: '#ccc' }}
                  />
                </Tooltip>
              </a>
              <a
                href={`${window.FRONTEND_WEB}/contract_karaoke/export_record_phase?period=1`}
                target="_blank"
              >
                <Tooltip title="匯出當期錄音">
                  <CopyrightOutlined
                    className={`${styles.om_icon_style} ${styles.om_sp_m_lb}`}
                    style={{ color: '#00adcc' }}
                  />
                </Tooltip>
              </a>
              <a
                href={`${window.FRONTEND_WEB}/contract_karaoke/export_record_phase?period=2`}
                target="_blank"
              >
                <Tooltip title="匯出下期錄音">
                  <CopyrightOutlined
                    className={`${styles.om_icon_style} ${styles.om_sp_m_lb}`}
                    style={{ color: '#ccc' }}
                  />
                </Tooltip>
              </a>
              <Tooltip title="匯出結果">
                <DownloadOutlined
                  className={`${styles.om_icon_style} ${styles.om_sp_m_lb}`}
                  onClick={() => {
                    const setObj = {
                      keyword: keyword,
                      precise: (precise ? '1' : '0'),
                      type: type,
                      release_date_start: releaseDateStart,
                      release_date_end: releaseDateEnd,
                      start_date: startDate,
                      end_date: endDate,
                      page_size: pageSize.toString(),
                      page_current: pageCurrent.toString(),
                      order_by: colOrder,
                      sort: commFn.convertOrderString(colSort)
                    };
                    commFn.postDownloadFile(`${window.FRONTEND_WEB}/contract_karaoke/export_search_result`, setObj);
                  }}
                />
              </Tooltip>
              <ComUpload
                setPageCurrent={setPageCurrent}
                getData={getData}
                setViewLoading={setViewLoading}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className={styles.om_sp_m_lb}
                href={`${REACT_APP_PUBLIC_PATH}/#/karaoke/update`}
              >
                新增卡拉 OK
            </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={16}>
              <span
                className={styles.om_sp_m_rb}
              >
                發行日期
            </span>
              <RangePicker
                className={styles.om_sp_m_rb}
                format="YYYY-MM"
                picker="month"
                allowClear={true}
                value={realReleaseDate}
                onChange={changeReleaseDate}
              />
              <span
                className={styles.om_sp_m_rb}
              >
                專屬期限
            </span>
              <RangePicker
                className={styles.om_sp_m_rb}
                format="YYYY-MM"
                picker="month"
                allowClear={true}
                value={realDate}
                onChange={changeDate}
              />
            </Col>
            <Col xs={24} md={8}>
              {/*{(list && list.total_item) && (*/}
              <Pagination
                className={styles.om_sp_m_lb}
                style={{ textAlign: 'right' }}
                current={pageCurrent}
                pageSize={pageSize}
                total={(list && list.total_item) && list.total_item}
                onChange={changePage}
                showSizeChanger={false}
              />
              {/*)} */}
            </Col>
          </Row>
          <Row>
            <Col xs={24}>
              {/*{(list && list.total_item) && (*/}
              <PageHint
                totalItems={(list && list.total_item) && list.total_item}
                pageSize={pageSize}
                changeId={multiChangeId}
              />{/*)} */}
            </Col>
          </Row>
        </Form>
        <Row>
          <Col
            xs={24}
            className={styles.om_overflow_auto}
          >{/*{(list && list.list) && (*/}
            <Table
              className={styles.mainTable}
              pagination={false}
              loading={loading || viewLoading}
              columns={columns}
              dataSource={(list && list.list) && list.list}
              rowKey="id"
              onChange={changeColumn}
              expandable={{
                childrenColumnName: 'ui_child',
                expandIconColumnIndex: 10,
                expandIcon: ({ expanded, onExpand, record }) =>
                  record.contract_code ? (
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
                  ) : ('')
              }}
            />{/*)} */}
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(({ settlePhaseList, karaokeList, loading }) => ({
  settlePhaseList,
  karaokeList,
  loading: loading.models.karaokeList,
}))(karaoke);
