import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
} from 'antd';
import { connect } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import BoxIcon from '@/components/BoxIcon';

export const ComInfo = props => {
  const {
    loadingMultiGetInfo,
    authorList: { multiChangeId, optPaymentRate, optInsurance, info },
    authorizedCountryList,
    reportSettingList,
    setViewLoading,
  } = props;
  const [renMembers, setRenMembers] = useState('');
  const [renNationality, setRenNationality] = useState('');
  const [renOverpay, setRenOverpay] = useState('');
  const [renPaymentRate, setRenPaymentRate] = useState('');
  const [renInsurance, setRenInsurance] = useState('');

  // api -----
  // update data
  const updateData = () => {
    setViewLoading(true);

    // members
    let memberArr = info.members.map((elem, idx, arr) => elem.stage_name);
    setRenMembers(memberArr.join(', '));

    // nationality
    let searchNationalityName = commFn.searchToString(authorizedCountryList.countryList, 'id', 'country_name_zh', info.nationality);
    setRenNationality((searchNationalityName) ? (searchNationalityName) : (info.nationality))

    // overpay
    let tmpOverpayList = commFn.convertOverpayOpt(reportSettingList.incomeTaxOverList);
    let tmpOverpayVal = (info.overpay) ? (info.overpay) : '';
    let checkOverpay = false;
    for (let i = 0; i < tmpOverpayList.length; i++) {
      if (tmpOverpayVal == tmpOverpayList[i].value) {
        checkOverpay = true;
        setRenOverpay(tmpOverpayList[i].label);
        break;
      }
    }
    if (!checkOverpay) {
      setRenOverpay(tmpOverpayVal);
    }

    // payment_rate
    for (let i = 0; i < optPaymentRate.length; i++) {
      if (info.payment_rate == optPaymentRate[i].value) {
        setRenPaymentRate(optPaymentRate[i].label);
        break;
      }
    }

    // insurance
    for (let i = 0; i < optInsurance.length; i++) {
      if (info.insurance == optInsurance[i].value) {
        setRenInsurance(optInsurance[i].label);
        break;
      }
    }
    setViewLoading(false);
  }
  useEffect(() => {
    updateData();
  }, [multiChangeId]);


  // ui -----
  // boxIconList
  const boxIconList = (
    <Fragment>
      <BoxIcon list={info.role} selected="1" text="藝人" />
      <BoxIcon list={info.role} selected="2" text="作者" />

      <BoxIcon list={info.type} selected="1" text="個人" cusSelectBg="#2B2B2B" />
      <BoxIcon list={info.type} selected="2" text="團體" cusSelectBg="#2B2B2B" />
      <BoxIcon list={info.type} selected="3" text="其他" cusSelectBg="#2B2B2B" />
    </Fragment>
  );

  return (
    <Fragment>
      <Card
        bordered={false}
        className={styles.card}
        title="基本資料"
        loading={loadingMultiGetInfo}
        extra={boxIconList}
      >
        <Row>
          <Col md={8} xs={24}>
            <p>姓名：<span>{info.name}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>筆名：<span>{(info.pen_name) ? (info.pen_name.map((elem) => (elem.pen_name)).join(', ')) : (null)}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>藝名：<span>{(info.stage_name) ? (info.stage_name.map((elem) => (elem.stage_name)).join(', ')) : (null)}</span></p>
          </Col>
        </Row>
        <Row>
          <Col md={8} xs={24}>
            {
              (info.type == '2')
                ? (<p>組合成員：<span>{renMembers}</span></p>)
                : (<p>所屬團體(組合)：<span>{(info.group_name) ? (info.group_name.join(', ')) : ('')}</span></p>)
            }
          </Col>
          <Col md={8} xs={24}>
            <p>稅籍：<span>{renNationality}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>身分證字號/護照號碼：<span>{info.id_number}</span></p>
          </Col>
        </Row>
      </Card>
      <Card
        bordered={false}
        className={`${styles.card} ${styles.cardTopSpace}`}
        loading={loadingMultiGetInfo}
        title="結算資料"
      >
        <Row>
          <Col md={8} xs={24}>
            <p>稅率：<span>{renPaymentRate}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>超出金額：<span>{renOverpay}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>結算公司：<span>{info.account_company_name}</span></p>
          </Col>
        </Row>
        <Row>
          <Col md={8} xs={24}>
            <p>扣二代健保：<span>{renInsurance}</span></p>
          </Col>
        </Row>
      </Card>
      <Card
        bordered={false}
        className={`${styles.card} ${styles.cardTopSpace}`}
        loading={loadingMultiGetInfo}
        title="聯絡資料"
      >
        <Row>
          <Col xs={24}>
            <p>戶籍地址：<span>{info.residence_add}</span></p>
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <p>通訊地址：<span>{info.mailing_add}</span></p>
          </Col>
        </Row>
        <Row>
          <Col md={8} xs={24}>
            <p>手機號碼：<span>{info.mobile}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>家用電話：<span>{info.home_phone}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>公司電話：<span>{info.company_phone}</span></p>
          </Col>
        </Row>
        <Row>
          <Col md={8} xs={24}><p>傳真：<span>{info.fax}</span></p></Col>
          <Col md={8} xs={24}><p>Email：<span>{info.email}</span></p></Col>
        </Row>
        <Row>
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

export default connect(({ authorList, authorizedCountryList, reportSettingList, loading }) => ({
  authorList,
  authorizedCountryList,
  reportSettingList,
  loadingMultiGetInfo: loading.effects['authorList/fetchMultiGetInfo'],
}))(ComInfo);