import React, { Fragment, useState } from 'react';
import {
  Form,
  Select,
  Input,
  Spin,
} from 'antd';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const { Option } = Select;

const FormCompanyNameAPI = props => {
  const {
    form,
    isLabel,
    isName,  // db: company.id
    isSelectText,
    isList,
    setIsList,
    cpCodeLabel,  // db: company.company_code
    setCpCodeLabel,
    isDisabled,
    changeFn,
    rules,  // optional
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  let timer;

  const searchOption = (keyword) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/company/Auto', (res) => {
        setIsList(res);
        setIsFetching(false);
      });
    }, 200);
  }

  return (
    <Fragment>
      <Form.Item
        label={isLabel}
        name={isName}
        rules={rules}
      >
        <Select
          showSearch
          optionFilterProp="children"
          optionLabelProp="label"
          filterOption={false}
          allowClear={true}
          notFoundContent={isFetching ? <Spin size="small" /> : null}
          disabled={(isDisabled) ? (isDisabled) : false}
          onSearch={(value) => {
            searchOption(value);
          }}
          onChange={(value, option) => {
            let obj = {};

            // when click clearIcon, clear 'isList' data
            if (!value) {
              setIsList([]);
            }

            if (option) {
              obj[isSelectText] = option.label;
              form.setFieldsValue(obj);
              setCpCodeLabel(option.text);

              if (changeFn) {
                changeFn(option);
              }
            } else {
              obj[isSelectText] = '';
              form.setFieldsValue(obj);
              setCpCodeLabel('');
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
          {isList.map(d => (
            <Option
              key={d.id}
              label={d.name}
              text={d.company_code}
            >
              {`${d.name} (${d.company_code})`}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <label className={styles.searchLabel}>{(cpCodeLabel) ? `(${cpCodeLabel})` : ''}</label>
    </Fragment >
  );
}

export default FormCompanyNameAPI;