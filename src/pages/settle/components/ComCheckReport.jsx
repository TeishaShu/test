import React, { useState, useEffect, Fragment } from 'react';
import {
  Button,
  Modal,
  Spin,
  Card,
  Row,
  Col,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import ComDescription from './ComDescription';
import ComCheckReportInfoSheet from './ComCheckReportInfoSheet';
import ComCheckReportInfoNotOursTable from './ComCheckReportInfoNotOursTable';
import ComCheckReportInfoNotCalTable from './ComCheckReportInfoNotCalTable';
import styles from '@/style/style.less';
import globalSettings from '@/fn/globalsettings';
import commFn from '@/fn/comm';

export const ComCheckReport = props => {
  const {
    loading,
    dispatch,
    enterpriseList,
    settlePhaseList,
    settleMediaList: { checkReport, sheetList },
    uiType,
    uiIsApple,   // optional: true, false
    currentStep,
    setCurrentStep,
  } = props;
  const { confirm } = Modal;
  const pageSize = globalSettings.pageSize;
  // notOursPageCurrent
  const [notOursPageCurrent, setNotOursPageCurrent] = useState(1);
  // notCalPageCurrent
  const [notCalPageCurrent, setNotCalPageCurrent] = useState(1);
  // viewLoading
  const [viewLoading, setViewLoading] = useState(false);

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'settleMediaList/fetchMultiGetCheckReport',
      payload: {
        agent_eid: enterpriseList.agent_eid,
        file_list_id: (currentStep.list.detail)
          ? ([currentStep.list.file_list_id, ...currentStep.list.detail.map((elem) => (elem.settle_file_id))])
          : (currentStep.list.file_list_id),
        company_media_id: currentStep.list.company_media_id,
        uiIsApple: uiIsApple,
      },
    });
  }

  // getNotOursData
  const getNotOursData = (obj) => {
    dispatch({
      type: 'settleMediaList/fetchGetSongList',
      payload: {
        agent_eid: enterpriseList.agent_eid,
        file_list_id: (currentStep.list.detail)
          ? ([currentStep.list.file_list_id, ...currentStep.list.detail.map((elem) => (elem.settle_file_id))])
          : (currentStep.list.file_list_id),
        company_media_id: currentStep.list.company_media_id,
        search_type: 'not_ours',
        page_current: obj && obj.pageCurrent !== undefined ? obj.pageCurrent.toString() : notCalPageCurrent.toString(),
        page_size: pageSize,
      },
    });
  }

  // getNotCalData
  const getNotCalData = (obj) => {
    dispatch({
      type: 'settleMediaList/fetchGetSongList',
      payload: {
        agent_eid: enterpriseList.agent_eid,
        file_list_id: (currentStep.list.detail)
          ? ([currentStep.list.file_list_id, ...currentStep.list.detail.map((elem) => (elem.settle_file_id))])
          : (currentStep.list.file_list_id),
        company_media_id: currentStep.list.company_media_id,
        search_type: 'not_settle',
        page_current: obj && obj.pageCurrent !== undefined ? obj.pageCurrent.toString() : notCalPageCurrent.toString(),
        page_size: pageSize,
      },
    });
  }

  // mount, update id
  useEffect(() => {
    getData();
  }, []);

  // downloadCheckReport
  const downloadCheckReport = () => {
    let downloadObj = {
      agent_eid: enterpriseList.agent_eid,
      settle_phase_id: (currentStep.list) ? (currentStep.list.settle_phase_id) : (null),
      download_list: [
        {
          file_list_id: (currentStep.list.detail)
            ? ([currentStep.list.file_list_id, ...currentStep.list.detail.map((elem) => (elem.settle_file_id))])
            : (currentStep.list.file_list_id),
          company_media_id: currentStep.list.company_media_id,
        }
      ]
    };
    let defaultFileName = '';

    setViewLoading(true);

    defaultFileName += (currentStep.list && currentStep.list.ui_phase_code) ? (currentStep.list.ui_phase_code) : ('');

    defaultFileName += '_新媒體' + (uiType == 'righ' ? '詞曲' : '錄音') + '版稅檢核表_' + commFn.getNowTime();

    commFn.postDownloadFile(`${window.FRONTEND_WEB}/settle_media_calculate_check/download_check_report`, downloadObj, defaultFileName, 'xlsx').then(() => {
      setViewLoading(false);
    });
  }

  // changeCheckStatus
  const changeCheckStatus = () => {
    dispatch({
      type: 'settleMediaList/fetchChangeCheckStatus',
      payload: {
        agent_eid: enterpriseList.agent_eid,
        file_list_id: (currentStep.list.detail)
          ? ([currentStep.list.file_list_id, ...currentStep.list.detail.map((elem) => (elem.settle_file_id))])
          : (currentStep.list.file_list_id),
        company_media_id: currentStep.list.company_media_id,
      },
      callback: (result) => {
        if (result != '' && result != 'error') {
          if (uiType == 'righ') {
            setCurrentStep({ step: 0, list: {} });
          } else {
            setCurrentStep((prev) => ({ ...prev, step: prev.step.replace(/[0-9]/g, '') + '0' }));
          }
        }
      }
    });
  }

  // ui -----
  // PageHeaderWrapper(extra) - buttonsList
  const buttonsList = (
    <div>
      <Button onClick={() => {
        if (uiType == 'righ') {
          setCurrentStep({ step: 0, list: {} });
        } else {
          setCurrentStep((prev) => ({ ...prev, step: prev.step.replace(/[0-9]/g, '') + '0' }));
        }
      }}>{(uiType == 'righ') ? '詞曲' : '錄音'}新媒體清單</Button>
      <Button
        className={styles.om_sp_m_lb}
        onClick={() => {
          downloadCheckReport();
        }}>匯出</Button>
      <Button
        type="primary"
        className={styles.om_sp_m_lb}
        disabled={(currentStep && currentStep.list && currentStep.list.check_status == '2') ? true : false}
        onClick={() => {
          changeCheckStatus();
        }}
      >{
          (currentStep && currentStep.list && currentStep.list.check_status == '2')
            ? ('已稽核')
            : ('稽核完畢')
        }</Button>
    </div>
  );

  return (
    <Spin
      tip="Loading..."
      spinning={loading || viewLoading}
    >
      <PageHeaderWrapper
        className={styles.pageHeaderWrapper}
        title={`${(uiType == 'righ') ? '詞曲' : '錄音'}新媒體檢核表 - ${(currentStep && currentStep.list && currentStep.list.company_media) ? (currentStep.list.company_media) : ('')}`}
        extra={buttonsList}
        content={
          <ComDescription
            data={currentStep.list}
            phaseList={
              (currentStep.list)
                ? ({ phase: currentStep.list.ui_phase })
                : (null)
            }
            isAdvInfo={true}
            uiIsApple={uiIsApple}
          />
        }
      >
        <Card
          bordered={false}
          className={`${styles.titleNoBBd}`}
        >
          <Row gutter={[8, 0]}>
            <Col
              xs={24}
              className={styles.om_overflow_auto}
            >
              {
                (uiType == 'righ')
                  ? (
                    <table className={styles.formTable}>
                      <thead>
                        <tr>
                          <th>幣別</th>
                          <th className={styles.om_bd_l_dot}>A. 報表金額</th>
                          <th>B. 讀入金額(未稅)</th>
                          <th className={styles.om_bd_l_dot}>C. 計算金額</th>
                          <th className={`${styles.om_bg_yellow} ${styles.om_bd_l_dot}`}>非我方權利</th>
                          <th className={styles.om_bg_yellow}>新媒體不計算</th>
                          <th className={styles.om_bg_yellow}>D. 結算金額</th>
                          <th className={styles.om_bd_l_dot}>差額(B-D)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          (checkReport && checkReport.length > 0 && checkReport[0]) && (
                            <Fragment>
                              {
                                (checkReport[0].currency_id != '1') && (
                                  <tr>
                                    <td><p>{checkReport[0].currency_name}&nbsp;</p></td>
                                    <td className={styles.om_bd_l_dot}><p>{checkReport[0].report_origin}</p></td>
                                    <td><p>{checkReport[0].income_origin}</p></td>
                                    <td className={styles.om_bd_l_dot}><p>&nbsp;</p></td>
                                    <td className={styles.om_bd_l_dot}><p>&nbsp;</p></td>
                                    <td><p>&nbsp;</p></td>
                                    <td><p>&nbsp;</p></td>
                                    <td className={styles.om_bd_l_dot}><p>&nbsp;</p></td>
                                  </tr>
                                )
                              }
                              <tr>
                                <td><p>台幣</p></td>
                                <td className={styles.om_bd_l_dot}><p>{checkReport[0].report_tw}</p></td>
                                <td><p>{checkReport[0].import_tw}</p></td>
                                <td className={styles.om_bd_l_dot}><p>{checkReport[0].calculate_tw}</p></td>
                                <td className={styles.om_bd_l_dot}><p>{checkReport[0].not_our_rights_tw}</p></td>
                                <td><p>{checkReport[0].not_settle_tw}</p></td>
                                <td><p>{checkReport[0].settle_tw}</p></td>
                                <td className={`${styles.om_bd_l_dot} ${styles.om_color_red}`}><p>{checkReport[0].difference}</p></td>
                              </tr>
                            </Fragment>
                          )
                        }
                      </tbody>
                    </table>
                  )
                  : (
                    <table className={styles.formTable}>
                      <thead>
                        <tr>
                          <th>幣別</th>
                          <th className={styles.om_bd_l_dot}>A. 報表金額</th>
                          <th>B. 讀入金額(未稅)</th>
                          <th className={styles.om_bd_l_dot}>非我方權利</th>
                          <th>C. 計算金額</th>
                          <th className={styles.om_bd_l_dot}>不計算</th>
                          <th>部分未拆</th>
                          <th className={`${styles.om_bd_l_dot} ${styles.om_bg_yellow}`}>部分分拆</th>
                          <th className={styles.om_bg_yellow}>完整分拆</th>
                          <th className={styles.om_bg_yellow}>D. 結算金額</th>
                          <th className={styles.om_bd_l_dot}>差額(B-D)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          (checkReport && checkReport.length > 0 && checkReport[0]) && (
                            <Fragment>
                              {
                                (checkReport[0].currency_id != '1') && (
                                  <tr>
                                    <td><p>{checkReport[0].currency_name}&nbsp;</p></td>
                                    <td className={styles.om_bd_l_dot}><p>{checkReport[0].report_origin}</p></td>
                                    <td><p>{checkReport[0].income_origin}</p></td>
                                    <td className={styles.om_bd_l_dot}>&nbsp;</td>
                                    <td><p>&nbsp;</p></td>
                                    <td className={styles.om_bd_l_dot}><p>&nbsp;</p></td>
                                    <td><p>&nbsp;</p></td>
                                    <td className={styles.om_bd_l_dot}><p>&nbsp;</p></td>
                                    <td><p>&nbsp;</p></td>
                                    <td><p>&nbsp;</p></td>
                                    <td className={styles.om_bd_l_dot}><p>&nbsp;</p></td>
                                  </tr>
                                )
                              }
                              <tr>
                                <td><p>台幣</p></td>
                                <td className={styles.om_bd_l_dot}><p>{checkReport[0].report_tw}</p></td>
                                <td><p>{checkReport[0].import_tw}</p></td>
                                <td className={styles.om_bd_l_dot}><p>{checkReport[0].not_our_rights_tw}</p></td>
                                <td><p>{checkReport[0].calculate_tw}</p></td>
                                <td className={styles.om_bd_l_dot}><p>{checkReport[0].not_settle_tw}</p></td>
                                <td><p>{checkReport[0].part_not_split_tw}</p></td>
                                <td className={styles.om_bd_l_dot}><p>{checkReport[0].part_split_tw}</p></td>
                                <td><p>{checkReport[0].complete_split_tw}</p></td>
                                <td><p>{checkReport[0].settle_tw}</p></td>
                                <td className={`${styles.om_bd_l_dot} ${styles.om_color_red}`}><p>{checkReport[0].difference}</p></td>
                              </tr>
                            </Fragment>
                          )
                        }
                      </tbody>
                    </table>
                  )
              }

            </Col>
          </Row>
        </Card>
        {
          (!uiIsApple) && (
            <Card
              bordered={false}
              className={`${styles.card} ${styles.titleNoBBd} ${styles.cardTopSpace}`}
            >
              <Row gutter={[8, 0]}>
                <Col
                  xs={24}
                  style={{ marginTop: '-10px' }}
                >
                  {
                    (sheetList) && (
                      sheetList.map((elem, idx) => (
                        <ComCheckReportInfoSheet
                          key={`reportInfo_${idx}`}
                          index={idx}
                          data={elem}
                        />
                      ))
                    )
                  }
                </Col>
              </Row>
            </Card>
          )
        }
        <ComCheckReportInfoNotOursTable
          uiType={uiType}
          color="rgb(79, 79, 79)"
          notOursPageCurrent={notOursPageCurrent}
          setNotOursPageCurrent={setNotOursPageCurrent}
          getNotOursData={getNotOursData}
        />
        <ComCheckReportInfoNotCalTable
          uiType={uiType}
          color="rgb(0, 109, 184)"
          notCalPageCurrent={notCalPageCurrent}
          setNotCalPageCurrent={setNotCalPageCurrent}
          getNotCalData={getNotCalData}
        />
      </PageHeaderWrapper>
    </Spin>
  );
}

export default connect(({ enterpriseList, settlePhaseList, settleMediaList, loading }) => ({
  enterpriseList,
  settlePhaseList,
  settleMediaList,
  loading: loading.models.settleMediaList,
}))(ComCheckReport);