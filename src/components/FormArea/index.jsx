import React, { Fragment } from 'react';
import {
  Form,
  Radio,
  Select,
} from 'antd';
import styles from '@/style/style.less';

const { Option } = Select;

const FormArea = props => {
  const {
    form,
    isLabel,
    isNameAreaRadioTypeRadio,
    isNameAreaIdInputCountrys,
    isNameAreaId,
    isNameAreaTypeSelect,
    isNameAreaIdInput2Countrys,
    isInit,
    setIsInit,
    initAuthorizedAreaList,
    authorizedAreaList,
    authorizedCountryList,
    isDisabledInput2Countrys,
    setIsDisabledInput2Countrys,
    isRequired,
    isAllDisabled,  // optional
  } = props;
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
    marginTop: '2px',
    marginBottom: '25px',
  };

  return (
    <Fragment>
      <Form.Item
        name={isNameAreaRadioTypeRadio}
        label={isLabel}
        className={(isRequired) ? (styles.addRequiredStar) : ('')}
        style={{ position: 'absolute' }}
      >
        <Radio.Group
          disabled={(isAllDisabled) ? true : false}
        >
          <Radio value="1" style={radioStyle}></Radio>
          <Radio value="0" style={radioStyle}></Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name={isNameAreaIdInputCountrys}
        style={{ marginLeft: '30px', marginTop: '30px' }}
        rules={[
          {
            validator(rule, values, callback) {
              let radioVal = form.getFieldValue()[isNameAreaRadioTypeRadio];

              if (isRequired && radioVal == '1' && (!values || (values && values.length == 0))) {
                callback('選擇此選項 "特定地區" 為必填');
              } else {
                callback();
              }
            }
          }
        ]}
      >
        <Select
          placeholder="特定地區..."
          mode="multiple"
          showSearch
          optionFilterProp="children"
          optionLabelProp="label"
          filterOption={(input, option) =>
            option.showtext.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onSelect={(value) => {
            let newObj = {};

            if (value) {
              newObj[isNameAreaRadioTypeRadio] = '1';
              form.setFieldsValue(newObj);
            }
          }}
          disabled={(isAllDisabled) ? true : false}
        >
          {authorizedCountryList.countryList.map(d => (
            <Option
              key={d.id}
              label={d.country_name_zh}
              text={d.id}
              showtext={`${d.country_name_zh} ${d.country_name_en} (${d.country_code})`}
            >
              {`${d.country_name_zh} ${d.country_name_en} (${d.country_code})`}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name={isNameAreaId}
        style={{ marginLeft: '30px', marginTop: '30px' }}
        rules={[
          {
            validator(rule, values, callback) {
              let radioVal = form.getFieldValue()[isNameAreaRadioTypeRadio];

              if (isRequired && radioVal == '0' && (!values || (values && values.length == 0))) {
                callback('選擇此選項 "自訂範圍" 為必填');
              } else {
                callback();
              }
            }
          }
        ]}
      >
        <Select
          placeholder="選擇自訂範圍"
          showSearch
          optionFilterProp="children"
          optionLabelProp="label"
          allowClear={true}
          filterOption={(input, option) =>
            option.showtext.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onFocus={() => {
            setIsInit(false);
          }}
          onSelect={(value) => {
            let newObj = {};

            if (value) {
              newObj[isNameAreaRadioTypeRadio] = '0';
              form.setFieldsValue(newObj);
            }
          }}
          disabled={(isAllDisabled) ? true : false}
        >
          {
            (isInit)
              ? (
                initAuthorizedAreaList.map(d => (
                  <Option
                    key={d.id}
                    label={d.area_name}
                    text={d.id}
                    showtext={`${d.area_name} (${d.area_code})`}
                  >
                    {`${d.area_name} (${d.area_code})`}
                  </Option>
                ))
              )
              : (
                (authorizedAreaList.list.data_list)
                  ? (
                    authorizedAreaList.list.data_list.map(d => (
                      <Option
                        key={d.id}
                        label={d.area_name}
                        text={d.id}
                        showtext={`${d.area_name} (${d.area_code})`}
                      >
                        {`${d.area_name} (${d.area_code})`}
                      </Option>
                    ))
                  )
                  : ([])
              )
          }
        </Select>
      </Form.Item>
      <div style={{ display: 'flex', marginLeft: '30px', marginTop: '30px' }}>
        <Form.Item
          name={isNameAreaTypeSelect}
          style={{ width: '30%', marginRight: '8px' }}
        >
          <Select
            options={authorizedAreaList.optAgencyAreaType}
            onSelect={(value) => {
              let newObj = {};

              if (value == '2') {
                newObj[isNameAreaIdInput2Countrys] = [];
                form.setFieldsValue(newObj);
                setIsDisabledInput2Countrys(true);
              } else {
                setIsDisabledInput2Countrys(false);
              }
            }}
            disabled={(isAllDisabled) ? true : false}
          />
        </Form.Item>
        <Form.Item
          name={isNameAreaIdInput2Countrys}
          style={{ width: '70%' }}
          rules={[
            {
              validator(rule, values, callback) {
                let radioVal = form.getFieldValue()[isNameAreaRadioTypeRadio];
                let selectVal = form.getFieldValue()[isNameAreaTypeSelect];

                if (isRequired && radioVal == '0' && selectVal != '2' && (!values || (values && values.length == 0))) {
                  callback('選擇此選項 "特定地區" 為必填');
                } else {
                  callback();
                }
              }
            }
          ]}

        >
          <Select
            disabled={
              (isAllDisabled)
                ? (true)
                : (isDisabledInput2Countrys)
            }
            placeholder="特定地區..."
            mode="multiple"
            showSearch
            optionFilterProp="children"
            optionLabelProp="label"
            filterOption={(input, option) =>
              option.showtext.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {authorizedCountryList.countryList.map(d => (
              <Option
                key={d.id}
                label={d.country_name_zh}
                text={d.id}
                showtext={`${d.country_name_zh} ${d.country_name_en} (${d.country_code})`}
              >
                {`${d.country_name_zh} ${d.country_name_en} (${d.country_code})`}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </Fragment >
  );
}

export default FormArea;