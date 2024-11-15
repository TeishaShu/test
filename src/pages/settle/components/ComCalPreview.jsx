import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Pagination,
  Alert,
  Spin,
  Select,
  Empty,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Link, connect, history } from 'umi';
import styles from '@/style/style.less';
import globalSettings from '@/fn/globalsettings';
import commFn from '@/fn/comm';
import valid from '@/fn/valid';

const { Option } = Select;

const ComCalPreview = props => {
  const {
    uiType,
    pageId,
    pageSouvId,
    dispatch,
    loadingEnterprise,
    loadingSettlePhase,
    loadingSettleSouvenir,
    loadingSettleReport,
    enterpriseList,
    settlePhaseList,
    settleSouvenirList,
    settleReportList: { optSettleType, reportOpts, optSettleCountry, calculationPreview },
  } = props;
  const pageSize = globalSettings.pageSize;
  const [isInit, setIsInit] = useState(true);
  const [settleType, setSettleType] = useState('tw');
  const [albumCode, setAlbumCode] = useState('');
  const [songName, setSongName] = useState('');
  const [payAuthor, setPayAuthor] = useState('');
  const [payCompany, setPayCompany] = useState('');
  const [authArea, setAuthArea] = useState('');
  const [pageCurrent, setPageCurrent] = useState(1);

  // api -----
  // getOptions
  const getOptions = (val) => {
    if (val == 'suv') {
      dispatch({
        type: 'settleSouvenirList/fetchMultiGetAuthorOpt',
        payload: {
          agent_eid: enterpriseList.agent_eid,
          ui_page_souv_id: pageSouvId,
          settle_phase_start: '',
          settle_phase_end: '',
          author_id: '',
          souvenir_code: '',
          page_current: '',
        },
      });
    } else {
      dispatch({
        type: 'settleReportList/fetchMultiGetReportOpts',
        payload: {
          agent_eid: enterpriseList.agent_eid,
          settle_type: uiType,
          ui_settle_phase_type: (uiType == 'righ') ? ('1') : ('2'),
          ui_page_id: pageId,
          settle_phase_start: '',
          settle_phase_end: '',
          search_type: val,
        },
      });
    }
  }

  // getData
  const getData = (obj) => {
    let tmpCurrentPage = (obj && obj.pageCurrent) ? (obj.pageCurrent) : pageCurrent;

    setIsInit(false);

    if (settleType == 'suv') {
      dispatch({
        type: 'settleSouvenirList/fetchMultiGetTempReport',
        payload: {
          agent_eid: enterpriseList.agent_eid,
          ui_page_souv_id: pageSouvId,
          settle_phase_start: '',
          settle_phase_end: '',
          author_id: (payAuthor) ? (payAuthor) : (undefined),
          souvenir_code: (albumCode) ? (albumCode) : (undefined),
          page_current: tmpCurrentPage,
        },
      });
    } else {
      dispatch({
        type: 'settleReportList/fetchMultiGetCalculationPreview',
        payload: {
          ui_settle_phase_type: (uiType == 'righ') ? ('1') : ('2'),
          ui_page_id: pageId,
          agent_eid: enterpriseList.agent_eid,
          settle_type: uiType,
          settle_phase_start: '',
          settle_phase_end: '',
          search_type: settleType,
          album_code: albumCode,
          song_name: songName,
          pay_company: payCompany,
          pay_author: payAuthor,
          auth_area: (settleType == 'misc') ? ('') : (authArea),
          page_current: tmpCurrentPage,
          page_size: pageSize,
        },
      });
    }
  }

  // mount
  useEffect(() => {
    changeSettleType('tw');
  }, [pageId]);

  // ui -----
  // changeSettleType
  const changeSettleType = (val) => {
    setIsInit(true);
    setPageCurrent(1);
    setSettleType(val);
    setAlbumCode('');
    setSongName('');
    setPayAuthor('');
    setPayCompany('');
    setAuthArea('');
    getOptions(val);
  }

  // totalNum
  const totalNum = () => {
    if (settleType == 'suv') {
      return (!isInit && settleSouvenirList.tempReport && settleSouvenirList.tempReport.summary && settleSouvenirList.tempReport.summary.total_items) ? (settleSouvenirList.tempReport.summary.total_items) : '0';
    } else {
      return (!isInit && calculationPreview && calculationPreview.total_items) ? (calculationPreview.total_items) : '0';
    }
  }

  // showColumn
  const showColumn = (colName) => {
    const obj = { display: 'none' };
    const columns = {
      eachservice: ['new_media'],
      song_right: ['tw', 'ext', 'os', 'exception', 'new_media', 'misc'],
      split_ratio: ['tw', 'ext', 'os', 'exception', 'new_media', 'misc'],
      auth_area: ['os', 'exception', 'new_media'],
      settle_value: ['tw', 'ext', 'os', 'exception'],
      before_tax: ['tw', 'ext', 'os', 'exception'],
      currency: ['os', 'exception', 'misc'],
      after_tax: ['tw', 'ext', 'os', 'exception'],
    };

    if (settleType && colName && columns[colName].includes(settleType)) {
      if (uiType == 'reco' && (colName == 'song_right' || colName == 'split_ratio')) {
        obj.display = 'none';
      } else {
        obj.display = 'table-cell';
      }

      return obj;
    }

    return obj;
  }

  // emptyData
  const emptyData = (num) => (
    <tr>
      <td colSpan={num}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </td>
    </tr>
  );

  return (
    <Spin
      tip="Loading..."
      spinning={loadingEnterprise || loadingSettlePhase || loadingSettleSouvenir || loadingSettleReport}
    >
      <PageHeaderWrapper
        title="計算預覽"
        content={
          (settleType == 'suv')
            ? (`計算期別：${(settlePhaseList.phaseList && settlePhaseList.phaseList.filter((elem) => elem.id == pageSouvId).length > 0) ? (settlePhaseList.phaseList.filter((elem) => elem.id == pageSouvId)[0]['phase']) : pageSouvId}`)
            : (`計算期別：${(settlePhaseList.phaseList && settlePhaseList.phaseList.filter((elem) => elem.id == pageId).length > 0) ? (settlePhaseList.phaseList.filter((elem) => elem.id == pageId)[0]['phase']) : pageId}`)
        }
      >
        <Form
          layout="vertical"
        >
          <Card bordered={false}>
            <Row>
              <Col xs={3}>
                <Form.Item
                  label="計算型態"
                  className={styles.om_p_r}
                >
                  <Select
                    options={
                      (uiType == 'righ')
                        ? (optSettleType.filter((elem) => elem.value != 'suv'))
                        : (optSettleType.filter((elem) => elem.value != 'exception'))
                    }
                    value={settleType}
                    onChange={(val) => {
                      changeSettleType(val);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={3}>
                <Form.Item
                  label="產品編號"
                  className={styles.om_p_r}
                >
                  <Input
                    placeholder="請輸入"
                    value={albumCode}
                    onChange={(e) => {
                      setAlbumCode(e.target.value);
                    }}
                  />
                </Form.Item>
              </Col>

              <Col
                xs={3}
                style={{ display: (settleType != 'suv') ? ('block') : ('none') }}
              >
                <Form.Item
                  label="歌曲名稱"
                  className={styles.om_p_r}
                >
                  <Input
                    placeholder="請輸入"
                    value={songName}
                    onChange={(e) => {
                      setSongName(e.target.value);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={3}
                style={{ display: 'block' }}
              >
                <Form.Item
                  label={(uiType == 'righ') ? '作者' : '表演者'}
                  className={styles.om_p_r}
                >
                  <Select
                    value={payAuthor}
                    options={
                      (settleType != 'suv')
                        ? (
                          (reportOpts.author_list)
                            ? ([{ value: '', label: '不限' }, ...reportOpts.author_list.map((elem) => ({ value: elem, label: elem }))])
                            : ([])
                        )
                        : ([{ value: '', label: '不限' }, ...settleSouvenirList.authOpt.map((elem) => ({ value: elem.author_id, label: elem.author_name }))])
                    }
                    onChange={(val) => {
                      setPayAuthor(val);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={3}
                style={{ display: (settleType != 'suv') ? ('block') : ('none') }}
              >
                <Form.Item
                  label="公司"
                  className={styles.om_p_r}
                >
                  <Select
                    value={payCompany}
                    options={
                      (settleType != 'suv')
                        ? (
                          (reportOpts.company_list)
                            ? ([{ value: '', label: '不限' }, ...reportOpts.company_list.map((elem) => ({ value: elem, label: elem }))])
                            : ([{ value: '', label: '不限' }])
                        )
                        : ([])
                    }
                    onChange={(val) => {
                      setPayCompany(val);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={3}
                style={{ display: (settleType != 'suv' && settleType != 'misc') ? ('block') : ('none') }}
              >
                <Form.Item
                  label="地區"
                  className={styles.om_p_r}
                >
                  <Select
                    value={authArea}
                    options={optSettleCountry}
                    onChange={(val) => {
                      setAuthArea(val);
                    }}
                  />

                </Form.Item>
              </Col>
              <Col xs={3}>
                <Form.Item
                  label=" "
                >
                  <Button
                    type="primary"
                    onClick={() => {
                      setPageCurrent(1);
                      getData({ pageCurrent: 1 });
                    }}
                  >
                    查詢
                </Button>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col
                xs={12}
                style={{ display: (settleType == 'suv' && payAuthor) ? ('none') : ('block') }}
              >
                <div className={styles.hintMargin}>
                  <Alert
                    message={`共 ${totalNum()} 筆結算資料`}
                    type="info"
                    style={{
                      marginTop: '8px',
                      marginBottom: '8px'
                    }}
                  />
                </div>
              </Col>
              <Col
                xs={(settleType == 'suv' && payAuthor) ? (24) : (12)}
                style={{ textAlign: 'right' }}
              >
                <Pagination
                  style={{ margin: '8px 0' }}
                  current={pageCurrent}
                  pageSize={pageSize}
                  total={parseInt(totalNum())}
                  onChange={(val) => {
                    setPageCurrent(val);
                    getData({ pageCurrent: val });
                  }}
                  showSizeChanger={false}
                />
              </Col>
            </Row>
            <Row>
              <Col
                xs={24}
                className={styles.om_overflow_auto}
              >
                {
                  (settleType != 'suv') && (
                    <table className={styles.formTable}>
                      <thead>
                        <tr>
                          <th className={styles.om_bg_white} colSpan="4">&nbsp;</th>
                          <th className={styles.om_bg_white} style={showColumn('eachservice')}>&nbsp;</th>
                          <th className={styles.om_bg_white}>&nbsp;</th>
                          <th className={styles.om_bg_white}>&nbsp;</th>
                          <th className={styles.om_bg_white}>&nbsp;</th>
                          <th className={styles.om_bg_white} style={showColumn('song_right')}>&nbsp;</th>
                          <th className={styles.om_bg_white} style={showColumn('split_ratio')}>&nbsp;</th>
                          <th className={styles.om_bg_white} style={showColumn('auth_area')}>&nbsp;</th>
                          <th className={styles.om_bg_white} style={showColumn('settle_value')}>&nbsp;</th>
                          <th className={styles.om_bg_white} style={showColumn('currency')}>&nbsp;</th>
                          <th className={styles.om_bg_white} style={showColumn('before_tax')}>&nbsp;</th>
                          <th className={`${styles.om_bg_blue} ${styles.om_color_red}`}>
                            {`$${(!isInit && calculationPreview.royalty_total) ? (calculationPreview.royalty_total) : (0)}`}
                          </th>
                          <th className={styles.om_bg_white}>&nbsp;</th>
                          <th className={`${styles.om_bg_blue} ${styles.om_color_red}`}>
                            {`$${(!isInit && calculationPreview.should_paid_total) ? (calculationPreview.should_paid_total) : (0)}`}
                          </th>
                          <th className={styles.om_bg_white}>&nbsp;</th>
                        </tr>
                        <tr>
                          <th>產品編號</th>
                          <th>產品名稱</th>
                          <th>歌名</th>
                          <th>使用者</th>
                          <th style={showColumn('eachservice')}>平台服務</th>
                          <th>合約</th>
                          <th>型態</th>
                          <th>{(uiType == 'righ') ? '作者' : '表演者'}</th>
                          <th style={showColumn('song_right')}>權利</th>
                          <th style={showColumn('split_ratio')}>比例</th>
                          <th style={showColumn('auth_area')}>授權地區</th>
                          <th style={showColumn('settle_value')}>{(uiType == 'righ') ? '結算數量' : '銷售數量'}</th>
                          <th style={showColumn('currency')}>收入幣別</th>
                          <th style={showColumn('before_tax')}>批發價</th>
                          <th>版稅(台幣)</th>
                          <th>扣佣(%)</th>
                          <th>應付</th>
                          <th>&nbsp;</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          (!isInit && calculationPreview && calculationPreview.data && calculationPreview.data.length > 0)
                            ? (calculationPreview.data.map((elem, idx) => (
                              <tr key={idx}>
                                <td><p>{elem.product_code}</p></td>
                                <td><p>{elem.product_name}</p></td>
                                <td><p>{elem.song_name}</p></td>
                                <td><p>{elem.user}</p></td>
                                <td style={showColumn('eachservice')}><p>{elem.eachservice}</p></td>
                                <td><p>{(elem.subcontract_code) ? (`${elem.subcontract_code} (子約)`) : (elem.contract_code)}</p></td>
                                <td><p>{elem.product_type}</p></td>
                                <td><p>{elem.author_name}</p></td>
                                <td style={showColumn('song_right')}><p>{elem.song_right}</p></td>
                                <td style={showColumn('split_ratio')}><p>{elem.split_ratio}</p></td>
                                <td style={showColumn('auth_area')}><p>{elem.auth_area}</p></td>
                                <td style={showColumn('settle_value')}><p>{elem.settle_value}</p></td>
                                <td style={showColumn('currency')}><p>{elem.currency}</p></td>
                                <td style={showColumn('before_tax')}>{elem.before_tax}</td>
                                <td>{elem.royalty}</td>
                                <td>{elem.commission}</td>
                                <td>{elem.should_paid}</td>
                                <td>{(elem.file_name) ? (elem.file_name) : (elem.file_name)}</td>
                              </tr>
                            )))
                            : (emptyData('18'))
                        }
                      </tbody>
                    </table>
                  )
                }
                {
                  (settleType == 'suv') && (
                    <table className={styles.formTable}>
                      <thead>
                        {
                          (!payAuthor) && (
                            <tr>
                              <th
                                className={styles.om_bg_white}
                                colSpan="8"
                              >&nbsp;</th>
                              <th className={`${styles.om_bg_blue} ${styles.om_color_red}`}>
                                {`$${(!isInit && settleSouvenirList.tempReport && settleSouvenirList.tempReport.summary && settleSouvenirList.tempReport.summary.total_payment) ? (settleSouvenirList.tempReport.summary.total_payment) : (0)}`}
                              </th>
                              <th
                                className={styles.om_bg_white}
                                colSpan="3"
                              >&nbsp;</th>
                            </tr>
                          )
                        }
                        <tr>
                          <th>產品編號</th>
                          <th>產品名稱</th>
                          <th>產品型態</th>
                          <th>售價(未稅)</th>
                          <th>銷售數量</th>
                          <th>合約</th>
                          <th>藝名</th>
                          <th>share(%)</th>
                          <th>佔有比例</th>
                          <th>應付版稅</th>
                          <th>收入期別</th>
                          <th>藝人合約</th>
                          <th>&nbsp;</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          (!isInit && settleSouvenirList.tempReport && settleSouvenirList.tempReport.data_list && settleSouvenirList.tempReport.data_list.length > 0)
                            ? (settleSouvenirList.tempReport.data_list.map((elem, idx) => (
                              <tr key={idx}>
                                <td><p>{elem.souvenir_code}</p></td>
                                <td><p>{elem.souvenir_name}</p></td>
                                <td><p>{elem.souvenir_type}</p></td>
                                <td><p>{elem.before_tax}</p></td>
                                <td><p>{elem.quantity}</p></td>
                                <td><p>{elem.contract_code}</p></td>
                                <td><p>{elem.author_stage_name}</p></td>
                                <td><p>{elem.share}</p></td>
                                <td><p>{elem.ratio}</p></td>
                                <td><p>{elem.payment}</p></td>
                                <td><p>{elem.data_phase}</p></td>
                                <td><p>{elem.contract_author_code}</p></td>
                                <td><p>{elem.note}</p></td>
                              </tr>
                            )))
                            : (emptyData('13'))
                        }
                      </tbody>
                    </table>
                  )
                }
              </Col>
            </Row>
          </Card>
        </Form>
      </PageHeaderWrapper>
    </Spin >
  );
}

// export default cal_preview;
export default connect(({ enterpriseList, settlePhaseList, settleSouvenirList, settleReportList, loading }) => ({
  enterpriseList,
  settlePhaseList,
  settleSouvenirList,
  settleReportList,
  loadingEnterprise: loading.models.enterpriseList,
  loadingSettlePhase: loading.models.settlePhaseList,
  loadingSettleSouvenir: loading.models.settleSouvenirList,
  loadingSettleReport: loading.models.settleReportList,
}))(ComCalPreview);