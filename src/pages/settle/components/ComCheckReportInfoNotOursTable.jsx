import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Pagination,
} from 'antd';
import { Link, connect, history } from 'umi';
import styles from '@/style/style.less';
import globalSettings from '@/fn/globalsettings';

export const ComCheckReportInfoNotOursTable = props => {
  const {
    uiType,
    color,
    notOursPageCurrent,
    setNotOursPageCurrent,
    getNotOursData,
    settleMediaList: { songListNotOurs },
  } = props;
  const pageSize = globalSettings.pageSize;
  // cusStyles
  const cusStyles = {
    noBorder: { border: 'none' },
    noBorderBlueBg: { border: 'none', backgroundColor: '#e6f7ff' }
  };

  // changePage
  const changePage = (val) => {
    setNotOursPageCurrent(val);
    getNotOursData({ pageCurrent: val });
  }

  // ui -----
  // cover
  const cover = (<div style={{ backgroundColor: color }} />);

  return (
    <Card
      bordered={false}
      className={`${styles.colorBdCard} ${styles.titleNoBBd} ${styles.cardTopSpace}`}
      title={
        <Fragment>
          <span className={styles.colorBdCardTitle} style={{ color: color }}>
            非我方權利
          </span>
          <span className={styles.colorBdCardTitle2}>
            &nbsp;共{
              (songListNotOurs && songListNotOurs.total_items)
                ? (songListNotOurs.total_items)
                : ('0')
            }筆
            </span>
        </Fragment>
      }
      cover={cover}
      extra={''}
    >
      <Row gutter={[8, 0]}>
        <Col xs={24}>
          <Pagination
            className={styles.om_sp_m_lb}
            style={{ textAlign: 'right' }}
            current={notOursPageCurrent}
            pageSize={pageSize}
            total={(songListNotOurs && songListNotOurs.total_items) ? (songListNotOurs.total_items) : (0)}
            onChange={changePage}
            showSizeChanger={false}
          />
        </Col>
      </Row>
      <Row gutter={[8, 0]}>
        <Col
          xs={24}
          className={styles.om_overflow_auto}
        >
          <table className={styles.formTable}>
            <thead>
              <tr>
                <th>平台編號</th>
                <th style={{ display: (uiType == 'righ') ? 'none' : 'table-cell' }}>ISRC</th>
                <th>平台歌名</th>
                <th>演唱人</th>
                <th style={{ display: (uiType == 'righ') ? 'table-cell' : 'none' }}>權利</th>
                <th>讀入金額</th>
              </tr>
            </thead>
            <tbody>
              {
                (songListNotOurs && songListNotOurs.data_list) && (
                  songListNotOurs.data_list.map((elem, idx) => (
                    <tr key={`tr_notours_${idx}`}>
                      <td><p>{elem.clientcode}</p></td>
                      <td style={{ display: (uiType == 'righ') ? 'none' : 'table-cell' }}><p>{elem.isrc}</p></td>
                      <td><p>{elem.clientname}</p></td>
                      <td><p>{elem.singer}</p></td>
                      <td style={{ display: (uiType == 'righ') ? 'table-cell' : 'none' }}><p>{
                        (elem.is_ours == '1')
                          ? (elem.rights_list)
                          : (<span className={styles.om_color_red}>*非我方</span>)
                      }</p></td>
                      <td>
                        <p>{elem.income_amount_untax}</p>
                      </td>
                    </tr>
                  ))
                )
              }
              <tr>
                <td style={{ ...cusStyles.noBorder }}><p>&nbsp;</p></td>
                <td
                  style={{
                    ...cusStyles.noBorder,
                    display: (uiType == 'righ') ? 'none' : 'table-cell'
                  }}
                ><p>&nbsp;</p></td>
                <td style={{ ...cusStyles.noBorder }}><p>&nbsp;</p></td>
                <td style={{ ...cusStyles.noBorderBlueBg }}>
                  <p>Total</p>
                </td>
                <td
                  style={{
                    ...cusStyles.noBorderBlueBg,
                    display: (uiType == 'righ') ? 'table-cell' : 'none'
                  }}
                ></td>
                <td style={{ ...cusStyles.noBorderBlueBg }}>
                  <p>{
                    (songListNotOurs && songListNotOurs.total_price)
                      ? (songListNotOurs.total_price)
                      : ('0')
                  }</p>
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
    </Card >
  );
}


export default connect(({ settleMediaList, loading }) => ({
  settleMediaList,
  loading: loading.models.settleMediaList,
}))(ComCheckReportInfoNotOursTable);