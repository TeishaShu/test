import React, { Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Pagination,
} from 'antd';
import { Link, connect, history } from 'umi';
import styles from '@/style/style.less';
import globalSettings from '@/fn/globalsettings';
import commFn from '@/fn/comm';

export const ComCheckReportInfoNotCalTable = props => {
  const {
    uiType,
    color,
    notCalPageCurrent,
    setNotCalPageCurrent,
    getNotCalData,
    settleMediaList: { songListNotSettle },
  } = props;
  const pageSize = globalSettings.pageSize;
  // cusStyles
  const cusStyles = {
    noBorder: { border: 'none' },
    noBorderBlueBg: { border: 'none', backgroundColor: '#e6f7ff' }
  };

  // ui -----
  // cover
  const cover = (<div style={{ backgroundColor: color }} />);

  // changePage
  const changePage = (val) => {
    setNotCalPageCurrent(val);
    getNotCalData({ pageCurrent: val });
  }

  return (
    <Card
      bordered={false}
      className={`${styles.colorBdCard} ${styles.titleNoBBd} ${styles.cardTopSpace}`}
      title={
        <Fragment>
          <span className={styles.colorBdCardTitle} style={{ color: color }}>
            不計算{uiType == 'reco' && '/部分未拆'}
          </span>
          <span className={styles.colorBdCardTitle2}>
            &nbsp;共{
              (songListNotSettle && songListNotSettle.total_items)
                ? (songListNotSettle.total_items)
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
            current={notCalPageCurrent}
            pageSize={pageSize}
            total={(songListNotSettle && songListNotSettle.total_items) ? (songListNotSettle.total_items) : (0)}
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
          {
            (uiType == 'righ')
              ? (
                <table className={styles.formTable}>
                  <thead>
                    <tr>
                      <th>歌曲編號</th>
                      <th>歌名</th>
                      <th>型態</th>
                      <th>結算</th>
                      <th>權利</th>
                      <th>讀入金額</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      (songListNotSettle && songListNotSettle.data_list) && (
                        songListNotSettle.data_list.map((elem, idx) => (
                          <tr key={`tr_notcal_${idx}`}>
                            <td><p>{elem.song_code}</p></td>
                            <td><p>{elem.song_name}</p></td>
                            <td className={(elem.song_type_id == '4') ? (styles.om_bg_green) : ('')}><p>{elem.song_type}</p></td>
                            <td className={(elem.is_settle != '1') ? (styles.om_bg_green) : ('')}><p>{elem.is_settle}</p></td>
                            <td><p>{
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
                      <td colSpan="4" style={{ ...cusStyles.noBorder }}><p>&nbsp;</p></td>
                      <td style={{ ...cusStyles.noBorderBlueBg }}>
                        <p>Total</p>
                      </td>
                      <td style={{ ...cusStyles.noBorderBlueBg }}>
                        <p>{
                          (songListNotSettle && songListNotSettle.total_price)
                            ? (songListNotSettle.total_price)
                            : ('0')
                        }</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )
              : (
                <table className={styles.formTable}>
                  <thead>
                    <tr>
                      <th>ISRC</th>
                      <th>歌名</th>
                      <th>型態</th>
                      <th>結算</th>
                      <th>分拆</th>
                      <th>演唱人</th>
                      <th>讀入金額</th>
                      <th>比例</th>
                      <th>匯入/計算金額</th>
                      <th>差額</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      (songListNotSettle && songListNotSettle.data_list) && (
                        songListNotSettle.data_list.map((elem, idx) => (
                          <tr key={`tr_notcal_${idx}`}>
                            <td><p>{elem.isrc}</p></td>
                            <td><p>{elem.song_name}</p></td>
                            <td className={(elem.isrc_type_id == '8') ? (styles.om_bg_green) : ('')}><p>{elem.song_type}</p></td>
                            <td className={(elem.is_settle != '1') ? (styles.om_bg_green) : ('')}><p>{elem.is_settle}</p></td>
                            <td><p>{elem.is_split}</p></td>
                            <td><p>{elem.singer}</p></td>
                            <td>
                              <p>{elem.income_amount_untax}</p>
                            </td>
                            <td><p>{elem.isrc_split_ratio}</p></td>
                            <td><p>{elem.settle_amount}</p></td>
                            <td><p>{elem.difference_amount}</p></td>
                          </tr>
                        ))
                      )
                    }
                    <tr>
                      <td colSpan="8" style={{ ...cusStyles.noBorder }}><p>&nbsp;</p></td>
                      <td style={{ ...cusStyles.noBorderBlueBg }}>
                        <p>Total</p>
                      </td>
                      <td style={{ ...cusStyles.noBorderBlueBg }}>
                        <p>{
                          (songListNotSettle && songListNotSettle.total_price)
                            ? (songListNotSettle.total_price)
                            : ('0')
                        }</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )
          }
        </Col>
      </Row>
    </Card >
  );
}

export default connect(({ settleMediaList, loading }) => ({
  settleMediaList,
  loading: loading.models.settleMediaList,
}))(ComCheckReportInfoNotCalTable);