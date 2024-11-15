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

export const ComAlbumPrepaidException = props => {
  const {
    loading,
    dispatch,
    enterpriseList,
    settlePhaseList,
    settleAlbumList: { multiChangeId, albumPreview },
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
        area: 'exception',
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
      settle_phase_id: pageId,
      id: editId,
      type: prepaidType,
      area: 'exception',
      amount: values.amount,
      before_tax: values.before_tax,
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
        title="例外專輯清單"
        content={`計算期別：${(settlePhaseList.phaseList && settlePhaseList.phaseList.filter((elem) => elem.id == pageId).length > 0) ? (settlePhaseList.phaseList.filter((elem) => elem.id == pageId)[0]['phase']) : pageId}`}
      >
        <Card bordered={false}>
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
                      <th>型態</th>
                      <th>使用方式</th>
                      <th>地區</th>
                      <th>單價(未稅)</th>
                      <th>銷售量</th>
                      <th>稅率</th>
                      <th>服務費</th>
                      <th>營業稅</th>
                      <th>原收入</th>
                      <th>收入</th>
                      <th>資料期別</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      (albumPreview && albumPreview.sell_data && albumPreview.sell_data.data) && (
                        albumPreview.sell_data.data.map((elem, idx) => (
                          <tr key={`tr_sell_data_${idx}`}>
                            <td><p>{elem.album_code}</p></td>
                            <td style={{ maxWidth: '200px' }}><p>{elem.album_name_zh}</p></td>
                            <td><p>{elem.release_date}</p></td>
                            <td><p>{elem.produce_type}</p></td>
                            <td><p>Mechanical</p></td>
                            <td><p>{elem.country_code}</p></td>
                            <td><p>{elem.before_tax}</p></td>
                            <td><p>{elem.amount}</p></td>
                            <td><p>{elem.tax_rate}</p></td>
                            <td><p>{elem.royality}</p></td>
                            <td><p>{elem.sale_tax}</p></td>
                            <td><p>{/*TODO: 需再確認；原收入：單價*結算數量*/}0</p></td>
                            <td><p>{/*TODO: 需再確認；收入：單價*結算數量*稅率*匯率*服務費*(1-營業稅%)*/}0</p></td>
                            <td><p>{elem.data_phase}</p></td>
                          </tr>
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
}))(ComAlbumPrepaidException);