import React, { useState, useEffect, Fragment } from 'react';
import { DollarOutlined, EditOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  Pagination,
  Spin,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Link, connect, history } from 'umi';
import ComAlbumPrepaidPageHint from './ComAlbumPrepaidPageHint';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';
import valid from '@/fn/valid';

export const ComAlbumPrepaidTw = props => {
  const {
    loading,
    dispatch,
    enterpriseList,
    settlePhaseList,
    settleAlbumList: { albumPreview },
    prepaidType,
    pageId,
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [editId, setEditId] = useState('0');

  // api -----
  const getData = (obj) => {
    dispatch({
      type: 'settleAlbumList/fetchMultiGetAlbumPreview',
      payload: {
        type: prepaidType,
        area: 'tw',
        page_current: (obj && obj.pageCurrent) ? obj.pageCurrent.toString() : pageCurrent.toString(),
        page_size: '200',
        agent_eid: enterpriseList.agent_eid,
        settle_phase_id: pageId,
        ui_settle_phase_type: (prepaidType == 'righ') ? ('1') : ('2'),
      },
    });
  }

  // mount
  useEffect(() => {
    getData();
  }, [pageId]);

  // save
  const onFinish = values => {
    setError([]);

    const saveObj = {
      is_no_selling: '0',
      settle_phase_id: pageId,
      id: editId,
      type: prepaidType,
      area: 'tw',
      amount: values.amount,
      hold_value: (prepaidType == 'reco') ? '0' : values.hold_value,
      after_tax: values.after_tax,
      agent_eid: enterpriseList.agent_eid,
    };

    dispatch({
      type: 'settleAlbumList/fetchUpdateAlbumPreview',
      payload: saveObj,
      callback: (result) => {
        if (result != '' && result != 'error') {
          setEditId('0');
          form.resetFields();
          getData();
        }
      }
    });
  }

  // ui -----
  // confirm
  const showConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要取消修改嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        setEditId('0');
        form.resetFields();
      },
      onCancel() { },
    });
  }

  const onFinishFailed = errorInfo => {
    setError(errorInfo.errorFields);
  };

  // page
  const changePage = (page) => {
    const nowPage = parseInt(page, 10);
    setPageCurrent(nowPage);
    getData({ pageCurrent: nowPage });
  }

  return (
    <Spin
      tip="Loading..."
      spinning={loading}
    >
      <PageHeaderWrapper
        title="台灣專輯清單"
        content={`計算期別：${(settlePhaseList.phaseList && settlePhaseList.phaseList.filter((elem) => elem.id == pageId).length > 0) ? (settlePhaseList.phaseList.filter((elem) => elem.id == pageId)[0]['phase']) : pageId}`}
      >
        <Card bordered={false}>
          <Row>
            <Col
              xs={24}
              className={styles.om_txt_align_r}
            >
              <Pagination
                className={styles.mo_m_b_8}
                defaultCurrent={pageCurrent}
                pageSize={200}
                showSizeChanger={false}
                total={
                  (albumPreview && albumPreview.all_number && albumPreview.all_number.origin_row)
                    ? (albumPreview.all_number.origin_row)
                    : (0)
                }
                onChange={(val) => {
                  changePage(val);
                }}
              />
            </Col>
          </Row>
          {
            (prepaidType == 'righ') && (
              <Fragment>
                <Row>
                  <Col xs={24}>
                    <ComAlbumPrepaidPageHint
                      type="not_sell_data"
                      data={
                        (albumPreview && albumPreview.not_sell_data && albumPreview.not_sell_data.count)
                          ? (albumPreview.not_sell_data.count)
                          : (0)
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col
                    xs={24}
                    className={styles.om_overflow_auto}
                  >
                    <table className={styles.formTable}>
                      <thead>
                        <tr>
                          <th>專輯編號</th>
                          <th>專輯名稱</th>
                          <th>發行日期</th>
                          <th>售價</th>
                          <th>批發價</th>
                          <th>&nbsp;</th>
                          <th style={{ display: (prepaidType == 'reco') ? ('none') : ('table-cell') }}>上期保留</th>
                          <th>結算量</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          (albumPreview && albumPreview.not_sell_data && albumPreview.not_sell_data.data) && (
                            albumPreview.not_sell_data.data.map((elem, idx) => (
                              <tr key={`tr_not_sell_data_${idx}`}>
                                <td><p>{elem.album_code}</p></td>
                                <td><p>{elem.album_name_zh}</p></td>
                                <td><p>{elem.release_date}</p></td>
                                <td><p>{elem.price}</p></td>
                                <td><p>{elem.price_untax}</p></td>
                                <td>{(elem.prepaid_number && parseFloat(elem.prepaid_number) > 0) && (<DollarOutlined className={`${styles.om_icon_style} ${styles.om_color_yellow}`} />)}</td>
                                <td style={{ display: (prepaidType == 'reco') ? ('none') : ('table-cell') }}><p>{elem.hold_value}</p></td>
                                <td><p>{elem.settle_number}</p></td>
                              </tr>
                            ))
                          )
                        }
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </Fragment>
            )
          }
          <Row>
            <Col xs={24}>
              <ComAlbumPrepaidPageHint
                type="sell_data"
                data={
                  {
                    origin_row: (albumPreview && albumPreview.all_number && albumPreview.all_number.origin_row)
                      ? (albumPreview.all_number.origin_row)
                      : (0),
                    valid_row: (albumPreview && albumPreview.sell_data && albumPreview.sell_data.valid_row)
                      ? (albumPreview.sell_data.valid_row)
                      : (0),
                    valid_sum: (albumPreview && albumPreview.sell_data && albumPreview.sell_data.valid_sum)
                      ? (albumPreview.sell_data.valid_sum)
                      : (0),
                  }}
              />
            </Col>
          </Row>
          <Row>
            <Col
              xs={24}
              className={styles.om_overflow_auto}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <table className={styles.formTable}>
                  <thead>
                    <tr>
                      <th>專輯編號</th>
                      <th style={{ maxWidth: '200px' }}>專輯名稱</th>
                      <th>發行日期</th>
                      <th style={{ width: '80px' }}>售價</th>
                      <th>批發價</th>
                      <th style={{ width: '80px' }}>當期銷售</th>
                      <th>&nbsp;</th>
                      <th>資料期別</th>
                      <th
                        style={{
                          width: '80px',
                          display: (prepaidType == 'reco') ? ('none') : ('table-cell')
                        }}
                      >本期保留</th>
                      <th
                        style={{ display: (prepaidType == 'reco') ? ('none') : ('table-cell') }}
                      >上期保留</th>
                      <th>結算量</th>
                      <th style={{ width: '200px' }}>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      (albumPreview && albumPreview.sell_data && albumPreview.sell_data.data) && (
                        albumPreview.sell_data.data.map((elem, idx) => (
                          <Fragment key={`tr_sell_data_${idx}`}>
                            <tr>
                              <td><p>{elem.album_code}</p></td>
                              <td style={{ maxWidth: '200px' }}><p>{elem.album_name_zh}</p></td>
                              <td><p>{elem.release_date}</p></td>
                              <td><p>{elem.after_tax}</p></td>
                              <td><p>{elem.before_tax}</p></td>
                              <td><p>{elem.amount}</p></td>
                              <td>{(elem.prepaid_number && parseFloat(elem.prepaid_number) > 0) && (<DollarOutlined className={`${styles.om_icon_style} ${styles.om_color_yellow}`} />)}</td>
                              <td><p>{elem.data_phase}</p></td>
                              <td style={{ display: (prepaidType == 'reco') ? ('none') : ('table-cell') }}><p>{elem.hold_value}</p></td>
                              <td style={{ display: (prepaidType == 'reco') ? ('none') : ('table-cell') }}><p>{elem.last_hold_value}</p></td>
                              <td><p>{elem.settle_number}</p></td>
                              <td>
                                <EditOutlined
                                  style={{ display: (editId == '0') ? 'inline-block' : 'none' }}
                                  className={styles.om_icon_style}
                                  onClick={() => {
                                    setEditId(elem.id);
                                  }}
                                />
                              </td>
                            </tr>
                            <tr style={{ display: (editId == elem.id) ? 'table-row' : 'none' }}>
                              <td><p>&nbsp;</p></td>
                              <td><p>&nbsp;</p></td>
                              <td><p>&nbsp;</p></td>
                              {
                                (editId == elem.id)
                                  ? (
                                    <Fragment>
                                      <td>
                                        <Form.Item
                                          name="after_tax"
                                          initialValue=""
                                          rules={[
                                            {
                                              validator(rule, values, callback) {
                                                let result = valid.checkRequired(values);

                                                if (result != false) {
                                                  callback();
                                                } else {
                                                  callback(valid.checkRequired_msg);
                                                }
                                              }
                                            },
                                            {
                                              validator(rule, values, callback) {
                                                let result = valid.checkPostiveNumberAndZero(values);

                                                if (result != false) {
                                                  callback();
                                                } else {
                                                  callback(valid.checkPostiveNumberAndZero_msg);
                                                }
                                              }
                                            }
                                          ]}
                                        >
                                          <Input />
                                        </Form.Item>
                                      </td>
                                      <td><p>&nbsp;</p></td>
                                      <td>
                                        <Form.Item
                                          name="amount"
                                          initialValue=""
                                          rules={[
                                            {
                                              validator(rule, values, callback) {
                                                let result = valid.checkRequired(values);

                                                if (result != false) {
                                                  callback();
                                                } else {
                                                  callback(valid.checkRequired_msg);
                                                }
                                              }
                                            },
                                            {
                                              validator(rule, values, callback) {
                                                let result = valid.checkPostiveNumberAndZero(values);

                                                if (result != false) {
                                                  callback();
                                                } else {
                                                  callback(valid.checkPostiveNumberAndZero_msg);
                                                }
                                              }
                                            }
                                          ]}
                                        >
                                          <Input />
                                        </Form.Item>
                                      </td>
                                      <td><p>&nbsp;</p></td>
                                      <td><p>&nbsp;</p></td>
                                      <td style={{ display: (prepaidType == 'reco') ? ('none') : ('table-cell') }}>
                                        <Form.Item
                                          name="hold_value"
                                          initialValue=""
                                          rules={[
                                            {
                                              validator(rule, values, callback) {
                                                let result = valid.checkRequired(values);

                                                if (prepaidType == 'reco' || result) {
                                                  callback();
                                                } else {
                                                  callback(valid.checkRequired_msg);
                                                }
                                              }
                                            },
                                            {
                                              validator(rule, values, callback) {
                                                let result = valid.checkPostiveNumberAndZero(values);

                                                if (prepaidType == 'reco' || result) {
                                                  callback();
                                                } else {
                                                  callback(valid.checkPostiveNumberAndZero_msg);
                                                }
                                              }
                                            }
                                          ]}
                                        >
                                          <Input />
                                        </Form.Item>
                                      </td>
                                      <td style={{ display: (prepaidType == 'reco') ? ('none') : ('table-cell') }}><p>&nbsp;</p></td>
                                      <td><p>&nbsp;</p></td>
                                      <td>
                                        <Button
                                          className={styles.om_sp_m_lb}
                                          onClick={() => {
                                            showConfirm();
                                          }}
                                        >取消</Button>
                                        <Button
                                          className={styles.om_sp_m_lb}
                                          type="primary"
                                          onClick={() => form?.submit()}
                                        >送出</Button>
                                      </td>
                                    </Fragment>
                                  )
                                  : (
                                    <Fragment>
                                      <td colSpan="5"></td>
                                      <td style={{ display: (prepaidType == 'reco') ? ('none') : ('table-cell') }}></td>
                                      <td style={{ display: (prepaidType == 'reco') ? ('none') : ('table-cell') }}></td>
                                      <td colSpan="2"></td>
                                    </Fragment>
                                  )
                              }
                            </tr>
                          </Fragment>
                        ))
                      )
                    }
                  </tbody>
                </table>
              </Form>
            </Col>
          </Row>
        </Card >
      </PageHeaderWrapper>
    </Spin>
  );
}

export default connect(({ enterpriseList, settlePhaseList, settleAlbumList, loading }) => ({
  enterpriseList,
  settlePhaseList,
  settleAlbumList,
  loading: loading.models.settleAlbumList,
}))(ComAlbumPrepaidTw);