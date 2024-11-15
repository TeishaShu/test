import React, { useState, Fragment } from 'react';
import {
  Form,
  Select,
  Spin,
} from 'antd';
import commFn from '@/fn/comm';

const { Option } = Select;

const FormNextContractAPI = props => {
  const {
    form,
    isLabel,
    isName,
    isSelectText,
    isList,
    setIsList,
    isDisabled,
    isInfoContractCode,
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  let timer;

  const searchOption = (keyword) => {
    return new Promise((resolve, reject) => {
      setIsFetching(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        commFn.searchOption(keyword, '/Contract_author/contracts', (res) => {
          setIsList(res);
          setIsFetching(false);
          resolve(res);
        });
      }, 200);
    });
  }

  return (
    <Fragment>
      <Form.Item
        label={isLabel}
        name={isName}
      >
        <Select
          disabled={isDisabled}
          showSearch
          optionFilterProp="children"
          optionLabelProp="label"
          filterOption={false}
          allowClear
          notFoundContent={isFetching ? <Spin size="small" /> : null}
          onSearch={(value) => {
            searchOption(value);
          }}
          onChange={(value, option) => {
            const obj = {};

            // when click clearIcon, clear 'isList' data
            if (!value) {
              setIsList([]);
            }

            if (option) {
              obj[isSelectText] = option.label;
              form.setFieldsValue(obj);
            } else {
              obj[isSelectText] = '';
              form.setFieldsValue(obj);
            }
          }}
          onFocus={() => {
            setIsList([]);
            searchOption(form.getFieldValue()[isSelectText]);
          }}
          onSelect={(value, option) => {
            searchOption(option.label);
          }}
        >
          {isList.filter(fD => {
            return (isInfoContractCode && fD.contract_code)
              ? (isInfoContractCode.toLowerCase() != fD.contract_code.toLowerCase())
              : true
          }).map(d => (
            <Option
              key={d.id}
              label={d.contract_code}
            >
              {d.contract_code}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Fragment >
  );
}

export default FormNextContractAPI;
