import React, { useState, useEffect, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { UploadOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import {
  Spin,
  Row,
  Col,
  Card,
  DatePicker,
  Tooltip,
  Upload,
  Table,
  message,
  notification,
  Tag,
} from 'antd';
import styles from '@/style/style.less';
import moment from 'moment';
import { connect } from 'umi';


const exchangeRateApple = props => {
  const {
    loadingExchangeRateList,
    loadingEnterpriseList,
    exchangeRateList,
    exchangeRateList: { list, optCurrency, latest_month },
    dispatch,
    enterpriseList,
  } = props;
  const [selectMonth, setSelectMonth] = useState('');

  // api -----
  // latest month
  const getDefaultMonth = () => {
    dispatch({
      type: 'exchangeRateList/fetchGetLatestMonth',
      payload: {
        is_apple: '1',
        agent_eid: enterpriseList.agent_eid
      },
      callback: result => {
        const d = new Date();
        const monthAry = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        const thisMonth = `${d.getFullYear()}_${monthAry[d.getMonth()]}`;
        const dateValue = (result === null || result == '_' || result == '' || result == 'error') ? thisMonth : result;
        const formatDay = dateValue.replace('_', '-');
        getData(formatDay);
      }
    })
  }

  // getData
  const getData = (date) => {
    let nowMon = (date) ? (moment(date)) : ((selectMonth) ? (selectMonth) : (moment()));
    setSelectMonth(nowMon);
    dispatch({
      type: 'exchangeRateList/fetchGetAppleList',
      payload: {
        month: nowMon.format('yyyy_MM'),
        agent_eid: enterpriseList.agent_eid
      },
    });

    notImportList(nowMon.format('yyyy'));
  }

  // 未上傳月份
  const notImportList = (nowYear) => {
    dispatch({
      type: 'exchangeRateList/fetchGetAppleNotImportList',
      payload: {
        year: nowYear,
        agent_eid: enterpriseList.agent_eid
      },
    });
  }

  useEffect(() => {
    getDefaultMonth();
  }, []);

  const columns = [
    {
      title: '年/月',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: '幣別',
      dataIndex: 'currency',
      key: 'currency',
    },
    {
      title: '匯率',
      dataIndex: 'exchange_rate',
      key: 'exchange_rate',
    },
  ]

  const errHandler = (msg, des) => {
    notification.error({
      duration: 0,
      icon: <ExclamationCircleFilled style={{ color: '#F9B006' }} />,
      message: msg,
      description: des
    });
  }
  const handleUploadOnChange = (file) => {
    if (file.status === 'done') {
      getData();
      message.success(`"${file.name}" 檔案上傳成功`);
    } else if (file.status === 'error') {
      if (file.response && file.response.message) {
        errHandler(`"${file.name}" 檔案上傳失敗`, file.response.message);
      } else {
        errHandler(`"${file.name}" 檔案上傳失敗`);
      }
    }
  }

  return (
    <Spin
      tip="Loading..."
      spinning={loadingExchangeRateList}
    >
      <PageHeaderWrapper
        title="Apple(美金)"
      >
        <Card bordered={false}>
          <Row>
            <Col xs={24} md={20}>
              <DatePicker
                picker="month"
                format="YYYY_MM"
                value={selectMonth}
                onChange={(e) => {
                  getData((e) ? (e.format('YYYY-MM')) : (null));
                }}
              />
              <div
                className={styles.om_color_red}
                style={{
                  display: 'inline-block',
                  paddingLeft: '10px',
                  paddingTop: '10px'
                }} >
                *未上傳月份：
                {(exchangeRateList.appleNotImportList) && (exchangeRateList.appleNotImportList.map((item, idx) => <Tag color="error" key={idx} style={{ marginBottom: '5px' }}>{item}</Tag>))}
              </div>
            </Col>
            <Col
              xs={24} md={4}
              style={{ textAlign: 'right' }}
            >
              <Upload
                name="files[]"
                showUploadList={false}
                action={`${window.FRONTEND_WEB}/exchange_rate_apple/import`}
                accept=".csv"
                method="post"
                data={() => {
                  return {
                    agent_eid: enterpriseList.agent_eid
                  }
                }}
                onChange={({ file }) => handleUploadOnChange(file)}
              >
                <Tooltip title="匯入檔案">
                  <UploadOutlined
                    className={`${styles.om_icon_style} ${styles.om_sp_m_lb}`}
                    style={{ marginLeft: '18px' }}
                  />
                </Tooltip>
              </Upload>
            </Col>
          </Row>
          <Row>
            <Col xs={24} >
              <Table
                pagination={false}
                loading={loadingExchangeRateList}
                columns={columns}
                dataSource={(selectMonth && list) ? (list) : ([])}
                rowKey="id"
              />
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    </Spin>
  );
};

export default connect(({ exchangeRateList, loading, enterpriseList }) => ({
  exchangeRateList,
  enterpriseList,
  loadingExchangeRateList: loading.models.exchangeRateList,
}))(exchangeRateApple);
