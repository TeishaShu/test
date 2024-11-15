import React, { useState, useEffect, Fragment } from 'react';
import globalSettings from '@/fn/globalsettings';
import { CalculatorOutlined, FileTextOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Card,
  Spin,
  Tooltip,
  Button,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Link, connect, history } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import ComSettlement from '@/pages/settle/components/ComSettlement';


export const Step2 = props => {
  const {
    selectSettlePhaseId,
    selectSouvSettlePhaseId,
    selectNewmediaRecPhaseId,
    settlePhaseList,
    enterpriseList: { agent_eid },
    settleAlbumList: { calcList, settleRecoState, ui_settleRecoState, settleRecoChangeId },
    dispatch,
    setViewLoading,
  } = props;
  const cusStyles = {
    table: {
      width: '100%',
      margin: '0 50px'
    },
    subTitle: {
      marginLeft: '-15px'
    }
  };
  const uiType = 'reco';

  // api -----
  // getData
  const getData = () => {
    // 2-1. 計算
    dispatch({
      type: 'settleAlbumList/fetchMultiGetCalcList',
      payload: {
        agent_eid: agent_eid,
        settle_type: uiType,
        settle_phase_id: selectSettlePhaseId,
        // souv_settle_phase_id: selectSouvSettlePhaseId
      },
    });
    // get 預付與代結算
    dispatch({
      type: 'settleAlbumList/fetchGetSettleRecoState',
      payload: {
        agent_eid: agent_eid,
      }
    })
  }

  // change settle phase
  useEffect(() => {
    getData();
  }, [selectSettlePhaseId]);

  // change settle reoc
  useEffect(() => {
    getData();
  }, [settleRecoChangeId]);

  // mount
  useEffect(() => {
    getData();
  }, []);


  // cleanAll
  const cleanAll = () => {
    let tmpDate = convertPhaseDate();

    dispatch({
      type: 'settleReportList/fetchCleanAll',
      payload: {
        agent_eid: agent_eid,
        settle_type: uiType,
        settle_phase_start: tmpDate[0],
        settle_phase_end: tmpDate[1],
      },
      callback: (result) => {
        if (result != '' && result != 'error') {
          getData();
        }
      }
    });
  }

  // calAlbum
  const calAlbum = (albumType) => {
    dispatch({
      type: 'settleAlbumList/fetchCalAlbum',
      payload: {
        agent_eid: agent_eid,
        settle_phase_id: selectSettlePhaseId,
        settle_type: uiType,
        settle_origin: albumType
      },
      callback: (result) => {
        if (result != '' && result != 'error') {
          getData();
        }
      }
    });
  }

  // calMisc
  const calMisc = () => {
    dispatch({
      type: 'settleAlbumList/fetchCalMisc',
      payload: {
        agent_eid: agent_eid,
        phase_type: '2',
        phase_id: selectSettlePhaseId,
      },
      callback: (result) => {
        if (result != '' && result != 'error') {
          getData();
        }
      }
    });
  }

  // calSouv
  const calSouv = () => {
    let tmpSuvObj = (settlePhaseList.souvenir.current) ? (settlePhaseList.souvenir.current) : {};

    dispatch({
      type: 'settleSouvenirList/fetchCalculation',
      payload: {
        agent_eid: agent_eid,
        settle_phase_start: (tmpSuvObj.phase_start) ? (tmpSuvObj.phase_start) : (''),
        settle_phase_end: (tmpSuvObj.phase_end) ? (tmpSuvObj.phase_end) : (''),
      },
      callback: (result) => {
        if (result != '' && result != 'error') {
          getData();
        }
      }
    });
  }

  // calMedia
  const calMedia = () => {
    let tmpDate = convertPhaseDate();

    dispatch({
      type: 'settleMediaList/fetchCalMedia',
      payload: {
        agent_eid: agent_eid,
        settle_type: uiType,
        settle_phase_start: tmpDate[0],
        settle_phase_end: tmpDate[1],
      },
      callback: (result) => {
        if (result != '' && result != 'error') {
          getData();
        }
      }
    });
  }

  // ui -----
  // convertPhaseDate
  const convertPhaseDate = () => {
    let tmpSettlePhaseList = (settlePhaseList.phaseList) ? (settlePhaseList.phaseList.filter((elem) => elem.id == selectSettlePhaseId)) : ([]);
    let tmpSettlePhaseStart = '';
    let tmpSettlePhaseEnd = '';

    if (tmpSettlePhaseList.length > 0) {
      tmpSettlePhaseStart = tmpSettlePhaseList[0]['phase_start'];
      tmpSettlePhaseEnd = tmpSettlePhaseList[0]['phase_end'];
    }

    return ([tmpSettlePhaseStart, tmpSettlePhaseEnd]);
  }

  // 預付與代結算
  const settleData = [
    {
      title: '代結算拆分報表',
      data: (settleRecoState.length > 0) && (settleRecoState.map(p => (p.state === 1) ? p.created_at : '')),
      isApply: (ui_settleRecoState.state === 0) ? true : false,
      hadDelete: (ui_settleRecoState.state > 0) ? true : false,
    },
    {
      title: '合約預付扣抵',
      data: (settleRecoState.length > 0) && (settleRecoState.map(p => (p.state === 2) ? p.created_at : '')),
      isApply: (ui_settleRecoState.state === 1) ? true : false,
      hadDelete: (ui_settleRecoState.state > 1) ? true : false,
    }
  ];

  // 套用-代結算拆分報表
  const recoApplyReplaceSettlement = () => {
    let tmpDate = convertPhaseDate();
    dispatch({
      type: 'settleAlbumList/fetchRecoApplyReplaceSettlement',
      payload: {
        "agent_eid": agent_eid,
        "settle_phase_start": tmpDate[0],
        "settle_phase_end": tmpDate[1]
      },
    })
  }

  // 刪除-代結算拆分報表
  const recoUnapplyReplaceSettlement = () => {
    dispatch({
      type: 'settleAlbumList/fetchRecoUnapplyReplaceSettlement',
      payload: {
        "agent_eid": agent_eid,
      },
    })
  }

  return (
    <Card bordered={false}>
      <Row>
        <Col
          xs={12}
        >
          <p>2-1. 計算</p>
        </Col>
        <Col
          xs={12}
          className={styles.om_txt_align_r}
        >
          <Button
            className={styles.om_sp_m_lb}
            onClick={() => { cleanAll(); }}
          >
            清除全部
          </Button>
          <Button
            type="primary"
            className={styles.om_sp_m_lb}
            onClick={() => {
              window.open(`${REACT_APP_PUBLIC_PATH}/#/settle/record/list/cal_preview/recphase/${selectSettlePhaseId}/souphase/${selectSouvSettlePhaseId}`, '_blank');
            }}
          >
            計算預覽
          </Button>
        </Col>
      </Row>
      <Row>
        <Col
          xs={24}
        >
          <table style={cusStyles.table}>
            <tbody>
              <tr>
                <td><p style={cusStyles.subTitle}>台灣專輯</p></td>
                <td><p>{(calcList.tw && calcList.tw.row) && (calcList.tw.row)}</p></td>
                <td><p>{(calcList.tw && calcList.tw.time) && (calcList.tw.time)}</p></td>
                <td>
                  <Tooltip title="計算">
                    <CalculatorOutlined
                      className={styles.om_icon_style}
                      onClick={() => {
                        if (calcList.tw && calcList.tw.valid_count && parseInt(calcList.tw.valid_count) > 0) {
                          calAlbum('tw');
                        } else {
                          commFn.errHandler('請先匯入檔案');
                        }

                      }}
                    />
                  </Tooltip>
                </td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td colSpan="5">
                  <div className={styles.contentBBd}></div>
                </td>
              </tr>
              <tr>
                <td><p style={cusStyles.subTitle}>外部專輯</p></td>
                <td><p>{(calcList.ext && calcList.ext.row) && (calcList.ext.row)}</p></td>
                <td><p>{(calcList.ext && calcList.ext.time) && (calcList.ext.time)}</p></td>
                <td>
                  <Tooltip title="計算">
                    <CalculatorOutlined
                      className={styles.om_icon_style}
                      onClick={() => {
                        if (calcList.ext && calcList.ext.valid_count && parseInt(calcList.ext.valid_count) > 0) {
                          calAlbum('ext');
                        } else {
                          commFn.errHandler('請先匯入檔案');
                        }
                      }}
                    />
                  </Tooltip>
                </td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td colSpan="5">
                  <div className={styles.contentBBd}></div>
                </td>
              </tr>
              <tr>
                <td><p style={cusStyles.subTitle}>海外專輯</p></td>
                <td><p>{(calcList.os && calcList.os.row) && (calcList.os.row)}</p></td>
                <td><p>{(calcList.os && calcList.os.time) && (calcList.os.time)}</p></td>
                <td>
                  <Tooltip title="計算">
                    <CalculatorOutlined
                      className={styles.om_icon_style}
                      onClick={() => {
                        if (calcList.os && calcList.os.valid_count && parseInt(calcList.os.valid_count) > 0) {
                          calAlbum('os');
                        } else {
                          commFn.errHandler('請先匯入檔案');
                        }
                      }}
                    />
                  </Tooltip>
                </td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td colSpan="5">
                  <div className={styles.contentBBd}></div>
                </td>
              </tr>
              <tr>
                <td><p style={cusStyles.subTitle}>其他授權</p></td>
                <td><p>{(calcList.mist && calcList.mist.row) && (calcList.mist.row)}</p></td>
                <td><p>{(calcList.mist && calcList.mist.time) && (calcList.mist.time)}</p></td>
                <td>
                  <Tooltip title="計算">
                    <CalculatorOutlined
                      className={styles.om_icon_style}
                      onClick={() => {
                        calMisc();
                      }}
                    />
                  </Tooltip>
                </td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td colSpan="5">
                  <div className={styles.contentBBd}></div>
                </td>
              </tr>
              <tr>
                <td><p style={cusStyles.subTitle}>明星商品</p></td>
                <td><p>{(calcList.souv && calcList.souv.row) && (calcList.souv.row)}</p></td>
                <td><p>{(calcList.souv && calcList.souv.time) && (calcList.souv.time)}</p></td>
                <td>
                  <Tooltip title="計算">
                    <CalculatorOutlined
                      className={styles.om_icon_style}
                      onClick={() => {
                        if (calcList.souv && calcList.souv.valid_count && parseInt(calcList.souv.valid_count) > 0) {
                          calSouv();
                        } else {
                          commFn.errHandler('請先匯入檔案');
                        }
                      }}
                    />
                  </Tooltip>
                </td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td colSpan="5">
                  <div className={styles.contentBBd}></div>
                </td>
              </tr>
              <tr>
                <td><p style={cusStyles.subTitle}>新媒體</p></td>
                <td><p>{(calcList.new_media && calcList.new_media.row) && (calcList.new_media.row)}</p></td>
                <td><p>{(calcList.new_media && calcList.new_media.time) && (calcList.new_media.time)}</p></td>
                <td>
                  <Tooltip title="計算">
                    <CalculatorOutlined
                      className={styles.om_icon_style}
                      onClick={() => {
                        if (calcList.new_media && calcList.new_media.valid_count && parseInt(calcList.new_media.valid_count) > 0) {
                          calMedia();
                        } else {
                          commFn.errHandler('請先匯入檔案');
                        }
                      }}
                    />
                  </Tooltip>
                </td>
                <td>
                  <Tooltip title="檢核報表">
                    <FileTextOutlined
                      className={styles.om_icon_style}
                      onClick={() => {
                        let setObj = {
                          agent_eid: agent_eid,
                          settle_phase_id: selectNewmediaRecPhaseId,
                        };
                        let defaultFileName = '';

                        if (calcList.new_media && calcList.new_media.valid_count && parseInt(calcList.new_media.valid_count) > 0) {
                          setViewLoading(true);

                          if (settlePhaseList.newMediaRecord && settlePhaseList.newMediaRecord.current && settlePhaseList.newMediaRecord.current.phase_code) {
                            defaultFileName += settlePhaseList.newMediaRecord.current.phase_code;
                          }

                          defaultFileName += '_新媒體錄音版稅檢核表_' + commFn.getNowTime();

                          commFn.postDownloadFile(`${window.FRONTEND_WEB}/settle_media_calculate_check/download_check_report`, setObj, defaultFileName, 'xlsx').then(() => {
                            setViewLoading(false);
                          });
                        } else {
                          commFn.errHandler('請先匯入檔案');
                        }
                      }}
                    />
                  </Tooltip>
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <p style={{ marginTop: '60px', marginBottom: '35px' }}>2-2. 預付與代結算</p>
        </Col>
        <Col xs={24}>
          <ComSettlement
            cusStyles={cusStyles}
            settleData={settleData}
            titleStyle="reco"
            recoApplyReplaceSettlement={recoApplyReplaceSettlement}
            recoUnapplyReplaceSettlement={recoUnapplyReplaceSettlement}
          />
        </Col>
      </Row>
    </Card >
  );
}

export default connect(({ settlePhaseList, enterpriseList, settleAlbumList, loading }) => ({
  settlePhaseList,
  enterpriseList,
  settleAlbumList,
}))(Step2);