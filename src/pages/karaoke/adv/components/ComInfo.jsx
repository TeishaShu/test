import React, { useState, useEffect, Fragment } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Card,
  Button,
} from 'antd';
import { Link, connect } from 'umi';
import BoxIcon from '@/components/BoxIcon';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

export const ComInfo = props => {
  const {
    pageId,
    authorizedAreaList,
    authorizedCountryList,
    songList,
    karaokeList: { multiChangeId, optIncomeSource, info, },
  } = props;
  // areaCountryText
  const [areaCountryText, setAreaCountryText] = useState('');

  // api -----
  // update data
  useEffect(() => {

    let tmpAreaCountryText = commFn.convertAreaContryText(info.authorized_area_type, info.area_name, (info.authorized_country ? info.authorized_country.map(elem => elem.country_id) : []), authorizedCountryList.countryList);

    setAreaCountryText(tmpAreaCountryText);
  }, [multiChangeId]);

  // ui -----
  // boxIconList
  const boxIconList = (
    <Fragment>
      <BoxIcon list={info.type} selected="1" text="營業用單曲" />
      <BoxIcon list={info.type} selected="2" text="MIDI" />
    </Fragment>
  );

  return (
    <Fragment>
      <Card
        bordered={false}
        className={`${styles.titleNoBBd}`}
        extra={boxIconList}
      >
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <p>詞曲結算期別：<span>{
              (info.right_phase_start_date && info.right_phase_end_date)
                ? (`${info.right_phase_start_date.split('-').join('/')}-${info.right_phase_end_date.split('-').join('/')}`)
                : ('')
            }</span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <p>錄音結算期別：<span>{
              (info.record_phase_start_date && info.record_phase_end_date)
                ? (`${info.record_phase_start_date.split('-').join('/')}-${info.record_phase_end_date.split('-').join('/')}`)
                : ('')
            }</span></p>
          </Col>
        </Row>
      </Card>
      <Card
        bordered={false}
        className={`${styles.card} ${styles.titleNoBBd}`}
        title="基本資料"
      >
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>收款期別：<span>{(info.receivable_phase) ? (info.receivable_phase) : ('')}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>收入來源：<span>
              {
                (info.income_source && optIncomeSource.filter((elem) => elem.value == info.income_source).length > 0)
                  ? (optIncomeSource.filter((elem) => elem.value == info.income_source)[0]['label'])
                  : ('')
              }
            </span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>授權地區：<span>{areaCountryText}</span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>使用者：<span>{(info.user_company_name) ? (info.user_company_name) : ('')}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>發行商：<span>{(info.release_company_name) ? (info.release_company_name) : ('')}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>權利人：<span>{(info.holder_company_name) ? (info.holder_company_name) : ('')}</span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <div className={styles.contentBBd}></div>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>發行日期：<span>{(info.release_date) ? (info.release_date) : ('')}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>專屬期限：<span>{
              (info.start_date && info.end_date)
                ? (`${info.start_date.split('-').join('/')}-${info.end_date.split('-').join('/')}`)
                : ('')
            }</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>銷售日期：<span>{(info.sold_date) ? (info.sold_date) : ('')}</span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>波數：<span>{(info.wave) ? (info.wave) : ('')}</span></p>
          </Col>
        </Row>
      </Card>
      <Card
        bordered={false}
        className={`${styles.card} ${styles.titleNoBBd}`}
        title="授權內容"
      >
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>專輯名稱：<span>{(info.album_name_zh) ? (info.album_name_zh) : ('')}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>專輯編號：<span>{(info.album_code) ? (info.album_code) : ('')}</span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>歌曲名稱：<span>{(info.song_name) ? (info.song_name) : ('')}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>歌曲編號：<span>{(info.song_code) ? (info.song_code) : ('')}</span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col
            xs={24}
            className={styles.om_overflow_auto}
          >
            <table
              className={styles.formTable}
              style={{ marginBottom: '24px' }}
            >
              <thead>
                <tr>
                  <th style={{ width: '50%' }}>詞曲作者摘要</th>
                  <th>授權費</th>
                  <th>Syn Fee</th>
                  <th>Mech Adv</th>
                  <th>Flat Fee</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ paddingTop: '0' }}>
                    <table style={{ width: '100%', paddingTop: '0' }}>
                      <tbody>
                        {
                          (info.song_rights)
                            ? (info.song_rights.map((elem, idx) => (
                              <tr key={`trSongRight_${idx}`}>
                                <td className={styles.om_bd_none}><p>{(elem.author_pen_name) ? (elem.author_pen_name) : ''}</p></td>
                                <td className={styles.om_bd_none}><p>{(elem.song_right_type) ? (elem.song_right_type) : ''}</p></td>
                                <td className={styles.om_bd_none}><p>{(elem.song_right_ratio) ? (`${elem.song_right_ratio}`) : ''}</p></td>
                              </tr>
                            )))
                            : (null)
                        }
                      </tbody>
                    </table>
                  </td>
                  <td><p className={styles.om_txt_bold}>{(info.auth_fee) ? (info.auth_fee) : ('')}</p></td>
                  <td><p className={styles.om_txt_bold}>{(info.syn_fee) ? (info.syn_fee) : ('')}</p></td>
                  <td><p className={styles.om_txt_bold}>{(info.mech_adv) ? (info.mech_adv) : ('')}</p></td>
                  <td><p className={styles.om_txt_bold}>{(info.flat_fee) ? (info.flat_fee) : ('')}</p></td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <p className={styles.om_txt_align_r}>
              <span className={styles.om_m_r_12}>
                {
                  (info.exclude_op == '1')
                    ? (<CheckOutlined style={{ fontSize: '16px', color: '#60CB28' }} />)
                    : (<CloseOutlined style={{ fontSize: '16px', color: '#E75757' }} />)
                }
              </span>
              <span>支付金額不結算 OP 公司作者</span>
            </p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <p>ISRC：<span>{(info.isrc) ? (info.isrc) : ('')}</span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col
            xs={24}
            className={styles.om_overflow_auto}
          >
            <table
              className={styles.formTable}
              style={{ marginBottom: '24px' }}
            >
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>表演者摘要</th>
                  <th>售價</th>
                  <th>製作成本</th>
                  <th>手續費</th>
                  <th>稅</th>
                  <th>計算金額</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {
                      (info.isrc && songList.iSRCListBySong && songList.iSRCListBySong.data_list && songList.iSRCListBySong.data_list.filter((elem) => elem.isrc == info.isrc).length > 0)
                        ? (
                          <Fragment>
                            <p>表演者：<span>{songList.iSRCListBySong.data_list.filter((elem) => elem.isrc == info.isrc)[0].singer}</span></p>
                            <p>版本：<span>{songList.iSRCListBySong.data_list.filter((elem) => elem.isrc == info.isrc)[0].version}</span></p>
                            <p>母帶：<span>{songList.iSRCListBySong.data_list.filter((elem) => elem.isrc == info.isrc)[0].tape_company.join(', ')}</span></p>
                          </Fragment>
                        )
                        : (
                          <Fragment>
                            <p>表演者：</p>
                            <p>版本：</p>
                            <p>母帶：</p>
                          </Fragment>
                        )
                    }
                  </td>
                  <td><p className={styles.om_txt_bold}>{(info.price) ? (info.price) : ('')}</p></td>
                  <td><p className={styles.om_txt_bold}>{(info.cost) ? (info.cost) : ('')}</p></td>
                  <td><p className={styles.om_txt_bold}>{(info.fee) ? (info.fee) : ('')}%</p></td>
                  <td><p className={styles.om_txt_bold}>{(info.tax_rate) ? (info.tax_rate) : ('')}%</p></td>
                  <td><p className={styles.om_txt_bold}>{(info.singer_pay) ? (info.singer_pay) : ('')}</p></td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <div className={styles.contentBBd}></div>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <p>備註：<br />{
              (info.notes)
                ? (
                  info.notes.split('\n').map((elem, idx, arr) => (
                    <span key={idx}>
                      {elem}
                      <br />
                    </span>
                  )))
                : ('')
            }</p>
          </Col>
        </Row>
      </Card>
    </Fragment>
  );
}

export default connect(({ authorizedAreaList, authorizedCountryList, songList, karaokeList, loading }) => ({
  authorizedAreaList,
  authorizedCountryList,
  songList,
  karaokeList,
  loading: loading.effects['karaokeList/fetchMultiGetAdvInfo'],
}))(ComInfo);
