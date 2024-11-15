import React, { Fragment, useState } from 'react';
import { EditOutlined, MinusCircleOutlined, PlusCircleOutlined, LogoutOutlined, RetweetOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Card,
  Tooltip,
} from 'antd';
import { Link } from 'umi';
import styles from '@/style/style.less';
import cusStyles from './index.less';
import commFn from '@/fn/comm';

const DetailPanel = props => {
  const {
    history,
    rightsList,
    agencyList,
    songCode,
  } = props;
  const [recordBtns, setRecordBtns] = useState([]);

  // ui -----
  const btnList = (elemId, contractId) => {
    return (
      <Fragment>
        {/* TODO: 等後端完成再開啟 */}
        {/* {
          (contractId)
            ? (
              <Tooltip title="合約轉換">
                <Link to={`/contract/contract_song/transfer/${contractId}`}>
                  <LogoutOutlined className={styles.om_icon_style} />
                </Link>
              </Tooltip>
            )
            : (null)
        }
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Tooltip title="單曲合約轉換">
          <Link to={`/song/rights/transfer/id/${elemId}/song_code/${songCode}`}>
            <RetweetOutlined className={styles.om_icon_style} />
          </Link>
        </Tooltip>
        &nbsp;&nbsp;&nbsp;&nbsp; */}
        <Tooltip title="權利設定 - 修改">
          <Link to={`/song/rights/update/id/${elemId}/song_code/${songCode}`}>
            <EditOutlined className={styles.om_icon_style} />
          </Link>
        </Tooltip>
      </Fragment>
    )
  }

  const clickRecordBtn = (idx) => {
    let newRecordBtns = [...recordBtns];

    if (newRecordBtns[idx]) {
      newRecordBtns[idx] = false;
    } else {
      newRecordBtns[idx] = true;
    }
    setRecordBtns(newRecordBtns);
  }

  return (
    <Fragment>
      {
        (rightsList)
          ? (rightsList.map((elem, idx, arr) => {
            return (
              <Card
                type="inner"
                title={
                  <Row gutter={[8, 0]}>
                    <Col md={8} xs={24}>
                      {
                        (elem.contract_song_id)
                          ? (
                            <Link
                              to={`/contract/contract_song/adv/id/${elem.contract_song_id}`}
                              target="_blank"
                            >
                              {elem.contract_song_code}
                            </Link>
                          )
                          : (<p className={styles.om_r_0}>{elem.contract_song_code}</p>)
                      }
                    </Col>
                    <Col md={8} xs={24}>
                      <p className={styles.om_r_0}>
                        {
                          (elem.related_song_code)
                            ? (
                              <Link
                                to={`/song/adv/song_code/${elem.related_song_code}`}
                                target="_blank"
                              >
                                {elem.related_song_name}
                              </Link>
                            )
                            : ('')
                        }
                      </p>
                    </Col>
                    <Col md={8} xs={24} className={styles.om_txt_align_r}>
                      {(!history) ? (btnList(elem.rights_id, elem.contract_id)) : (null)}
                    </Col>
                  </Row>
                }
                style={{ marginBottom: '24px' }}
                key={idx}
              >
                <Row gutter={[8, 0]}>
                  <Col md={8} xs={24}>
                    <p>
                      適用型態：
                      <span
                        style={{ display: (elem.is_entity == '1') ? 'inline-block' : 'none' }}
                        className={`${cusStyles.typeIcon} ${cusStyles.isEntityColor}`}
                      >實</span>
                      <span
                        style={{ display: (elem.is_digital == '1') ? 'inline-block' : 'none' }}
                        className={`${cusStyles.typeIcon} ${cusStyles.isDigitalColor}`}
                      >數</span>
                    </p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>權利：<span>{elem.rights_type}</span></p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>比例：<span>{elem.rights_ratio}</span>{(elem.lyrics_ratio) ? (<span>（L:{elem.lyrics_ratio}）</span>) : ""}</p>
                  </Col>
                </Row>
                <Row gutter={[8, 0]}>
                  <Col md={8} xs={24}>
                    <p>作者本名：<span>{elem.name}</span></p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>權利起始日：<span>{elem.rights_start}</span></p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>OP：<span>{(elem.op_company_nickname) ? (elem.op_company_nickname) : (elem.op_author_name)}</span></p>
                  </Col>
                </Row>
                <Row gutter={[8, 0]}>
                  <Col md={8} xs={24}>
                    <p>作者筆名：<span>{elem.pen_name}</span></p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>權利到期日：<span>{elem.rights_end}</span></p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>SP：<span>{elem.sp_company_nickname}</span></p>
                  </Col>
                </Row>
                <Row gutter={[8, 0]}>
                  <Col md={8} xs={24}>
                    <p>代理地區：<span>{(agencyList && agencyList[idx]) ? agencyList[idx] : ''}</span></p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>
                      <span
                        style={{ display: 'inline-block', verticalAlign: 'top' }}
                      >代理到期日：</span>
                      <span
                        style={{ display: 'inline-block' }}
                      >
                        <span
                          className={(!history && elem.agency_end && commFn.compareDateExpired(elem.agency_end)) ? (styles.om_color_red) : ''}
                        >
                          {elem.agency_end}
                        </span>
                        {
                          (elem.is_entity == '1' && elem.early_terminate_date)
                            ? (
                              <Fragment>
                                <br /><span className={styles.om_color_red}>{elem.early_terminate_date} 提前終止</span>
                              </Fragment>
                            )
                            : ('')
                        }
                      </span>
                    </p>
                  </Col>
                  <Col md={8} xs={24}>
                    <p>結算對象：<span>{(elem.settle_company_name) ? (elem.settle_company_name) : (elem.settle_author_name)}</span></p>
                  </Col>
                </Row>
                <Row gutter={[8, 0]}>
                  <Col xs={24}>
                    <div className={styles.contentBBd}></div>
                  </Col>
                </Row>
                <Row
                  gutter={[8, 0]}
                  className={cusStyles.editRecord}
                >
                  <Col
                    xs={24}
                    onClick={() => {
                      clickRecordBtn(idx);
                    }}
                  >
                    <PlusCircleOutlined
                      className={styles.om_icon_style}
                      style={{ display: (recordBtns[idx] && recordBtns[idx] == true) ? 'none' : 'inline-block' }}
                    />
                    <MinusCircleOutlined
                      className={styles.om_icon_style}
                      style={{ display: (recordBtns[idx] && recordBtns[idx] == true) ? 'inline-block' : 'none' }}
                    />
                    <p className={cusStyles.text}>編輯紀錄</p>
                  </Col>
                </Row>
                <Row gutter={[8, 0]} style={{ display: (recordBtns[idx] && recordBtns[idx] == true) ? 'block' : 'none' }}>
                  <Col xs={24}>
                    <p>修改歷程：<span>{/*...*/}</span></p>
                  </Col>
                </Row>
              </Card>
            );
          })
          )
          : (null)
      }
    </Fragment>
  );
}

export default DetailPanel;