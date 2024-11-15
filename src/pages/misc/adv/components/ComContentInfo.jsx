import React, { useState, Fragment } from 'react';
import { EditOutlined, CloseOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Modal,
} from 'antd';
import { Link, connect } from 'umi';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import miscFn from '../../fn';
import ComContentEdit from './ComContentEdit';

export const ComtentInfo = props => {
  const {
    miscList: { info },
    useTypeList,
    parentElem,
    parentIdx,
    getData,
    dispatch,
  } = props;
  const { confirm } = Modal;
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // api -----
  const removeData = () => {
    let saveObj = { ...info };
    let tmpDelContentItem = { ...info.content[parentIdx] };
    tmpDelContentItem.is_delete = '1';

    if (tmpDelContentItem.lyrics) {
      tmpDelContentItem.lyrics = tmpDelContentItem.lyrics.map((elem) => ({ ...elem, is_delete: '1' }));
    }

    if (tmpDelContentItem.record) {
      tmpDelContentItem.record = tmpDelContentItem.record.map((elem) => ({ ...elem, is_delete: '1' }));
    }

    saveObj.authorized_country_id = [];
    saveObj.content = [];
    saveObj.content.push(tmpDelContentItem);

    // dispatch
    dispatch({
      type: 'miscList/fecthEditMiscForm',
      payload: saveObj,
      callback: (result) => {
        if (result == 'ok') {
          getData();
        }
      }
    });
  }

  // ui -----
  // alert (remove)
  const showRemoveConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要刪除嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        removeData();
      },
      onCancel() { },
    });
  }

  // songAmountText
  const songAmountText = (setting) => {
    let tmpText = 0;

    if (!isNaN(parseFloat(setting.flat_fee))) {
      tmpText = commFn.calAdd(tmpText, setting.flat_fee);
    }

    if (!isNaN(parseFloat(setting.syn_fee))) {
      tmpText = commFn.calAdd(tmpText, setting.syn_fee);
    }

    if (!isNaN(parseFloat(setting.mech_flat_fee))) {
      tmpText = commFn.calAdd(tmpText, setting.mech_flat_fee);
    }

    return tmpText;
  }

  // recordAmountText
  const recordAmountText = (setting) => {
    let tmpText = 0;

    if (!isNaN(parseFloat(setting.amount))) {
      tmpText = commFn.calAdd(tmpText, setting.amount);
    }

    return tmpText;
  }

  // songAmountTextTr
  const songAmountTextTr = () => {
    return (
      <tr>
        <td colSpan="2">&nbsp;</td>
        <td
          className={styles.om_bg_green}
          style={{ textAlign: 'left', fontWeight: '700' }}
        >
          <p>Total</p>
        </td>
        <td
          className={styles.om_bg_green}
          style={{ textAlign: 'right', fontWeight: '700' }}
        >
          <p>{recordAmountText(parentElem)}</p>
        </td>
      </tr>
    );
  }

  // isrcUi
  const renIsrcUi = () => {
    return (
      (parentElem.isrc)
        ? (
          (parentElem.isrc_id)
            ? (
              <Link
                to={`/isrc/adv/${parentElem.isrc_id}`}
                target="_blank"
              >
                {parentElem.isrc}
              </Link>
            )
            : (<p>{parentElem.isrc}</p>)
        )
        : (<p>-</p>)
    );
  }

  return (
    <Fragment>
      <Row
        gutter={[64, 24]}
      >
        <Col
          xs={24}
          style={{ paddingBottom: '15px' }}
        >
          <div
            style={{ borderBottom: '3px solid #87B067', width: '100%', height: '35px' }}
          >
            <span
              style={{ display: 'inline-block', textAlign: 'center', color: '#fff', minWidth: '100px', backgroundColor: '#87B067', padding: '5px', float: 'left' }}
            >
              {parentIdx + 1}
            </span>
            {
              (!isEdit) && (
                <div style={{ marginLeft: '50%', textAlign: 'right' }}>
                  {
                    (isOpen)
                      ? (
                        <MinusCircleOutlined
                          style={{ fontSize: '20px' }}
                          onClick={() => {
                            setIsOpen(false);
                          }}
                        />
                      )
                      : (
                        <PlusCircleOutlined
                          style={{ fontSize: '20px' }}
                          onClick={() => {
                            setIsOpen(true);
                          }}
                        />
                      )
                  }
                  <EditOutlined
                    className={styles.om_sp_m_lb}
                    style={{ fontSize: '20px' }}
                    onClick={() => {
                      setIsEdit(true);
                    }}
                  />
                  <CloseOutlined
                    className={`${styles.om_sp_m_lb} ${styles.om_color_red}`}
                    style={{ fontSize: '20px' }}
                    onClick={() => {
                      showRemoveConfirm();
                    }}
                  />
                </div>
              )
            }
          </div>
        </Col>
      </Row>
      {
        (!isEdit)
          ? (
            <Fragment>
              <Row
                gutter={[64, 24]}
              >
                <Col md={8} xs={24}>
                  <p>
                    產品名稱：<span>{parentElem && parentElem.name}</span>
                  </p>
                </Col>
                <Col md={8} xs={24}>
                  <p>
                    使用方式：<span>{
                      (useTypeList && useTypeList.allList && useTypeList.allList.filter((aElem) => (aElem.id == parentElem.use_type_id)).length > 0)
                      && (useTypeList.allList.filter((aElem) => (aElem.id == parentElem.use_type_id))[0].name)
                    }</span>
                  </p>
                </Col>
              </Row>
              <Row
                gutter={[64, 24]}
              >
                <Col md={8} xs={24}>
                  <p>
                    型態：<span>{miscFn.converttypeIdToStr((parentElem && parentElem.type) ? (parentElem.type) : null)}</span>
                  </p>
                </Col>
                <Col md={8} xs={24}>
                  {
                    (parentElem.type != '2')
                      ? (
                        <p>
                          歌曲名稱：<span>{parentElem && parentElem.song_name}</span>
                        </p>
                      )
                      : (
                        <p>
                          藝人發行合約：
                          {
                            (parentElem)
                            && (
                              <Link
                                to={`/contract/contract_author/adv/${parentElem.contract_author_id}`}
                                target="_blank"
                              >
                                {
                                  (parentElem.contract_author_subcontract_code)
                                    ? (`${parentElem.contract_author_subcontract_code} (子約)`)
                                    : (parentElem.contract_author_code)
                                }
                              </Link>
                            )
                          }
                        </p>
                      )
                  }
                </Col>
                <Col md={8} xs={24}>
                  {
                    (parentElem.type != '2')
                      ? (
                        <p>
                          歌曲編號：
                          <Link
                            to={`/song/adv/id/${parentElem.song_id}`}
                            target="_blank"
                          >
                            {parentElem && parentElem.song_code}
                          </Link>
                          &nbsp;&nbsp;
                          <span>
                            {(parentElem && parentElem.distribution_format == '1') && ('(實體)')}
                            {(parentElem && parentElem.distribution_format == '2') && ('(數位)')}
                          </span>
                        </p>
                      )
                      : (
                        <p>
                          簽約對象：
                          <span>
                            {
                              (parentElem.settle_company_name)
                                ? (parentElem.settle_company_name)
                                : (
                                  (parentElem.subcontract_author_name)
                                    ? (parentElem.subcontract_author_name)
                                    : (
                                      (parentElem.subcontract_parent_author_name)
                                        ? (parentElem.subcontract_parent_author_name)
                                        : ('')
                                    )
                                )
                            }
                          </span>
                        </p>
                      )
                  }
                </Col>
              </Row>
              <Row gutter={[8, 0]}>
                <Col xs={24}>
                  <div className={styles.contentBBd}></div>
                </Col>
              </Row>
              <Row
                gutter={[64, 24]}
                style={{ display: (isOpen) ? ('flex') : ('none') }}
              >
                <Col
                  xs={24}
                  className={styles.om_overflow_auto}
                >
                  {
                    (parentElem.type != '2')
                      ? (
                        <div>
                          <p>詞曲</p>
                          <table
                            className={styles.formTable}
                            style={{ marginBottom: '24px' }}
                          >
                            <thead>
                              <tr>
                                <th>作者摘要</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                                <th style={{ width: '200px' }}>拆分類型</th>
                                <th>Flat Fee</th>
                                <th>Syn Fee</th>
                                <th>Mech Flat Fee</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                (parentElem.lyrics && parentElem.lyrics.length > 0)
                                  ? (
                                    parentElem.lyrics.map((lElem, lIdx) => (
                                      <tr key={`content_info_lyrics_${lIdx}`}>
                                        <td><p>{lElem.name}</p></td>
                                        <td><p>{lElem.song_right_type_name}</p></td>
                                        <td><p>{lElem.rights_ratio}</p></td>
                                        <td><p>{miscFn.convertSplitOptStr(lElem.split_type)}</p></td>
                                        {
                                          (lIdx == 0)
                                            ? (
                                              <Fragment>
                                                <td><p>{parentElem.flat_fee}</p></td>
                                                <td><p>{parentElem.syn_fee}</p></td>
                                                <td><p>{parentElem.mech_flat_fee}</p></td>
                                              </Fragment>
                                            )
                                            : (
                                              <Fragment>
                                                <td colSpan="3"><p>&nbsp;</p></td>
                                              </Fragment>
                                            )
                                        }
                                      </tr>
                                    ))
                                  )
                                  : (
                                    <tr>
                                      <td colSpan="4"><p>-</p></td>
                                      <td><p>{parentElem.flat_fee}</p></td>
                                      <td><p>{parentElem.syn_fee}</p></td>
                                      <td><p>{parentElem.mech_flat_fee}</p></td>
                                    </tr>
                                  )
                              }
                              <tr>
                                <td colSpan="5">&nbsp;</td>
                                <td
                                  className={styles.om_bg_yellow}
                                  style={{ textAlign: 'left', fontWeight: '700' }}
                                >
                                  <p>Total</p>
                                </td>
                                <td
                                  className={styles.om_bg_yellow}
                                  style={{ textAlign: 'right', fontWeight: '700' }}
                                >
                                  <p >{songAmountText(parentElem)}</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <p>錄音</p>
                          <table
                            className={styles.formTable}
                            style={{ marginBottom: '24px' }}
                          >
                            <thead>
                              <tr>
                                <th>ISRC</th>
                                <th>演唱人</th>
                                <th style={{ width: '200px' }}>拆分類型</th>
                                <th style={{ width: '100px' }}>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                (parentElem.record && parentElem.record.length > 0)
                                  ? (
                                    parentElem.record.map((rElem, rIdx) => (
                                      <tr key={`content_info_record_${rIdx}`}>
                                        <td>
                                          {
                                            (rIdx == 0)
                                              ? (renIsrcUi())
                                              : ('')
                                          }
                                        </td>
                                        <td><p>{rElem.name}</p></td>
                                        <td><p>{miscFn.convertSplitOptStr(rElem.split_type)}</p></td>
                                        <td><p>{(rIdx == 0) ? (parentElem.amount) : ('')}</p></td>
                                      </tr>
                                    ))
                                  )
                                  : (
                                    <tr>
                                      <td>
                                        {renIsrcUi()}
                                      </td>
                                      <td><p>-</p></td>
                                      <td><p>-</p></td>
                                      <td><p>{parentElem.amount}</p></td>
                                    </tr>
                                  )
                              }
                              {songAmountTextTr()}
                            </tbody>
                          </table>
                        </div>
                      )
                      : (
                        <div>
                          <p>錄音</p>
                          <table
                            className={styles.formTable}
                            style={{ marginBottom: '24px' }}
                          >
                            <thead>
                              <tr>
                                <th>ISRC</th>
                                <th>演唱人</th>
                                <th style={{ width: '200px' }}>拆分類型</th>
                                <th style={{ width: '100px' }}>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td><p>-</p></td>
                                <td><p>-</p></td>
                                <td>
                                  <p>{
                                    (parentElem.record && parentElem.record.length > 0 && parentElem.record[0].split_type)
                                      ? (miscFn.convertSplitOptStr(parentElem.record[0].split_type))
                                      : ('-')
                                  }</p>
                                </td>
                                <td><p>{parentElem.amount}</p></td>
                              </tr>
                              {songAmountTextTr()}
                            </tbody>
                          </table>
                        </div>
                      )
                  }
                </Col>
              </Row>
              <Row
                gutter={[64, 24]}
              >
                <Col xs={24}>
                  <p>備註 ：<br />{
                    (parentElem.notes)
                      ? (
                        parentElem.notes.split('\n').map((nElem, nIdx, arr) => (
                          <span key={`content_info_note_${nIdx}`}>
                            {nElem}
                            <br />
                          </span>
                        )))
                      : ('')
                  }</p>
                </Col>
              </Row>
              <Row
                gutter={[64, 24]}
              >
                <Col
                  xs={24}
                  style={{ marginBottom: '15px' }}
                >
                  <div
                    className={styles.contentBBd}
                    style={{ marginBottom: '0' }}
                  ></div>
                  <p
                    style={{ textAlign: 'right' }}
                  >
                    {
                      (parentElem.type == '1') && (
                        <Fragment>
                          <span
                            className={styles.om_bg_yellow}
                            style={{ display: 'inline-block', minWidth: '150px', padding: '16px', fontWeight: '700' }}
                          >
                            {songAmountText(parentElem)}
                          </span>
                        </Fragment>
                      )
                    }
                    &nbsp;&nbsp;
                    <span
                      className={styles.om_bg_green}
                      style={{ display: 'inline-block', minWidth: '150px', padding: '16px', fontWeight: '700' }}
                    >
                      {recordAmountText(parentElem)}
                    </span>
                  </p>
                </Col>
              </Row>
            </Fragment>
          )
          : (
            <ComContentEdit
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              parentIdx={parentIdx}
              parentElem={parentElem}
              getData={getData}
            />
          )
      }
    </Fragment>
  );
}

export default connect(({ miscList, useTypeList, loading }) => ({
  miscList,
  useTypeList,
}))(ComtentInfo);