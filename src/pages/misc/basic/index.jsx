import React, { useState, useEffect, Fragment } from 'react';
import globalSettings from '@/fn/globalsettings';
import { CopyrightOutlined, DownloadOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Card,
  Input,
  Radio,
  Checkbox,
  Button,
  Pagination,
  Tooltip,
  Select,
  DatePicker,
  Modal,
  Empty,
  Spin,
  Upload,
  message,
  Form,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusOutlined, CheckOutlined, UploadOutlined } from '@ant-design/icons';
import { Link, connect } from 'umi';
import moment from 'moment';
import PageHint from '@/components/PageHint';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import miscFn from '../fn';

const { Option } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

export const misc = props => {
  const {
    loading,
    dispatch,
    settlePhaseList,
    miscList: { changeId, list },
  } = props;
  const [viewLoading, setViewLoading] = useState(false);
  const { confirm } = Modal;
  const [keyword, setKeyword] = useState('');
  // 計算期別
  const [phaseType, setPhaseType] = useState('0');
  // 計算期別日期
  const [phaseDate, setPhaseDate] = useState({
    date: null,
    phaseStart: null,
    phaseEnd: null,
  });
  const dateFormat = 'YYYY-MM';
  // 收款期別
  const [receivablePhase, setReceivablePhase] = useState('');
  let receivablePhaseReg = /^[0-9]{4}[qQ]{1}[1-4]{1}$/;
  // page
  const { pageSize } = globalSettings;
  const [pageCurrent, setPageCurrent] = useState(1);
  const [precise, setPrecise] = useState(false);
  // TODO
  const [dateView, setDateView] = useState([]);
  const [detailView, setDetailView] = useState([]);
  const [isHistoryPhase, setIsHistoryPhase] = useState(false);

  // api -----
  // getData
  const getData = (obj) => {
    setDateView([]);
    setDetailView([]);

    let show_ui = {};
    // get sessionStorage
    const getSession = JSON.parse(sessionStorage.getItem('misc_base'));

    // 合併更改 ui 資料
    if (obj === undefined && getSession !== null) {
      // 切換其他頁再回來：先使用 session 資料
      const session_ui = {
        ...getSession,
        precise: (getSession.precise === 0) ? false : true,
        pageCurrent: parseInt(getSession.page_current),
        phaseType: getSession.phase_type,
        receivablePhase: getSession.receivable_phase,
        phaseStart: getSession.phase_start,
        phaseEnd: getSession.phase_end
      }
      delete session_ui['page_current'];
      delete session_ui['phase_type'];
      delete session_ui['receivable_phase'];
      delete session_ui['phase_start'];
      delete session_ui['phase_end'];
      show_ui = { ...session_ui, ...obj };

    } else {
      // 一開始載入、當頁調整：預設
      const default_ui = {
        keyword: keyword,
        precise: precise,
        pageCurrent: pageCurrent,
        phaseType: phaseType,
        receivablePhase: receivablePhase,
        phaseStart: (phaseDate && phaseDate.phaseStart) && phaseDate.phaseStart,
        phaseEnd: (phaseDate && phaseDate.phaseEnd) && phaseDate.phaseEnd
      }
      show_ui = { ...default_ui, ...obj }
    }

    // 顯示 ui 畫面
    if (show_ui.pageCurrent) {
      setKeyword(show_ui.keyword);
      setPrecise(show_ui.precise);
      setPageCurrent(show_ui.pageCurrent);
      setPhaseType(show_ui.phaseType)
      setReceivablePhase(show_ui.receivablePhase)
      setPhaseDate({
        date: (!show_ui.phaseStart && !show_ui.phaseEnd) ? null : ([moment(show_ui.phaseStart, dateFormat), moment(show_ui.phaseEnd, dateFormat)]),
        phaseStart: show_ui.phaseStart,
        phaseEnd: show_ui.phaseEnd,
      })
    }

    // obj 轉資料格式
    let temp = {
      keyword: show_ui && show_ui.keyword !== undefined ? show_ui.keyword : keyword,
      precise: show_ui && show_ui.precise !== undefined ? (show_ui.precise ? 1 : 0) : (precise ? 1 : 0),
      phase_type: (show_ui && show_ui.phaseType) ? (show_ui.phaseType) : (phaseType),  // 0,1,2
      phase_start: (show_ui && show_ui.hasOwnProperty('phaseStart'))
        ? ((show_ui.phaseStart) ? (show_ui.phaseStart) : (undefined))
        : ((phaseDate && phaseDate.phaseStart) ? (phaseDate.phaseStart) : (undefined)),
      phase_end: (show_ui && show_ui.hasOwnProperty('phaseEnd'))
        ? ((show_ui.phaseEnd) ? (show_ui.phaseEnd) : (undefined))
        : ((phaseDate && phaseDate.phaseEnd) ? (phaseDate.phaseEnd) : (undefined)),
      receivable_phase: (show_ui && show_ui.hasOwnProperty('receivablePhase'))
        ? ((show_ui.receivablePhase && receivablePhaseReg.test(show_ui.receivablePhase)) ? (show_ui.receivablePhase.toUpperCase()) : undefined)
        : (receivablePhase && receivablePhaseReg.test(receivablePhase) ? receivablePhase.toUpperCase() : undefined),
      page_size: pageSize.toString(),
      page_current: show_ui && show_ui.pageCurrent !== undefined ? show_ui.pageCurrent.toString() : pageCurrent.toString(),
    }

    // set sessionStorage (存的是 => 送出的資料格式，不是 ui 格式)
    const tempToString = JSON.stringify(temp);
    sessionStorage.setItem('misc_base', tempToString);

    dispatch({
      type: 'miscList/fetchGetList',
      payload: temp,
    });
  }
  // mount
  useEffect(() => {
    getData();
  }, []);

  // getDetail
  const getDetail = (elem, idx) => {
    setViewLoading(true);

    dispatch({
      type: 'miscList/fetchGetInfo',
      payload: {
        cm_id: elem.id,
      },
      callback: (res) => {
        let tmpData = [];

        if (res && res.content) {
          res.content.forEach((elem) => {
            tmpData.push({
              type: elem.type,
              name: elem.name,
              song_name: elem.song_name,
              isrc: elem.isrc,
              contract_author_code: elem.contract_author_code,
              contract_author_subcontract_code: elem.contract_author_subcontract_code,
            });
          });
        }

        setDetailView((prev) => {
          let tmpArr = prev.slice();
          tmpArr[idx] = { data: tmpData, status: true };
          return tmpArr;
        });

        setViewLoading(false);
      }
    });
  }

  // updateSettlePhase
  const updateSettlePhase = (updateObj) => {
    dispatch({
      type: 'miscList/fecthUpdateSettlePhase',
      payload: updateObj,
      callback: res => {
        getData();
      }
    });
  }

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
      keyword,
      pageCurrent: 1,
    });
  }

  // TODO: resetQuery
  const resetQuery = () => {
    setKeyword('');
    setPageCurrent(1);
    setPrecise(false);
    setPhaseType('0');
    setPhaseDate(null);
    setReceivablePhase('');
    getData({
      search: '',
      keyword: '',
      pageCurrent: 1,
      phaseType: '0',
      phaseStart: null,
      phaseEnd: null,
      precise: false,
      receivablePhase: '',
    });
  }

  // changePhaseType
  const changePhaseType = (value) => {
    setPhaseType(value);
    getData({
      phaseType: value
    });
  }

  // changeReceivablePhase
  const changeReceivablePhase = (e) => {
    let val = e.target.value;

    setReceivablePhase(val);
    setPageCurrent(1);

    if (!val || receivablePhaseReg.test(val)) {
      getData({
        receivablePhase: val,
        pageCurrent: 1
      });
    }
  }

  // phaseDate
  const changePhaseDate = (date) => {
    let tmpPhaseStart = null;
    let tmpPhaseEnd = null;
    if (date) {
      // tmpPhaseStart = date[0].format(dateFormat) + '-01';
      // tmpPhaseEnd = date[1].format(dateFormat) + '-' + commFn.getMonthLastDay(date[1].format(dateFormat));

      tmpPhaseStart = date[0].format(dateFormat);
      tmpPhaseEnd = date[1].format(dateFormat);
    }

    setPhaseDate({
      date: date,
      phaseStart: tmpPhaseStart,
      phaseEnd: tmpPhaseEnd,
    });
    setPageCurrent(1);
    getData({
      pageCurrent: 1,
      phaseStart: tmpPhaseStart,
      phaseEnd: tmpPhaseEnd,
    });
  }

  // page
  const changePage = (page) => {
    const nowPage = parseInt(page, 10);
    setPageCurrent(nowPage);
    getData({ pageCurrent: nowPage });
  }

  // showUpdateSettlePhaseConfirm
  const showUpdateSettlePhaseConfirm = (cmId, period, type) => {
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
          cm_id: cmId,
          period: period,
          type: type
        });
      },
      onCancel() { },
    });
  }

  // phaseButtons
  const phaseButtons = (cmId, type) => (
    <Fragment>
      <Button
        className={styles.om_sp_m_rb}
        onClick={() => {
          showUpdateSettlePhaseConfirm(cmId, 1, type);
        }}
        disabled={isHistoryPhase}
      >當期</Button>
      <Button
        className={styles.om_sp_m_rb}
        onClick={() => {
          showUpdateSettlePhaseConfirm(cmId, 2, type);
        }}
        disabled={isHistoryPhase}
      >下期</Button>
      <Button
        className={styles.om_sp_m_rb}
        onClick={() => {
          showUpdateSettlePhaseConfirm(cmId, null, type);
        }}
        disabled={isHistoryPhase}
      >清除</Button>
    </Fragment>
  );

  return (
    <Spin
      tip="Loading..."
      spinning={loading || viewLoading}
    >
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Form
            name="search"
            onFinish={onFinish}
            style={{ display: 'inline' }}
          >
            <Row>
              <Col xs={24} md={16}>
                <label className={styles.om_sp_m_rb}>編號/使用者/歌曲名稱</label>
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
                  href={`${window.FRONTEND_WEB}/contract_misc/export?phase_type=1&export_type=current`}
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
                  href={`${window.FRONTEND_WEB}/contract_misc/export?phase_type=1&export_type=next`}
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
                  href={`${window.FRONTEND_WEB}/contract_misc/export?phase_type=2&export_type=current`}
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
                  href={`${window.FRONTEND_WEB}/contract_misc/export?phase_type=2&export_type=next`}
                  target="_blank"
                >
                  <Tooltip title="匯出下期錄音">
                    <CopyrightOutlined
                      className={`${styles.om_icon_style} ${styles.om_sp_m_lb}`}
                      style={{ color: '#ccc' }}
                    />
                  </Tooltip>
                </a>
                <a
                  href={`${window.FRONTEND_WEB}/contract_misc/export?keyword=${keyword}&precise=${precise ? '1' : '0'}&phase_start=${(phaseDate && phaseDate.phaseStart) ? (phaseDate.phaseStart) : ('')}&phase_end=${(phaseDate && phaseDate.phaseEnd) ? (phaseDate.phaseEnd) : ('')}&phase_type=${phaseType}&export_type=now`}
                  target="_blank"
                >
                  <Tooltip title="匯出結果">
                    <DownloadOutlined
                      className={`${styles.om_icon_style} ${styles.om_sp_m_lb}`}
                    />
                  </Tooltip>
                </a>
                <Upload
                  name="files[]"
                  method="post"
                  action={`${window.FRONTEND_WEB}/contract_misc/import`}
                  accept='.xlsx'
                  onChange={(info) => {
                    setViewLoading(true);

                    if (info.file.status === 'done') {
                      if (info.file.response && info.file.response.data && info.file.response.data.error_cnt && info.file.response.data.contract_code) {
                        commFn.errHandler(`"${info.file.name}" 檔案上傳失敗，資料重複：${info.file.response.data.contract_code.join('、')}`);
                      } else {
                        message.success(`"${info.file.name}" 檔案上傳成功`);
                      }

                      setPageCurrent(1);
                      getData({
                        pageCurrent: 1,
                      });
                      setViewLoading(false);
                    } else if (info.file.status === 'error') {
                      commFn.errHandler(`"${info.file.name}" 檔案上傳失敗`);
                      setViewLoading(false);
                    }
                  }}
                  showUploadList={false}
                >
                  <Tooltip title="匯入檔案">
                    <UploadOutlined
                      className={`${styles.om_icon_style} ${styles.om_sp_m_lb}`}
                    />
                  </Tooltip>
                </Upload>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className={styles.om_sp_m_lb}
                  href={`${REACT_APP_PUBLIC_PATH}/#/misc/update`}
                >
                  新增其他授權
            </Button>
              </Col>
            </Row>

            <Row>
              <Col xs={24} md={16}>
                <span
                  className={styles.om_sp_m_rb}
                >
                  計算期別
            </span>
                <Select
                  style={{ width: 100 }}
                  className={styles.om_list_radios}
                  options={[
                    { value: '0', label: '不限' },
                    { value: '1', label: '詞曲結算' },
                    { value: '2', label: '錄音結算' },
                  ]}
                  value={phaseType}
                  onChange={changePhaseType}
                />
                <RangePicker
                  className={styles.om_sp_m_rb}
                  format="YYYY-MM"
                  picker="month"
                  allowClear={true}
                  value={(phaseDate && phaseDate.date) ? (phaseDate.date) : (null)}
                  onChange={changePhaseDate}
                />
                <span
                  className={styles.om_sp_m_rb}
                >
                  收款期別
                </span>
                <Input
                  style={{ width: '100px' }}
                  value={receivablePhase}
                  onChange={(value) => {
                    changeReceivablePhase(value);
                  }}
                />
              </Col>
              <Col xs={24} md={8}>
                <Pagination
                  className={styles.om_sp_m_lb}
                  style={{ textAlign: 'right' }}
                  current={pageCurrent}
                  pageSize={pageSize}
                  total={(list && list.total_cnt) && list.total_cnt}
                  onChange={changePage}
                  showSizeChanger={false}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24}>
                <PageHint
                  totalItems={(list && list.total_cnt) && list.total_cnt}
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
              <table className={styles.formTable}>
                <thead>
                  <tr>
                    <th>編號</th>
                    <th>產品名稱</th>
                    <th>&nbsp;</th>
                    <th>權利人</th>
                    <th>使用者</th>
                    <th>簽約日</th>
                    <th>合約開始</th>
                    <th>合約到期</th>
                    <th>收款期別</th>
                    <th style={{ width: '250px' }}>詞曲計算期別</th>
                    <th style={{ width: '250px' }}>錄音計算期別</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    (list && list.data_list && list.data_list.length > 0)
                      ? (
                        list.data_list.map((elem, idx) => (
                          <Fragment key={elem.id}>
                            <tr>
                              <td><Link to={`/misc/adv/${elem.id}`}>{elem.contract_code}</Link></td>
                              <td>
                                <p>
                                  {(elem.need_sign_back == '1') && (<span><CheckOutlined style={{ fontSize: '16px', color: '#60CB28' }} />&nbsp;</span>)}
                                  {elem.name}
                                </p>
                              </td>
                              <td>
                                <span onClick={() => {
                                  setDetailView((prev) => {
                                    let tmpArr = prev.slice();
                                    tmpArr[idx] = (tmpArr[idx] && tmpArr[idx].status) ? ({ data: [], status: false }) : ({ data: [], status: true });
                                    return tmpArr;
                                  });
                                }}>
                                  {
                                    (detailView && detailView[idx] && detailView[idx].status)
                                      ? (<MinusCircleOutlined style={{ fontSize: '20px' }} />)
                                      : (
                                        <PlusCircleOutlined
                                          style={{ fontSize: '20px' }}
                                          onClick={() => {
                                            getDetail(elem, idx);
                                          }}
                                        />
                                      )
                                  }
                                </span>
                              </td>
                              <td><p>{elem.holder_company_name}</p></td>
                              <td><p>{elem.user_company_id}</p></td>
                              <td>
                                <p>
                                  {(elem.is_exclusive == '1') && (<span className={styles.om_color_orange}>&#x25cf;&nbsp;</span>)}
                                  {elem.issued_date}
                                </p>
                              </td>
                              <td><p>{elem.start_date}</p></td>
                              <td><p
                                className={
                                  (elem.end_date && (new Date(elem.end_date) - new Date()) / 1000 / 60 / 60 / 24 < -1)
                                    ? (styles.om_color_red)
                                    : ('')
                                }
                              >{elem.end_date}</p></td>
                              <td><p>{elem.receivable_phase}</p></td>
                              <td><p>{elem.author_phase}</p></td>
                              <td><p>{elem.song_phase}</p></td>
                              <td>
                                <span onClick={() => {
                                  setDateView((prev) => {
                                    let tmpArr = prev.slice();
                                    tmpArr[idx] = (tmpArr[idx]) ? (false) : (true);
                                    return tmpArr;
                                  });
                                }}>
                                  {
                                    (dateView && dateView[idx])
                                      ? (<MinusCircleOutlined style={{ fontSize: '20px' }} />)
                                      : (<PlusCircleOutlined style={{ fontSize: '20px' }} />)
                                  }
                                </span>
                              </td>
                            </tr>
                            {
                              (dateView && dateView[idx]) && (
                                <tr>
                                  <td colSpan="9"><p>&nbsp;</p></td>
                                  <td>
                                    {phaseButtons(elem.id, 1)}
                                  </td>
                                  <td>
                                    {phaseButtons(elem.id, 2)}
                                  </td>
                                  <td><p>&nbsp;</p></td>
                                </tr>
                              )
                            }
                            {
                              (detailView && detailView[idx] && detailView[idx].status) && (
                                (detailView[idx].data && detailView[idx].data.length > 0)
                                  ? (
                                    detailView[idx].data.map((dElem, dIdx) => (
                                      <tr key={`detail_${dIdx}`}>
                                        <td colSpan="3"><p>&nbsp;</p></td>
                                        <td
                                          colSpan="2"
                                          style={{
                                            borderLeft: (dElem.type == '2')
                                              ? ('8px solid rgb(53, 139, 74)')
                                              : ('8px solid rgb(0, 109, 182)'),
                                            color: (dElem.type == '2')
                                              ? ('rgb(53, 139, 74)')
                                              : ('rgb(0, 109, 182)'),
                                            fontWeight: '700'
                                          }}
                                        >
                                          <p>{miscFn.converttypeIdToStr(dElem.type)}</p>
                                        </td>
                                        <td colSpan="2"><p>{dElem.name}</p></td>
                                        <td><p>{
                                          (dElem.type == '1')
                                            ? (dElem.song_name)
                                            : (dElem.contract_author_code)
                                        }</p></td>
                                        <td><p>{
                                          (dElem.type == '1')
                                            ? (dElem.isrc)
                                            : (
                                              (dElem.contract_author_subcontract_code)
                                                ? (`(${dElem.contract_author_subcontract_code})`)
                                                : ('')
                                            )
                                        }</p></td>
                                        <td colSpan="3"><p>&nbsp;</p></td>
                                      </tr>
                                    ))
                                  )
                                  : (
                                    <tr>
                                      <td colSpan="3"><p>&nbsp;</p></td>
                                      <td colSpan="9"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></td>
                                    </tr>
                                  )
                              )
                            }
                          </Fragment>
                        ))
                      )
                      : (
                        <tr>
                          <td colSpan="10">
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                          </td>
                        </tr>
                      )
                  }
                </tbody>
              </table>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    </Spin>
  );
}

export default connect(({ settlePhaseList, miscList, loading }) => ({
  settlePhaseList,
  miscList,
  loading: loading.models.miscList,
}))(misc);
