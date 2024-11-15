import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Radio,
} from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import commFn from '@/fn/comm';
import valid from '@/fn/valid';

const { Option } = Select;
const { RangePicker } = DatePicker;

export const ComReportOpModal = props => {
  const [form] = Form.useForm();
  const {
    loading,
    visible,
    editItem,
    onCancel,
    onSubmit,
    settlePhaseOpt,
    exchangeRateList,
    authorizedCountryList,
  } = props;
  const dateFormat = 'YYYY-MM';
  const [isTaxInclude, setIsTaxInclude] = useState('0');

  // api -----
  // hide to reset
  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [visible]);

  // edit to set data
  useEffect(() => {
    if (editItem) {
      let tmpUiDatePhase = null;
      let tmpIsTaxIncluded = (editItem.is_tax_included) ? (editItem.is_tax_included) : ('0');

      setIsTaxInclude(tmpIsTaxIncluded);
      if (editItem.data_phase_start && editItem.data_phase_end) {
        tmpUiDatePhase = [moment(editItem.data_phase_start), moment(editItem.data_phase_end)];
      }

      form.setFieldsValue({
        ...editItem,
        is_tax_included: tmpIsTaxIncluded,
        ui_data_phase: tmpUiDatePhase,
        // (commFn.convertQuarterToDate(editItem.data_phase))
        //   ? (commFn.convertQuarterToDate(editItem.data_phase).map((elem) => moment(elem)))
        //   : (null)
      });
    }
  }, [editItem]);

  // valid -----
  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = values => {
    let saveObj = {
      ...values,
      file_list_id: editItem.file_list_id
    };
    let tmpDatePhaseStart = '';
    let tmpDatePhaseEnd = '';

    if (saveObj.ui_data_phase) {
      tmpDatePhaseStart = saveObj.ui_data_phase[0].format(dateFormat) + '-01';
      tmpDatePhaseEnd = saveObj.ui_data_phase[1].format(dateFormat) + '-' + commFn.getMonthLastDay(saveObj.ui_data_phase[1].format(dateFormat));
    }
    saveObj.data_phase_start = tmpDatePhaseStart;
    saveObj.data_phase_end = tmpDatePhaseEnd;
    saveObj.tax_rate = (saveObj.is_tax_included == '1') ? (saveObj.tax_rate) : ('');
    delete saveObj.ui_data_phase;

    if (onSubmit) {
      onSubmit(saveObj);
    }
  };

  // ui -----
  const modalForm = () => {
    return (
      <Form
        form={form}
        onFinish={handleFinish}
      >
        <Row gutter={[8, 0]}>
          <Col span={12}>
            <Form.Item
              name="settle_phase_id"
              label="計算期別"
            >
              <Select
                options={settlePhaseOpt}
                disabled={true}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="currency_id"
              label="幣別"
              rules={[
                { required: true, message: '此欄位為必填' },
              ]}
            >
              <Select
                options={exchangeRateList.optCurrency}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col span={12}>
            <Form.Item
              name="ui_data_phase"
              label="資料期別"
              rules={[
                { required: true, message: '此欄位為必填' },
              ]}
            >
              <RangePicker
                format={dateFormat}
                picker="month"
                allowClear={true}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="is_tax_included"
              label="含稅"
              rules={[
                { required: true, message: '此欄位為必填' },
              ]}
            >
              <Radio.Group
                options={[
                  { label: '是', value: '1' },
                  { label: '否', value: '0' },
                ]}
                onChange={(e) => {
                  setIsTaxInclude(e.target.value);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 0]}>
          <Col span={12}>
            <Form.Item
              name="country"
              label="地區(報表分拆)"
            >
              <Select
                options={
                  (authorizedCountryList.countryList)
                    ? ([{ value: 'WW', label: '全世界 (WW)' }, ...authorizedCountryList.countryList.map((elem) => ({ value: elem.country_code_short, label: `${elem.country_name_zh} (${elem.country_code_short})` }))])
                    : ([])
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="tax_rate"
              label="稅率"
              rules={[
                {
                  validator(rule, values, callback) {
                    let result = true;
                    let formIsTaxIncluded = form.getFieldsValue().is_tax_included;

                    if (formIsTaxIncluded == '1') {
                      result = valid.checkRequired(values);
                    }

                    if (result != false) {
                      callback();
                    } else {
                      callback(valid.checkRequired_msg);
                    }
                  }
                },
              ]}
            >
              <Input
                disabled={(isTaxInclude != '1') ? (true) : (false)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  };

  return (
    <Modal
      width={650}
      title="新媒體報表設定"
      visible={visible}
      cancelText="取消"
      okText="送出"
      onOk={handleSubmit}
      onCancel={onCancel}
      forceRender={true}
      okButtonProps={{ disabled: loading }}
      cancelButtonProps={{ disabled: loading }}
      closable={!loading}
    >
      {modalForm()}
    </Modal>
  );
}

export default connect(({ exchangeRateList, authorizedCountryList, loading }) => ({
  exchangeRateList,
  authorizedCountryList,
  loading: loading.effects['settleMediaList/fetchReportSetting'],
}))(ComReportOpModal);