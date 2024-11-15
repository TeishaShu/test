import React, { useState, useEffect, Fragment } from 'react';
import { CheckOutlined, CloseOutlined, DownloadOutlined } from '@ant-design/icons';

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
    loading,
    dispatch,
    pageId,
    authorizedAreaList,
    authorizedCountryList,
    contractSongList,
    contractAuthorList: { multiChangeId, optType, info, updateDataResult, },
  } = props;
  const [authorizedText, setAuthorizedText] = useState('');

  // api -----
  useEffect(() => {
    // authorized (area, country...) ---
    let tmpAuthorizedText = '';
    if (info.basic_info) {
      if (info.basic_info.authorized_area_type == '2' || info.basic_info.authorized_area_type == '3' || info.basic_info.authorized_area_type == '4') {
        tmpAuthorizedText += (info.basic_info.authorized_area && info.basic_info.authorized_area.area_name ? info.basic_info.authorized_area.area_name : '');
      }

      if (info.basic_info.authorized_area_type == '3') {
        tmpAuthorizedText += '，包含';
      }

      if (info.basic_info.authorized_area_type == '4') {
        tmpAuthorizedText += '，除了';
      }

      if ((info.basic_info.authorized_area_type == '1' || info.basic_info.authorized_area_type == '3' || info.basic_info.authorized_area_type == '4') && info.authorized_countries) {
        for (let j = 0; j < info.authorized_countries.length; j++) {
          let countryItem = info.authorized_countries[j];

          tmpAuthorizedText += countryItem.country.country_name_zh;

          if (j < info.authorized_countries.length - 1) {
            tmpAuthorizedText += '、';
          }
        }
      }
    }
    setAuthorizedText(tmpAuthorizedText);
  }, [multiChangeId]);

  // ui -----
  // boxIconList
  const boxIconList = (
    <Fragment>
      <BoxIcon list={info.contract_author_types} listKey="type" selected="1" text="經紀" />
      <BoxIcon list={info.contract_author_types} listKey="type" selected="2" text="歌手" />
      <BoxIcon list={info.contract_author_types} listKey="type" selected="3" text="單歌" />
      <BoxIcon list={info.contract_author_types} listKey="type" selected="4" text="代理發行" />
      <BoxIcon list={info.contract_author_types} listKey="type" selected="5" text="代理經銷" />
    </Fragment>
  );

  return (
    <Fragment>
      <Card
        bordered={false}
        className={`${styles.card} ${styles.titleNoBBd} ${styles.cardBodyNoBPd}`}
        title="附件"
      >
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            {
              (info.files && info.files.length > 0)
                ? (
                  info.files.map((elem, idx) => (
                    <Button
                      key={`file_${idx}`}
                      className={styles.om_sp_m_rb}
                      icon={<DownloadOutlined />}
                      onClick={() => {
                        let setObj = {
                          contract_author_id: pageId,
                          file_id: elem.id,
                        };

                        commFn.postDownloadFile(`${window.FRONTEND_WEB}/contract_author/download_file`, setObj, `${elem.orig_name}.${elem.ext}`);
                      }}
                    ><span style={{ color: '#40a9ff' }}>{`${elem.orig_name}.${elem.ext}`}</span></Button>
                  ))
                )
                : (<p>(無附件)</p>)
            }
          </Col>
        </Row>
      </Card>
      <Card
        bordered={false}
        className={`${styles.card} ${styles.titleNoBBd} ${styles.cardBodyNoBPd}`}
        title="基本資料"
        extra={boxIconList}
      >
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>簽約日期：<span>{(info.basic_info) ? (info.basic_info.contract_signing_date) : ''}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              簽約對象：
              <span>{
                (info.basic_info)
                  ? (
                    (info.basic_info.party_b_object_company)
                      ? (info.basic_info.party_b_object_company.name)
                      : (
                        (info.basic_info.party_b_object_author)
                          ? (info.basic_info.party_b_object_author.name)
                          : ('')
                      )
                  )
                  : ('')
              }</span>
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>接續合約：<span>{(info.basic_info && info.basic_info.next_contract) ? (info.basic_info.next_contract.contract_code) : ''}</span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>我方簽約單位：<span>{(info.basic_info && info.basic_info.party_a_company) ? (info.basic_info.party_a_company.name) : ''}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>簽約單位：<span>{(info.basic_info && info.basic_info.party_b_company) ? (info.basic_info.party_b_company.name) : ''}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              關聯合約：
              {
                (info.basic_info.contract_code && info.contract_group && info.contract_group.length > 0)
                  ? (
                    info.contract_group.filter((fElem) => fElem.contract_code != info.basic_info.contract_code).map((cgElem, idx) => (
                      <Fragment key={`contract_group_${idx}`}>
                        <br /><Link to={`/contract/contract_author/adv/${cgElem.id}`}>{cgElem.contract_code}</Link>
                      </Fragment>
                    ))
                  )
                  : ''
              }
            </p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <div className={styles.contentBBd}></div>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>合約開始日：<span>{(info.basic_info) ? (info.basic_info.contract_start_date) : ''}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              續約年限：
              <span>
                {
                  (info.basic_info && !commFn.convertToBool(info.basic_info.is_permanent))
                    ? (info.basic_info.renewal_period)
                    : ''
                }
              </span>
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              <span className={styles.om_color_red}>合約提前終止：</span>
              <span>
                {/* 
                  (!info.basic_info || info.basic_info.is_permanent == '1' || info.basic_info.is_buyout == '1')
                    ? (<CloseOutlined style={{ fontSize: '16px', color: '#E75757' }} />)
                    : (<CheckOutlined style={{ fontSize: '16px', color: '#60CB28' }} />)
                */}
                {
                  (info.basic_info && info.basic_info.contract_termination_date)
                    ? (<CheckOutlined style={{ fontSize: '16px', color: '#60CB28' }} />)
                    : (<CloseOutlined style={{ fontSize: '16px', color: '#E75757' }} />)
                }
                &nbsp;
                {
                  (info.basic_info) ? (info.basic_info.contract_termination_date) : ''
                }
              </span>
            </p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>
              合約到期日：
              <span>
                {
                  (info.basic_info && !commFn.convertToBool(info.basic_info.is_permanent))
                    ? (info.basic_info.contract_end_date)
                    : ''
                }
              </span>
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>代理/發行到期日：<span>{(info.basic_info) ? (info.basic_info.rights_end_date) : ''}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              <span className={styles.om_color_red}>代理到期日提前終止：</span>
              <span>
                {
                  (info.basic_info && info.basic_info.rights_termination_date)
                    ? (<CheckOutlined style={{ fontSize: '16px', color: '#60CB28' }} />)
                    : (<CloseOutlined style={{ fontSize: '16px', color: '#E75757' }} />)
                }
                &nbsp;
                {
                  (info.basic_info) ? (info.basic_info.rights_termination_date) : ''
                }
              </span>
            </p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>
              合約有效日：
              <span>
                {
                  (info.basic_info && !commFn.convertToBool(info.basic_info.is_permanent))
                    ? (info.basic_info.contract_expiry_date)
                    : ''
                }
              </span>
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>永久：<span>{(info.basic_info && commFn.convertToBool(info.basic_info.is_permanent)) ? '是' : '否'}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>授權地區：<span>{authorizedText}</span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>專輯發行數量：<span>{(info.basic_info) ? (info.basic_info.published_album_quantity) : ''}</span></p>
          </Col>
          <Col md={8} xs={24}>
            <p>買斷：<span>{(info.basic_info && commFn.convertToBool(info.basic_info.is_buyout)) ? '是' : '否'}</span></p>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col xs={24}>
            <div className={styles.contentBBd}></div>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col md={8} xs={24}>
            <p>
              母帶權利人：
                <span>
                {
                  (info.media_owners && info.media_owners.length > 0)
                    ? (info.media_owners.filter((fElem) => fElem.type == '1').map((mElem, idx) => <Fragment key={`owner_1_${idx}`}><br />{mElem.company_nickname.nickname}</Fragment>))
                    : ('')
                }
              </span>
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              視聽著作權人：
              <span>
                {
                  (info.media_owners && info.media_owners.length > 0)
                    ? (info.media_owners.filter((fElem) => fElem.type == '2').map((mElem, idx) => <Fragment key={`owner_2_${idx}`}><br />{mElem.company_nickname.nickname}</Fragment>))
                    : ('')
                }
              </span>
            </p>
          </Col>
          <Col md={8} xs={24}>
            <p>
              語文著作權人：
              <span>
                {
                  (info.media_owners && info.media_owners.length > 0)
                    ? (info.media_owners.filter((fElem) => fElem.type == '3').map((mElem, idx) => <Fragment key={`owner_3_${idx}`}><br />{mElem.company_nickname.nickname}</Fragment>))
                    : ('')
                }
              </span>
            </p>
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
              (info.basic_info && info.basic_info.notes)
                ? (
                  info.basic_info.notes.split('\n').map((elem, idx, arr) => (
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
            <div className={styles.contentBBd}></div>
          </Col>
        </Row>
      </Card>
    </Fragment>
  );
}

export default connect(({ contractAuthorList, authorizedAreaList, authorizedCountryList, contractSongList, loading }) => ({
  contractAuthorList,
  authorizedAreaList,
  authorizedCountryList,
  contractSongList,
  loading: loading.effects['contractAuthorList/fetchMultiGetContractAuthorInfo'],
}))(ComInfo);
