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

const FormCompanyNicknameAPI = props => {
  const {
    form,
    isLabel,
    isName,  // db: company_nickname.id
    isSelectText,
    isList,
    setIsList,
    cpCodeLabel,  // db: company.company_code
    setCpCodeLabel,
    isCompanyIdName,  // db: company.id
    isDisabled,
    changeFn,
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  let timer;

  const searchOption = (keyword) => {
    setIsFetching(true);
    clearTimeout(timer);
    timer = setTimeout(() => {
      commFn.searchOption(keyword, '/company', (res) => {
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
              if (isCompanyIdName) {
                obj[isCompanyIdName] = option.companyid;
              }
              form.setFieldsValue(obj);
              setCpCodeLabel(option.text);

              if (changeFn) {
                changeFn(option);
              }
            } else {
              obj[isSelectText] = '';
              if (isCompanyIdName) {
                obj[isCompanyIdName] = '';
              }
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
              label={d.nickname}
              text={d.company_code}
              companyid={d.company_id}
            >
              {`${d.nickname} (${d.company_code})`}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {
        (isCompanyIdName)
          ? (
            <Form.Item
              name={isCompanyIdName}
              noStyle
            >
              <Input type="hidden" />
            </Form.Item>
          )
          : (null)
      }
      <label className={styles.searchLabel}>{(cpCodeLabel) ? `(${cpCodeLabel})` : ''}</label>
    </Fragment >
  );
}

export default FormCompanyNicknameAPI;