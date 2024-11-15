import React, { useState, useEffect, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { EditOutlined, PlusOutlined, UploadOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import {
  Spin,
  Row,
  Col,
  Card,
  Form,
  Select,
  Button,
  Upload,
  Tooltip,
  Table,
  DatePicker,
  InputNumber,
  Modal,
  message,
  notification,
} from 'antd';
import styles from '@/style/style.less';
import moment from 'moment';
import { connect } from 'umi';
import valid from '@/fn/valid';

const { Option } = Select;

const exchangeRateList = props => {
  const {
    loading,
    dispatch,
    exchangeRateList: { list, optCurrency, phase },
    enterpriseList,
  } = props;
  const { confirm } = Modal;
  const [form] = Form.useForm();
  const [formAdd] = Form.useForm();
  const [selectMonth, setSelectMonth] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.id === editingKey;

  // api -----
  // getData
  const getData = (date) => {
    let nowMon = (date) ? (moment(date)) : ((selectMonth) ? (selectMonth) : (moment()));

    setSelectMonth(nowMon);
    dispatch({
      type: 'exchangeRateList/fetchGetList',
      payload: {
        month: nowMon.format('yyyy_MM'),
        agent_eid: enterpriseList.agent_eid
      },
    });
  };

  // latest month
  const getDefaultMonth = () => {
    dispatch({
      type: 'exchangeRateList/fetchGetLatestMonth',
      payload: {
        is_apple: '0',
        agent_eid: enterpriseList.agent_eid
      },
      callback: result => {
        if (result != '' && result != 'error') {
          const d = new Date();
          const monthAry = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
          const thisMonth = `${d.getFullYear()}_${monthAry[d.getMonth()]}`;
          const dateValue = (result === null) ? thisMonth : result;
          const formatDay = dateValue.replace('_', '-');
          getData(formatDay);
        }
      }
    })
  }

  // onFinish
  const onFinish = (value) => {
    if (value) {
      dispatch({
        type: 'exchangeRateList/fetchAddExchangeRate',
        payload: {
          month: value.month.format('yyyy_MM'),
          currency_id: value.currency,
          exchange_rate: value.exchange_rate,
          agent_eid: enterpriseList.agent_eid,
        },
        callback: res => {
          if (res) {
            setModalVisible(false);
            formAdd.setFieldsValue({
              month: undefined,
              currency: undefined,
              exchange_rate: undefined,
            });
            cancel();
            getData();
          }
        },
      });
    }
  };

  // mount
  useEffect(() => {
    getDefaultMonth();
  }, []);

  // TODO: delData
  const delData = (id) => {
    // del
    // getData();
  }

  // ui -----
  // confirm
  const showConfirm = (useType, text, para) => {
    confirm({
      title: '',
      icon: '',
      content: text,
      okText: '確定',
      cancelText: '取消',
      onOk() {
        switch (useType) {
          case 'cancelEdit':
            cancel();
            break;
          case 'del':
            delData(para);
            break;
        }
      },
      onCancel() { },
    });
  }

  // table - 單行編輯動作
  const edit = (record) => {
    form.setFieldsValue({
      month: '',
      currency: '',
      exchange_rate: '',
      ...record,
    });
    setEditingKey(record.id);
  };

  // 取消編輯
  const cancel = () => {
    setEditingKey('');
  };

  // 儲存變動
  const save = async (id) => {
    try {
      const row = await form.validateFields();

      dispatch({
        type: 'exchangeRateList/fetchPatchExchangeRate',
        payload: {
          id,
          exchange_rate: row.exchange_rate,
          agent_eid: enterpriseList.agent_eid
        },
        callback: res => {
          if (res && res === 'ok') {
            cancel();
          }
          getData();
        },
      });
    } catch (errInfo) {
    }
  };

  // table 對應內容
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
      editable: true,
    },
    {
      dataIndex: 'id',
      key: 'id',
      width: '250px',
      render: (_, record) => {
        const editable = isEditing(record);
        return (editable)
          ? (
            <Fragment>
              <Button
                className={styles.om_sp_m_lb}
                onClick={() => {
                  showConfirm('cancelEdit', '確定要取消修改嗎？');
                }}
              >取消</Button>
              <Button
                type='primary'
                className={styles.om_sp_m_lb}
                onClick={() => {
                  save(record.id);
                }}
              >
                儲存
            </Button>
            </Fragment>
          )
          : (
            <Fragment>
              <EditOutlined
                style={{ display: (editingKey !== '') ? 'none' : 'inline-block' }}
                className={styles.om_icon_style}
                onClick={() => {
                  edit(record);
                }}
              />
            </Fragment>
          );
      },
    },
  ];

  // 轉換 columns
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  // 編輯時 ui
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = <InputNumber step={0.001} min={0} />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `請輸入 ${title}!`,
              },
              {
                validator(rule, values, callback) {
                  if (!valid.checkPostiveNumber(values)) {
                    callback(valid.checkPostiveNumber_msg);
                  } else {
                    callback();
                  }
                }
              }
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  // 上傳檔案錯誤顯示
  const errHandler = (msg, des) => {
    notification.error({
      duration: 0,
      icon: <ExclamationCircleFilled style={{ color: '#F9B006' }} />,
      message: msg,
      description: des
    });
  }

  return (
    <Spin
      tip="Loading..."
      spinning={loading}
    >
      <PageHeaderWrapper
        title="一般通用"
      >
        <Card bordered={false}>
          <Row>
            <Col xs={24} md={16}>
              <DatePicker
                picker="month"
                format="YYYY_MM"
                value={selectMonth}
                onChange={(e) => {
                  getData((e) ? (e.format('YYYY-MM')) : (null));
                }}
              />
            </Col>
            <Col
              xs={24} md={8}
              style={{ textAlign: 'right' }}
            >
              <a
                href={`${REACT_APP_PUBLIC_PATH}/匯率表-2020.xlsx`}
                className={styles.om_sp_m_lb}
                style={{ marginLeft: '18px' }}
              >
                下載範本
            </a>
              <Upload
                name="files[]"
                showUploadList={false}
                action={`${window.FRONTEND_WEB}/exchange_rate/import`}
                // accept=".csv"
                method="post"
                data={() => {
                  return {
                    agent_eid: enterpriseList.agent_eid
                  }
                }}
                onChange={({ file }) => {
                  if (file.status === 'done') {
                    getData()
                    message.success(`"${file.name}" 檔案上傳成功`);
                  } else if (file.status === 'error') {
                    if (file.response && file.response.message) {
                      errHandler(`"${file.name}" 檔案上傳失敗`, file.response.message);
                    } else {
                      errHandler(`"${file.name}" 檔案上傳失敗`);
                    }
                  }
                }}
              >
                <Tooltip title="匯入檔案">
                  <UploadOutlined
                    className={`${styles.om_icon_style} ${styles.om_sp_m_lb}`}
                    style={{ marginLeft: '18px' }}
                  />
                </Tooltip>
              </Upload>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className={styles.om_sp_m_lb}
                onClick={() => {
                  setModalVisible(true);
                  formAdd.setFieldsValue({
                    month: undefined,
                    currency: undefined,
                    exchange_rate: undefined,
                  });
                }}
              >
                新增匯率
            </Button>
            </Col>
          </Row>
          <Row>
            <Col
              xs={24}
              className={styles.om_overflow_auto}
            >
              <Form form={form} component={false}>
                <Table
                  components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                  pagination={false}
                  loading={loading}
                  columns={mergedColumns}
                  dataSource={(selectMonth && list) ? (list) : ([])}
                  rowKey="id"
                />
              </Form>
            </Col>
          </Row>
        </Card>
        <Modal
          title="新增匯率"
          visible={modalVisible}
          cancelText="取消"
          okText="送出"
          onOk={() => formAdd?.submit()}
          onCancel={() => setModalVisible(false)}
          forceRender
          okButtonProps={{ disabled: loading }}
          cancelButtonProps={{ disabled: loading }}
          closable={!loading}
          width="40%"
        >
          <Form
            form={formAdd}
            onFinish={onFinish}
          >
            <Row gutter={[24, 8]}>
              <Col xs={12}>
                <Form.Item
                  name="month"
                  label="年/月"
                  rules={[
                    {
                      required: true,
                      message: '此欄位為必填',
                    },
                  ]}
                >
                  <DatePicker style={{ width: '100%' }} format='YYYY_MM' picker="month" />
                </Form.Item>
              </Col>
              <Col xs={12}>
                <Form.Item
                  name="currency"
                  label="幣別"
                  rules={[
                    {
                      required: true,
                      message: '此欄位為必填',
                    },
                  ]}
                >
                  <Select style={{ width: '100%' }} options={optCurrency} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 8]}>
              <Col xs={12}>
                <Form.Item
                  name="exchange_rate"
                  label="匯率"
                  rules={[
                    {
                      required: true,
                      message: '此欄位為必填',
                    },
                    {
                      validator(rule, values, callback) {
                        if (!valid.checkPostiveNumber(values)) {
                          callback(valid.checkPostiveNumber_msg);
                        } else {
                          callback();
                        }
                      }
                    }
                  ]}
                >
                  <InputNumber style={{ width: '100%' }} step={0.001} min={0} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    </Spin>
  );
};

export default connect(({ exchangeRateList, loading, enterpriseList }) => ({
  exchangeRateList,
  enterpriseList,
  loading: loading.models.exchangeRateList,
}))(exchangeRateList);
