import { PlusCircleOutlined, MinusCircleOutlined, DollarOutlined, CustomerServiceOutlined, EditOutlined } from '@ant-design/icons';
import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  message,
  Tooltip,
  Table,
} from 'antd';
import { Link, connect, history } from 'umi';
import ComPoint from '../../components/ComPoint';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const ComDiscTable = props => {
  const {
    isIdx,
    discNum,
    data,
    dispatch,
    loadingGetPrepaid,
    albumList,
  } = props;
  const cusColor = {
    green: '#F1FFE8',
    yellow: '#FFF8E4'
  };

  return (
    <Card
      type="inner"
      title={`Disc ${discNum} ${(data.disc_type) ? (`- ${data.disc_type}`) : ''}`}
      bordered={false}
      className={`${styles.colorBdCard} ${styles.titleNoBBd} ${styles.cardTopSpace}`}
      bodyStyle={{ padding: '15px 0' }}
      loading={loadingGetPrepaid}
    >
      <Row gutter={[0, 0]}>
        <Col
          xs={24}
          className={styles.om_overflow_auto}
        >
          <table className={styles.formTable}>
            <thead>
              <tr>
                <th style={{ width: '4%' }}>曲序</th>
                <th style={{ width: '9%' }}>歌名</th>
                <th style={{ width: '10%' }}>演唱人</th>
                <th style={{ width: '4%' }}>ISRC</th>
                <th style={{ width: '4%' }}>&nbsp;</th>
                <th style={{ width: '10%' }}>合約</th>
                <th style={{ width: '15%' }}>錄音結算</th>
                <th style={{ width: '1%', paddingLeft: '0', paddingRight: '0' }}>F</th>
                <th style={{ width: '1%', paddingLeft: '0', paddingRight: '0' }}>P</th>
                <th style={{ width: '1%', paddingLeft: '0', paddingRight: '0' }}>&nbsp;</th>
                <th style={{ width: '1%', paddingLeft: '0', paddingRight: '0' }}>R</th>
                <th style={{ width: '1%', paddingLeft: '0', paddingRight: '0' }}>&nbsp;</th>
                <th style={{ width: '1%', paddingLeft: '0', paddingRight: '0' }}>N</th>
                <th style={{ width: '1%', paddingLeft: '0', paddingRight: '0' }}>M</th>
                <th style={{ width: '4%' }}>權利</th>
                <th style={{ width: '4%' }}>比例</th>
                <th style={{ width: '14%' }}>作者</th>
                <th style={{ width: '15%' }}>詞曲結算</th>
              </tr>
            </thead>
            <tbody>
              {
                (data && data.content && data.content.length > 0)
                  ? (
                    <Fragment>
                      {
                        data.content.map((elem, idx) => (

                          <tr key={`tr_${idx}`}>
                            <td><p>{elem.song_seq}</p></td>
                            <td><p>{elem.song_name}</p></td>
                            <td><p>{elem.singer}</p></td>
                            <td><p>{elem.isrc}</p></td>
                            <td>
                              <p>{
                                (elem.reco_split && elem.reco_split.length > 0)
                                  ? (elem.reco_split.map((rElem, rIdx) => {
                                    if (rIdx == 0) {
                                      return (<Fragment key={`reco_${rIdx}`}>{rElem.numerator}/{rElem.denominator}</Fragment>)
                                    }

                                    return (<Fragment key={`reco_${rIdx}`}><br />{rElem.numerator}/{rElem.denominator}</Fragment>)
                                  }))
                                  : ('')
                              }
                              </p>
                            </td>
                            <td>
                              <p>{
                                (elem.reco_split && elem.reco_split.length > 0)
                                  ? (elem.reco_split.map((rElem, rIdx) => {
                                    if (rIdx == 0) {
                                      return (<Fragment key={`reco_${rIdx}`}>{rElem.contract_code}</Fragment>)
                                    }

                                    return (<Fragment key={`reco_${rIdx}`}><br />{rElem.contract_code}</Fragment>)
                                  }))
                                  : ('')
                              }
                              </p>
                            </td>

                            <td style={{ backgroundColor: cusColor.green }}>
                              <p>{
                                (elem.reco_split && elem.reco_split.length > 0)
                                  ? (elem.reco_split.map((rElem, rIdx) => {
                                    if (rIdx == 0) {
                                      return (<Fragment key={`reco_${rIdx}`}>{rElem.company_name}</Fragment>)
                                    }

                                    return (<Fragment key={`reco_${rIdx}`}><br />{rElem.company_name}</Fragment>)
                                  }))
                                  : ('')
                              }
                              </p>
                            </td>
                            <td style={{ paddingLeft: '0', paddingRight: '0' }}><ComPoint isVal={elem.is_debut} cusColor="green" /></td>
                            <td style={{ paddingLeft: '0', paddingRight: '0', backgroundColor: cusColor.yellow }}><ComPoint isVal={elem.is_song_calc} /></td>
                            <td style={{ paddingLeft: '0', paddingRight: '0', backgroundColor: cusColor.yellow }}><ComPoint isVal={elem.is_song_right_calc} /></td>
                            <td style={{ paddingLeft: '0', paddingRight: '0', backgroundColor: cusColor.green }}><ComPoint isVal={elem.is_record_calc} /></td>
                            <td style={{ paddingLeft: '0', paddingRight: '0', backgroundColor: cusColor.green }}><ComPoint isVal={elem.is_record_right_calc} /></td>
                            <td style={{ paddingLeft: '0', paddingRight: '0' }}><ComPoint isVal={elem.is_nm_song_calc} cusColor="blue" /></td>
                            <td style={{ paddingLeft: '0', paddingRight: '0' }}><ComPoint isVal={elem.is_nm_record_calc} cusColor="blue" /></td>
                            <td>
                              <p>{
                                (elem.righ_split && elem.righ_split.length > 0)
                                  ? (elem.righ_split.filter((fElem) => fElem.is_entity == '1').map((rElem, rIdx) => {
                                    if (rIdx == 0) {
                                      return (<Fragment key={`right_type_${rIdx}`}>{rElem.song_rights_type}</Fragment>)
                                    }

                                    return (<Fragment key={`right_type_${rIdx}`}><br />{rElem.song_rights_type}</Fragment>)
                                  }))
                                  : ('')
                              }
                              </p>
                            </td>
                            <td>
                              <p>{
                                (elem.righ_split && elem.righ_split.length > 0)
                                  ? (elem.righ_split.filter((fElem) => fElem.is_entity == '1').map((rElem, rIdx) => {
                                    if (rIdx == 0) {
                                      return (<Fragment key={`right_split_${rIdx}`}>{rElem.split_ratio}</Fragment>)
                                    }

                                    return (<Fragment key={`right_split_${rIdx}`}><br />{rElem.split_ratio}</Fragment>)
                                  }))
                                  : ('')
                              }
                              </p>
                            </td>
                            <td>
                              <p>{
                                (elem.righ_split && elem.righ_split.length > 0)
                                  ? (elem.righ_split.filter((fElem) => fElem.is_entity == '1').map((rElem, rIdx) => {
                                    if (rIdx == 0) {
                                      return (<Fragment key={`right_author_${rIdx}`}>{rElem.author}</Fragment>)
                                    }

                                    return (<Fragment key={`right_author_${rIdx}`}><br />{rElem.author}</Fragment>)
                                  }))
                                  : ('')
                              }
                              </p>
                            </td>
                            <td style={{ backgroundColor: cusColor.yellow }}>
                              <p>{
                                (elem.righ_split && elem.righ_split.length > 0)
                                  ? (elem.righ_split.filter((fElem) => fElem.is_entity == '1').map((rElem, rIdx) => {
                                    if (rIdx == 0) {
                                      return (<Fragment key={`right_song_${rIdx}`}>{(rElem.settle_company_name) ? (rElem.settle_company_name) : (rElem.settle_author_name)}</Fragment>)
                                    }

                                    return (<Fragment key={`right_song_${rIdx}`}><br />{(rElem.settle_company_name) ? (rElem.settle_company_name) : (rElem.settle_author_name)}</Fragment>)
                                  }))
                                  : ('')
                              }
                              </p>
                            </td>
                          </tr>
                        ))
                      }
                    </Fragment>
                  )
                  : (null)
              }
            </tbody>
          </table>
        </Col>
      </Row>
    </Card >
  );
}

export default ComDiscTable;