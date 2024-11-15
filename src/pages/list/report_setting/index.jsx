import React, { useState, useEffect, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Select,
  Spin,
  Form,
  Modal,
  Input,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';
import styles from '@/style/style.less';

const { Option } = Select;
const { TextArea } = Input;

const report_setting = props => {
  const {
    loading,
    dispatch,
    loadingReportSetting,
    loadingEnterpriseList,
    reportSettingList: { changeId, list },
    enterpriseList,
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [isEdit, setIsEdit] = useState(false);
  const [entList, setEntList] = useState([]);
  const [enterpriseVal, setEnterpriseVal] = useState('');
  const [reportList, setReportList] = useState([]);

  // api -----
  // getEnterpriseList
  const getEnterpriseList = (id) => {
    setIsEdit(false);

    dispatch({
      type: 'enterpriseList/fetchGetListAll',
      callback: (result) => {
        if (result && result.length > 0) {
          setEntList(result);

          if (id) {
            setEnterpriseVal(id);
            getReportList(id);
          } else {
            setEnterpriseVal(result[0].id);
            getReportList(result[0].id);
          }
        } else {
          setEntList([]);
          setEnterpriseVal('');
          getReportList();
        }
      }
    });
  }

  // getReportList
  const getReportList = (id) => {
    if (id) {
      dispatch({
        type: 'reportSettingList/fetchGetList',
        payload: {
          eid: id,
          agent_eid: enterpriseList.agent_eid,
        },
        callback: (result) => {
          const initData = [
            { id: '0', content: '', isName: 'id' },
            { id: '1', description: '公司名稱', content: '', isName: 'company_name', },
            { id: '2', description: '公司名稱(英)', content: '', isName: 'company_name_en', },
            { id: '3', description: '公司地址電話傳真', content: '', isName: 'company_contact', },
            { id: '4', description: '發票資料', content: '', isName: 'invoice', },
            { id: '5', description: '健保費稅率', content: '', isName: 'health_tax_rate', },
            { id: '6', description: '健保費起扣點', content: '', isName: 'health_tax_over', },
            { id: '7', description: '所得稅起扣點_本國', content: '', isName: 'income_tax_over', },
            { id: '8', description: '所得稅起扣點_外國', content: '', isName: 'income_tax_over_foreign', },
            { id: '9', description: '錄音報表聯絡人', content: '', isName: 'report_reco_contact_name', },
            { id: '10', description: '錄音報表聯絡人電話', content: '', isName: 'report_reco_contact_tel', },
            { id: '11', description: '詞曲報表聯絡人', content: '', isName: 'report_right_contact_name', },
            { id: '12', description: '詞曲報表聯絡人電話', content: '', isName: 'report_right_contact_tel', },
            { id: '13', description: '詞曲報表結算', content: '', isName: 'report_right_maker', },
            { id: '14', description: '結算人', content: '', isName: 'account_to' },
          ];

          // convert data
          for (let i in result) {
            for (let j = 0; j < initData.length; j++) {
              if (initData[j].isName == i && result[i]) {
                initData[j].content = result[i];
              }
            }
          }
          setReportList(initData);

          // formObject
          let formObject = Object.assign({}, result);
          form.setFieldsValue(formObject);
        }
      });
    } else {
      setReportList([]);
      form.setFieldsValue({});
    }
  }

  // save
  const onFinish = values => {
    let saveObj = Object.assign({}, values);

    dispatch({
      type: 'reportSettingList/fetchEditData',
      payload: { ...saveObj, agent_eid: enterpriseList.agent_eid, },
      callback: (result) => {
        if (result && result == 'ok') {
          getEnterpriseList(saveObj.id);
        }
      }
    });
  }

  useEffect(() => {
    getEnterpriseList();
  }, []);

  // ui -----
  // settingBtn
  const settingBtn = (
    <Button
      type="primary"
      className={styles.om_sp_m_lb}
      disabled={(entList && entList.length > 0) ? false : true}
      style={{ margin: 0 }}
      onClick={() => {
        setIsEdit(true);
      }}
    >
      設定
    </Button >
  );

  // table
  const columns = [
    {
      title: '名稱',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '顯示內容',
      dataIndex: 'content',
      key: 'content',
      render: (text, row, index) => {
        let outHtml = (text) ? text.replace(/\r\n|\n/g, '<br/>').replace(/\s/g, '&nbsp;') : '';

        return (<span dangerouslySetInnerHTML={{ __html: outHtml }}></span>);
      },
    },
  ];

  // confirm
  const showConfirm = () => {
    let eid = enterpriseVal;

    confirm({
      title: '',
      icon: '',
      content: '確定要取消修改嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        getEnterpriseList(eid ? eid : null);
      },
      onCancel() { },
    });
  }

  return (
    <Spin
      tip="Loading..."
      spinning={loadingReportSetting || loadingEnterpriseList}
    >
      <PageHeaderWrapper
        title="報表設定"
      >
        <Card
          bordered={false}
          className={`${styles.card} ${styles.titleNoBBd}`}
          style={{ marginBottom: '0' }}
        >
          <Row gutter={[8, 0]}>
            <Col xs={24}>
              <p style={{
                fontWeight: 700
              }}
              >
                企業名稱
            </p>
              <Select
                disabled={(isEdit) ? true : false}
                style={{ width: '200px' }}
                value={enterpriseVal}
                onChange={(val) => {
                  getEnterpriseList(val);
                }}
              >
                {
                  entList.map(d => (
                    <Option
                      key={d.id}
                      label={d.name}
                    >
                      {d.name}
                    </Option>
                  ))
                }
              </Select>
            </Col>
          </Row>
        </Card>
        <Card
          bordered={false}
          className={`${styles.card} ${styles.titleNoBBd}`}
          extra={settingBtn}
          style={{ display: (isEdit) ? 'none' : 'block' }}
        >
          <Row gutter={[8, 0]}>
            <Col
              xs={24}
              className={styles.om_overflow_auto}
            >
              <Table
                pagination={false}
                loading={loading}
                columns={columns}
                dataSource={
                  reportList.filter((elem, idx, arr) => elem.id != '0')
                }
                rowKey="id"
              />
            </Col>
          </Row>
        </Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Card
            bordered={false}
            className={`${styles.card} ${styles.titleNoBBd}`}
            style={{ display: (isEdit) ? 'block' : 'none' }}
          >
            <Row gutter={[8, 0]}>
              <Col
                xs={24}
                className={styles.om_overflow_auto}
              >

                <table className={styles.formTable}>
                  <thead>
                    <tr>
                      <th>名稱</th>
                      <th>顯示內容</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportList.map((elem, idx, arr) => {
                      return (
                        <tr
                          key={`tr_${elem.id}`}
                          style={{ display: (elem.isName != 'id') ? 'table-row' : 'none' }}
                        >
                          <td>{elem.description}</td>
                          <td>
                            <Form.Item
                              name={elem.isName}
                            >
                              {
                                (elem.isName != 'invoice')
                                  ? (<Input />)
                                  : (<TextArea rows={6} />)
                              }

                            </Form.Item>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </Col>
            </Row>
            <Row>
              <Col
                xs={24}
                className={styles.om_txt_align_r}
              >
                <Button
                  className={styles.om_sp_m_lt}
                  onClick={showConfirm}
                >
                  取消
                </Button>
                <Button
                  className={styles.om_sp_m_lt}
                  type="primary"
                  onClick={() => form?.submit()}
                >
                  送出
                </Button>
              </Col>
            </Row>
          </Card>
        </Form>
      </PageHeaderWrapper>
    </Spin>
  );
}

export default connect(({ reportSettingList, loading, enterpriseList }) => ({
  reportSettingList,
  enterpriseList,
  loadingReportSetting: loading.models.reportSettingList,
  loadingEnterpriseList: loading.models.enterpriseList,
}))(report_setting);