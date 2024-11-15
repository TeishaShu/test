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
import ComPoint from '@/pages/album/components/ComPoint';
import ComSettlement from '@/pages/settle/components/ComSettlement';

export const Step3 = props => {
  const {
    selectSettlePhaseId,
    selectNewmediaRighPhaseId,
    settlePhaseList,
    enterpriseList: { agent_eid },
    settleAlbumList: { calcList, settleRightState, ui_settleRightState, settleRightChangeId },
    dispatch,
    loading,
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

  const uiType = 'righ';

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'settleAlbumList/fetchMultiGetCalcList',
      payload: {
        agent_eid: agent_eid,
        settle_type: uiType,
        settle_phase_id: selectSettlePhaseId
      },
    });
    // 預付與代結算
    dispatch({
      type: 'settleAlbumList/fetchGetSettleRightState',
      payload: {
        agent_eid: agent_eid,
      }
    })
  }

  // change settle phase
  useEffect(() => {
    getData();
  }, [selectSettlePhaseId]);

  // mount
  useEffect(() => {
    getData();
  }, []);

  // change settle right
  useEffect(() => {
    getData();
  }, [settleRightChangeId]);

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
        phase_type: '1',
        phase_id: selectSettlePhaseId,
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
      title: '專輯預付扣抵',
      data: (settleRightState.length > 0) && (settleRightState.map(p => (p.state === 1) ? p.created_at : '')),
      isApply: (ui_settleRightState.state === 0) ? true : false,
      hadDelete: (ui_settleRightState.state > 0) ? true : false,
    },
    {
      title: '代結算拆分報表',
      data: (settleRightState.length > 0) && (settleRightState.map(p => (p.state === 2) ? p.created_at : '')),
      isApply: (ui_settleRightState.state === 1) ? true : false,
      hadDelete: (ui_settleRightState.state > 1) ? true : false,
    },
    {
      title: '合約預付扣抵',
      data: (settleRightState.length > 0) && (settleRightState.map(p => (p.state === 3) ? p.created_at : '')),
      isApply: (ui_settleRightState.state === 2) ? true : false,
      hadDelete: (ui_settleRightState.state > 2) ? true : false,
    }
  ];

  // 套用-專輯預付扣抵
  const rightApplyAlbumPrepaid = () => {
    let tmpDate = convertPhaseDate();
    dispatch({
      type: 'settleAlbumList/fetchRightApplyAlbumPrepaid',
      payload: {
        "agent_eid": agent_eid,
        "settle_phase_start": tmpDate[0],
        "settle_phase_end": tmpDate[1]
      },
    })
  }

  // 套用-代結算拆分報表
  const rightApplyReplaceSettlement = () => {
    let tmpDate = convertPhaseDate();
    dispatch({
      type: 'settleAlbumList/fetchRightApplyReplaceSettlement',
      payload: {
        "agent_eid": agent_eid,
        "settle_phase_start": tmpDate[0],
        "settle_phase_end": tmpDate[1]
      },
    })
  }

  // 刪除-專輯預付扣抵(全部)
  const rightUnApplyAlbumPrepaid = () => {
    let tmpDate = convertPhaseDate();
    dispatch({
      type: 'settleAlbumList/fetchRightUnapplyAlbumPrepaid',
      payload: {
        "agent_eid": agent_eid,
        "settle_phase_start": tmpDate[0],
        "settle_phase_end": tmpDate[1]
      },
    })
  }

  // 刪除-代結算拆分報表
  const rightUnapplyReplaceSettlement = () => {
    let tmpDate = convertPhaseDate();
    dispatch({
      type: 'settleAlbumList/fetchRightUnapplyReplaceSettlement',
      payload: {
        "agent_eid": agent_eid,
        "settle_phase_start": tmpDate[0],
        "settle_phase_end": tmpDate[1]
      },
    })
  }

  return (
    <Card
      bordered={false}
      loading={loading}
    >
      <Row>
        <Col
          xs={12}
        >
          <p>3-1. 計算</p>
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
              window.open(`${REACT_APP_PUBLIC_PATH}/#/settle/right/list/cal_preview/${selectSettlePhaseId}`, '_blank');
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
                <td><p style={cusStyles.subTitle}>例外專輯</p></td>
                <td><p>{(calcList.exception && calcList.exception.row) && (calcList.exception.row)}</p></td>
                <td><p>{(calcList.exception && calcList.exception.time) && (calcList.exception.time)}</p></td>
                <td>
                  <Tooltip title="計算">
                    <CalculatorOutlined
                      className={styles.om_icon_style}
                      onClick={() => {
                        if (calcList.exception && calcList.exception.valid_count && parseInt(calcList.exception.valid_count) > 0) {
                          calAlbum('exception');
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
                          settle_phase_id: selectNewmediaRighPhaseId,
                        };
                        let defaultFileName = '';

                        if (calcList.new_media && calcList.new_media.valid_count && parseInt(calcList.new_media.valid_count) > 0) {
                          setViewLoading(true);

                          if (settlePhaseList.newMediaRight && settlePhaseList.newMediaRight.current && settlePhaseList.newMediaRight.current.phase_code) {
                            defaultFileName += settlePhaseList.newMediaRight.current.phase_code;
                          }

                          defaultFileName += '_新媒體詞曲版稅檢核表_' + commFn.getNowTime();

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
              <tr>
                <td colSpan="5">
                  <div className={styles.contentBBd}></div>
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <p style={{ marginTop: '60px', marginBottom: '35px' }}>3-2. 預付與代結算</p>
        </Col>
        <Col xs={24}>
          <ComSettlement
            cusStyles={cusStyles}
            settleData={settleData}
            titleStyle="right"
            rightApplyAlbumPrepaid={rightApplyAlbumPrepaid}
            rightApplyReplaceSettlement={rightApplyReplaceSettlement}
            rightUnApplyAlbumPrepaid={rightUnApplyAlbumPrepaid}
            rightUnapplyReplaceSettlement={rightUnapplyReplaceSettlement}
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
  loading: loading.models.settleAlbumList,
}))(Step3);