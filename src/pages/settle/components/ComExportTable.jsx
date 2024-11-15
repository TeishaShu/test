import React, { useState, useEffect, Fragment } from 'react';
import globalSettings from '@/fn/globalsettings';
import { CalculatorOutlined } from '@ant-design/icons';
import {
  Col,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Link, connect, history } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

export const ComExportTable = props => {
  const {
    settlePhaseList,
    enterpriseList,
    uiType,
    settleType,
    data,
    selectSettlePhaseId,
    setViewLoading,
  } = props;

  const renderTitle = () => {
    switch (settleType) {
      case 'op_company':
        return 'OP 報表';
      case 'op_author_tw':
        return '作者報表 (台灣)';
      case 'op_author_os':
        return '作者報表 (海外)';
      case 'op_author':
        return '作者報表 (全部)';
      default:
        return '';
    }
  };

  return (
    <Col xs={24} lg={12}>
      <table className={styles.formTable}>
        <thead>
          <tr>
            <th>{renderTitle()}</th>
          </tr>
        </thead>
        <tbody>
          {
            (data && data[settleType])
              ? (
                data[settleType].map((elem, idx) => (
                  <tr key={idx}>
                    <td>
                      <p
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          let tmpSettlePhaseList = (settlePhaseList.phaseList) ? (settlePhaseList.phaseList.filter((elem) => elem.id == selectSettlePhaseId)) : ([]);
                          let setObj = {};
                          let fileName = elem.file_name;
                          let fileSplitPhaseDate = (tmpSettlePhaseList[0]['phase_code']) ? (tmpSettlePhaseList[0]['phase_code'].split('-')) : [];

                          setObj = {
                            ...elem,
                            agent_eid: enterpriseList.agent_eid,
                            settle_type: uiType,
                          };
                          if (tmpSettlePhaseList.length > 0) {
                            setObj.settle_phase = tmpSettlePhaseList[0]['phase_code'];
                            setObj.settle_phase_start = tmpSettlePhaseList[0]['phase_start'];
                            setObj.settle_phase_end = tmpSettlePhaseList[0]['phase_end'];
                          }

                          // download file name
                          for (let i = 0; i < fileSplitPhaseDate.length; i++) {
                            if (/^[0-9]{4}[a-zA-z0-9]{2}$/.test(fileSplitPhaseDate[i])) {
                              fileSplitPhaseDate[i] = fileSplitPhaseDate[i].replace(/^[0-9]{2}/g, '');
                            }
                          }
                          fileName = fileName + '_' + fileSplitPhaseDate.join('-') + '_' + commFn.getNowTime('yyyyMMdd hhmmss');

                          setViewLoading(true)
                          commFn.postDownloadFile(`${window.FRONTEND_WEB}/settle_report/export_report`, setObj, fileName, 'xlsx').then(() => {
                            setViewLoading(false);
                          });
                        }}
                      >{elem.file_name}</p>
                    </td>
                  </tr>
                ))
              )
              : (null)
          }
        </tbody>
      </table>
    </Col>
  );
}


export default connect(({ settlePhaseList, enterpriseList }) => ({
  settlePhaseList,
  enterpriseList,
}))(ComExportTable);