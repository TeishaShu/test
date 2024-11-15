import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
} from 'antd';
import { Link, connect } from 'umi';
import CheckIcon from '@/components/CheckIcon';
import styles from '@/style/style.less';

export const ComInfo = props => {
  const {
    authorizedAreaList,
    authorizedCountryList,
    songList,
    karaokeList,
    exchangeRateList,
    miscList: { optIncomeSource, info },
    areaCountryText,
  } = props;

  return (
    <Fragment>
      <Card
        bordered={false}
        className={`${styles.titleNoBBd}`}
      >
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <p>合約回覆：<span><CheckIcon val={info.need_sign_back} /></span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>
              詞曲結算期別：<span>{info.author_phase}</span>
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              錄音結算期別：<span>{info.song_phase}</span>
            </p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <div className={styles.contentBBd}></div>
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
            <p>
              我方紙本合約編號：<span>{info.our_contract_code}</span>
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              收款期別：<span>{info.receivable_phase}</span>
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              銷售日期：<span>{info.sold_date}</span>
            </p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>
              權利人：<span>{info.holder_company_name}</span>
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              使用者：<span>{info.user_company_id}</span>
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              簽約日期：<span>{info.issued_date}</span>
            </p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>
              合約開始：<span>{info.start_date}</span>
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              合約到期：<span>{info.end_date}</span>
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              合約終止：<span>{info.expiration_date}</span>
            </p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>永久：<span><CheckIcon val={info.is_permanent} /></span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>專屬：<span><CheckIcon val={info.is_exclusive} /></span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              合約年限：<span>{
                (info.contract_month && !isNaN(parseInt(info.contract_month)))
                  ? (`${(parseInt(parseInt(info.contract_month) / 12)).toString()} 年 ${(parseInt(info.contract_month) % 12).toString()} 月`)
                  : ('')
              }</span>
            </p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>
              授權地區：<span>{areaCountryText}</span>
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              收入來源：
              <span>
                {
                  (info.income_source && karaokeList.optIncomeSource.filter((elem) => elem.value == info.income_source).length > 0)
                  && (karaokeList.optIncomeSource.filter((elem) => elem.value == info.income_source)[0]['label'])
                }
              </span>
            </p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>
              幣別：
              <span>
                {
                  (info.currency_id && exchangeRateList.optCurrency.filter((elem) => elem.value == info.currency_id).length > 0)
                  && (exchangeRateList.optCurrency.filter((elem) => elem.value == info.currency_id)[0]['label'])
                }
              </span>
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              匯率：<span>{info.exchange_rate}</span>
            </p>
          </Col>
        </Row>
      </Card>
      <Card
        bordered={false}
        className={`${styles.card} ${styles.titleNoBBd}`}
      >
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <p>備註 1：<br />{
              (info.note1)
                ? (
                  info.note1.split('\n').map((elem, idx, arr) => (
                    <span key={idx}>
                      {elem}
                      <br />
                    </span>
                  )))
                : ('')
            }</p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <p>備註 2：<br />{
              (info.note2)
                ? (
                  info.note2.split('\n').map((elem, idx, arr) => (
                    <span key={idx}>
                      {elem}
                      <br />
                    </span>
                  )))
                : ('')
            }</p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <p>備註 3：<br />{
              (info.note3)
                ? (
                  info.note3.split('\n').map((elem, idx, arr) => (
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

export default connect(({ authorizedAreaList, authorizedCountryList, songList, karaokeList, exchangeRateList, miscList, loading }) => ({
  authorizedAreaList,
  authorizedCountryList,
  songList,
  karaokeList,
  exchangeRateList,
  miscList,
}))(ComInfo);